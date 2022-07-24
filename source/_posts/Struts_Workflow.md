---
title: Struts 工作流程总结
date: 2020-02-24 11:10:20
categories: 
- 技术
tags: 
- struts
- workflow
- JavaEE
- 总结
---

包含Struts 工作流程知识梳理、实验总结、实验步骤三方面的总结。
<!--more-->

## 知识梳理

1、Struts2 的控制器主要由三个层次组成，分别是过滤器、拦截器和业务控制 Action； 

2、过滤器是 Struts2 控制器的最前端控制器，过滤器的使用需要在 `web.xml` 中进行配置；FilterDispatcher 是 Struts2 应用中必须配置使用的过滤器，该过滤器的主要功能 包括执行 Action、清空 ActionContext 对象等； 

3、拦截器是 Struts2 中第二个层次的控制器，能够在 Action 执行前后完成一些通用功能； 


4、Struts2 内建了大量拦截器， 这些拦截器以 name-class 对的形式配置在 `strutsdefault.xml` 文件中，如果 `struts.xml 中定义的 package 继承了 Struts2 默 认的 `struts-default` 包，便可以直接使用默认拦截器栈 defaultStack； 

5、Struts2 也允许自定义拦截器，自定义拦截器类须实现 Interceptor 接口，并覆盖接 口中的 intercept 方法用于实现拦截器的主要功能；自定义拦截器须在 `struts.xml` 中进 行配置才能使用； 

6、若在 `struts.xml` 中为 Action 指定了一个拦截器，则默认拦截器栈 defaultStack 将会失效，为了继续使用默认拦截器，必须将其进行显式地配置。

7、Struts API 中的 `com.opensymphony.xwork2.util.ValueStack` 称为值栈，值栈是一 个数据区域，该区域中保存了应用范围内的所有数据和 Action 处理的用户请求数据； 

8、值栈被存储在 ActionContext 对象中，因此可以在任何节点访问其中的内容； 

9、ValueStack 接口中主要方法有：`Object findValue(String expr)`可以通过表达式查 找值栈中对应的值，`void setValue(String expr, Object value)`用于将对象及其表达式 存到值栈中； 

10、OGNL，即对象图导航语言，是 Struts 默认的表达式语言； 

11、OGNL 基础单位称为导航链，基本的链由属性名、方法调用、数组或集合元素组成；

12、在 Struts2 中，值栈是 OGNL 上下文的根对象，可以直接访问，而 application、session 等其它对象不是根对象，需要使用#进行访问。

13、Struts2 应用中使用 Action 调用 Model，因此 Struts2 应用中的异常在 Model 层抛 出后，通常在 Action 类中进行处理； 

14、Action 可以直接使用 try/catch 捕获异常，然后返回结果视图，跳转到相关页面处理 异常； 

15、抛出异常后，也可以不在 Action 类中捕获，而使用 throws 声明异常，交给 Struts2 框架处理； 

16、Struts2 允许通过 `struts.xml` 文件来配置异常的处理，使用 `<exception-mapping>` 标签声明异常映射，指定发生该类型异常时跳转的结果视图。

## 实验总结
**1、自定义拦截器类的作用和实现方法**

**作用：** 
Struts2第二个层次的控制器，能够在Action执行前后完成一些通用功能，完成一些通用的控制逻辑：解析请求参数、类型转换、输入校验、防止表单多次提交。 

**实现方法：**

(1) 创建拦截器Interceptor 

(2) 继承 AbstractInterceptor 类，重写 intercept()方法（AbstractInterceptor 类实现了 Interceptor 接口） 

(3) Action 内使用拦截器 

(4) 修改 `struts.xml` 文件，增加拦截器的配置 

**2、Interceptor 接口中 intercept(ActionInvocation inv)、init()和 destroy()方法的作用**

- **intercept(ActionInvocation inv)**： 允许 Interceptor 在 ActionInvocation 对请求的其余处理之前和/或之后对请求进行某些 处理，或者使处理短路，并仅返回 String 数值 

- **init()**： 在 interceptor 生成后产生，但在 interceptor 接受任何请求之前调用，使得 interceptor 进行初始化 

- **destroy()**： 让 interceptor 清理它产生的资源 

**3、defaultStack 拦截器栈中包含的主要拦截功能** 

- **params**：解析 HTTP 请求参数，并设置成 Action 属性 

- **validation**：执行 xxxAction-validate 中定义的校验器 

- **workflow**：调用 Action 中的 validate 方法 

- **i18n**：负责把用户所选的语言、区域放入用户 Session 中。 

- **createSession**：创建 HttpSession 对象 

- **timer**：负责输出 Action 执行时间，分析性能 

- **autowiring**：自动装配，访问 Spring 中的 Bean 

**4、自定义过滤器的实现方法和配置步骤，将拦截器与过滤器进行比较，并将两者的特点及区别**

**配置步骤：**

(1) 创建拦截器类，继承Filter类，重写doFilter方法

(2) `web.xml` 文件配置

**拦截器与过滤器特点和区别：** 

- 拦截器：Struts2 中第二个层次的控制器；允许自定义；需要在 web.xml 文件中配置； 
- 过滤器：Struts2 控制器的最前端控制器；允许自定义；需要在 struts.xml 文件中配置。 

**5、ValueStack 接口及其主要方法的作用和开发步骤**
ValueStack 接口中主要方法:findValue(), setValue() 

**findValue()**：通过以默认搜索顺序针对堆栈评估给定表达式来查找值。 

**setValue()**：使用默认搜索顺序使用给定的表达式在堆栈中的 bean 上设置属性。 

开发需要引入 `com.opensymphony.xwork2.util.ValueStack` 并实例化 ValueStack 对象，之后通过方法调用实现相关功能。 

**6、OGNL 可访问的对象和基本语法**

可以直接访问值栈 ValueStack（OGNL 上下文的根对象）；Action 实例被保存在值栈中，因此可以直接访问。 基本语法包含#、%、$三种符号，作用见下文 

**7、OGNL 三种常用符号:#、%和$的作用和使用方法**

 **%符号**：计算 OGNL 表达式的值 
 
 **$符号**：在国际化资源文件中，引用 OGNL 表达式；在 Struts 2 框架配置文件中引用 OGNL 表达式 
 
 **#符号**：访问 OGNL 上下文和 Action 上下文；构造 Map；过滤和投影集合 
 
 **8、自定义异常类的方法和步骤** 
 
 （1）创建自定义异常类并继承 Exception 类 
 
 （2）在 Model 中抛出自定义异常 
 
 （3）在 Action 中捕获异常 
 
 （4）在 `struts.xml` 中设置异常页面导航 
 
 （5）在 Action 中抛出异常，将其交给框架处理 
 
 （6）在 `struts.xml` 中使用标签<exception- mapping>进行异常配置 
 
 **9、整理 Struts2 框架处理异常的机制，整理 `struts.xml` 文件配置异常映射的方法以及相关标签的作用** 
 
 Struts2 的异常处理机制是通过在 `struts.xml` 文件中配置<exception-mapping……/>元素完成，配置该元素时，需要指定两个属性： 
 
 **exception**：指定该异常类型的完全限定名。
  
 **result**：指定逻辑视图名。 
 
 根据`<exception-mapping…../>`元素出现位置的不同，异常映射又可分为两种： 
 
 **局部异常映射**：将`<exception-mapping… />`元素作为`<action…/>`元素的子元素配置； 
 
 **全局异常映射**：将`<exception-mapping… />`元素作为`<global-exception-mappings… />` 元素的子元素配置； 
 
 全局异常映射对所有的 Action 都有效，但局部异常映射仅对该异常映射所在的 Action 有 效。如果局部异常映射和全局异常映射配置了同一个异常类型，在`<action…./>` 元素内的局部异常映射将覆盖全局异常映射。

