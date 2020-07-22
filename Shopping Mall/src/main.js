import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAMap from 'vue-amap';

import '@/utils/request'
import '@/styles/index.scss'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import BasePagination from '@/components/BasePagination'
Vue.component('BasePagination', BasePagination)

Vue.use(ElementUI)

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: 'a012ecd6d23522bde888571c1a79740b',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor','AMap.Geocoder'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
});


Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (store.state.token) { //如果有就直接到首页咯
    next();
  } else {
    if (to.path === '/login') { //如果是登录页面路径，就直接next()
      next();
    } else { //不然就跳转到登录；
      next('/login');
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
