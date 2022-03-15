<template>
  <el-row class="row-bg" justify="center" type="flex">
    <!--背景图片-->
    <div id="background">
      <el-image :src="require('@/assets/images/login2.png')" style="height: 100vh; width:100%; "></el-image>
    </div>

    <!--登录表单-->
    <el-col ::xl="12" :lg="20" >
      <el-form ref="loginForm" :model="loginForm" :rules="rules" label-width="80px" style="margin-top: 90px">

        <div style="display: flex; flex-direction: row;margin: 0px">
          <div style="color: white">* 用户名:</div>
          <el-form-item  prop="username" style="width: 350px;">
            <el-input v-model="loginForm.username" ></el-input>
          </el-form-item>
        </div>
        <div style="display: flex; flex-direction: row;margin: 0px">
          <div style="color: white">* 密码:</div>
          <el-form-item  prop="password" style="width: 350px;margin: 0 0 20px 20px">
            <el-input v-model="loginForm.password" type="password"></el-input>
          </el-form-item>
        </div>

        <el-form-item style="width: 450px;">
          <el-button type="success" @click="submitForm('loginForm')" style="background-color: #ecbd55;color: white;height: 60px;font-size: 18pt">登录</el-button>
        </el-form-item>
      </el-form>
    </el-col>


  </el-row>

</template>

<script>
import Element from "element-ui";

export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        grant_type: 'password',
        client_id: 'client1',
        client_secret: "123123"


      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],

      },
      captchaImg: null
    };
  },
  methods: {
    //登录
    submitForm(formName) {
      let that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post("/auth/oauth/accessToken", {

            client_id: that.loginForm.client_id,
            client_secret: that.loginForm.client_secret,
            grant_type: that.loginForm.grant_type,
            username: that.loginForm.username,
            password: that.loginForm.password


          }).then(res => {
            console.log(res)
            if (res.data.data.message == "success") {
              const jwt = res.data.data.data.token
              this.$store.commit('SET_TOKEN', jwt)
              this.$store.commit('setUserInfo', res.data.data.data.userInfo)
              this.$router.push("/index")
            } else {
              Element.Message.error(res.data.data.data, {duration: 3 * 1000})
            }

          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

  },

}
</script>

<style scoped>

#background {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  /**宽高100%是为了图片铺满屏幕 */
  z-index: -1;
  position: absolute;

}


.el-row {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.el-form{

}

.el-button {
  width: 180px;
  height: 40px;
  margin: 10px;
  border-radius: 10px;
  border: #2c3e50;
  align-items: center;
  text-align: center;
  background-color: #164d43;
  color: #fff;
}



.left .el-tooltip__popper,
.right .el-tooltip__popper {
  padding: 8px 10px;
}

</style>