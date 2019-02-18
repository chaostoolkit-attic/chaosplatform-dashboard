import Vue from 'vue'
import store from '@/store'
import App from './App.vue'
import {
  createRouter
} from '@/routes'
import './assets/sass/main.scss'

Vue.config.productionTip = false

// tslint:disable-next-line:no-unused-expression
new Vue({
  el: '#app',
  store,
  router: createRouter(),
  render: (h: any) => h(App)
})
