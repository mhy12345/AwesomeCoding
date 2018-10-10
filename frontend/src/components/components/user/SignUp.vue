<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>{{title}}</span>
        </div>
        <div @keydown.enter="signUp">
            <el-row v-for="(value, key, index) in inputs">
                <el-col>
                    <label :for="key">
                        <i class="el-icon-caret-right" slot="prepend"></i>
                        {{ heads[index] }}：
                    </label>
                </el-col>
                <el-col>
                    <el-input v-if="key === 'password'"
                              :id="key"
                              type="password"
                              clearable
                              class="inputbox"
                              v-model="inputs[key]"
                              :placeholder="heads[index]">
                    </el-input>
                    <el-input v-else
                              :id="key"
                              type="text"
                              clearable
                              class="inputbox"
                              v-model="inputs[key]"
                              :placeholder="heads[index]">
                    </el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <label for="re_password">
                        <i class="el-icon-caret-right" slot="prepend"></i>
                        确认密码：
                    </label>
                </el-col>
                <el-col>
                    <el-input id="re_password"
                              class="inputbox"
                              type="password"
                              v-model="re_password"
                              placeholder="确认密码">
                    </el-input>
                </el-col>
            </el-row>

        </div>
        <div align="center">
            <el-row><el-button type="success" class="registerbutton" @click="signUp">注册</el-button></el-row>
        </div>
    </el-card>
</template>

<script>
    import {registerSQL} from "../../../utils/DoSQL";
    // import {createCookie} from "../../utils/Cookie";

    export default {
        name: "SignUp",
        data() {
            return {
                title: '欢迎注册',
                heads: ['用户名', '真实姓名', '角色', '邮箱', '密码'],     // 输入框提示词
                inputs: {        // 输入框的信息
                    nickname: '',
                    realname: '',
                    role: '',
                    email: '',
					motto : '',
                    password: '',
                },
                re_password: '',
            }
        },
        methods: {
            signUp: function () {
                if (this.inputs.nickname === '') {
                    this.$message("用户名不能为空。");
                    return;
                }
                if (this.inputs.realname === '') {
                    this.$message("真实姓名不能为空。");
                    return;
                }
                if (this.inputs.role === '') {
                    this.$message("角色不能为空。");
                    return;
                }
                if (this.inputs.email === '') { // todo 用正则表达式校验邮箱的合法性
                    this.$message("邮箱不合法。");
                    return;
                }
                if (this.inputs.password.length < 6) {
                    this.$message("密码不能少于6位。");
                    return;
                }
                if (this.inputs.password !== this.re_password) {
                    this.$message("两次输入的密码不同。");
                    return;
                }
                registerSQL(this, this.inputs).
                then((resp) => {
                    console.log(resp);
                    // createCookie(resp.results);
                    this.$message.success("注册成功！");
                    this.$emit('logined');      // 通知父级路由已登录
                    this.$router.push('/');
                    // console.log(getCookie());
                }).
                catch((resp) => {
                    console.log(resp);
                    if (resp.details === 'DUPLICATION_OF_REGISTRATION.')
                        this.$message.error("注册失败，用户名已存在！");
                    if (resp.details === 'ALREADY_LOGIN.')
                        this.$message.error("注册失败，用户名已存在！");
                    else
                        this.$message.error("注册失败，未知错误！" + JSON.stringify(resp.details));
                });
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
    .inputbox {
        /*width: 80%;*/
        margin-bottom: 20px;
    }
    .registerbutton {
        margin-top: 30px;
        margin-bottom: 30px;
        width: 200px;
    }
    .inputerror {
        background-color: #ffa392;
        margin-bottom: 20px;
    }
</style>
