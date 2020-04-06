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
  menuItem,
  Breadcrumb,
  breadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Tooltip,
  Switch,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option
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
Vue.use(Breadcrumb)
Vue.use(breadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)









// 将弹框组件挂载到原型身上
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

