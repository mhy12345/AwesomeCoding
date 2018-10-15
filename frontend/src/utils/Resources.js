//所有可用的教学资源


var supported_resources = {
	details : {
		name:'details',
		title:'课程信息',
		component : ()=>import('../components/resources/Details.vue'),
		disabled : true,
		defaultChosen : true,
	},
	live : {
		name:'live',
		title:'在线授课',
		component : ()=>import('../components/resources/Live.vue'),
		disabled : false,
		defaultChosen : false,
	},
	materials : {
		name:'materials',
		title:'课程资料',
		component : ()=>import('../components/resources/Materials.vue'),
		disabled : false,
		defaultChosen : false,
	},
	settings : {
		name:'settings',
		title:'课程设置',
		component: ()=>import('../components/resources/Settings.vue'),
		disabled : true,
		defaultChosen : true,
	},
	chatting_room : {
		name:'chatting_room',
		title:'讨论区',
		component: ()=>import('../components/resources/NotComplete.vue'),
		disabled : false,
		defaultChosen : false,
	},
	train_area : {
		name:'train_area',
		title:'练习区',
		component: ()=>import('../components/resources/NotComplete.vue'),
		disabled : false,
		defaultChosen : false,
	},
};
var router_childs = [{path:'',redirect:'details'}];
for (var key in supported_resources) {
	router_childs.push({
		path:key,
		component:supported_resources[key].component,
		name:'class-'+key
	});
}
var avaliable_resources = [];
for (var key in supported_resources) {
	avaliable_resources.push({
		key : key,
		label : supported_resources[key].title,
		disabled : supported_resources[key].disabled
	});
}
var default_resources = [];
for (var key in supported_resources) {
	if (supported_resources[key].defaultChosen) {
		default_resources.push(key);
	}
}
export {supported_resources,router_childs,avaliable_resources,default_resources};
