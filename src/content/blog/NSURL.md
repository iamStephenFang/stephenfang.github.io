---
title: 作为iOS开发你真的了解URL吗？
pubDatetime: 2024-07-28 01:15:00
categories:
  - 技术
tags:
  - iOS
  - macOS
  - Apple
  - NSURL
  - URI
  - URL
  - Foundation
copyright: true
featured: true
description: 最近在处理业务上问题时遇到了一些NSURL上的问题，期望通过这篇博客一同梳理梳理一下对于NSURL的理解。
---

最近在开发业务的时候遇到了一些 `NSURL`上的问题，期望通过这篇博客一同梳理梳理一下对于`NSURL`的理解。
对于`Foundation`框架中的很多类，我们可能会经常使用到但是对于它的理解可能并不是很深入，这篇博客将会从URI、URL、NSURL、NSURLComponents等方面进行介绍。

<!--more-->

## 什么是URI

统一资源标识符 (URI)，是 Uniform Resource Identifier 的缩写，之前也是Universal Resource Identifier的缩写。URI 是标识抽象或物理资源的唯一字符序列，例如网页上的资源、邮件地址、电话号码、书籍，又或者是现实世界的物体。

那么什么是 URL 呢， **提供在网络上定位和检索信息资源的方法的 URI** 是URL。换句话说，URL 是一种特定类型的统一资源标识符。URL 是 URI 的子集，且每个 URL 都是一个 URI，反之则不一定。

URI 和 URL 具有共同的历史，Tim Berners-Lee，也就是HTML、万维网、HTTP协议的发明者在超文本提案隐含地引入了 URL 的概念，之后随着万维网的核心技术发展这项方案得到了完善，如果你对这段历史感兴趣可以在维基百科找到相当详细的介绍。

### 语法

URI 通用语法由五个部分组成，按重要性从左到右递减的顺序分层组织：

```
URI = scheme ":" ["//" authority] path ["?" query] ["#" fragment]
```

#### Scheme

URI 的第一部分是 Scheme，以字母开头，后跟字母、数字和加号的任意组合 ( + ) 句点 ( . ) 或连字符 ( - )的字符。尽管 Scheme 不区分大小写，但规范形式是小写的，示例包括 http 、 https 、 ftp 、 mailto 、 file 、 data 。

文件统一资源标识符（File URI Scheme）是一种特定格式的URI, 识别文件需要这种`file://host/path`特定的语法。

#### Authority

```
authority = [userinfo "@"] host [":" port]
```

URL 的第二部分是`Authority`，这一部分是可选的，由以上子部分构成。
冒号将 Scheme与 URL 的下一部分隔开，而 // 表示 URL 的下一部分是 Authority。

- 可选的` userinfo`后跟一个 at 符号，如`username:password`，虽然不推荐这样明文展示。

- ` host` 由注册名称（包括但不限于主机名）或IP 地址组成。 IPv4地址必须采用点十进制表示法， IPv6地址必须括在方括号 ( [] ) 中。

