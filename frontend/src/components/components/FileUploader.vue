<template>
	<el-form :model="ruleForm"
			 ref="ruleForm">
		<el-form-item label="上传文件">
			<el-upload class="upload-demo"
					   :on-success="successUpload"
						action="/api/file/upload" 
					   :on-remove="handleRemove"
					   :file-list="fileList">
				<el-button size="small"
						   type="primary">点击上传</el-button>
			</el-upload>
		</el-form-item>
		<el-form-item>
			<el-button type="primary"
					   @click="submitForm('ruleForm')">导出</el-button>
		</el-form-item>
	</el-form>
</template>
<script>
export default {
  data () {
      return {
          fileList: [],
          ruleForm: {
              fileList: []
          },
      }
  },
  methods: {
    handleRemove (file, fileList) {
        // 删除时在表单的某个字段里移除一个值
        let tmp = this.ruleForm.fileList
        let url = file.response.result[0].url
        if (tmp.includes(url)) {
            tmp.splice(tmp.findIndex(item => {
                return item === url
            }), 1)
        }
    },
    successUpload (response, file, fileList, $event) {
		console.log(">ASDSADASD");
      // 上传成功在表单的某个字段里加一个值
    },
    submitForm (formName) {
        // 使用fileList与服务端交互 该字段只包含服务端数据
    },
  }
}
</script>
