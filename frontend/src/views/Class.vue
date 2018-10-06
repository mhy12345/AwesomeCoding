<template>
	<el-container>
		<el-header>
			<h2> {{title}} </h2>
		</el-header>
		<el-main>
		<el-tabs @tab-click="onTabClick" v-model='activeName'>
			<el-tab-pane v-for="option in options" :label="option.name" :name="options.route"></el-tab-pane>
		</el-tabs>
            <router-view>
            </router-view>
		</el-main>
	</el-container>
</template>

<script>
import MyBlank from '../components/resources/MyBlank'

var default_options = ['details']
var supported_options = {
	details:'班级信息',
	live:'直播教学',
	materials:'课程资料',
}

export default{
	data(){
		return {
			title:undefined,
			class_tab_selected:"user_manager",
			activeName : 'details',
			class_resources : undefined
		}
	},
	computed : {
		options : function() {
			var result = []
			var current_options = this.class_resources ? this.class_resources : default_options;
			for (var k in current_options) {
				var key = current_options[k];
				console.log(key);
				result.push({
					name:supported_options[key],
					route:key
				});
			}
			return result;
		}
	},
	mounted : function() {
		this.title = this.$route.params.class_id
		this.$http
		.post('/api/class_resources',{class_id:this.title},{emulateJSON:true})
		.then(function(res) {
			this.class_resources = res.body.results;
		});
	},

	methods: {
        onTabClick(a, b, c) {
            console.log({name: 'class' + this.options[this.activeName].route, params: {class_id: this.title}});
            this.$router.push({name: 'class-' + this.options[this.activeName].route, params: {class_id: this.title}});
        }
	},
	components: {
	}
}
</script>

<style scoped>
</style>
