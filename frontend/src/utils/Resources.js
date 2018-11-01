/* eslint-disable camelcase,vars-on-top,no-redeclare */
// 课程面板里所有可用的教学资源
var supported_resources = {
	details: {
		name: 'details',
		title: '课程信息',
		component: () => import('../components/resources/Details.vue'),
		disabled: true,
		defaultChosen: true,
		access: {
			0: true,
			1: true,
			2: true,
		}
	},
	participants: {
		name: 'participants',
		title: '成员',
		component: () => import('../components/resources/Participants.vue'),
		disabled: false,
		defaultChosen: true,
		access: {
			0: true,
			1: true,
			2: true,
		}
	},
	live: {
		name: 'live',
		title: '在线授课',
		component: () => import('../components/resources/live/Main.vue'),
		disabled: false,
		defaultChosen: false,
		access: {
			0: true,
			1: true,
			2: true,
		}
	},
	materials: {
		name: 'materials',
		title: '课程资料',
		component: () => import('../components/resources/Materials.vue'),
		disabled: false,
		defaultChosen: false,
		access: {
			0: true,
			1: true,
			2: true,
		}
	},
    file_settings : {
        name: "file_settings",
        title: '资料设置',
        component : ()=>import('../components/resources/FileSettings.vue'),
        disabled: false,
        defaultChosen: false,
        access: {
            0: true,
            1: true,
            2: true,
        }
    },
	settings: {
		name: 'settings',
		title: '课程设置',
		component: () => import('../components/resources/Settings.vue'),
		disabled: true,
		defaultChosen: true,
		access: {
			0: true,
			1: true,
			2: false,
		}
	},
	chatting_room: {
		name: 'chatting_room',
		title: '讨论区',
		component: () => import('../components/resources/ChattingRoom.vue'),
		disabled: false,
		defaultChosen: false,
		access: {
			0: true,
			1: true,
			2: true,
		}
	},
	train_area: {
		name: 'train_area',
		title: '练习区',
		component: () => import('../components/resources/PracticeArea.vue'),
		disabled: false,
		defaultChosen: false,
		access: {
			0: true,
			1: true,
			2: true,
		}
	},
	train_area_teacher : {
		name:'train_area_teacher',
		title:'练习区(教师)',
		component: ()=>import('../components/resources/PracticeAreaTeacher.vue')
	},
	posts : {
		name:'posts',
		title:'主题贴',
		component: ()=>import('../components/resources/posts.vue'),
		disabled : false,
		defaultChosen : false,
	},
};
var router_childs = [{path: '', redirect: 'details'}];
for (var key in supported_resources) {
	router_childs.push({
		path: key,
		component: supported_resources[key].component,
		name: 'class-' + key
	});
}
var avaliable_resources = [];
for (var key in supported_resources) {
	avaliable_resources.push({
		key: key,
		label: supported_resources[key].title,
		disabled: supported_resources[key].disabled
	});
}
var default_resources = [];
for (var key in supported_resources) {
	if (supported_resources[key].defaultChosen) {
		default_resources.push(key);
	}
}
export {supported_resources, router_childs, avaliable_resources, default_resources};
