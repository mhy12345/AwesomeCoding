<template>
	<el-dialog title="新建选择题" 
			   :visible="visible"
			   v-loading='loading'
			   >
			   <el-form :model="info">
				   <el-form-item label="题目编号" label-width=120px>
					   <el-input v-model="info.problem_id" autocomplete="off" disabled></el-input>
				   </el-form-item>
				   <el-form-item :label="'选项'+item" label-width=120px v-for='item of ["A","B","C","D"]'>
					   <el-input v-model="info.choices[item]" autocomplete="off"></el-input>
				   </el-form-item>
			   </el-form>
			   <div slot="footer" class="dialog-footer">
				   <el-button @click="handleCancel">取 消</el-button>
				   <el-button type="primary" @click="handleChecked">保 存</el-button>
			   </div>
	</el-dialog>
</template>

<script>

export default {
	data: function() {
		return {
			visible: false,
			loading: false,
			info: {
				class_id: null,
				problem_id: null,
				choices: {
					A: null,
					B: null,
					C: null,
					D: null
				}
			}
		}
	},
	methods: {
		handleOpen: function(problem_id) {
			this.info.problem_id = problem_id;
			this.visible = true;
			this.loading = false;
			console.log("INIT",this.info);
		},
		handleCancel: function() {
			this.visible = false;
		},
		handleChecked: function() {
			console.log("CHECKED>>>");
			this.$emit('handle_complete',this.info);
			this.visible = false;
		},
		handleClose: function(done) {
			this.$confirm('确认关闭？')
				.then(_ => {
					console.log("CONFIRMED");
					this.visible = false;
					done();
				})
				.catch(_ => {
				});
		}
	}
}
</script>
