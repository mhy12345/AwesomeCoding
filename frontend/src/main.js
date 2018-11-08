import Vue from 'vue';
import VueResource from 'vue-resource';
import App from './App.vue';
import './plugins/element.js';
import router from './router/index.js';
import VueSocketio from 'vue-socket.io';

const server_url = window.location.protocol + '//' + window.location.hostname;

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(VueSocketio, server_url);

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
