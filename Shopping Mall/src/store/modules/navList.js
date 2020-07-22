const navList = {
  state: {
    list: [
      {
        title: '统计面板',
        index: '/',
        icon: require('@/assets/-svg/home.svg')
      },

      {
        title: '轮播图管理',
        index: '/Advertisement/bannerlList',
        icon: require('@/assets/-svg/lbt.svg'),
      },

      {
        title: '商品分类管理',
        index: '/goods/cate',
        icon: require('@/assets/-svg/fl.svg'),
        
      },
      {
        title: '商品管理',
        index: '/goods',
        icon: require('@/assets/-svg/sp.svg'),
        children:[
          {
            title: '商品列表',
            index: '/goods/list',
          },
          {
          title: '评价管理',
          index: '/evaluate/evaluate',
          icon: require('@/assets/-svg/pj.svg'),
          },
        ]
      },
      {
        title: '订单管理',
        index: '/order/mention',
        icon: require('@/assets/-svg/order.svg'),
      },
      {
        title: '退款管理',
        index: '/order/MemberendPayout',
        icon: require('@/assets/-svg/order.svg'),
      },
      {
        title: '退款原因',
        index: '/order/refund',
        icon: require('@/assets/-svg/order.svg'),
      },
      {
        title: '会员管理',
        index: '/vipAdmin/vipAdmin',
        icon: require('@/assets/-svg/member.svg'),
        children: [
          {
            title: '会员列表',
            index: '/vipAdmin/vipAdmin'
          },
          {
            title: '会员图谱',
            index: '/vipAdmin/tupu'
          },
          {
            title: '佣金列表',
            index: '/vipAdmin/yongjin'
          }
        ]
      },
      {
        title: '提货点管理',
        index: '/takeGoods/list',
        icon: require('@/assets/-svg/article.svg'),
      },
      {
        title: '供货商管理',
        index: '/supplier/list',
        icon: require('@/assets/-svg/article.svg'),
      },
      {
        title: '期次管理',
        index: '/period/list',
        icon: require('@/assets/-svg/article.svg'),
      },
      {
        title: '提现管理',
        index: '/withdraw/withdraw',
        icon: require('@/assets/-svg/spf.svg'),
      },
      {
        title: '文章管理',
        index: '/articleAdmin',
        icon: require('@/assets/-svg/member.svg'),
        children: [
          {
            title: '平台公告',
            index: '/articleAdmin/multipleAdmin'
          },
          {
            title: '单页文章',
            index: '/articleAdmin/wenzhang'
          }
        ]
      },
      {
        title: '系统配置',
        index: '/SystemAdmin/parameterAdmin',
        icon: require('@/assets/-svg/system.svg'),
      },
    ]
  }
}

export default navList
