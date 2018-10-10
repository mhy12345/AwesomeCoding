<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>{{ title }}</span>
        </div>
        <div>
            <h2>用户信息：</h2>
            <p>用户名：{{ user.nickname }}</p>
            <p>真实姓名：{{ user.realname }}</p>
        </div>
    </el-card>
</template>

<script>
    export default {
        name: "Profile",
        data() {
            return {
                title: '这里是用户个人页面Profile',
                user: {
                    nickname: '加载中...',
                    realname: '加载中...'
                },
            }
        },
        beforeMount() { // todo 此处换成由父级路由传参来完成user参数的填充
            // todo simplify into '/login/is_login'
            // this.$http.get('http://127.0.0.1:8888/api/login/is_login').
            this.$http.get('/api/user/session').
            then((resp) => {
                console.log(resp);
                if (typeof(resp.body.nickname) != 'undefined') {
                    this.user = resp.body;
                }
                else
                    this.$message("请登录。");
            }).
            catch((err) => {
                console.log(err);
                this.$message.error("未知错误。" + JSON.stringify(err, null, 3));
            });
        }
    }
</script>

<style scoped>

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 480px;
    }
</style>
