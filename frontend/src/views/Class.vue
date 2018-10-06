<template>
	<el-container>
		<el-header>
			<h2>房间 {{title}} </h2>
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
import MyBlank from '../components/MyBlank'
export default{
	data(){
		return {
			title:undefined,
			class_tab_selected:"user_manager",
			activeName : 'details',
			options : [
				{
					name:"班级信息",
					route:"details"
				},
				{
					name:"观看直播",
					route:"live"
				}
			]
		}
	},
	mounted : function() {
		this.title = this.$route.params.class_id
	},

	methods: {
        onTabClick(a, b, c) {
            console.log({name: 'class' + this.options[this.activeName].route, params: {class_id: 222}});
            this.$router.push({name: 'class-' + this.options[this.activeName].route, params: {class_id: 222}});
        }
	},
	components: {
		MyBlank
	}
}
</script>

<style scoped>
</style>
