<template>
    <el-card class="box-card" v-loading="loading">
        <div slot="header" class="clearfix">
            <span>{{ title }}</span>
        </div>
        <div>
            <p>用户信息：</p>
        </div>
    </el-card>
</template>

<script>
    export default {
        name: "Profile",
        data() {
            return {
                title: '这里是用户个人页面Profile'
            }
        }
    }
</script>

<style scoped>

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