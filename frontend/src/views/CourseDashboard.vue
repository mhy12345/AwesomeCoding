<template>
	<div>
		<el-tabs type="border-card"
                 @tab-click="onTabClick"
                 v-loading='loading'
                 v-model='activeName'>
			<el-tab-pane v-for="option in options" :label="option.name" :name="options.route" :key='option.index'>
			</el-tab-pane>
            <router-view :course_status='course_status' class='lecture-panel' :index='activeTitle' >
            </router-view>
		</el-tabs>
	</div>
</template>

<script>
var default_options = ['details'];
import {supported_resources} from '../utils/Resources';

export default {
	data: function () {
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
		};
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
		this.activeName = this.getActiveName();
		this.title = this.$route.params.class_id;
        this.$http.post('/api/class/resources/query', { class_id: this.title }, null).
             then((res) => {
                 this.class_resources = res.body.resources;
                 this.loading = false;
                 this.activeName = this.getActiveName();
                 return this.$http.post('/api/class/status', { class_id: this.title }, null);
             }).
             then((res) => {
                 if (res.body.status !== 'SUCCESS.') {
                     console.log("/api/class/status : " + res.body.details);
                     return;
                 }
                 this.course_status = res.body.results;
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
	components: {}
};
</script>

<style scoped>
.lecture-panel {
    height: 100%;
}
</style>
