<template>
	<el-container>
		<el-main>
			<el-row v-for="item in default_items">
				<el-col :span='4'> {{translation[item]}} </el-col>
				<el-col :span='20'>{{info[item]}}</el-col>
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
			default_items : [ "title","id","description","notice","invitation_code"],
			translation : {"id":"课程号","title":"课程名称","description":"课程简介","notice":"课程公告","invitation_code":"邀请码"},
			title : "undefined",
		}
	},
	mounted : function() {
		this.title = this.$route.params.class_id;
		this.$http.post('/api/class_info',{class_id:this.title})
		.then(function(res) {
			this.info = res.body.result;
		});
	}
}
</script>
