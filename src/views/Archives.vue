
<template>



    <div>

      <el-form :inline="true" class="demo-form-inline" label-width="200px" >


          <el-form-item >
              <span>筛选条件</span>
          </el-form-item>


          <el-form-item >
              <el-input  placeholder="姓名/档案号"></el-input>
          </el-form-item>

          <el-form-item style="margin-left: 10px" >
              <span>建档日期</span>
          </el-form-item>

          <el-form-item >

              <el-col :span="8">
                  <el-date-picker
                          v-model="rangeDate"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
                  </el-date-picker>
              </el-col>
          </el-form-item>

          <el-form-item>
              <el-button  @click="onSubmit">查询</el-button>
          </el-form-item>
      </el-form>


        <el-form style="margin-top: -13%">
            <el-button   @click="dialogVisible = true">新建档案</el-button>

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
                    prop="date"
                    label="建档日期"
                    width="120"
                   >
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
                    prop="address"
                    width="300"
                    label="地址">
            </el-table-column>


            <el-table-column
                    prop="option"
                    label="操作"
             width="300">
                <el-button size="mini" round>历史随访</el-button>
                <el-button size="mini" round>历史就诊</el-button>
                <el-button size="mini" round>自我管理</el-button>
            </el-table-column>

        </el-table>


        <!--新增对话框-->
        <el-dialog
                :visible.sync="dialogVisible"
                width="70%"
                >

            <el-form :model="ruleForm"  ref="ruleForm" label-width="100px" >
                <div style="display: flex;justify-content: center">
                    <h2 >基本信息建档</h2>
                </div>
                <el-descriptions  title="诊断标准" direction="vertical" :column="1"  border style="margin-top:-10%">
                    <el-descriptions-item label="1. IPF诊断遵循如下标准 诊断标准：">①排除其他已知原因的ILD(例如家庭或职业环境暴露、结缔组织病和药物毒性)。
                        <br>②HRCT表现为UIP型(此类患者不建议行外科肺活检)。
                        <br>③已进行外科肺活检的患者，根据HRCT和外科肺活检特定的组合进行诊断。
                        <el-form-item label="" >
                            <el-radio-group v-model="ruleForm.checkOne">
                                <el-radio label="是"></el-radio>
                                <el-radio label="否"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="2. IPF急性加重(acute exacerbation of IPF) IPF病人出现新的弥漫性肺泡损伤导致急性或显著的呼吸困难恶化即为AE-IPF。诊断标准:">①过去或现在诊断IPF；<br>②1个月内发生显著的呼吸困难加重；<br>③CT表现为UIP背景下出现新的双侧磨玻璃影伴或不伴实变影；<br>④不能完全由心衰或液体过载解释。
                        <el-form-item label="" >
                            <el-radio-group v-model="ruleForm.checkTwo">
                                <el-radio label="是"></el-radio>
                                <el-radio label="否"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>
                </el-descriptions>
                <el-descriptions >
                    <el-descriptions-item label="注">如果以上任何一项答案为“是”，可以诊断为特发性肺纤维化。</el-descriptions-item>
                </el-descriptions>




                <el-descriptions style="margin-top:-5%" title="纳入标准（任何一项选“否” 即不能纳入本研究）" direction="vertical" :column="1" border >
                    <el-descriptions-item label="1.符合西医特发性肺纤维化诊断"  >
                        <el-form-item label="" >
                            <el-radio-group v-model="ruleForm.addOne">
                                <el-radio label="是"></el-radio>
                                <el-radio label="否"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="2.年龄在18岁以上">
                        <el-form-item label="" >
                            <el-radio-group v-model="ruleForm.addTwo">
                                <el-radio label="是"></el-radio>
                                <el-radio label="否"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="3.签署知情同意书">
                        <el-form-item label="" >
                            <el-radio-group v-model="ruleForm.addThree">
                                <el-radio label="是"></el-radio>
                                <el-radio label="否"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="参加三次诊疗及随访">
                        <el-form-item label="" >
                            <el-radio-group v-model="ruleForm.addFour">
                                <el-radio label="是"></el-radio>
                                <el-radio label="否"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>

                </el-descriptions>
                <el-descriptions >
                    <el-descriptions-item label="注">如果以上任何一项答案为“否”，此患者不能纳入本研究。</el-descriptions-item>
                </el-descriptions>





                <el-descriptions style="margin-top:-5%" title="排除标准（任何一项选“是” 即不能纳入本研究）" direction="vertical" :column="1" border >
                    <el-descriptions-item label="1.正在参加其他临床研究者"  >
                        <el-form-item label="" >
                            <el-radio-group v-model="ruleForm.excludeOne">
                                <el-radio label="是"></el-radio>
                                <el-radio label="否"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="2.精神类疾病患者">
                        <el-form-item label="" >
                            <el-radio-group v-model="ruleForm.excludeTwo">
                                <el-radio label="是"></el-radio>
                                <el-radio label="否"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="3.合并心脑血管疾患、肿瘤等严重危及生命的疾病">
                        <el-form-item label="" >
                            <el-radio-group v-model="ruleForm.excludeThree">
                                <el-radio label="是"></el-radio>
                                <el-radio label="否"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>

                </el-descriptions>
                <el-descriptions >
                    <el-descriptions-item label="注">如果以上任何一项答案为“是”，此患者不能纳入本研究。</el-descriptions-item>
                </el-descriptions>

               <div style="display: flex;justify-content: center">
                   <h2 >一般资料及主要病史</h2>
               </div>


                <el-descriptions style="margin-top:-5%" title="人口学资料" direction="vertical" :column="1" border >
                    <el-descriptions-item label="性别"  >
                        <el-form-item label="" >
                            <el-radio-group v-model="ruleForm.sex">
                                <el-radio label="男"></el-radio>
                                <el-radio label="女"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="出生日期">

                            <el-col :span="11">
                                <el-form-item >
                                    <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.birth" style="width: 100%;"></el-date-picker>
                                </el-form-item>
                            </el-col>

                    </el-descriptions-item>

                    <el-descriptions-item label="民族">
                        <el-form-item label="" >
                            <el-radio-group v-model="ruleForm.nation">
                                <el-radio label="汉族"></el-radio>
                                <el-radio label="壮族"></el-radio>
                                <el-radio label="满族"></el-radio>
                                <el-radio label="回族"></el-radio>
                                <el-radio  label="其他"></el-radio>
                                <el-input v-model="ruleForm.nation"  size="mini" placeholder="请输入民族" style="width: 140px" ></el-input>

                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="婚否"  >
                        <el-form-item label="" >
                            <el-radio-group v-model="ruleForm.marriage">
                                <el-radio label="是"></el-radio>
                                <el-radio label="否"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>


                    <el-descriptions-item label="教育程度">
                        <el-form-item label="" >
                            <el-radio-group v-model="ruleForm.edu">
                                <el-radio label="硕士以上" ></el-radio>
                                <el-radio label="本科" ></el-radio>
                                <el-radio label="大学专科"></el-radio>
                                <el-radio label="高中/中专/技校" ></el-radio>
                                <el-radio  label="初中"  ></el-radio>
                                <el-radio  label="小学"  ></el-radio>
                                <el-radio  label="其他"  ></el-radio>
                                <el-input v-model="ruleForm.edu"  size="mini" placeholder="请输入教育程度" style="width: 140px" ></el-input>

                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>


                    <el-descriptions-item label="职业">
                        <el-form-item label="" >
                            <el-radio-group v-model="ruleForm.profession">
                                <el-radio label="工人" ></el-radio>
                                <el-radio label="农民" ></el-radio>
                                <el-radio label="教师"></el-radio>
                                <el-radio label="军人/警察" ></el-radio>
                                <el-radio  label="学生" ></el-radio>
                                <el-radio  label="公务员" ></el-radio>
                                <el-radio  label="医务工作者" ></el-radio>
                                <el-radio  label="律师" ></el-radio>
                                <el-radio  label="职员" ></el-radio>
                                <el-radio  label="离退休"  ></el-radio>
                                <el-radio  label="自由职业者"  ></el-radio>
                                <el-radio  label="其他"  style="margin-top: 2%"></el-radio>
                                <el-input v-model="ruleForm.profession"  size="mini" placeholder="请输入职业" style="width: 140px" ></el-input>

                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="身高体重">
                        <el-form-item label="" >


                               <div>身高(cm)</div> <el-input v-model="ruleForm.height" size="mini" placeholder="请输入身高" style="width: 140px" ></el-input>
                               <div>体重(kg)</div> <el-input v-model="ruleForm.weight" size="mini" placeholder="请输入体重" style="width: 140px" ></el-input>


                        </el-form-item>
                    </el-descriptions-item>

                </el-descriptions>




               <el-descriptions style="margin-top:-5%" title="基本病史" direction="vertical" :column="1" border>

                   <el-descriptions-item label="起病时间">

                       <el-col :span="11">
                           <el-form-item >
                               <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.startDate" style="width: 100%;"></el-date-picker>
                           </el-form-item>
                       </el-col>

                   </el-descriptions-item>

                   <el-descriptions-item label="确诊时间">

                       <el-col :span="11">
                           <el-form-item >
                               <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.sureDate" style="width: 100%;"></el-date-picker>
                           </el-form-item>
                       </el-col>

                   </el-descriptions-item>

                   <el-descriptions-item label="既往史">
                   <el-form-item  >


                       <el-checkbox-group v-model="ruleForm.pastHistory">
                           <el-checkbox label="无" ></el-checkbox>
                           <el-checkbox label="反流性食管炎" ></el-checkbox>
                           <el-checkbox label="脑卒中"></el-checkbox>
                           <el-checkbox label="冠心病"></el-checkbox>
                           <el-checkbox  label="糖尿病"  ></el-checkbox>
                           <el-checkbox  label="高血压"  ></el-checkbox>
                           <el-checkbox  label="慢性阻塞性肺病" ></el-checkbox>
                           <el-checkbox  label="睡眠呼吸暂停综合征"  ></el-checkbox>
                           <el-checkbox  label="脏器移植史" ></el-checkbox><br>
                           <el-form-item>
                               <div>特殊药物应用史：(
                                   <el-checkbox  label="胺碘酮"  ></el-checkbox>
                                   <el-checkbox  label="甲氨蝶呤"  ></el-checkbox>
                                   <el-checkbox  label="其他特殊药物应用史"  ></el-checkbox>
                                   )
                               </div>

                           </el-form-item>
                           <el-form-item>
                               <div>
                                   其他既往史: <el-input v-model="ruleForm.otherPastHistory"  size="mini" placeholder="请输入其他既往史" style="width: 80%" ></el-input>

                               </div>


                           </el-form-item>

                       </el-checkbox-group>
                   </el-form-item>
                   </el-descriptions-item>


                   <el-descriptions-item label="个人史">
                       <el-form-item  >
                               <el-form-item>
                                   <div><h4>吸烟史(若无则不填)</h4>
                                       时间（年）：<el-input v-model="ruleForm.smokeHistoryYear"  size="mini" placeholder="请输入吸烟史时长（年）" style="width: 20%" ></el-input>(若无则不填)<br>
                                       支/天：<el-input v-model="ruleForm.smokeNum"  size="mini" placeholder="请输入每天吸烟支数" style="width: 17%" ></el-input>(若无则不填)<br>
                                       已戒烟:<el-input v-model="ruleForm.noSmokeDays"  size="mini" placeholder="请输入戒除天数" style="width: 17%" ></el-input>天(若未戒则不填)

                                   </div>

                                   <div><h4>饮酒史(若无则不填)</h4>
                                       时间(年)：<el-input v-model="ruleForm.drinkHistoryYear"  size="mini" placeholder="请输入饮酒史时长（年）" style="width: 20%" ></el-input>(若无则不填)<br>
                                       白酒    :<el-input v-model="ruleForm.whiteDrink"  size="mini" placeholder="请输入每天白酒饮用量" style="width: 17%" ></el-input>两/天(若无则不填)<br>
                                       啤酒    :<el-input v-model="ruleForm.bearDrink"  size="mini" placeholder="请输入每天啤酒饮用量" style="width: 17%" ></el-input>瓶/天(若无则不填)<br>

                                       已戒酒:<el-input v-model="ruleForm.noDrinkDays"  size="mini" placeholder="请输入戒除天数" style="width: 17%" ></el-input>天（若未戒则不填）
                                   </div>

                                   <div><h4>职业环境与暴露史(若无则不填)</h4>
                                       时间（年）：<el-input v-model="ruleForm.exposureHistoryYear"  size="mini" placeholder="请输入职业环境与暴露史时长（年）" style="width: 40%" ></el-input>(若无则不填)<br>
                                       职业环境与暴露史类型:<el-input v-model="ruleForm.exposureHistory"  size="mini" placeholder="请输入职业环境暴露史类型（如：粉尘）" style="width: 40%" ></el-input>(若无则不填)<br>
                                   </div>

                                   <div><h4>宠物嗜好与接触史(若无则不填)</h4>
                                       <el-input v-model="ruleForm.pets"  size="mini" placeholder="请输入宠物嗜好与接触史" style="width: 40%" ></el-input>(若无则不填)<br>
                                   </div>
                               </el-form-item>

                       </el-form-item>
                   </el-descriptions-item>


                   <el-descriptions-item label="家族史">
                       <el-form-item  >


                           <el-radio-group v-model="ruleForm.familyHistory">
                               <el-radio label="无" ></el-radio>
                               <el-radio label="特发性肺纤维化" ></el-radio>

                               <el-form-item>
                                   <div>
                                       其他家族史(若无则不填): <el-input v-model="ruleForm.otherFamilyHistory"  size="mini" placeholder="请输入其他家族史" style="width: 60%" ></el-input>
                                   </div>
                               </el-form-item>

                           </el-radio-group>


                       </el-form-item>
                   </el-descriptions-item>


                   <el-descriptions-item label="药物过敏史">
                       <el-form-item  >


                           <el-radio-group v-model="ruleForm.drugAllergyHistory">
                               <el-radio label="无" ></el-radio>
                               <el-radio label="有" ></el-radio>

                               <el-form-item>
                                   <div>
                                       如有药物过敏史,详细记载: <el-input v-model="ruleForm.drugAllergyHistoryDetail"  size="mini" placeholder="请输入药物过敏史" style="width: 60%" ></el-input>
                                   </div>
                               </el-form-item>

                           </el-radio-group>


                       </el-form-item>
                   </el-descriptions-item>

                   <el-descriptions-item label="系统字段">
                       <el-form-item  >

                                   <div>
                                       姓名: <el-input v-model="ruleForm.name"  size="mini" placeholder="请输入姓名" style="width: 60%" ></el-input><br>
                                       电话: <el-input v-model="ruleForm.phone"  size="mini" placeholder="请输入电话" style="width: 60%" ></el-input><br>
                                       住址: <el-input v-model="ruleForm.address"  size="mini" placeholder="请输入住址" style="width: 60%" ></el-input>
                                   </div>





                       </el-form-item>
                   </el-descriptions-item>



               </el-descriptions>





                <el-form-item style="margin-top: 5%">
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>

        </el-dialog>

    </div>
