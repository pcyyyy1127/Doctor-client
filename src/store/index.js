import Vue from 'vue'
import Vuex from 'vuex'
import menus from "./modules/menus"
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:''
  },
  mutations: {
    SET_TOKEN:(state ,token) =>{
      state.token = token
      localStorage.setItem("token",token)
    },
    //调用resetState清除token数据
    resetState:(state) =>{
       state.token = ''
    },
    setUserInfo:(state,userInfo) =>{
      state.userInfo = JSON.stringify(userInfo)
      localStorage.setItem("userInfo",JSON.stringify(userInfo))
    },
    //调用resetState清除用户数据
    resetUserInfo:(state) =>{
      state.userInfo = ''
    },

  },
  actions: {
  },
  modules: {
    menus
  }
})
