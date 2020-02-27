---
title: 控制器组件 Action 实验
date: 2020-02-26 11:10:20
tags: tech
---

# 控制器组件 Action 应用实验

## 知识梳理

1、Action 类中的默认方法名是 execute()方法，可以被自动调用； 

2、在 Action 中也允许定义其它方法名，可以同时定义多个方法，分别处理不同的逻辑；

3、当 Action 中使用了自定义方法，则该 Action 就需要特定的配置，一般有四种调用方式： 

- 在 struts.xml 文件中通过 method 属性指定方法名； 
- 使用动态方法调用方式（DMI）； 
- 使用提交按钮的 method 属性； 
- 使用通配符配置 Action； 

4、Action 类是多实例的，Action 类的属性是线程安全的； 

5、在 JSP 页面中，可以通过 Struts2 标签调用 Action 中对应的 getter 方法，从而输出 Action 的属性值； 

6、当一个 Action 处理用户请求结束后，返回一个字符串作为逻辑视图名，再通过 `struts.xml` 文件中的配置将逻辑视图名与物理视图资源关联起来；Struts2默认提供了一系列的结果类型（`struts-default.xml` 配置文件的 result-types 标签里列出了所支持的结果类型），结果类型决定了 Action 处理结束后，将调用哪种视图资源来呈现处理结果。

7、为了让用户开发的 Action 类更规范，Struts2 提供了一个 Action 接口，该接口定义了 Struts2 的 Action 处理类应该实现的规范； 

8、Struts2 还为 Action 接口提供了一个实现类：ActionSupport，该类提供了若干默认方法，包括：默认的处理用户请求的方法（excute()方法）、数据校验的方法、添加校验错误信息的方法、获取国际化信息的方法等，部分重要方法列表如下：

![](1.png)
 
9、Struts2 框架提供了校验器和手工编码两种方式对请求参数进行数据校验，当 Action 类继承了 ActionSupport 类，就可以通过定义名为“<ActionClassName>- <ActionAliasName>-validation.xml”的校验规则文件的方法进行校验器校验， 也可以通过重写 ActionSupport 类的 validate()方法或 validateXxx()方法进行手动校验； 

10、在 JSP 页面中使用 Struts2 标签生成的表单，能将域级别的错误信息将自动显示到表单元素处； 

11、在 JSP 页面中使用 fielderror 标签，可以集中显示所有的域级错误信息；使用 actionerror 标签，可以显示所有的 Action 级别错误信息；使用 actionmessage 标签，可以显示 Action 消息； 

12、Struts2 框架中提供了部分内置的类型转换器，可以将请求参数的 String 类型转换成基本数据类型及对应的包装器类型、日期类型、数组类型、集合类型等，当 Action 类继承了 ActionSupport 类，则内置的类型转换器将默认生效，可以直接使用； 

13、如需修改默认的类型转换校验信息，则要在 Action 类的包中声明名为“Action 类名.properties”的局部属性文件； 

14、Struts2 框架同时支持自定义类型转换器，将请求参数转换成任意一种类型。

15、Struts2 框架中的 Action 类没有与任何 Servlet API 耦合，因此 Action 类可以脱 离 Servlet 容器环境进行单元测试； 

16、ActionContext 是 `com.opensymphony.xwork2` 包中的一个类，该类表示一个 Action 运行时的上下文；

17、当 Action 类需要通过请求、会话或上下文存取属性时，可以通过 ActionContext 类完成， 也可以通过实现 Struts 提供的接口：RequestAware、SessionAware 和 ApplicationAware 完成，而不必调用 Servlet API 中的 HttpServletRequest、 HttpSession 和 ServletContext 对象，从而保持 Action 与 Servlet API 的解耦； 

18、在 Action 类中直接访问 Servlet API， 可以通过实现 Struts2 提供的接口： ServletContextAware、ServletRequestAware、ServletResponseAware 完成，也可以通过 ServletActionContext 工具类实现，但 Action 将与 Servlet API 直接耦合。

## 实验总结
**1、总结 Action 自定义方法的四种调用和配置方式**

- 在 `struts.xml` 文件中通过method属性指定方法名：以actionName.action形式访问，但是要配置多个action较为麻烦
- 使用动态方法调用方式：以 actionName!methodName.action 形式访问，要注意UserAction下的login和register方法不能有相同的result返回值
- 使用提交按钮的method属性：以actionName!methodName.action形式访问，但是需要在.jsp页面中配置，只能用于表单中
- 使用通配符配置Action：以actionName.action形式访问，相对更为普遍的方式

**2、Action 的实例化情况，将 Action 与 Servlet 在实例化情况上进行对比**

在Struts2中每提交一次表单数据Action就被实例化一次，而Servlet在被创建时就被实例化，多次访问页面Servlet不会被多次实例化。

