<template>
	<el-container id="app">
		<el-header>
			LOGO
		</el-header>
		<el-container>
			<el-aside width="">
				<el-menu default-active="/" class="el-menu-vertical-demo" :collapse="isCollapse" @select='selectItem'>
					<el-menu-item index='collapse'>
						<i v-if="isCollapse" class='el-icon-arrow-right'></i>
						<i v-else class='el-icon-arrow-left'></i>
						<span v-if="isCollapse" slot='title'>展开</span>
						<span v-else slot='title'>收回</span>
					</el-menu-item>
					<el-menu-item index="/">
						<i class="el-icon-menu"></i>
						<span slot="title">主页</span>
					</el-menu-item>
					<el-submenu index="1">
						<template slot="title">
							<i class='el-icon-edit-outline'></i>
							<span slot="title">开发者</span>
						</template>
						<el-menu-item-group>
							<span slot="title">数据库操作</span>
							<el-menu-item index="/developer/data_visualizer">数据表修改</el-menu-item>
							<el-menu-item index="1-2">选项2</el-menu-item>
						</el-menu-item-group>
						<el-menu-item-group title="分组2">
							<el-menu-item index="1-3">选项3</el-menu-item>
						</el-menu-item-group>
						<el-submenu index="1-4">
							<span slot="title">选项4</span>
							<el-menu-item index="1-4-1">选项1</el-menu-item>
						</el-submenu>
						<el-menu-item index="/developer/test">
							<span slot="title">测试</span>
						</el-menu-item>
					</el-submenu>
					<el-menu-item index="/classes/">
						<i class='el-icon-news'></i>
						<span slot='title'>课程</span>
					</el-menu-item>
					<el-menu-item index="/class/123">
						<i class='el-icon-service'></i>
						<span slot='title'>房间</span>
					</el-menu-item>
					<el-menu-item index="/about">
						<i class='el-icon-info'></i>
						<span slot='title'>关于</span>
					</el-menu-item>
				</el-menu>
			</el-aside>
			<el-main>
				<router-view>
				</router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
export default {
	name: 'app',
	data() {
		return {
			isCollapse: true,
			activeIndex : '/'
		}
	},
	methods :{
			 selectItem(key) {
				 if (key === "collapse") {
					 this.isCollapse = !this.isCollapse;
				 } else {
					 this.$router.push(key);
					 console.log(key);
				 }
			 }
		 }
};
</script>

<style>
.el-header {
    color: #333;
    line-height: 60px;
}
.el-aside {
    background-color: #b6c9ea;
    color: #333;
}
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
}
a{text-decoration:none}

.el-menu-vertical-demo {
	height:100%
}
</style>
