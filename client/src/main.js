import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'es6-promise/auto'
import store from './store'

import {
    Alert,
    Avatar,
    Breadcrumb,
    Button,
    Card,
    Checkbox,
    Col,
    ConfigProvider,
    DatePicker,
    Divider,
    Dropdown,
    Form,
    Input,
    InputNumber,
    Layout,
    Menu,
    Modal,
    Result,
    Row,
    Select,
    Space,
    Spin,
    Switch,
    Table,
    Tabs,
    Tag,
    Tooltip,
    Typography,
} from "ant-design-vue";

import "ant-design-vue/dist/antd.css"; // or 'ant-design-vue/dist/antd.less'

const app = createApp(App)

const components = [
    Alert,
    Avatar,
    Breadcrumb,
    Button,
    Card,
    Checkbox,
    Col,
    ConfigProvider,
    DatePicker,
    Divider,
    Dropdown,
    Form,
    Input,
    InputNumber,
    Layout,
    Menu,
    Modal,
    Result,
    Row,
    Select,
    Space,
    Spin,
    Switch,
    Table,
    Tabs,
    Tag,
    Tooltip,
    Typography
]

components.forEach(component => {
    app.use(component)
})

app.use(store)
app.use(router).mount('#app')