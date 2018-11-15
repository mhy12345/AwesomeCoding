<template>
	<el-container v-loading='loading'>
		<el-main>
			<el-row :gutter="20">
				<el-col :span='12'> <!-- First column -->
					<el-card class='details-card'>
						<div slot="header" class="clearfix">
							基本信息
						</div>
						<div>
							<el-row>
								<el-col :span='8'>班级名称</el-col>
								<el-col :span='16'>
									{{info.title}}
								</el-col>
							</el-row>
							<el-row>
								<el-col :span='8'>用户角色</el-col>
								<el-col :span='16'>{{
									roleTitle
									}}</el-col>
							</el-row>
							<el-row>
								<el-col :span='8'>邀请链接</el-col>
								<el-col :span='16'>
									<a :href='invitation_url'>{{info.invitation_code}}</a>
								</el-col>
							</el-row>
						</div>
					</el-card>
				</el-col>
				<el-col :span='12'>
					<el-card class='details-card'>
						<div slot="header" class="clearfix">
							课程简介
						</div>
					<ContentDisplay ref='display_description' :border='false' >
					</ContentDisplay>
					</el-card>
				</el-col>
			</el-row>
			<el-row :gutter='20'>
				<el-col :span='12'>
					<el-card class='details-card'>
						<div slot="header" class="clearfix">
							课程公告
						</div>
					<ContentDisplay ref='display_notice' :border='false' >
					</ContentDisplay>
					</el-card>
				</el-col>
				<el-col :span='12'>
					<el-card class='details-card'>
						<div slot='header' class='clearfix'>
							课程操作
						</div>
						<el-button v-if='course_status.role_title === null' @click='handleJoin'>进入课程</el-button>
						<el-button v-if='course_status.role_title != null' @click='handleQuit'>退出课程</el-button>
					</el-card>
				</el-col>
			</el-row>
		</el-main>
	</el-container>
</template>

<script>
import ContentDisplay from '@/components/components/ContentDisplay.vue';
export default {
	data() {
		return {
			info: {title:''},
			default_items: ["title", "id", "description", "notice", "invitation_code"],
			translation: {
				"id": "课程号",
				"title": "课程名称",
				"description": "课程简介",
				"notice": "课程公告",
				"invitation_code": "邀请码"
			},
			class_id: "undefined",
			invitation_url: '',
			loading: true
		};
	},
	computed: {
		roleTitle: function() {
			return this.course_status.role_title !== null ? this.course_status.role_title : '--';
		}
	},
	props: ['course_status'],
	mounted: function () {
		this.class_id = this.$route.params.class_id;
		this.$http.post('/api/class/info/query', {class_id: this.class_id}).
			then(function (res) {
				if (res.body.status === 'NOT FOUND.') {
					this.$message("Room " + this.title + " not found!");
				} else {
					this.info = res.body.info;
					this.invitation_url = '/course/invite/' + this.info.invitation_code;
					this.handleUpdate();
				}
				this.loading = false;
			});
	},
	methods: {
		handleUpdate: function() {
			this.$refs.display_description.handleUpdate(this.info.description);
			this.$refs.display_notice.handleUpdate(this.info.notice);
		},
		handleJoin: function() {
			window.location.href = '/course/invite/' + this.info.invitation_code;
		},
		handleQuit: function() {
			this.$http.post('/api/class/participants/delete', {class_id: this.class_id, user_id:null}).
				then(function (res) {
					if (res.body.status === 'SUCCESS.') {
						this.$message("成功!");
						history.go(0);
					}else {
						if (res.body.details === 'TeacherCannotQuit.') {
							this.$message("教师不能够退出班级!");
						} else {
							this.$message("失败!");
						} 
					}
				});
		}
	},
	components: {
		'ContentDisplay': ContentDisplay
	},
};
</script>

<style>
.details-card {
	min-height:200px;
}
</style>
