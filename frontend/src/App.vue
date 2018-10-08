<template>
	<el-container id="app">
		<el-header id="nav-header" class='sticky-top'>
			<div>
				<span>
					LOGO[TITLE]
				</span>
				<div style='float:right'>
					<el-menu mode="horizontal" @select='selectItem'>
						<el-menu-item index="/user/sign_up"> 注册 </el-menu-item>
						<el-menu-item index="/user/sign_in"> 登陆 </el-menu-item>
					</el-menu>
				</div>
			</div>
		</el-header>
		<el-container>
			<el-aside width="">
				<el-menu class="el-menu-vertical-demo"
                         :default-active="activeIndex"
                         collapse-transition :collapse="isCollapse"
                         @select='selectItem'
						 >
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

					<el-submenu index="/developer">
						<template slot="title">
							<i class='el-icon-edit-outline'></i>
							<span slot="title">开发者</span>
						</template>
						<el-menu-item-group>
							<span slot="title">数据库操作</span>
							<el-menu-item index="/developer/data_visualizer">数据表修改</el-menu-item>
							<el-menu-item index="/developer/file_uploader">文件上传</el-menu-item>
                        </el-menu-item-group>

                        <el-menu-item-group title="测试页面">
							<el-menu-item index="/developer/live_player">直播测试</el-menu-item>
							<el-menu-item index="/developer/video_player">视频测试</el-menu-item>
							<el-menu-item index="/developer/test">测试</el-menu-item>
                        </el-menu-item-group>

                        <el-submenu index="1-4">
                            <span slot="title">选项4</span>
                            <el-menu-item index="1-4-1">选项1</el-menu-item>
                        </el-submenu>
					</el-submenu>
					<el-submenu index="/courses">
						<template slot='title'>
							<i class='el-icon-news'></i>
							<span>课程</span>
						</template>
                        <el-menu-item index="/courses/add">
                            <span slot="title">新建课程</span>
                        </el-menu-item>
                        <el-menu-item index="/courses/enter">
                            <span slot="title">进入课程</span>
                        </el-menu-item>
					</el-submenu>
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
			<el-main style='overflow-y:scroll;height:700px'>
				<div style='min-height:800px'>
					<router-view>
					</router-view>
				</div>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
import {getCookie} from "./utils/Cookie";
import {loginSQL} from "./utils/DoSQL";

export default {
	name: 'app',
	data() {
	    var myCookie = getCookie();     // 在网站的所有页面上都检查 cookie 中有没有登录的信息
	    if (myCookie.nickname && myCookie.password) {
	        console.log('Try to login: ', myCookie);
            loginSQL(myCookie).then((resp) => {
                console.log(resp);
                this.$message.success("欢迎回来！" + myCookie.realname);
            }).catch((resp) => {
                console.log(resp);
                if (resp.status === 'WRONG_PASSWORD.') {
                    this.$message.error("登录失败，密码错误！");
                }
                else if (resp.status === 'USER_NOT_FOUND.') {
                    this.$message.error("登录失败，用户名不存在！");
                }
                else this.$message.error("登录失败，未知错误！" + JSON.stringify(resp.details));
            });
        }

		return {
			isCollapse: false,
			activeIndex : '/',
		}
	},
	methods: {
		selectItem(key) {
			if (key === "collapse") {
				this.isCollapse = !this.isCollapse;
			} else {
				this.$router.push(key);
				console.log(key);
			}
		},
        handleLogin() {
            this.selectItem('/user/sign_in');
        },
        handleRegister() {
		    this.selectItem('/user/sign_up');
        }
	}
};
</script>

<style>
body {
	margin:0px;
}
.el-header {
    color: #333;
    line-height: 60px;
}
.sticky-top {
	position: -webkit-sticky;
	position: sticky;
	background-color: #fff;
    top: 0;
	z-index: 10;
}
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
}

.el-menu-item .is-active {
	border-bottom:10px;
}

.el-aside {
	min-height:100%;
}
.el-menu {
	min-height:100%;
}
#nav-header {
	border-bottom:1px solid #e6e6e6;
	color:#909399;
}
</style>
