
<template>



    <div>

      <el-form :inline="true" class="demo-form-inline" label-width="200px" >


          <el-form-item >
              <span>筛选条件</span>
          </el-form-item>


          <el-form-item >
              <el-input  placeholder="姓名/档案号" v-model="type" clearable></el-input>
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
                <el-button size="mini" round @click="drawer = true">选中</el-button>
            </el-table-column>

        </el-table>

        <el-drawer
                title="我是标题"
                :visible.sync="drawer"
                :with-header="false"
        >
            <span style="justify-content: center;display: flex"><h3>就诊信息采集</h3></span>





                    <div style="justify-content: center;display: flex;flex-direction: row;line-height: 0px;margin-top: 0px">


                        <div>
                            面相
                            <el-button size="medium" round  >采集</el-button>
                        </div>
                    </div>

            <div style="justify-content: center;display: flex;flex-direction: row;line-height: 0px;margin-top: 5%">


                <div>
                    舌象
                    <el-button size="medium" round >采集</el-button>
                </div>
            </div>

            <div style="justify-content: center;display: flex;flex-direction: row;line-height: 0px;margin-top: 5%">


                <div>
                    其他
                    <el-button size="medium" round @click="dialogVisible2 = true" >采集</el-button>
                </div>
            </div>

            <div style="justify-content: center;display: flex;flex-direction: row;line-height: 0px;margin-top: 5%">


                <el-button size="mini" style="" round >结束就诊</el-button>
            </div>



            <div style="justify-content: center;display: flex;flex-direction: column;line-height: 0px;margin-top: 25%">

                <div style="display: flex;flex-direction: row;justify-content: center">
                    <el-button size="medium" round  >历史随访</el-button>
                    <el-button size="medium" round  >自我管理</el-button>
                </div>

                <div style="display: flex;flex-direction: row;justify-content: center;margin-top: 10%">
                    <el-button size="medium" round  >历史就诊</el-button>
                    <el-button size="medium" round  >档案修改</el-button>
                </div>



            </div>




        </el-drawer>

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


        <!--新建档案对话框-->
        <el-dialog
                :visible.sync="dialogVisible"
                width="70%"
                >

            <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  label-width="100px" >
                <div style="display: flex;justify-content: center">
                    <h2 >基本信息建档</h2>
                </div>
                <el-descriptions  title="诊断标准" direction="vertical" :column="1"  border style="margin-top:-10%">
                    <el-descriptions-item label="1. IPF诊断遵循如下标准 诊断标准：">①排除其他已知原因的ILD(例如家庭或职业环境暴露、结缔组织病和药物毒性)。
                        <br>②HRCT表现为UIP型(此类患者不建议行外科肺活检)。
                        <br>③已进行外科肺活检的患者，根据HRCT和外科肺活检特定的组合进行诊断。
                        <el-form-item label=""  prop="checkOne">
                            <el-radio-group v-model="ruleForm.checkOne">
                                <el-radio label="是"></el-radio>
                                <el-radio label="否"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="2. IPF急性加重(acute exacerbation of IPF) IPF病人出现新的弥漫性肺泡损伤导致急性或显著的呼吸困难恶化即为AE-IPF。诊断标准:">①过去或现在诊断IPF；<br>②1个月内发生显著的呼吸困难加重；<br>③CT表现为UIP背景下出现新的双侧磨玻璃影伴或不伴实变影；<br>④不能完全由心衰或液体过载解释。
                        <el-form-item label="" prop="checkTwo">
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
                        <el-form-item label="" prop="addOne" >
                            <el-radio-group v-model="ruleForm.addOne">
                                <el-radio label="是"></el-radio>
                                <el-radio label="否"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="2.年龄在18岁以上">
                        <el-form-item label="" prop="addTwo">
                            <el-radio-group v-model="ruleForm.addTwo">
                                <el-radio label="是"></el-radio>
                                <el-radio label="否"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="3.签署知情同意书">
                        <el-form-item label="" prop="addThree">
                            <el-radio-group v-model="ruleForm.addThree">
                                <el-radio label="是"></el-radio>
                                <el-radio label="否"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="参加三次诊疗及随访">
                        <el-form-item label="" prop="addFour">
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
                        <el-form-item label="" prop="excludeOne">
                            <el-radio-group v-model="ruleForm.excludeOne">
                                <el-radio label="是"></el-radio>
                                <el-radio label="否"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="2.精神类疾病患者">
                        <el-form-item label="" prop="excludeTwo">
                            <el-radio-group v-model="ruleForm.excludeTwo">
                                <el-radio label="是"></el-radio>
                                <el-radio label="否"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="3.合并心脑血管疾患、肿瘤等严重危及生命的疾病">
                        <el-form-item label="" prop="excludeThree">
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
                    <el-descriptions-item label="性别"   >
                        <el-form-item label="" prop="sex">
                            <el-radio-group v-model="ruleForm.sex">
                                <el-radio label="男"></el-radio>
                                <el-radio label="女"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="出生日期">

                            <el-col :span="11">
                                <el-form-item prop="birth">
                                    <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.birth" style="width: 100%;"></el-date-picker>
                                </el-form-item>
                            </el-col>

                    </el-descriptions-item>

                    <el-descriptions-item label="民族" >
                        <el-form-item label="" prop="nation">
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
                        <el-form-item label="" prop="marriage" >
                            <el-radio-group v-model="ruleForm.marriage">
                                <el-radio label="是"></el-radio>
                                <el-radio label="否"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>


                    <el-descriptions-item label="教育程度" >
                        <el-form-item label="" prop="edu">
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
                        <el-form-item label="" prop="profession">
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
                        <el-form-item label="" prop="height"   >

                               <div>身高(cm)</div> <el-input v-model="ruleForm.height" size="mini" placeholder="请输入身高" style="width: 140px"  ></el-input>

                        </el-form-item>
                        <el-form-item label="" prop="weight"   >
                            <div>体重(kg)</div> <el-input v-model="ruleForm.weight" size="mini" placeholder="请输入体重" style="width: 140px"  ></el-input>
                        </el-form-item>

                    </el-descriptions-item>

                </el-descriptions>




               <el-descriptions style="margin-top:-5%" title="基本病史" direction="vertical" :column="1" border>

                   <el-descriptions-item label="起病时间">

                       <el-col :span="11">
                           <el-form-item  prop="startDate">
                               <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.startDate" style="width: 100%;"></el-date-picker>
                           </el-form-item>
                       </el-col>

                   </el-descriptions-item>

                   <el-descriptions-item label="确诊时间">

                       <el-col :span="11">
                           <el-form-item prop="sureDate">
                               <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.sureDate" style="width: 100%;"></el-date-picker>
                           </el-form-item>
                       </el-col>

                   </el-descriptions-item>

                   <el-descriptions-item label="既往史">
                   <el-form-item prop="pastHistory"  >


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


                       </el-checkbox-group>
                   </el-form-item>

                       <el-form-item prop="otherPastHistory">
                           <div>
                               其他既往史: <el-input v-model="ruleForm.otherPastHistory"  size="mini" placeholder="请输入其他既往史" style="width: 80%" ></el-input>

                           </div>


                       </el-form-item>
                   </el-descriptions-item>


                   <el-descriptions-item label="个人史">




                                   <div><h4>吸烟史(若无则不填)</h4>
                                       <el-form-item prop="smokeHistoryYear">时间（年）：<el-input v-model="ruleForm.smokeHistoryYear"  size="mini" placeholder="请输入吸烟史时长（年）" style="width: 20%" ></el-input>(若无则不填)<br></el-form-item>
                                       <el-form-item prop="smokeNum">支/天：<el-input v-model="ruleForm.smokeNum"  size="mini" placeholder="请输入每天吸烟支数" style="width: 17%" ></el-input>(若无则不填)<br></el-form-item>
                                       <el-form-item prop="noSmokeDays">已戒烟:<el-input v-model="ruleForm.noSmokeDays"  size="mini" placeholder="请输入戒除天数" style="width: 17%" ></el-input>天(若未戒则不填)</el-form-item>

                                   </div>

                                   <div><h4>饮酒史(若无则不填)</h4>
                                       <el-form-item prop="drinkHistoryYear"> 时间(年)：<el-input v-model="ruleForm.drinkHistoryYear"  size="mini" placeholder="请输入饮酒史时长（年）" style="width: 20%" ></el-input>(若无则不填)<br></el-form-item>
                                       <el-form-item prop="whiteDrink">白酒    :<el-input v-model="ruleForm.whiteDrink"  size="mini" placeholder="请输入每天白酒饮用量" style="width: 17%" ></el-input>两/天(若无则不填)<br></el-form-item>
                                       <el-form-item prop="bearDrink">啤酒    :<el-input v-model="ruleForm.bearDrink"  size="mini" placeholder="请输入每天啤酒饮用量" style="width: 17%" ></el-input>瓶/天(若无则不填)<br></el-form-item>

                                       <el-form-item prop="noDrinkDays">已戒酒:<el-input v-model="ruleForm.noDrinkDays"  size="mini" placeholder="请输入戒除天数" style="width: 17%" ></el-input>天（若未戒则不填）</el-form-item>
                                   </div>

                                   <div><h4>职业环境与暴露史(若无则不填)</h4>
                                       <el-form-item prop="exposureHistoryYear"> 时间（年）：<el-input v-model="ruleForm.exposureHistoryYear"  size="mini" placeholder="请输入职业环境与暴露史时长（年）" style="width: 40%" ></el-input>(若无则不填)<br></el-form-item>
                                       <el-form-item prop="exposureHistory"> 职业环境与暴露史类型:<el-input v-model="ruleForm.exposureHistory"  size="mini" placeholder="请输入职业环境暴露史类型（如：粉尘）" style="width: 40%" ></el-input>(若无则不填)<br></el-form-item>
                                   </div>

                                   <div><h4>宠物嗜好与接触史(若无则不填)</h4>
                                       <el-form-item prop="pets"><el-input v-model="ruleForm.pets"  size="mini" placeholder="请输入宠物嗜好与接触史" style="width: 40%" ></el-input>(若无则不填)<br></el-form-item>
                                   </div>



                   </el-descriptions-item>


                   <el-descriptions-item label="家族史">



                           <el-radio-group v-model="ruleForm.familyHistory">
                               <el-form-item prop="familyHistory">
                               <el-radio label="无" ></el-radio>
                               <el-radio label="特发性肺纤维化" ></el-radio>
                               </el-form-item>

                               <el-form-item prop="otherFamilyHistory">
                                   <div>
                                       其他家族史(若无则不填): <el-input v-model="ruleForm.otherFamilyHistory"  size="mini" placeholder="请输入其他家族史" style="width: 60%" ></el-input>
                                   </div>
                               </el-form-item>

                           </el-radio-group>



                   </el-descriptions-item>


                   <el-descriptions-item label="药物过敏史">



                           <el-radio-group v-model="ruleForm.drugAllergyHistory">
                               <el-form-item prop="drugAllergyHistory">
                               <el-radio label="无" ></el-radio>
                               <el-radio label="有" ></el-radio>
                               </el-form-item>
                               <el-form-item prop="drugAllergyHistoryDetail">
                                   <div>
                                       如有药物过敏史,详细记载: <el-input v-model="ruleForm.drugAllergyHistoryDetail"  size="mini" placeholder="请输入药物过敏史" style="width: 60%" ></el-input>
                                   </div>
                               </el-form-item>

                           </el-radio-group>



                   </el-descriptions-item>

                   <el-descriptions-item label="系统字段">


                                   <div>
                                        <el-form-item label="姓名" prop="name" ><el-input v-model="ruleForm.name"  size="mini" placeholder="请输入姓名" style="width: 60%" ></el-input></el-form-item>
                                        <el-form-item label="电话" prop="phone" ><el-input v-model="ruleForm.phone"  size="mini" placeholder="请输入电话" style="width: 60%" prop="phone" ></el-input></el-form-item>
                                        <el-form-item label="住址" prop="address" ><el-input v-model="ruleForm.address"  size="mini" placeholder="请输入住址" style="width: 60%" prop="address"></el-input></el-form-item>
                                       <el-form-item label="年龄" prop="age" ><el-input v-model="ruleForm.age"  size="mini" placeholder="请输入年龄" style="width: 60%" prop="age"></el-input></el-form-item>
                                   </div>


                   </el-descriptions-item>



               </el-descriptions>





                <el-form-item style="margin-top: 5%">
                    <el-button type="primary" @click="saveArchives">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>

        </el-dialog>


        <!--就诊信息采集对话框-->
        <el-dialog
                :visible.sync="dialogVisible2"
                width="70%"
        >

            <el-form :model="collectForm"  ref="collectForm"  label-width="100px" >
                <div style="display: flex;justify-content: center">
                    <h2 >中医信息采集</h2>
                </div>
                <el-descriptions   direction="vertical" :column="1"  border >




                    <el-descriptions-item label="主诉" >


                        <el-form-item prop="main">
                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 2, maxRows: 4}"
                                    placeholder="请输入主诉内容"
                                    v-model="collectForm.main">
                            </el-input>
                        </el-form-item>




                    </el-descriptions-item>

                    <el-descriptions-item label="现病史">
                       <el-form-item prop="present">
                           <el-input
                                   type="textarea"
                                   :autosize="{ minRows: 2, maxRows: 4}"
                                   placeholder="请输入现病史内容"
                                   v-model="collectForm.present">
                           </el-input>
                       </el-form-item>

                    </el-descriptions-item>

                    <el-descriptions-item label="刻下症">
                        <el-form-item prop="visible">
                        <el-input
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 4}"
                                placeholder="请输入刻下症内容"
                                v-model="collectForm.visible">
                        </el-input>
                        </el-form-item>
                    </el-descriptions-item>
                </el-descriptions>





                <el-descriptions  title="主症" direction="vertical" :column="1" border >
                    <el-descriptions-item label="咳嗽"  >
                        <el-form-item label="" prop="cough" >
                            <el-radio-group v-model="collectForm.cough">
                                <el-radio label="无"></el-radio>
                                <el-radio label="有"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="性质">
                        <el-form-item prop="nature">
                            <el-radio-group v-model="collectForm.nature">
                                <el-radio label="干咳"></el-radio>
                                <el-radio label="湿咳（每天痰量>10ml）"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="程度">
                        <el-form-item  prop="degree">
                            <el-radio-group v-model="collectForm.degree">
                                <el-radio label="偶有短暂咳嗽"></el-radio>
                                <el-radio label="频繁咳嗽，轻度影响日常生活"></el-radio>
                                <el-radio label="频繁咳嗽，严重影响日常生活"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="加重因素">
                        <el-form-item prop="increaseFactors">
                            <el-radio-group v-model="collectForm.increaseFactors">
                                <el-radio label="活动后加重"></el-radio>
                                <el-radio label="无明显加重因素"></el-radio>
                                <el-radio  label="其他"></el-radio>
                                <el-input v-model="collectForm.increaseFactors"  size="mini" placeholder="请输入其他加重因素" style="width: 140px" ></el-input>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="缓解因素">
                        <el-form-item prop="decreaseFactors">
                            <el-radio-group v-model="collectForm.decreaseFactors">
                                <el-radio label="痰出"></el-radio>
                                <el-radio label="休息"></el-radio>
                                <el-radio label="无明显缓解因素"></el-radio>
                                <el-radio  label="其他"></el-radio>
                                <el-input v-model="collectForm.decreaseFactors"  size="mini" placeholder="请输入其他缓解因素" style="width: 140px" ></el-input>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="咳痰">
                        <el-form-item prop="expectoration">
                            <el-radio-group v-model="collectForm.expectoration">
                                <el-radio label="无"></el-radio>
                                <el-radio label="有"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="痰量">
                        <el-form-item prop="volume">
                            <el-radio-group v-model="collectForm.volume">
                                <el-radio label="少量（昼夜咯痰10-50ml）"></el-radio>
                                <el-radio label="中等量（昼夜咯痰51-100ml）"></el-radio>
                                <el-radio label="大量（昼夜咯痰>100ml）"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>



                    <el-descriptions-item label="痰色">
                        <el-form-item prop="phlegmColor">
                            <el-radio-group v-model="collectForm.phlegmColor">
                                <el-radio label="白"></el-radio>
                                <el-radio label="灰"></el-radio>
                                <el-radio label="黄"></el-radio>
                                <el-radio label="带血"></el-radio>
                                <el-radio label="其他"></el-radio>
                                <el-input v-model="collectForm.phlegmColor"  size="mini" placeholder="请输入其他痰色" style="width: 140px" ></el-input>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="痰质">
                        <el-form-item prop="phlegmQuality">
                            <el-radio-group v-model="collectForm.phlegmQuality">
                                <el-radio label="清稀"></el-radio>
                                <el-radio label="泡沫"></el-radio>
                                <el-radio label="黏稠"></el-radio>
                                <el-radio label="破絮"></el-radio>
                                <el-radio label="拉丝"></el-radio>
                                <el-radio label="其他"></el-radio>
                                <el-input v-model="collectForm.phlegmQuality"  size="mini" placeholder="请输入其他痰质" style="width: 140px" ></el-input>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="痰味">
                        <el-form-item prop="phlegmTaste">
                            <el-radio-group v-model="collectForm.phlegmTaste">
                                <el-radio label="无"></el-radio>
                                <el-radio label="甜"></el-radio>
                                <el-radio label="咸"></el-radio>
                                <el-radio label="腥"></el-radio>
                                <el-radio label="其他"></el-radio>
                                <el-input v-model="collectForm.phlegmTaste"  size="mini" placeholder="请输入其他痰味" style="width: 140px" ></el-input>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="呼吸困难">
                        <el-form-item prop="dyspnea">
                            <el-radio-group v-model="collectForm.dyspnea">
                                <el-radio label="无"></el-radio>
                                <el-radio label="有"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>
  //TODO  以下字段 增加重置
                    <el-descriptions-item label="呼吸困难加重因素">
                        <el-form-item >
                            <el-checkbox-group v-model="collectForm.dyspneaIncrease">
                                <el-checkbox label="活动"></el-checkbox>
                                <el-checkbox label="平卧"></el-checkbox>
                                <el-checkbox label="情绪波动"></el-checkbox>
                                <el-checkbox label="呼吸道感染"></el-checkbox>
                                <el-checkbox label="其他"></el-checkbox>
                                <el-input v-model="collectForm.dyspneaIncreaseOther"  size="mini" placeholder="请在此补充其他呼吸困难加重因素" style="width: 200px" ></el-input>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="呼吸困难缓解因素">
                        <el-form-item >
                            <el-checkbox-group v-model="collectForm.dyspneaDecrease">
                                <el-checkbox label="休息"></el-checkbox>
                                <el-checkbox label="吸氧"></el-checkbox>
                                <el-checkbox label="其他"></el-checkbox>
                                <el-input v-model="collectForm.dyspneaDecreaseOther"  size="mini" placeholder="请在此补充其他呼吸困难缓解因素" style="width: 200px" ></el-input>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-descriptions-item>



                    <el-descriptions-item label="呼吸困难程度">
                        <el-form-item >
                            <el-radio-group v-model="collectForm.dyspneaDegree">
                                <el-radio label="0级 只在剧烈运动时才出现呼吸困难"></el-radio><br>
                                <el-radio label="1级 在走路较急或爬缓坡时会出现呼吸困难"></el-radio><br>
                                <el-radio label="2级 按平时走路方式走时会出现气短，必须停下来休息，走路比同龄人慢"></el-radio><br>
                                <el-radio label="3级 步行100码（91.44米）或几分钟后需要停下来休息"></el-radio><br>
                                <el-radio label="4级 因呼吸困难严重不能离家，或穿脱衣时出现呼吸困难"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-descriptions-item>



                    <el-descriptions-item label="伴随症状">
                        <el-form-item >
                            <el-checkbox-group v-model="collectForm.accompanyingSymptoms">
                                <el-checkbox label="发热"></el-checkbox>
                                <el-checkbox label="胸闷"></el-checkbox>
                                <el-checkbox label="胸痛"></el-checkbox>
                                <el-checkbox label="咯血"></el-checkbox>
                                <el-checkbox label="发绀"></el-checkbox>
                                <el-checkbox label="杵状指"></el-checkbox>
                                <el-checkbox label="velcro啰音"></el-checkbox>
                                <el-checkbox label="心悸"></el-checkbox>
                                <el-checkbox label="下肢水肿"></el-checkbox>
                                <el-checkbox label="颈静脉怒张"></el-checkbox>
                                <el-checkbox label="焦虑"></el-checkbox>
                                <el-checkbox label="抑郁"></el-checkbox>
                                <el-checkbox label="睡眠障碍"></el-checkbox>
                                <el-checkbox label="嗜睡"></el-checkbox>
                                <el-checkbox label="头晕"></el-checkbox>
                                <el-checkbox label="头痛"></el-checkbox>
                                <el-checkbox label="谵妄"></el-checkbox>
                                <el-checkbox label="自汗"></el-checkbox>
                                <el-checkbox label="盗汗"></el-checkbox>
                                <el-checkbox label="畏寒"></el-checkbox>
                                <el-checkbox label="怕热"></el-checkbox>
                                <el-checkbox label="乏力"></el-checkbox>
                                <el-checkbox label="口干或眼干"></el-checkbox>
                                <el-checkbox label="皮疹"></el-checkbox>
                                <el-checkbox label="关节疼痛或肿胀"></el-checkbox>
                                <el-checkbox label="口腔溃疡"></el-checkbox>
                                <el-checkbox label="食欲不振"></el-checkbox>
                                <el-checkbox label="腹胀"></el-checkbox>
                                <el-checkbox label="腹泻"></el-checkbox>
                                <el-checkbox label="体重下降"></el-checkbox>
                                <el-checkbox label="其他"></el-checkbox>
                                <el-input v-model="collectForm.accompanyingSymptomsOther"  size="mini" placeholder="请在此补充其他伴随症状" style="width: 200px" ></el-input>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-descriptions-item>




                </el-descriptions>






                <el-descriptions style="margin-top:-5%" title="中医证候信息表" direction="vertical" :column="1" border >

                    <el-descriptions-item label="肺系">
                        <el-form-item >
                            <el-checkbox-group v-model="collectForm.pulmonarySystem">
                                <el-checkbox label="咳嗽"></el-checkbox>
                                <el-checkbox label="咳声重浊/沉闷"></el-checkbox>
                                <el-checkbox label="咳声高亢"></el-checkbox>
                                <el-checkbox label="咳声低微"></el-checkbox>
                                <el-checkbox label="咳声短促"></el-checkbox>
                                <el-checkbox label="咯痰"></el-checkbox>
                                <el-checkbox label="痰量多"></el-checkbox>
                                <el-checkbox label="痰量少"></el-checkbox>
                                <el-checkbox label="无痰"></el-checkbox>
                                <el-checkbox label="痰黄"></el-checkbox>
                                <el-checkbox label="痰白"></el-checkbox>
                                <el-checkbox label="痰质黏稠"></el-checkbox>
                                <el-checkbox label="痰质清稀"></el-checkbox>
                                <el-checkbox label="喘息"></el-checkbox>
                                <el-checkbox label="气短"></el-checkbox>
                                <el-checkbox label="气急/气促"></el-checkbox>
                                <el-checkbox label="胸痛"></el-checkbox>
                                <el-checkbox label="咯血"></el-checkbox>
                                <el-checkbox label="咽干"></el-checkbox>
                                <el-checkbox label="咽痒"></el-checkbox>
                                <el-checkbox label="其他"></el-checkbox>
                                <el-input v-model="collectForm.pulmonarySystemOther"  size="mini" placeholder="请在此补充其他肺系情况" style="width: 200px" ></el-input>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-descriptions-item>



                    <el-descriptions-item label="寒热">
                        <el-form-item >
                            <el-checkbox-group v-model="collectForm.coldAndHeat">
                                <el-checkbox label="正常"></el-checkbox>
                                <el-checkbox label="畏寒"></el-checkbox>
                                <el-checkbox label="恶寒"></el-checkbox>
                                <el-checkbox label="恶风"></el-checkbox>
                                <el-checkbox label="微热"></el-checkbox>
                                <el-checkbox label="壮热"></el-checkbox>
                                <el-checkbox label="潮热"></el-checkbox>
                                <el-checkbox label="五心烦热"></el-checkbox>
                                <el-checkbox label="寒热往来"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-descriptions-item>


                    <el-descriptions-item label="汗出">
                        <el-form-item >
                            <el-checkbox-group v-model="collectForm.perspiration">
                                <el-checkbox label="正常"></el-checkbox>
                                <el-checkbox label="无汗"></el-checkbox>
                                <el-checkbox label="自汗"></el-checkbox>
                                <el-checkbox label="盗汗"></el-checkbox>
                                <el-checkbox label="头汗"></el-checkbox>
                                <el-checkbox label="手足心汗"></el-checkbox>
                                <el-checkbox label="其他"></el-checkbox>
                                <el-input v-model="collectForm.perspirationOther"  size="mini" placeholder="请在此补充其他汗出情况" style="width: 200px" ></el-input>

                            </el-checkbox-group>
                        </el-form-item>
                    </el-descriptions-item>



                    <el-descriptions-item label="精神">
                        <el-form-item >
                            <el-checkbox-group v-model="collectForm.spirit">
                                <el-checkbox label="正常"></el-checkbox>
                                <el-checkbox label="乏力"></el-checkbox>
                                <el-checkbox label="神疲"></el-checkbox>
                                <el-checkbox label="嗜睡"></el-checkbox>
                                <el-checkbox label="烦躁"></el-checkbox>
                                <el-checkbox label="神昏"></el-checkbox>
                                <el-checkbox label="其他"></el-checkbox>
                                <el-input v-model="collectForm.spiritOther"  size="mini" placeholder="请在此补充其他精神情况" style="width: 200px" ></el-input>

                            </el-checkbox-group>
                        </el-form-item>
                    </el-descriptions-item>



                    <el-descriptions-item label="情志">
                        <el-form-item >
                            <el-checkbox-group v-model="collectForm.emotion">
                                <el-checkbox label="正常"></el-checkbox>
                                <el-checkbox label="烦躁易怒"></el-checkbox>
                                <el-checkbox label="抑郁"></el-checkbox>
                                <el-checkbox label="健忘"></el-checkbox>
                                <el-checkbox label="易惊"></el-checkbox>
                                <el-checkbox label="其他"></el-checkbox>
                                <el-input v-model="collectForm.emotionOther"  size="mini" placeholder="请在此补充其他情志情况" style="width: 200px" ></el-input>

                            </el-checkbox-group>
                        </el-form-item>
                    </el-descriptions-item>


                    <el-descriptions-item label="面色">
                        <el-form-item >
                            <el-checkbox-group v-model="collectForm.Complexion">
                                <el-checkbox label="常色"></el-checkbox>
                                <el-checkbox label="淡白无华"></el-checkbox>
                                <el-checkbox label="㿠白"></el-checkbox>
                                <el-checkbox label="萎黄"></el-checkbox>
                                <el-checkbox label="潮红"></el-checkbox>
                                <el-checkbox label="青紫"></el-checkbox><br>
                                <el-checkbox label="晦暗"></el-checkbox>
                                <el-checkbox label="面色黧黑、肌肤甲错"></el-checkbox>
                                <el-checkbox label="其他"></el-checkbox>
                                <el-input v-model="collectForm.ComplexionOther"  size="mini" placeholder="请在此补充其他面色情况" style="width: 200px" ></el-input>

                            </el-checkbox-group>
                        </el-form-item>
                    </el-descriptions-item>



                    <el-descriptions-item label="饮食">
                        <el-form-item >
                            <div>食：</div>
                            <el-checkbox-group v-model="collectForm.food">
                                <el-checkbox label="正常"></el-checkbox>
                                <el-checkbox label="纳差"></el-checkbox>
                                <el-checkbox label="饥不欲食"></el-checkbox>
                                <el-checkbox label="消谷善饥"></el-checkbox>
                                <el-checkbox label="恶心呕吐"></el-checkbox><br>
                                <el-checkbox label="朝食暮吐、暮食朝吐"></el-checkbox>
                                <el-checkbox label="脘闷"></el-checkbox>
                                <el-checkbox label="腹胀"></el-checkbox>
                                <el-checkbox label="其他"></el-checkbox>
                                <el-input v-model="collectForm.foodOther"  size="mini" placeholder="请在此补充其他" style="width: 200px" ></el-input>

                            </el-checkbox-group>

                            <div>饮：</div>
                            <el-checkbox-group v-model="collectForm.drink">
                                <el-checkbox label="正常"></el-checkbox>
                                <el-checkbox label="口不渴"></el-checkbox>
                                <el-checkbox label="渴喜冷饮"></el-checkbox>
                                <el-checkbox label="渴喜热饮"></el-checkbox>
                                <el-checkbox label="渴不欲饮"></el-checkbox><br>
                                <el-checkbox label="渴饮不多"></el-checkbox>
                                <el-checkbox label="口渴但欲漱水不欲咽"></el-checkbox>
                                <el-checkbox label="水入即吐"></el-checkbox>
                                <el-checkbox label="其他"></el-checkbox>
                                <el-input v-model="collectForm.drinkOther"  size="mini" placeholder="请在此补充其他" style="width: 200px" ></el-input>

                            </el-checkbox-group>

                            <div>味：</div>
                            <el-checkbox-group v-model="collectForm.taste">
                                <el-checkbox label="正常"></el-checkbox>
                                <el-checkbox label="口苦"></el-checkbox>
                                <el-checkbox label="口淡"></el-checkbox>
                                <el-checkbox label="口咸"></el-checkbox>
                                <el-checkbox label="口腥"></el-checkbox><br>
                                <el-checkbox label="口甜"></el-checkbox>
                                <el-checkbox label="口腻"></el-checkbox>
                                <el-checkbox label="其他"></el-checkbox>
                                <el-input v-model="collectForm.tasteOther"  size="mini" placeholder="请在此补充其他" style="width: 200px" ></el-input>

                            </el-checkbox-group>
                        </el-form-item>
                    </el-descriptions-item>



                    <el-descriptions-item label="二便">
                        <el-form-item >
                            <div>小便：</div>
                            <el-checkbox-group v-model="collectForm.urine">
                                <el-checkbox label="正常"></el-checkbox>
                                <el-checkbox label="清长"></el-checkbox>
                                <el-checkbox label="短赤"></el-checkbox>
                                <el-checkbox label="便黄"></el-checkbox>
                                <el-checkbox label="夜尿频数"></el-checkbox>
                                <el-checkbox label="小便涩痛"></el-checkbox><br>
                                <el-checkbox label="淋漓不尽"></el-checkbox>
                                <el-checkbox label="遗尿"></el-checkbox>
                                <el-checkbox label="其他"></el-checkbox>
                                <el-input v-model="collectForm.urineOther"  size="mini" placeholder="请在此补充其他小便情况" style="width: 200px" ></el-input>

                            </el-checkbox-group>

                            <div>大便：</div>
                            <el-checkbox-group v-model="collectForm.defecate">
                                <el-checkbox label="正常"></el-checkbox>
                                <el-checkbox label="干结"></el-checkbox>
                                <el-checkbox label="稀溏"></el-checkbox>
                                <el-checkbox label="排便无力"></el-checkbox>
                                <el-checkbox label="黏滞不爽"></el-checkbox>
                                <el-checkbox label="完谷不化"></el-checkbox><br>
                                <el-checkbox label="其他"></el-checkbox>
                                <el-input v-model="collectForm.defecateOther"  size="mini" placeholder="请在此补充其他大便情况" style="width: 200px" ></el-input>

                            </el-checkbox-group>
                        </el-form-item>
                    </el-descriptions-item>


                    <el-descriptions-item label="睡眠">
                        <el-form-item >

                            <el-checkbox-group v-model="collectForm.sleep">
                                <el-checkbox label="正常"></el-checkbox>
                                <el-checkbox label="迟难入睡"></el-checkbox>
                                <el-checkbox label="多梦"></el-checkbox>
                                <el-checkbox label="易醒"></el-checkbox>
                                <el-checkbox label="其他"></el-checkbox>
                                <el-input v-model="collectForm.sleepOther"  size="mini" placeholder="请在此补充其他睡眠情况" style="width: 200px" ></el-input>

                            </el-checkbox-group>

                        </el-form-item>
                    </el-descriptions-item>


                    <el-descriptions-item label="周身四肢">
                        <el-form-item >

                            <el-checkbox-group v-model="collectForm.bodyAndLimbs">
                                <el-checkbox label="正常"></el-checkbox>
                                <el-checkbox label="腰膝酸软"></el-checkbox>
                                <el-checkbox label="肢冷"></el-checkbox>
                                <el-checkbox label="耳鸣"></el-checkbox>
                                <el-checkbox label="目干"></el-checkbox>
                                <el-checkbox label="面目或肢体浮肿"></el-checkbox>
                                <el-checkbox label="其他"></el-checkbox>
                                <el-input v-model="collectForm.bodyAndLimbsOther"  size="mini" placeholder="请在此补充其他周身四肢情况" style="width: 200px" ></el-input>

                            </el-checkbox-group>

                        </el-form-item>
                    </el-descriptions-item>




                </el-descriptions>



                <el-form-item style="margin-top: 5%">
                    <el-button type="primary" @click="">提交</el-button>
                    <el-button @click="resetFormForCollect('collectForm')">重置</el-button>
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
                dialogVisible2: false,
                currentPage: 1,
                pageSize:10,
                total:null,
                drawer: false,
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
                    address:null,
                    age:null



                },
                tableData: [],

                rules: {
                    name: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' },
                    ],
                    phone: [
                        { required: true, message: '电话不能为空', trigger: 'blur' },
                    ],
                    address: [
                        { required: true, message: '地址不能为空', trigger: 'blur' },

                    ],
                    age: [
                        { required: true, message: '年龄不能为空', trigger: 'blur' },

                    ],

                },
                  //就诊采集字段
                collectForm:{
                    name:null,
                    //表一字段
                    main:null,
                    present:null,
                    visible:null,//刻下症
                    cough:null,
                    nature:null,
                    degree:null,
                    increaseFactors:null,
                    decreaseFactors:null,
                    expectoration:null,
                    volume:null,
                    phlegmColor:null,
                    phlegmQuality:null,
                    phlegmTaste:null,
                    dyspnea:null,
                    dyspneaIncrease:[],
                    dyspneaIncreaseOther:null,
                    dyspneaDecrease:[],
                    dyspneaDecreaseOther:null,
                    dyspneaDegree:null,
                    accompanyingSymptoms:[],
                    accompanyingSymptomsOther:null,
                    pulmonarySystem:[],
                    pulmonarySystemOther:null,
                    coldAndHeat:null,
                    perspiration:[],
                    perspirationOther:null,
                    spirit:[],
                    spiritOther:null,
                    emotion:[],
                    emotionOther:null,
                    Complexion:[],
                    ComplexionOther:null,
                    food:[],
                    foodOther:null,
                    drink:[],
                    drinkOther:null,
                    taste:[],
                    tasteOther:null,
                    urine:[],
                    urineOther:null,
                    defecate:[],
                    defecateOther:null,
                    sleep:[],
                    sleepOther:null,
                    bodyAndLimbs:[],
                    bodyAndLimbsOthers:null
                    //表二字段






                },
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
                    },

                }).then(res =>{

                    console.log(res)
                    that.tableData = res.data.data.list
                    that.total = res.data.data.total
                    that.pageSize = res.data.data.pageSize

                        console.log(that.tableData)
                })
            },


            saveArchives(){

                let that= this
                this.$axios.post("/doctor/archives/saveArchives",{

                        checkOne:that.ruleForm.checkOne,
                        checkTwo:that.ruleForm.checkTwo,
                        addOne:that.ruleForm.addOne,
                        addTwo:that.ruleForm.addTwo,
                        addThree:that.ruleForm.addThree,
                        addFour:that.ruleForm.addFour,
                        excludeOne:that.ruleForm.excludeOne,
                        excludeTwo:that.ruleForm.excludeTwo,
                        excludeThree:that.ruleForm.excludeThree,
                        sex:that.ruleForm.sex,
                        birth:that.ruleForm.birth,
                        nation:that.ruleForm.nation,
                        marriage:that.ruleForm.marriage,
                        edu:that.ruleForm.edu,
                        profession:that.ruleForm.profession,
                        height:that.ruleForm.height,
                        weight:that.ruleForm.weight,
                        startDate:that.ruleForm.startDate,
                        endDate:that.ruleForm.sureDate,
                        pastHistory:that.ruleForm.pastHistory,
                        otherPastHistory:that.ruleForm.otherPastHistory,
                        smokeHistoryYear:that.ruleForm.smokeHistoryYear,
                        smokeNum:that.ruleForm.smokeNum,
                        noSmokeDays:that.ruleForm.noSmokeDays,
                        drinkHistoryYear:that.ruleForm.drinkHistoryYear,
                        whiteDrink:that.ruleForm.whiteDrink,
                        bearDrink:that.ruleForm.bearDrink,
                        noDrinkDays:that.ruleForm.noDrinkDays,
                        exposureHistoryYear:that.ruleForm.exposureHistoryYear,
                        exposureHistory:that.ruleForm.exposureHistory,
                        pets:that.ruleForm.pets,
                        familyHistory:that.ruleForm.familyHistory,
                        otherFamilyHistory:that.ruleForm.otherFamilyHistory,
                        drugAllergyHistory:that.ruleForm.drugAllergyHistory,
                        drugAllergyHistoryDetail:that.ruleForm.drugAllergyHistoryDetail,
                        name:that.ruleForm.name,
                        phone:that.ruleForm.phone,
                        address:that.ruleForm.address,
                        age:that.ruleForm.age


                }).then(res =>{
                    console.log(res)
                     that.resetForm('ruleForm')
                    if (res.data.message == "success"){
                        that.dialogVisible =false
                        that.$message({
                            showClose: true,
                            message: res.data.data,
                            type: 'success'
                        });

                    }

                })

            },
            resetForm(ruleForm) {
                this.$refs[ruleForm].resetFields();
            },

            resetFormForCollect(collectForm){
                this.$refs[collectForm].resetFields();
            }





        },
        //页面渲染时，请求
        created() {
            this.onSubmit()
        }

    }
</script>

<style scoped>

</style>