<template>
	<el-container id="app">
		<el-header>
			<el-menu id="app" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
				<el-menu-item index="/">
					主页
				</el-menu-item>
				<el-menu-item index="/dataVisualizer">
					数据库
				</el-menu-item>
				<el-menu-item index="/class/123">
					房间123
				</el-menu-item>
				<el-menu-item index="/about">
					关于
				</el-menu-item>
			</el-menu>
		</el-header>
		<el-main>
			<router-view>
			</router-view>
		</el-main>
	</el-container>
</template>

<script>
export default {
	name: 'app',
	data() {
		return {
			activeIndex : '1'
		}
	},
	methods :{
		handleSelect(key, keyPath) {
		  console.log(key, keyPath);
		  this.$router.push(key);
		}
	}
};
</script>

<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
color: #2c3e50;
}
a{text-decoration:none}
</style>
