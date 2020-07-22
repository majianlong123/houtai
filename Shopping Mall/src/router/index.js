import Vue from 'vue'
import store from '@/store'
import Router from 'vue-router'
import Layout from '@/views/Layout'
import Login from '@/views/Login'

Vue.use(Router)

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
}


export default new Router({ 
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      component: Layout,
      children: [
        //首页
        {
          path: '/home',
          name: 'Home',
          component: () => import('@/views/Home'),
          meta: { title: '统计面板' },
          alias: '/'
        },

//广告管理    
        //轮播图
        {
          path: '/Advertisement/bannerlList',
          name: 'bannerlList',
          component: () => import('@/views/Advertisement/bannerlList'),
          meta: { title: '轮播图管理' }
        },

//商品分类管理
        {
          path: '/goods/cate',
          name: 'cate',
          component: () => import('@/views/Goods/cate'),
          meta: { title: ' 商品分类管理' }
        },

//商品管理
        {
          path: '/goods/list',
          name: 'goods',
          component: () => import('@/views/Goods/list'),
          meta: { title: '商品列表' },
          beforeEnter(to,from,next){
            store.commit('GOODS_STATE');
            // console.log(window);
            next();
          },
        },

// 商品预设
        {
          path: '/commodity/brand',
          name: 'brand',
          component: () => import('@/views/commodity/brand'),
          meta: { title: '品牌' }
        },
        {
          path: '/commodity/storage',
          name: 'storage',
          component: () => import('@/views/commodity/storage'),
          meta: { title: '储存条件' }
        },
        {
          path: '/commodity/integral',
          name: 'integral',
          component: () => import('@/views/commodity/integral'),
          meta: { title: '商品配置' }
        },
 //评价管理
        {
          path: '/evaluate/evaluate',
          name: 'evaluate',
          component: () => import('@/views/evaluate/evaluate'),
          meta: { title: '评价管理' }
        },




        {
          path: '/order/mention',
          name: 'mention',
          component: () => import('@/views/Order/mention'),
          meta: { title: '自提订单' }
        },
        {
          path: '/order/MemberendPayout',
          name: 'MemberendPayout',
          component: () => import('@/views/Order/MemberendPayout'),
          meta: { title: '退款管理' }
        },
        {
          path: '/order/refund',
          name: 'refund',
          component: () => import('@/views/Order/refund'),
          meta: { title: '退款原因' }
        },
//会员管理
        {
          path: '/vipAdmin/vipAdmin',
          name: 'vipAdmin',
          component: () => import('@/views/vipAdmin/vipAdmin'),
          meta: { title: '会员管理' }
        },
        {
          path: '/vipAdmin/tupu',
          name: 'vipAdmin',
          component: () => import('@/views/vipAdmin/tupu'),
          meta: { title: '会员图谱' }
        },
        {
          path: '/vipAdmin/yongjin',
          name: 'yongjin',
          component: () => import('@/views/vipAdmin/yongjin'),
          meta: { title: '佣金列表' }
        },
// 提货点管理
        {
          path: '/takeGoods/list',
          name: 'list',
          component: () => import('@/views/takeGoods/list'),
          meta: { title: '提货点列表' }
        },
// 提货点管理
        {
          path: '/supplier/list',
          name: 'list',
          component: () => import('@/views/supplier/list'),
          meta: { title: '供货商列表' }
        },
// 期次管理
        {
          path: '/period/list',
          name: 'period',
          component: () => import('@/views/period/list'),
          meta: { title: '期次列表' }
        },
//提现管理
        {
          path: '/withdraw/withdraw',
          name: 'withdraw',
          component: () => import('@/views/withdraw/withdraw'),
          meta: { title: '提现管理' }
        },
//文章管理
        {
          path: '/articleAdmin/multipleAdmin',
          name: 'multipleAdmin',
          component: () => import('@/views/articleAdmin/multipleAdmin'),
          meta: { title: '平台公告' }
        },
        {
          path: '/articleAdmin/wenzhang',
          name: 'wenzhang',
          component: () => import('@/views/articleAdmin/wenzhang'),
          meta: { title: '单页文章' }
        },
//系统配置
        //参数配置
        {
          path: '/SystemAdmin/parameterAdmin',
          name: 'parameterAdmin',
          component: () => import('@/views/SystemAdmin/parameterAdmin'),
          meta: { title: '参数配置' }
        }
      ]
    }
  ]
})
