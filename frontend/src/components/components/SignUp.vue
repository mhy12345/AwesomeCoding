<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>{{title}}</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
        </div>
        <div>

        </div>
    </el-card>
</template>

<script>
    export default {
        name: "SignUp",
        data() {
            return {
                title: '欢迎注册'
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
</style>