import Vue from 'vue';
import VueResource from 'vue-resource';
import App from './App.vue';
import './plugins/element.js';
import router from './router/index.js';
import VueSocketio from 'vue-socket.io';
import VueVisible from 'vue-visible';
import preview from 'vue-photo-preview' // 图片预览插件
import 'vue-photo-preview/dist/skin.css'

const server_url = window.location.protocol + '//' + window.location.hostname;

Vue.config.productionTip = false;
Vue.use(VueVisible);
Vue.use(VueResource);
Vue.use(VueSocketio, server_url);
Vue.use(preview);
// Vue.use(Recorder);

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
