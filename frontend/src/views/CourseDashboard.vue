<template>
	<div>
		<el-tabs type="border-card"
				 @tab-click="onTabClick"
				 v-loading='loading'
				 v-model='activeIndex'
				 style='min-height:600px'
				 :lazy='false'
				 >
				 <TabPane v-for="option in options"
						  :disabled='option.disabled'
						  :label="option.name"
						  :name="options.route"
						  :key='option.index'
						  :fly='option.index === "live"'
                 >
					<!-- 对于live模块，额外加一个fly的props，用于表示是否通过修改visible隐藏-->
					<components
						v-if='option.index !== "live" && !option.disabled'
						v-bind:is="option.component"
						:course_status='course_status'
						class='lecture-panel'
						:index='activeTitle'
						:ref='option.index'
						>
					</components>
					<components
						v-if='option.index === "live" && !option.disabled'
						v-bind:is="option.component"
						:course_status='course_status'
						class='lecture-panel'
						:index='activeTitle'
						:fly='fly'
						:ref='option.index'
                        :user="user"
						>
					</components>
				 </TabPane>
		</el-tabs>

		<el-dialog
			title="新的习题"
			:visible.sync="new_problem_dialog_visible"
			width="30%"
			:before-close="handleNewProblemClose">
			<span>刚刚，老师发布了新的习题</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleNewProblemCancel">留在这里</el-button>
				<el-button type="primary" @click="handleNewProblemConfirm">去看看</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import Vue from 'vue';
var default_options = ['details'];
import {supported_resources} from '../utils/Resources';
import TabPane from './MyTabPane.vue';

for (let item in supported_resources) {
	Vue.component('sub-'+supported_resources[item].name, supported_resources[item].component);
}

export default {
	data: function () {
		return {
			title: undefined,//标题
			activeTitle: 'details',
			activeIndex: '',
			class_resources: null,
			course_status : {
				class_id: null,
				role_title: null,
				role: null,
			},
			loading: true,
			new_problem_dialog_visible: false,
		};
	},
    props: ['user'],
	sockets: {
		alert: function (msg) {
			if (msg.operation === 'PROBLEM_PUBLISH.') {
				this.$message("你有新的习题，快去看看吧!");
				//this.new_problem_dialog_visible = true;
				//this.activeIndex = this.whereIs('train_area');
			}
		}
	},
	computed: {
		fly: function () {
			return this.class_resources[this.activeIndex] !== 'live';
		},
		options: function () {
			var result = [];
			var current_options = this.class_resources ? this.class_resources : default_options;
			let role = this.course_status.role === null ? 3 : this.course_status.role;
			for (var k of current_options) {
				result.push({
					index: k,
					name: supported_resources[k].title,
					component: supported_resources[k].component,
					disabled: !supported_resources[k].access[role]
				});
			}
			return result;
		},
	},
	mounted: function () {
		this.activeIndex = this.getActiveName();
		this.title = this.$route.params.class_id;
		this.$http.post('/api/class/resources/query', {class_id: this.title}, null).
			then((res) => {
				this.class_resources = res.body.resources;
				this.loading = false;
				this.activeIndex = this.getActiveName();
				return this.$http.post('/api/class/status', {class_id: this.title}, null);
			}).
			then((res) => {
				if (res.body.status !== 'SUCCESS.') {
					if (res.body.details === 'NOT_LOGIN.') {
						this.$message("请登录");
						window.location.href = '/user/sign_in';
					} else if (res.body.details === 'NOT_IN_CLASS.') {
						this.$message.warning("用户没有加入班级");
					} else {
						this.$message.error("错误，见console");
						console.log('[error in dashboard]', res.body)
					}
					return;
				}
				this.course_status.role = res.body.results.role;
				//this.course_status = res.body.results;
				if (this.course_status.role === 0) {
					this.course_status.role_title = '教师';
				} else if (this.course_status.role === 1) {
					this.course_status.role_title = '助教';
				} else if (this.course_status.role === 2) {
					this.course_status.role_title = '学生';
				} else {
					this.course_status.role_title = '未知';
				}
				this.loading = false;
			}).
			catch((res) => {
				this.loading = false;
			});
	},

	methods: {
		whereIs (name) {
			var current_options = this.class_resources ? this.class_resources : default_options;
			let idx = 0;
			for (let k of current_options) {
				if (k === name) {
return ''+idx;
}
				idx += 1;
			}
			return '0';
		},
		handleNewProblemClose (done) {
			this.$confirm('确认关闭？')
				.then(_ => {
					done();
				})
				.catch(_ => {});
		},
		handleNewProblemConfirm () {
			this.activeIndex = this.whereIs('train_area');
			this.new_problem_dialog_visible = false;
		},
		handleNewProblemCancel () {
			this.new_problem_dialog_visible = false;
		},
		onTabClick (arg) {
			this.$router.push({name: 'class-' + this.options[arg.paneName].index, params: {class_id: this.title}});
		},
		getActiveName () {
			var current_options = this.class_resources ? this.class_resources : default_options;
			var idx = 0;
			let activeTitle = this.$route.path.split("/")[3];
			for (let k of current_options) {
				if (k === activeTitle) {
					return ''+idx;
				}
				idx += 1;
			}
			return '0';
		}
	},
	components: {TabPane: TabPane}
};
</script>

<style scoped>
.lecture-panel {
	height: 100%;
}
</style>
