---
title: iOS 图像处理 App - OpenCV 与 Swift 开发
pubDatetime: 2020-07-01 09:20:20
categories:
  - 技术
tags:
  - iOS
  - OpenCV
  - Swift
copyright: true
description: 本篇内容主要包含在 iOS 项目项目中添加 OpenCV 库、Objective-C++ 与 Swift 的结合使用，及桥接文件的添加等等，为 OpenCV 系列的第四篇文章。
---

## 目的

本学期选修了 OpenCV 相关课程，最后课程设计为完成一个图像去雾功能的小程序。作为一个具备 iOS 相关基础的程序员，我没有选用老师推荐的 Qt 平台，而是选择在 iOS 平台上实现算法的应用。最终实现效果还不错，而其中去雾算法参考了何凯明博士的论文[Kaiming He. Single Image Haze Removal Using Dark Channel Prior](http://kaiminghe.com/publications/cvpr09.pdf)，不在本文的讨论范畴，本文主要对Objective-C++ 与 Swift 的结合开发做一个总结。

## 环境

- Swift 5
- iOS 13.4
- Xcode 11.5
- OpenCV Framework 4.3.0

## 配置

OpenCV Package 可以通过以下两种方式添加到 iOS 项目当中：

1. 使用 CocoaPods 添加
   Profile 中添加 OpenCV：

```
target 'Haze-Free' do
  use_frameworks!
  pod 'OpenCV'
end
```

2.自行下载并添加
在官网下载相应版本的[iOS Pack](https://opencv.org/releases/)，解压后得到一个 opencv2.framework 库，创建项目并右键添加文件到项目。

## 桥接

OpenCV 框架由 C++ 进行编码，通过将 C++ 代码插入 Objective-C 就成为了 Objective-C++ 代码。但是 Swift 本身与 Objective-C / Objective-C++ 并不兼容，所以需要一个Bridging Header 将 OpenCV 的功能接口暴露给 Swift。
以下为简单的示意图。
![](https://image.stephenfang.me/mweb/opencv_bridge.png)

添加一个 Objective-C 文件到项目中将其命名为“OpenCvWrapper”，包含`OpenCvWrapper.h`与`OpenCvWrapper.m`两个文件，需要将文件扩展名“.m”改为“.mm”。如果自动弹出提示是否添加 Bridging-Header 文件选择添加；如果没有提示，则手动添加一个 Bridging-Header 文件，即添加一个头文件（Header file），重命名为“项目名-Bridging-Header.h”（本例中为：Haze-Free-Bridging-Header.h），部分项目结构图如下。
![](https://image.stephenfang.me/mweb/opencv_bridgeh.png)

## 业务逻辑

如果你对 C++ 和 Objective-C 有一定了解，那完全能够理解以下的步骤。
其中 Bridging-Header 对 Objective-C++ 类及方法进行定义，而 OpenCVWrapper 主要面向具体定义的类及方法实现。
假设我需要对图片进行灰度化处理，需要调用的 OpenCV 函数为

```c++
cvtColor(source, target, COLOR_BGR2GRAY);
```

我尝试在`OpenCvWrapper.h`中声明实现的方法。

```c++
+(UIImage *) makeGary: (UIImage *) image;
```

显然 Swift 无法接受 Mat 类型的数据，若需要对图像进行处理并在 View 中显示，需要的是ImageView 获取到 image，换言之，我们需要进行 UIImage 与 Mat 之间的类型转换，而 OpenCV iOS 框架中就做了这样的事情。所以我们的`OpenCvWrapper.mm`看起来会是这样。

```c++
#import <opencv2/opencv.hpp>
#import <opencv2/imgcodecs/ios.h>
#import "OpenCvWrapper.h"

using namespace cv;

@implementation OpenCvWrapper

+(UIImage *) makeGary: (UIImage *) image
{
    Mat source,target;
    UIImageToMat(image,source);

    if(source.channels() == 1) return image;
    cvtColor(source, target, COLOR_BGR2GRAY);

    return MatToUIImage(target);
}
@end
```

接下来需要做的事情就轻车熟路了，只需要通过`OpenCvWrapper.makeGary(image)`方法即可返回一个经过处理的 UIImage 对象。

## 改进

我给予了 Haze-Free 图像处理App三种图像处理功能，分别是去雾、灰度化与中值滤波，考虑到处理图像本身需要一定的等待时间，我添加了 UIActivityIndicatorView 并放置了一个无法交互的 UIView 在需要的时候出现，同时 GCD 也可以加以运用，以下为部分改进后的代码。

```swift
    private let queue = DispatchQueue(label: "process-queue", qos: .userInitiated)

    enum ProcessType {
        case toGrayScale, toHazeFree, toSoftFilter
    }

   override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        self.loadingOverlayView.isHidden = true
    }

    @IBAction func toGrayScale(_ sender: Any) {
        processImage(withType: .toGrayScale)
    }

    @IBAction func toHazeFree(_ sender: Any) {
        processImage(withType: .toHazeFree)
    }

    @IBAction func toSoftFilter(_ sender: Any) {
        processImage(withType: .toSoftFilter)
    }

    private func processImage(withType type: ProcessType) {
        self.loadingOverlayView.isHidden = false
        let image = self.demoImageView.image!
        queue.async {
            let processed: UIImage
            switch type {
            case .toHazeFree:
                processed = OpenCvWrapper.hazeFree(image)
            case .toSoftFilter:
                processed = OpenCvWrapper.softFilter(image)
            case .toGrayScale:
                processed = OpenCvWrapper.makeGary(image)
            }
            self.processed = processed
            DispatchQueue.main.async {
                self.performSegue(withIdentifier: "SavingPhoto", sender: nil)
            }
        }
    }
```

## 错误

在写 App 的过程中遇到了一个重大问题，去雾算法验证无误后始终无法得到正确的去雾图像，于是开始对去雾步骤中所有的阶段性图像打断点，一一验证得到的图像结果。最后根据StackOverFlow 上的解释以及断点结果查明了原因，原因出在 `UIImageToMat` 方法返回的Mat 类型上。
![](https://image.stephenfang.me/mweb/opencv_debug.png)
`UIImageToMat` 方法返回的Mat类型为 `CV_8UC4`，而程序中需要的 Mat 格式为 `CV_8UC3`，需要使用`cvtColor()` 方法对其进行转换，改正后程序正常运行。
在使用 SFSymbols 时遇到了一些bug，UIButton的 image 使用 SFSymbol出现了无法显示Background 的问题，Debug View Hierarchy也看不出来名堂，最后只好换了自定义的icon。
![](https://image.stephenfang.me/mweb/opencv_symbol.png)

## App 总结

### UI总结

研究了iOS的设计原则后，针对该程序设计了以下页面，包含欢迎页面、权限获取页面、图像浏览页面、图像处理页面与图像分享页面，尽最大程度减少不同页面之间的耦合，使整体的页面逻辑更加清晰。
![](https://image.stephenfang.me/mweb/opencv_privacy.png)
在对iOS开发框架进行实践后，为 App 增加了中值滤波和灰度转换的功能，同时嵌入了Unsplash 获取图像的SDK，使得程序不仅能够从相册、相机获取图像，还能够直接从 Unsplash 无版权图像网站通过关键字检索获取图像。同时新增了图像分享的入口。为了适应新的变化将页面进行了部分重组，使其更加符合开发需求。
![](https://image.stephenfang.me/mweb/opencv_storyboard.png)
未来可能会考虑将该项目进行开源，现阶段仍然希望其具备更多的功能，以下为软件的运行测试。

### 页面逻辑

![](https://image.stephenfang.me/mweb/opencv_logic.png)

- 开启App后进入引导页面，提示用户使用该App需遵守相关用户协议。
- 点击开始处理后跳转至第二个页面，页面显示提示需要选择图像
- 点击选择图像后，用户需要在三种图像获取图形中做出选择，或选择取消

### 运行测试

![](http://image.stephenfang.me/mweb/opencv_demo.png)

- 处理相册图片实例，点选最近拍摄的照片，程序在本视图中加载此图像
- 点击三个处理按钮中的最右者，即中值滤波效果，视图会进行跳转
- 新的视图包含了保存和分享图像的功能，若点击保存，程序会将图像写入相册并告知用户

![](https://image.stephenfang.me/mweb/opencv_share.png)

- 尝试从相册加载一张新图像，可以看到图像中的树林被雾霾覆盖
- 点击最左侧的去雾操作，由于去雾操作运算量较大，并且为了避免用户在运算过程中点按按钮，整个可操作区域不可点按，同时有活动指示环展示加载进度
- 需要注意的是三个图像操作都采用了多线程的方式
- 处理完成图像后可以点击分享按钮使用系统内建的分享服务进行图像的分享

![](https://image.stephenfang.me/mweb/opencv_save.png)

- 尝试从相机拍摄一张图像
- 点击拍摄按钮后图像被获取，可以使用该图像进行处理
- 在视图中加载图像后尝试点击中间的灰度化图像处理
- 图像灰度化操作完成可以预览效果和保存、分享

## 参考

[1] Kaiming He. Single Image Haze Removal Using Dark Channel Prior [D]. 2009,CVPR
[2] Alexander Shishkov, Kirill Kornyakov. Instant OpenCV for iOS (English Edition) [M]. Packt Publishing, 2013
[3] Matthijs Hollemans. The iOS Apprentice [M]. Razeware LLC, 2014
