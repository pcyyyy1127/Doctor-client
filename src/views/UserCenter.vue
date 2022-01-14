<template>
    <div>

        <el-form style="margin-top: -2%">
            <el-button   @click="dialogVisible2 = true">新增账号</el-button>
        </el-form>
        <el-table
                :data="tableData"
                style="width: 100%;margin-top: 0%"
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
                <template slot-scope="scope">
                    <el-switch
                            v-model="scope.row.enable"
                            :active-value="1"
                            :inactive-value="0"
                            active-text="启用"
                            inactive-text="禁用"
                            @change="changeEnable(scope.row.id,scope.row.enable)"
                    >
                    </el-switch>
                </template>

            </el-table-column>



            <el-table-column
                    prop="option"
                    label="操作"
                    width="200">
                <template slot-scope="scope">
                    <el-button size="mini" round slot="reference"  @click="showDialog(scope.row.id)">密码修改</el-button>
                    <el-button size="mini" round  @click="offline(scope.row.id)" >强制下线</el-button>
                </template>
            </el-table-column>

        </el-table>
        <div class="block">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[5, 10, 30]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    background
            >
            </el-pagination>
        </div>


        <el-dialog
                :visible.sync="dialogVisible"
                width="30%"
        >
            <el-form :model="ruleForm"  :rules="rules" ref="ruleForm" >
                <el-form-item label="请输入新的密码" prop="newPassword" >
                    <el-input placeholder="请输入密码" v-model="ruleForm.newPassword" show-password size="mini" style="width:60%"></el-input>
                </el-form-item>
                <el-form-item label="请再次输入新密码" prop="newPassword2" >
                    <el-input placeholder="请再次输入密码" v-model="ruleForm.newPassword2" show-password size="mini" style="width:60%"></el-input>
                </el-form-item>
                <el-button size="mini" round  @click="updatePassword()">确定</el-button>
            </el-form>

        </el-dialog>

            <el-dialog
                    :visible.sync="dialogVisible2"
                    width="30%"
            >

                <el-form :model="newAccount"  :rules="newAccountRules" ref="newAccount" >
                    <el-form-item label="医生姓名" prop="name" >
                        <el-input placeholder="请输入用户名" v-model="newAccount.name" size="mini" style="width:60%"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名" prop="username" >
                        <el-input placeholder="请输入用户名" v-model="newAccount.username"  size="mini" style="width:60%"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="password" >
                        <el-input placeholder="请输入密码" v-model="newAccount.password" show-password size="mini" style="width:60%"></el-input>
                    </el-form-item>
                    <el-form-item label="再次输入新密码" prop="password2" >
                        <el-input placeholder="请再次输入密码" v-model="newAccount.password2" show-password size="mini" style="width:60%"></el-input>
                    </el-form-item>
                    <el-form-item label="角色：" >
                        <el-radio v-model="newAccount.role" label="admin">管理员</el-radio>
                        <el-radio v-model="newAccount.role" label="doctor">医生</el-radio>
                    </el-form-item>


                    <el-form-item label="头像URL：" >
                        <el-input placeholder="不输入则使用默认头像" v-model="newAccount.avatar"  size="medium" style="width:100%"></el-input>
                    </el-form-item>

                </el-form>


            <el-button size="mini" round  @click="createAccount()">确定</el-button>

        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "UserCenter",
        data()  {
           return {
               chooseId:null,
               dialogVisible : false,
               dialogVisible2 :false,
               currentPage: 1,
               pageSize:10,
               total:null,
               tableData: [],
               ruleForm:{
                   newPassword:"",
                   newPassword2:"",
               },

               newAccount:{
                   username:"",
                   name:"",
                   password:"",
                   password2:"",
                   role:"doctor",
                   scope:[],
                   avatar:null,
               },


               newAccountRules: {
                   username: [
                       { required: true, message: '用户名不能为空', trigger: 'blur' },
                   ],
                   name: [
                       { required: true, message: '姓名不能为空', trigger: 'blur' },
                   ],
                   password: [
                       { required: true, message: '密码不能为空', trigger: 'blur' },
                   ],
                   password2: [
                       { required: true, message: '密码不能为空', trigger: 'blur' },
                   ],

               },
           }
        },

        methods: {

            handleSizeChange(val) {
                this.pageSize = val
                this.list()
            },
            //上一页 下一页触发的方法
            handleCurrentChange(val) {
                this.currentPage = val
                this.list()
            },


            //查询列表
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
                    that.pageSize = res.data.data.size

                    console.log(that.tableData)
                })
            },
            // 禁用账号滑块状态改变时触发
            changeEnable(id,enable) {
                let that = this
                this.$axios.get("/doctor/authority/forbid",{
                    params:{
                        id:id,
                        enable:enable
                    },

                }).then(res => {
                    console.log(res)
                    if (res.data.message == "success"){
                        that.$message({
                            showClose: true,
                            message: res.data.data,
                            type: 'success'
                        });
                    }

                })

            },
            //强制下线
            offline(id){
                let that = this
                this.$axios.get("/doctor/authority/offline",{
                    params:{
                        id:id,
                    },

                }).then(res => {

                    if (res.data.message == "success"){
                        that.$message({
                            showClose: true,
                            message: res.data.data,
                            type: 'success'
                        });
                    }


                })
            },
            //弹出对话框 并获取当前操作的账号id
            showDialog(id){
                this.dialogVisible = true
                this.chooseId = id
            },

            updatePassword() {
                let that = this
                if(this.ruleForm.newPassword == "" || this.ruleForm.newPassword2 == "") {
                    that.$message({
                        showClose: true,
                        message: "请输入密码后再提交",
                        type: 'error'
                    });
                }
                else {
                    if(this.ruleForm.newPassword != this.ruleForm.newPassword2) {
                        that.$message({
                            showClose: true,
                            message: "两次密码输入不一致请重新输入",
                            type: 'error'
                        });
                    }
                    else {
                        this.$axios.post("/doctor/authority/update",{
                            id:that.chooseId,
                            password:that.ruleForm.newPassword,
                            repeatPassword:that.ruleForm.newPassword2
                        }).then(res => {
                            if (res.data.message == "success"){
                                that.$message({
                                    showClose: true,
                                    message: res.data.data,
                                    type: 'success'
                                });
                                that.dialogVisible = false
                                that.ruleForm.newPassword = ""
                                that.ruleForm.newPassword2 = ""
                            }

                        })

                    }
                }
            },
            //新建账号
            createAccount() {
                let that = this
                if(this.newAccount.username == "" || this.newAccount.name == "" || this.newAccount.password == "" || this.newAccount.password2 == "") {
                    that.$message({
                        showClose: true,
                        message: "请输入必填字段后再提交",
                        type: 'error'
                    });
                }
                else{
                    if(this.newAccount.password != this.newAccount.password2) {
                        that.$message({
                            showClose: true,
                            message: "两次密码输入不一致请重新输入",
                            type: 'error'
                        });
                    }
                    else {
                        this.$axios.post("/doctor/authority/add",{
                            username:that.newAccount.username,
                            name:that.newAccount.name,
                            password:that.newAccount.password,
                            repeatPassword:that.newAccount.password2,
                            role:that.newAccount.role,
                            avatar:that.newAccount.avatar,

                        }).then(res => {
                            if (res.data.message == "success"){
                                that.$message({
                                    showClose: true,
                                    message: res.data.data,
                                    type: 'success'
                                });
                                that.dialogVisible2 = false
                                that.newAccount.username = ""
                                that.newAccount.name = ""
                                that.newAccount.password = ""
                                that.newAccount.password2 = ""
                                that.newAccount.avatar = null

                                that.list();
                            }

                        })

                    }


                }
            }


        },
        //页面渲染时，请求
        created() {
            this.list()
        }

    }



</script>

<style scoped>

</style>