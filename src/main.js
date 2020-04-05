import Vue from 'vue'
// 完整引入
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
// 按需引入
import './plugin/element.js'
import './assets/fonts/iconfont.css'
// Vue.use(ElementUI)
import axios from 'axios'
// 面包屑
import Mbx from './components/Mbx.vue'
// 注册为全局组件
Vue.component('Mbxs', Mbx)

// 配置基准地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截器
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 把axios挂载到实例上
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