**3、分析 JSP 文件中获取 Action 属性的主要过程**

JSP 文件中获取 Action 属性以JavaBean来实现，所封装的属性和表单的属性一一对应，JavaBean将成为数据传递的载体来进行数据的传递。

**4、观察两次 `loginSuccess.jsp` 页面输出上的区别，分析原因并记录下来**
redirect采用客户端重定向的方式，而默认的dispatcher采用服务器内部跳转的方式，所以当result的type属性被设置为redirect时无法获取到Action中的count属性而dispatcher的方式可以。

**5、解压缩 Struts2 的核心包 struts2-core-2.3.15.1.jar，找到 struts-`default.xml` 配置文件，在其中的 result-types 标签里列出了 Struts2 所支持的结果类型，查找相关资料，总结这些结果类型的作用和特点，并记录下来；**
 
- chain：服务器内部跳转，调用其他action,完成自定义的拦截器堆栈和结果。只能请求action,如果请求视图资源会报错。
- dispatcher: 默认值，服务器内部跳转(跳转到web组件)
- freemarker：使用Freemarker模板引擎呈现一个视图
- httpheader：通过设置HTTP headers和status的值来发送错误信息给客户端。
- redirect: 作客户端重定向(重定向到web组件)
- redirectAction: 作客户端重定向(重定向到其他Action)
- stream:用作下载文件或者在浏览器上显示PDF等文档
- velocity:使用Servlet容器的JspFactory,模拟JSP执行环境,显示Velocity模板,将直接传输到Servlet输出。
- plaintext:响应以plain形式返回给客户端,相当于`response.setContentType("text/plain; charset="+charSet);`

**6、总结 Action 类中 validate()方法和 validateXxx()方法的作用**

-  validate()方法：将对页面表单验证的内容写到validate()方法中，实现验证和业务处理内容的分离，validate()方法会对Action类中所有业务方法起作用
-  validateXxx()方法：当多个表单提交到同一个action页面是，validate()方法对所有表单生效，可以使用validateXxx()方法实现对某一个业务的验证，validate()方法和 validateXxx()方法同时存在时都会起作用；validateXxx()方法的调用优于validate()方法

**7、总结使用校验器校验的方法；在 Struts2 的核心包 xwork-core-**
**2.3.15.1.jar\com\opensymphony\xwork2\validator\validators路径下找到 default.xml 文件，总结校验规则文件中主要元素的作用和配置方法**

- required：必填校验器  
- requiredstring：必填字符串校验器  
- stringlength:字符串长度校验器 
- date:日期校验器  
- expression：表达式校验器  
- int:整数校验器 
- fieldexpression：字段表达式校验器
- url:网址校验器  
- regex：正则表达式校验器 

```
<validators>
  <field name="被校验的字段">
     <field-validator type="校验器的类型">
        <param name="参数名">参数值</param>
         <message> 提示信息</message>
     </field-validator>
  </field>
  <!--下一个要验证的字段--> 
</validators>
```

```<valiators>
  <validator type="校验器类型名">
     <!--fieldName固定的 N必须大写-->
     <param name="fieldName">需要被校验的字段</param>
      <!--下面的param元素可以有0个或者多个--> 
     <param name="参数名">参数值</param>
    <message key="I18NKey">提示信息</message>
  </validator>
</validators>
```

**8、总结在 Action 中使用国际化资源文件的步骤及方法**

首先创建不同语言环境下的.properties文件，在文件中写入不同key字段的国际化资源，使用ActionSupport类的getText方法，该方法可以接受一个name参数，指定国际化资源文件中的key数值，最后使用native2ascii工具进行处理。

**9、总结 Struts2 中常用的内置类型转换器及其使用方法**

- String:将int,double,boolean,String类型的数组或java.util.Date类型转换成字符串。
- boolean和Boolean:在字符串与boolean之间转换
- char/Character:在字符串和字符之间转换
- int/Integer,float/Float,long/Long,double/Double:在字符串与数值类型之间进行转换 
- date:在字符串和日期类型之间进行转换，默认格式是:YYYY-MM-DD
- 数组:由于数组本身就有类型，可以将多个同名参数，转换到数组中(在之前总结的兴趣爱好多选择，如果你选择多个，同时他们name属性相同就自动变为数组)
- 集合:支持将数据保存到List或者Map集合

**10、观察 Action 中访问 Servlet API 的四种方法，总结四种方法的区别，并记录下来**

- 通过ActionContext类访问：
使用这种方法访问的前提是必须先要获取ActionContext对象，优点是Action和Servlet API完全解耦，缺点是并不能调用原生的Servlet API

- Action直接访问:
使用这种方法可以调用原生的Servlet API，但是需要实现对应的接口

- 	通过ServletActionContext访问:
使用ServletActionContext工具类无需实现接口，就可以直接访问Servlet API，但是会加强Action和Servlet API的耦合，不利于Action的再利用。

