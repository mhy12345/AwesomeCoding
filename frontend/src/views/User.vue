<template>
    <el-container>
        <el-header style="margin-bottom: 50px;">
            <h1>这里是用户登录/注册页面</h1>
        </el-header>

        <el-main style="margin: auto;">
            <router-view @logined="handleLogined"></router-view>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "User",
        methods: {
            handleLogined() {
                // console.log('>>>in user logined!');
                this.$emit('logined');
            }
        }
    }
</script>

<style scoped>

</style>