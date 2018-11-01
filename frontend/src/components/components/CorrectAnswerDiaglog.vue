<template>
	<el-dialog title="编辑题目" 
			   :visible="visible"
			   v-loading='loading'
			   >
			   <el-form :model="form">
				   <el-form-item label="题目编号" label-width=120px>
					   <el-input v-model="problem_id" autocomplete="off" disabled></el-input>
				   </el-form-item>
				   <el-form-item label="题目名称" label-width=120px>
					   <el-input v-model="form.name" autocomplete="off"></el-input>
				   </el-form-item>
				   <el-form-item label="答案" label-width=120px>
					   <el-input v-model="form.answer" autocomplete="off"></el-input>
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
			problem_id: null,
			form: {
				alias: '',
				answer: '',
				state: 0,
			}
		}
	},
	methods: {
		handleOpen: function(problem_id) {
			console.log("Open dialog with ",problem_id);
			this.problem_id = problem_id;
			this.visible = true;
			/*
			this.loading = true;
			this.$http.post('/api/problem/get',{problem_id:problem_id}).
				then(function(res) {
					this.form.answer = res.body.answer;
					this.form.state = res.body.state;
					this.form.alias = res.body.alias;
					this.loading = false;
				}).
				catch(function(res) {
					this.loading = false;
					this.$message("无法获取题目信息!");
				});*/
		},
		handleCancel: function() {
			this.visible = false;
		},
		handleChecked: function() {
			this.loading = true;
			this.$http.post('/api/problem/save',
				{
					problem_id: this.problem_id,
					state: 0,
					alias: this.form.alias,
					answer: this.form.answer,
				}).
				then(function(res) {
					console.log('>>>',this);
					this.$message('成功');
					this.visible = false;
				}).
				catch(function(res) {
					this.$message('失败');
					this.visible = false;
				});
		},
		handleClose: function(done) {
			this.$confirm('确认关闭？')
				.then(_ => {
					console.log("CONFIRMED");
					this.visible = false;
					done();
				})
				.catch(_ => {
					this.visible = false;
				});
		}
	}
}
</script>
