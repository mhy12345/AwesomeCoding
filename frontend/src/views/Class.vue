<template>
	<el-container>
		<el-header>
			<h2>房间 {{title}} </h2>
		</el-header>
		<el-main>
			<el-tabs v-model="class_tab_selected" @tab-click="handleClick">
				<el-tab-pane label="用户管理" name="user_manager"></el-tab-pane>
				<el-tab-pane label="配置管理" name="class_setting"></el-tab-pane>
				<el-tab-pane label="讨论区" name="chatting_area"></el-tab-pane>
				<el-tab-pane label="直播区" name="live"></el-tab-pane>
			</el-tabs>
			<route-view></route-view>
		</el-main>
	</el-container>
</template>

<script>
export default{
	data(){
		return {
			title:"undefined",
			class_tab_selected:"user_manager"
		}
	},
	mounted : function() {
		this.title = this.$route.params.class_id
	},
	methods: {
			handleClick : function(tab, event) {
				console.log(tab, event);
			}
		}
}
</script>

<style scoped>
</style>
