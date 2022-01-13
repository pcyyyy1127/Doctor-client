<template>
    <div>

        <el-table
                :data="tableData"
                style="width: 100%;margin-top: -3%"
                row-key="id"
                border
                stripe
                default-expand-all
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column
                    prop="id"
                    label="id"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="username"
                    label="用户名"
                    width="120"
            >
            </el-table-column>

            <el-table-column
                    prop="name"
                    width="150"
                    label="医生姓名">
            </el-table-column>
            <el-table-column
                    prop="role"
                    width="150"
                    label="账号角色">
            </el-table-column>
            <el-table-column
                    prop="scope"
                    width="150"
                    label="域范围">
            </el-table-column>


            <el-table-column
                    prop="enable"
                    width="200"
                    label="是否禁用账号">
            </el-table-column>



            <el-table-column
                    prop="option"
                    label="操作"
                    width="200">
                <template >
                    <el-button size="mini" round  @click="" >密码修改</el-button>
                    <el-button size="mini" round  @click="" >强制下线</el-button>
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
    export default {
        name: "UserCenter",
        data()  {
           return {

               currentPage: 1,
               pageSize:10,
               total:null,
               tableData: [],
           }
        },

        methods: {
            list() {

                let that = this
                this.$axios.get("/doctor/authority/list",{
                    params:{
                        currentPage:that.currentPage,
                        pageSize:that.pageSize
                    },

                }).then(res => {

                    console.log(res)
                    that.tableData = res.data.data.records
                    that.total = res.data.data.total
                    that.pageSize = res.data.data.pageSize

                    console.log(that.tableData)
                })
            },


        },
        //页面渲染时，请求
        created() {
            this.list()
        }

    }



</script>

<style scoped>

</style>