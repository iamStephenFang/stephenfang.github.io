---
title: Hibernate 基础总结
date: 2020-02-25 13:11:20
categories: 
- tech
tags: 
- Hibernate
- JavaEE
- 总结
---


## 知识梳理

1、Hibernate 是一个 ORM（Object-Relational Mapping）框架，用于把对象模型表示的对象映射到基于 SQL 的关系模型数据结构中去，采用完全面向对象的方式来操作数据库； 

2、Hibernate 的主要作用是简化应用的数据持久层编程，不仅能管理 Java 类到数据库表的映射，还提供数据查询和获取数据的方法，从而大幅减少了开发人员编写 SQL 和 JDBC 代码的时间； 

3、Hibernate 框架主要包括持久化对象（Persistent Objects）、Hibernate 配置文件 （一般被命名为*.cfg.xml）、Hibernate 映射文件（一般被命名为 *.hbm.xml ） 三部分； 

4、编译运行基于 Hibernate 框架的工程，需要导入相应的 Hibernate 类库； 

5、由于 Hibernate 底层是基于 JDBC 的，因此在应用程序中使用 Hibernate 执行持久化操作时也需要导入相关的 JDBC 驱动（例如 MySQL 数据库驱动）；

6、在实际应用中，并不都是一张表与一个实体类映射，往往可能会有一张表跟多个实体类映射的情况，称为粒度设计； 

7、如果表中的某些字段联合起来能表示持久化类中的某一个属性，那么可以进行基于设计的粒度设计：将表跟多个类映射；类和类之间使用关联关系；只需要一个映射文件，其中使用 component 元素进行映射； 

8、如果表中的某些字段不经常使用，而且占有空间较大，则可以使用基于性能 的粒度设计：一个表可以映射为多个类；每个类对应一个 *.hbm.xml 文件；根据实际情况，使用不同的类。

7、在应用程序中，用来实现业务实体的类被称为持久化类（Persistent Class）如客户信息管理系统中的 Customer 类； 

8、Hibernate 框架中的持久化类与数据库表对应，常用 POJO 编程模式实现，符合JavaBean 规范，提供 public 的无参构造方法，提供符合命名规范的 getters 和 setters 方法； 

9、持久化类与数据库表对应， 类的属性与表的字段对应；持久化类的对象被称为持久化对象 PO（Persistent Objects），PO 对应表中的一条记录； 

10、持久化对象映射数据库中的记录，其映射关系依赖 Hibernate 框架的映射文件配置，映射文件是 XML 文件，往往以*.hbm.xml 形式命名，其中*是持久化对象的类名； 

11、Hibernate 映射文件中，元素 `<id>` 表示持久化类中的主键， `<id>` 的子元素 `<generator>` 表示主键的生成策略，其取值可以是“assigned”（用户赋值）、“increment”（自动递增）等等； 

12、若数据库表中有多个列组成主键，则需要将其对应的持久化类中相应的多个属性封装成一个类，作为复合主键。


## 实验总结
**1、总结 Hibernate 配置文件`hibernate.cfg.xml`中各元素及其属性的作用；**

- hibernate.connection.url:连接数据库url地址
- hibernate.connection.username：连接数据库用户名
- hibernate.connection.password：连接数据库密码
- 	hibernate.connection.driver_class：连接数据库JDBC驱动类
- hibernate.dialect：连接数据库所使用的SQL语言
- mapping resource：与当前配置文件相匹配的映射文件

**2、总结持久化类与数据库表的映射关系，以及映射文件中主要元素及其属性的作用**

- `<class  name="类名"  table="表名">`：类和表对应
- `<id name="属性" column="列名">`：填写主键，即使表内没有主键，配置文件中也要配置一个唯一标识
- `<generator class="assigned"/>`：主键的生成策略，assigned 表示由用户赋值
- `<property name="属性" column="列名"/>`：将属性和列对应起来

**3、	总结Action、Service 和 DAO 之间的调用关系，思考Java Web中的 DAO 类与当前 DAO 类的区别**

**流程：**首先Action接受请求，调用生成的Service实例，Service经过业务逻辑处理之后调用DAO，DAO对数据库进行操作；

**区别：**JavaWeb中DAO文件需要包含连接对象的定义，包含数据库连接和驱动的相关信息，而本实验中相关信息已经包含在配置文件中；JavaWeb中DAO文件需要定义结果集，而本实验中可以直接使用ArrayList存储结果；JavaWeb中DAO文件执行的sql语句为标准的sql语句而本实验中不是。

**4、总结 POJO 模式下持久化类的规范**

1. 提供无参的构造器
2. 为每一个实体字段提供对应的getter/setter方法
3. 每一个实体类都需要提供一个标识属性，与数据库中的主键对应。
4. 实体类字段均使用包装类型
5. 实体类不能使用final修饰

**5、总结映射文件中主要元素（如class、id、generator、property）及其属性的含义与作用**

•	`<class>` ：持久化类名，类名class与表名table属性对应

•	`<id>` ：持久化类中的主键,主键属性与列名column属性对应

•	`<generator>` ：主键生成策略

•	`<property>` ：非主键属性property与column属性对应

**6、总结设置复合主键的方法和步骤**

首先将复合主键封装为一个类，修改PO类将复合主键作为其属性之一，修改Hibernate映射文件，将主键类中的每一个属性和表中的列对应，并指定复合主键的类型。

**7、总结 Hibernate 映射文件中主键各种生成策略的作用**

- assigned：用户赋值
- increment 策略：自动递增;必须保证主键的列是"long"、"integer"或是"short"，必须是一个整数;系统会自动将主键列最大的值获得之后加 1，进行赋值
- identity：由数据库根据 identity 生成主键，但是数据库必须支持 identity
- sequence：由数据库根据序列生成主键，但是数据库必须支持 sequence
- native：系统自动选择相应算法生成主键
- uuid.hex ：利用 uuid 算法生成主键;必须保证该列是字符串类型;系统会自动给定一个随机、唯一的字符串
- hilo：根据 Hibernate 的 hilo 生成主键

**8、总结两种粒度设计的方法及特点**

**基于设计的粒度设计：** 将表跟多个类映射；只需要一个映射文件，其中使用component元素进行映射

**基于性能的粒度设计：** 一个表可以映射为多个类，每个类对应一个*.hbm.xml文件，根据实际情况，使用不同的类

**9、总结 Hibernate 配置文件`hibernate.cfg.xml`中的`connection.autocommit`属性的作用**

只有执行 commit 后 connection 的操作才会在数据库中真正执行。如果jdbc connection 的 autoCommit 属性是 false ，且 sql 语句中没有显示 commit，则 sql 语句即使被发送到数据库中也没有真正执行 sql；如果 connection 的 autoCommit 为true，每一条发送到数据库中的sql会自动commit。
