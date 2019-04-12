import Vue from 'vue'
import Router from 'vue-router'
import Device from '@/components/device'
import DeviceDetail from '@/components/device-detail'
import Login from '@/components/login'
import Template from '@/components/template'
import Data from '@/components/data'
import DataDetail from '@/components/data-detail'
import Store from '../store'

Vue.use(Router)
const routes =
  [
    {
      path: '/',
      name: 'login',
      component: Login,
      meta: {
        title: '登录'
      }
    },
    {
      path: '/device',
      name: 'Device',
      component: Device,
      meta: {
        title: '设备列表'
      }
    },
    {
      path: '/deviceDetail/:id',
      name: 'deviceDetail',
      component: DeviceDetail,
      meta: {
        title: '设备详情'
      }
    },
    {
      path: '/template',
      name: 'Template',
      component: Template,
      meta: {
        title: '模板列表'
      }
    },
    {
      path: '/data/:id',
      name: 'Data',
      component: Data,
      meta: {
        title: '数据点列表'
      }
    },
    {
      path: '/dataDetail/:id',
      name: 'DataDetail',
      component: DataDetail,
      meta: {
        title: '数据点详情'
      }
    }
  ]
// 路由配置
const router = new Router({
  routes
})
router.afterEach((to) => {
  Store.dispatch('changeTitle', to.meta.title)
})
export default router
