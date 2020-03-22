---
title: 在Mac上配置OpenCV与Xcode开发环境
date: 2020-02-26 16:20:20
categories: 
- tech
tags: 
- OpenCV
- Xcode
- Apple
copyright: true
---

下学期选了数字图像处理课程，接下来的`OpenCV`学习过程我会从零开始记录，第零课是开发环境的配置。

由于笔者使用的是Mac，相较于`C++`，笔者的`Python`功底不是很扎实，所以使用Xcode与`C++`实践`OpenCV`项目。在网络上搜寻了许多关于`OpenCV`与 Xcode 开发环境的配置资料均不是很完善,于是决定自己写一篇，希望对 Mac 用户有所帮助。

## 准备工作

### 1.安装 Xcode

{% asset_img Xcode.png %}

从 App Store 安装 Xcode。目前 Xcode（11.3）的安装后大小约为19 GB，因此可能需要近半小时的下载与安装时间，具体取决于互联网速度与设备运行速度。

### 2.安装 Homebrew

[Homebrew](https://brew.sh/) 是 Mac 上必备的包管理工具，诸多优点不复赘述。
如果你还没有安装过 [Homebrew](https://brew.sh/) ，只需打开任意终端并粘贴以下代码并回车即可完成安装。

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

### 3.安装 OpenCV
完成 Homebrew 的安装后， 即可使用`brew`命令完成`OpenCV`的安装部署。

```
brew install opencv
```

### 4.安装 pkg-config

`pkg-config`是在编译应用程序和库时使用的辅助工具，可以帮助我们找到找到正确的OpenCV 链接器符号 (Linker Flags) ，在后续的步骤中会用到。
你需要使用如下命令完成对`pkg-config`的安装。

```
brew install pkg-config
```

### 5.使用 pkg-config

查看您的`opencv.pc`文件所在位置，一般`opencv.pc`文件所在位置为

```
/usr/local/Cellar/opencv/<版本号>/lib/pkgconfig/opencv.pc
```

如我安装的最新版本`OpenCV`的相关`opencv.pc`文件在
```
/usr/local/Cellar/opencv/4.2.0_1/lib/pkgconfig/opencv.pc
```

使用下面的命令查看`OpenCV`的链接器符号 (Linker Flags) ，请务必修改其中的版本信息。
```
pkg-config --cflags --libs /usr/local/Cellar/opencv/<版本号>/lib/pkgconfig/opencv.pc
```

你会得到类似于如下的输出结果，我们需要参照输出结果在 Xcode 中进行配置。

```
-I/usr/local/Cellar/opencv/4.2.0_1/include/opencv4/opencv -I/usr/local/Cellar/opencv/4.2.0_1/include/opencv4 -L/usr/local/Cellar/opencv/4.2.0_1/lib -lopencv_gapi -lopencv_stitching -lopencv_aruco -lopencv_bgsegm -lopencv_bioinspired -lopencv_ccalib -lopencv_dnn_objdetect -lopencv_dnn_superres -lopencv_dpm -lopencv_highgui -lopencv_face -lopencv_freetype -lopencv_fuzzy -lopencv_hfs -lopencv_img_hash -lopencv_line_descriptor -lopencv_quality -lopencv_reg -lopencv_rgbd -lopencv_saliency -lopencv_sfm -lopencv_stereo -lopencv_structured_light -lopencv_phase_unwrapping -lopencv_superres -lopencv_optflow -lopencv_surface_matching -lopencv_tracking -lopencv_datasets -lopencv_text -lopencv_dnn -lopencv_plot -lopencv_videostab -lopencv_videoio -lopencv_xfeatures2d -lopencv_shape -lopencv_ml -lopencv_ximgproc -lopencv_video -lopencv_xobjdetect -lopencv_objdetect -lopencv_calib3d -lopencv_imgcodecs -lopencv_features2d -lopencv_flann -lopencv_xphoto -lopencv_photo -lopencv_imgproc -lopencv_core
```

## 配置 Xcode

### 6.创建 Xcode 项目

在正式运行 OpenCV C++代码之前，首先需要在 Xcode 中创建一个空的`C++`项目。具体创建过程不在这里叙述。

{% asset_img Project.png %}

需要注意的是项目的 *Language* 应选择为 C++。

### 7.设置 Header Search Paths

{% asset_img Headers.png %}

在 Xcode 中设置 *Header Search Paths*，先单击 Xco​​de 项目，然后点击 *Build Settings*，然后搜索“Header Search Paths”。将 *Header Search Paths* 路径设置为刚才得到的输出结果“-I”之后的路径，如我需要对如下路径进行添加。

```
/usr/local/Cellar/opencv/4.2.0_1/include/opencv4/opencv 
/usr/local/Cellar/opencv/4.2.0_1/include/opencv4
```

### 8.设置 Library Search Paths

{% asset_img Library.png %}

类似地，在 *Build Settings* 中搜索“Library Search Paths”，将 *Library Search Paths* 路径设置为刚才得到的输出结果“-L”之后的路径，如我需要对如下路径进行添加。

```
/usr/local/Cellar/opencv/4.2.0_1/lib 
```

### 9.设置 Other Linker Flags

{% asset_img linker.png %}

同样，在 *Build Settings* 中搜索“Other Linker Flags”，将 *Other Linker Flags* 路径设置为刚才得到的输出结果中的其他内容，即 Linker Flags，我需要对如下 Linker Flags 进行添加。（无需手动输入，只需单击输入框粘贴相关内容）

```
 -lopencv_gapi -lopencv_stitching -lopencv_aruco -lopencv_bgsegm -lopencv_bioinspired -lopencv_ccalib -lopencv_dnn_objdetect -lopencv_dnn_superres -lopencv_dpm -lopencv_highgui -lopencv_face -lopencv_freetype -lopencv_fuzzy -lopencv_hfs -lopencv_img_hash -lopencv_line_descriptor -lopencv_quality -lopencv_reg -lopencv_rgbd -lopencv_saliency -lopencv_sfm -lopencv_stereo -lopencv_structured_light -lopencv_phase_unwrapping -lopencv_superres -lopencv_optflow -lopencv_surface_matching -lopencv_tracking -lopencv_datasets -lopencv_text -lopencv_dnn -lopencv_plot -lopencv_videostab -lopencv_videoio -lopencv_xfeatures2d -lopencv_shape -lopencv_ml -lopencv_ximgproc -lopencv_video -lopencv_xobjdetect -lopencv_objdetect -lopencv_calib3d -lopencv_imgcodecs -lopencv_features2d -lopencv_flann -lopencv_xphoto -lopencv_photo -lopencv_imgproc -lopencv_core
```

### 9.测试运行
配置到这一步 Xcode 相关内容已经结束。可以尝试运行简单的`OpenCV`程序判断是否能够正常运行，以下给出简单的示例程序，功能仅为打开图片与退出。

你需要按照后文中“使用相对路径”方法配置相对路径并添加图片`test.jpeg`到项目文件夹。

```cpp
#include<opencv2/opencv.hpp>
#include <iostream>

using namespace cv;
using namespace std;

int main()
{
    Mat image= imread("test.jpeg");// 读取图片
    if(!image.data)             // 检查非法输入
      {
          cout <<  "无法读取照片" << endl ;
          return -1;
      }

    namedWindow("Display window",WINDOW_AUTOSIZE);   // 创建图片显示自动调整大小的窗口
    imshow("img",image);    // 在窗口显示图片
    
    waitKey(0); // 按键等待，需要在窗口任意输入字符退出，0代表永久等待
    return 0;
}
```

若运行过程出现问题请检查上述步骤是否正确，后文中给出了部分问题的解决方案，可能对您有帮助。

## 其他设置

### 使用相对路径

{% asset_img dir.png %}

Xcode使用图像或资源的绝对路径。为了设置相对路径需要设置*Working Directory*。依次点击 `菜单栏Product > Scheme > Edit Scheme ` 中转到*Run*中的*check Use Custom Working Directory*选项，然后自定义项目目录。

## 可能出现的错误

### 出现 “Not a Doxygen trailing comment” 错误

{% asset_img documention.png %}

在 *Build Settings* 中搜索 "Documentation Comments"，将 *Documentation Comments* 设置为"No"即可解决该问题。`Doxygen` 只是一种格式可以选择跳过检查。

### 出现 "dyld: Library not loaded..." 错误

{% asset_img signature.png %}

在 *Signing & Capabilities* 中打开*Disable Library Validation*，即可解决该问题。问题的原因是`brew`安装的`OpenCV`存在签名问题，暂且可以先认可没有被签名的 Library。

## 参考
[Setting up OpenCV and C++ development environment in Xcode for Computer Vision projects](https://medium.com/@jaskaranvirdi/setting-up-opencv-and-c-development-environment-in-xcode-b6027728003)

[Xcode in macox 10.15 beta library code signature problem](https://github.com/opencv/opencv/issues/15645#issuecomment-554495051)

[Not a Doxygen trailing comment](https://stackoverflow.com/questions/39929199/not-a-doxygen-trailing-comment)

[Load and Display an Image](https://docs.opencv.org/2.4/doc/tutorials/introduction/display_image/display_image.html)
