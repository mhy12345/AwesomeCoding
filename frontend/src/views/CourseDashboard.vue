<template>
	<div>
		<el-tabs type="border-card"
				 @tab-click="onTabClick"
				 v-loading='loading'
				 v-model='activeIndex'
				 >
				 <TabPane v-for="option in options" 
						  :label="option.name" 
						  :name="options.route" 
						  :key='option.index' 
						  @before-leave='handleBeforeLeave' 
						  :fly='option.index === "live"'>
					<!-- 对于live模块，额外加一个fly的props，用于表示是否通过修改visible隐藏-->
					<components 
						v-if='option.index !== "live"' 
						v-bind:is="option.component" 
						:course_status='course_status' 
						class='lecture-panel' 
						:index='activeTitle'
						:ref='option.index'
						> 
					</components>
					<components 
						v-else 
						v-bind:is="option.component" 
						:course_status='course_status' 
						class='lecture-panel' 
						:index='activeTitle' 
						:fly='fly'
						:ref='option.index'
						> 
					</components>
				 </TabPane>
		</el-tabs>
	</div>
</template>

<script>
import Vue from 'vue';
var default_options = ['details'];
import {supported_resources} from '../utils/Resources';
import TabPane from './MyTabPane.vue';

for (let item in supported_resources) {
	console.log('[dashboard] components-register : sub-'+supported_resources[item].name);
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
			loading: true
		};
	},
	computed: {
		fly: function() {
			return this.class_resources[this.activeIndex] !== 'live';
		},
		options: function () {
			var result = [];
			var current_options = this.class_resources ? this.class_resources : default_options;
			for (var k of current_options) {
				result.push({
					index: k,
					name: supported_resources[k].title,
					component: supported_resources[k].component
				});
			}
			return result;
		},
	},
	mounted: function () {
		this.activeIndex = this.getActiveName();
		this.title = this.$route.params.class_id;
		this.$http.post('/api/class/resources/query', { class_id: this.title }, null).
			then((res) => {
				this.class_resources = res.body.resources;
				this.loading = false;
				this.activeIndex = this.getActiveName();
				return this.$http.post('/api/class/status', { class_id: this.title }, null);
			}).
			then((res) => {
				if (res.body.status !== 'SUCCESS.') {
					if (res.body.details === 'NOT_LOGIN.') {
						this.$message("");
						window.location.href = '/user/sign_in';
					} else {
						console.log("[dashboard] course status error: " + res.body.details);
						this.$message("错误，见console");
					}
					return;
				}
				this.course_status = res.body.results;
				console.log("[dashboard] course status: ", this.course_status);
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
				this.$message(res);
			});
	},

	methods: {
		handleBeforeLeave(new_name, old_name) {
			console.log(new_name, old_name);
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
	components: {
		TabPane: TabPane
	}
};
</script>

<style scoped>
.lecture-panel {
	height: 100%;
}
</style>
