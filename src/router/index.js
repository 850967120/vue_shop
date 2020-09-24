import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
Vue.use(Router)

const router = new Router({

  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login,
      meta: {
        title: '电商后台管理系统|登陆界面'
      }
    },
    {
      path: '/home',
      component: Home,
      meta: {
        title: '电商后台管理系统|管理界面'
      }
    }
  ]
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
// to 将要访问的路径
// from 代表从那个路径跳转来的
// next 是一个函数，表示放行 next('/login')表示强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
