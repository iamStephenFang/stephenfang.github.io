---
title: iOS14 & iOS 15 相册适配
pubDatetime: 2022-01-20 17:10:20
categories: 
- 技术
tags: 
- iOS
- Photo
- Objective-C
- Swift
- iOS 15
- iOS 14
description: 开发迭代为了解决测试提出的「选中的照片」权限适配问题，花时间研究了[Handle the Limited Photos Library in your app](https://developer.apple.com/videos/play/wwdc2020/10641) 和 [Meet the new Photos picker](https://developer.apple.com/videos/play/wwdc2020/10652/?time=841) session，整理需求内容汇总并实现，同时还解决了一处 iOS 15.2 下可能导致崩溃的相册权限问题。
---


<!--more-->

# 崩溃问题

> 15.2 系统版本下在使用调用本地相册相关的功能后（上传作品、更换头像、歌房玩法公屏...） app 就会卡死。
> 

---

**思路**：按照给出的路径进行复现，发现在给予相册访问权限以后无法复现该问题，但是在相册权限为**`PHAuthorizationStatusNotDetermined`**（第一次选择本地相册弹框选择「选中的照片」）以及**`PHAuthorizationStatusDenied`** （不给予相册权限）会出现长达数十秒的卡顿和崩溃，点击暂停执行可以看到主线程被blocked了正在等待。

![POPO20220118-144240.jpg](http://image.stephenfang.me/mweb/POPO20220118-144240.jpg)

回到图片框架上，MZAssetsLibrary在init后执行了`[PHPPhotoLibrary registerChangeObserver:]`，于是有理由怀疑是不是这一行代码相关的API执行了变动。

![Untitled](http://image.stephenfang.me/mweb/Untitled.png)

在苹果开发者论坛找到了答案：

[ios 15.2 beta app stuck](https://developer.apple.com/forums/thread/696131)

在 iOS 15.2 之前使用`[PHPPhotoLibrary registerChangeObserver:]`通知不需要相册权限，然而在 iOS 15.2 之后 Apple 新增了应用隐私报告，添加了该方法的相册权限前提。

---

**解决方案**：先注册相册请求，在获取到权限之后针对可访问的相册权限注册该通知，如`PHAuthorizationStatusAuthorized`、`PHAuthorizationStatusLimited`，但是需要涉及到旧版本的权限兼容，于是引出了权限适配方案。

# 相册权限适配

## 简述

在 iOS 13 及以前，当用户首次访问应用程序时，会被要求开放大量权限，比如相册、定位、联系人，实际上该应用可能仅仅需要一个选择图片功能，却被要求开放整个照片库的权限，这确实是不合理的。

在 iOS 14 中引入了 “LimitedPhotos Library” 的概念，用户可以授予应用访问其一部分的照片，对于应用来说，仅能读取到用户选择让应用来读取的照片。

![Xnip2022-01-06_21-34-51.jpg](http://image.stephenfang.me/mweb/Xnip2022-01-06_21-34-51.jpg)

![Untitled](http://image.stephenfang.me/mweb/Untitled 1.png)

具体体现在

1. 授权弹窗中增加了 Select Photo 选项。用户可以在 App 请求调用相册时选择部分照片让 App 读取。从 App 的视⻆来看，你的相册里就只有这几张照片，App 无法得知其它照片的存在。
2. 当用户选择权限为`PHAuthorizationStatusLimited`如果未适配，可能会在每次触发相册功能时都弹窗询问用户是否需要修改照片权限。可通过在 Info.plist 设置`PHPhotoLibraryPreventAutomaticLimitedAccessAlert`为 `YES` 来阻止该弹窗反复弹出

## API 改变

从开发适配的角度，需要关注新的请求权限和请求权限的方法。

列举出的请求权限共以下几种，其中`PHAuthorizationStatusLimited`的注释中给出了适配方法。

```objectivec
typedef NS_ENUM(NSInteger, PHAuthorizationStatus) {
    PHAuthorizationStatusNotDetermined = 0, // User has not yet made a choice with regards to this application
    PHAuthorizationStatusRestricted,        // This application is not authorized to access photo data.
                                            // The user cannot change this application’s status, possibly due to active restrictions
                                            //   such as parental controls being in place.
    PHAuthorizationStatusDenied,            // User has explicitly denied this application access to photos data.
    PHAuthorizationStatusAuthorized,        // User has authorized this application to access photos data.
    PHAuthorizationStatusLimited API_AVAILABLE(ios(14)), // User has authorized this application for limited photo library access. Add PHPhotoLibraryPreventAutomaticLimitedAccessAlert = YES to the application's Info.plist to prevent the automatic alert to update the users limited library selection. Use -[PHPhotoLibrary(PhotosUISupport) presentLimitedLibraryPickerFromViewController:] from PhotosUI/PHPhotoLibrary+PhotosUISupport.h to manually present the limited library picker.
};
```

请求权限的方法也得到了更新，需要注意的是

- 只有使用新的`requestAuthorizationForAccessLevel:(PHAccessLevel)accessLevel` 方法才能正确获取到  `PHAuthorizationStatusLimited` 权限
- 如果使用以前的API来获取权限状态，`PHAuthorizationStatusLimited` 状态下返回`PHAuthorizationStatusAuthorized`
- 在请求权限的时候需要给予读写权限参数`PHAccessLevel`，可选值为`PHAccessLevelAddOnly` 与 `PHAccessLevelReadWrite`，仅在`PHAccessLevelReadWrite` 下才能够获取到`PHAuthorizationStatusLimited` 权限

```objectivec
#pragma mark - Library access authorization status

/// Replaces \c +authorizationStatus to support add-only/read-write access level status
+ (PHAuthorizationStatus)authorizationStatusForAccessLevel:(PHAccessLevel)accessLevel API_AVAILABLE(macosx(11.0), ios(14), tvos(14));
+ (void)requestAuthorizationForAccessLevel:(PHAccessLevel)accessLevel handler:(void(^)(PHAuthorizationStatus status))handler API_AVAILABLE(macosx(11.0), ios(14), tvos(14)) NS_SWIFT_ASYNC(2);

/// Deprecated and replaced by authorizationStatusForAccessLevel:, will return \c PHAuthorizationStatusAuthorized if the user has chosen limited photo library access
+ (PHAuthorizationStatus)authorizationStatus API_DEPRECATED_WITH_REPLACEMENT("+authorizationStatusForAccessLevel:", ios(8, API_TO_BE_DEPRECATED), macos(10.13, API_TO_BE_DEPRECATED), tvos(10, API_TO_BE_DEPRECATED));
+ (void)requestAuthorization:(void(^)(PHAuthorizationStatus status))handler API_DEPRECATED_WITH_REPLACEMENT("+requestAuthorizationForAccessLevel:handler:", ios(8, API_TO_BE_DEPRECATED), macos(10.13, API_TO_BE_DEPRECATED), tvos(10, API_TO_BE_DEPRECATED));

typedef NS_ENUM(NSInteger, PHAccessLevel) {
    PHAccessLevelAddOnly = 1,
    PHAccessLevelReadWrite = 2,
} API_AVAILABLE(macos(11.0), ios(14), tvos(14));
```

针对业务需求对代码进行了部分重构，原代码采用if-else结构进行控制，还需要判断iOS版本结构会过于混乱。

```objectivec
void (^setUpUI)(PHAuthorizationStatus status) = ^(PHAuthorizationStatus status){
            switch (status) {
                case PHAuthorizationStatusNotDetermined: {
                    break;
                }
                case PHAuthorizationStatusAuthorized:
                case PHAuthorizationStatusLimited: {
                    [self.library registerChangeObserver:self];
                    loadCollections();
                    break;
                }
                case PHAuthorizationStatusDenied:
                case PHAuthorizationStatusRestricted: {
                    notAllowed();
                    break;
                }
                default: {
                    notAllowed();
                    break;
                }
            }
        };
        
        if (status == PHAuthorizationStatusNotDetermined) {
            if (@available(iOS 14, *)) {
                [PHPhotoLibrary requestAuthorizationForAccessLevel:PHAccessLevelReadWrite handler:^(PHAuthorizationStatus status) {
                    dispatch_async(dispatch_get_main_queue(), ^{
                        setUpUI(status);
                    });
                }];
            } else {
                [PHPhotoLibrary requestAuthorization:^(PHAuthorizationStatus status) {
                    dispatch_async(dispatch_get_main_queue(), ^{
                        setUpUI(status);
                    });
                }];
            }
        } else {
            setUpUI(status);
        }
```

---

![Untitled](http://image.stephenfang.me/mweb/Untitled 2.png)

若要在应用内唤起访问系统受限相册的选择面板需要调用以下API，并且监听图片变化做相应处理。

```objectivec
- (void)presentLimitedLibraryPickerFromViewController:(UIViewController *)controller;
```

在 iOS 15 中还针对以上API提供了回调。

```objectivec
- (void)presentLimitedLibraryPickerFromViewController:(UIViewController *)controller 
                                    completionHandler:(void (^)(NSArray<NSString *> *))completionHandler;
```

## 视觉适配

找视觉沟通前研究了微信和微博如何做适配，可以说微博的适配方案加上了引导体验更加完整。

![6ce25100-2cea-41de-8867-04ff5aa4acf4.jpg](http://image.stephenfang.me/mweb/6ce25100-2cea-41de-8867-04ff5aa4acf4.jpg)

![e9aab135-4eb6-489b-af70-3d1664354d2f.jpg](http://image.stephenfang.me/mweb/e9aab135-4eb6-489b-af70-3d1664354d2f.jpg)

目前音街相册实现效果如下图所示。

![Untitled](http://image.stephenfang.me/mweb/Untitled 3.png)

![Untitled](http://image.stephenfang.me/mweb/Untitled 4.png)

# 照片选择器

在 iOS 14 中官方推荐使用 `PhotosUI` 框架下的 `PHPicker` 来替代 `UIImagePickerController` 进行图片选择。

`PHPicker` 为独立进程，会在视图最顶层进行展示，应用内无法对其进行截图也无法直接访问到其内的数据，同时在功能上支持多选，支持搜索，支持按图片、视频、LivePhotos进行筛选

`UIImagePickerViewController` 功能受限，每次只能选择一张图片，将逐渐被废弃，同时`UIImagePickerController` 中三个 `sourceType`两个被废弃，只留下 `camera`。

## 功能一览

- 支持缩放
    
    ![IMG_9246.PNG](http://image.stephenfang.me/mweb/IMG_9246.png)
    
- 支持搜索
    
    ![IMG_9248.PNG](http://image.stephenfang.me/mweb/IMG_9248.png)
    
- 支持分类
    
    ![IMG_9247.PNG](http://image.stephenfang.me/mweb/IMG_9247.png)
    

## 调用方法

在调用方法上，需要首先声明 `PHPickerConfiguration` 并进行配置，再将其传递给`PHPickerViewController` 完成调用。

```objectivec
PHPickerConfiguration *config = [[PHPickerConfiguration alloc] init];
config.selectionLimit = 3;  // 可选择的资源数量，0表示不设限制，默认为1
config.filter = [PHPickerFilter imagesFilter]; // 只显示图片，默认全选，可选择imagesFilter、livePhotosFilter、videosFilter
config.preferredAssetRepresentationMode = PHPickerConfigurationAssetRepresentationModeCurrent; // 如果要获取视频最好设置该属性，避免系统对视频进行转码

PHPickerViewController *pickerViewController = [[PHPickerViewController alloc] initWithConfiguration:config];
pickerViewController.delegate = self;
[self presentViewController:pickerViewController animated:YES completion:nil];
```

![Untitled](http://image.stephenfang.me/mweb/Untitled 5.png)

---

`PHPickerConfiguration`、`PHPickerFilter` 和 `PHPickerResult` 都是作为结构体而不是作为类桥接到 Swift 中，从`PHPickerViewController` 返回使用`NSItemProvider`,与 `UIImagePickerController` 不同

```objectivec
-(void)picker:(PHPickerViewController *)picker didFinishPicking:(NSArray<PHPickerResult *> *)results{
   [picker dismissViewControllerAnimated:YES completion:nil];
    
   for (PHPickerResult *result in results) {
      // Get UIImage
      [result.itemProvider loadObjectOfClass:[UIImage class] completionHandler:^(__kindof id<NSItemProviderReading>  _Nullable object, NSError * _Nullable error) {
         if ([object isKindOfClass:[UIImage class]]) {
            dispatch_async(dispatch_get_main_queue(), ^{
               NSLog(@"Selected image: %@", (UIImage*)object);
            });
         }
      }];
   }
}
```

## 存在问题

- 加载 iCloud 资源时没有进度回调
- 不支持图片编辑（比如选择头像要将图片裁剪成圆形）

# 引用

[Handle the Limited Photos Library in your app](https://developer.apple.com/videos/play/wwdc2020/10641) 

[Meet the new Photos picker](https://developer.apple.com/videos/play/wwdc2020/10652/?time=841)

[Delivering an Enhanced Privacy Experience in Your Photos App](https://developer.apple.com/documentation/photokit/delivering_an_enhanced_privacy_experience_in_your_photos_app?language=objc)

[The Complete Guide to PHPicker API in iOS 14](https://www.appcoda.com/phpicker/)

[新零售淘系技术 - iOS14 隐私适配及部分解决方案](https://developer.aliyun.com/article/768114)

[RayJiang97-为什么不推荐使用 PHPicker](https://juejin.cn/post/6881513652176814093)