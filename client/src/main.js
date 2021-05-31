import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import {
    Breadcrumb,
    Button,
    Card,
    Col,
    Form,
    Input,
    Layout,
    Menu,
    Row,
    Tabs,
    Typography,
} from "ant-design-vue";

import "ant-design-vue/dist/antd.css"; // or 'ant-design-vue/dist/antd.less'

const app = createApp(App)

const components = [
    Breadcrumb,
    Button,
    Card,
    Col,
    Form,
    Input,
    Layout,
    Menu,
    Row,
    Tabs,
    Typography
]

components.forEach(component => {
    app.use(component)
})

app.use(router).mount('#app')
