<template>
    <el-container>
        <el-aside width="200px">

            <side-menu></side-menu>

        </el-aside>

        <el-container>
            <el-header>
                <strong>慢性肺病的中医慢病管理平台</strong>
                <div class="header-avatar">
                    <el-avatar size="medium" :src="userInfo.avatar"></el-avatar>
                    <el-dropdown>
  <span class="el-dropdown-link">
    {{userInfo.name}}<i class="el-icon-arrow-down el-icon--right"></i>
  </span>
                        <el-dropdown-menu slot="dropdown">
                            <router-link to="userCenter">
                                <el-dropdown-item v-if="userInfo.role==='admin'">权限中心</el-dropdown-item>
                            </router-link>
                            <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-header>
            <el-main>
                <div style="margin: 0 15px">
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
        components:{
            SideMenu
        },
        data(){
         return{
             userInfo:{
                 name:"",
                 avatar:"",
                 role:""

             }
         }
        },
        //渲染页面时，获取用户信息
        created() {
            this.getUserInfo()
        },
        methods:{
            getUserInfo(){
                //获取用户信息
               this.userInfo = JSON.parse(localStorage.getItem("userInfo"))


            },
            logout() {
                    localStorage.clear()
                    sessionStorage.clear()
                    this.$store.commit("resetState")
                    this.$store.commit("resetRole")
                    this.$router.push("/login")
                }
            }


    }
</script>

<style scoped>
    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }

    .header-avatar{
        float: right;
        width: 120px;
        display: flex;
        justify-content: space-around;
        align-items: center;

    }
    .el-container {
        padding: 0;
        margin: 0;
        height: 100vh;
    }

    .el-header {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        line-height: 200px;
    }

    .el-main {

        color: #333;

        line-height: 160px;
    }

</style>