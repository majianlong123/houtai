import Vue from 'vue'
import store from '@/store'
import axios from 'axios'
import { getCookie } from './cookie'
import { Message } from 'element-ui'

const request = axios.create({
  // 仅在开发环境走代理
  baseURL: process.env.NODE_ENV === 'development' ? '' : '/'
})

request.interceptors.request.use(
  config => {
  
    // 登录后所有请求附带token
    if (store.state.isLogin) {
      config.headers.Authorization = "Bearer "+getCookie('token')
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

request.interceptors.response.use(
  res => {
    if (res.data.code == 1) {
      // success
      if( res.data.msg && res.data.msg !== 'ok'){
        Message.success(res.data.msg)
      }
    } else if (res.data.msg) {
      // fail
      Message(res.data.msg)
    }
    if (res.data.code == 1) return res.data
    return Promise.reject(res.data)
  },
  err => {
    //token 失效
    if (err.response && err.response.status === 900) {
      Message.error('请重新登录');
      store.commit('LOG_OUT')
      router.push("/login")
    } else {
      Message.error('网络错误，请重试')
    }
    return Promise.reject(err)
  }
)

Vue.prototype.$http = request

export default request