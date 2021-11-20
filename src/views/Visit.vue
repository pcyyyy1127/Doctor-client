<template>
    <div>

        <el-form :inline="true" class="demo-form-inline" label-width="200px" >


            <el-form-item >
                <span>筛选条件</span>
            </el-form-item>


            <el-form-item >
                <el-input  placeholder="姓名/档案号"></el-input>
            </el-form-item>


            <el-form-item>
                <el-button  @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>


        <el-table
                :data="tableData"
                style="width: 100%;margin-top: -3%"
                row-key="id"
                border
                stripe
                default-expand-all
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column
                    prop="archivesNo"
                    label="建档号"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="姓名"
                    width="120"
            >
            </el-table-column>

            <el-table-column
                    prop="age"
                    width="70"
                    label="年龄">
            </el-table-column>
            <el-table-column
                    prop="sex"
                    width="70"
                    label="性别">
            </el-table-column>
            <el-table-column
                    prop="phone"
                    width="100"
                    label="联系电话">
            </el-table-column>

            <el-table-column
                    prop="finish"
                    width="200"
                    label="已完成就诊信息采集次数">
            </el-table-column>

            <el-table-column
                    prop="lastVisitDate"
                    width="200"
                    label="上次就诊时间">
            </el-table-column>


            <el-table-column
                    prop="option"
                    label="操作"
                    width="300">
                <el-button size="mini" round>就诊信息采集</el-button>
                <el-button size="mini" round>结束就诊流程</el-button>

            </el-table-column>

        </el-table>
    </div>
</template>

<script>
    export default {
        name: "Visit",
        data() {
            return {
                tableData: [{
                    archivesNo: '0000001',
                    name: '王小虎',
                    age: '20',
                    sex: '男',
                    phone: "1554541231",
                    finish :"1次",
                    lastVisitDate:"2021-01-01"

                }, {
                    archivesNo: '0000002',
                    name: '张小虎',
                    age: '21',
                    sex: '女',
                    phone: "1554541231",
                    finish :"2次",
                    lastVisitDate:"2021-02-01"

                }, {
                    archivesNo: '0000003',
                    name: '李小虎',
                    age: '40',
                    sex: '男',
                    phone: "1554541231",
                    finish :"3次",
                    lastVisitDate:"2021-03-01"

                }]
            }
        }
    }
</script>

<style scoped>

</style>