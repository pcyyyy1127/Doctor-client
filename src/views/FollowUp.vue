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
                <el-select v-model="value" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>

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
                    label="已完成随访次数">
            </el-table-column>

            <el-table-column
                    prop="nextFollowDate"
                    width="200"
                    label="下次随访时间">
            </el-table-column>

            <el-table-column
                    prop="followStatus"
                    width="200"
                    label="当前状态">
            </el-table-column>


            <el-table-column
                    prop="option"
                    label="操作"
                    width="100">
                <el-button size="mini" round>随访</el-button>
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
    </div>
</template>

<script>
    export default {
        name: "FollowUp",

        data() {
            return {
                value:'',
                currentPage: 1,
                pageSize:10,
                total:null,
                type:null,  //档案号 /姓名 查询条件
                searchStatus:"待随访",//默认待随访

                options: [{
                    value: '选项1',
                    label: '全部'
                }, {
                    value: '选项2',
                    label: '已超时'
                }, {
                    value: '选项3',
                    label: '待随访'
                }, {
                    value: '选项4',
                    label: '已完成三次随访'
                }],
                tableData: [],
            }
        },
        methods:{
            handleSizeChange(val) {
                this.pageSize = val
                this.onSubmit()
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.onSubmit()
            },
            onSubmit(){
                let that=this


                this.$axios.get("/doctor/follow/getFollowUpList",{
                    params:{
                        type:that.type || "",
                        searchStatus:that.searchStatus || "",
                        currentPage:that.currentPage,
                        pageSize:that.pageSize
                    },

                }).then(res =>{

                    console.log(res)
                    that.tableData = res.data.data.list
                    that.total = res.data.data.total
                    that.pageSize = res.data.data.pageSize

                    console.log(that.tableData)
                })
            },

            //页面渲染时，请求
            created() {
                this.onSubmit()
            }

        }
    }
</script>

<style scoped>

</style>