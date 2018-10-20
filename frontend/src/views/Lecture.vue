<template>
	<el-tabs @tab-click="onTabClick" v-model='activeName' type="border-card" v-loading='loading'>
		<el-tab-pane v-for="option in options" :label="option.name" :name="options.route">
			<router-view :course_status='course_status' class='lecture-panel'>
			</router-view>
		</el-tab-pane>
	</el-tabs>
</template>

<script>

var default_options = ['details'];
import {supported_resources} from '../utils/Resources';

export default {
    data() {
        return {
            title: undefined,//标题
            activeName: '0',
            class_resources: undefined,
			course_status : {role : undefined},
			loading: true
        }
    },
    computed: {
        options: function () {
            var result = [];
            var current_options = this.class_resources ? this.class_resources : default_options;
            for (var k in current_options) {
                var key = current_options[k];
                result.push({
                    name: supported_resources[key].title,
                    route: key
                });
            }
            return result;
        }
    },
    mounted: function () {
        this.title = this.$route.params.class_id;
        console.log("LECTURE MOUNTED...");
        this.$http.post('/api/class/resources/query', {class_id: this.title}, null).
             then(function (res) {
                 this.class_resources = res.body.resources;
				 this.loading = false;
				 return this.$http.post('/api/class/status', {class_id: this.title}, null);
			}).
			then(function (res) {
				console.log("STATUS>>>",res.body.results);
				this.course_status = res.body.results;
				if (this.course_status.role == 0) this.course_status.role_title = '教师';
				if (this.course_status.role == 1) this.course_status.role_title = '助教';
				if (this.course_status.role == 2) this.course_status.role_title = '学生';
				console.log("PNT COURSE STATUS",this.course_status);
			}).
			catch(function(res) {
				this.$message(res);
			});
    },

    methods: {
        onTabClick() {
            this.$router.push({name: 'class-' + this.options[this.activeName].route, params: {class_id: this.title}});
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
