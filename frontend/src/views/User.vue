<template>
    <el-container>
        <el-header style="margin-bottom: 50px;">
            <h1>这里是用户页面</h1>
        </el-header>
        <el-main style="margin: auto; width: 50%;">
            <router-view @logined="handleLogined" :user="user"></router-view>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "User",
        props: ['user'],
        methods: {
            handleLogined(user_info) {
                console.log('>>>in user logined!');
                this.$emit('logined', user_info);
            },
        }
    }
</script>

<style scoped>

</style>