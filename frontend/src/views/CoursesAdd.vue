<template>
	<el-container>
		<el-header>
			<h2>新建课程</h2>
		</el-header>
		<el-main>
			<el-form ref="form" :model="CourseData" label-width="140px">
				<el-form-item label="课程名称：">
					<el-input v-model="CourseData.title" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="课程权限：">
					<el-radio v-model="CourseData.type" label="1">公开</el-radio>
					<el-radio v-model="CourseData.type" label="2">私密</el-radio>
				</el-form-item>
				<el-form-item label="课程资源：">
					<el-transfer v-model="CourseData.resources" :data="avaliable_resources" :titles="['可用资源','已选资源']"></el-transfer>
				</el-form-item>
				<el-form-item label="课程简介：">
					<el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="CourseData.description"> </el-input>
				</el-form-item>
				<el-form-item>
				    <el-button type="primary" @click="onSubmit">立即创建</el-button>
				</el-form-item>
			</el-form>
		</el-main>
	</el-container>
</template>

<script>
import {avaliable_resources,default_resources} from '../utils/Resources';
export default{
	data(){
		return {
			CourseData : {
				title : "",
				type : "1",
				resources : default_resources,
			},
			avaliable_resources : avaliable_resources
		}
	},
	methods : {
		onSubmit() {
			console.log(this.CourseData);
			this.$http
			.post('/api/class/create',this.CourseData)
			.then(function(res){
				console.log(res.bodyText);
				this.$message(res.bodyText);
			});
		}
	}
}
</script>

<style scoped>
h2 {
	text-align:center;
}
</style>
