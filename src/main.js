// import '@babel/polyfill'
// import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import { formatBalance, formatUserAddress, formatPrice } from './utils/helper'
import EmptyImg from '@/components/common/EmptyImg'

Vue.config.productionTip = false

Vue.filter('amountForm', formatBalance)
Vue.filter('formatPrice', formatPrice)
Vue.filter('formatUserAddress', formatUserAddress)
Vue.component('empty-img', EmptyImg)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