</template>

<script>

    export default {
        name: "Archives",

        data() {
            return {
                type:null,  //档案号 /姓名 查询条件
                rangeDate:null,
                dialogVisible: false,
                currentPage: 1,
                pageSize:10,
                ruleForm:{
                    checkOne:null,
                    checkTwo:null,
                    addOne:null,
                    addTwo:null,
                    addThree:null,
                    addFour:null,
                    excludeOne:null,
                    excludeTwo:null,
                    excludeThree:null,
                    sex:null,
                    birth:null,
                    nation:null,
                    marriage:null,
                    edu:null,
                    profession:null,
                    height:null,
                    weight:null,
                    startDate:null,
                    sureDate:null,
                    pastHistory:[],
                    otherPastHistory:null,
                    smokeHistoryYear:null,
                    smokeNum:null,
                    noSmokeDays:null,
                    drinkHistoryYear:null,
                    whiteDrink:null,
                    bearDrink:null,
                    noDrinkDays:null,
                    exposureHistoryYear:null,
                    exposureHistory:null,
                    pets:null,
                    familyHistory:null,
                    otherFamilyHistory:null,
                    drugAllergyHistory:null,
                    drugAllergyHistoryDetail:null,
                    name:null,
                    phone:null,
                    address:null



                },
                tableData: []
            }
        },
        methods:{


            onSubmit(){
               let startDate
               let endDate
                let that=this
                if (this.rangeDate !=null){
                    startDate = this.rangeDate[0]
                    endDate = this.rangeDate[1]
                   startDate = startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate()
                    endDate = endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate()

                }

                this.$axios.get("/doctor/archives/getArchivesList",{
                    params:{
                        type:that.type || "",
                        startDate:startDate || "",
                        endDate:endDate || "",
                        currentPage:that.currentPage,
                        pageSize:that.pageSize
                    }
                }).then(res =>{

                    console.log(res)
                    that.tableData = res.data.data.list
                    console.log(that.tableData)
                })
            },
            //页面渲染时，请求
            created() {
                let startDate
                let endDate
                let that=this

                if (this.rangeDate !=null){
                    startDate = this.rangeDate[0]
                    endDate = this.rangeDate[1]
                    startDate = startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate()
                    endDate = endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate()

                }

                this.$axios.get("/doctor/archives/getArchivesList",{
                    params:{
                        type:that.type || "",
                        startDate:startDate || "",
                        endDate:endDate || "",
                        currentPage:that.currentPage,
                        pageSize:that.pageSize

                    }
                }).then(res =>{

                    console.log(res)
                    that.tableData = res.data.data.list
                    console.log(that.tableData)
                })

            }


        }

    }
</script>

<style scoped>

</style>