<template>
    <el-card class="box-card">
        <div slot="header" class="clear-fix">
            <span>{{ title }}</span>
        </div>
    </el-card>
</template>

<script>
    export default {
        name: "Settings",
        data() {
            return {
                title: "这里是用户设置页面",
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

    .clear-fix:before,
    .clear-fix:after {
        display: table;
        content: "";
    }
    .clear-fix:after {
        clear: both
    }

    .box-card {
        width: 480px;
    }
    .input-box {
        /*width: 80%;*/
        margin-bottom: 20px;
    }
</style>