- 实现ServletContextAware、ServletRequestAware、ServletResponseAware接口访问:
Action与Servlet API直接耦合，需要调用ServletContext和ServletRequest等set方法。

## 实验步骤
### 基础实验

1、新建 Web 工程 struts-prj2，并将 Struts2 中的 8 个核心包添加到工程中； 

2、在 struts-prj2 中新建 login.jsp 页面，作为用户登录的视图；新建 loginFail.jsp 页面，作为登录失败的视图；新建 loginSuccess.jsp 页面，作为登录成功的视图;

3、在 struts-prj2 中新建 register.jsp 页面，作为用户注册的视图；新建regFail.jsp 页面，作为注册失败的视图；新建 regSuccess.jsp 页面，作为注册成功的视图;

4、在 struts-prj2 中新建 cn.edu.zjut.bean 包，并在其中创建 UserBean.java，用于 记录用户信息 （可重用“实验二 Struts 基础应用 ”中提高实验里的 UserBean.java 代码）； 

5、在 struts-prj2 中新建 cn.edu.zjut.service 包，并在其中创UserService.java， 用于实现登录逻辑和注册逻辑;

6、在 struts-prj2 中新建 cn.edu.zjut.action 包，并在其中创建 UserAction.java，定义login()方法和 register()方法

7、在工程struts-prj2 的 src 目录中创建 struts.xml 文件，用于配置 Action 并设置 页面导航，通过 action 标签中 method 属性指定方法名；

8、编辑 Web 应用的 web.xml 文件，增加 Struts2 核心 Filter 的配置； 

9、将 struts-prj2 部署在 Tomcat 服务器上，通过浏览器访问 login.jsp 与 register.jsp页面，并记录运行结果； 

10、查找相关资料， 尝试使用 Action 自定义方法的其它三种调用和配置方式：动态方法调用方式（DMI）、提交按钮的 method 属性、通配符配置 Action，并记录关键配置和运行结果； 
 
![](DMI.png)
  
![](button.png)
 
![](uni.png)

11、修改 UserAction.java，增加 UserAction 类的构造方法 UserAction()，增加 count属性，用于测试 Action 的实例化情况

![](2.png)

12、修改 loginSuccess.jsp，在页面中使用<s:property>标签输出 Action 中的 count 值； 

```<s:property value="count" />```

13、重新将 struts-prj2 部署在 Tomcat 服务器上，通过浏览器访问 login.jsp 页面， 并刷新多次，记录运行结果； 

![](3.png)

14、修改 struts.xml 文件，将 UserAction 的页面导航设置为 redirect 结果类型；

```
<result name="success" type="redirect">/loginSuccess.jsp</result>
```

15、重新将 struts-prj2 部署在 Tomcat 服务器上，通过浏览器访问 login.jsp 页面， 观察登录成功后 loginSuccess.jsp 页面的输出，并记录下来。

![](4.png)

### 提高实验
1、在 struts-prj2 中修改 UserAction 类，使其继承 ActionSupport 类，并在 UserAction 类中覆盖 ActionSupport 类的 validate()方法， 用于对用户登录的请求参 数 account 和 password 进行校验：若用户名或密码为空，则使用 addFieldError （域 级）添加错误信息。

![](5.png)

2、修改 `struts.xml` 文件，在 Action 的配置中增加 validate()方法校验出错时的页面导航`<result name="input">`

![](6.png)

3、重新将 struts-prj2 部署在 Tomcat 服务器上，通过浏览器访问 `login.jsp` 页面，观察并记录运行结果；

![](7.png)

4、修改 `login.jsp` 页面，在表单前增加 fielderror 标签：`<s:fielderror/>`，再通过浏览器访问 login.jsp 页面，观察并记录运行结果

![](8.png)

5、修改 UserAction.java，在调用登录逻辑的 login()方法中，对登录情况进行校验： 若登录成功，使用 addActionMessage()方法添加“登录成功！”的 Action 提示消息，若 登录失败，使用 addActionError()方法添加 Action 级别的错误信息

![](9.png)

6、修改 login.jsp 页面，增加 actionerror 标签（<s:actionerror/>）Action 级别的 错 误信息；修改 `loginSuccess.jsp`，使用 actionmessage 标签`<s:actionmessage/>` 显示 Action 提示消息； 

7、修改 `struts.xml` 文件中用户登录的页面导航设置，将登录失败时转向的页面从 loginFail.jsp 修改为 login.jsp； 

8、重新将 struts-prj2 部署在 Tomcat 服务器上，通过浏览器访问 login.jsp 页面， 观察并记录运行结果；

![](10.png)

9、在工程 struts-prj2 中创建“UserAction-login-validation.xml”校验规则文件，使 其与 UserAction 类位于同一目录下，配置校验信息，使用校验器对请求参数进行校验 

