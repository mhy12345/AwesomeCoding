import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Class from './views/Class.vue'
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
					redicect: 'details',
				},
				{
					path: 'details',
					component : ClassDetails,
					name: 'class-details'
				},
				{
					path: 'live',
					component : AudioPanel,
					name: 'class-live'
				}
			]
		},
		{
			path: '/classes',
			name: 'classes',
			component: () => import('./views/Classes.vue')
		},
        {
            path: '/developer/data_visualizer',
            name: 'data_visualizer',
            component: () => import('./views/DataVisualizer.vue')
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
        }
    ]
});
