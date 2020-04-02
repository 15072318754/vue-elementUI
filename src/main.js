import Vue from 'vue'
// 完整引入
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// 按需引入
import './plugin/element.js'
import App from './App.vue'
import router from './router'

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
