<template>
    <el-card class="box-card" v-loading="loadingQ">
        <div slot="header" class="clear-fix">
            <h1>{{ title }}</h1>
        </div>
        <div @keydown.enter="handleSignUp">
            <el-row v-for="(value, key, index) in inputs" :key="index">
                <el-col :span="8" class="register-prompt">
                    <label :for="key">
                        <i class="el-icon-caret-right" slot="prepend"></i>
                        {{ heads[index] }}：
                    </label>
                </el-col>
                <el-col :span="15">
                    <el-input v-if="key === 'password'"
                              :id="key"
                              type="password"
                              clearable
                              class="input-box"
                              v-model="inputs[key]"
                              :placeholder="heads[index]">
                    </el-input>
                    <el-select v-else-if="key === 'role'"
                               v-model="inputs[key]"
                               placeholder="请选择..."
                               class="input-box">
                        <el-option :value="0" label="管理员">
                            <span style="float: left">管理员</span>
                            <img :src="icon_urls.administrator" class="option-icon">
                        </el-option>
                        <el-option :value="1" label="教师">
                            <span style="float: left">教师</span>
                            <img :src="icon_urls.teacher" class="option-icon">
                        </el-option>
                        <el-option :value="2" label="学生">
                            <span style="float: left">学生</span>
                            <img :src="icon_urls.student" class="option-icon">
                        </el-option>
                    </el-select>
                    <el-input v-else
                              :id="key"
                              type="text"
                              clearable
                              class="input-box"
                              v-model="inputs[key]"
                              :placeholder="heads[index]">
                    </el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8" class="register-prompt">
                    <label for="re_password">
                        <i class="el-icon-caret-right" slot="prepend"></i>
                        确认密码：
                    </label>
                </el-col>
                <el-col :span="15">
                    <el-input id="re_password"
                              class="input-box"
                              type="password"
                              v-model="re_password"
                              placeholder="确认密码">
                    </el-input>
                </el-col>
            </el-row>

        </div>
        <div align="center">
            <el-row><el-button type="success" class="register-button" @click="handleSignUp">注册</el-button></el-row>
        </div>
    </el-card>
</template>

<script>
    import {registerSQL} from "../../../utils/DoSQL";

    export default {
        name: "SignUp",
        data() {
            return {
                title: '欢迎注册',
                heads: ['用户名', '真实姓名', '身份', '邮箱', '签名', '密码'],     // 输入框提示词
                inputs: {        // 输入框的信息
                    nickname: '',
                    realname: '',
                    role: '',
                    email: '',
					motto : '',
                    password: '',
                },
                re_password: '',
                loadingQ: false,
                icon_urls: {
                    administrator: require('../../../assets/images/icons/administrator.png'),
                    student: require('../../../assets/images/icons/student.png'),
                    teacher: require('../../../assets/images/icons/teacher.png'),
                }
            }
        },
        methods: {
            handleSignUp: function () {
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
                this.loadingQ = true;       // 加载等待圈
                registerSQL(this, this.inputs).
                then((resp) => {
                    console.log(resp);
                    this.loadingQ = false;
                    this.$message.success("注册成功！");
                    this.$emit('logined', this.inputs);      // 通知父级路由已注册
                    this.$router.push('/user/profile');
                }).
                catch((resp) => {
                    console.log(resp);
                    this.loadingQ = false;
                    if (resp.details === 'DUPLICATION_OF_REGISTRATION.')
                        this.$message.error("注册失败，用户名已存在！");
                    else if (resp.details === 'ALREADY_LOGIN.')
                        this.$message.error("注册失败，用户已登录！");
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
    .input-box {
        width: 100%;
        margin-bottom: 20px;
    }
    .register-button {
        margin-top: 30px;
        margin-bottom: 30px;
        width: 200px;
    }
    .input-error {
        background-color: #ffa392;
        margin-bottom: 20px;
    }
    .register-prompt {
        position:relative;
        margin-top: 5px;
    }

    .option-icon {
        float: right;
        height: 80%;
    }
</style>
