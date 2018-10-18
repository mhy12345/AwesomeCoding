<template>
	<el-tabs @tab-click="onTabClick" v-model='activeName' type="border-card">
		<el-tab-pane v-for="option in options" :label="option.name" :name="options.route">
			<router-view>
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
            title: undefined,
            class_tab_selected: "user_manager",
            activeName: 'details',
            class_resources: undefined,
        }
    },
    computed: {
        options: function () {
            var result = [];
            var current_options = this.class_resources ? this.class_resources : default_options;
            for (var k in current_options) {
                var key = current_options[k];
                console.log('>>>???', key);
                console.log(supported_resources);
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
