---
title: Objective-C 学习笔记(七）
date: 2020-04-19 23:43:20
categories: 
- tech
tags: 
- iOS
- Xcode
- Objective-C
copyright: true
---

最近开始学习 `Objective-C` 夯实基础，在此处总结可以方便本人更好地整理学习内容，此文为本系列的第七篇文章，主要复习了 `Objective-C` Foundation 框架中文件操作内容。

<!--more-->

### NSFileManager
NSFileManager 类能够完成以下对于文件的操作
- 创建一个新文件
- 从现有文件中读取数据
- 将数据写入文件
- 重命名文件
- 删除文件
- 测试文件是否存在
- 确定文件的大小和其他属性
- 复制文件
- 测试两个文件的内容是否相同
其中大部分操作对于目录同样适用同样，然而调用的方法不同。

首先给出常见的 NSFileManager文件方法
![](http://images.stephenfang.xyz/mweb/15872236886233.jpg)

attributesOfItemAtPath:path 方法返回一个包含指定文件属性的字典,属性字典包括各种信息，如文件的所有者、文件大小、文件的创建日期等。字典的每个属性可以通过键值提取，而所有的键都定义在头文件<Foundation/NSFileManager.h>中,如表示文件大小的键值为NSFileSize，以下列举了一部分常见属性。
```
   NSFileAttributeKey const NSFileType; ：
   NSFileAttributeType const NSFileTypeDirectory;
   NSFileAttributeType const NSFileTypeRegular;
   NSFileAttributeKey const NSFileSize;
   NSFileAttributeKey const NSFileModificationDate;  //修改时间
   NSFileAttributeKey const NSFileCreationDate; //创建时间
```
使用以上方法在示例代码中实现了一些当前目录下的简单文件功能，须确保当前目录下 test.txt 已创建。
```objc
#import <Foundation/Foundation.h>

int main(int argc, char *argv[]){
    @autoreleasepool {
        NSString *fName = @"test.txt";
        NSString *nName = @"copy.txt";
        NSFileManager *fm;
        NSDictionary *attr;
        
        fm = [NSFileManager defaultManager];
        
        if([fm fileExistsAtPath:fName] == NO){
            NSLog(@"File does not exist!");
            return 1;
        }
        
        if([fm copyItemAtPath:fName toPath:nName error:NULL] == NO){
            NSLog(@"File copy failed!");
            return 2;
        }
        
        if ([fm contentsEqualAtPath:fName andPath:nName] == NO){
            NSLog(@"Files are not equal");
            return 3;
        }
        if([fm moveItemAtPath:nName toPath:@"new.txt" error:NULL] == NO){
            NSLog(@"File renamed failed");
            return 4;
        }
        
        if((attr = [fm attributesOfItemAtPath:fName error:NULL]) == nil){
            NSLog(@"Couldn't get file attributes!");
            return 5;
        }
        
        NSLog(@"File size is %llu bytes",[[attr objectForKey:NSFileSize] unsignedLongLongValue]);
        
        if([fm removeItemAtPath:fName error:NULL] == NO){
            NSLog(@"File removal failed");
            return 6;
        }
        
        NSLog(@"All operations success!");
    }
    return 0;
}

```
书中给出了常见的 NSFileManager 目录方法
![](http://images.stephenfang.xyz/mweb/15872698118240.jpg)

moveItemAtPath:toPath:方法可以将文件从一个目录移到另一个目录中，如果两个路径引用同一目录中的文件，其结果为重命名这个文件。使用示例代码实现了部分目录操作如下所示：

```objc
#import <Foundation/Foundation.h>

int main(int argc, char *argv[]){
    @autoreleasepool {
        NSString *dname = @"testdir";
        NSString *path;
        NSFileManager *fm;
        
        fm = [NSFileManager defaultManager];
        
        path = [fm currentDirectoryPath];
        NSLog(@"Current Directory is: %@",path);
        
        if([fm createDirectoryAtPath:dname withIntermediateDirectories:YES attributes:nil error:NULL] == NO){
            NSLog(@"Couldn't create directory!");
            return 1;
        }
        
        if([fm moveItemAtPath:dname toPath:@"newdir" error:NULL] == NO){
            NSLog(@"Directory rename failed!");
            return 2;
        }
        
        if([fm changeCurrentDirectoryPath:@"newdir"] == NO){
            NSLog(@"Change directory failed!");
            return 3;
        }
        
        path = [fm currentDirectoryPath];;
        NSLog(@"Current Directory is: %@",path);
        
        NSLog(@"All operation completed.");
    }
    return 0;
}
```

### NSData
在Foundation框架的 NSData 中提供了缓冲区的使用方式，包括设置缓冲区、数据读入缓冲区、将缓冲区数据写入文件等。
使用 NSFileManager 对象的 contentsAtPath: 方法能够接收一个路径名,并将指定文件内容读入该方法创建的存储区，若读取成功则返回存储区对象，否则返回nil。方法 createFileAtPath: contents: attributes: 创建特定属性的文件并将指定的 NSData 对象内容写入该文件中。
```objc
#import <Foundation/Foundation.h>

int main(int argc, char *argv[]){
    @autoreleasepool {
        NSFileManager *fm;
        NSData *data;
        
        data = [fm contentsAtPath:@"new.txt"];
        
        if(data == nil){
            NSLog(@"File read failed!");
            return 1;
        }
        
        if([fm createFileAtPath:@"another.txt" contents:data attributes:nil] == NO){
            NSLog(@"Couldn't create the copy!");
            return 2;
        }
        
        NSLog(@"File successfully copied.");
    }
    return 0;
}
```
使用enumeratorAtPath: 方法或者 contentsOfDirectoryAtPath:error: 方法都可以完成枚举过程。如果使用前者，一次可以枚举指定目录中的每个文件，默认情况下，如果其中一个文件为目录，那么也会递归枚举它的内容。
```objc
while ((path = [dirEnum nextObject]) != nil) (
NSLog (@"%@"，path);
[fm fileExistsAtPath: path isDirectory: &flag];
if (flag == YES)
[dirEnum skipDescendents] ;
}
```
使用 isDirectory 方法检验文件是否为目录，通过发送 skipDescendents 消息可以动态组织递归过程，不再枚举目录中的内容。
下面的代码使用两种方式枚举指定目录中的内容。
```objc
#import <Foundation/Foundation.h>

int main(int argc, char *argv[]){
    @autoreleasepool {
        NSString *path;
        NSFileManager *fm;
        NSDirectoryEnumerator *dm;
        NSArray *array;
        
        fm = [NSFileManager defaultManager];
        
        path = [fm currentDirectoryPath];
        dm = [fm enumeratorAtPath:path];
        NSLog(@"Contents in current path.");
        
        //method 1
        while ((path = [dm nextObject]) != nil) {
            NSLog(@"%@",path);
        }
        
        //method 2
        array = [fm contentsOfDirectoryAtPath:[fm currentDirectoryPath] error:NULL];
        NSLog(@"Contents in current path.\n");
        for (path in array) {
            NSLog(@"%@",path);
        }
    }
    return 0;
}
```

###NSPathUtilities
书中给出了常见的 NSPathUtilities 路径方法表。其中 components 是一个 NSArray 对象，包含路径每一部分的字符串对象；path是一个字符串对象，指定文件的路径; ext 是路径扩展名的字符串对象。
![](http://images.stephenfang.xyz/mweb/15872706497596.jpg)
![](http://images.stephenfang.xyz/mweb/15872707108256.jpg)
以下为一段简单的 NSPathUtilities Demo代码：
```objc
#import <Foundation/Foundation.h>

int main(int argc, char *argv[]){
    @autoreleasepool {
        NSString *path,*temp,*home;
        NSFileManager *fm;
        NSArray *components;
 
        fm = [NSFileManager defaultManager];
        
        path = [fm currentDirectoryPath];
        NSLog(@"Current directory:%@",path);
        
        temp = NSTemporaryDirectory();
        NSLog(@"Temporary directory: %@",temp);
        
        home = NSHomeDirectory();
        NSLog(@"Home directory: %@",home);
        components = [home pathComponents];
        
        for (path in components) {
            NSLog(@"%@",path);
        }
    }
    return 0;
}
```
### NSFileHandle
使用 NSFileHandle 方法可以实现如下操作
- 打开一个文件，执行读、写、更新操作
- 在文件中查找指定位置
- 从文件中读取特定数目的字节
- 将指定数目的字节写入文件中

处理文件的一般步骤为
1. 打开文件，并获取一个NSFileHandle对象
2. 对打开的文件执行I/O操作
3. 关闭文件

下图中给出了部分常用的NSFileHandle方法
![](http://images.stephenfang.xyz/mweb/15872843161853.jpg)
以下为一段简单的 NSFileHandle Demo代码：
```objc
#import <Foundation/Foundation.h>

int main(int argc, char *argv[]){
    @autoreleasepool {
        NSFileHandle *inFile,*outFile;
        NSData *data;
        
        inFile = [NSFileHandle fileHandleForReadingAtPath:@"test.txt"];
        if(inFile == nil){
            NSLog(@"Open input file failed.");
            return 1;
        }
        
        outFile = [NSFileHandle fileHandleForWritingAtPath:@"out.txt"];
        if(outFile == nil){
            NSLog(@"Open output file failed");
            return 2;
        }
        
        [outFile seekToEndOfFile];
        
        data = [inFile readDataToEndOfFile];
        [outFile writeData: data];
        
        [inFile closeFile];
        [outFile closeFile];
        
        NSLog(@"%@",[NSString stringWithContentsOfFile:@"out.txt" encoding:NSUTF8StringEncoding error:NULL]);
    }
    return 0;
}

```
从输出可知，第一个文件的内容成功地附加到第二个文件的末尾。
若 seekToEndOfFile 方法到达文件的末尾并且没有读到任何数据，那么将返回一个空的 NSData 对象，通过对该 NSData 对象应用 length 方法，测试其长度是否等于零判断文件是否为空，或者查看该文件中是否还有数据可以读取。
打开一个需要更新的文件，文件的偏移量应设为文件的开始。通过在文件中定位(seeking)可以更改偏移量，然后执行该文件的读写操作。因此，要定位到文件的第10字节，可以编写如下消息表达式，此时文件的句柄为 databaseHandle。
```objc
[databaseHandle seekToFileOffset: 10];
```
通过获得当前文件的偏移量，然后加上或者减去这个值，就得到相应文件的位置。
跳过文件中当前位置之后的128字节需要使用如下代码:
```objc
[databaseHandle seekToFileOffset:[databaseHandle offsetInFile] + 128];
```
### 其他
书本中列出了部分 iOS 常用目录，内容略微过时但仍有参考意义。
![](http://images.stephenfang.xyz/mweb/15872707572198.jpg)

### 参考
[iOS中的文件管理（一）—— NSFileManager基础](https://www.jianshu.com/p/be80c46ab731)
[Objective-C 程序设计 (第六版)]()