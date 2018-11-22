<template>
    <el-card class="box-card" v-loading="loadingQ">
        <div slot="header" class="clear-fix">
            <h1>{{ title }}</h1>
        </div>
        <div>
            notice:  修改成功后将会重新登录
        </div>
        <div @keydown.enter="handleChangePassword">
            <el-row>
                <el-col :span="8" class="register-prompt">
                    <label>
                        <i class="el-icon-caret-right" slot="prepend"></i>
                        新手机号:
                    </label>
                </el-col>
                <el-col :span="13">
                    <el-input type="text"
                              clearable
                              class="input-box"
                              v-model="inputs.newPhoneNumber">
                    </el-input>
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
                        v-model="inputs.priVerifyCode">
                    </el-input-number>
                </el-col>
                <el-col :span="7" class="verification-button">
                    <el-button
                        type="primary"
                        :disabled="oldVerify.disableQ"
                        @click="handleOldVerification">
                        {{ oldVerify.prompt }}
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
                        v-model="inputs.newVerifyCode">
                    </el-input-number>
                </el-col>
                <el-col :span="7" class="verification-button">
                    <el-button
                        type="primary"
                        :disabled="newVerify.disableQ"
                        @click="handleNewVerification">
                        {{ newVerify.prompt }}
                    </el-button>
                </el-col>
            </el-row>

        </div>
        <div align="center">
            <el-row>
                <el-button type="success" class="register-button" @click="handleChangePhone">修改手机号</el-button>
            </el-row>
        </div>
    </el-card>
</template>


<script>
    /* eslint-disable camelcase */

    import {queryPhoneSQL, changePhoneSQL} from '../../../utils/DoSQL';
    import axios from 'axios';
    var root_url = require('../../../../config/http_root_url');

    export default {
        name: "ChangePhone",
        props: ['user'],
        data () {
            return {
                title: '修改手机号',
                inputs: {
                    oldPhoneNumber: undefined,
                    newPhoneNumber: undefined,
                    priVerifyCode: undefined,
                    newVerifyCode: undefined,
                    userid: undefined,
                },
                oldVerify: {
                    code_generated: '',
                    prompt: '发送验证',
                    countdown: 60,
                    disableQ: false,
                },
                newVerify: {
                    code_generated: '',
                    prompt: '发送验证',
                    countdown: 60,
                    disableQ: false,
                },
                loadingQ: false,
                expire_secs: 720, // cookie 的有效期
            };
        },
        methods: {
            handleChangePhone: function () {
                this.inputs.oldPhoneNumber = this.user.phone;
                this.inputs.userid = this.user.user_id;
                changePhoneSQL(this, this.inputs).
                    then((resp) => {
                        this.$emit('logout');
                        this.$router.push('/home');
                    }).
                    catch((resp) => {
                        if (resp.details === 'WRONG_OLD_VERIFICATION_CODE.') {
                            this.$message.error("修改密码失败，原手机验证码不正确！");
                        } else if (resp.details === 'WRONG_NEW_VERIFICATION_CODE.') {
                            this.$message.error("修改密码失败，新手机验证码不正确");
                        }
                    });
            },
            handleOldVerification: function () {
                this.inputs.oldPhoneNumber = this.user.phone;
                let clock;
                clock = window.setInterval(() => {
                    this.oldVerify.disableQ = true;
                    this.oldVerify.countdown--;
                    this.oldVerify.prompt = this.oldVerify.countdown + 's后重新发送';
                    if (this.oldVerify.countdown <= 0) {
                        window.clearInterval(clock);
                        this.oldVerify.disableQ = false;
                        this.oldVerify.prompt = '重新发送验证码';
                        this.oldVerify.countdown = 60;
                    }
                }, 1000);

                this.$message.warning("原手机验证码已发送！请注意查收");
                this.$refs.verify_input.focus();
                let nowpath = '/api/user/verification';
                axios.post(nowpath, {number: this.inputs.oldPhoneNumber})
                      .then((resp) => {});
            },

            handleNewVerification: function () {
                let clock;
                if (this.inputs.newPhoneNumber <= 10000000000 || this.inputs.newPhoneNumber >= 19999999999 || this.inputs.newPhoneNumber === undefined) {
                    this.$message("请输入中国大陆11位手机号");
                    return;
                } else {
                    queryPhoneSQL(this, {phone: this.inputs.newPhoneNumber}).
                        then((resp) => {
                            if(resp.status === 'SUCCESS.') {
                                this.$message("该手机号已经被注册");
                                return ;
                            }
                        }).
                        catch((resp) => {
                            if(resp.status === 'FAILED.') {
                                clock = window.setInterval(() => {
                                    this.newVerify.disableQ = true;
                                    this.newVerify.countdown--;
                                    this.newVerify.prompt = this.newVerify.countdown + 's后重新发送';
                                    if (this.newVerify.countdown <= 0) {
                                        window.clearInterval(clock);
                                        this.newVerify.disableQ = false;
                                        this.newVerify.prompt = '重新发送验证码';
                                        this.newVerify.countdown = 60;
                                    }
                                }, 1000);

                                this.$message.warning("验证码已发送！请注意查收");
                                this.$refs.verify_input.focus();

                                let nowpath = '/api/user/verification';
                                axios.post(nowpath, {number: this.inputs.newPhoneNumber})
                                      .then((resp) => {
                                    //this.verify.code_generated = parseInt(resp.data.code_generated);
                                });
                            }
                        });
                }

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
