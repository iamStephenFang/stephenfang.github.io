---
title: OpenCV 图像滤波
pubDatetime: 2020-04-01 18:40:20
categories:
  - 技术
tags:
  - OpenCV
  - Xcode
copyright: true
description: OpenCV 图像滤波实践
---

> 如果您不知道如何在 Mac 上使用 Xcode 配置 `OpenCV`，可以参考我之前的博文。

利用像素本身以及其邻域象素的灰度关系进行增强的方法常称为滤波，而滤波器通过邻域运算实现。

开始之前先给出滤波相关知识结构图。

<!--more-->

![滤波](http://image.stephenfang.me/mweb/滤波.png)

## 理解滤波

先给出邻域操作的过程；

1. 将模板在输入图象中漫游，并将模板中心与图象中某个像素位置重合
2. 将模板上的各个系数与模板下各对应像素的灰度值相乘
3. 将所有乘积相加( 为保持灰度范围，常将结果再除以模板系数之和)
4. 将上述结果(模板的输出响应)赋给输出图象中对应模板中心位置的象素

> 均值滤波其实就是对目标像素及周边像素取平均值后再填会目标像素来实现滤波目的的方法。

接下来给出均值滤波具体的操作方法：
存在如下图片底板，可见图像中用蓝色标记的“99”为显著的噪声。
![](http://image.stephenfang.me/mweb/15857298630296.jpg)
尝试建立如下 3\*3 邻域模版，模版可以暂且被理解为叠在图像上的内容，实为平滑卷积模版
![](http://image.stephenfang.me/mweb/15857297422480.jpg)
尝试对最左上角的重叠部分进行计算，计算方法为系数逐乘以邻域节点的数值：

```
 1/9 * (10x1 + 11x1 + 10x1 + 9x1 + 10x1 + 11x1 + 10x1 + 9x1 + 10x1)
= 1/9 * (90)
= 10
```

将运算结果“10”填充至中间位置，与原有结果相同。
![](http://image.stephenfang.me/mweb/15857302402257.jpg)
至此完成了卷积模版最基本操作，接下来尝试遍历扫描整个图像，即通过对模板的平移完成对整个图像的运算，如下图所示：
![-w229](http://image.stephenfang.me/mweb/15857305800473.jpg)![-w229](http://image.stephenfang.me/mweb/15857305984728.jpg)
此时运算过程为：

```
  1/9 *(10x1 + 0x1 + 0x1 + 11x1 + 1x1 + 0x1 + 10x1 + 0x1 + 2x1)
= 1/9 *( 34)
= 3.7778
```

将小数量化后填充至中心位置，并重复操作，原则为逐行扫描，逐列增长。
![-w229](http://image.stephenfang.me/mweb/15857308419472.jpg)![-w229](http://image.stephenfang.me/mweb/15857308571783.jpg)
可以观察到运算进行到最下角的区域时，原来的“99”数值被填充为“20”，噪声被有效抑制。
你可能会发现，当然边缘处的图像无法通过该算法进行处理，然而存在以下方法：

1. **拓宽原图** :人为将边缘像素往外复制，图像外的第零列就被复制为与第一列相同，图像外的第零行被复制为与第一行相同，最后补全四个对角。如 6*6 的原图就被拓宽为 7*7 的图像，再对拓宽后的图像进行卷积处理。
2. **像素复制** :将已经处理完成的内部像素往外复制，如上图中 4\*4 的内部像素已经完成卷积运算，尝试将其往外复制像素，如(2,2)位置的 10 覆盖(1，2)位置的 11 和(2,1)位置的9。
3. **保持原样** :这也是一种方法，毕竟三种方法都存在误差。

其他还存在很多模版，简要理解中值滤波法：
![-w229](http://image.stephenfang.me/mweb/15857320034469.jpg)![-w229](http://image.stephenfang.me/mweb/15857320145830.jpg)
正如其名，其计算方法为：

1. 对邻域 10,9,11,9,99,11,11,10,10 进行排序
2. 在排序后的数字 9,9,10,10,10,11,11,11,99 中寻找中间像素
3. 查找到中位数“10”对”99“进行替换

卷积也被称为算子，以下为著名的Prewitt算子（垂直方向与水平方向）
![-w229](http://image.stephenfang.me/mweb/15857327960667.jpg)![-w235](http://image.stephenfang.me/mweb/15857328571767.jpg)
它可以显著降低边缘精度，对噪声具有平滑作用。下图为原图
![](http://image.stephenfang.me/mweb/15857329308611.jpg)
以下左图为处理后的x方向图片，右图为处理后的y方向图片。
![-w229](http://image.stephenfang.me/mweb/15857329552320.jpg)![-w238](http://image.stephenfang.me/mweb/15857329695411.jpg)
最后给出简单的Sobel边缘检测算子。

> 索贝尔算子是计算机视觉领域的一种重要处理方法。主要用于获得数字图像的一阶梯度，常见的应用和物理意义是边缘检测。索贝尔算子是把图像中每个像素的上下左右四领域的灰度值加权差，在边缘处达到极值从而检测边缘。

左图为垂直方向的Sobel边缘检测算子，右图为水平方向的Sobel边缘检测算子。
![-w229](http://image.stephenfang.me/mweb/15857325986198.jpg)![-w229](http://image.stephenfang.me/mweb/15857327147059.jpg)

对于邻域操作的概念这里不复再议，接下来尝试通过`OpenCV`的 filter2D() 函数实践 3\*3 卷积模板。

## 代码解释

尝试自己编写了一段代码后，在`OpenCV`官方文档中查找到了线性滤波器的内容，通过循环的方式体现均值滤波器在不同的卷积核大小对图像的影响，现将其做解释。

该程序通过循环生成 sizes 为3、5、7、9、11 时的*normalized box filter*，即均值滤波器（上文中已提及）。
对于`size = 3` 的卷积核，应进行如下操作，其中 1/9 为系数。
![](http://image.stephenfang.me/mweb/15857352054151.jpg)
给出`OpenCV`中 filter2D() 的定义：

```objc

void cv::filter2D	(
InputArray src,
OutputArray dst,
int 	ddepth,
InputArray 	kernel,
Point 	anchor = Point(-1,-1),
double 	delta = 0,
int 	borderType = BORDER_DEFAULT
)
```

对参数进行解释

- src: 原图像
- dst: 目标图像
- ddepth: 图像深度.负数代表与原始图像相同，如 -1
- kernel: 卷积核
- anchor: 内核的基准点，默认(-1, -1) 代表处于中心位置
- delta: 可选的添加到像素的值，默认为 0
- BORDER_DEFAULT: 像素向外逼近的方法，默认值 BORDER_DEFAULT 表示对全部边界进行计算

相比你已经能够了解如何处理这个程序了，接下来给出修改后的整个程序。

```objc
#include "opencv2/imgproc.hpp"
#include "opencv2/imgcodecs.hpp"
#include "opencv2/highgui.hpp"
using namespace cv;
int main ( int argc, char** argv )
{
    Mat src, dst;
    Mat kernel;
    //初始化
    double delta = 0;
    int ddepth = -1;
    int kernel_size;
    Point anchor = Point( -1, -1 );

    // 加载图片
  src = imread("original.jpeg");
    if( src.empty() )
    {
        printf("无法加载图片\n");
        return EXIT_FAILURE;
    }

    // 执行循环：每隔0.5秒对图像执行不同卷积核下的滤波操作
    int ind = 0;
    for(;;)
    {
        // 为归一化滤波循环更新卷积核的大小，kernel_size在3-11间循环
        kernel_size = 3 + 2*( ind%5 );
        kernel = Mat::ones( kernel_size, kernel_size, CV_32F )/ (float)(kernel_size*kernel_size);
        // 执行滤波器
        filter2D(src, dst, ddepth , kernel, anchor, delta, BORDER_DEFAULT );
        imshow( "FilterTest", dst );
        char c = (char)waitKey(500);
        // 按下Esc退出程序
        if( c == 27 )
        { break; }
        ind++;
    }
    return EXIT_SUCCESS;
}
```

## 结果

给出以下测试图片效果，可以看出效果已经相当明显。
![-w599](http://image.stephenfang.me/mweb/15857364490707.jpg)
![-w599](http://image.stephenfang.me/mweb/15857363805369.jpg)
![-w599](http://image.stephenfang.me/mweb/15857364391479.jpg)

## 参考

[Making your own linear filters - OpenCV Docs](https://docs.opencv.org/master/d4/dbd/tutorial_filter_2d.html)
[空域增强与模板操作-浙江工业大学刘盛](https://mooc1-1.chaoxing.com/coursedata/toPreview?courseId=207584971&dataId=132888374&objectId=491305c721a2802f01b830bba5507385)
[初识滤波之均值滤波](https://zhuanlan.zhihu.com/p/76188487)
