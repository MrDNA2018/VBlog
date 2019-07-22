import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
// import ArticleList from '@/components/ArticleList'
import QueryFraud from '@/components/QueryFraud'
import QueryCommunity from '@/components/QueryCommunity'
// import PostArticle from '@/components/PostArticle'
// import UserMana from '@/components/UserMana'
// import BlogDetail from '@/components/BlogDetail'
// import CateMana from '@/components/CateMana'
// import DataCharts from '@/components/DataCharts'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: '登录',
    //   hidden: true,
    //   component: Login
    // },
    // {
    //   path: '/home',
    //   name: '',
    //   component: Home,
    //   hidden: true
    // },
    // {
    //   path: '/',
    //   name: '',
    //   component: Home,
    //   hidden: true
    // },
    {
      path: '/',
      component: Home,
      name: '风险网络',
      // iconCls: 'fa fa-file-text-o',
      iconCls: 'fa fa-bar-chart',
      children: [
        {
          path: '/QueryFraud',
          iconCls: 'fa fa-bar-chart',
          name: '发现风险网络',
          component: QueryFraud,
          meta: {
            keepAlive: true
          }
        }
      ]
    },
    {
      path: '/',
      component: Home,
      name: '风险社区',
      iconCls: 'fa fa-bar-chart',
      children: [
        {
          path: '/QueryCommunity',
          iconCls: 'fa fa-bar-chart',
          name: '查询风险社区',
          component: QueryCommunity
        }
      ]
    },
    {
      path: '/',
      component: Home,
      name: 'test',
      iconCls: 'fa fa-bar-chart',
      children: [
        {
          path: '/QueryCommunity',
          iconCls: 'fa fa-bar-chart',
          name: 'test',
          component: QueryCommunity
        }
      ]
    }
    // {
    //   path: '/home',
    //   component: Home,
    //   name: '用户管理',
    //   children: [
    //     {
    //       path: '/user',
    //       iconCls: 'fa fa-user-o',
    //       name: '用户管理',
    //       component: UserMana
    //     }
    //   ]
    // },
    // {
    //   path: '/home',
    //   component: Home,
    //   name: '栏目管理',
    //   children: [
    //     {
    //       path: '/cateMana',
    //       iconCls: 'fa fa-reorder',
    //       name: '栏目管理',
    //       component: CateMana
    //     }
    //   ]
    // },

  ]
})
