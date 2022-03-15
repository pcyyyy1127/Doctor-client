<template>
  <div style="margin: 20px; width: 100%;display: flex;flex-direction: row;justify-content: center">

    <!--用户操作-->
    <div style="width:100%; margin: 80px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
      <el-table :data="tableData" :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                border default-expand-all row-key="id" stripe
                style="width: 1022px;margin-top: 0%; border: #cccccc solid 1px; border-radius: 15px">
        <el-table-column label="id" prop="id" width="50"></el-table-column>
        <el-table-column label="用户名" prop="username" width="120"></el-table-column>
        <el-table-column label="医生/管理员姓名" prop="name" width="150"></el-table-column>
        <el-table-column label="账号角色" prop="role" width="150"></el-table-column>
        <el-table-column label="域范围" prop="scope" width="150"></el-table-column>
        <el-table-column label="是否禁用账号" prop="enable" width="200">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enable" :active-value="1" :inactive-value="0" active-text="启用"
                       inactive-text="禁用"
                       @change="changeEnable(scope.row.id,scope.row.enable)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="option" width="200">
          <template slot-scope="scope">
            <el-button slot="reference" round size="mini" style="border: #c0e8cb solid 1px; color:#1f5548; background-color: #d2efc3"
                       @click="showDialog(scope.row.id)">修改密码
            </el-button>
            <el-button round size="mini" style="border: #90b477 solid 1px; color:#1f5548; background-color: #a2c38a"
                       @click="offline(scope.row.id)">强制下线
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--翻页-->
      <div class="block" style="width: 100%;display: flex;margin: 20px;justify-content: center">
        <el-pagination :current-page="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 30]"
                       :total="total" background layout="total, sizes, prev, pager, next, jumper"
                       @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
    <!--新增账户按钮-->
    <el-form style="margin:50px; width: 200px;height: 45px; display: flex;justify-content: right">
      <el-button style="background-color: #f1bb43;color: white" @click="dialogVisible2 = true">新增账号</el-button>
    </el-form>

    <!--密码修改弹窗-->
    <el-dialog :visible.sync="dialogVisible" width="30%" title="修改密码" center>
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
        <el-form-item label="请输入新的密码:" prop="newPassword">
          <el-input v-model="ruleForm.newPassword" placeholder="请输入密码" show-password size="mini"
                    style="width:60%"></el-input>
        </el-form-item>
        <el-form-item label="请再次输入新密码:" prop="newPassword2">
          <el-input v-model="ruleForm.newPassword2" placeholder="请再次输入密码" show-password size="mini"
                    style="width:60%"></el-input>
        </el-form-item>
        <div style="width: 100%;display: flex;justify-content: center">
          <el-button  @click="updatePassword()" style="background-color: #efbf53; width: 100px;height: 40px; color: white">确定</el-button>
        </div>
      </el-form>
    </el-dialog>


    <!--新建账号弹窗-->
    <el-dialog :visible.sync="dialogVisible2" width="30%" title="新建账号" center>
      <el-form ref="newAccount" :model="newAccount" :rules="newAccountRules" >
        <el-form-item label="医生/管理员姓名:" prop="name">
          <el-input v-model="newAccount.name" placeholder="请输入用户名" size="mini" style="width:60%"></el-input>
        </el-form-item>
        <el-form-item label="用户名:" prop="username">
          <el-input v-model="newAccount.username" placeholder="请输入用户名" size="mini" style="width:60%"></el-input>
        </el-form-item>
        <el-form-item label="新密码:" prop="password">
          <el-input v-model="newAccount.password" placeholder="请输入密码" show-password size="mini"
                    style="width:60%"></el-input>
        </el-form-item>
        <el-form-item label="再次输入新密码:" prop="password2">
          <el-input v-model="newAccount.password2" placeholder="请再次输入密码" show-password size="mini"
                    style="width:60%"></el-input>
        </el-form-item>
        <el-form-item label="角色：">
          <el-radio v-model="newAccount.role" label="admin">管理员</el-radio>
          <el-radio v-model="newAccount.role" label="doctor">医生</el-radio>
        </el-form-item>
        <el-form-item label="头像URL：">
          <el-input v-model="newAccount.avatar" placeholder="不输入则使用默认头像" size="medium" style="width:100%"></el-input>
        </el-form-item>

      </el-form>

      <div style="width: 100%;display: flex;justify-content: center">
        <el-button  @click="createAccount()" style="background-color: #efbf53; width: 100px;height: 40px; color: white">确定</el-button>
      </div>


    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "UserCenter",
  data() {
    return {
      chooseId: null,
      dialogVisible: false,
      dialogVisible2: false,
      currentPage: 1,
      pageSize: 10,
      total: null,
      tableData: [],
      ruleForm: {
        newPassword: "",
        newPassword2: "",
      },

      newAccount: {
        username: "",
        name: "",
        password: "",
        password2: "",
        role: "doctor",
        scope: [],
        avatar: null,
      },


      newAccountRules: {
        username: [
          {required: true, message: '用户名不能为空', trigger: 'blur'},
        ],
        name: [
          {required: true, message: '姓名不能为空', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '密码不能为空', trigger: 'blur'},
        ],
        password2: [
          {required: true, message: '密码不能为空', trigger: 'blur'},
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
      this.$axios.get("/doctor/authority/list", {
        params: {
          currentPage: that.currentPage,
          pageSize: that.pageSize
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
    changeEnable(id, enable) {
      let that = this
      this.$axios.get("/doctor/authority/forbid", {
        params: {
          id: id,
          enable: enable
        },

      }).then(res => {
        console.log(res)
        if (res.data.message == "success") {
          that.$message({
            showClose: true,
            message: res.data.data,
            type: 'success'
          });
        }

      })

    },
    //强制下线
    offline(id) {
      let that = this
      this.$axios.get("/doctor/authority/offline", {
        params: {
          id: id,
        },

      }).then(res => {

        if (res.data.message == "success") {
          that.$message({
            showClose: true,
            message: res.data.data,
            type: 'success'
          });
        }


      })
    },
    //弹出对话框 并获取当前操作的账号id
    showDialog(id) {
      this.dialogVisible = true
      this.chooseId = id
    },
    //修改密码
    updatePassword() {
      let that = this
      if (this.ruleForm.newPassword == "" || this.ruleForm.newPassword2 == "") {
        that.$message({
          showClose: true,
          message: "请输入密码后再提交",
          type: 'error'
        });
      } else {
        if (this.ruleForm.newPassword != this.ruleForm.newPassword2) {
          that.$message({
            showClose: true,
            message: "两次密码输入不一致请重新输入",
            type: 'error'
          });
        } else {
          this.$axios.post("/doctor/authority/update", {
            id: that.chooseId,
            password: that.ruleForm.newPassword,
            repeatPassword: that.ruleForm.newPassword2
          }).then(res => {
            if (res.data.message == "success") {
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
      if (this.newAccount.username == "" || this.newAccount.name == "" || this.newAccount.password == "" || this.newAccount.password2 == "") {
        that.$message({
          showClose: true,
          message: "请输入必填字段后再提交",
          type: 'error'
        });
      } else {
        if (this.newAccount.password != this.newAccount.password2) {
          that.$message({
            showClose: true,
            message: "两次密码输入不一致请重新输入",
            type: 'error'
          });
        } else {
          this.$axios.post("/doctor/authority/add", {
            username: that.newAccount.username,
            name: that.newAccount.name,
            password: that.newAccount.password,
            repeatPassword: that.newAccount.password2,
            role: that.newAccount.role,
            avatar: that.newAccount.avatar,

          }).then(res => {
            if (res.data.message == "success") {
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