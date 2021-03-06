---
title: Apple Watch程序设计
date: 2020-02-07 16:45:28
categories: 
- design
tags: 
- Apple
- Xcode
---

收录Apple Watch程序设计学习中的若干收获，有基本原则、体验权衡点等。
<!--more-->

## 基本原则

设计Apple Watch应用程序与设计iOS程序存在很大不同，我们需要了解其是iPhone的功能拓展，它的尺寸带来了新的手势操作和UI/UX 设计。

### **私人联系**

Apple Watch可能是第一个与用户建立紧密联系的设备，因此您在设计过程中需要利用这种独特的结合。

### **整体化设计**

Force Touch和Digital Crown是使用户与屏幕上的内容无缝交互的关键组件。在设计应用程序时，目标应该是增强用户的认识，即它们之间的硬件和软件是无法区分的。

### **轻量化交互**

Apple Watch中的快速交互对于体验至关重要。动画和声音之间的同步对于用户至关重要。重要的是要考虑到显示的信息应该快速浏览并易于消除。

## Apple Watch体验的权衡点

苹果官方提供了[视频](https://developer.apple.com/videos/play/wwdc2017/808/)讲解了一些技巧。

评估您的应用的最佳方法是考虑实现以下4点

![Apple官方参考](https://images.ctfassets.net/ooa29xqb8tix/6MDnChHFUkSoASwSWm6Woq/cd8c7dfdb89088677467edf5bd21a5a6/Qualities_20of_20Apple_20Watch_20Experiences.jpg)

### **清晰**

用户第一眼就能了解界面所显示的信息。

### **简洁**

直截了当。请记住，您的用户收到应用程序通知并举起手腕之间的时间只有几秒钟。

### **及时**

在尽可能短的时间内向用户显示最相关的信息。这样，您正在使您的应用与用户更加相关。

### **客制化**

如果您的应用程序完成了前三个要素，那么您的用户将感到个人联系。理想情况下，尝试加深与用户的这种关系。