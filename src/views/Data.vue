<template>
    <div>

        <el-button @click="showDialog()">导出就诊数据</el-button>
        <el-button @click="showDialogFollow()">导出随访数据</el-button>


        <el-dialog :visible.sync="dialogVisible" width="40%">
            <h2 style="margin-top: -10%">请选择导出范围</h2>
            <el-form>

                <el-form-item label="导出范围：" >
                    <el-radio v-model="type" label="全部" @change="inputVisible = false">全部</el-radio>
                    <el-radio v-model="type" label="按档案号" @change="inputVisible = true">按档案号</el-radio>
                    <el-input v-model="archivesId"  v-if="inputVisible" size="mini" placeholder="请输入档案号" style="width: 140px" ></el-input>
                </el-form-item>
            </el-form>

            <el-button @click="exportVisit()">导出</el-button>


        </el-dialog>

        <el-dialog :visible.sync="dialogVisible2" width="40%">
            <h2 style="margin-top: -10%">请选择导出范围</h2>
            <el-form>

                <el-form-item label="导出范围：" >
                    <el-radio v-model="type" label="全部" @change="inputVisible = false">全部</el-radio>
                    <el-radio v-model="type" label="按档案号" @change="inputVisible = true">按档案号</el-radio>
                    <el-input v-model="archivesId"  v-if="inputVisible" size="mini" placeholder="请输入档案号" style="width: 140px" ></el-input>
                </el-form-item>
            </el-form>

            <el-button @click="exportFollow()">导出</el-button>


        </el-dialog>

    </div>

</template>

<script>
    export default {
        name: "Data",
        data() {
            return {
                inputVisible : false,
               dialogVisible: false,
               dialogVisible2: false,
                type:"全量",
                archivesId:null
            }
        },



        methods:{

            showDialog(){
                this.dialogVisible = true;
            },
            showDialogFollow(){
                this.dialogVisible2 = true;
            },

            exportVisit(){
               let that = this
                if((this.type == '按档案号' || this.type == '' ) && this.archivesId == null) {
                    that.$message({
                        showClose: true,
                        message: "按档案号导出时档案号不能为空！",
                        type: 'error'
                    });
                } else {
                    this.$axios.get("/doctor/visit/export",{
                        params:{
                            type:that.type,
                            archivesId:that.archivesId
                        },
                        responseType: "blob"}).then((res) => {

                        let link = document.createElement("a");
                        //    后端返回的是文件流 用Blob来接收二进制文件流 并制定类型和编码
                        let blob = new Blob([res.data],{type:"application/vnd.ms-excel;charset=utf-8"})
                        let objectUrl = window.URL.createObjectURL(blob);
                        link.href = objectUrl;
                        let date = new Date();
                        let name = "就诊历史数据-" + date.getFullYear()+ "年" + date.getMonth()+ 1 + "月" + date.getDate() + "日"
                            +date.getHours()+ "时" + date.getMinutes() + "分" + date.getSeconds() + "秒" + ".xls";
                        link.download = name;
                        link.click();
                        window.URL.revokeObjectURL(objectUrl);
                    });
                }




            },
            exportFollow(){
                let that = this
                if((this.type == '按档案号' || this.type == '' ) && this.archivesId == null) {
                    that.$message({
                        showClose: true,
                        message: "按档案号导出时档案号不能为空！",
                        type: 'error'
                    });
                }
                else {
                    this.$axios.get("/doctor/follow/export",{
                        params:{
                            type:that.type,
                            archivesId:that.archivesId
                        },
                        responseType: "blob"
                    }
                    ).then((res) => {

                        let link = document.createElement("a");
                        //    后端返回的是文件流 用Blob来接收二进制文件流 并制定类型和编码
                        let blob = new Blob([res.data],{type:"application/vnd.ms-excel;charset=utf-8"})
                        let objectUrl = window.URL.createObjectURL(blob);
                        link.href = objectUrl;
                        let date = new Date();
                        let name = "随访历史数据-" + date.getFullYear()+ "年" + date.getMonth()+ 1 + "月" + date.getDate() + "日"
                            +date.getHours()+ "时" + date.getMinutes() + "分" + date.getSeconds() + "秒" + ".xls";
                        link.download = name;
                        link.click();
                        window.URL.revokeObjectURL(objectUrl);
                    });
                }


            },
        }
    }

</script>

<style scoped>

</style>