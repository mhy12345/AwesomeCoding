# AsesomeCoding

## 注意事项

开始编辑项目之前，你需要知道下面的东西——

* 什么是[.gitignore](https://www.cnblogs.com/ShaYeBlog/p/5355951.html)文件.
* 什么是[.dockerignore](https://docs.docker.com/engine/reference/builder/)文件.
* 不要随意修改[.gitlab-ci.yml](https://gitlab.secoder.net/help/ci/yaml/README#configuration-of-your-jobs-with-gitlab-ciyml).
* 工程模板[nodejs-examples](https://gitlab.secoder.net/SECoder-Examples/nodejs-example).
* master分支部署后，可以在[这里](https://awesomecoding_fantastic67.app.secoder.net)看到成果.


## 数据库支持

* api/show\_table?table\_name=NAME 列出表NAME的数据
* api/do\_query?sql=SQL 执行SQL语句

如果看不懂我的代码，建议先学一下nodejs异步的流程。

命令举例：

```
https://awesomecoding_fantastic67.app.secoder.net/api/show_table?table_name=users
https://awesomecoding_fantastic67.app.secoder.net/api/do_query?sql=INSERT%20INTO%20users%20(nickname,role,password)%20values%20(%27mhy%27,1,%27123%27)
```
