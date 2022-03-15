<template  >
  <el-container style="width: 100%;margin: 0px;padding: 0px;height: 100vh">
    <!--侧边栏容器-->
    <SideMenu style=" height: 100vh;"></SideMenu>
    <!--顶栏容器-->
    <el-container>
      <el-header >
        <!--logo-->
        <el-image :src="require('@/assets/images/logo.png')" style="width: 150px; height: 50px; "></el-image>
        <strong style=" font-size: 18px; font-weight: 500; color: #ffffff; font-size: 20pt"> Doctor   ·  Client </strong>
        <!--头像角色-->
        <div class="header-avatar" >
          <el-avatar :src="userInfo.avatar" size="medium" style="width: 50px; height: 50px; margin: 5px; background-color: #efbf53;">头像</el-avatar>
          <el-dropdown>
            <!--用户角色/姓名-->
            <div  class="el-dropdown-link" >
               <span>
              {{ userInfo.name }}
              <i class="el-icon-arrow-down el-icon--right" ></i>
            </span>
            </div>

            <!--用户权限-->
            <el-dropdown-menu slot="dropdown">
              <!--管理员用户有“权限中心”选项-->
              <router-link to="userCenter">
                <el-dropdown-item v-if="userInfo.role==='admin'">权限中心</el-dropdown-item>
              </router-link>
              <!--所有用户都有“推出”选项-->
              <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <!--主要区域容器-->
      <el-main style="margin:0px;padding: 0px">
        <div >
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>


<script>
import SideMenu from "./module/SideMenu";

export default {
  name: "Home",
  components: {
    SideMenu
  },
  data() {
    return {
      //用户信息对象
      userInfo: {
        name: "",
        avatar: "",
        role: ""

      }
    }
  },
  //渲染页面时，获取用户信息
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      //获取用户信息，从本地存储中获取
      this.userInfo = JSON.parse(localStorage.getItem("userInfo"))
    },
    //退出登录
    logout() {
      //清除内存，重置信息，跳转页面
      localStorage.clear()
      sessionStorage.clear()
      //调用resetState清除token等状态数据
      this.$store.commit("resetState")
      this.$store.commit("resetRole")
      this.$router.push("/login")
    }
  }


}
</script>

<style scoped>

/*顶栏容器*/
.el-header {
  border-bottom: #cccccc solid 1px;
  border-right:#cccccc solid 1px;
  background:linear-gradient(to right,#1c5149,#5c805a,#90b477);
  width: 100%;
  height: 70px;
  padding: 0px;
  display: flex;
  list-style: none;/*两端*/
  justify-content: space-between;
  text-align: center;
  align-items: center;

}
/*用户角色姓名*/
.el-dropdown-link {
  cursor: pointer;
  color: #ffffff;
  background-color: #3d634a;
  width: 80px;
  height: 60px;

}

/*用户头像*/
.header-avatar {
  float: right;
  width: 200px;
  height: 70px;
  background-color: #3d634a;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

/*顶栏容器*/
.el-header {
  text-align: center;
  line-height: 60px;
  background-color: #ffffff;
  color: #333;
}

/*主要区域容器--*/
.el-main {
  color: #333;
  line-height: 60px;
}

</style>