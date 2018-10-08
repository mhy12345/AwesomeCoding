<template>
    <el-card class="box-card" v-loading="loading">
        <div slot="header" class="clearfix">
            <span>{{title}}</span>
        </div>
        <div @keydown.enter="signIn">
            <el-input placeholder="用户名..." v-model="input.nickname" class="inputbox" clearable></el-input>
            <el-input placeholder="密码..." v-model="input.password" class="inputbox" type="password" clearable></el-input>
        </div>
        <div align="center">
            <el-row><el-button type="primary" class="loginbutton" @click="signIn">登录</el-button></el-row>
            <el-row><el-button type="text" @click="forget">忘记密码</el-button></el-row>
        </div>
    </el-card>
</template>

<script>
    import {loginSQL} from '../js/DoSQL'
    export default {
        name: "SignIn",
        data() {
            return {
                title: '欢迎登录',
                input: {
                    nickname: '',
                    password: ''
                },
                loading: false
            }
        },
        methods: {
            signIn: function () {
                // TODO send login info
                this.loading = true;
                loginSQL(this.input).then((resp) => {
                    console.log(resp);
                    this.loading = false;
                    this.$message.success("登录成功。");
                }).catch((resp) => {
                    console.log(resp);
                    this.loading = false;
                    if (resp.status === 'WRONG_PASSWORD.') {
                        this.$message.error("密码错误！");
                    }
                    else {
                        this.$message.error("用户名不存在！");
                    }
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