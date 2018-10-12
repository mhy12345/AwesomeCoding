<template>
    <el-card class="box-card" v-loading="loadingQ">
        <div slot="header" class="clear-fix">
            <span>{{title}}</span>
        </div>
        <div @keydown.enter="handleSignIn">
            <el-input placeholder="用户名..." v-model="inputs.nickname" class="input-box" clearable></el-input>
            <el-input placeholder="密码..." v-model="inputs.password" class="input-box" type="password" clearable></el-input>
        </div>
        <div align="center">
            <el-row><el-button type="primary" class="login-button" @click="handleSignIn">登录</el-button></el-row>
            <el-row><el-button type="text" @click="handleForgetPassword">忘记密码</el-button></el-row>
        </div>
    </el-card>
</template>

<script>
    import {loginSQL} from '../../../utils/DoSQL'
    // import {createCookie} from "../../utils/Cookie";

    export default {
        name: "SignIn",
        data() {
            return {
                title: '欢迎登录',
                inputs: {
                    nickname: '',
                    password: ''
                },
                loadingQ: false,
                expire_secs: 360,         // cookie 的有效期
            }
        },
        methods: {
            handleSignIn: function () {
                this.loadingQ = true;
                loginSQL(this, this.inputs).
                then((resp) => {
                    console.log(resp);
                    this.loadingQ = false;
                    this.$message.success("登录成功！" + resp.results.realname);
                    this.$emit('logined', resp.results);      // 通知父级已登录
                    this.$router.push('/');
                }).
                catch((resp) => {
                    console.log(resp);
                    this.loadingQ = false;
                    if (resp.details === 'WRONG_PASSWORD.') {
                        this.$message.error("登录失败，密码错误！");
                    }
                    else if (resp.details === 'USER_NOT_FOUND.') {
                        this.$message.error("登录失败，用户名不存在！");
                    }
                    else this.$message.error("登录失败，未知错误！" + JSON.stringify(resp.details));
                });
            },
            handleForgetPassword: function () {
                // TODO 实现忘记密码
                this.loadingQ = true;
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

    .clear-fix:before,
    .clear-fix:after {
        display: table;
        content: "";
    }
    .clear-fix:after {
        clear: both
    }

    .box-card {
        width: 480px;
    }
    .input-box{
        margin-top: 30px;
        margin-bottom: 30px;
    }
    .login-button{
        margin-top: 30px;
        margin-bottom: 30px;
        width: 200px;
    }
</style>
