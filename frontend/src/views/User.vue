<template>
    <el-container>
        <el-header style="margin-bottom: 50px;">
            <h1>这里是用户页面</h1>
        </el-header>
        <el-main style="margin: auto">
            <router-view @logined="handleLogined" @logout="handleLogout"
                         :user="user"></router-view>
        </el-main>
    </el-container>
</template>

<script>
    /* eslint-disable camelcase */

    export default {
        name: "User",
        props: ['user'],
        methods: {
            handleLogined (user_info) {
                this.$emit('logined', user_info);
            },
            handleLogout () {
                this.$emit('logout');
            },
        }
    };
</script>

<style scoped>

</style>
