<template>
	<el-container>
		<el-main>
			<el-row v-for="record in chatrecords">
				<el-col :span='4'> {{record.userid}} </el-col>
                <el-col :span='20'> {{record.message}} </el-col>
                <el-col :span='4'> {{record.registration_date}} </el-col>
			</el-row>
			<el-form>
				<el-form-item label="Input ">
					<el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="inputData.message"> </el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">submit</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onClear">clear</el-button>
				</el-form-item>
			</el-form>
		</el-main>
	</el-container>
</template>

<script>
export default {
	data() {
		return {
			chatrecords : [],
            forumid : "undefined",
            classid : "undefined",
			inputData : {
				userId : undefined,
				forumId : undefined,
                message : undefined,
                classId : undefined,
			}
		}
	},
	mounted : function() {
        this.forumid = this.$route.query.forumid;
        this.inputData.forumId = this.forumid;
        this.classid = this.$route.params.classid;
		this.inputData.classId = this.classid;
		this.$http.get('/api/user/session',{})
		.then(function(res) {
			this.inputData.userId = res.body.user_id;
			this.$http.post('/api/chat/info/query/posts',{forumid:this.forumid})
			.then(function(res) {
			if (res.body.status === 'NOT FOUND.') {
                this.$message("Room " + this.title + " not found!");
			}else {
				this.chatrecords = res.body.chatrecords;
				console.log(111);
			}
		});
		});
	},
	methods : {
		onSubmit() {
			this.$http
				.post('/api/chat/add_comments/posts',{
					userid : this.inputData.userId,
					forumid : this.forumid,
                    message : this.inputData.message,
                    classid : this.inputData.classId,
				})
				.then(function(res){
					console.log(res);
					if(res.body.status === 'SUCCESS.') {
						console.log(res.body.results);
						this.chatrecords.push(res.body.results);
					}
				});
		},
		onClear() {
			this.$http
				.post('/api/chat/clear_comments',{
					classid : this.inputData.classId,
				})
				.then(function(res){
					console.log(res);
					if(res.body.status === 'SUCCESS.') {
						this.chatrecords = [];
					}
				});
		},
	},
}
</script>