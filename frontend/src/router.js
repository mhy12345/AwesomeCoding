import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Class from './views/Class.vue'
import Developer from './views/Developer'
import ClassDetails from './components/resources/ClassDetails.vue'
import AudioPanel from './components/resources/AudioPanel.vue'

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
            component: Home
        },
		{
			path: '/class/:class_id',
			name: 'Class',
			component: Class,
			children: [
				{
					path: '',
					redirect: 'details',
				},
				{
					path: 'details',
					component : ClassDetails,
					name: 'class-details'
				},
				{
					path: 'live',
					component: () => import('./components/resources/VideoPlayer.vue'),
					name: 'class-live'
				},
				{
					path: 'materials',
					component : () => import('./components/resources/ClassMaterials.vue'),
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
			path: '/classes',
			name: 'classes',
			component: () => import('./views/Classes.vue')
		},
        {
            path: '/developer',
            name: 'Developer',
            component: Developer,
            children: [
                {
                    path: 'data_visualizer',
                    name: 'DataVisualizer',
                    component: () => import('./components/resources/DataVisualizer.vue')
                },
                {
                    path: 'test',
                    name: 'Test',
                    component: () => import('./components/resources/Test.vue')
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
