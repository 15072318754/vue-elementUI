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
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 注册为全局组件
Vue.component('Mbxs', Mbx)
Vue.component('tree-table', TreeTable)


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
// 没有Vue.config.productionTip = false这句代码，它会显示你生产模式的消息
// 有了这句代码，它会阻止你显示显示生产模式的消息
Vue.config.productionTip = false
// 注册富文本编辑器
Vue.use(VueQuillEditor)
// 日期过滤器
Vue.filter('dataformate', function (time) {
  const dt = new Date(time)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
