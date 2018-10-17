# AsesomeCoding

## 注意事项

开始编辑项目之前，你需要知道下面的东西——

* 什么是[.gitignore](https://www.cnblogs.com/ShaYeBlog/p/5355951.html)文件.
* 什么是[.dockerignore](https://docs.docker.com/engine/reference/builder/)文件.
* 不要随意修改[.gitlab-ci.yml](https://gitlab.secoder.net/help/ci/yaml/README#configuration-of-your-jobs-with-gitlab-ciyml).
* 工程模板[nodejs-examples](https://gitlab.secoder.net/SECoder-Examples/nodejs-example).
* master分支部署后，可以在[这里](https://awesomecoding_fantastic67.app.secoder.net)看到成果.
* 修改任意接口后，确认所有依赖于该接口的功能都还是work的......其他不知道的人调起来真的很费劲


## 数据库支持

### 数据库连接

数据库配置文件位于`./configures/db_configures.js`中，其中，数据库`Database.fantastic67.secoder.local`只能在内网访问！为了本地调试方便，我们临时将本地和云端的服务器都指定为mhy12345.xyz，即公网数据库版本.

Docker局域网数据库版本——

```javascript
var configures = {
  host     : 'Database.fantastic67.secoder.local',
  user     : 'root',
  password : 'awesome-coding',
  database : 'ac_database'
}
module.exports = configures
```

公网数据库版本——

```javascript
var configures = {
  host     : 'mhy12345.xyz',
  user     : 'root',
  password : '123567',
  database : 'ac_database'
}
module.exports = configures
```

### 数据库API设计

* `api/show_table?table_name=NAME` 列出表NAME的数据
* `api/do_query?sql=SQL` 执行SQL语句

如果看不懂我的代码，建议先学一下nodejs异步的流程。

命令举例：

```
https://awesomecoding_fantastic67.app.secoder.net/api/show_table?table_name=users
https://awesomecoding_fantastic67.app.secoder.net/api/do_query?sql=INSERT%20INTO%20users%20(nickname,role,password)%20values%20(%27mhy%27,1,%27123%27)
```

## 前端调试说明

前端调试建议使用`npm run dev`，这样便于实时查看代码的效果，但这里的dev相当于新开了一个前端服务器，要实现api还需要运行后端服务器。

于是所有前端的http请求的url都需要修改为后端域名开头的。
为了方便，我添加了配置文件 `./frontend/config/http_root_url.js` ，这个文件导出了http请求的url头，上部分为本地测试版本（`npm run dev`），下部分为发布版本（或者是`npm run build`）版本，大家可以选择性屏蔽/开启，适应调试需求。
