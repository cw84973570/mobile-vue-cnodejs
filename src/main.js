import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store/index'
import './static/css/reset.css'
import IScrollView from 'vue-iscroll-view'
import IScroll from 'iscroll'
import 'github-markdown-css'
import './common/sass/index.scss'

Vue.config.productionTip = false
Vue.use(IScrollView, IScroll)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

