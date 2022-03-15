<template>


  <!--侧边栏-->
  <el-row style="background-color: #1c5149">
    <!--目录上方展开关闭按钮-->
    <el-radio-group v-model="isCollapse">
      <el-image v-show="!isCollapse" :src="require('@/assets/images/close.png')" style="width: 14px; height: 14px; "
                @click="isCollapse=true"></el-image>
      <el-image v-show="isCollapse" :src="require('@/assets/images/open.png')" style="width:14px; height: 14px; "
                @click="isCollapse=false"></el-image>
    </el-radio-group>

    <!--动态路由绑定 -->
    <el-menu :collapse="isCollapse" text-color="#ffffff" @close="handleClose" @open="handleOpen"
             active-text-color="#efbb4e" background-color="#1c5149"  class="el-menu-vertical-demo" >
      <template v-for="menu in menuList" :index="menu.name" default-active="Index">
        <router-link :to="menu.path">
          <el-menu-item :index="menu.name">
              <i :class="menu.icon"  style="color: #ffffff"></i>
              <span slot="title">{{ menu.title }}</span>
          </el-menu-item>
        </router-link>
      </template>
    </el-menu>

  </el-row>
</template>

<script>
export default {
  name: "SideMenu",
  data() {
    return {
      isCollapse: true,
      dialogVisible: false,
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  computed: {
    //获取目录方法
    menuList: {
      get() {
        return this.$store.state.menus.menuList
      }
    }
  },


}
</script>

<style scoped>
.el-container {
  padding: 0;
  margin: 0;
  height: 100vh;
}

a {
  text-decoration: none; /*取消下划线*/
}

/*侧边栏宽度和高*/
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 150px;

}

.el-row {
  text-align: center;
  line-height: 200px;
  height: 100%;
}

</style>