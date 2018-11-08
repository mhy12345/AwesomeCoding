<template>
   <el-card class="box-card" v-loading="loadingQ">
        <div slot="header" class="clear-fix">
            <h1>{{ title }}</h1>
        </div>
        <div @keydown.enter="handleSignIn">
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
                <el-button type="success" class="register-button" @click="handleSignIn">登录</el-button>
            </el-row>
            <el-row>
                <el-button type="text" @click="handleSignInbyNickname">用户名密码登录</el-button>
            </el-row>
        </div>
    </el-card>
</template>


<script>
    /* eslint-disable camelcase */

    import {forgetPasswordSQL, queryPhoneSQL, changePasswordSQL, loginSQL} from '../../../utils/DoSQL';
    import axios from 'axios';
    var root_url = require('../../../../config/http_root_url');

    export default {
        name: "SignInbyPhone",
        data() {
            return {
                heads: { // 输入框提示词
                    phone: '手机号',
                },
                title: '欢迎登录',
                inputs: {
                    phone: '',
                    verify_code: undefined,
                },
                user: {
                    nickname: '',
                    password: ''
                },
                verify: {
                    code_generated: '',
                    prompt: '发送验证码',
                    countdown: 60,
                    disableQ: false,
                },
                loadingQ: false,
                expire_secs: 360, // cookie 的有效期
            };
        },
        methods: {
            handleSignIn: function () {
                this.loadingQ = true;
                loginSQL(this, this.user).
                    then((resp) => {
                        console.log(resp);
                        this.loadingQ = false;
                        this.$message.success("登录成功！" + resp.results.realname);
                        this.$emit('logined', resp.results); // 通知父级已登录
                        this.$router.push('/user/profile');
                    }).
                    catch((resp) => {
                        console.log(resp);
                        this.loadingQ = false;
                        if (resp.details === 'WRONG_PASSWORD.') {
                            this.$message.error("登录失败，密码错误！");
                        } else if (resp.details === 'USER_NOT_FOUND.') {
                            this.$message.error("登录失败，用户名不存在！");
                        } else {
                            this.$message.error("登录失败，未知错误！" + JSON.stringify(resp.details));
                        }
                    });
            },
            handleVerification: function () {
                var clock;
                if (this.inputs.phone <= 10000000000 || this.inputs.phone >= 19999999999) {
                    this.$message("请输入中国大陆11位手机号");
                    return;
                }
                queryPhoneSQL(this, this.inputs).
                    then((resp) => {
                        if(resp.status === 'FAILED.') {
                            this.$message("该手机号还未被注册");
                            return; 
                        }
                        //若已注册，则发送验证码
                        else {
                            this.inputs.userid = resp.user.id;
                            this.user.nickname = resp.user.nickname;
                            this.user.password = resp.user.password;
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

                        let nowpath = '/api/user/verification';
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
            handleFocusingOnVerify() {
                this.inputs.verify_code = undefined;
            },
            handleSignInbyNickname: function () {
                window.location.href = "/user/sign_in";
                this.loadingQ = true;
            },
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