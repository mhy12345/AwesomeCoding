<template>
	<el-container id="app">
		<el-header id="nav-header" style='height:62px'>
			<div>
				<span style="position: absolute; top: 20px;">
					LOGO  {{ title }}
				</span>
				<div style='float:right'>
                    <el-tooltip v-if="islogin" effect="dark" placement="bottom">
                        <div slot="content">Profile</div>
						<img :src="gravatar_url" class="round_icon"  alt="">
                    </el-tooltip>
                    <el-menu v-if="isNotLogin" mode="horizontal" @select='selectItem'>
                        <el-menu-item index="/user/sign_in"> 登陆 </el-menu-item>
                        <el-menu-item index="/user/sign_up"> 注册 </el-menu-item>
                    </el-menu>
				</div>
			</div>
		</el-header>
		<el-container>
			<el-aside width="auto">
                <!--此处el-menu设置"min-height: 100%"的目的是使菜单在项目较少的时候也能充满左边的导航栏 by ZFS-->
				<el-menu class="el-menu-vertical-demo"
                         style="min-height: 100%"
                         background-color="#f1f5f8"
                         :default-active="activeIndex"
                         collapse-transition :collapse="isCollapse"
                         @select='selectItem'>
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

						<el-menu-item index="/developer/file_viewer">文件查看</el-menu-item>
						<el-menu-item index="1-4-1">选项1</el-menu-item>
					</el-submenu>

                    <el-submenu index="/users">
                        <template slot="title">
                            <i class="el-icon-star-on"></i>
                            <span slot="title">用户</span>
                        </template>
                        <el-menu-item index="/user/sign_in">
                            <span slot="title">登录</span>
                        </el-menu-item>
                        <el-menu-item index="/user/sign_up">
                            <span slot="title">注册</span>
                        </el-menu-item>
                        <el-menu-item :disabled="!islogin" index="/user/profile">
                            <span slot="title">个人页</span>
                        </el-menu-item>
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
			<el-main>
				<!--<div style='min-height:800px'>-->
                <div>
					<router-view @logined="handleLogined" :user="user">
					</router-view>
				</div>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
// import {getCookie} from "./utils/Cookie";
// import {loginSQL} from "./utils/DoSQL";crypto = require('crypto')
var crypto = require('crypto');

export default {
	name: 'app',
	data() {
		return {
            title: "AwesomeCoding",
			isCollapse: false,
			activeIndex : '/',
            islogin: false,         // 是否登录
            user: {                 // 用户基本信息
                nickname: 'somebody',
                realname: 'SOMEBODY'
            },
			isNotLogin : false,
			gravatar_url : '',
		}
	},
    beforeMount() {
        // todo simplify into '/login/is_login'
// <<<<<<< HEAD
//         this.$http.get('http://127.0.0.1:8888/api/login/is_login').
//         // this.$http.get('/api/login/is_login').
//         then((resp) => {
//             console.log(resp);
//             if (resp.body.islogin) {
//                 user = resp.body;
//                 this.$message.success("欢迎回来！" + user.realname);
// =======
        // this.$http.get('http://127.0.0.1:8888/api/login/is_login').
        this.$http.get('/api/user/session').
        then((resp) => {
            console.log(resp);
            if (typeof(resp.body.nickname) !== 'undefined') {
                this.$message.success("欢迎回来！" + resp.body.nickname);
                this.islogin = true;
				this.isNotLogin = false;
				var hash = crypto.createHash('md5');
				hash.update(resp.body.email);
				this.gravatar_url = 'https://www.gravatar.com/avatar/'+hash.digest('hex');
				console.log("GRAVATAR URL = ",this.gravatar_url);
            }
			else {
                this.$message("请登录。");
                this.islogin = false;
				this.isNotLogin = true;
			}
        }).
        catch((err) => {
            console.log(err);
            this.$message.error("未知错误。" + JSON.stringify(err, null, 3));
        });
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
		},
        handleProfile() {
		    this.$router.push('/user/profile');
        },
        handleLogined() {       // 子路由发来登陆成功的消息
		    // console.log('>>>in app logined');
		    this.islogin = true;
        }
	}
};
</script>

<style>
body {
    margin: 0;
}
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
    /*以下对position的设定可以保证网页始终能填充满浏览器页面，从而保证跨平台的可能 by ZFS*/
    position: absolute;
    width: 100%;
    height: 100%;
}

.el-menu-item .is-active {
    border-bottom: 10px;
}

.el-menu {
	background-color : transparent;
}

el-tooltip {
    padding: 5px;
}

.profile-button {
    position: relative;
    right: 10px;
    top: 10px;
}

#nav-header {
    border-bottom: 2px solid #d3d4e2;
	color: #909399;
}
.round_icon{
	width: 43px;
	height: 43px;
	display: flex;
	border-radius: 50%;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	margin-top: 6px;
	border: 2px #dedede solid;
}

</style>
