import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

import api from './services/api';
import router from './routes';

import VeeValidate from 'vee-validate';

Vue.config.productionTip = false
Vue.prototype.$http = api;

Vue.use(VeeValidate);


new Vue({
  vuetify,
  render: h => h(App),
  router
}).$mount('#app')
