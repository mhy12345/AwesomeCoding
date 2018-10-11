<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>{{ title }}</span>
        </div>
        <div>
            <h2>用户信息：</h2>
            <p>用户名：{{ user.nickname }}</p>
            <p>真实姓名：{{ user.realname }}</p>
        </div>
    </el-card>
</template>

<script>
    export default {
        name: "Profile",
        props: ['user'],
        data() {
            return {
                title: '这里是用户个人页面Profile'
            }
        },
        beforeMount() { // 此处换成由父级路由传参来完成user参数的填充
            this.$message("params: " + JSON.stringify(this.user.nickname, null, 3));
        },
        methods: {

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
