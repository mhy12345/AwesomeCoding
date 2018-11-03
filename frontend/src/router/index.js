/* eslint-disable no-undef,camelcase */
import Vue from 'vue';
import Router from 'vue-router';
import {router_childs} from '@/utils/Resources';
import Home from '@/views/Home';
import PageNotFound from '@/views/404';

Vue.use(Router);
console.log(router_childs);

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			redirect: '/home',
		},
		{
			path: '/home',
			name: 'home',
			component: Home,
		},
		{
			path: '/class/:class_id',
			redirect: '/class/:class_id/details',
			name: 'class',
            component: () => import('@/views/CourseDashboard.vue'),
			children: router_childs // 课程面板的各个tab的功能页面
        },
		{
			path: '/course/add',
			name: 'add-courses',
			component: () => import('@/views/CourseAdd.vue')
		},
		{
			path: '/course/enter',
			name: 'enter-courses',
			component: () => import('@/views/CourseEntry.vue')
		},
		{
			path: '/course/invite/:invitation_code',
			name: 'invite-course',
			component: () => import('@/views/CourseInvite.vue')
		},
		{
			path: '/file/upload',
			name: 'upload-files',
			component: () => import('@/views/FilesUpload.vue')
		},
		{
			path: '/file/show',
			name: 'show-my-flies',
			component: () => import('@/views/FilesList.vue')
		},
		{
			path: '/developer',
			name: 'Developer',
			component: () => import('@/views/Developer.vue'),
			children: [
				{
					path: 'data_visualizer',
					name: 'DataVisualizer',
					component: () => import('@/components/components/developer/DataVisualizer.vue')
				},
				{
					path: 'file_uploader',
					name: 'FileUploader',
					component: () => import('@/components/components/FileUploader.vue')
				},
				{
					path: 'file_viewer',
					name: 'FileViewer',
					component: () => import('@/components/components/FileViewer.vue')
				},
				{
					path: 'test',
					name: 'Test',
					component: () => import('@/components/components/developer/Test.vue')
				},
				{
					path: 'live_player',
					name: 'LivePlayer',
					component: () => import('@/components/components/LivePlayer.vue')
				},
				{
					path: 'video_player',
					name: 'VideoPlayer',
					component: () => import('@/components/components/VideoPlayer.vue')
				},
				{
					path: 'test_player',
					name: 'TestPlayer',
					component: () => import('@/components/components/TestPlayer.vue')
				},
				{
					path: '*',
					component: PageNotFound,
				}
			]
		},
		{
			path: '/user',
			name: 'User',
			component: () => import('@/views/User.vue'),
			children: [
				{
					path: 'sign_in',
					name: 'SignIn',
					component: () => import('@/components/components/user/SignIn.vue')
				},
				{
					path: 'sign_up',
					name: 'SignUp',
					component: () => import('@/components/components/user/SignUp.vue')
				},
				{
					path: 'profile',
					name: 'Profile',
					component: () => import('@/components/components/user/Profile.vue')
				},
				{
					path: 'forgetpassword',
					name: 'ForgetPassword',
					component: () => import('@/components/components/user/ForgetPassword.vue')
				},
				{
					path: 'changepassword/:userid',
					name: 'ChangePassword',
					component: () => import('@/components/components/user/ChangePassword.vue')
				},
				{
					path: 'settings',
					name: 'Settings',
					component: () => import('@/components/components/user/Settings.vue')
				},
				{
					path: '*',
					component: PageNotFound,
				}
			]
		},
		{
			path: '/about',
			name: 'About',
			// route level code-splitting
			// this generates a separate chunk (about.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
		},
		{
			path: '*',
			component: PageNotFound,
		}
	]
});
