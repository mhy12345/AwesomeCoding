<template>
	<div v-loading='loading'>
		<el-row :gutter='20'>
			<el-col :span='24'>
				<el-table
					:data="problemData"
					style="width: 100%"
					:row-class-name="tableRowClassName">
					<el-table-column
						prop="index"
						label="编号"
						width="60">
					</el-table-column>
					<el-table-column
						prop="title"
						label="题目"
						width="200">
					</el-table-column>
					<el-table-column
						prop="type_title"
						label="类型"
						width='80'
						>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button
								size="mini"
								@click="handleEdit(scope.$index, scope.row)">编辑</el-button>
							<el-button 
								size="mini"
								@click='handleContentEditByPID(scope.row,"description")'>描述</el-button>
							<el-button
								size="mini"
								@click="handlePreview(scope.$index, scope.row)">预览</el-button>
							<el-button
								size="mini"
								@click="handleAnalyze(scope.$index, scope.row)">统计</el-button>
							<el-button
								size='mini'
								@click="handlePublish(scope.$index, scope.row)">发布</el-button>
							<el-button
								size="mini"
								type="danger"
								@click="handleDelete(scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-col>
		</el-row>
		<el-row>
			<el-button @click='handleCreate(0)'> 选择题 </el-button>
			<el-button @click='handleCreate(1)'> 程序题 </el-button>
		</el-row>
		<ChoiceProblemDialog ref='dialog_choice' @completed='handleChoiceDialogCompleted'> </ChoiceProblemDialog>
		<ProgramProblemDialog ref='dialog_program' @completed='handleProgramDialogCompleted'> </ProgramProblemDialog>
		<ContentEditor ref='content_editor'> </ContentEditor>
		<Preview ref='prob_preview'> </Preview>
		<Analyze ref='prob_analyze'> </Analyze>
	</div>
</template>

<script>
import ContentEditor from '@/components/components/ContentEditor.vue';
import ChoiceProblemDialog from '@/components/resources/dialogs/ChoiceProblem.vue';
import ProgramProblemDialog from '@/components/resources/dialogs/ProgramProblem.vue';
import Preview from '@/components/resources/dialogs/Preview.vue';
import Analyze from '@/components/resources/dialogs/Analyze.vue';

export default {
	data: function () {
		return {
			loading: false,
			class_id: this.$route.params.class_id,
			problemData: []
		};
	},
	props: ['course_status'],
	mounted: function () {
		this.$http.post('/api/problem/list',{class_id: this.class_id}).
			then(function(res) {
				this.problemData = res.body.results;
				this.problemData.forEach(function (item, index) {
					item.index = index+1; 
					if (item.type == 0) item.type_title = '选择题';
					if (item.type == 1) item.type_title = '程序题';
				});
			}).
			catch(function(err) {
				this.$message(err);
			});
	},
	computed: {},
	methods: {
		tableRowClassName: function({row, rowIndex}) {
			return '';
		},
		handlePublish: function(idx, row) {
			this.$socket.emit('alert',{
				operation: 'PROBLEM_PUBLISH.',
				course_id: this.class_id,
				problem_code: row.code
			});
			this.$message("题目已经发布!");
		},
		handleDelete: function(row)  {
			this.$http.post('/api/problem/delete', {code: row.code}).
				then((res) => {
					window.location.href = window.location.href;
				}).
				catch((err) => {
				});
		},
		handleAnalyze: function(idx, row) {
			this.$refs.prob_analyze.handleOpen(row);
		},
		handleChoiceDialogCompleted: function(obj) {
			this.problemData[obj.index].title = obj.title;
			this.$http.post('/api/problem/save',{
				code: obj.info.code,
				state: obj.state,
				title: obj.title
			}).
				then((res) => {}).
				catch((err) => {});
		},
		handleProgramDialogCompleted: function(obj) {
			this.problemData[obj.index].title = obj.title;
			this.$http.post('/api/problem/save',{
				code: obj.code,
				state: obj.state,
				title: obj.title
			}).
				then((res) => {}).
				catch((err) => {});
		},
		handleContentEditByPID: function(info,field) {
			let ptype = undefined;
			if (info.type == 0) ptype = 'choice_problems';
			else if (info.type == 1) ptype = 'program_problems';
			else console.log("未知类别",info);
			this.$http.post('/api/problem/table/'+ptype+'/get',{code: info.code }).
				then((res) => {
					let content_id = res.body.results[0][field];
					this.$refs.content_editor.handleOpen(content_id);
				}).
				catch((err) => {
					this.$message("未知错误");
					console.log("未知错误",err);
				});
		},
		handleCreate: function(ptype) {
			this.loading = true;
			this.$http.post('/api/problem/create',{class_id: this.class_id, type: ptype}).
				then((res) => {
					return this.$http.post('/api/problem/list', {class_id: this.class_id});
				}).
				then((res) => {
					this.problemData = res.body.results;
					this.problemData.forEach(function (item, index) {
						item.index = index+1; 
						if (item.type == 0) item.type_title = '选择题';
						if (item.type == 1) item.type_title = '程序题';
					});
					this.loading = false;
				}).
				catch((err) => {
					this.loading = false;
				});
		},
		handleEdit: function(idx, row) {
			let dialog_id = null;
			if (row.type == 0) dialog_id = 'dialog_choice';
			if (row.type == 1) dialog_id = 'dialog_program';
			this.$refs[dialog_id].handleOpen(idx,row);
		},
		handlePreview: function(idx, row) {
			this.$refs.prob_preview.handleOpen(row);
		},
	},
	components : {
		ChoiceProblemDialog: ChoiceProblemDialog,
		ProgramProblemDialog: ProgramProblemDialog,
		ContentEditor: ContentEditor,
		Preview: Preview,
		Analyze: Analyze,
	},
}
</script>

<style>
.correct-answer-button {
}

.analyze-button {
}

.submit-area {
	display: none;
}
</style>
