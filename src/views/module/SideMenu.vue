<template>
    <el-menu

            class="el-menu-vertical-demo"
            text-color="#000000"
            active-text-color="#ffd04b">



        <template default-active="Index" :index="menu.name" v-for="menu in menuList">



            <router-link :to="menu.path" >
                <el-menu-item :index="menu.name">
                    <template slot="title">
                        <i :class="menu.icon"></i>
                        <span slot="title">{{menu.title}}</span>
                    </template>
                </el-menu-item>
            </router-link>
        </template>
    </el-menu>


</template>

<script>
    export default {
        name: "SideMenu",
        data(){
            return {

            }
        },
        computed:  {
            menuList: {
                get() {
                    return this.$store.state.menus.menuList
                }
            }
        },





    }
</script>

<style scoped>


    .el-menu-vertical-demo{
        height: 100vh;
    }
    a{
        text-decoration:none;
    }
</style>