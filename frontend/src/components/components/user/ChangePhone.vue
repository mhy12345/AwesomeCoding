<template>
    <el-card class="box-card" v-loading="loadingQ">
        <div slot="header" class="clear-fix">
            <h1>{{ title }}</h1>
        </div>
        <div @keydown.enter="handleChangePassword">
            <el-row>
                <el-col :span="8" class="register-prompt">
                    <label>
                        <i class="el-icon-caret-right" slot="prepend"></i>
                        新手机号:
                    </label>
                </el-col>
                <el-col :span="14">
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
            </el-row>

            <el-row>
                <el-col :span="8" class="register-prompt">
                    <label>
                        <i class="el-icon-caret-right" slot="prepend"></i>
                        验证原手机：
                    </label>
                </el-col>
                <el-col :span="7">
                    <el-input-number
                        ref="verify_input"
                        :min="100000" :max="999999"
                        :controls="false"
                        class="input-box"
                        v-model="inputs.priVerifyCode"
                        @focus="handleFocusingOnVerify">
                    </el-input-number>
                </el-col>
                <el-col :span="7" class="verification-button">
                    <el-button
                        type="primary"
                        :disabled="oldverify.disableQ"
                        @click="handleVerification">
                        {{ oldverify.prompt }}
                    </el-button>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="8" class="register-prompt">
                    <label>
                        <i class="el-icon-caret-right" slot="prepend"></i>
                        验证新手机：
                    </label>
                </el-col>
                <el-col :span="7">
                    <el-input-number
                        ref="verify_input"
                        :min="100000" :max="999999"
                        :controls="false"
                        class="input-box"
                        v-model="inputs.newVerifyCode"
                        @focus="handleFocusingOnVerify">
                    </el-input-number>
                </el-col>
                <el-col :span="7" class="verification-button">
                    <el-button
                        type="primary"
                        :disabled="newverify.disableQ"
                        @click="handleVerification">
                        {{ newverify.prompt }}
                    </el-button>
                </el-col>
            </el-row>

        </div>
        <div align="center">
            <el-row>
                <el-button type="success" class="register-button" @click="handleChangePassword">修改手机号</el-button>
            </el-row>
        </div>
    </el-card>
</template>


<script>
    /* eslint-disable camelcase */

    import {forgetPasswordSQL, queryPhoneSQL, changePasswordSQL} from '../../../utils/DoSQL';
    import axios from 'axios';
    var root_url = require('../../../../config/http_root_url');

    export default {
        name: "ChangePhone",
        data () {
            return {
                title: '修改手机号',
                inputs: {
                    newPhoneNumber: '',
                    priVerifyCode: undefined,
                    newVerifyCode: undefined,
                    password: undefined,
                    re_password: undefined,
                    userid: undefined,
                },
                oldverify: {
                    code_generated: '',
                    prompt: '发送验证',
                    countdown: 60,
                    disableQ: false,
                },
                newverify: {
                    code_generated: '',
                    prompt: '发送验证',
                    countdown: 60,
                    disableQ: false,
                },
                loadingQ: false,
                expire_secs: 360, // cookie 的有效期
            };
        },
        methods: {
            handleChangePassword: function () {
                // 修改密码
                if(this.inputs.password !== this.inputs.re_password) {
                    this.$message.warning("密码不一致");
                    return;
                }
                changePasswordSQL(this, this.inputs).
                    then((resp) => {
                        window.location.href = "/user/sign_in";
                    }).
                    catch((resp) => {
                        if (resp.details === 'WRONG_VERIFICATION_CODE.') {
                            this.$message.error("修改密码失败，验证码不正确！");
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
                            axios.post(nowpath, {number: this.inputs.phone})
                                  .then((resp) => {
                                //this.verify.code_generated = parseInt(resp.data.code_generated);
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
            handleFocusingOnVerify () {
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
