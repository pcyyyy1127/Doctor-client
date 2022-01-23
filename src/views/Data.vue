<template>
    <div>
        数据可视化 echart实现
        <el-button @click="exportVisit()">导出就诊数据</el-button>
        <el-button @click="exportFollow()">导出随访数据</el-button>
    </div>

</template>

<script>
    export default {
        name: "Data",
        data() {
            return {

            }
        },
        methods:{
            exportVisit(){



                this.$axios.get("/doctor/visit/export",{responseType: "blob"}).then((res) => {

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


            },
            exportFollow(){

                this.$axios.get("/doctor/follow/export",{responseType: "blob"}).then((res) => {

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

            },
        }
    }

</script>

<style scoped>

</style>