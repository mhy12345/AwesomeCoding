<template>
    <el-container>
        <router-view style="margin: auto"
                     @logined="handleLogined" @logout="handleLogout"
                     :user="user"></router-view>
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
