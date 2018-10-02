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

## 数据库查看器
作者：郑逢时

已编写了数据库api查询功能的前端界面初稿，通过前端的根url可以访问。
查询功能的前端模板在`frontend/src/components/DataVisualizer.vue`中，配有一定的注释。

跨域问题的解决方案目前有二：

    1. 在用户的chrome浏览器里安装allow controal插件，以阻止浏览器的CORS保护，从而实现跨域访问，但这种方案不太合理。
    2. 通过调webpack配置，使用代理服务器访问服务端。实现有一定难度，需要用到webpack包。
    3. 通过合并前端后端的服务器，在同一个域名下运行，直接回避跨域的问题。

**目前使用的方案是3.**

* 关于[CORB的插件解决方案](https://blog.csdn.net/a1333888/article/details/52575325)
* 关于[代理服务器方法](https://blog.csdn.net/qq_26222859/article/details/54645996)