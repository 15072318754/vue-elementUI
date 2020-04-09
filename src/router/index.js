import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import cate from '../components/goods/cate.vue'
import Params from '../components/goods/params.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: cate },
      { path: '/params', component: Params }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 为路由挂载一个beforeach前置守卫
router.beforeEach((to, from, next) => {
  // 判断是否从登录页面过来的，如果是就放行
  if (to.path === '/login') return next()
  // 从登录页面过来后，再然后判断是否携带token，如果没有携带就返回login,如果是就放行
  const tokenRes = window.sessionStorage.getItem('token')
  if (!tokenRes) return this.$router.push('/login')
  next()
})
export default router
