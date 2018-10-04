<template>
    <div id="test-view">
        <!--以下为对话框数据传输测试-->
        <el-button @click="createDialog" type="success">打开对话框</el-button>
        <EditDialog :config="dialog" @dialogClose="handleClose">
            <div slot="h1">这是标题的插槽</div>
            这是段落的插槽
        </EditDialog>
        <el-input style="width: 50%;" placeholder="输入的内容" v-model="input"></el-input>
        <hr>
        <el-button @click="showColumn = !showColumn">展开动画</el-button>
        <transition name="el-fade-in-linear">
            <div align="center" v-show="showColumn">
                <div class="transition-box">el-collapse-transition</div>
                <div class="transition-box">el-collapse-transition</div>
            </div>
        </transition>
        <div align="center" style="margin-top: 20px; height: 200px;">
            <el-collapse-transition>
                <div v-show="showColumn" class="transition-box">el-collapse-transition</div>
            </el-collapse-transition>
        </div>
    </div>
</template>

<script>
import EditDialog from '../components/EditDialog'
// import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
// import Vue from 'vue'
//
// Vue.component(CollapseTransition.name, CollapseTransition);
export default {
    name: 'Test',
    data () {
        return {
            input: '',
            dialog: {
                title: '一个平凡的标题',
                content: '一个平凡的段落。',
                visible: false,
                input: '',
                response: false
            },
            showColumn: true
        }
    },
    methods: {
        createDialog: function () {
            this.dialog.visible = true;
            this.dialog.input = this.input;
        },
        handleClose: function () {
            console.log("对话框关闭。");
            if (this.dialog.response === true)
                this.input = this.dialog.input;
        }
    },
    components: {
        EditDialog,
        // CollapseTransition
    }
}
</script>

<style scoped>
    .transition-box {
        margin-bottom: 10px;
        width: 200px;
        height: 100px;
        border-radius: 4px;
        background-color: #409EFF;
        text-align: center;
        color: #fff;
        padding: 40px 20px;
        box-sizing: border-box;
        margin-right: 20px;
    }
</style>