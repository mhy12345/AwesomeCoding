import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

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
			children: [
				{
					path: '',
					redirect: 'details',
				},
				{
					path: 'details',
					component : () => import('./components/resources/Details.vue'),
					name: 'class-details'
				},
				{
					path: 'live',
					component: () => import('./components/resources/Live.vue'),
					name: 'class-live'
				},
				{
					path: 'materials',
					component : () => import('./components/resources/Materials.vue'),
					name: 'class-materials'
				}
			]
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
                    component: () => import('./components/components/DataVisualizer.vue')
                },
                {
                    path: 'test',
                    name: 'Test',
                    component: () => import('./components/components/Test.vue')
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
                    component: () => import('./components/components/SignIn.vue')
                },
                {
                    path: 'sign_up',
                    name: 'SignUp',
                    component: () => import('./components/components/SignUp.vue')
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
