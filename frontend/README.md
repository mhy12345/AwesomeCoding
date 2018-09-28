# frontend

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

##实现原理

前端使用vue-cli实现（并安装了饿了吗UI的插件），其中集成了webpack的功能，使得由vue构建的所有前端代码可以打包成静态文件（包括html文件、js文件、图片文件等）。运行`npm run build`即可构建这些静态文件；运行`npm run serve`即可在构建文件的同时在本机运行自带的服务器，方便本机调试

在Dockerfile中有以下几行：

```
COPY frontend /frontend		  
WORKDIR /frontend           
RUN npm install        
RUN npm run build              
```
其中 `RUN npm run build`用来在后台部署时自动抽取出代码中的静态文件并保存好

在前端`app.js`文件中有如下一行：

```
app.use(express.static(path.join(__dirname, '../frontend/dist')));

```

其目的是将前端目录下所有静态文件暴露在用户视野中，在访问网站的时候可以任意访问。