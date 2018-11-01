<template>
    <el-card class="box-card" v-loading="loadingQ">
        <div slot="header" class="clear-fix">
            <span>{{title}}</span>
        </div>
        <div @keydown.enter="handleForgetPassword">
            <el-input placeholder="用户名..." v-model="inputs.nickname" class="input-box" clearable></el-input>
        </div>
        <div align="center">
            <el-row>
                <el-button type="primary" class="login-button" @click="handleForgetPassword">发送新密码</el-button>
            </el-row>
        </div>
    </el-card>
</template>


<script>
    /* eslint-disable camelcase */

    import {forgetPasswordSQL} from '../../../utils/DoSQL';

    export default {
        name: "ForgetPassword",
        data() {
            return {
                title: '找回密码',
                inputs: {
                    nickname: ''
                },
                loadingQ: false,
                expire_secs: 360, // cookie 的有效期
            };
        },
        methods: {
            handleForgetPassword: function () {
                // TODO 实现忘记密码
                this.loadingQ = true;
                forgetPasswordSQL(this, this.inputs).
                    then((resp) => {
                        console.log(resp);
                        this.loadingQ = false;
                        this.$router.push('/user/sign_in');
                    }).
                    catch((resp) => {
                        
                    });     
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
        margin-top: 30px;
        margin-bottom: 30px;
    }

    .login-button {
        margin-top: 30px;
        margin-bottom: 30px;
        width: 200px;
    }
</style>