- 可选的端口子组件前面带有冒号 ( : ，由十进制数字组成。

#### Path

由一系列斜杠 ( / ) 分隔的路径段组成，在网络请求中十分常见。
分段也可能为空，导致路径组件中出现两个连续的斜杠 ( // )。

> 如果定义了`Authority`，则 `path` 必须为空或以斜杠 ( / ) 开头。如果未定义`Authority`，则 `path` 不能以两个斜杠 ( // ) 开头，因为以下字符将被解释为`Authority`。

#### Query

`Query`部分也是可选的，前面会包含一个问号 ( ? )，由非分层数据的查询字符串组成。它的语法没有明确定义，但按照惯例，通常是由分隔符分隔的属性-值对序列。例如`key1=value1&key2=value2`，又或者是`key1=value1;key2=value2 `。

#### Fragment

`Fragment`部分同样是可选的，前面会带有井号( # )。Fragment 包含了一个片段标识符提供了对辅助资源的指示，例如由 URI 的其余部分标识的文章中的章节标题。在HTML文档处理过程中 `Fragment` 通常是特定元素的id属性，浏览器会将该元素滚动到视图中。

### 示例

以下为常见的URI及其组成部分，摘自[维基百科](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier)。

```
          userinfo       host      port
          ┌──┴───┐ ┌──────┴──────┐ ┌┴─┐
  https://john.doe@www.example.com:1234/forum/questions/?tag=networking&order=newest#top
  └─┬─┘   └─────────────┬─────────────┘└───────┬───────┘ └────────────┬────────────┘ └┬┘
  scheme            authority                path                   query          fragment
          userinfo       host      port
          ┌──┴───┐ ┌──────┴──────┐ ┌┴─┐
  https://john.doe@www.example.com:1234/forum/questions/?tag=networking&order=newest#:~:text=whatever
  └─┬─┘   └─────────────┬─────────────┘└───────┬───────┘ └────────────┬────────────┘ └───────┬───────┘
  scheme            authority                path                   query                 fragment

  ldap://[2001:db8::7]/c=GB?objectClass?one
  └┬─┘   └─────┬─────┘└─┬─┘ └──────┬──────┘
  scheme   authority   path      query

  mailto:John.Doe@example.com
  └─┬──┘ └────┬─────────────┘
  scheme     path

  news:comp.infosystems.www.servers.unix
  └┬─┘ └─────────────┬─────────────────┘
  scheme            path

  tel:+1-816-555-1212
  └┬┘ └──────┬──────┘
  scheme    path

  telnet://192.0.2.16:80/
  └─┬──┘   └─────┬─────┘│
  scheme     authority  path

  urn:oasis:names:specification:docbook:dtd:xml:4.1.2
  └┬┘ └──────────────────────┬──────────────────────┘
  scheme                    path
```

## 什么是URL

[MDN文档](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL#authority)概括得很清楚，**URL**是Uniform Resource Locator，即统一资源定位符的缩写，是互联网上唯一资源的地址。它是浏览器用来检索已发布资源（例如 HTML 页面、CSS 文档、图像等）的关键机制之一。

理论上，每个有效的 URL 都指向一个唯一的资源。实际上，存在一些例外情况，最常见的是指向不再存在或已移动的资源的 URL。由于 URL 表示的资源和 URL 本身是由 Web 服务器处理的，因此 Web 服务器的所有者需要仔细管理该资源及其关联的 URL。

### URL 剖析

作为开发者肯定都见过URL，URL 由不同部分组成，一些是强制性的，另一些是可选的。下面的 URL 突出显示了最重要的部分（以下部分提供了详细信息）：

![URL-MDN](https://image.stephenfang.me/mweb/mdn-url-all.png)

#### Scheme

URL 的第一部分是Scheme，它指示请求资源必须使用的协议，如浏览器打开网页用到的 HTTPS 或 HTTP。

#### Authority

URL 的第二部分同样是Authority，它通过字符样式 :// 与Scheme分开。 Authority包括域（例如 www.example.com ）和端口（ 80 ），并用冒号分隔。

域指示正在请求哪个 Web 服务器。通常这是一个域名，但也可以使用 IP 地址。

如果 Web 服务器使用 HTTP 协议的标准端口（HTTP 为 80，HTTPS 为 443）来授予对其资源的访问权限，则通常会省略该端口。否则是强制性的。

> 不使用 Authority 的 URL 的一个示例是邮件客户端 ( mailto:foobar )。它包含一个 Authority 但不使用Authority。因此，冒号后面没有两个斜杠，仅充当方案和邮件地址之间的分隔符。

#### 资源路径

`/path/to/myfile.html` 是服务器上资源的路径。在 Web 的早期，这样的路径代表服务器上的物理文件位置，在文件读取中也可以代表具体需要的资源路径。

#### 参数

`?key1=value1&key2=value2` 是提供给服务器的额外参数。这些参数是用 & 符号分隔的键/值对列表。 Web 服务器可以在返回资源之前使用这些参数执行额外的操作。每个 Web 服务器都有自己的有关参数的规则。

#### 锚点

`#SomewhereInTheDocument` 是资源本身另一部分的锚点。锚点代表资源内的一种“书签”，为浏览器提供显示位于该“书签”位置的内容的指示。例如，在 HTML 文档中，浏览器将滚动到定义锚点的位置；在视频或音频文档上，浏览器将尝试转到锚点代表的时间。值得注意的是，# 后面的部分，也称为片段标识符，永远不会随请求发送到服务器。

# NSURL

根据Apple的官方文档，NSURL提供了对于符合RFC标准（包括RFC 1808, RFC 1738, and RFC 2732）的URL相关方法的封装。开发者可以使用 URL 对象来构造 URL 并访问各个部分。对于表示本地文件的 URL还可以直接操作这些文件的属性，例如更改文件的上次修改日期，还可以将 URL 对象传递给其他 API 以检索这些 URL 的内容。

URL 对象是**引用本地文件的首选方式**。大多数从文件读取数据或向文件写入数据的对象都具有接受NSURL对象而不是路径名作为文件引用的方法。例如，开发者可以使用`init With Contents Of URL: encoding: error: initializer`将本地文件 URL 的内容作为NSString对象获取，或者使用`init With Contents Of URL: options: error: initializer`作为NSData对象。

日常开发中还会使用 URL 进行应用程序间通信。例如在iOS中， `UIApplication`类提供了`open URL: options: completion Handler:`方法，在剪贴板获取时也会使用到 URL。

官方文档还包含了对沙盒设计中security-scoped URL的描述，可以说是任何一个点都足够写一篇文章来介绍了。

## URL结构

NSURL对象由两部分组成：一个可能为nil的`baseURL` 和一个相对于`baseURL` 解析的字符串 `urlString`。如果NSURL对象的字符串部分在没有baseURL的情况下完全解析，则该对象被认为是绝对URL；所有其他 URL 均被视为相对 URL。

```objc
@interface NSURL: NSObject <NSSecureCoding, NSCopying>
{
    NSString *_urlString;
    NSURL *_baseURL;
    void *_clients;
    void *_reserved;
}
```

NSURL 重写了`- isEqual: `方法，判断条件是，当两个 NSURL 对象的 ` baseURL` 和 `urlString` 都相同时，就认为它们是相等的。

例如，在构造NSURL对象时，可以指定` file:///path/user/`作为基本 URL，并将draft/demo.png 作为字符串部分，如下所示：

```
NSURL *baseURL = [NSURL fileURLWithPath:@"file:///path/user/"];
NSURL *URL = [NSURL URLWithString:@"draft/demo.png" relativeToURL:baseURL];
NSLog(@"absoluteURL = %@", [URL absoluteURL]);
```

根据前文所述，URL 也可以根据其结构分为多个部分，例如URL `https://johnny:p4ssw0rd@www.example.com:443/script.ext;param=value?query=value#ref`包含以下 URL 组件：

| Component       | Value               |
| :-------------- | :------------------ |
| scheme          | https               |
| user            | johnny              |
| password        | p4ssw0rd            |
| host            | www.example.com     |
| port            | 443                 |
| path            | /script.ext         |
| pathExtension   | ext                 |
| pathComponents  | ["/", "script.ext"] |
| parameterString | param=value         |
| query           | query=value         |
| fragment        | ref                 |

和URI的区分在于区分了`parameterString`和`query`，具体在于分隔符的不同，具体代码大家应该都在日常开发中使用过，这里不会列举所有的方法。

```objc
NSURL *url = [NSURL URLWithString:
 @"https://johnny:p4ssw0rd@www.example.com:443/script.ext;param=value?query=value#ref"];
NSLog(@“Scheme: %@”, [url scheme]);
NSLog(@“Host: %@”, [url host]);
NSLog(@“Port: %@”, [url port]);
NSLog(@“Path: %@”, [url path]);
NSLog(@“Relative path: %@”, [url relativePath]);
NSLog(@“Path components%@”, [url pathComponents]);
NSLog(@“Parameter string: %@”, [url parameterString]);
NSLog(@“Query: %@”, [url query]);
NSLog(@“Fragment: %@”, [url fragment]);
```

## 不好的尝试

在部分业务中文件地址都以`NSString`进行传递，会存在以下问题

1. 容易出错:
   - 字符串拼接容易出错，例如忘记添加斜杠或误加斜杠。
   - 手动处理特殊字符（如空格、问号、百分号等）容易导致错误，可能需要URL编码。
2. 缺乏验证:
   - NSString 本身不进行任何形式的URL验证，可能导致无效的或错误格式的URL。
3. 缺乏便捷方法: - NSString没有直接的方法来获取URL的各个部分（如`scheme`、`host`、`path`、`query`等），需要手动解析和处理。
   例如以下就是我们业务中的典型代码

```
NSString *baseURL = @"https://www.example.com";
NSString *path = @"path with spaces";
NSString *fullURL = [NSString stringWithFormat:@"%@/%@", baseURL, path];

// 需要手动处理编码
NSString *encodedURL = [fullURL stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]];
NSURL *url = [NSURL URLWithString:encodedURL];
```

## NSURLComponents

` NSURL` 是一个不可变的对象，主要用于表示URL；`NSURLComponents` 是一个可变对象，设计用于构建和解析URL。与`NSURL`不同，它允许你更改URL的各个部分，并在更改后重新构建URL，例如可以单独设置或修改`scheme`、`host`、`path`等等。

```
NSURL *url = [NSURL URLWithString:@"https://www.example.com/path?query=item#fragment"];
NSString *scheme = [url scheme]; // "https"
NSString *host = [url host]; // "www.example.com"
NSString *path = [url path]; // "/path"
NSString *query = [url query]; // "query=item"
NSString *fragment = [url fragment]; // "fragment"

NSURLComponents *components = [NSURLComponents new];
components.scheme = @"https";
components.host = @"www.example.com";
components.path = @"/path";
components.query = @"query=item";
components.fragment = @"fragment";
url = components.URL;
```

### 可能会遇到的坑

Apple的文档里面写了“NSURLComponents类根据RFC 3986解析 URL，它的行为与NSURL类略有不同，后者符合旧的 RFC”，但根据[NSURL最新的文档](https://developer.apple.com/documentation/foundation/nsurl?language=objc)，表述为“对于在 iOS 17 或之后以及一致的操作系统版本上链接的应用程序， NSURL解析已从过时的 RFC 1738/1808 解析更新为与NSURLComponents相同的RFC 3986解析。这统一了NSURL和NSURLComponents API 的解析行为。”
所以这篇博客[《NSURL is a bad host》](https://lapcatsoftware.com/articles/NSURL.html)提到的问题不复存在了，但前提就是行为在iOS 17以上生效，原文给出了这样一个例子。

```
int main(int argc, const char *argv[]) {
  @autoreleasepool {
    NSString *ipv6 = @"http://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:80/index.html";
    NSURL *url = [NSURL URLWithString:ipv6];
    NSURLComponents *components1 = [NSURLComponents componentsWithString:ipv6];
    NSURLComponents *components2 = [NSURLComponents componentsWithURL:url resolvingAgainstBaseURL:NO];
    NSLog(@"%@", [url host]);
    NSLog(@"%@", [components1 host]);
    NSLog(@"%@", [components2 host]);
  }
  return 0;
}
```

对应执行结果为

```
FEDC:BA98:7654:3210:FEDC:BA98:7654:3210 // iOS 17之前返回的结果
[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210] // NSURLComponents 是正确的
[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210] // NSURLComponents 是正确的
```

## URL(Swift)

Foundation 框架的 Swift 覆盖提供了桥接到`NSURL`类的`URL` struct，基本使用方式和 Objective-C 保持相同，从便捷性上可以使用 Swift 的`async` `await`语法属性异步访问URL的内容。

## 引用

- https://developer.apple.com/documentation/foundation/nsurl
- https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL
- https://en.wikipedia.org/wiki/URL
- https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
- https://en.wikipedia.org/wiki/File_URI_scheme
- https://lapcatsoftware.com/articles/NSURL.html
- https://www.jianshu.com/p/38f5f53dfbad
