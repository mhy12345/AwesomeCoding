<template>
	<el-container v-loading='loading'>
		<el-main>
			<el-row>
				<el-col :span='4'>课程名称</el-col>
				<el-col :span='20'>{{info.title}}</el-col>
			</el-row>
			<el-row>
				<el-col :span='4'>课程简介</el-col>
				<el-col :span='20'>{{info.description}}</el-col>
			</el-row>
			<el-row>
				<el-col :span='4'>课程公告</el-col>
				<el-col :span='20'>{{info.notice}}</el-col>
			</el-row>
			<el-row>
				<el-col :span='4'>邀请链接</el-col>
				<el-col :span='20'>
					<a :href='invitation_url'>{{info.invitation_code}}</a>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span='4'>用户角色</el-col>
				<el-col :span='20'>{{course_status.role_title}}</el-col>
			</el-row>
		</el-main>
	</el-container>
</template>

<script>
export default {
	data() {
		return {
			info : {
			},
			default_items: [ "title","id","description","notice","invitation_code"],
			translation: {"id":"课程号","title":"课程名称","description":"课程简介","notice":"课程公告","invitation_code":"邀请码"},
			class_id: "undefined",
			invitation_url: '',
			loading: true
		}
	},
	props : ['course_status'],
	mounted : function() {
		this.class_id = this.$route.params.class_id;
		this.$http.post('/api/class/info/query',{class_id:this.class_id})
		.then(function(res) {
			if (res.body.status === 'NOT FOUND.') {
                this.$message("Room " + this.title + " not found!");
			}else {
				this.info = res.body.info;
				this.invitation_url = '/course/invite/'+this.info.invitation_code;
				console.log(this.info);
			}
			this.loading = false;
		});
	}
}
</script>
