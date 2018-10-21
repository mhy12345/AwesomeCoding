<template>
    <el-dialog id="dialog-test"
               :title="config.title"
               :visible.sync="config.visible"
               @open="handleOpened"
               @close="$emit('dialogClose')">
        <h1>
            <slot name="h1"></slot>
        </h1>
        <p></p>
        <slot></slot>
        <p></p>
        <el-input placeholder="输入..." v-model="config.input"></el-input>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="confirm">确 认</el-button>
        </span>
    </el-dialog>
</template>

<script>
    export default {
        name: "EditDialog",
        props: {config: Object},
        methods: {
            handleOpened: function () {
                console.log('对话框开启。');
            },
            cancel: function () {
                this.config.visible = false;
                this.config.response = false;
            },
            confirm: function () {
                this.config.visible = false;
                this.config.response = true;
            }
        }
    };
</script>

<style scoped>

</style>
