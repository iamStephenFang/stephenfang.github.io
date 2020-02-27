---
title: Design+Code 的 Vue.js 课程学习摘录
date: 2020-02-11 01:20:20
categories: 
- tech
tags: 
- Vue.js
- 前端框架
---

## 配置组件的data属性

课程初提及的定义**data**的方法经过测试不可行，即如下代码片段。

```js
<script>
export default {
  name: "SignIn",
  data: {
    isDarkMode: true
  },
  methods: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
    }
  }
};
</script>
```

**data** 包含可以在触发组件更新的数据。
**methods** 包含可以触发数据更改的函数。

后文中解释了需要作出的更改：

>为了让效果工作，我们需要的data属性是一个函数。这是 Vue组件的规则，并不是`App.vue`的规则。因此需要将当前数据属性替换为：

```js
data() {
  return {
      isDarkMode: true
  }
},
```

经查阅官方文档，了解到 data 必须是一个函数。

>当我们定义 <button-counter> 组件时，你可能会发现它的 data 并不是直接提供一个对象，取而代之的是，一个组件的 data 选项必须是一个函数，因此每个实例可以维护一份被返回对象的独立的拷贝。如果 Vue 没有这条规则，点击一个按钮就可能会影响到其它所有实例。

解释得非常清楚，学习 `Vue.js` 等前端技术或许可以速成，但文档一定是不可或缺的一块。

## 配置全局样式

可以在CSS `<style> `的开头导入`.css`文件，但对其进行配置可以使其用于整个项目的 Vue 文件。
`vue.config.js` 是一个可选的配置文件，如果项目的 (和 `package.json` 同级的) 根目录中存在这个文件，那么它会被 `@vue/cli-service` 自动加载。[官方文档](https://cli.vuejs.org/zh/config/#chainwebpack)详细解释了全局 CLI 配置方法。
教程指导做的是在项目的根目录中创建一个名为`vue.config.js`的文件，并且在此输入以下配置：

```js
// vue.config.js
module.exports = {
    css: {
        loaderOptions: {
            sass: {
                data: `
                    @import "@/global-styles/colors.scss";
                    @import "@/global-styles/typography.scss";
                `
            }
        }
    }
}
```

如果使用的是最新版本的 `Vue CLI`，尽管进行了到 **Vue CLI > in Project Tasks > serve** 重新运行任务，还是会提示报错无法运行。

新版本的 `Vue CLI` 提供了 `Dart Sass` 与 `node-sass` 两种类型的 Sass 配置，在`sass-loader`的[implementation](https://github.com/webpack-contrib/sass-loader)中两者有所不同。

原因在于在 `sass-loader ` v7 中，`prependData`选项名是 "data”，已经不适用。
默认情况下 `sass` 选项会同时对 `sass` 和 `scss` 语法同时生效，因为 `scss` 语法在内部也是由 sass-loader 处理的，但是在配置 `data` 选项的时候，`scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号。在这种情况下，我们可以使用 `scss` 选项，对 `scss` 语法进行单独配置。实例代码来自[官方文档](https://cli.vuejs.org/zh/guide/css.html#css-modules)。

```js
// vue.config.js
module.exports = {
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 假设存在 `src/variables.sass` 这个文件
        prependData: `@import "~@/variables.sass"`
      },
      scss: {
        prependData: `@import "~@/variables.scss";`
      }
    }
  }
}
```

## 未完待续