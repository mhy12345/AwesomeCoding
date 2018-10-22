<template>
	<el-tabs @tab-click="onTabClick" type="border-card" v-loading='loading' v-model='activeName'>
		<el-tab-pane v-for="option in options" :label="option.name" :name="options.route">
			<router-view :course_status='course_status' class='lecture-panel' :index='option.index' >
			</router-view>
		</el-tab-pane>
	</el-tabs>
</template>

<script>

var default_options = ['details'];
import {supported_resources} from '../utils/Resources';

export default {
	data: function() {
		return {
			title: undefined,//标题
			activeTitle: 'details',
			activeName: '',
			class_resources: null,
			course_status : {
				class_id: null,
				role_title: null,
				role: null,
			},
			loading: true
		}
	},
	computed: {
		options: function () {
			var result = [];
			var current_options = this.class_resources ? this.class_resources : default_options;
			for (var k of current_options) {
				result.push({
					index: k,
					name: supported_resources[k].title,
				});
			}
			return result;
		},
	},
	mounted: function () {
		let _this = this;
		this.activeName = this.getActiveName();
		console.log(this);
		this.title = this.$route.params.class_id;
		this.$http.post('/api/class/resources/query', {class_id: this.title}, null).
			then(function (res) {
				this.class_resources = res.body.resources;
				this.loading = false;
				this.activeName = this.getActiveName();
				return this.$http.post('/api/class/status', {class_id: this.title}, null);
			}).
			then(function (res) {
				if (res.body.status !== 'SUCCESS.') {
					console.log("/api/class/status : "+res.body.details);
					return ;
				}
				this.course_status = res.body.results;
				if (this.course_status.role == 0) this.course_status.role_title = '教师';
				else if (this.course_status.role == 1) this.course_status.role_title = '助教';
				else if (this.course_status.role == 2) this.course_status.role_title = '学生';
				else this.course_status.role_title = '未知';
				this.loading = false;
			}).
			catch(function(res) {
				this.loading = false;
				this.$message(res);
			});
	},

	methods: {
		onTabClick(arg) {
			this.$router.push({name: 'class-' + this.options[arg.paneName].index, params: {class_id: this.title}});
		},
		getActiveName() {
			var current_options = this.class_resources ? this.class_resources : default_options;
			var idx = 0;
			let activeTitle = this.$route.path.split("/")[3];
			for (var k of current_options) {
				if (k === activeTitle) {
					return ''+idx;
				}
				idx += 1;
			}
			return '0';
		}
	},
	components: {}
};
</script>

<style scoped>
.lecture-panel {
	min-height:500px;
}
</style>