10、重新将 struts-prj2 部署在 Tomcat 服务器上，通过浏览器访问 login.jsp 页面， 观察并记录运行结果；

![](11.png)

11、将 login.jsp、 loginSuccess.jsp、 loginFail.jsp 三个页面进行国际化处理，把需要进行国际化的内容 以键值对的形式写入资源文件 `message_zh_CN.properties` 和 `message_en_US.properties` 中； 

12、在资源文件中添加校验信息的键值对， 并使用 native2ASCII 工具，将 `message_zh_CN.properties` 重新编码，将中文字符都转化为 unicode 码 

13、在工程 struts-prj2 的 src 目录中创建 `struts.properties` 文件，通过它加载资源文件 

14、修改 `UserAction.java`，使用 ActionSupport 类的 getText()方法，获取国际化资 源文件中的信息 

15、修改 `UserAction-login-validation.xml`，获取国际化资源文件中的信息 

16、重新将 struts-prj2 部署在 Tomcat 服务器上，通过浏览器访问 `login.jsp` 页面， 观察并记录运行结果；

![](12.png)

17、修改 `UserBean.java`，将用于保存注册用户生日的变量类型改为 Date 类型，使用 Struts2 内置的类型转换器对请求参数进行校验； 

18、重新将 struts-prj2 部署在 Tomcat 服务器上，通过浏览器访问 `register.jsp` 页 面，当用户输入的生日不合法时，观察并记录运行结果；

![](13.png)

19、在工程 struts-prj2 的 cn.edu.zjut.action 包中创建局部属性文件`UserAction.properties`，修改类型转换的校验信息，并使用 native2ASCII 工具将 `UserAction.properties` 重新编码 

20、重新将 struts-prj2 部署在 Tomcat 服务器上，通过浏览器访问 `register.jsp` 页 面，当用户输入的生日不合法时，观察并记录运行结果；

![](na.png)

21、参考实验步骤 9，在工程 struts-prj2 的 cn.edu.zjut.action 包中创建 `UserAction-register-validation.xml` 文件，增加校验信息的配置，使用校验器对用户 注册的请求参数进行校验，要求注册时两次密码输入相同、email 地址格式符合要求等； 

22、重新将 struts-prj2 部署在 Tomcat 服务器上，通过浏览器访问 `register.jsp` 页 面，观察并记录运行结果；

![](14.png)

23、修改 UserAction 类， 将 validate()的方法名改为 validateLogin()， 并增加 validateRegister()方法，参考实验步骤 1，使用手工编码方式对请求参数进行数据校验； 

24、重新将 struts-prj2 部署在 Tomcat 服务器上，通过浏览器访问 `register.jsp` 页 面，观察并记录运行结果。

![](15.png)

### 拓展实验

1、在 struts-prj2 中修改 UserAction 类，通过 ActionContext 获取请求、会话和上下文对象相关联的 Map 对象来实现存取属性的功能 

2、修改 `loginSuccess.jsp` 页面，从请求、会话和上下文对象中获取属性值并显示 在页面中 

3、重新将 struts-prj2 部署在 Tomcat 服务器上，通过浏览器访问 `login.jsp` 页面，观察并记录运行结果；

![](16.png)

**每提交一次刷新，次数就会增加一次，只有重新部署访问次数才会重置** 

4、修改 UserAction 类，通过实现 Struts 提供的接口：RequestAware、SessionAware 和 ApplicationAware，获取请求、会话和上下文对象相关联的 Map 对象来实现存取属性的功能 

5、重新将 struts-prj2 部署在 Tomcat 服务器上，通过浏览器访问 `login.jsp` 页面，观察并记录运行结果；

![](17.png)

6、修改 UserAction 类，查找相关资料，尝试通过接口：ServletContextAware、 ServletRequestAware、ServletResponseAware 直接访问 Servlet API，实现以上实验步骤 1-3 的相同功能，重新运行并记录结果；

![](18.png)

![](19.png)


7、修改 UserAction 类，查找相关资料，尝试通过 ServletActionContext 工具类直接访 问 Servlet API，实现以上实验步骤 1-3 的相同功能，重新运行并记录结果；

![](20.png)

![](21.png)

8、尝试利用 Servlet API 添加购物车功能，在工程 struts-prj2 的 cn.edu.zjut.bean 包中创建 `Item.java` 用于记录商品信息

9、在工程 struts-prj2 的 cn.edu.zjut.bean 包中创建 `ShopppingCart.java` 用于记录用户的购物车信息，为简化操作，在购物车的构造函数中加入商品信息 

10、重新将 struts-prj2 部署在 Tomcat 服务器上，通过浏览器访问 `login.jsp `页面， 观察并记录运行结果。

![](22.png)
