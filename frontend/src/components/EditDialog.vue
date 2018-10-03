<template>
    <el-dialog id="dialog-edit"
               title="修改行"
               :visible.sync="visible" width="50%">
        <el-input type="text" size="mini" style="width: 98%;"
                  v-for="(prompt, index) in heads"
                  v-model="input_item[index]"
                  :placeholder="prompt">
        </el-input>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false; confirm = false">取 消</el-button>
            <el-button type="primary" @click="visible = fasle; confirm = true">确 认</el-button>
        </span>
    </el-dialog>
</template>

<script>

export default {
    name: "EditDialog",
    data() {
        return {
            row: {},
            visible: false,
            confirm: false
        }
    }
}
</script>

<style scoped>

</style>