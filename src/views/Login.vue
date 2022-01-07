<template>
    <el-row type="flex" class="row-bg" justify="center">
        <el-col :xl="6" :lg="7">

            <h1 style="color:black">欢迎来到慢性肺病的中医慢病管理平台</h1>

        </el-col>
        <el-col :span="1">
            <el-divider direction="vertical"></el-divider>        </el-col>
        <el-col :xl="6" :lg="7">
            <el-form label-position="right" :rules="rules" label-width="80px" :model="loginForm" ref="loginForm">
                <el-form-item label="用户名" prop="username" style="width: 380px;">
                    <el-input v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" style="width: 380px;">
                    <el-input type="password" v-model="loginForm.password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
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
                    grant_type:'password',
                    client_id:'client1',
                    client_secret:"123123"


                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
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
                        this.$axios.post("/auth/oauth/accessToken",{

                                client_id:that.loginForm.client_id,
                                client_secret:that.loginForm.client_secret,
                                grant_type:that.loginForm.grant_type,
                                username:that.loginForm.username,
                                password:that.loginForm.password


                        }).then(res =>{
                            console.log(res)
                            if (res.data.data.message == "success") {
                                const  jwt = res.data.data.data
                                this.$store.commit('SET_TOKEN',jwt)

                                this.$router.push("/archives")
                            }
                            else {
                                Element.Message.error( res.data.data.data , {duration: 3 * 1000})
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

    .el-row{
        color: #fafafa;
        height: 100vh;
        display: flex;
        align-items: center;
        text-align: center;
    }

    .el-divider{
        height: 200px;
    }

    .captchaImg {
        float: left;
        margin-left: 8px;
        border-radius: 4px;
    }

</style>