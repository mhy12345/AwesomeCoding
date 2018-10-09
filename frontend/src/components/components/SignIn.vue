<template>
    <el-card class="box-card" v-loading="loading">
        <div slot="header" class="clearfix">
            <span>{{title}}</span>
        </div>
        <div @keydown.enter="signIn">
            <el-input placeholder="用户名..." v-model="inputs.nickname" class="inputbox" clearable></el-input>
            <el-input placeholder="密码..." v-model="inputs.password" class="inputbox" type="password" clearable></el-input>
        </div>
        <div align="center">
            <el-row><el-button type="primary" class="loginbutton" @click="signIn">登录</el-button></el-row>
            <el-row><el-button type="text" @click="forget">忘记密码</el-button></el-row>
        </div>
    </el-card>
</template>

<script>
    import {loginSQL} from '../../utils/DoSQL'
    import {getCookie, createCookie} from "../../utils/Cookie";

    export default {
        name: "SignIn",
        data() {
            return {
                title: '欢迎登录',
                inputs: {
                    nickname: '',
                    password: ''
                },
                loading: false,
                expire_secs: 360,         // cookie 的有效期 TODO 改为 1 天或更多
            }
        },
        methods: {
            signIn: function () {
                this.loading = true;
                // this.$http.post('')
                loginSQL(this, this.inputs).
                then((resp) => {
                    console.log(resp);
                    var cookie = {
                        nickname: resp.results.nickname,
                        password: resp.results.password,
                        realname: resp.results.realname,
                    };
                    createCookie(cookie, this.expire_secs);     // TODO use session
                    // console.log('Login!', getCookie());
                    this.loading = false;
                    this.$message.success("登录成功，欢迎回来！" + resp.results.realname);
                }).
                catch((resp) => {
                    console.log(resp);
                    this.loading = false;
                    if (resp.status === 'WRONG_PASSWORD.') {
                        this.$message.error("登录失败，密码错误！");
                    }
                    else if (resp.status === 'USER_NOT_FOUND.') {
                        this.$message.error("登录失败，用户名不存在！");
                    }
                    else this.$message.error("登录失败，未知错误！" + JSON.stringify(resp.details));
                });
            },
            forget: function () {
                // TODO send forget info
                this.loading = true;
            }
        }
    }
</script>

<style scoped>
    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

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
    .inputbox{
        margin-top: 30px;
        margin-bottom: 30px;
    }
    .loginbutton{
        margin-top: 30px;
        margin-bottom: 30px;
        width: 200px;
    }
</style>
