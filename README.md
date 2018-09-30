# AsesomeCoding

## 注意事项

开始编辑项目之前，你需要知道下面的东西——

* 什么是[.gitignore](https://www.cnblogs.com/ShaYeBlog/p/5355951.html)文件.
* 什么是[.dockerignore](https://docs.docker.com/engine/reference/builder/)文件.
* 不要随意修改[.gitlab-ci.yml](https://gitlab.secoder.net/help/ci/yaml/README#configuration-of-your-jobs-with-gitlab-ciyml).
* 工程模板[nodejs-examples](https://gitlab.secoder.net/SECoder-Examples/nodejs-example).
* master分支部署后，可以在[这里](https://awesomecoding_fantastic67.app.secoder.net)看到成果.


## 数据库支持

### 数据库连接

数据库配置文件位于`./configures/db_configures.js`中，其中，数据库`Database.fantastic67.secoder.local`只能在内网访问！在本地可以替换为mhy12345.xyz，不过不要将这些配置push到远程仓库。

部署版本——

```javascript
var configures = {
  host     : 'Database.fantastic67.secoder.local',
  user     : 'root',
  password : 'awesome-coding',
  database : 'ac_database'
}
module.exports = configures
```

本地版本——

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

