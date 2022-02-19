---
title: OpenCV 图像直方图与均衡化
date: 2020-03-16 16:20:20
categories: 
- tech
tags: 
- OpenCV
- Xcode
- Grayscale
copyright: true
---

> 如果您不知道如何在 Mac 上使用 Xcode 配置 `OpenCV`，可以参考我写的上一篇博文。

直方图是图像的一种统计表达，反映了图像中灰度的分布情况。以概率论为基础的，通过改变图像的直方图来改变图象中像素的灰度，以达到图像增强的目标，常称直方图修正。

<!--more-->
![](http://image.stephenfang.me/mweb/Histogram.png)

直方图均衡化原理即借助直方图变换实现（归一的）灰度映射，实现思想为对在图像中像素个数多的灰度级进行展宽，而对像素个数少的灰度级进行缩减。从而达到清晰图像的目的。

回到 `OpenCV`，`OpenCV`中提供了`equalizeHist`函数实现灰度图像直方图均衡化，给出如下函数原型及相关文档。

```cpp
void cv::equalizeHist	(	InputArray src,
OutputArray 	dst 
)	
```

![](http://image.stephenfang.me/mweb/equa.jpg)

实现的图像直方图均衡化算法就是把直方图的每个灰度级进行归一化处理，求各个灰度的累积分布并得到一个映射的灰度映射表，最后根据相应的灰度值来修正原图中的每个像素的像素值。

`OpenCV`中提供了`cvtColor`函数实现彩色图像转为灰度图像，给出如下函数原型及相关文档。
![](http://image.stephenfang.me/mweb/cvcolor.png)

至于直方图的绘制方法，`OpenCV`中提供了`calcList`函数计算图像直方图，尝试使用函数来实现会更符合操作流程。
![](http://image.stephenfang.me/mweb/calcHist.jpg)

## 说明
本次实验需要完成以下任务：
1. 完成直方图的绘制
2. 使 RGB 图像变为灰度图像
3. 完成图像直方图均衡化
给出如下代码：

```cpp
#include <opencv2/opencv.hpp>
#include <iostream>

using namespace cv;
using namespace std;

 MatND getHistogram(Mat &image)
{
    MatND hist;
    int channels[] = {0};
    int dims = 1;
    int histSize[] = {256};
    float granges[] = {0, 255};
    const float *ranges[] = {granges};
    calcHist(&image, 1, channels, Mat(), hist, dims, histSize, ranges);
    return hist;
}
 //  将图像直方图展示出来
 Mat getHistogramImage(Mat &image)
{
    MatND hist = getHistogram(image);
    Mat showImage(256,256, CV_8U,Scalar(0));
    int i;
    double maxValue = 0;
    minMaxLoc(hist, 0, &maxValue, 0, 0);
    for(i = 0; i < 256; i++)
    {
        float value = hist.at<float>(i);
        int intensity = saturate_cast<int>(256 - 256* (value/maxValue));
        rectangle(showImage, Point(i,256 - 1), Point((i+1)-1, intensity), Scalar(255));
    }
    return showImage;
}

int main()
{
    Mat src= imread("original.jpeg");// 读取图片
    Mat gray,equa;
    Mat grayHistogram,equaHistogram;

    if(!src.data)             // 检查非法输入
      {
          cout <<  "无法读取照片" << endl ;
          return -1;
      }

    namedWindow("RGB",WINDOW_AUTOSIZE);   // 创建图片显示自动调整大小的窗口
    imshow("RGB",src);    // 在窗口显示原始图片
    
    cvtColor(src, gray, COLOR_BGR2GRAY);
    namedWindow("GRAY",WINDOW_AUTOSIZE);
    imshow("GRAY",gray);    // 在窗口显示灰度图片
    
    grayHistogram = getHistogramImage(gray);
    //获得灰度图直方图
    namedWindow("FirstHistogram",WINDOW_AUTOSIZE);
    imshow("FirstHistogram",grayHistogram); // 在窗口显示灰度图直方图
    
    equalizeHist(gray, equa);
    namedWindow("EQUA",WINDOW_AUTOSIZE); 
    imshow("EQUA",equa);    // 在窗口显示均衡化处理后图片
    
    imwrite("result.jpg", equa); // 存储实验结果
    
    equaHistogram = getHistogramImage(equa);  //获得均衡化处理后直方图
    namedWindow("SecondHistogram",WINDOW_AUTOSIZE; 
 imshow("SecondHistogram",equaHistogram);    // 在窗口显示均衡化处理后
    
    waitKey(0); // 按键等待，需要在窗口任意输入字符退出，0代表永久等待
    
    src.release();
    gray.release();
    equa.release();
    grayHistogram.release();
    equaHistogram.release();
    destroyWindow("RGB");
    destroyWindow("GRAY");
    destroyWindow("EQUA");
    destroyWindow("FirstHistogram");
    destroyWindow("SecondHistogram");
    return 0;
}
```

## 实验结果

![](http://image.stephenfang.me/mweb/result.png)
第一张图片为未处理过的原图，第二张图片为灰度处理后的图片。第三张图片为均衡化处理后的灰度图，从直方图很能看出区别。

## 参考
[OpenCV官方文档](https://docs.opencv.org/master/)
[Dongcheng Lai的知乎专栏](https://zhuanlan.zhihu.com/p/73201428)
[opencv图像直方图的计算及绘制-Naruto_Q的博客](https://blog.csdn.net/piaoxuezhong/article/details/54588270)