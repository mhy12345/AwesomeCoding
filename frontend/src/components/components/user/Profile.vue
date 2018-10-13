<template>
    <el-card class="box-card">
        <div slot="header" class="clear-fix">
            <span>{{ title }}</span>
        </div>
        <div>
            <el-row>
                <el-col :span="24">
                    <div class="grid-content bg-purple"><h2 align="center">用户信息：</h2></div>
                </el-col>
            </el-row>
            <el-row :gutter="40">
                <el-col :span="6">
                    <img :src="user.gravatar_url" class="avatar-icon" alt="用户头像">
                </el-col>
                <el-col :span="15" :offset="2">
                    <p>真实姓名： {{ user.realname }}</p>
                    <p>用户名： {{ user.nickname }}</p>
                    <span>身份： {{ role.text }} <img :src="role.icon_url" style="height: 40px;"/></span>
                    <p>邮箱： {{ user.email }}</p>
                    <p>签名： {{ user.motto }}</p>
                </el-col>
            </el-row>

            <el-tabs style="padding-bottom: 50px;" v-model="cur_tab">

                <el-tab-pane label="用户管理">
                    <el-row style="padding-top: 20px">
                        <el-col :span="12" align="center">
                            <el-button type="warning"
                                       size="small"
                                       style="width: 80%"
                                       @click="handleEdit">
                                编辑
                            </el-button>
                        </el-col>
                        <el-col :span="12" align="center">
                            <el-button type="danger"
                                       size="small"
                                       style="width: 80%"
                                       @click="handleLogout">
                                登出
                            </el-button>
                        </el-col>
                    </el-row>
                </el-tab-pane>

                <el-tab-pane label="我的动态">

                </el-tab-pane>
                <el-tab-pane label="我的资源"></el-tab-pane>
                <el-tab-pane label="我的课堂"></el-tab-pane>
            </el-tabs>


        </div>
    </el-card>
</template>

<script>
    export default {
        name: "Profile",
        props: ['user'],
        data() {
            return {
                title: '个人页面',
                cur_tab: '',
                role: {
                    text: '',
                    icon_url: '',
                },
            }
        },
        beforeMount() {
            console.log('role =', this.user.role);
            if (this.user.role === 0) {
                this.role.text = '管理员';
                this.role.icon_url = require('../../../assets/images/icons/administrator.png');
            }
            else if (this.user.role === 1) {
                this.role.text = '教师';
                this.role.icon_url = require('../../../assets/images/icons/teacher.png');
            }
            else if (this.user.role === 2) {
                this.role.text = '学生';
                this.role.icon_url = require('../../../assets/images/icons/student.png');
            }
            else {
                this.role.text = '未知身份';
            }
        },
        methods: {
            handleEdit() {
                this.$router.push('/user/settings');
            },
            handleLogout() {
                this.$emit('logout');
                this.$router.push('/home');
            },
        }
    }
</script>

<style scoped>

    .clear-fix:before,
    .clear-fix:after {
        display: table;
        content: "";
    }
    .clear-fix:after {
        clear: both
    }

    .box-card {
        width: 640px;
    }

    .avatar-icon {
        width: 100%;
        height: 100%;
        display: flex;
        border-radius: 100%;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        margin: 10px;
        border: 2px #dedede solid;
    }

</style>
