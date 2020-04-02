import Vue from 'vue'
import {
  Button,
  Form,
  Input,
  FormItem,
  Alert,
  Message
} from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Alert)
// 将弹框组件挂载到原型身上
Vue.prototype.$message=Message

