<template>
    <el-card class="box-card" v-loading="loadingQ">
        <div slot="header" class="clear-fix">
            <span>{{title}}</span>
        </div>
        <el-row>
            <el-col :span="8" class="register-prompt">手机号</el-col>
            <el-col :span="15">
                <el-input class="input-box" v-model="inputs.phone">
                </el-input>
            </el-col>
        </el-row>    
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
                <el-col :span="5" class="verification-button">
                    <el-button
                        type="primary"
                        :disabled="verify.disableQ"
                        @click="handleVerification">
                        {{ verify.prompt }}
                    </el-button>
                </el-col>
        </el-row>
        <div align="center">
            <el-row>
                <el-button type="success" class="register-button" @click="handleForgetPassword">找回密码</el-button>
            </el-row>
        </div>
    </el-card>
</template>


<script>
    /* eslint-disable camelcase */

    import {forgetPasswordSQL, queryPhoneSQL} from '../../../utils/DoSQL';
    import axios from 'axios'
    export default {
        name: "ForgetPassword",
        data() {
            return {
                title: '找回密码',
                inputs: {
                    phone: '',
                    verify_code: undefined,
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
            handleForgetPassword: function () {
                // 判断该手机是否已注册以及验证码是否合法
                this.loadingQ = true;
                forgetPasswordSQL(this, this.inputs).
                    then((resp) => {
                        console.log(resp);
                        this.loadingQ = false;
                        this.$router.push('/user/sign_in');
                    }).
                    catch((resp) => {
                        
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
        margin-top: 30px;
        margin-bottom: 30px;
    }

    .login-button {
        margin-top: 30px;
        margin-bottom: 30px;
        width: 200px;
    }
</style>