<template>
    <el-card class="box-card" v-loading="loadingQ">
        <div slot="header" class="clear-fix">
            <h1>{{ title }}</h1>
        </div>
        <div @keydown.enter="handleSignUp">
            <!--Registration Info-->
            <el-row v-for="(value, key, index) in heads" :key="index">
                <el-col :span="8" class="register-prompt">
                    <label :for="key">
                        <i class="el-icon-caret-right" slot="prepend"></i>
                        {{ heads[key] }}：
                    </label>
                </el-col>
                <el-col :span="15">
                    <el-input v-if="key === 'password' || key === 're_password'"
                              :id="key"
                              type="password"
                              clearable
                              class="input-box"
                              v-model="inputs[key]"
                              :placeholder="heads[key]">
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
                              :placeholder="heads[key]">
                    </el-input>
                </el-col>
            </el-row>
            <!--Verification Code-->
            <el-row>
                <el-col :span="8" class="register-prompt">
                    <label for="verify_code">
                        <i class="el-icon-caret-right" slot="prepend"></i>
                        手机验证码：
                    </label>
                </el-col>
                <el-col :span="7">
                    <el-input-number
                        id="verify_code"
                        ref="verify_input"
                        :min="100000" :max="999999"
                        :controls="false"
                        class="input-box"
                        v-model="inputs.verify_code"
                        @focus="handleFocusingOnVerify">
                    </el-input-number>
                </el-col>
                <el-col :span="7" class="verification-button">
                    <el-button
                        type="primary"
                        :disabled="verify.disableQ"
                        @click="handleVerification">
                        {{ verify.prompt }}
                    </el-button>
                </el-col>
            </el-row>

        </div>
        <div align="center">
            <el-row>
                <el-button type="success" class="register-button" @click="handleSignUp">注册</el-button>
            </el-row>
        </div>
    </el-card>
</template>

<script>
    /* eslint-disable camelcase,no-undef,no-unused-vars */

    import {registerSQL, queryPhoneSQL} from "../../../utils/DoSQL";
    import axios from 'axios'
    var root_url = require('../../../../config/http_root_url');

    export default {
        name: "SignUp",
        data() {
            return {
                title: '欢迎注册',
                heads: { // 输入框提示词
                    nickname: '用户名',
                    realname: '真实姓名',
                    role: '身份',
                    email: '邮箱',
                    phone: '手机号',
                    motto: '签名',
                    password: '密码',
                    re_password: '重复密码',
                },
                inputs: { // 输入框的信息
                    nickname: '',
                    realname: '',
                    role: '',
                    email: '',
                    phone: '',
                    motto: '',
                    password: '',
                    re_password: '',
                    verify_code: undefined,
                },
                verify: {
                    code_generated: '',
                    prompt: '发送验证码',
                    countdown: 60,
                    disableQ: false,
                },
                loadingQ: false,
                icon_urls: {
                    administrator: require('../../../assets/images/icons/administrator.png'),
                    student: require('../../../assets/images/icons/student.png'),
                    teacher: require('../../../assets/images/icons/teacher.png'),
                }
            };
        },
        methods: {
            handleVerification: function () {
                var clock;
                if (this.inputs.phone <= 10000000000 || this.inputs.phone >= 19999999999) {
                    this.$message("请输入中国大陆11位手机号");
                    return;
                }
                queryPhoneSQL(this, this.inputs).
                    then((resp) => {
                        if(resp.status === 'SUCCESS.') {
                            this.$message("该手机号已被注册");
                            return; 
                        }
                        //若已注册，则发送验证码
                        else {
                            clock = window.setInterval(() => {
                            this.verify.disableQ = true;
                            this.verify.countdown--;
                            this.verify.prompt = this.verify.countdown + 's后重新发送';
                            if (this.verify.countdown <= 0) {
                                window.clearInterval(clock);
                                this.verify.disableQ = false;
                                this.verify.prompt = '重新发送验证码';
                                this.verify.countdown = 60;
                            }
                        }, 1000);

                        this.$message.warning("验证码已发送！请注意查收");
                        /*
                        下一语句将自动获取验证码输入框的焦点，这种$ref的用法在Vue里面很常用
                        建议参考：https://github.com/ElemeFE/element/issues/3871
                        */
                        this.$refs.verify_input.focus();

                        let nowpath = root_url + '/api/user/verification';
                        console.log(nowpath);
                        axios.post(nowpath, {
                            number: this.inputs.phone
                        })
                        .then((resp) => {
                            console.log(resp);
                            this.verify.code_generated = parseInt(resp.data.code_generated);
                            console.log(this.verify.code_generated);
                        });

                        }    
                    }).
                    catch((resp) => {
                        if(resp.status === 'FAILED.') {
                            this.$message("该手机号还未被注册");
                            return; 
                        }   
                    });
                
            },
            handleSignUp: function () {
                console.log(this.inputs.verify_code);
                console.log(this.verify.code_generated);
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
                if (this.inputs.password !== this.inputs.re_password) {
                    this.$message("两次输入的密码不同。");
                    return;
                }
                if (this.inputs.verify_code !== this.verify.code_generated) { // todo 移到后端
                    this.$message("验证码不正确，请重试。");
                    return;
                }
                this.loadingQ = true; // 加载等待圈
                registerSQL(this, this.inputs).
                then((resp) => {
                    console.log(resp);
                    this.loadingQ = false;
                    this.$message.success("注册成功！");
                    this.$emit('logined', this.inputs); // 通知父级路由已注册
                    this.$router.push('/user/profile');
                }).
                catch((resp) => {
                    console.log(resp);
                    this.loadingQ = false;
                    if (resp.details === 'DUPLICATION_OF_REGISTRATION.') {
                        this.$message.error("注册失败，用户名已存在！");
                    } else if (resp.details === 'ALREADY_LOGIN.') {
                        this.$message.error("注册失败，用户已登录！");
                    } else {
                        this.$message.error("注册失败，未知错误！" + JSON.stringify(resp.details));
                    }
                });
            },
            handleFocusingOnVerify() {
                this.inputs.verify_code = undefined;
            }
        }
    };
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

    .verification-button {
        position: relative;
        margin-left: 20px;
    }

    .input-error {
        background-color: #ffa392;
        margin-bottom: 20px;
    }

    .register-prompt {
        position: relative;
        margin-top: 5px;
    }

    .option-icon {
        float: right;
        height: 80%;
    }
</style>
