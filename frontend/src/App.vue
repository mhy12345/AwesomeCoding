<template>
	<el-container id="app">
		<el-header id="nav-header" style='height:62px'>
			<div>
				<span style="position: absolute; top: 20px;">
					<img :src="logo_url" style="height: 30px;"/>
					{{ title }}
				</span>
				<div style='float:right'>
					<el-menu v-if="(loginQ === false)" mode="horizontal" @select='handleSelectItem'>
						<el-menu-item index="/user/sign_in"> 登 录 </el-menu-item>
						<el-menu-item index="/user/sign_up"> 注 册 </el-menu-item>
					</el-menu>
					<el-dropdown v-if="(loginQ === true)" @command="handleSelectItem">
						<img :src="user.gravatar_url" class="round-icon" alt="">
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="/user/profile">用户资料</el-dropdown-item>
							<el-dropdown-item command="/user/settings">设置</el-dropdown-item>
							<el-dropdown-item command="logout">退出登录</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
			</div>
		</el-header>
		<el-container>
			<el-aside width="auto">
				<!--此处el-menu设置"min-height: 100%"的目的是使菜单在项目较少的时候也能充满左边的导航栏 by ZFS-->
				<el-menu class="el-menu-vertical-demo"
						 style="min-height: 100%"
						 background-color="#f1f5f8"
						 :default-active="active_index"
						 collapse-transition :collapse="collapseQ"
						 @select='handleSelectItem'>
					<el-menu-item index='collapse'>
						<i v-if="collapseQ" class='el-icon-arrow-right'></i>
						<i v-else class='el-icon-arrow-left'></i>
						<span v-if="collapseQ" slot='title'>展开</span>
						<span v-else slot='title'>收回</span>
					</el-menu-item>

					<el-menu-item index="/">
						<i class="el-icon-menu"></i>
						<span slot="title">主页</span>
					</el-menu-item>

					<!-- todo when release <el-submenu index="/developer" :disabled="user.role !== 0" >-->
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
							<el-menu-item index="/developer/test_player">直播测试</el-menu-item>
							<el-menu-item index="/developer/test">测试</el-menu-item>
						</el-menu-item-group>

						<el-menu-item index="/developer/file_viewer">文件查看</el-menu-item>
						<el-menu-item index="1-4-1">选项1</el-menu-item>
					</el-submenu>
					<el-submenu index="/user">
						<template slot="title">
							<i class="el-icon-star-on"></i>
							<span slot="title">用户</span>
						</template>
						<div v-if="!loginQ">
							<el-menu-item index="/user/sign_in">
								<span slot="title">登录</span>
							</el-menu-item>
							<el-menu-item index="/user/sign_up">
								<span slot="title">注册</span>
							</el-menu-item>
						</div>
						<div v-else>
							<el-menu-item index="logout">
								<span slot="title">退出登录</span>
							</el-menu-item>
							<el-menu-item index="/user/profile">
								<span slot="title">个人页</span>
							</el-menu-item>
						</div>
					</el-submenu>

					<el-submenu index="/course">
						<template slot='title'>
							<i class='el-icon-news'></i>
							<span>课程</span>
						</template>
						<el-menu-item index="/course/add">
							<span slot="title">新建课程</span>
						</el-menu-item>
						<el-menu-item index="/course/enter">
							<span slot="title">进入课程</span>
						</el-menu-item>
					</el-submenu>

					<el-submenu index="/files">
						<template slot='title'>
							<i class='el-icon-upload'></i>
							<span>文件</span>
						</template>
						<el-menu-item index="/file/upload">
							<span slot="title">上传文件</span>
						</el-menu-item>
						<el-menu-item index="/file/show">
							<span slot="title">我的文件</span>
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
					<router-view @logined="handleLogined" @logout="handleLogout"
								 :user="user">
					</router-view>
				</div>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
var crypto = require('crypto');
import {copy} from "./utils/Copy";
import {sessionSQL, logoutSQL} from "./utils/DoSQL";

export default {
	name: 'App',
	data: function() {
		return {
			title: "AwesomeCoding",
			logo_url: require('./assets/images/icons/logo.png'),

			collapseQ: true,
			active_index : '/',
			loginQ: undefined,		 // 是否登录，初始为 undefined 这样右上角既不显示'登录'也不显示头像
			default_user: {
                user_id: '',
                nickname: 'UnknownUser',
                realname: 'UnknownUser',
                role: 3,
                email: 'x@mail.com',
                phone: '12344445555',
                motto: 'UnknownMotto',
                gravatar_url: '',
                cookie: null
			},
            user: {
                user_id: '',
                nickname: '',
                realname: '',
                role: '',
                email: '',
                phone: '',
                motto: '',
                gravatar_url: '',
                cookie: null
            },
		}
	},
	beforeMount() {
		this.user = copy(this.default_user);
		this.checkLogin();
	},
    sockets: {      // usages of socket.io
        connect: function () {
            console.log('[socket] socket connected')
        },
        message: function (msg) {       // 收到服务器发来的消息, todo 后期可以考虑把消息缓存在用户个人页里，并以红圈在右上角头像上显示
            console.log('[socket] message:', msg);
            if (!this.loginQ) return;
            this.$notify({
                title: '收到消息',
                message: msg.from + ' says: ' + msg.message,
                // duration: 0
            });
            this.$socket.emit('received');
        },
        accepted: function () {         // 服务器接受客户发出的消息
            console.log('[socket] accepted!');
            this.$message.success('发送成功');
        },
        rejected: function (msg) {       // 服务器拒绝客户发出的消息
            console.log('[socket] rejected!', msg);
            this.$message.error('发送失败');
        }
    },
	methods: {
		showUnknownError(err) {
			console.log('[error] ',err);
			this.$message.error("未知错误。" + JSON.stringify(err, null, 3));
		},
		checkLogin() { // 检验用户是否登录
			sessionSQL(this).
				then((resp) => {
					var hash;
					console.log('[session]' + resp);
					if (typeof(resp.nickname) !== 'undefined') {
						this.user = resp;
						this.$message.success("欢迎回来！" + this.user.realname);
						this.loginQ = true;
						hash = crypto.createHash('md5');
						hash.update(this.user.email);
						this.user.gravatar_url = 'https://www.gravatar.com/avatar/' + hash.digest('hex');
						console.log("[gravatar] URL = ", this.user.gravatar_url);
					} else {
						this.$message("请登录。");
						this.loginQ = false;
					}
				}).
				catch(this.showUnknownError);
		},
		logout() { // 退出登录
			logoutSQL(this).
				then((resp) => {
					this.loginQ = false;
					this.user = copy(this.default_user);
					this.$message.warning('已退出登录。');
				}).
				catch((err) => {
					if (err.status === 'FAILED.' && err.details === 'USER_NOT_ONLINE.') {
						this.$message.error('您已离线。');
						return;
					}
					this.showUnknownError(err);
				});
		},
		handleSelectItem(key) {
			if (key === "collapse") {
				this.collapseQ = !this.collapseQ;
			} else if (key === "logout") {
				this.logout();
				this.$router.push('/home');
			} else {
				this.$router.push(key);
			}
		},
		handleLogined() { // logined event emitted by children router-view
            setTimeout(() => {
                this.$router.go(0); // 过一段时间后刷新页面，以解决socket session不能更新的问题
            }, 100);
		},
		handleLogout() { // logout event emitted by children router-view
			console.log('[app] logout!');
			this.logout();
		},
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
	background-color: transparent;
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

.round-icon {
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
