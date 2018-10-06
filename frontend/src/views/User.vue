<template>
    <el-container>
        <el-header style="margin-bottom: 50px;">
            <h1>这里是用户登录/注册页面</h1>
        </el-header>

        <el-main style="margin: auto;">
            <router-view></router-view>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "User"
    }
</script>

<style scoped>

</style>