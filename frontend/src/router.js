import Vue from 'vue'
import Router from 'vue-router'
import {router_childs} from './utils/Resources'

Vue.use(Router);
console.log(router_childs);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
		{
			path: '/',
			redirect : '/home'
		},
        {
            path: '/home',
            name: 'home',
            component: () => import('./views/Home.vue')
        },
		{
			path: '/class/:class_id',
			name: 'class',
			component: () => import('./views/Lecture.vue'),
			children: router_childs//子路由已经在utils/Resources中生成出来了
		},
		{
			path: '/courses/add',
			name: 'add-courses',
			component: () => import('./views/CoursesAdd.vue')
		},
		{
			path: '/courses/enter',
			name: 'enter-courses',
			component: () => import('./views/CoursesList.vue')
		},
        {
            path: '/developer',
            name: 'Developer',
			component: () => import('./views/Developer.vue'),
            children: [
                {
                    path: 'data_visualizer',
                    name: 'DataVisualizer',
                    component: () => import('./components/components/developer/DataVisualizer.vue')
                },
				{
					path: 'file_uploader',
					name: 'FileUploader',
                    component: () => import('./components/components/FileUploader.vue')
				},
				{
					path: 'file_viewer',
					name: 'FileViewer',
					component: () => import('./components/components/FileViewer.vue')
				},
                {
                    path: 'test',
                    name: 'Test',
                    component: () => import('./components/components/developer/Test.vue')
                },
                {
                    path: 'live_player',
                    name: 'TestPlayer',
                    component: () => import('./components/components/TestPlayer.vue')
                },
				{
					path: 'video_player',
					name: 'videoPlayer',
					component: () => import('./components/components/VideoPlayer.vue')
				}
            ]
        },
        {
            path: '/user',
            name: 'User',
            component : () => import('./views/User.vue'),
            children: [
                {
                    path: 'sign_in',
                    name: 'SignIn',
                    component: () => import('./components/components/user/SignIn.vue')
                },
                {
                    path: 'sign_up',
                    name: 'SignUp',
                    component: () => import('./components/components/user/SignUp.vue')
                },
                {
                    path: 'profile',
                    name: 'Profile',
                    component: () => import('./components/components/user/Profile.vue')
                }
            ]
        },
        {
            path: '/about',
            name: 'About',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
        }
    ]
});
