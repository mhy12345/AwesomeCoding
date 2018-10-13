import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router/index.js'
import VueResource from 'vue-resource';


Vue.config.productionTip = false;
Vue.use(VueResource);


new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
