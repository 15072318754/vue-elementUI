import Vue from 'vue'
import {
  Button,
  Form,
  Input,
  FormItem,
  Alert,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  menuItemGroup,
  menuItem
} from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Alert)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(menuItemGroup)
Vue.use(menuItem)


// 将弹框组件挂载到原型身上
Vue.prototype.$message=Message

