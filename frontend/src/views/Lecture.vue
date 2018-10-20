<template>
	<el-tabs @tab-click="onTabClick" v-model='activeName' type="border-card" v-loading='loading'>
		<el-tab-pane v-for="option in options" :label="option.name" :name="options.route">
			<router-view :course_user_info='course_user_info'>
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
            activeName: 'details',
            class_resources: undefined,
			course_user_info : undefined,
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
			});
    },

    methods: {
        onTabClick(a, b, c) {
            this.$router.push({name: 'class-' + this.options[this.activeName].route, params: {class_id: this.title}});
        }
    },
    components: {}
};
</script>

<style scoped>
</style>
