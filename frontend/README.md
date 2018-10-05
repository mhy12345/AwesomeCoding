# Frontend

在开始之前可以学习以下内容

* 关于[饿了么前端](http://element-cn.eleme.io/#/zh-CN/guide/design)
* 关于[vue.cli](https://cli.vuejs.org/guide/)

## Project setup（此段由vue.cli提供）
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

## 实现原理

前端使用vue-cli实现（并安装了饿了吗UI的插件），其中集成了webpack的功能，使得由vue构建的所有前端代码可以打包成静态文件（包括html文件、js文件、图片文件等）。运行`npm run build`即可构建这些静态文件；运行`npm run serve`即可在构建文件的同时在本机运行自带的服务器，方便本机调试

在Dockerfile中有以下几行：

```
COPY frontend /frontend		  
WORKDIR /frontend           
RUN npm install        
RUN npm run build              
```
其中 `RUN npm run build`用来在后台部署时自动抽取出代码中的静态文件并保存好

## 前端学习指南
by 郑逢时

欢迎你入坑前端设计！在这段有趣而又脱发的旅程开始之前，先学一些前端技能树还是必要的：）
技能树是这样长的：JavaScript -> Vue.js -> Vue CLI -> Element UI
### JavaScript
不必多说，大家都会
[JS教程](http://www.w3school.com.cn/js/)

### Vue.js
一种新兴的网页前端开发语言，基于JavaScript，将html和JavaScript的功能进行了封装；

增添了如事件监听、控件生命周期、动画等很多概念，在后期非常有用；

Vue.js和js在前端的关系相当于Node.js和js在后端的关系。

* [Vue.js官方教程](https://cn.vuejs.org/v2/guide/index.html)
* [Vue.js视频教学网站](https://scrimba.com/playlist/pXKqta)

建议花≤一个下午的时间学习Vue.js的基础语法，就进入下一环节，先不忙学习组件高级、动画等高级教程。

### Vue CLI
可以直译为前端开发脚手架，是开发大型前端项目的常用工具；

可以理解成将Vue.js的脚本、网页、样式有机地整合起来，形成一整个工程；

CLI和Vue.js的关系好比Express和Node.js的关系；

CLI的特色文件是.vue文件（这里的Vue是后缀名，不是Vue.js）。
每个.vue文件内都有`<template>`，`<script>`和`<style>`括起来的三部分：

* `<template>`用来写Vue的网页代码，
* `<script>`用来写Vue.js脚本，
* `<style>`用来写样式表（不过通常这里都留空白，样式通常在`element-variables.css`里面统一管理，这样就有了所谓的主题）。

不同的.vue文件之间又可以通过`import`和`export`相互关联，CLI就是这样实现模块化的。

* [Vue CLI的官方教程](https://cli.vuejs.org/zh/guide/)
* [Vue CLI构建的详细流程](https://blog.csdn.net/wulala_hei/article/details/80488674)

相关的pack你只需要了解webpack、router就够了，然后进入最后章节。

### Element UI
这一部分的内容是重中之重的。为什么重要？

一个很重要的原因是，前面你用Vue.js写了好几十行代码实现的功能，一个饿了么UI的控件就可以轻松搞定，而且颜值还比你的酷得多……
与其大费周章地写代码，不如站在巨人的肩膀上；）

Element UI不只提供前端的外观、主题，它还提供了相当多有用的、美观的、智能的控件（比如能自动排序、条纹显示、自动导入数据的表格），
甚至还提供网页布局的模板（比如你只需要一句`<el-header>`就能轻松制作网页页眉），非常好用，而且扩展功能很多。

建议你花足够多的时间在饿了么UI的官网学习。

* [Element UI的官方教程](https://cli.vuejs.org/zh/guide/)
* [Element UI与iViews对比](https://www.jianshu.com/p/5cee11d69b70)

## frontend说明
by 郑逢时

实现了数据库api的前端界面。
### 前端功能

    1. 通过数据库名调用数据库，以表格的形式显示；
    2. 支持修改某一行的数据；
    3. 支持删除某一行的数据；
    4. 支持在数据库尾部添加一行数据；
    5. 若操作失败，会将错误信息以弹窗的形式告知用户。

### 项目大纲
* 前端的整体框架（目前只有一个标题栏）在`frontend/src/App.vue`
* 查询功能模块在`frontend/src/components/DataVisualizer.vue`中，请配合注释食用
* 查询功能导入的js：`frontend/src/components/js`，其下有两个js，一个是手写的JSON浅拷贝、深拷贝的代码，一个是和服务端数据库交互的ajax代码
* 前端build时的入口：`frontend/src/main.js`
* 路由函数：`frontend/src/router.js`
* 全局样式及主题配置：`frontend/src/element-variables.scss`
* 静态页面目标目录：`frontend/dist`

## 静态页面的路由问题
使用`npm run build`构建静态页面，虽然能省去前端服务器，但会使前端路由无法使用，从而导致刷新页面易出现404错误。

该问题的解决方法见[这里](https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E5%90%8E%E7%AB%AF%E9%85%8D%E7%BD%AE%E4%BE%8B%E5%AD%90)
