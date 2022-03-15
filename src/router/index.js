import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import index from '../views/index'
import Archives from "../views/Archives";
import FollowUp from "../views/FollowUp";
import store from "../store";
import Login from "../views/Login";
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: "Login",
    component:Login
  } ,


  {
    path: '/home',
    name: 'Home',
    component: Home,
    children:[
      {
        path: '/index',
        name: 'index',
        component: () => import( '../views/index.vue')
      },
      {
        path: '/archives',
        name: 'Archives',
        component: () => import( '../views/Archives.vue')
      },
      {
        path: '/userCenter',
        name: 'UserCenter',
        component: () => import( '../views/UserCenter.vue')
      },
      {
        path: '/followUp',
        name: 'FollowUp',
        component: () => import( '../views/FollowUp.vue')
      },
      {
        path: '/data',
        name: 'data',
        component: () => import( '../views/Data.vue')
      },
      {
        path: '/selfManage',
        name: 'selfManage',
        component: () => import( '../views/SelfManage.vue')
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import( '../views/Login.vue')
  },


]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {

  let hasRoute = store.state.menus.hasRoutes

  let token = localStorage.getItem("token")

  if (to.path === '/login') {//to.path == '/login'
    next()

  }
  else if (!token) {
    next({path: '/login'})//next({path: '/login'})


  }
  else if(token && !hasRoute) {
    //导航 直接写死
    let nav = [
      {
        name: 'archives',
        title: '就诊信息',
        icon: 'el-icon-postcard',
        path: '/archives',
        component: '/Archives',

      },
      {
        name: 'followUp',
        title: '患者随访',
        icon: 'el-icon-phone-outline',
        component: '/followUp',
        path: '/followUp',

      },
      {
        name: 'SelfManage',
        title: '自我管理',
        icon: 'el-icon-table-lamp',
        component: '/selfManage',
        path: '/selfManage',

      },
      {
        name: 'Data',
        title: '数据中心',
        icon: 'el-icon-data-line',
        component: '/data',
        path: '/data',

      },

    ]

      // 拿到menuList
      store.commit("setMenuList", nav)





      // 动态绑定路由
      let newRoutes = router.options.routes

      nav.forEach(menu => {
        if (menu.children) {
          menu.children.forEach(e => {

            // 转成路由
            let route = menuToRoute(e)

            // 把路由添加到路由管理中
            if (route) {
              newRoutes[0].children.push(route)
            }

          })
        }
      })


      hasRoute = true
      store.commit("changeRouteStatus", hasRoute)
  }

  next()
})


// 导航转成路由
const menuToRoute = (menu) => {

  if (!menu.component) {
    return null
  }

  let route = {
    name: menu.name,
    path: menu.path,
    meta: {
      icon: menu.icon,
      title: menu.title
    }
  }
  route.component = () => import('@/views/' + menu.component +'.vue')

  return route
}

export default router
