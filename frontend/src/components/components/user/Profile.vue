<template>
    <el-card class="box-card">
        <div slot="header" class="clear-fix">
            <span>{{ title }}</span>
        </div>
        <div>

            <el-row :gutter="20">
                <el-col :span="16"><div class="grid-content bg-purple"></div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
                <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
                <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
                <el-col :span="16"><div class="grid-content bg-purple"></div></el-col>
                <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="24">
                    <div class="grid-content bg-purple"><h2>用户信息：</h2></div>
                </el-col>
            </el-row>
            <el-row :gutter="40">
                <el-col :span="6">
                    <img :src="user.gravatar_url" class="avatar-icon" alt="用户头像">
                </el-col>
                <el-col :span="10">
                    <p>真实姓名：{{ user.realname }}</p>
                    <p>用户名：{{ user.nickname }}</p>
                </el-col>
            </el-row>
        </div>
    </el-card>
</template>

<script>
    export default {
        name: "Profile",
        props: ['user'],
        data() {
            return {
                title: '这里是用户个人页面'
            }
        },
        methods: {

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
        width: 100%;
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


    .el-row {
        margin-bottom: 20px;
    &:last-child {
         margin-bottom: 0;
     }
    }
    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
</style>
