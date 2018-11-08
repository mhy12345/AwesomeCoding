<template>
    <el-form :model="ruleForm"
             ref="ruleForm">
        <el-form-item label="上传文件">
            <el-upload class="upload-demo"
                       action="/api/file/upload"
                       :on-success="successUpload"
                       :on-remove="handleRemove"
                       :file-list="fileList">
                <el-button size="small"
                           type="primary">点击上传
                </el-button>
            </el-upload>
        </el-form-item>
        <!--<el-form-item>-->
            <!--<el-button type="primary"-->
                       <!--@click="submitForm('ruleForm')">导出-->
            <!--</el-button>-->
        <!--</el-form-item>-->
    </el-form>
</template>
<script>
    /* eslint-disable no-unused-vars,no-undef */

    export default {
        data () {
            return {
                fileList: [],
                ruleForm: {fileList: []},
            };
        },
        methods: {
            handleRemove (file, fileList) {
                // 删除时在表单的某个字段里移除一个值
                let tmp = this.ruleForm.fileList;
                let url = file.response.result[0].url;
                if (tmp.includes(url)) {
                    tmp.splice(tmp.findIndex(item => {
                        return item === url;
                    }), 1);
                }
            },
            successUpload (response, file, fileList, $event) {
                // 上传成功在表单的某个字段里加一个值
                if (response.message !== "File uploaded successfully") {
                    fileList.pop();
                    this.$message("文件上传失败！");
                }

            },
            submitForm (formName) {
                // just a test
                console.log(formName);
                this.$http.post('/api/file/download', {filename: "lecture11.pdf"}).
                     then(function (res) {
                         //how to save it?
                         console.log(res);
                         const blob = new Blob([res.data]);
                         if (window.navigator.msSaveOrOpenBlob) {
                             // 兼容IE10
                             navigator.msSaveBlob(blob, this.filename);
                         } else {
                             //  chrome/firefox
                             let aTag = document.createElement('a');
                             aTag.download = "flag.pdf";//this.filename;
                             aTag.href = URL.createObjectURL(blob);
                             aTag.click();
                             URL.revokeObjectURL(aTag.href);
                         }
                     });

            },
        }
    };
</script>
