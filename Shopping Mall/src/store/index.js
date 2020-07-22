import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import tagsView from '@/store/modules/tagsView'
import navList from '@/store/modules/navList'
import { getCookie, setCookie, delCookie } from '../utils/cookie'
 
Vue.use(Vuex)

let token = getCookie('token')
let isLogin = token ? true : false

export default new Vuex.Store({
  state: {
    username:'',
    userGrade:'',
    token: token,
    isLogin: isLogin,
    isNavShrink: false,
    goodsStatusStr: '',
    isShowEditGoods: false,
    btnDisabled: false,
  },
  mutations: {
    LOG_IN(state, { token = ''}) {
      state.isLogin = true
      state.token = token
      setCookie('token', token, 10)
    },

    LOG_OUT(state) {
      state.isLogin = false
      state.token = ''
      delCookie('token')
      router.push("/login")
    },

    // 导航 展开/收缩
    SCROLL_NAV(state) {
      state.isNavShrink = !state.isNavShrink
    },
    GOODS_STATE(state){
        state.goodsStatusStr = '';
        state.isShowEditGoods = false;
    },
    CHANGE_GOODS_STATE(state){
      state.goodsStatusStr = '添加商品';
      state.isShowEditGoods = true;
    },
  },
  
  actions: {},

  getters: {
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    navList: state => state.navList.list
  },

  modules: {
    tagsView,
    navList
  }
})
