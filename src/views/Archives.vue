
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
              <!--  <el-button size="mini" round @click="drawer = true">选中</el-button>-->
                <template slot-scope="scope">
                    <el-button size="mini" round @click="choose(scope.row)">选中</el-button>
                </template>

            </el-table-column>

        </el-table>

        <el-drawer
                title=""
                :visible.sync="drawer"
                :with-header="false"
        >
            <span style="justify-content: center;display: flex"><h3>就诊信息采集</h3>

            </span>

            <h5 style="justify-content: center;display: flex;line-height: 0px;margin-top: 0px">当前诊次：{{visitSequence}}</h5>

            <div style="justify-content: center;display: flex;flex-direction: row;line-height: 0px;margin-top: 5%">


                <div>
                    表单
                    <el-button size="medium" round @click="dialogVisible2 = true" >采集</el-button>
                </div>
            </div>



            <div style="justify-content: center;display: flex;flex-direction: row;line-height: 0px;margin-top: 5%">


                <div>
                    舌象
                    <el-button size="medium" round @click="tongueCollect()" >采集</el-button>
                </div>
            </div>


            <div style="justify-content: center;display: flex;flex-direction: row;line-height: 0px;margin-top: 5%">


                <el-button size="mini" style="" round @click="over()">结束本次就诊采集</el-button>
            </div>


            <div style="justify-content: center;display: flex;flex-direction: row;line-height: 0px;margin-top: 5%">
                <el-button size="mini" style="" round @click="pushFollow()" >转入随访流程</el-button>
            </div>



            <div style="justify-content: center;display: flex;flex-direction: column;line-height: 0px;margin-top: 25%">

                <div style="display: flex;flex-direction: row;justify-content: center">
                    <el-button size="medium" round @click="getVisitHistory()" >历史就诊</el-button>
                    <el-button size="medium" round  >自我管理</el-button>
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

                    <el-descriptions-item label="呼吸困难加重因素">
                        <el-form-item prop="dyspneaIncrease">
                            <el-checkbox-group v-model="collectForm.dyspneaIncrease">
                                <el-checkbox label="活动"></el-checkbox>
                                <el-checkbox label="平卧"></el-checkbox>
                                <el-checkbox label="情绪波动"></el-checkbox>
                                <el-checkbox label="呼吸道感染"></el-checkbox>
                                <el-checkbox label="其他"></el-checkbox>
                                <el-form-item prop="dyspneaIncreaseOther">
                                    <el-input v-model="collectForm.dyspneaIncreaseOther"  size="mini" placeholder="请在此补充其他呼吸困难加重因素" style="width: 200px" ></el-input>
                                </el-form-item>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="呼吸困难缓解因素">
                        <el-form-item prop="dyspneaDecrease">
                            <el-checkbox-group v-model="collectForm.dyspneaDecrease">
                                <el-checkbox label="休息"></el-checkbox>
                                <el-checkbox label="吸氧"></el-checkbox>
                                <el-checkbox label="其他"></el-checkbox>
                                <el-form-item prop="dyspneaDecreaseOther">
                                    <el-input v-model="collectForm.dyspneaDecreaseOther"  size="mini" placeholder="请在此补充其他呼吸困难缓解因素" style="width: 200px" ></el-input>

                                </el-form-item>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-descriptions-item>



                    <el-descriptions-item label="呼吸困难程度">
                        <el-form-item prop="dyspneaDegree">
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
                        <el-form-item prop="accompanyingSymptoms">
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
                                <el-form-item prop="accompanyingSymptomsOther">
                                    <el-input v-model="collectForm.accompanyingSymptomsOther"  size="mini" placeholder="请在此补充其他伴随症状" style="width: 200px" ></el-input>

                                </el-form-item>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-descriptions-item>




                </el-descriptions>






                <el-descriptions style="margin-top:-5%" title="中医证候信息表" direction="vertical" :column="1" border >

                    <el-descriptions-item label="肺系">
                        <el-form-item prop="pulmonarySystem">
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
                                <el-form-item prop="pulmonarySystemOther">
                                    <el-input v-model="collectForm.pulmonarySystemOther"  size="mini" placeholder="请在此补充其他肺系情况" style="width: 200px" ></el-input>
                                </el-form-item>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-descriptions-item>



                    <el-descriptions-item label="寒热">
                        <el-form-item prop="coldAndHeat">
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
                        <el-form-item prop="perspiration">
                            <el-checkbox-group v-model="collectForm.perspiration">
                                <el-checkbox label="正常"></el-checkbox>
                                <el-checkbox label="无汗"></el-checkbox>
                                <el-checkbox label="自汗"></el-checkbox>
                                <el-checkbox label="盗汗"></el-checkbox>
                                <el-checkbox label="头汗"></el-checkbox>
                                <el-checkbox label="手足心汗"></el-checkbox>
                                <el-checkbox label="其他"></el-checkbox>
                                <el-form-item prop="perspirationOther">
                                    <el-input v-model="collectForm.perspirationOther"  size="mini" placeholder="请在此补充其他汗出情况" style="width: 200px" ></el-input>
                                </el-form-item>

                            </el-checkbox-group>
                        </el-form-item>
                    </el-descriptions-item>



                    <el-descriptions-item label="精神">
                        <el-form-item prop="spirit">
                            <el-checkbox-group v-model="collectForm.spirit">
                                <el-checkbox label="正常"></el-checkbox>
                                <el-checkbox label="乏力"></el-checkbox>
                                <el-checkbox label="神疲"></el-checkbox>
                                <el-checkbox label="嗜睡"></el-checkbox>
                                <el-checkbox label="烦躁"></el-checkbox>
                                <el-checkbox label="神昏"></el-checkbox>
                                <el-checkbox label="其他"></el-checkbox>
                                <el-form-item prop="spiritOther">
                                    <el-input v-model="collectForm.spiritOther"  size="mini" placeholder="请在此补充其他精神情况" style="width: 200px" ></el-input>
                                </el-form-item>

                            </el-checkbox-group>
                        </el-form-item>
                    </el-descriptions-item>



                    <el-descriptions-item label="情志">
                        <el-form-item prop="emotion">
                            <el-checkbox-group v-model="collectForm.emotion">
                                <el-checkbox label="正常"></el-checkbox>
                                <el-checkbox label="烦躁易怒"></el-checkbox>
                                <el-checkbox label="抑郁"></el-checkbox>
                                <el-checkbox label="健忘"></el-checkbox>
                                <el-checkbox label="易惊"></el-checkbox>
                                <el-checkbox label="其他"></el-checkbox>
                                <el-form-item prop="emotionOther">
                                    <el-input v-model="collectForm.emotionOther"  size="mini" placeholder="请在此补充其他情志情况" style="width: 200px" ></el-input>

                                </el-form-item>

                            </el-checkbox-group>
                        </el-form-item>
                    </el-descriptions-item>


                    <el-descriptions-item label="面色">
                        <el-form-item prop="complexion">
                            <el-checkbox-group v-model="collectForm.complexion">
                                <el-checkbox label="常色"></el-checkbox>
                                <el-checkbox label="淡白无华"></el-checkbox>
                                <el-checkbox label="㿠白"></el-checkbox>
                                <el-checkbox label="萎黄"></el-checkbox>
                                <el-checkbox label="潮红"></el-checkbox>
                                <el-checkbox label="青紫"></el-checkbox><br>
                                <el-checkbox label="晦暗"></el-checkbox>
                                <el-checkbox label="面色黧黑、肌肤甲错"></el-checkbox>
                                <el-checkbox label="其他"></el-checkbox>
                                <el-form-item prop="complexionOther">
                                    <el-input v-model="collectForm.complexionOther"  size="mini" placeholder="请在此补充其他面色情况" style="width: 200px" ></el-input>

                                </el-form-item>

                            </el-checkbox-group>
                        </el-form-item>
                    </el-descriptions-item>



                    <el-descriptions-item label="饮食">
                        <el-form-item >
                            <div>食：</div>
                            <el-form-item prop="food">
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
                                <el-form-item prop="foodOther">
                                    <el-input v-model="collectForm.foodOther"  size="mini" placeholder="请在此补充其他" style="width: 200px" ></el-input>

                                </el-form-item>

                            </el-checkbox-group>
                                </el-form-item >

                            <div>饮：</div>
                        <el-form-item prop="drink">
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
                                <el-form-item prop="drinkOther">
                                <el-input v-model="collectForm.drinkOther"  size="mini" placeholder="请在此补充其他" style="width: 200px" ></el-input>
                                </el-form-item >
                            </el-checkbox-group>
                        </el-form-item >
                            <div>味：</div>
                        <el-form-item prop="taste">
                            <el-checkbox-group v-model="collectForm.taste">
                                <el-checkbox label="正常"></el-checkbox>
                                <el-checkbox label="口苦"></el-checkbox>
                                <el-checkbox label="口淡"></el-checkbox>
                                <el-checkbox label="口咸"></el-checkbox>
                                <el-checkbox label="口腥"></el-checkbox><br>
                                <el-checkbox label="口甜"></el-checkbox>
                                <el-checkbox label="口腻"></el-checkbox>
                                <el-checkbox label="其他"></el-checkbox>
                                <el-form-item prop="tasteOther">
                                <el-input v-model="collectForm.tasteOther"  size="mini" placeholder="请在此补充其他" style="width: 200px" ></el-input>
                                </el-form-item >
                            </el-checkbox-group>
                        </el-form-item >
                        </el-form-item>
                    </el-descriptions-item>



                    <el-descriptions-item label="二便">
                        <el-form-item prop="urine">
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
                                <el-form-item prop="urineOther">
                                    <el-input v-model="collectForm.urineOther"  size="mini" placeholder="请在此补充其他小便情况" style="width: 200px" ></el-input>

                                </el-form-item>

                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item prop="defecate">

                            <div>大便：</div>
                            <el-checkbox-group v-model="collectForm.defecate">
                                <el-checkbox label="正常"></el-checkbox>
                                <el-checkbox label="干结"></el-checkbox>
                                <el-checkbox label="稀溏"></el-checkbox>
                                <el-checkbox label="排便无力"></el-checkbox>
                                <el-checkbox label="黏滞不爽"></el-checkbox>
                                <el-checkbox label="完谷不化"></el-checkbox><br>
                                <el-checkbox label="其他"></el-checkbox>
                                <el-form-item prop="defecateOther">
                                    <el-input v-model="collectForm.defecateOther"  size="mini" placeholder="请在此补充其他大便情况" style="width: 200px" ></el-input>

                                </el-form-item>

                            </el-checkbox-group>

                        </el-form-item>


                    </el-descriptions-item>


                    <el-descriptions-item label="睡眠">
                        <el-form-item prop="sleep">

                            <el-checkbox-group v-model="collectForm.sleep">
                                <el-checkbox label="正常"></el-checkbox>
                                <el-checkbox label="迟难入睡"></el-checkbox>
                                <el-checkbox label="多梦"></el-checkbox>
                                <el-checkbox label="易醒"></el-checkbox>
                                <el-checkbox label="其他"></el-checkbox>
                                <el-form-item prop="sleepOther">
                                    <el-input v-model="collectForm.sleepOther"  size="mini" placeholder="请在此补充其他睡眠情况" style="width: 200px" ></el-input>

                                </el-form-item>

                            </el-checkbox-group>

                        </el-form-item>
                    </el-descriptions-item>


                    <el-descriptions-item label="周身四肢">
                        <el-form-item prop="bodyAndLimbs">

                            <el-checkbox-group v-model="collectForm.bodyAndLimbs">
                                <el-checkbox label="正常"></el-checkbox>
                                <el-checkbox label="腰膝酸软"></el-checkbox>
                                <el-checkbox label="肢冷"></el-checkbox>
                                <el-checkbox label="耳鸣"></el-checkbox>
                                <el-checkbox label="目干"></el-checkbox>
                                <el-checkbox label="面目或肢体浮肿"></el-checkbox>
                                <el-checkbox label="其他"></el-checkbox>
                                <el-form-item prop="bodyAndLimbsOthers">
                                    <el-input v-model="collectForm.bodyAndLimbsOthers"  size="mini" placeholder="请在此补充其他周身四肢情况" style="width: 200px" ></el-input>

                                </el-form-item>

                            </el-checkbox-group>

                        </el-form-item>
                    </el-descriptions-item>


                    <el-descriptions-item label="舌象">
                        <el-form-item prop="tongueColor">
                            <div>舌色</div>
                            <el-checkbox-group v-model="collectForm.tongueColor">
                                <el-checkbox label="淡红"></el-checkbox>
                                <el-checkbox label="淡白"></el-checkbox>
                                <el-checkbox label="红"></el-checkbox>
                                <el-checkbox label="绛"></el-checkbox>
                                <el-checkbox label="青紫"></el-checkbox>
                                <el-checkbox label="暗/瘀斑瘀点"></el-checkbox>
                            </el-checkbox-group>

                        </el-form-item>

                        <el-form-item prop="tongueShape">
                            <div>舌形</div>
                            <el-checkbox-group v-model="collectForm.tongueShape">
                                <el-checkbox label="正常"></el-checkbox>
                                <el-checkbox label="老"></el-checkbox>
                                <el-checkbox label="嫩"></el-checkbox>
                                <el-checkbox label="胖大"></el-checkbox>
                                <el-checkbox label="肿胀"></el-checkbox>
                                <el-checkbox label="薄瘦"></el-checkbox>
                                <el-checkbox label="点刺"></el-checkbox>
                                <el-checkbox label="裂纹"></el-checkbox>
                                <el-checkbox label="齿痕"></el-checkbox>
                            </el-checkbox-group>

                        </el-form-item>

                        <el-form-item prop="tongueState">
                            <div>舌态</div>
                            <el-checkbox-group v-model="collectForm.tongueState">
                                <el-checkbox label="正常"></el-checkbox>
                                <el-checkbox label="强硬"></el-checkbox>
                                <el-checkbox label="痿软"></el-checkbox>
                                <el-checkbox label="颤动"></el-checkbox>
                                <el-checkbox label="歪斜"></el-checkbox>
                                <el-checkbox label="吐弄"></el-checkbox>
                                <el-checkbox label="短缩"></el-checkbox>
                                <el-checkbox label="舌纵"></el-checkbox>
                                <el-checkbox label="麻痹"></el-checkbox>
                            </el-checkbox-group>

                        </el-form-item>


                        <el-form-item prop="coatingNature">
                            <div>苔质</div>
                            <el-checkbox-group v-model="collectForm.coatingNature">
                                <el-checkbox label="薄"></el-checkbox>
                                <el-checkbox label="厚"></el-checkbox>
                                <el-checkbox label="润"></el-checkbox>
                                <el-checkbox label="滑"></el-checkbox>
                                <el-checkbox label="燥"></el-checkbox>
                                <el-checkbox label="糙"></el-checkbox>
                                <el-checkbox label="腻"></el-checkbox>
                                <el-checkbox label="腐"></el-checkbox>
                                <el-checkbox label="剥"></el-checkbox>
                                <el-checkbox label="少"></el-checkbox>
                                <el-checkbox label="无"></el-checkbox>
                            </el-checkbox-group>

                        </el-form-item>

                        <el-form-item prop="coatingColour">
                            <div>苔色</div>
                            <el-checkbox-group v-model="collectForm.coatingColour">
                                <el-checkbox label="白"></el-checkbox>
                                <el-checkbox label="黄"></el-checkbox>
                                <el-checkbox label="灰"></el-checkbox>
                                <el-checkbox label="黑"></el-checkbox>
                            </el-checkbox-group>

                        </el-form-item>

                        <el-form-item prop="tongueUnder">
                            <div>舌下络脉</div>
                            <el-checkbox-group v-model="collectForm.tongueUnder">
                                <el-checkbox label="正常"></el-checkbox>
                                <el-checkbox label="粗胀"></el-checkbox>
                                <el-checkbox label="青紫"></el-checkbox>
                                <el-checkbox label="其他"></el-checkbox>
                                <el-form-item prop="tongueUnderOther">
                                    <el-input v-model="collectForm.tongueUnderOther"  size="mini" placeholder="请在此补充其他舌下络脉情况" style="width: 200px" ></el-input>
                                </el-form-item>
                            </el-checkbox-group>

                        </el-form-item>

                    </el-descriptions-item>


                    <el-descriptions-item label="脉象">
                    <el-form-item prop="pulseCondition">
                        <el-checkbox-group v-model="collectForm.pulseCondition">
                            <el-checkbox label="浮"></el-checkbox>
                            <el-checkbox label="洪"></el-checkbox>
                            <el-checkbox label="濡"></el-checkbox>
                            <el-checkbox label="散"></el-checkbox>
                            <el-checkbox label="芤"></el-checkbox>
                            <el-checkbox label="革"></el-checkbox>
                            <el-checkbox label="沉"></el-checkbox>
                            <el-checkbox label="伏"></el-checkbox>
                            <el-checkbox label="牢"></el-checkbox>
                            <el-checkbox label="弱"></el-checkbox>
                            <el-checkbox label="迟"></el-checkbox>
                            <el-checkbox label="缓"></el-checkbox>
                            <el-checkbox label="涩"></el-checkbox>
                            <el-checkbox label="结"></el-checkbox>
                            <el-checkbox label="数"></el-checkbox>
                            <el-checkbox label="疾"></el-checkbox>
                            <el-checkbox label="促"></el-checkbox>
                            <el-checkbox label="动"></el-checkbox>
                            <el-checkbox label="虚"></el-checkbox>
                            <el-checkbox label="微"></el-checkbox>
                            <el-checkbox label="细"></el-checkbox>
                            <el-checkbox label="代"></el-checkbox>
                            <el-checkbox label="短"></el-checkbox>
                            <el-checkbox label="实"></el-checkbox>
                            <el-checkbox label="滑"></el-checkbox>
                            <el-checkbox label="弦"></el-checkbox>
                            <el-checkbox label="紧"></el-checkbox>
                            <el-checkbox label="长"></el-checkbox>
                            <el-checkbox label="大"></el-checkbox>
                        </el-checkbox-group>

                    </el-form-item>
                    </el-descriptions-item>



                    <el-descriptions-item label="中医诊断">
                        <el-form-item prop="disease">
                            <div>疾病：</div>
                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 2, maxRows: 4}"
                                    placeholder="请输入中医诊断疾病内容"
                                    v-model="collectForm.disease">
                            </el-input>

                        </el-form-item>

                        <el-form-item prop="syndromeType">
                            <div>证型：</div>
                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 2, maxRows: 4}"
                                    placeholder="请输入中医诊断证型内容"
                                    v-model="collectForm.syndromeType">
                            </el-input>

                        </el-form-item>
                    </el-descriptions-item>



                </el-descriptions>

                <el-descriptions style="margin-top:-5%" title="处方信息" direction="vertical" :column="1" border >
                    <el-descriptions-item label="治法">
                    <el-form-item prop="therapy">
                        <el-input
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 4}"
                                placeholder="请输入治法"
                                v-model="collectForm.therapy">
                        </el-input>


                    </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="方剂名称">
                        <el-form-item prop="prescriptionName">
                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 2, maxRows: 4}"
                                    placeholder="请输入方剂名称"
                                    v-model="collectForm.prescriptionName">
                            </el-input>

                        </el-form-item>
                    </el-descriptions-item>


                    <el-descriptions-item label="中药处方">
                        <el-form-item prop="prescription">
                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 5, maxRows: 10}"
                                    placeholder="请输入中药处方"
                                    v-model="collectForm.prescription">
                            </el-input>

                        </el-form-item>
                        <el-form-item prop="medicineNum">
                            <div>
                                <el-input-number v-model="collectForm.medicineNum"  :min="1" :max="999" ></el-input-number>  剂

                            </div>


                        </el-form-item>
                        <el-form-item prop="decoctingMethod">
                            <div>煎服法：</div>
                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 2, maxRows: 4}"
                                    placeholder="请输入煎服法"
                                    v-model="collectForm.decoctingMethod">
                            </el-input>
                        </el-form-item>

                    </el-descriptions-item>

                    <el-descriptions-item label="中成药处方">
                        <el-form-item prop="chinesePatentMedicine">
                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 5, maxRows: 10}"
                                    placeholder="请输入中成药处方"
                                    v-model="collectForm.chinesePatentMedicine">
                            </el-input>
                        </el-form-item>

                    </el-descriptions-item>


                    <el-descriptions-item label="针灸推拿">
                        <el-form-item prop="acupunctureAndMassage">
                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 5, maxRows: 10}"
                                    placeholder="请输入针灸推拿相关内容"
                                    v-model="collectForm.acupunctureAndMassage">
                            </el-input>
                        </el-form-item>

                    </el-descriptions-item>


                    <el-descriptions-item label="西药处方">
                        <el-form-item prop="westernMedicinePrescription">
                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 5, maxRows: 10}"
                                    placeholder="请输入西药处方"
                                    v-model="collectForm.westernMedicinePrescription">
                            </el-input>
                        </el-form-item>

                    </el-descriptions-item>


                    <el-descriptions-item label="医嘱">
                        <el-form-item prop="adviceForFood">
                            <div>饮食：</div>
                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 5, maxRows: 10}"
                                    placeholder="请输入饮食相关医嘱"
                                    v-model="collectForm.adviceForFood">
                            </el-input>
                        </el-form-item>

                        <el-form-item prop="adviceForDailyLife">
                            <div>起居：</div>
                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 5, maxRows: 10}"
                                    placeholder="请输入起居相关医嘱"
                                    v-model="collectForm.adviceForDailyLife">
                            </el-input>
                        </el-form-item>

                        <el-form-item prop="adviceForEmotion">
                            <div>情志：</div>
                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 5, maxRows: 10}"
                                    placeholder="请输入情志相关医嘱"
                                    v-model="collectForm.adviceForEmotion">
                            </el-input>
                        </el-form-item>

                        <el-form-item prop="adviceForOther">
                            <div>其他：</div>
                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 5, maxRows: 10}"
                                    placeholder="请输入其他医嘱"
                                    v-model="collectForm.adviceForOther">
                            </el-input>
                        </el-form-item>

                    </el-descriptions-item>


                    <el-descriptions-item label="必要的临床检查">
                        <div>胸部HRCT：</div>
                            <el-form-item  prop="hrctDate">

                               <div>检查日期：<el-date-picker type="date" placeholder="选择日期" v-model="collectForm.hrctDate" style="width: 50%;"></el-date-picker></div>
                            </el-form-item>
                        <el-form-item  prop="hrctStore">
                                <div>是否已留存：
                                    <el-radio-group v-model="collectForm.hrctStore">
                                        <el-radio label="是"></el-radio>
                                        <el-radio label="否"></el-radio>

                                    </el-radio-group>

                                </div>
                        </el-form-item>


                        <div>肺功能： </div>
                        <el-form-item  prop="lungFunctionDate">

                            <div>检查日期：<el-date-picker type="date" placeholder="选择日期" v-model="collectForm.lungFunctionDate" style="width: 50%;"></el-date-picker></div>
                        </el-form-item>
                        <el-form-item  prop="lungFunctionStore">
                            <div>是否已留存：
                                <el-radio-group v-model="collectForm.lungFunctionStore">
                                    <el-radio label="是"></el-radio>
                                    <el-radio label="否"></el-radio>

                                </el-radio-group>

                            </div>
                        </el-form-item>


                        <div>动脉血气分析： </div>
                        <el-form-item  prop="bloodGasAnalysisDate">

                            <div>检查日期：<el-date-picker type="date" placeholder="选择日期" v-model="collectForm.bloodGasAnalysisDate" style="width: 50%;"></el-date-picker></div>
                        </el-form-item>
                        <el-form-item  prop="bloodGasAnalysisStore">
                            <div>是否已留存：
                                <el-radio-group v-model="collectForm.bloodGasAnalysisStore">
                                    <el-radio label="是"></el-radio>
                                    <el-radio label="否"></el-radio>

                                </el-radio-group>

                            </div>
                        </el-form-item>



                        <div>6分钟步行试验： </div>
                        <el-form-item  prop="walkTestDate">

                            <div>检查日期：<el-date-picker type="date" placeholder="选择日期" v-model="collectForm.walkTestDate" style="width: 50%;"></el-date-picker></div>
                        </el-form-item>
                        <el-form-item  prop="walkTestStore">
                            <div>是否已留存：
                                <el-radio-group v-model="collectForm.walkTestStore">
                                    <el-radio label="是"></el-radio>
                                    <el-radio label="否"></el-radio>

                                </el-radio-group>

                            </div>
                        </el-form-item>



                        <div>胸部X线： </div>
                        <el-form-item  prop="rayDate">

                            <div>检查日期：<el-date-picker type="date" placeholder="选择日期" v-model="collectForm.rayDate" style="width: 50%;"></el-date-picker></div>
                        </el-form-item>
                        <el-form-item  prop="rayStore">
                            <div>是否已留存：
                                <el-radio-group v-model="collectForm.rayStore">
                                    <el-radio label="是"></el-radio>
                                    <el-radio label="否"></el-radio>

                                </el-radio-group>

                            </div>
                        </el-form-item>


                        <div>心脏彩超： </div>
                        <el-form-item  prop="colourSonographyDate">

                            <div>检查日期：<el-date-picker type="date" placeholder="选择日期" v-model="collectForm.colourSonographyDate" style="width: 50%;"></el-date-picker></div>
                        </el-form-item>
                        <el-form-item  prop="colourSonographyStore">
                            <div>是否已留存：
                                <el-radio-group v-model="collectForm.colourSonographyStore">
                                    <el-radio label="是"></el-radio>
                                    <el-radio label="否"></el-radio>

                                </el-radio-group>

                            </div>
                        </el-form-item>



                        <div>血常规： </div>
                        <el-form-item  prop="routineBloodTestDate">

                            <div>检查日期：<el-date-picker type="date" placeholder="选择日期" v-model="collectForm.routineBloodTestDate" style="width: 50%;"></el-date-picker></div>
                        </el-form-item>
                        <el-form-item  prop="routineBloodTestStore">
                            <div>是否已留存：
                                <el-radio-group v-model="collectForm.routineBloodTestStore">
                                    <el-radio label="是"></el-radio>
                                    <el-radio label="否"></el-radio>

                                </el-radio-group>

                            </div>
                        </el-form-item>




                        <div>血生化检查： </div>
                        <el-form-item  prop="bloodExaminationDate">

                            <div>检查日期：<el-date-picker type="date" placeholder="选择日期" v-model="collectForm.bloodExaminationDate" style="width: 50%;"></el-date-picker></div>
                        </el-form-item>
                        <el-form-item  prop="bloodExaminationStore">
                            <div>是否已留存：
                                <el-radio-group v-model="collectForm.bloodExaminationStore">
                                    <el-radio label="是"></el-radio>
                                    <el-radio label="否"></el-radio>

                                </el-radio-group>

                            </div>
                        </el-form-item>


                        <div>凝血功能和D二聚体： </div>
                        <el-form-item  prop="coagulationFunctionDate">

                            <div>检查日期：<el-date-picker type="date" placeholder="选择日期" v-model="collectForm.coagulationFunctionDate" style="width: 50%;"></el-date-picker></div>
                        </el-form-item>
                        <el-form-item  prop="coagulationFunctionStore">
                            <div>是否已留存：
                                <el-radio-group v-model="collectForm.coagulationFunctionStore">
                                    <el-radio label="是"></el-radio>
                                    <el-radio label="否"></el-radio>

                                </el-radio-group>

                            </div>
                        </el-form-item>



                    </el-descriptions-item>


                    <el-descriptions-item label="院外合并治疗情况(西药)">


                        <el-form-item prop="westernMedicineHas">

                                <div>西药：
                                <el-radio-group v-model="collectForm.westernMedicineHas">
                                    <el-radio label="有"></el-radio>
                                    <el-radio label="无"></el-radio>
                                </el-radio-group>
                                </div>

                        </el-form-item>

                        <el-form-item prop="westernMedicineMain">

                                <div>如有，记录主要药物名称：
                                <el-checkbox-group v-model="collectForm.westernMedicineMain">
                                    <el-checkbox label="吡非尼酮/尼达尼布"></el-checkbox>
                                    <el-checkbox label="N-乙酰半胱氨酸"></el-checkbox>
                                </el-checkbox-group>
                                </div>
                        </el-form-item>

                            <el-form-item prop="westernMedicineMainOther">
                            其他：
                            <el-input v-model="collectForm.westernMedicineMainOther"  size="mini" placeholder="请在此补充其他西药" style="width: 200px" ></el-input>
                            </el-form-item>


                    </el-descriptions-item>


                    <el-descriptions-item label="院外合并治疗情况(中成药)">


                        <el-form-item prop="chinesePatentMedicineHas">

                            <div>中成药：
                                <el-radio-group v-model="collectForm.chinesePatentMedicineHas">
                                    <el-radio label="有"></el-radio>
                                    <el-radio label="无"></el-radio>
                                </el-radio-group>
                            </div>

                        </el-form-item>


                        <el-form-item prop="chinesePatentMedicineMain">
                            如有，记录主要中成药名称：
                            <el-input v-model="collectForm.chinesePatentMedicineMain"  size="mini" placeholder="请在此补充主要中成药名称" style="width: 500px" ></el-input>
                        </el-form-item>


                    </el-descriptions-item>


                    <el-descriptions-item label="院外合并治疗情况(其他疗法)">


                        <el-form-item prop="therapyHas">

                            <div>其他疗法：
                                <el-radio-group v-model="collectForm.therapyHas">
                                    <el-radio label="有"></el-radio>
                                    <el-radio label="无"></el-radio>
                                </el-radio-group>
                            </div>

                        </el-form-item>

                        <el-form-item prop="therapyMain">

                            <div>如有，记录具体疗法：
                                <el-checkbox-group v-model="collectForm.therapyMain">
                                    <el-checkbox label="氧疗"></el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </el-form-item>

                        <el-form-item prop="therapyMainOther">
                            其他：
                            <el-input v-model="collectForm.therapyMainOther"  size="mini" placeholder="请在此补充其他疗法" style="width: 200px" ></el-input>
                        </el-form-item>


                    </el-descriptions-item>










                </el-descriptions>


                <el-descriptions  title="病例资料拓展（特色模块）" direction="vertical" :column="1" border >

                    <el-descriptions-item label="病例资料拓展">
                        <el-form-item prop="dataExpansion">
                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 25, maxRows: 999}"
                                    placeholder="请在此补充病例资料"
                                    v-model="collectForm.dataExpansion">
                            </el-input>

                        </el-form-item>
                    </el-descriptions-item>
                </el-descriptions>


                <span style="justify-content: center;display: flex"><h3>疗效评价</h3></span>

                <el-descriptions  title="自评医疗成效问卷（MYMOP）" direction="vertical" :column="1" border >

                    <el-descriptions-item label="1.请选出一或两项最令你困扰的症状（可以身体上或精神上的），写在下方输入框中。
并把适当的数字勾上以表示该症状在过去一星期的情况有多坏（0代表情况算是最好，6代表情况算是最坏）">
                        <el-form-item prop="mymopOnePointOne">
                           <div>症状一：</div>
                            <el-input placeholder="请在此填写症状一" v-model="collectForm.mymopOnePointOne" style="width: 20%">
                            </el-input>

                            <el-form-item prop="mymopOnePointOneScore">
                                <div>情况算是最好
                                <el-radio-group v-model="collectForm.mymopOnePointOneScore">
                                    <el-radio label="1" ></el-radio>
                                    <el-radio label="2" ></el-radio>
                                    <el-radio label="3"></el-radio>
                                    <el-radio label="4"></el-radio>
                                    <el-radio  label="5"  ></el-radio>
                                    <el-radio  label="6"  ></el-radio>
                                </el-radio-group>
                                情况算是最坏
                                </div>
                            </el-form-item>
                        </el-form-item>


                        <el-form-item prop="mymopOnePointTwo">
                            <div>症状二：</div>
                            <el-input placeholder="请在此填写症状二" v-model="collectForm.mymopOnePointTwo" style="width: 20%">
                            </el-input>

                            <el-form-item prop="mymopOnePointTwoScore">
                                <div>情况算是最好
                                    <el-radio-group v-model="collectForm.mymopOnePointTwoScore">
                                        <el-radio label="1" ></el-radio>
                                        <el-radio label="2" ></el-radio>
                                        <el-radio label="3"></el-radio>
                                        <el-radio label="4"></el-radio>
                                        <el-radio  label="5"  ></el-radio>
                                        <el-radio  label="6"  ></el-radio>
                                    </el-radio-group>
                                    情况算是最坏
                                </div>
                            </el-form-item>
                        </el-form-item>
                    </el-descriptions-item>


                    <el-descriptions-item label="2.请写出一项对你而言是重要，却因为这些症状而受影响或甚至不能进行的活动（可
以是身体上的、社交上的、或精神上的活动；例如工作、运动、或其他娱乐等等），并把适当的数字勾上以表受影响的情况有多坏。">
                        <el-form-item prop="mymopTwo">
                            <div>活动：</div>
                            <el-input placeholder="请在此填写活动" v-model="collectForm.mymopTwo" style="width: 20%">
                            </el-input>

                            <el-form-item prop="mymopTwoScore">
                                <div>情况算是最好
                                    <el-radio-group v-model="collectForm.mymopTwoScore">
                                        <el-radio label="1" ></el-radio>
                                        <el-radio label="2" ></el-radio>
                                        <el-radio label="3"></el-radio>
                                        <el-radio label="4"></el-radio>
                                        <el-radio  label="5"  ></el-radio>
                                        <el-radio  label="6"  ></el-radio>
                                    </el-radio-group>
                                    情况算是最坏
                                </div>
                            </el-form-item>
                        </el-form-item>
                    </el-descriptions-item>


                    <el-descriptions-item label="3.在过去一星期，你对自己身心状况的整体感觉如何？">



                            <el-form-item prop="mymopThree">
                                <div>情况算是最好
                                    <el-radio-group v-model="collectForm.mymopThree">
                                        <el-radio label="1" ></el-radio>
                                        <el-radio label="2" ></el-radio>
                                        <el-radio label="3"></el-radio>
                                        <el-radio label="4"></el-radio>
                                        <el-radio  label="5"  ></el-radio>
                                        <el-radio  label="6"  ></el-radio>
                                    </el-radio-group>
                                    情况算是最坏
                                </div>
                            </el-form-item>

                    </el-descriptions-item>

                    <el-descriptions-item label="4.你上述的 症状一出现了多久？（不论是连续出现，或是断续地出现）">



                        <el-form-item prop="mymopFour">
                            <div>
                                <el-radio-group v-model="collectForm.mymopFour">
                                    <el-radio label="0-4星期" ></el-radio>
                                    <el-radio label="4-12星期" ></el-radio>
                                    <el-radio label="3个月至1年"></el-radio>
                                    <el-radio label="1-5年"></el-radio>
                                    <el-radio  label="超过5年"  ></el-radio>
                                </el-radio-group>

                            </div>
                        </el-form-item>

                    </el-descriptions-item>


                    <el-descriptions-item label="5.你有没有使用任何药物来治疗症状一？">



                        <el-form-item prop="mymopFive">
                            <div>
                                <el-radio-group v-model="collectForm.mymopFive">
                                    <el-radio label="有" ></el-radio>
                                    <el-radio label="没有（跳至第8题）" ></el-radio>

                                </el-radio-group>

                            </div>
                        </el-form-item>

                    </el-descriptions-item>

                    <el-descriptions-item label="6.请写出该药物的名称及每天／每周使用量。">



                        <el-form-item prop="mymopSixPointOne">
                            <div>药物名称：
                                <el-input placeholder="请在此填写药物名称" v-model="collectForm.mymopSixPointOne" style="width: 20%">
                                    </el-input>
                            </div>

                        </el-form-item>

                        <el-form-item prop="mymopSixPointTwo">
                            <div>使用量：
                                <el-input placeholder="请在此填写使用量" v-model="collectForm.mymopSixPointTwo" style="width: 20%">
                                </el-input>
                            </div>

                        </el-form-item>



                    </el-descriptions-item>



                    <el-descriptions-item label="7.你认为减少使用这些药物有多重要？">



                        <el-form-item prop="mymopSeven">
                            <div>
                                <el-radio-group v-model="collectForm.mymopSeven">
                                    <el-radio label="不重要" ></el-radio>
                                    <el-radio label="少许重要" ></el-radio>
                                    <el-radio label="非常重要" ></el-radio>
                                    <el-radio label="不适用" ></el-radio>

                                </el-radio-group>

                            </div>
                        </el-form-item>

                    </el-descriptions-item>



                    <el-descriptions-item label="8.对症状一来说，你认为不使用任何药物有多重要？">



                        <el-form-item prop="mymopEight">
                            <div>
                                <el-radio-group v-model="collectForm.mymopEight">
                                    <el-radio label="不重要" ></el-radio>
                                    <el-radio label="少许重要" ></el-radio>
                                    <el-radio label="非常重要" ></el-radio>
                                    <el-radio label="不适用" ></el-radio>

                                </el-radio-group>

                            </div>
                        </el-form-item>

                    </el-descriptions-item>







                </el-descriptions>

                <el-descriptions  title="圣乔治呼吸调查问卷" direction="vertical" :column="1" border >
                    <el-descriptions-item label="这份问卷是用来帮助我们了解你的呼吸问题是如何正在困扰你的，以及它是如何影响你的生活的。我们通过它发现疾病在哪一方面对你的影响最大,但这不是医生或护士所认为的那些问题。
                        请仔细阅读下列指导性语句，若有不明白之处请提问。不要花费太长的时间来决定你的答案。在完成余下的问卷前，请选择一个能体现你目前健康状况的描述：">
                    <div></div>
                    <el-form-item prop="sgrqDescription">

                            <el-radio-group v-model="collectForm.sgrqDescription">
                                <el-radio label="很好" ></el-radio>
                                <el-radio label="好" ></el-radio>
                                <el-radio label="一般" ></el-radio>
                                <el-radio label="不好" ></el-radio>
                                <el-radio label="很差" ></el-radio>

                            </el-radio-group>


                    </el-form-item>
                    </el-descriptions-item>



                    <el-descriptions-item label="第一部分：关于过去6个月内您的呼吸困难问题，每个问题只选择一个答案：">
                        <div>1．在过去6个月内，咳嗽情况：
                        <el-form-item prop="sgrqPartOnePointOne">

                            <el-radio-group v-model="collectForm.sgrqPartOnePointOne">
                                <el-radio label="1周中绝大部分时间" ></el-radio>
                                <el-radio label="1周中有几天" ></el-radio>
                                <el-radio label="l月中有几天" ></el-radio>
                                <el-radio label="仅在肺部感染时" ></el-radio>
                                <el-radio label="没有" ></el-radio>

                            </el-radio-group>


                        </el-form-item>
                        </div>

                        <div>2．在过去6个月内，咳痰情况：
                            <el-form-item prop="sgrqPartOnePointTwo">

                                <el-radio-group v-model="collectForm.sgrqPartOnePointTwo">
                                    <el-radio label="1周中绝大部分时间" ></el-radio>
                                    <el-radio label="1周中有几天" ></el-radio>
                                    <el-radio label="l月中有几天" ></el-radio>
                                    <el-radio label="仅在肺部感染时" ></el-radio>
                                    <el-radio label="没有" ></el-radio>

                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>3．在过去6个月内，呼吸急促的发生情况：
                            <el-form-item prop="sgrqPartOnePointThree">

                                <el-radio-group v-model="collectForm.sgrqPartOnePointThree">
                                    <el-radio label="1周中绝大部分时间" ></el-radio>
                                    <el-radio label="1周中有几天" ></el-radio>
                                    <el-radio label="l月中有几天" ></el-radio>
                                    <el-radio label="仅在肺部感染时" ></el-radio>
                                    <el-radio label="没有" ></el-radio>

                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>4．在过去6个月内，气喘发作情况：
                            <el-form-item prop="sgrqPartOnePointFour">

                                <el-radio-group v-model="collectForm.sgrqPartOnePointFour">
                                    <el-radio label="1周中绝大部分时间" ></el-radio>
                                    <el-radio label="1周中有几天" ></el-radio>
                                    <el-radio label="l月中有几天" ></el-radio>
                                    <el-radio label="仅在肺部感染时" ></el-radio>
                                    <el-radio label="没有" ></el-radio>

                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>5．在过去6个月内，我曾出现过几次严重的或极不舒服的呼吸困难：
                            <el-form-item prop="sgrqPartOnePointFive">

                                <el-radio-group v-model="collectForm.sgrqPartOnePointFive">
                                    <el-radio label="超过3次" ></el-radio>
                                    <el-radio label="3次发作" ></el-radio>
                                    <el-radio label="2次发作" ></el-radio>
                                    <el-radio label="l次发作" ></el-radio>
                                    <el-radio label="没有发作" ></el-radio>

                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>6．在过去6个月内，平均每周有几天呼吸是正常的（没有呼吸困难）
                            <el-form-item prop="sgrqPartOnePointSix">

                                <el-radio-group v-model="collectForm.sgrqPartOnePointSix">
                                    <el-radio label="没有一天正常" ></el-radio>
                                    <el-radio label="l到2天正常" ></el-radio>
                                    <el-radio label="3到4天正常" ></el-radio>
                                    <el-radio label="几乎每天都正常" ></el-radio>
                                    <el-radio label="每一天都正常" ></el-radio>

                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>7．如果有喘息，是否在清晨起来时加重？
                            <el-form-item prop="sgrqPartOnePointSeven">

                                <el-radio-group v-model="collectForm.sgrqPartOnePointSeven">
                                    <el-radio label="否" ></el-radio>
                                    <el-radio label="是" ></el-radio>

                                </el-radio-group>


                            </el-form-item>
                        </div>

                    </el-descriptions-item>



                    <el-descriptions-item label="第二部分：（一）您如何描述您目前的呼吸困难？ ">
                        <div>1.您如何评价呼吸困难对您生活的影响？
                            <el-form-item prop="sgrqPartTwoOnePointOne">

                                <el-radio-group v-model="collectForm.sgrqPartTwoOnePointOne">
                                    <el-radio label="呼吸困难严重影响了我的全部生活" ></el-radio><br>
                                    <el-radio label="呼吸困难影响了我的全部生活" ></el-radio><br>
                                    <el-radio label="呼吸困难影响了我的部分生活" ></el-radio><br>
                                    <el-radio label="呼吸困难没有影响我的生活" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>2．关于呼吸对工作的影响，请从中选择一项
                            <el-form-item prop="sgrqPartTwoOnePointTwo">

                                <el-radio-group v-model="collectForm.sgrqPartTwoOnePointTwo">
                                    <el-radio label="我的呼吸问题使我完全中止工作" ></el-radio><br>
                                    <el-radio label="我的呼吸问题影响我的工作或使我改变工作" ></el-radio><br>
                                    <el-radio label="我的呼吸问题不影响我的工作" ></el-radio><br>
                                    <el-radio label="我没有工作" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                    </el-descriptions-item>


                    <el-descriptions-item label="第二部分：（二）下面问题是关于这些天来哪些活动经常让您觉得喘不过气来：对于每一个问题根据您的实际情况，选择“是”或“否” ">
                        <div>1．静坐或静躺
                            <el-form-item prop="sgrqPartTwoTwoPointOne">

                                <el-radio-group v-model="collectForm.sgrqPartTwoTwoPointOne">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>2．洗漱或穿衣
                            <el-form-item prop="sgrqPartTwoTwoPointTwo">

                                <el-radio-group v-model="collectForm.sgrqPartTwoTwoPointTwo">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>3．在室内走动
                            <el-form-item prop="sgrqPartTwoTwoPointThree">

                                <el-radio-group v-model="collectForm.sgrqPartTwoTwoPointThree">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>4．在户外平台上走动
                            <el-form-item prop="sgrqPartTwoTwoPointFour">

                                <el-radio-group v-model="collectForm.sgrqPartTwoTwoPointFour">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>5．上一层楼
                            <el-form-item prop="sgrqPartTwoTwoPointFive">

                                <el-radio-group v-model="collectForm.sgrqPartTwoTwoPointFive">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>6．爬坡
                            <el-form-item prop="sgrqPartTwoTwoPointSix">

                                <el-radio-group v-model="collectForm.sgrqPartTwoTwoPointSix">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>7. 运动性体育活动或运动性游戏
                            <el-form-item prop="sgrqPartTwoTwoPointSeven">

                                <el-radio-group v-model="collectForm.sgrqPartTwoTwoPointSeven">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>


                    </el-descriptions-item>

                    <el-descriptions-item label="第二部分：（三）下面问题是关于这些天来您的咳嗽及气喘问题：对于每一个问题根据您的实际情况，选择“是”或“否”">
                        <div>1．咳嗽使我感到痛苦
                            <el-form-item prop="sgrqPartTwoThreePointOne">

                                <el-radio-group v-model="collectForm.sgrqPartTwoThreePointOne">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>2．咳嗽时我感到疲倦
                            <el-form-item prop="sgrqPartTwoThreePointTwo">

                                <el-radio-group v-model="collectForm.sgrqPartTwoThreePointTwo">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>3．谈话时，我会感到喘不过气来
                            <el-form-item prop="sgrqPartTwoThreePointThree">

                                <el-radio-group v-model="collectForm.sgrqPartTwoThreePointThree">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>4．弯腰时，我觉得喘不过气来
                            <el-form-item prop="sgrqPartTwoThreePointFour">

                                <el-radio-group v-model="collectForm.sgrqPartTwoThreePointFour">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>5．咳嗽或呼吸困难影响我的睡眠
                            <el-form-item prop="sgrqPartTwoThreePointFive">

                                <el-radio-group v-model="collectForm.sgrqPartTwoThreePointFive">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>6．我经常疲惫不堪
                            <el-form-item prop="sgrqPartTwoThreePointSix">

                                <el-radio-group v-model="collectForm.sgrqPartTwoThreePointSix">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>




                    </el-descriptions-item>

                    <el-descriptions-item label="第二部分：（四）下面问题是关于这些天来您的呼吸困难可能对您的其他方面的影响，对于每一个问题根据您的实际情况，选择“是”或“否”">
                        <div>1．咳嗽或呼吸困难使我心情不愉快
                            <el-form-item prop="sgrqPartTwoFourPointOne">

                                <el-radio-group v-model="collectForm.sgrqPartTwoFourPointOne">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>2．我的呼吸问题让我的家人担心
                            <el-form-item prop="sgrqPartTwoFourPointTwo">

                                <el-radio-group v-model="collectForm.sgrqPartTwoFourPointTwo">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>3．当喘不过气来时，我感到害怕或惊恐
                            <el-form-item prop="sgrqPartTwoFourPointThree">

                                <el-radio-group v-model="collectForm.sgrqPartTwoFourPointThree">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>4．我觉得我的呼吸问题很严重
                            <el-form-item prop="sgrqPartTwoFourPointFour">

                                <el-radio-group v-model="collectForm.sgrqPartTwoFourPointFour">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>5．我觉得我的呼吸问题不能好转
                            <el-form-item prop="sgrqPartTwoFourPointFive">

                                <el-radio-group v-model="collectForm.sgrqPartTwoFourPointFive">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>6．我的呼吸问题使我变得虚弱、活动不便
                            <el-form-item prop="sgrqPartTwoFourPointSix">

                                <el-radio-group v-model="collectForm.sgrqPartTwoFourPointSix">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>7．体育运动对我来说是不安全的
                            <el-form-item prop="sgrqPartTwoFourPointSeven">

                                <el-radio-group v-model="collectForm.sgrqPartTwoFourPointSeven">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>8．做任何事情我都很吃力
                            <el-form-item prop="sgrqPartTwoFourPointEight">

                                <el-radio-group v-model="collectForm.sgrqPartTwoFourPointEight">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>




                    </el-descriptions-item>


                    <el-descriptions-item label="第二部分：（五）下列问题是关于您的治疗问题，请根据您的实际情况，选择“是”或“否”">
                        <div>我接受过治疗
                            <el-form-item prop="sgrqPartTwoFivePoint">

                                <el-radio-group v-model="collectForm.sgrqPartTwoFivePoint">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>
                        如果接受过治疗，对于下面每一个问题，请根据您的实际情况，选择“是”或“否”
                        <div>1．治疗对我来说没有多大帮助
                            <el-form-item prop="sgrqPartTwoFivePointOne">

                                <el-radio-group v-model="collectForm.sgrqPartTwoFivePointOne">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>2．在他人面前用药让我感到难堪
                            <el-form-item prop="sgrqPartTwoFivePointTwo">

                                <el-radio-group v-model="collectForm.sgrqPartTwoFivePointTwo">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>3．治疗引起了不良的药物副作用
                            <el-form-item prop="sgrqPartTwoFivePointThree">

                                <el-radio-group v-model="collectForm.sgrqPartTwoFivePointThree">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>4．治疗严重干扰了我的生活
                            <el-form-item prop="sgrqPartTwoFivePointFour">

                                <el-radio-group v-model="collectForm.sgrqPartTwoFivePointFour">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>



                    </el-descriptions-item>


                    <el-descriptions-item label="第二部分：（六）下列问题是关于您的呼吸困难可能如何影响您的活动，对于每一个问题，请根据您的实际情况，选择“是”或“否”">
                        <div>1．我洗脸刷牙或穿衣时，感到费力
                            <el-form-item prop="sgrqPartTwoSixPointOne">

                                <el-radio-group v-model="collectForm.sgrqPartTwoSixPointOne">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>2．我不能洗澡或淋浴，或需要花很长的时间
                            <el-form-item prop="sgrqPartTwoSixPointTwo">

                                <el-radio-group v-model="collectForm.sgrqPartTwoSixPointTwo">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>3．我走得比别人慢，或常常停下来休息
                            <el-form-item prop="sgrqPartTwoSixPointThree">

                                <el-radio-group v-model="collectForm.sgrqPartTwoSixPointThree">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>4．我做家务事非常慢，或常常停下来休息
                            <el-form-item prop="sgrqPartTwoSixPointFour">

                                <el-radio-group v-model="collectForm.sgrqPartTwoSixPointFour">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>5．上一层楼时，我得慢慢走或停下来休息
                            <el-form-item prop="sgrqPartTwoSixPointFive">

                                <el-radio-group v-model="collectForm.sgrqPartTwoSixPointFive">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>6．如果赶时间或快走，我不得不休息或放慢速度
                            <el-form-item prop="sgrqPartTwoSixPointSix">

                                <el-radio-group v-model="collectForm.sgrqPartTwoSixPointSix">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>7．呼吸困难使我在进行诸如上坡、提东西上楼、在花园中除草、跳舞、练气功或做操等活动时感到困难
                            <el-form-item prop="sgrqPartTwoSixPointSeven">

                                <el-radio-group v-model="collectForm.sgrqPartTwoSixPointSeven">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>8．呼吸问题使我在进行诸如搬运重物、在花园中挖土、铲雪、慢跑或快走（8公里/小时）、舞剑或游泳时感到困难
                            <el-form-item prop="sgrqPartTwoSixPointEight">

                                <el-radio-group v-model="collectForm.sgrqPartTwoSixPointEight">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>9．呼吸问题使我在进行诸如重体力活、跑步、骑自行车、快速游泳、进行剧烈的体育运动时感到困难
                            <el-form-item prop="sgrqPartTwoSixPointNine">

                                <el-radio-group v-model="collectForm.sgrqPartTwoSixPointNine">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>




                    </el-descriptions-item>


                    <el-descriptions-item label="第二部分：（七）下列问题是您的呼吸问题如何影响您，对于每一个问题，请根据您的实际情况，选择“是”或“否”">
                        <div>1．我不能进行体育活动或运动性活动
                            <el-form-item prop="sgrqPartTwoSevenPointOne">

                                <el-radio-group v-model="collectForm.sgrqPartTwoSevenPointOne">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>2．我不能外出娱乐或消遣
                            <el-form-item prop="sgrqPartTwoSevenPointTwo">

                                <el-radio-group v-model="collectForm.sgrqPartTwoSevenPointTwo">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>3．我不能外出购物
                            <el-form-item prop="sgrqPartTwoSevenPointThree">

                                <el-radio-group v-model="collectForm.sgrqPartTwoSevenPointThree">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>4．我不能做家务
                            <el-form-item prop="sgrqPartTwoSevenPointFour">

                                <el-radio-group v-model="collectForm.sgrqPartTwoSevenPointFour">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>5．我不能走得离床或椅子太远
                            <el-form-item prop="sgrqPartTwoSevenPointFive">

                                <el-radio-group v-model="collectForm.sgrqPartTwoSevenPointFive">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>






                    </el-descriptions-item>


                    <el-descriptions-item label="下面是一些由于您的呼吸问题无法进行的其他活动项目，请您根据实际情况选择“是”或“否”。">
                        <div>1．散步或遛狗
                            <el-form-item prop="sgrqPartTwoEightPointOne">

                                <el-radio-group v-model="collectForm.sgrqPartTwoEightPointOne">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>2．在家干活
                            <el-form-item prop="sgrqPartTwoEightPointTwo">

                                <el-radio-group v-model="collectForm.sgrqPartTwoEightPointTwo">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>3．性生活
                            <el-form-item prop="sgrqPartTwoEightPointThree">

                                <el-radio-group v-model="collectForm.sgrqPartTwoEightPointThree">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>4．上商场、菜市场或进行娱乐活动
                            <el-form-item prop="sgrqPartTwoEightPointFour">

                                <el-radio-group v-model="collectForm.sgrqPartTwoEightPointFour">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>

                        <div>5．在天气不好时外出或进入有烟味的房间
                            <el-form-item prop="sgrqPartTwoEightPointFive">

                                <el-radio-group v-model="collectForm.sgrqPartTwoEightPointFive">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>


                        <div>6．探亲访友或与孩子玩耍
                            <el-form-item prop="sgrqPartTwoEightPointSix">

                                <el-radio-group v-model="collectForm.sgrqPartTwoEightPointSix">
                                    <el-radio label="是" ></el-radio>
                                    <el-radio label="否" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>






                    </el-descriptions-item>

                    <el-descriptions-item label="现在请您选择一项最能反映您的呼吸问题对您的影响的选项">

                            <el-form-item prop="sgrqPartTwoNinePointOne">

                                <el-radio-group v-model="collectForm.sgrqPartTwoNinePointOne">
                                    <el-radio label="影响所有我想做的事情" ></el-radio>
                                    <el-radio label="影响我做的大多数事情" ></el-radio>
                                    <el-radio label="影响我想做的1－2件事情" ></el-radio>
                                    <el-radio label="不影响我想做的任何事情" ></el-radio>
                                </el-radio-group>


                            </el-form-item>



                    </el-descriptions-item>


                    <el-descriptions-item label="第三部分 （MRC呼吸困难分级）">

                        <div>据以上调查，请根据您的实际情况选择一项最能反应您的呼吸困难情况的选项
                            <el-form-item prop="sgrqPartThree">

                                <el-radio-group v-model="collectForm.sgrqPartThree">
                                    <el-radio label="除剧烈运外，一般不感到呼吸困难" ></el-radio><br>
                                    <el-radio label="平地急行时气短或上坡时气短" ></el-radio><br>
                                    <el-radio label="因气短平地行走时慢于同龄人以自己的步速平地行走时必须停下来喘气" ></el-radio><br>
                                    <el-radio label="平地行走100米或数分钟即有气短" ></el-radio><br>
                                    <el-radio label="因气短而不能离开房间" ></el-radio>
                                </el-radio-group>


                            </el-form-item>
                        </div>




                    </el-descriptions-item>




                </el-descriptions>


                <el-descriptions  title="呼吸困难量表评分（mMRC）" :column="1" :size="size" border>

                    <el-descriptions-item>
                        <template slot="label">
                            分级
                        </template>
                        临床表现
                    </el-descriptions-item>

                    <el-descriptions-item>
                        <template slot="label">
                            0级
                        </template>
                        只在剧烈运动时才出现呼吸困难
                    </el-descriptions-item>

                    <el-descriptions-item>
                        <template slot="label">
                            1级
                        </template>
                        在走路较急或爬缓坡时会出现呼吸困难
                    </el-descriptions-item>

                    <el-descriptions-item>
                        <template slot="label">
                            2级
                        </template>
                        按平时走路方式走时会出现气短，必须停下来休息，走路比同龄人慢
                    </el-descriptions-item>

                    <el-descriptions-item>
                        <template slot="label">
                            3级
                        </template>
                        步行100码（91.44米）或几分钟后需要停下来休息
                    </el-descriptions-item>

                    <el-descriptions-item>
                        <template slot="label">
                            4级
                        </template>
                        因呼吸困难严重不能离家，或穿脱衣时出现呼吸困难
                    </el-descriptions-item>





                </el-descriptions>

                <el-form-item prop="level" style="margin: 2%">
                    分级：
                    <el-select v-model="collectForm.level"  clearable placeholder="请选择分级">
                        <el-option label="0级" value="0级"></el-option>
                        <el-option label="1级" value="1级"></el-option>
                        <el-option label="2级" value="2级"></el-option>
                        <el-option label="3级" value="3级"></el-option>
                        <el-option label="4级" value="4级"></el-option>

                    </el-select>
                </el-form-item>



                <el-form-item style="margin-top: 5%">
                    <el-button type="primary" @click="saveCollectForm">提交</el-button>
                    <el-button @click="resetFormForCollect('collectForm')">重置</el-button>
                </el-form-item>
            </el-form>

        </el-dialog>

        <!--面相采集对话框-->
        <el-dialog
                :visible.sync="dialogVisible3"
                width="70%"
        >
        <template>
            <div class="camera_outer">

                <video
                        id="videoCamera"
                        :width="videoWidth"
                        :height="videoHeight"
                        autoplay
                ></video>
                <canvas
                        style="display: none"
                        id="canvasCamera"
                        :width="videoWidth"
                        :height="videoHeight"
                ></canvas>

                <div v-if="tongueImgSrc" class="img_bg_camera">
                    采集结果：
                    <img :src="tongueImgSrc" alt="" class="tx_img" />
                    <div><el-button  @click="tongueImgSubimt()">提交</el-button></div>

                </div>
                <div style="margin-left: 5%">
                    <el-button @click="getCompetence()">打开摄像头</el-button>
                    <el-button @click="stopNavigator()">关闭摄像头</el-button>
                    <el-button  @click="setImage()">拍照</el-button>

                </div>



            </div>
        </template>
            </el-dialog>

        <!--历史就诊-->
        <el-dialog
                :visible.sync="dialogVisible4"
                width="90%"
        >

            <div v-for="(item, index) in visitHistory" :key="index" @click="getHistoryRow(item)">
                <el-collapse  accordion>
                    <el-collapse-item >
                        <template slot="title">
                            <h2>第{{item.sequence}}次就诊</h2><i class="header-icon el-icon-info"></i>
                            <h3 v-if="item.status == 1" style="margin-left: 5%"> 采集进行中</h3>
                            <h3 v-if="item.status == 2" style="margin-left: 5%"> 采集已完成</h3>
                            <h3 style="margin-left: 5%"> 最后采集时间：{{item.collectTime}}</h3>
                            <el-popover
                                    placement="right"
                                    width="400"
                                    height="400"
                                    trigger="click"
                                    style="margin-left: 5%"
                            >
                                        <el-input
                                                type="textarea"
                                                :autosize="{ minRows: 5, maxRows: 5}"
                                                placeholder="暂无"
                                                v-model="item.experience"
                                                >
                                        </el-input>
                                <el-button   @click="submitExperience(item.experience,item.id)">提交</el-button>
                            <el-button  slot="reference" @click.stop>传承弟子心得</el-button>
                            </el-popover>

                            <el-popover
                                    placement="top"
                                    width="400"
                                    height="400"
                                    trigger="click"
                                    style="margin-left: 5%"
                            >
                               <div>
                                   <el-image
                                           style="width: 90%; height: 90%"
                                           :src="item.imageUrlOne">
                                       <div slot="error">
                                           暂无图像
                                       </div>
                                   </el-image>
                               </div>
                                <el-button  slot="reference" @click.stop>舌象</el-button>
                            </el-popover>

                            <el-popover
                                    placement="top"
                                    width="400"
                                    height="400"
                                    trigger="click"
                                    style="margin-left: 5%"
                            >
                                <el-button  id="record-btn" style ="margin-right:10px" >录音</el-button>
                                <audio controls id="audio-player" ></audio>
                                <el-button  @click="submitSoundRecording(item.id,item.soundRecordingUrl) " style ="margin-top:10px" >提交</el-button>
                                <el-button  slot="reference" @click.stop="start(item)">名老中医点评录音</el-button>
                            </el-popover>
                        </template>
                        <el-form :model="item.survey"  ref="item.survey"  label-width="100px" >
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
                                                v-model="item.survey.main">
                                        </el-input>
                                    </el-form-item>




                                </el-descriptions-item>

                                <el-descriptions-item label="现病史">
                                    <el-form-item prop="present">
                                        <el-input
                                                type="textarea"
                                                :autosize="{ minRows: 2, maxRows: 4}"
                                                placeholder="请输入现病史内容"
                                                v-model="item.survey.present">
                                        </el-input>
                                    </el-form-item>

                                </el-descriptions-item>

                                <el-descriptions-item label="刻下症">
                                    <el-form-item prop="visible">
                                        <el-input
                                                type="textarea"
                                                :autosize="{ minRows: 2, maxRows: 4}"
                                                placeholder="请输入刻下症内容"
                                                v-model="item.survey.visible">
                                        </el-input>
                                    </el-form-item>
                                </el-descriptions-item>
                            </el-descriptions>





                            <el-descriptions  title="主症" direction="vertical" :column="1" border >
                                <el-descriptions-item label="咳嗽"  >
                                    <el-form-item label="" prop="cough" >
                                        <el-radio-group v-model="item.survey.cough">
                                            <el-radio label="无"></el-radio>
                                            <el-radio label="有"></el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-descriptions-item>

                                <el-descriptions-item label="性质">
                                    <el-form-item prop="nature">
                                        <el-radio-group v-model="item.survey.nature">
                                            <el-radio label="干咳"></el-radio>
                                            <el-radio label="湿咳（每天痰量>10ml）"></el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-descriptions-item>

                                <el-descriptions-item label="程度">
                                    <el-form-item  prop="degree">
                                        <el-radio-group v-model="item.survey.degree">
                                            <el-radio label="偶有短暂咳嗽"></el-radio>
                                            <el-radio label="频繁咳嗽，轻度影响日常生活"></el-radio>
                                            <el-radio label="频繁咳嗽，严重影响日常生活"></el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-descriptions-item>

                                <el-descriptions-item label="加重因素">
                                    <el-form-item prop="increaseFactors">
                                        <el-radio-group v-model="item.survey.increaseFactors">
                                            <el-radio label="活动后加重"></el-radio>
                                            <el-radio label="无明显加重因素"></el-radio>
                                            <el-radio  label="其他"></el-radio>
                                            <el-input v-model="item.survey.increaseFactors"  size="mini" placeholder="请输入其他加重因素" style="width: 140px" ></el-input>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-descriptions-item>

                                <el-descriptions-item label="缓解因素">
                                    <el-form-item prop="decreaseFactors">
                                        <el-radio-group v-model="item.survey.decreaseFactors">
                                            <el-radio label="痰出"></el-radio>
                                            <el-radio label="休息"></el-radio>
                                            <el-radio label="无明显缓解因素"></el-radio>
                                            <el-radio  label="其他"></el-radio>
                                            <el-input v-model="item.survey.decreaseFactors"  size="mini" placeholder="请输入其他缓解因素" style="width: 140px" ></el-input>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-descriptions-item>

                                <el-descriptions-item label="咳痰">
                                    <el-form-item prop="expectoration">
                                        <el-radio-group v-model="item.survey.expectoration">
                                            <el-radio label="无"></el-radio>
                                            <el-radio label="有"></el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-descriptions-item>

                                <el-descriptions-item label="痰量">
                                    <el-form-item prop="volume">
                                        <el-radio-group v-model="item.survey.volume">
                                            <el-radio label="少量（昼夜咯痰10-50ml）"></el-radio>
                                            <el-radio label="中等量（昼夜咯痰51-100ml）"></el-radio>
                                            <el-radio label="大量（昼夜咯痰>100ml）"></el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-descriptions-item>



                                <el-descriptions-item label="痰色">
                                    <el-form-item prop="phlegmColor">
                                        <el-radio-group v-model="item.survey.phlegmColor">
                                            <el-radio label="白"></el-radio>
                                            <el-radio label="灰"></el-radio>
                                            <el-radio label="黄"></el-radio>
                                            <el-radio label="带血"></el-radio>
                                            <el-radio label="其他"></el-radio>
                                            <el-input v-model="item.survey.phlegmColor"  size="mini" placeholder="请输入其他痰色" style="width: 140px" ></el-input>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-descriptions-item>

                                <el-descriptions-item label="痰质">
                                    <el-form-item prop="phlegmQuality">
                                        <el-radio-group v-model="item.survey.phlegmQuality">
                                            <el-radio label="清稀"></el-radio>
                                            <el-radio label="泡沫"></el-radio>
                                            <el-radio label="黏稠"></el-radio>
                                            <el-radio label="破絮"></el-radio>
                                            <el-radio label="拉丝"></el-radio>
                                            <el-radio label="其他"></el-radio>
                                            <el-input v-model="item.survey.phlegmQuality"  size="mini" placeholder="请输入其他痰质" style="width: 140px" ></el-input>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-descriptions-item>

                                <el-descriptions-item label="痰味">
                                    <el-form-item prop="phlegmTaste">
                                        <el-radio-group v-model="item.survey.phlegmTaste">
                                            <el-radio label="无"></el-radio>
                                            <el-radio label="甜"></el-radio>
                                            <el-radio label="咸"></el-radio>
                                            <el-radio label="腥"></el-radio>
                                            <el-radio label="其他"></el-radio>
                                            <el-input v-model="item.survey.phlegmTaste"  size="mini" placeholder="请输入其他痰味" style="width: 140px" ></el-input>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-descriptions-item>

                                <el-descriptions-item label="呼吸困难">
                                    <el-form-item prop="dyspnea">
                                        <el-radio-group v-model="item.survey.dyspnea">
                                            <el-radio label="无"></el-radio>
                                            <el-radio label="有"></el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-descriptions-item>

                                <el-descriptions-item label="呼吸困难加重因素">
                                    <el-form-item prop="dyspneaIncrease">
                                        <el-checkbox-group v-model="item.survey.dyspneaIncrease">
                                            <el-checkbox label="活动"></el-checkbox>
                                            <el-checkbox label="平卧"></el-checkbox>
                                            <el-checkbox label="情绪波动"></el-checkbox>
                                            <el-checkbox label="呼吸道感染"></el-checkbox>
                                            <el-checkbox label="其他"></el-checkbox>
                                            <el-form-item prop="dyspneaIncreaseOther">
                                                <el-input v-model="item.survey.dyspneaIncreaseOther"  size="mini" placeholder="请在此补充其他呼吸困难加重因素" style="width: 200px" ></el-input>
                                            </el-form-item>
                                        </el-checkbox-group>
                                    </el-form-item>
                                </el-descriptions-item>

                                <el-descriptions-item label="呼吸困难缓解因素">
                                    <el-form-item prop="dyspneaDecrease">
                                        <el-checkbox-group v-model="item.survey.dyspneaDecrease">
                                            <el-checkbox label="休息"></el-checkbox>
                                            <el-checkbox label="吸氧"></el-checkbox>
                                            <el-checkbox label="其他"></el-checkbox>
                                            <el-form-item prop="dyspneaDecreaseOther">
                                                <el-input v-model="item.survey.dyspneaDecreaseOther"  size="mini" placeholder="请在此补充其他呼吸困难缓解因素" style="width: 200px" ></el-input>

                                            </el-form-item>
                                        </el-checkbox-group>
                                    </el-form-item>
                                </el-descriptions-item>



                                <el-descriptions-item label="呼吸困难程度">
                                    <el-form-item prop="dyspneaDegree">
                                        <el-radio-group v-model="item.survey.dyspneaDegree">
                                            <el-radio label="0级 只在剧烈运动时才出现呼吸困难"></el-radio><br>
                                            <el-radio label="1级 在走路较急或爬缓坡时会出现呼吸困难"></el-radio><br>
                                            <el-radio label="2级 按平时走路方式走时会出现气短，必须停下来休息，走路比同龄人慢"></el-radio><br>
                                            <el-radio label="3级 步行100码（91.44米）或几分钟后需要停下来休息"></el-radio><br>
                                            <el-radio label="4级 因呼吸困难严重不能离家，或穿脱衣时出现呼吸困难"></el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-descriptions-item>



                                <el-descriptions-item label="伴随症状">
                                    <el-form-item prop="accompanyingSymptoms">
                                        <el-checkbox-group v-model="item.survey.accompanyingSymptoms">
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
                                            <el-form-item prop="accompanyingSymptomsOther">
                                                <el-input v-model="item.survey.accompanyingSymptomsOther"  size="mini" placeholder="请在此补充其他伴随症状" style="width: 200px" ></el-input>

                                            </el-form-item>
                                        </el-checkbox-group>
                                    </el-form-item>
                                </el-descriptions-item>




                            </el-descriptions>






                            <el-descriptions style="margin-top:-5%" title="中医证候信息表" direction="vertical" :column="1" border >

                                <el-descriptions-item label="肺系">
                                    <el-form-item prop="pulmonarySystem">
                                        <el-checkbox-group v-model="item.survey.pulmonarySystem">
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
                                            <el-form-item prop="pulmonarySystemOther">
                                                <el-input v-model="item.survey.pulmonarySystemOther"  size="mini" placeholder="请在此补充其他肺系情况" style="width: 200px" ></el-input>
                                            </el-form-item>
                                        </el-checkbox-group>
                                    </el-form-item>
                                </el-descriptions-item>



                                <el-descriptions-item label="寒热">
                                    <el-form-item prop="coldAndHeat">
                                        <el-checkbox-group v-model="item.survey.coldAndHeat">
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
                                    <el-form-item prop="perspiration">
                                        <el-checkbox-group v-model="item.survey.perspiration">
                                            <el-checkbox label="正常"></el-checkbox>
                                            <el-checkbox label="无汗"></el-checkbox>
                                            <el-checkbox label="自汗"></el-checkbox>
                                            <el-checkbox label="盗汗"></el-checkbox>
                                            <el-checkbox label="头汗"></el-checkbox>
                                            <el-checkbox label="手足心汗"></el-checkbox>
                                            <el-checkbox label="其他"></el-checkbox>
                                            <el-form-item prop="perspirationOther">
                                                <el-input v-model="item.survey.perspirationOther"  size="mini" placeholder="请在此补充其他汗出情况" style="width: 200px" ></el-input>
                                            </el-form-item>

                                        </el-checkbox-group>
                                    </el-form-item>
                                </el-descriptions-item>



                                <el-descriptions-item label="精神">
                                    <el-form-item prop="spirit">
                                        <el-checkbox-group v-model="item.survey.spirit">
                                            <el-checkbox label="正常"></el-checkbox>
                                            <el-checkbox label="乏力"></el-checkbox>
                                            <el-checkbox label="神疲"></el-checkbox>
                                            <el-checkbox label="嗜睡"></el-checkbox>
                                            <el-checkbox label="烦躁"></el-checkbox>
                                            <el-checkbox label="神昏"></el-checkbox>
                                            <el-checkbox label="其他"></el-checkbox>
                                            <el-form-item prop="spiritOther">
                                                <el-input v-model="item.survey.spiritOther"  size="mini" placeholder="请在此补充其他精神情况" style="width: 200px" ></el-input>
                                            </el-form-item>

                                        </el-checkbox-group>
                                    </el-form-item>
                                </el-descriptions-item>



                                <el-descriptions-item label="情志">
                                    <el-form-item prop="emotion">
                                        <el-checkbox-group v-model="item.survey.emotion">
                                            <el-checkbox label="正常"></el-checkbox>
                                            <el-checkbox label="烦躁易怒"></el-checkbox>
                                            <el-checkbox label="抑郁"></el-checkbox>
                                            <el-checkbox label="健忘"></el-checkbox>
                                            <el-checkbox label="易惊"></el-checkbox>
                                            <el-checkbox label="其他"></el-checkbox>
                                            <el-form-item prop="emotionOther">
                                                <el-input v-model="item.survey.emotionOther"  size="mini" placeholder="请在此补充其他情志情况" style="width: 200px" ></el-input>

                                            </el-form-item>

                                        </el-checkbox-group>
                                    </el-form-item>
                                </el-descriptions-item>


                                <el-descriptions-item label="面色">
                                    <el-form-item prop="complexion">
                                        <el-checkbox-group v-model="item.survey.complexion">
                                            <el-checkbox label="常色"></el-checkbox>
                                            <el-checkbox label="淡白无华"></el-checkbox>
                                            <el-checkbox label="㿠白"></el-checkbox>
                                            <el-checkbox label="萎黄"></el-checkbox>
                                            <el-checkbox label="潮红"></el-checkbox>
                                            <el-checkbox label="青紫"></el-checkbox><br>
                                            <el-checkbox label="晦暗"></el-checkbox>
                                            <el-checkbox label="面色黧黑、肌肤甲错"></el-checkbox>
                                            <el-checkbox label="其他"></el-checkbox>
                                            <el-form-item prop="complexionOther">
                                                <el-input v-model="item.survey.complexionOther"  size="mini" placeholder="请在此补充其他面色情况" style="width: 200px" ></el-input>

                                            </el-form-item>

                                        </el-checkbox-group>
                                    </el-form-item>
                                </el-descriptions-item>



                                <el-descriptions-item label="饮食">
                                    <el-form-item >
                                        <div>食：</div>
                                        <el-form-item prop="food">
                                            <el-checkbox-group v-model="item.survey.food">
                                                <el-checkbox label="正常"></el-checkbox>
                                                <el-checkbox label="纳差"></el-checkbox>
                                                <el-checkbox label="饥不欲食"></el-checkbox>
                                                <el-checkbox label="消谷善饥"></el-checkbox>
                                                <el-checkbox label="恶心呕吐"></el-checkbox><br>
                                                <el-checkbox label="朝食暮吐、暮食朝吐"></el-checkbox>
                                                <el-checkbox label="脘闷"></el-checkbox>
                                                <el-checkbox label="腹胀"></el-checkbox>
                                                <el-checkbox label="其他"></el-checkbox>
                                                <el-form-item prop="foodOther">
                                                    <el-input v-model="item.survey.foodOther"  size="mini" placeholder="请在此补充其他" style="width: 200px" ></el-input>

                                                </el-form-item>

                                            </el-checkbox-group>
                                        </el-form-item >

                                        <div>饮：</div>
                                        <el-form-item prop="drink">
                                            <el-checkbox-group v-model="item.survey.drink">
                                                <el-checkbox label="正常"></el-checkbox>
                                                <el-checkbox label="口不渴"></el-checkbox>
                                                <el-checkbox label="渴喜冷饮"></el-checkbox>
                                                <el-checkbox label="渴喜热饮"></el-checkbox>
                                                <el-checkbox label="渴不欲饮"></el-checkbox><br>
                                                <el-checkbox label="渴饮不多"></el-checkbox>
                                                <el-checkbox label="口渴但欲漱水不欲咽"></el-checkbox>
                                                <el-checkbox label="水入即吐"></el-checkbox>
                                                <el-checkbox label="其他"></el-checkbox>
                                                <el-form-item prop="drinkOther">
                                                    <el-input v-model="item.survey.drinkOther"  size="mini" placeholder="请在此补充其他" style="width: 200px" ></el-input>
                                                </el-form-item >
                                            </el-checkbox-group>
                                        </el-form-item >
                                        <div>味：</div>
                                        <el-form-item prop="taste">
                                            <el-checkbox-group v-model="item.survey.taste">
                                                <el-checkbox label="正常"></el-checkbox>
                                                <el-checkbox label="口苦"></el-checkbox>
                                                <el-checkbox label="口淡"></el-checkbox>
                                                <el-checkbox label="口咸"></el-checkbox>
                                                <el-checkbox label="口腥"></el-checkbox><br>
                                                <el-checkbox label="口甜"></el-checkbox>
                                                <el-checkbox label="口腻"></el-checkbox>
                                                <el-checkbox label="其他"></el-checkbox>
                                                <el-form-item prop="tasteOther">
                                                    <el-input v-model="item.survey.tasteOther"  size="mini" placeholder="请在此补充其他" style="width: 200px" ></el-input>
                                                </el-form-item >
                                            </el-checkbox-group>
                                        </el-form-item >
                                    </el-form-item>
                                </el-descriptions-item>



                                <el-descriptions-item label="二便">
                                    <el-form-item prop="urine">
                                        <div>小便：</div>

                                        <el-checkbox-group v-model="item.survey.urine">
                                            <el-checkbox label="正常"></el-checkbox>
                                            <el-checkbox label="清长"></el-checkbox>
                                            <el-checkbox label="短赤"></el-checkbox>
                                            <el-checkbox label="便黄"></el-checkbox>
                                            <el-checkbox label="夜尿频数"></el-checkbox>
                                            <el-checkbox label="小便涩痛"></el-checkbox><br>
                                            <el-checkbox label="淋漓不尽"></el-checkbox>
                                            <el-checkbox label="遗尿"></el-checkbox>
                                            <el-checkbox label="其他"></el-checkbox>
                                            <el-form-item prop="urineOther">
                                                <el-input v-model="item.survey.urineOther"  size="mini" placeholder="请在此补充其他小便情况" style="width: 200px" ></el-input>

                                            </el-form-item>

                                        </el-checkbox-group>
                                    </el-form-item>
                                    <el-form-item prop="defecate">

                                        <div>大便：</div>
                                        <el-checkbox-group v-model="item.survey.defecate">
                                            <el-checkbox label="正常"></el-checkbox>
                                            <el-checkbox label="干结"></el-checkbox>
                                            <el-checkbox label="稀溏"></el-checkbox>
                                            <el-checkbox label="排便无力"></el-checkbox>
                                            <el-checkbox label="黏滞不爽"></el-checkbox>
                                            <el-checkbox label="完谷不化"></el-checkbox><br>
                                            <el-checkbox label="其他"></el-checkbox>
                                            <el-form-item prop="defecateOther">
                                                <el-input v-model="item.survey.defecateOther"  size="mini" placeholder="请在此补充其他大便情况" style="width: 200px" ></el-input>

                                            </el-form-item>

                                        </el-checkbox-group>

                                    </el-form-item>


                                </el-descriptions-item>


                                <el-descriptions-item label="睡眠">
                                    <el-form-item prop="sleep">

                                        <el-checkbox-group v-model="item.survey.sleep">
                                            <el-checkbox label="正常"></el-checkbox>
                                            <el-checkbox label="迟难入睡"></el-checkbox>
                                            <el-checkbox label="多梦"></el-checkbox>
                                            <el-checkbox label="易醒"></el-checkbox>
                                            <el-checkbox label="其他"></el-checkbox>
                                            <el-form-item prop="sleepOther">
                                                <el-input v-model="item.survey.sleepOther"  size="mini" placeholder="请在此补充其他睡眠情况" style="width: 200px" ></el-input>

                                            </el-form-item>

                                        </el-checkbox-group>

                                    </el-form-item>
                                </el-descriptions-item>


                                <el-descriptions-item label="周身四肢">
                                    <el-form-item prop="bodyAndLimbs">

                                        <el-checkbox-group v-model="item.survey.bodyAndLimbs">
                                            <el-checkbox label="正常"></el-checkbox>
                                            <el-checkbox label="腰膝酸软"></el-checkbox>
                                            <el-checkbox label="肢冷"></el-checkbox>
                                            <el-checkbox label="耳鸣"></el-checkbox>
                                            <el-checkbox label="目干"></el-checkbox>
                                            <el-checkbox label="面目或肢体浮肿"></el-checkbox>
                                            <el-checkbox label="其他"></el-checkbox>
                                            <el-form-item prop="bodyAndLimbsOthers">
                                                <el-input v-model="item.survey.bodyAndLimbsOthers"  size="mini" placeholder="请在此补充其他周身四肢情况" style="width: 200px" ></el-input>

                                            </el-form-item>

                                        </el-checkbox-group>

                                    </el-form-item>
                                </el-descriptions-item>


                                <el-descriptions-item label="舌象">
                                    <el-form-item prop="tongueColor">
                                        <div>舌色</div>
                                        <el-checkbox-group v-model="item.survey.tongueColor">
                                            <el-checkbox label="淡红"></el-checkbox>
                                            <el-checkbox label="淡白"></el-checkbox>
                                            <el-checkbox label="红"></el-checkbox>
                                            <el-checkbox label="绛"></el-checkbox>
                                            <el-checkbox label="青紫"></el-checkbox>
                                            <el-checkbox label="暗/瘀斑瘀点"></el-checkbox>
                                        </el-checkbox-group>

                                    </el-form-item>

                                    <el-form-item prop="tongueShape">
                                        <div>舌形</div>
                                        <el-checkbox-group v-model="item.survey.tongueShape">
                                            <el-checkbox label="正常"></el-checkbox>
                                            <el-checkbox label="老"></el-checkbox>
                                            <el-checkbox label="嫩"></el-checkbox>
                                            <el-checkbox label="胖大"></el-checkbox>
                                            <el-checkbox label="肿胀"></el-checkbox>
                                            <el-checkbox label="薄瘦"></el-checkbox>
                                            <el-checkbox label="点刺"></el-checkbox>
                                            <el-checkbox label="裂纹"></el-checkbox>
                                            <el-checkbox label="齿痕"></el-checkbox>
                                        </el-checkbox-group>

                                    </el-form-item>

                                    <el-form-item prop="tongueState">
                                        <div>舌态</div>
                                        <el-checkbox-group v-model="item.survey.tongueState">
                                            <el-checkbox label="正常"></el-checkbox>
                                            <el-checkbox label="强硬"></el-checkbox>
                                            <el-checkbox label="痿软"></el-checkbox>
                                            <el-checkbox label="颤动"></el-checkbox>
                                            <el-checkbox label="歪斜"></el-checkbox>
                                            <el-checkbox label="吐弄"></el-checkbox>
                                            <el-checkbox label="短缩"></el-checkbox>
                                            <el-checkbox label="舌纵"></el-checkbox>
                                            <el-checkbox label="麻痹"></el-checkbox>
                                        </el-checkbox-group>

                                    </el-form-item>


                                    <el-form-item prop="coatingNature">
                                        <div>苔质</div>
                                        <el-checkbox-group v-model="item.survey.coatingNature">
                                            <el-checkbox label="薄"></el-checkbox>
                                            <el-checkbox label="厚"></el-checkbox>
                                            <el-checkbox label="润"></el-checkbox>
                                            <el-checkbox label="滑"></el-checkbox>
                                            <el-checkbox label="燥"></el-checkbox>
                                            <el-checkbox label="糙"></el-checkbox>
                                            <el-checkbox label="腻"></el-checkbox>
                                            <el-checkbox label="腐"></el-checkbox>
                                            <el-checkbox label="剥"></el-checkbox>
                                            <el-checkbox label="少"></el-checkbox>
                                            <el-checkbox label="无"></el-checkbox>
                                        </el-checkbox-group>

                                    </el-form-item>

                                    <el-form-item prop="coatingColour">
                                        <div>苔色</div>
                                        <el-checkbox-group v-model="item.survey.coatingColour">
                                            <el-checkbox label="白"></el-checkbox>
                                            <el-checkbox label="黄"></el-checkbox>
                                            <el-checkbox label="灰"></el-checkbox>
                                            <el-checkbox label="黑"></el-checkbox>
                                        </el-checkbox-group>

                                    </el-form-item>

                                    <el-form-item prop="tongueUnder">
                                        <div>舌下络脉</div>
                                        <el-checkbox-group v-model="item.survey.tongueUnder">
                                            <el-checkbox label="正常"></el-checkbox>
                                            <el-checkbox label="粗胀"></el-checkbox>
                                            <el-checkbox label="青紫"></el-checkbox>
                                            <el-checkbox label="其他"></el-checkbox>
                                            <el-form-item prop="tongueUnderOther">
                                                <el-input v-model="item.survey.tongueUnderOther"  size="mini" placeholder="请在此补充其他舌下络脉情况" style="width: 200px" ></el-input>
                                            </el-form-item>
                                        </el-checkbox-group>

                                    </el-form-item>

                                </el-descriptions-item>


                                <el-descriptions-item label="脉象">
                                    <el-form-item prop="pulseCondition">
                                        <el-checkbox-group v-model="item.survey.pulseCondition">
                                            <el-checkbox label="浮"></el-checkbox>
                                            <el-checkbox label="洪"></el-checkbox>
                                            <el-checkbox label="濡"></el-checkbox>
                                            <el-checkbox label="散"></el-checkbox>
                                            <el-checkbox label="芤"></el-checkbox>
                                            <el-checkbox label="革"></el-checkbox>
                                            <el-checkbox label="沉"></el-checkbox>
                                            <el-checkbox label="伏"></el-checkbox>
                                            <el-checkbox label="牢"></el-checkbox>
                                            <el-checkbox label="弱"></el-checkbox>
                                            <el-checkbox label="迟"></el-checkbox>
                                            <el-checkbox label="缓"></el-checkbox>
                                            <el-checkbox label="涩"></el-checkbox>
                                            <el-checkbox label="结"></el-checkbox>
                                            <el-checkbox label="数"></el-checkbox>
                                            <el-checkbox label="疾"></el-checkbox>
                                            <el-checkbox label="促"></el-checkbox>
                                            <el-checkbox label="动"></el-checkbox>
                                            <el-checkbox label="虚"></el-checkbox>
                                            <el-checkbox label="微"></el-checkbox>
                                            <el-checkbox label="细"></el-checkbox>
                                            <el-checkbox label="代"></el-checkbox>
                                            <el-checkbox label="短"></el-checkbox>
                                            <el-checkbox label="实"></el-checkbox>
                                            <el-checkbox label="滑"></el-checkbox>
                                            <el-checkbox label="弦"></el-checkbox>
                                            <el-checkbox label="紧"></el-checkbox>
                                            <el-checkbox label="长"></el-checkbox>
                                            <el-checkbox label="大"></el-checkbox>
                                        </el-checkbox-group>

                                    </el-form-item>
                                </el-descriptions-item>



                                <el-descriptions-item label="中医诊断">
                                    <el-form-item prop="disease">
                                        <div>疾病：</div>
                                        <el-input
                                                type="textarea"
                                                :autosize="{ minRows: 2, maxRows: 4}"
                                                placeholder="请输入中医诊断疾病内容"
                                                v-model="item.survey.disease">
                                        </el-input>

                                    </el-form-item>

                                    <el-form-item prop="syndromeType">
                                        <div>证型：</div>
                                        <el-input
                                                type="textarea"
                                                :autosize="{ minRows: 2, maxRows: 4}"
                                                placeholder="请输入中医诊断证型内容"
                                                v-model="item.survey.syndromeType">
                                        </el-input>

                                    </el-form-item>
                                </el-descriptions-item>



                            </el-descriptions>

                            <el-descriptions style="margin-top:-5%" title="处方信息" direction="vertical" :column="1" border >
                                <el-descriptions-item label="治法">
                                    <el-form-item prop="therapy">
                                        <el-input
                                                type="textarea"
                                                :autosize="{ minRows: 2, maxRows: 4}"
                                                placeholder="请输入治法"
                                                v-model="item.survey.therapy">
                                        </el-input>


                                    </el-form-item>
                                </el-descriptions-item>

                                <el-descriptions-item label="方剂名称">
                                    <el-form-item prop="prescriptionName">
                                        <el-input
                                                type="textarea"
                                                :autosize="{ minRows: 2, maxRows: 4}"
                                                placeholder="请输入方剂名称"
                                                v-model="item.survey.prescriptionName">
                                        </el-input>

                                    </el-form-item>
                                </el-descriptions-item>


                                <el-descriptions-item label="中药处方">
                                    <el-form-item prop="prescription">
                                        <el-input
                                                type="textarea"
                                                :autosize="{ minRows: 5, maxRows: 10}"
                                                placeholder="请输入中药处方"
                                                v-model="item.survey.prescription">
                                        </el-input>

                                    </el-form-item>
                                    <el-form-item prop="medicineNum">
                                        <div>
                                            <el-input-number v-model="item.survey.medicineNum"  :min="1" :max="999" ></el-input-number>  剂

                                        </div>


                                    </el-form-item>
                                    <el-form-item prop="decoctingMethod">
                                        <div>煎服法：</div>
                                        <el-input
                                                type="textarea"
                                                :autosize="{ minRows: 2, maxRows: 4}"
                                                placeholder="请输入煎服法"
                                                v-model="item.survey.decoctingMethod">
                                        </el-input>
                                    </el-form-item>

                                </el-descriptions-item>

                                <el-descriptions-item label="中成药处方">
                                    <el-form-item prop="chinesePatentMedicine">
                                        <el-input
                                                type="textarea"
                                                :autosize="{ minRows: 5, maxRows: 10}"
                                                placeholder="请输入中成药处方"
                                                v-model="item.survey.chinesePatentMedicine">
                                        </el-input>
                                    </el-form-item>

                                </el-descriptions-item>


                                <el-descriptions-item label="针灸推拿">
                                    <el-form-item prop="acupunctureAndMassage">
                                        <el-input
                                                type="textarea"
                                                :autosize="{ minRows: 5, maxRows: 10}"
                                                placeholder="请输入针灸推拿相关内容"
                                                v-model="item.survey.acupunctureAndMassage">
                                        </el-input>
                                    </el-form-item>

                                </el-descriptions-item>


                                <el-descriptions-item label="西药处方">
                                    <el-form-item prop="westernMedicinePrescription">
                                        <el-input
                                                type="textarea"
                                                :autosize="{ minRows: 5, maxRows: 10}"
                                                placeholder="请输入西药处方"
                                                v-model="item.survey.westernMedicinePrescription">
                                        </el-input>
                                    </el-form-item>

                                </el-descriptions-item>


                                <el-descriptions-item label="医嘱">
                                    <el-form-item prop="adviceForFood">
                                        <div>饮食：</div>
                                        <el-input
                                                type="textarea"
                                                :autosize="{ minRows: 5, maxRows: 10}"
                                                placeholder="请输入饮食相关医嘱"
                                                v-model="item.survey.adviceForFood">
                                        </el-input>
                                    </el-form-item>

                                    <el-form-item prop="adviceForDailyLife">
                                        <div>起居：</div>
                                        <el-input
                                                type="textarea"
                                                :autosize="{ minRows: 5, maxRows: 10}"
                                                placeholder="请输入起居相关医嘱"
                                                v-model="item.survey.adviceForDailyLife">
                                        </el-input>
                                    </el-form-item>

                                    <el-form-item prop="adviceForEmotion">
                                        <div>情志：</div>
                                        <el-input
                                                type="textarea"
                                                :autosize="{ minRows: 5, maxRows: 10}"
                                                placeholder="请输入情志相关医嘱"
                                                v-model="item.survey.adviceForEmotion">
                                        </el-input>
                                    </el-form-item>

                                    <el-form-item prop="adviceForOther">
                                        <div>其他：</div>
                                        <el-input
                                                type="textarea"
                                                :autosize="{ minRows: 5, maxRows: 10}"
                                                placeholder="请输入其他医嘱"
                                                v-model="item.survey.adviceForOther">
                                        </el-input>
                                    </el-form-item>

                                </el-descriptions-item>


                                <el-descriptions-item label="必要的临床检查">
                                    <div>胸部HRCT：</div>
                                    <el-form-item  prop="hrctDate">

                                        <div>检查日期：<el-date-picker type="date" placeholder="选择日期" v-model="item.survey.hrctDate" style="width: 50%;"></el-date-picker></div>
                                    </el-form-item>
                                    <el-form-item  prop="hrctStore">
                                        <div>是否已留存：
                                            <el-radio-group v-model="item.survey.hrctStore">
                                                <el-radio label="是"></el-radio>
                                                <el-radio label="否"></el-radio>

                                            </el-radio-group>

                                        </div>
                                    </el-form-item>


                                    <div>肺功能： </div>
                                    <el-form-item  prop="lungFunctionDate">

                                        <div>检查日期：<el-date-picker type="date" placeholder="选择日期" v-model="item.survey.lungFunctionDate" style="width: 50%;"></el-date-picker></div>
                                    </el-form-item>
                                    <el-form-item  prop="lungFunctionStore">
                                        <div>是否已留存：
                                            <el-radio-group v-model="item.survey.lungFunctionStore">
                                                <el-radio label="是"></el-radio>
                                                <el-radio label="否"></el-radio>

                                            </el-radio-group>

                                        </div>
                                    </el-form-item>


                                    <div>动脉血气分析： </div>
                                    <el-form-item  prop="bloodGasAnalysisDate">

                                        <div>检查日期：<el-date-picker type="date" placeholder="选择日期" v-model="item.survey.bloodGasAnalysisDate" style="width: 50%;"></el-date-picker></div>
                                    </el-form-item>
                                    <el-form-item  prop="bloodGasAnalysisStore">
                                        <div>是否已留存：
                                            <el-radio-group v-model="item.survey.bloodGasAnalysisStore">
                                                <el-radio label="是"></el-radio>
                                                <el-radio label="否"></el-radio>

                                            </el-radio-group>

                                        </div>
                                    </el-form-item>



                                    <div>6分钟步行试验： </div>
                                    <el-form-item  prop="walkTestDate">

                                        <div>检查日期：<el-date-picker type="date" placeholder="选择日期" v-model="item.survey.walkTestDate" style="width: 50%;"></el-date-picker></div>
                                    </el-form-item>
                                    <el-form-item  prop="walkTestStore">
                                        <div>是否已留存：
                                            <el-radio-group v-model="item.survey.walkTestStore">
                                                <el-radio label="是"></el-radio>
                                                <el-radio label="否"></el-radio>

                                            </el-radio-group>

                                        </div>
                                    </el-form-item>



                                    <div>胸部X线： </div>
                                    <el-form-item  prop="rayDate">

                                        <div>检查日期：<el-date-picker type="date" placeholder="选择日期" v-model="item.survey.rayDate" style="width: 50%;"></el-date-picker></div>
                                    </el-form-item>
                                    <el-form-item  prop="rayStore">
                                        <div>是否已留存：
                                            <el-radio-group v-model="item.survey.rayStore">
                                                <el-radio label="是"></el-radio>
                                                <el-radio label="否"></el-radio>

                                            </el-radio-group>

                                        </div>
                                    </el-form-item>


                                    <div>心脏彩超： </div>
                                    <el-form-item  prop="colourSonographyDate">

                                        <div>检查日期：<el-date-picker type="date" placeholder="选择日期" v-model="item.survey.colourSonographyDate" style="width: 50%;"></el-date-picker></div>
                                    </el-form-item>
                                    <el-form-item  prop="colourSonographyStore">
                                        <div>是否已留存：
                                            <el-radio-group v-model="item.survey.colourSonographyStore">
                                                <el-radio label="是"></el-radio>
                                                <el-radio label="否"></el-radio>

                                            </el-radio-group>

                                        </div>
                                    </el-form-item>



                                    <div>血常规： </div>
                                    <el-form-item  prop="routineBloodTestDate">

                                        <div>检查日期：<el-date-picker type="date" placeholder="选择日期" v-model="item.survey.routineBloodTestDate" style="width: 50%;"></el-date-picker></div>
                                    </el-form-item>
                                    <el-form-item  prop="routineBloodTestStore">
                                        <div>是否已留存：
                                            <el-radio-group v-model="item.survey.routineBloodTestStore">
                                                <el-radio label="是"></el-radio>
                                                <el-radio label="否"></el-radio>

                                            </el-radio-group>

                                        </div>
                                    </el-form-item>




                                    <div>血生化检查： </div>
                                    <el-form-item  prop="bloodExaminationDate">

                                        <div>检查日期：<el-date-picker type="date" placeholder="选择日期" v-model="item.survey.bloodExaminationDate" style="width: 50%;"></el-date-picker></div>
                                    </el-form-item>
                                    <el-form-item  prop="bloodExaminationStore">
                                        <div>是否已留存：
                                            <el-radio-group v-model="item.survey.bloodExaminationStore">
                                                <el-radio label="是"></el-radio>
                                                <el-radio label="否"></el-radio>

                                            </el-radio-group>

                                        </div>
                                    </el-form-item>


                                    <div>凝血功能和D二聚体： </div>
                                    <el-form-item  prop="coagulationFunctionDate">

                                        <div>检查日期：<el-date-picker type="date" placeholder="选择日期" v-model="item.survey.coagulationFunctionDate" style="width: 50%;"></el-date-picker></div>
                                    </el-form-item>
                                    <el-form-item  prop="coagulationFunctionStore">
                                        <div>是否已留存：
                                            <el-radio-group v-model="item.survey.coagulationFunctionStore">
                                                <el-radio label="是"></el-radio>
                                                <el-radio label="否"></el-radio>

                                            </el-radio-group>

                                        </div>
                                    </el-form-item>



                                </el-descriptions-item>


                                <el-descriptions-item label="院外合并治疗情况(西药)">


                                    <el-form-item prop="westernMedicineHas">

                                        <div>西药：
                                            <el-radio-group v-model="item.survey.westernMedicineHas">
                                                <el-radio label="有"></el-radio>
                                                <el-radio label="无"></el-radio>
                                            </el-radio-group>
                                        </div>

                                    </el-form-item>

                                    <el-form-item prop="westernMedicineMain">

                                        <div>如有，记录主要药物名称：
                                            <el-checkbox-group v-model="item.survey.westernMedicineMain">
                                                <el-checkbox label="吡非尼酮/尼达尼布"></el-checkbox>
                                                <el-checkbox label="N-乙酰半胱氨酸"></el-checkbox>
                                            </el-checkbox-group>
                                        </div>
                                    </el-form-item>

                                    <el-form-item prop="westernMedicineMainOther">
                                        其他：
                                        <el-input v-model="item.survey.westernMedicineMainOther"  size="mini" placeholder="请在此补充其他西药" style="width: 200px" ></el-input>
                                    </el-form-item>


                                </el-descriptions-item>


                                <el-descriptions-item label="院外合并治疗情况(中成药)">


                                    <el-form-item prop="chinesePatentMedicineHas">

                                        <div>中成药：
                                            <el-radio-group v-model="item.survey.chinesePatentMedicineHas">
                                                <el-radio label="有"></el-radio>
                                                <el-radio label="无"></el-radio>
                                            </el-radio-group>
                                        </div>

                                    </el-form-item>


                                    <el-form-item prop="chinesePatentMedicineMain">
                                        如有，记录主要中成药名称：
                                        <el-input v-model="item.survey.chinesePatentMedicineMain"  size="mini" placeholder="请在此补充主要中成药名称" style="width: 500px" ></el-input>
                                    </el-form-item>


                                </el-descriptions-item>


                                <el-descriptions-item label="院外合并治疗情况(其他疗法)">


                                    <el-form-item prop="therapyHas">

                                        <div>其他疗法：
                                            <el-radio-group v-model="item.survey.therapyHas">
                                                <el-radio label="有"></el-radio>
                                                <el-radio label="无"></el-radio>
                                            </el-radio-group>
                                        </div>

                                    </el-form-item>

                                    <el-form-item prop="therapyMain">

                                        <div>如有，记录具体疗法：
                                            <el-checkbox-group v-model="item.survey.therapyMain">
                                                <el-checkbox label="氧疗"></el-checkbox>
                                            </el-checkbox-group>
                                        </div>
                                    </el-form-item>

                                    <el-form-item prop="therapyMainOther">
                                        其他：
                                        <el-input v-model="item.survey.therapyMainOther"  size="mini" placeholder="请在此补充其他疗法" style="width: 200px" ></el-input>
                                    </el-form-item>


                                </el-descriptions-item>










                            </el-descriptions>


                            <el-descriptions  title="病例资料拓展（特色模块）" direction="vertical" :column="1" border >

                                <el-descriptions-item label="病例资料拓展">
                                    <el-form-item prop="dataExpansion">
                                        <el-input
                                                type="textarea"
                                                :autosize="{ minRows: 25, maxRows: 999}"
                                                placeholder="请在此补充病例资料"
                                                v-model="item.survey.dataExpansion">
                                        </el-input>

                                    </el-form-item>
                                </el-descriptions-item>
                            </el-descriptions>


                            <span style="justify-content: center;display: flex"><h3>疗效评价</h3></span>

                            <el-descriptions  title="自评医疗成效问卷（MYMOP）" direction="vertical" :column="1" border >

                                <el-descriptions-item label="1.请选出一或两项最令你困扰的症状（可以身体上或精神上的），写在下方输入框中。
并把适当的数字勾上以表示该症状在过去一星期的情况有多坏（0代表情况算是最好，6代表情况算是最坏）">
                                    <el-form-item prop="mymopOnePointOne">
                                        <div>症状一：</div>
                                        <el-input placeholder="请在此填写症状一" v-model="item.survey.mymopOnePointOne" style="width: 20%">
                                        </el-input>

                                        <el-form-item prop="mymopOnePointOneScore">
                                            <div>情况算是最好
                                                <el-radio-group v-model="item.survey.mymopOnePointOneScore">
                                                    <el-radio label="1" ></el-radio>
                                                    <el-radio label="2" ></el-radio>
                                                    <el-radio label="3"></el-radio>
                                                    <el-radio label="4"></el-radio>
                                                    <el-radio  label="5"  ></el-radio>
                                                    <el-radio  label="6"  ></el-radio>
                                                </el-radio-group>
                                                情况算是最坏
                                            </div>
                                        </el-form-item>
                                    </el-form-item>


                                    <el-form-item prop="mymopOnePointTwo">
                                        <div>症状二：</div>
                                        <el-input placeholder="请在此填写症状二" v-model="item.survey.mymopOnePointTwo" style="width: 20%">
                                        </el-input>

                                        <el-form-item prop="mymopOnePointTwoScore">
                                            <div>情况算是最好
                                                <el-radio-group v-model="item.survey.mymopOnePointTwoScore">
                                                    <el-radio label="1" ></el-radio>
                                                    <el-radio label="2" ></el-radio>
                                                    <el-radio label="3"></el-radio>
                                                    <el-radio label="4"></el-radio>
                                                    <el-radio  label="5"  ></el-radio>
                                                    <el-radio  label="6"  ></el-radio>
                                                </el-radio-group>
                                                情况算是最坏
                                            </div>
                                        </el-form-item>
                                    </el-form-item>
                                </el-descriptions-item>


                                <el-descriptions-item label="2.请写出一项对你而言是重要，却因为这些症状而受影响或甚至不能进行的活动（可
以是身体上的、社交上的、或精神上的活动；例如工作、运动、或其他娱乐等等），并把适当的数字勾上以表受影响的情况有多坏。">
                                    <el-form-item prop="mymopTwo">
                                        <div>活动：</div>
                                        <el-input placeholder="请在此填写活动" v-model="item.survey.mymopTwo" style="width: 20%">
                                        </el-input>

                                        <el-form-item prop="mymopTwoScore">
                                            <div>情况算是最好
                                                <el-radio-group v-model="item.survey.mymopTwoScore">
                                                    <el-radio label="1" ></el-radio>
                                                    <el-radio label="2" ></el-radio>
                                                    <el-radio label="3"></el-radio>
                                                    <el-radio label="4"></el-radio>
                                                    <el-radio  label="5"  ></el-radio>
                                                    <el-radio  label="6"  ></el-radio>
                                                </el-radio-group>
                                                情况算是最坏
                                            </div>
                                        </el-form-item>
                                    </el-form-item>
                                </el-descriptions-item>


                                <el-descriptions-item label="3.在过去一星期，你对自己身心状况的整体感觉如何？">



                                    <el-form-item prop="mymopThree">
                                        <div>情况算是最好
                                            <el-radio-group v-model="item.survey.mymopThree">
                                                <el-radio label="1" ></el-radio>
                                                <el-radio label="2" ></el-radio>
                                                <el-radio label="3"></el-radio>
                                                <el-radio label="4"></el-radio>
                                                <el-radio  label="5"  ></el-radio>
                                                <el-radio  label="6"  ></el-radio>
                                            </el-radio-group>
                                            情况算是最坏
                                        </div>
                                    </el-form-item>

                                </el-descriptions-item>

                                <el-descriptions-item label="4.你上述的 症状一出现了多久？（不论是连续出现，或是断续地出现）">



                                    <el-form-item prop="mymopFour">
                                        <div>
                                            <el-radio-group v-model="item.survey.mymopFour">
                                                <el-radio label="0-4星期" ></el-radio>
                                                <el-radio label="4-12星期" ></el-radio>
                                                <el-radio label="3个月至1年"></el-radio>
                                                <el-radio label="1-5年"></el-radio>
                                                <el-radio  label="超过5年"  ></el-radio>
                                            </el-radio-group>

                                        </div>
                                    </el-form-item>

                                </el-descriptions-item>


                                <el-descriptions-item label="5.你有没有使用任何药物来治疗症状一？">



                                    <el-form-item prop="mymopFive">
                                        <div>
                                            <el-radio-group v-model="item.survey.mymopFive">
                                                <el-radio label="有" ></el-radio>
                                                <el-radio label="没有（跳至第8题）" ></el-radio>

                                            </el-radio-group>

                                        </div>
                                    </el-form-item>

                                </el-descriptions-item>

                                <el-descriptions-item label="6.请写出该药物的名称及每天／每周使用量。">



                                    <el-form-item prop="mymopSixPointOne">
                                        <div>药物名称：
                                            <el-input placeholder="请在此填写药物名称" v-model="item.survey.mymopSixPointOne" style="width: 20%">
                                            </el-input>
                                        </div>

                                    </el-form-item>

                                    <el-form-item prop="mymopSixPointTwo">
                                        <div>使用量：
                                            <el-input placeholder="请在此填写使用量" v-model="item.survey.mymopSixPointTwo" style="width: 20%">
                                            </el-input>
                                        </div>

                                    </el-form-item>



                                </el-descriptions-item>



                                <el-descriptions-item label="7.你认为减少使用这些药物有多重要？">



                                    <el-form-item prop="mymopSeven">
                                        <div>
                                            <el-radio-group v-model="item.survey.mymopSeven">
                                                <el-radio label="不重要" ></el-radio>
                                                <el-radio label="少许重要" ></el-radio>
                                                <el-radio label="非常重要" ></el-radio>
                                                <el-radio label="不适用" ></el-radio>

                                            </el-radio-group>

                                        </div>
                                    </el-form-item>

                                </el-descriptions-item>



                                <el-descriptions-item label="8.对症状一来说，你认为不使用任何药物有多重要？">



                                    <el-form-item prop="mymopEight">
                                        <div>
                                            <el-radio-group v-model="item.survey.mymopEight">
                                                <el-radio label="不重要" ></el-radio>
                                                <el-radio label="少许重要" ></el-radio>
                                                <el-radio label="非常重要" ></el-radio>
                                                <el-radio label="不适用" ></el-radio>

                                            </el-radio-group>

                                        </div>
                                    </el-form-item>

                                </el-descriptions-item>







                            </el-descriptions>

                            <el-descriptions  title="圣乔治呼吸调查问卷" direction="vertical" :column="1" border >
                                <el-descriptions-item label="这份问卷是用来帮助我们了解你的呼吸问题是如何正在困扰你的，以及它是如何影响你的生活的。我们通过它发现疾病在哪一方面对你的影响最大,但这不是医生或护士所认为的那些问题。
                        请仔细阅读下列指导性语句，若有不明白之处请提问。不要花费太长的时间来决定你的答案。在完成余下的问卷前，请选择一个能体现你目前健康状况的描述：">
                                    <div></div>
                                    <el-form-item prop="sgrqDescription">

                                        <el-radio-group v-model="item.survey.sgrqDescription">
                                            <el-radio label="很好" ></el-radio>
                                            <el-radio label="好" ></el-radio>
                                            <el-radio label="一般" ></el-radio>
                                            <el-radio label="不好" ></el-radio>
                                            <el-radio label="很差" ></el-radio>

                                        </el-radio-group>


                                    </el-form-item>
                                </el-descriptions-item>



                                <el-descriptions-item label="第一部分：关于过去6个月内您的呼吸困难问题，每个问题只选择一个答案：">
                                    <div>1．在过去6个月内，咳嗽情况：
                                        <el-form-item prop="sgrqPartOnePointOne">

                                            <el-radio-group v-model="item.survey.sgrqPartOnePointOne">
                                                <el-radio label="1周中绝大部分时间" ></el-radio>
                                                <el-radio label="1周中有几天" ></el-radio>
                                                <el-radio label="l月中有几天" ></el-radio>
                                                <el-radio label="仅在肺部感染时" ></el-radio>
                                                <el-radio label="没有" ></el-radio>

                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>2．在过去6个月内，咳痰情况：
                                        <el-form-item prop="sgrqPartOnePointTwo">

                                            <el-radio-group v-model="item.survey.sgrqPartOnePointTwo">
                                                <el-radio label="1周中绝大部分时间" ></el-radio>
                                                <el-radio label="1周中有几天" ></el-radio>
                                                <el-radio label="l月中有几天" ></el-radio>
                                                <el-radio label="仅在肺部感染时" ></el-radio>
                                                <el-radio label="没有" ></el-radio>

                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>3．在过去6个月内，呼吸急促的发生情况：
                                        <el-form-item prop="sgrqPartOnePointThree">

                                            <el-radio-group v-model="item.survey.sgrqPartOnePointThree">
                                                <el-radio label="1周中绝大部分时间" ></el-radio>
                                                <el-radio label="1周中有几天" ></el-radio>
                                                <el-radio label="l月中有几天" ></el-radio>
                                                <el-radio label="仅在肺部感染时" ></el-radio>
                                                <el-radio label="没有" ></el-radio>

                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>4．在过去6个月内，气喘发作情况：
                                        <el-form-item prop="sgrqPartOnePointFour">

                                            <el-radio-group v-model="item.survey.sgrqPartOnePointFour">
                                                <el-radio label="1周中绝大部分时间" ></el-radio>
                                                <el-radio label="1周中有几天" ></el-radio>
                                                <el-radio label="l月中有几天" ></el-radio>
                                                <el-radio label="仅在肺部感染时" ></el-radio>
                                                <el-radio label="没有" ></el-radio>

                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>5．在过去6个月内，我曾出现过几次严重的或极不舒服的呼吸困难：
                                        <el-form-item prop="sgrqPartOnePointFive">

                                            <el-radio-group v-model="item.survey.sgrqPartOnePointFive">
                                                <el-radio label="超过3次" ></el-radio>
                                                <el-radio label="3次发作" ></el-radio>
                                                <el-radio label="2次发作" ></el-radio>
                                                <el-radio label="l次发作" ></el-radio>
                                                <el-radio label="没有发作" ></el-radio>

                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>6．在过去6个月内，平均每周有几天呼吸是正常的（没有呼吸困难）
                                        <el-form-item prop="sgrqPartOnePointSix">

                                            <el-radio-group v-model="item.survey.sgrqPartOnePointSix">
                                                <el-radio label="没有一天正常" ></el-radio>
                                                <el-radio label="l到2天正常" ></el-radio>
                                                <el-radio label="3到4天正常" ></el-radio>
                                                <el-radio label="几乎每天都正常" ></el-radio>
                                                <el-radio label="每一天都正常" ></el-radio>

                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>7．如果有喘息，是否在清晨起来时加重？
                                        <el-form-item prop="sgrqPartOnePointSeven">

                                            <el-radio-group v-model="item.survey.sgrqPartOnePointSeven">
                                                <el-radio label="否" ></el-radio>
                                                <el-radio label="是" ></el-radio>

                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                </el-descriptions-item>



                                <el-descriptions-item label="第二部分：（一）您如何描述您目前的呼吸困难？ ">
                                    <div>1.您如何评价呼吸困难对您生活的影响？
                                        <el-form-item prop="sgrqPartTwoOnePointOne">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoOnePointOne">
                                                <el-radio label="呼吸困难严重影响了我的全部生活" ></el-radio><br>
                                                <el-radio label="呼吸困难影响了我的全部生活" ></el-radio><br>
                                                <el-radio label="呼吸困难影响了我的部分生活" ></el-radio><br>
                                                <el-radio label="呼吸困难没有影响我的生活" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>2．关于呼吸对工作的影响，请从中选择一项
                                        <el-form-item prop="sgrqPartTwoOnePointTwo">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoOnePointTwo">
                                                <el-radio label="我的呼吸问题使我完全中止工作" ></el-radio><br>
                                                <el-radio label="我的呼吸问题影响我的工作或使我改变工作" ></el-radio><br>
                                                <el-radio label="我的呼吸问题不影响我的工作" ></el-radio><br>
                                                <el-radio label="我没有工作" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                </el-descriptions-item>


                                <el-descriptions-item label="第二部分：（二）下面问题是关于这些天来哪些活动经常让您觉得喘不过气来：对于每一个问题根据您的实际情况，选择“是”或“否” ">
                                    <div>1．静坐或静躺
                                        <el-form-item prop="sgrqPartTwoTwoPointOne">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoTwoPointOne">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>2．洗漱或穿衣
                                        <el-form-item prop="sgrqPartTwoTwoPointTwo">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoTwoPointTwo">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>3．在室内走动
                                        <el-form-item prop="sgrqPartTwoTwoPointThree">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoTwoPointThree">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>4．在户外平台上走动
                                        <el-form-item prop="sgrqPartTwoTwoPointFour">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoTwoPointFour">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>5．上一层楼
                                        <el-form-item prop="sgrqPartTwoTwoPointFive">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoTwoPointFive">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>6．爬坡
                                        <el-form-item prop="sgrqPartTwoTwoPointSix">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoTwoPointSix">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>7. 运动性体育活动或运动性游戏
                                        <el-form-item prop="sgrqPartTwoTwoPointSeven">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoTwoPointSeven">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>


                                </el-descriptions-item>

                                <el-descriptions-item label="第二部分：（三）下面问题是关于这些天来您的咳嗽及气喘问题：对于每一个问题根据您的实际情况，选择“是”或“否”">
                                    <div>1．咳嗽使我感到痛苦
                                        <el-form-item prop="sgrqPartTwoThreePointOne">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoThreePointOne">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>2．咳嗽时我感到疲倦
                                        <el-form-item prop="sgrqPartTwoThreePointTwo">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoThreePointTwo">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>3．谈话时，我会感到喘不过气来
                                        <el-form-item prop="sgrqPartTwoThreePointThree">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoThreePointThree">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>4．弯腰时，我觉得喘不过气来
                                        <el-form-item prop="sgrqPartTwoThreePointFour">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoThreePointFour">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>5．咳嗽或呼吸困难影响我的睡眠
                                        <el-form-item prop="sgrqPartTwoThreePointFive">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoThreePointFive">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>6．我经常疲惫不堪
                                        <el-form-item prop="sgrqPartTwoThreePointSix">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoThreePointSix">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>




                                </el-descriptions-item>

                                <el-descriptions-item label="第二部分：（四）下面问题是关于这些天来您的呼吸困难可能对您的其他方面的影响，对于每一个问题根据您的实际情况，选择“是”或“否”">
                                    <div>1．咳嗽或呼吸困难使我心情不愉快
                                        <el-form-item prop="sgrqPartTwoFourPointOne">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoFourPointOne">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>2．我的呼吸问题让我的家人担心
                                        <el-form-item prop="sgrqPartTwoFourPointTwo">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoFourPointTwo">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>3．当喘不过气来时，我感到害怕或惊恐
                                        <el-form-item prop="sgrqPartTwoFourPointThree">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoFourPointThree">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>4．我觉得我的呼吸问题很严重
                                        <el-form-item prop="sgrqPartTwoFourPointFour">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoFourPointFour">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>5．我觉得我的呼吸问题不能好转
                                        <el-form-item prop="sgrqPartTwoFourPointFive">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoFourPointFive">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>6．我的呼吸问题使我变得虚弱、活动不便
                                        <el-form-item prop="sgrqPartTwoFourPointSix">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoFourPointSix">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>7．体育运动对我来说是不安全的
                                        <el-form-item prop="sgrqPartTwoFourPointSeven">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoFourPointSeven">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>8．做任何事情我都很吃力
                                        <el-form-item prop="sgrqPartTwoFourPointEight">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoFourPointEight">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>




                                </el-descriptions-item>


                                <el-descriptions-item label="第二部分：（五）下列问题是关于您的治疗问题，请根据您的实际情况，选择“是”或“否”">
                                    <div>我接受过治疗
                                        <el-form-item prop="sgrqPartTwoFivePoint">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoFivePoint">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>
                                    如果接受过治疗，对于下面每一个问题，请根据您的实际情况，选择“是”或“否”
                                    <div>1．治疗对我来说没有多大帮助
                                        <el-form-item prop="sgrqPartTwoFivePointOne">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoFivePointOne">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>2．在他人面前用药让我感到难堪
                                        <el-form-item prop="sgrqPartTwoFivePointTwo">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoFivePointTwo">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>3．治疗引起了不良的药物副作用
                                        <el-form-item prop="sgrqPartTwoFivePointThree">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoFivePointThree">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>4．治疗严重干扰了我的生活
                                        <el-form-item prop="sgrqPartTwoFivePointFour">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoFivePointFour">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>



                                </el-descriptions-item>


                                <el-descriptions-item label="第二部分：（六）下列问题是关于您的呼吸困难可能如何影响您的活动，对于每一个问题，请根据您的实际情况，选择“是”或“否”">
                                    <div>1．我洗脸刷牙或穿衣时，感到费力
                                        <el-form-item prop="sgrqPartTwoSixPointOne">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoSixPointOne">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>2．我不能洗澡或淋浴，或需要花很长的时间
                                        <el-form-item prop="sgrqPartTwoSixPointTwo">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoSixPointTwo">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>3．我走得比别人慢，或常常停下来休息
                                        <el-form-item prop="sgrqPartTwoSixPointThree">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoSixPointThree">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>4．我做家务事非常慢，或常常停下来休息
                                        <el-form-item prop="sgrqPartTwoSixPointFour">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoSixPointFour">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>5．上一层楼时，我得慢慢走或停下来休息
                                        <el-form-item prop="sgrqPartTwoSixPointFive">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoSixPointFive">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>6．如果赶时间或快走，我不得不休息或放慢速度
                                        <el-form-item prop="sgrqPartTwoSixPointSix">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoSixPointSix">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>7．呼吸困难使我在进行诸如上坡、提东西上楼、在花园中除草、跳舞、练气功或做操等活动时感到困难
                                        <el-form-item prop="sgrqPartTwoSixPointSeven">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoSixPointSeven">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>8．呼吸问题使我在进行诸如搬运重物、在花园中挖土、铲雪、慢跑或快走（8公里/小时）、舞剑或游泳时感到困难
                                        <el-form-item prop="sgrqPartTwoSixPointEight">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoSixPointEight">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>9．呼吸问题使我在进行诸如重体力活、跑步、骑自行车、快速游泳、进行剧烈的体育运动时感到困难
                                        <el-form-item prop="sgrqPartTwoSixPointNine">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoSixPointNine">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>




                                </el-descriptions-item>


                                <el-descriptions-item label="第二部分：（七）下列问题是您的呼吸问题如何影响您，对于每一个问题，请根据您的实际情况，选择“是”或“否”">
                                    <div>1．我不能进行体育活动或运动性活动
                                        <el-form-item prop="sgrqPartTwoSevenPointOne">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoSevenPointOne">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>2．我不能外出娱乐或消遣
                                        <el-form-item prop="sgrqPartTwoSevenPointTwo">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoSevenPointTwo">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>3．我不能外出购物
                                        <el-form-item prop="sgrqPartTwoSevenPointThree">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoSevenPointThree">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>4．我不能做家务
                                        <el-form-item prop="sgrqPartTwoSevenPointFour">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoSevenPointFour">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>5．我不能走得离床或椅子太远
                                        <el-form-item prop="sgrqPartTwoSevenPointFive">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoSevenPointFive">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>






                                </el-descriptions-item>


                                <el-descriptions-item label="下面是一些由于您的呼吸问题无法进行的其他活动项目，请您根据实际情况选择“是”或“否”。">
                                    <div>1．散步或遛狗
                                        <el-form-item prop="sgrqPartTwoEightPointOne">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoEightPointOne">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>2．在家干活
                                        <el-form-item prop="sgrqPartTwoEightPointTwo">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoEightPointTwo">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>3．性生活
                                        <el-form-item prop="sgrqPartTwoEightPointThree">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoEightPointThree">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>4．上商场、菜市场或进行娱乐活动
                                        <el-form-item prop="sgrqPartTwoEightPointFour">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoEightPointFour">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>5．在天气不好时外出或进入有烟味的房间
                                        <el-form-item prop="sgrqPartTwoEightPointFive">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoEightPointFive">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>


                                    <div>6．探亲访友或与孩子玩耍
                                        <el-form-item prop="sgrqPartTwoEightPointSix">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoEightPointSix">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>






                                </el-descriptions-item>

                                <el-descriptions-item label="现在请您选择一项最能反映您的呼吸问题对您的影响的选项">

                                    <el-form-item prop="sgrqPartTwoNinePointOne">

                                        <el-radio-group v-model="item.survey.sgrqPartTwoNinePointOne">
                                            <el-radio label="影响所有我想做的事情" ></el-radio>
                                            <el-radio label="影响我做的大多数事情" ></el-radio>
                                            <el-radio label="影响我想做的1－2件事情" ></el-radio>
                                            <el-radio label="不影响我想做的任何事情" ></el-radio>
                                        </el-radio-group>


                                    </el-form-item>



                                </el-descriptions-item>


                                <el-descriptions-item label="第三部分 （MRC呼吸困难分级）">

                                    <div>据以上调查，请根据您的实际情况选择一项最能反应您的呼吸困难情况的选项
                                        <el-form-item prop="sgrqPartThree">

                                            <el-radio-group v-model="item.survey.sgrqPartThree">
                                                <el-radio label="除剧烈运外，一般不感到呼吸困难" ></el-radio><br>
                                                <el-radio label="平地急行时气短或上坡时气短" ></el-radio><br>
                                                <el-radio label="因气短平地行走时慢于同龄人以自己的步速平地行走时必须停下来喘气" ></el-radio><br>
                                                <el-radio label="平地行走100米或数分钟即有气短" ></el-radio><br>
                                                <el-radio label="因气短而不能离开房间" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>




                                </el-descriptions-item>




                            </el-descriptions>


                            <el-descriptions  title="呼吸困难量表评分（mMRC）" :column="1" :size="size" border>

                                <el-descriptions-item>
                                    <template slot="label">
                                        分级
                                    </template>
                                    临床表现
                                </el-descriptions-item>

                                <el-descriptions-item>
                                    <template slot="label">
                                        0级
                                    </template>
                                    只在剧烈运动时才出现呼吸困难
                                </el-descriptions-item>

                                <el-descriptions-item>
                                    <template slot="label">
                                        1级
                                    </template>
                                    在走路较急或爬缓坡时会出现呼吸困难
                                </el-descriptions-item>

                                <el-descriptions-item>
                                    <template slot="label">
                                        2级
                                    </template>
                                    按平时走路方式走时会出现气短，必须停下来休息，走路比同龄人慢
                                </el-descriptions-item>

                                <el-descriptions-item>
                                    <template slot="label">
                                        3级
                                    </template>
                                    步行100码（91.44米）或几分钟后需要停下来休息
                                </el-descriptions-item>

                                <el-descriptions-item>
                                    <template slot="label">
                                        4级
                                    </template>
                                    因呼吸困难严重不能离家，或穿脱衣时出现呼吸困难
                                </el-descriptions-item>





                            </el-descriptions>

                            <el-form-item prop="level" style="margin: 2%">
                                分级：
                                <el-select v-model="item.survey.level"  clearable placeholder="请选择分级">
                                    <el-option label="0级" value="0级"></el-option>
                                    <el-option label="1级" value="1级"></el-option>
                                    <el-option label="2级" value="2级"></el-option>
                                    <el-option label="3级" value="3级"></el-option>
                                    <el-option label="4级" value="4级"></el-option>

                                </el-select>
                            </el-form-item>



                            <el-form-item style="margin-top: 5%">
                                <el-button type="primary" @click="updateForm">修改</el-button>
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>
                </el-collapse>
            </div>
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
                dialogVisible2:false,
                dialogVisible3:false,
                dialogVisible4:false,
                //----相机相关
                videoWidth: 300,
                videoHeight: 300,
                tongueImgSrc: "",
                thisCancas: null,
                thisContext: null,
                thisVideo: null,
                //------
                currentPage: 1,
                pageSize:10,
                total:null,
                drawer: false,
                //当前诊次，选中时展示在菜单中
                visitSequence:null,
                //建档采集字段
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
                //当前选中的患者id
                nowCollectNo:null,
                  //就诊采集字段
                collectForm:{
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
                    coldAndHeat:[],
                    perspiration:[],
                    perspirationOther:null,
                    spirit:[],
                    spiritOther:null,
                    emotion:[],
                    emotionOther:null,
                    complexion:[],
                    complexionOther:null,
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
                    bodyAndLimbsOthers:null,
                    tongueColor:[],
                    tongueShape:[],
                    tongueState:[],
                    coatingNature:[],
                    coatingColour:[],
                    tongueUnder:[],
                    tongueUnderOther:null,
                    pulseCondition:[],
                    disease:null,
                    syndromeType:null,
                    //处方信息：

                    therapy:null,
                    prescriptionName:null,
                    prescription:null,
                    medicineNum:null,
                    decoctingMethod:null,
                    chinesePatentMedicine:null,
                    acupunctureAndMassage:null,
                    westernMedicinePrescription:null,
                    adviceForFood:null,
                    adviceForDailyLife:null,
                    adviceForEmotion:null,
                    adviceForOther:null,

                    //必要的临床检查
                    hrctDate:null,
                    hrctStore:null,
                    lungFunctionDate:null,
                    lungFunctionStore:null,
                    bloodGasAnalysisDate:null,
                    bloodGasAnalysisStore:null,
                    walkTestDate:null,
                    walkTestStore:null,
                    rayDate:null,
                    rayStore:null,
                    colourSonographyDate:null,
                    colourSonographyStore:null,
                    routineBloodTestDate:null,
                    routineBloodTestStore:null,
                    bloodExaminationDate:null,
                    bloodExaminationStore:null,
                    coagulationFunctionDate:null,
                    coagulationFunctionStore:null,
                    westernMedicineHas:null,
                    westernMedicineMain:[],
                    westernMedicineMainOther:null,
                    chinesePatentMedicineHas:null,
                    chinesePatentMedicineMain:null,
                    therapyHas:null,
                    therapyMain:[],
                    therapyMainOther:null,
                    dataExpansion:null,
                    //疗效评价
                    mymopOnePointOne:null,
                    mymopOnePointOneScore:null,
                    mymopOnePointTwo:null,
                    mymopOnePointTwoScore:null,
                    mymopTwo:null,
                    mymopTwoScore:null,
                    mymopThree:null,
                    mymopFour:null,
                    mymopFive:null,
                    mymopSixPointOne:null,
                    mymopSixPointTwo:null,
                    mymopSeven:null,
                    mymopEight:null,
                    //圣乔治
                    sgrqDescription:null,
                    sgrqPartOnePointOne:null,
                    sgrqPartOnePointTwo:null,
                    sgrqPartOnePointThree:null,
                    sgrqPartOnePointFour:null,
                    sgrqPartOnePointFive:null,
                    sgrqPartOnePointSix:null,
                    sgrqPartOnePointSeven:null,
                    sgrqPartTwoOnePointOne:null,
                    sgrqPartTwoOnePointTwo:null,

                    sgrqPartTwoTwoPointTwo:null,
                    sgrqPartTwoTwoPointThree:null,
                    sgrqPartTwoTwoPointFour:null,
                    sgrqPartTwoTwoPointFive:null,
                    sgrqPartTwoTwoPointSix:null,
                    sgrqPartTwoTwoPointSeven:null,
                    sgrqPartTwoThreePointOne:null,
                    sgrqPartTwoThreePointTwo:null,
                    sgrqPartTwoThreePointThree:null,
                    sgrqPartTwoThreePointFour:null,
                    sgrqPartTwoThreePointFive:null,
                    sgrqPartTwoThreePointSix:null,
                    sgrqPartTwoFourPointOne:null,
                    sgrqPartTwoFourPointTwo:null,
                    sgrqPartTwoFourPointThree:null,
                    sgrqPartTwoFourPointFour:null,
                    sgrqPartTwoFourPointFive:null,
                    sgrqPartTwoFourPointSix:null,
                    sgrqPartTwoFourPointSeven:null,
                    sgrqPartTwoFourPointEight:null,
                    sgrqPartTwoFivePoint:null,
                    sgrqPartTwoFivePointOne:null,
                    sgrqPartTwoFivePointTwo:null,
                    sgrqPartTwoFivePointThree:null,
                    sgrqPartTwoFivePointFour:null,
                    sgrqPartTwoSixPointOne:null,
                    sgrqPartTwoSixPointTwo:null,
                    sgrqPartTwoSixPointThree:null,
                    sgrqPartTwoSixPointFour:null,
                    sgrqPartTwoSixPointFive:null,
                    sgrqPartTwoSixPointSix:null,
                    sgrqPartTwoSixPointSeven:null,
                    sgrqPartTwoSixPointEight:null,
                    sgrqPartTwoSixPointNine:null,
                    sgrqPartTwoSevenPointOne:null,
                    sgrqPartTwoSevenPointTwo:null,
                    sgrqPartTwoSevenPointThree:null,
                    sgrqPartTwoSevenPointFour:null,
                    sgrqPartTwoSevenPointFive:null,
                    sgrqPartTwoEightPointOne:null,
                    sgrqPartTwoEightPointTwo:null,
                    sgrqPartTwoEightPointThree:null,
                    sgrqPartTwoEightPointFour:null,
                    sgrqPartTwoEightPointFive:null,
                    sgrqPartTwoEightPointSix:null,
                    sgrqPartTwoNinePointOne:null,
                    sgrqPartThree:null,
                    level:null,
                    sgrqPartTwoTwoPointOne:null,


                },
                visitHistory:null,
                // 当前操作的某一次就诊历史数据
                visitHistoryItem:null,
                //录音使用
                recorder:null,
                //录音url
                soundRecordingUrl:null
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

            //新建档案
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
                        age:that.ruleForm.age,



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
                        this.onSubmit()

                    }

                })

            },
            resetForm(ruleForm) {
                this.$refs[ruleForm].resetFields();
            },

            resetFormForCollect(collectForm){
                this.$refs[collectForm].resetFields();
            },
            choose(row){
                let that = this
                console.log(row);
                this.nowCollectNo = row.archivesNo
                this.drawer = true

                this.$axios.get("/doctor/visit/getVisitSequence",{
                    //当前选中的患者档案号
                    params:{
                        archivesNo:that.nowCollectNo,
                    },

                }).then(res =>{
                    console.log(res)

                    if (res.data.message == "success"){
                       that.visitSequence = res.data.data.sequence
                    }

                })

            },

            //就诊信息采集-其他
            saveCollectForm(){

                let that= this
                this.$axios.post("/doctor/visit/saveCollectForm",{
                    //当前采集的患者档案号
                    archivesNo:that.nowCollectNo,
                    collectForm:that.collectForm,

                }).then(res =>{
                    console.log(res)
                    that.resetFormForCollect('collectForm')
                    if (res.data.message == "success"){
                        that.dialogVisible2 =false
                        that.$message({
                            showClose: true,
                            message: res.data.data,
                            type: 'success'
                        });



                    }

                })

            },

            //结束本次采集
            over(){
                let that= this
                this.$confirm('该患者本次就诊的相关信息是否采集完成？点击确定患者将会进入下一个诊次。', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {


                    this.$axios.post("/doctor/visit/overNowCollect",{
                        //当前采集的患者档案号
                        archivesNo:that.nowCollectNo,
                    }).then(res =>{
                        console.log(res)

                        if (res.data.message == "success"){
                            that.$message({
                                showClose: true,
                                message: res.data.data,
                                type: 'success'
                            });

                        }

                        this.$axios.get("/doctor/visit/getVisitSequence",{
                            //当前选中的患者档案号
                            params:{
                                archivesNo:that.nowCollectNo,
                            },

                        }).then(res =>{
                            console.log(res)

                            if (res.data.message == "success"){
                                that.visitSequence = res.data.data.sequence
                            }

                        })
                    });

                    })




            },
            //转入随访
            pushFollow(){

                let that= this
                this.$confirm('是否将当前用户转入随访流程？（若患者的诊次大于三次,无需手动转入,系统已自动转入随访流程）', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {


                    this.$axios.post("/doctor/visit/pushFollow",{
                        //当前采集的患者档案号
                        archivesNo:that.nowCollectNo,
                    }).then(res =>{
                        console.log(res)

                        if (res.data.message == "success"){
                            that.$message({
                                showClose: true,
                                message: res.data.data,
                                type: 'success'
                            });

                        }

                    });

                })

            },


            // 调用权限（打开摄像头功能）
            getCompetence() {
                var _this = this;
                this.thisCancas = document.getElementById("canvasCamera");
                this.thisContext = this.thisCancas.getContext("2d");
                this.thisVideo = document.getElementById("videoCamera");
                // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
                if (navigator.mediaDevices === undefined) {
                    navigator.mediaDevices = {};
                }
                // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
                // 使用getUserMedia，因为它会覆盖现有的属性。
                // 这里，如果缺少getUserMedia属性，就添加它。
                if (navigator.mediaDevices.getUserMedia === undefined) {
                    navigator.mediaDevices.getUserMedia = function (constraints) {
                        // 首先获取现存的getUserMedia(如果存在)
                        var getUserMedia =
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.getUserMedia;
                        // 有些浏览器不支持，会返回错误信息
                        // 保持接口一致
                        if (!getUserMedia) {
                            return Promise.reject(
                                new Error("getUserMedia is not implemented in this browser")
                            );
                        }
                        // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
                        return new Promise(function (resolve, reject) {
                            getUserMedia.call(navigator, constraints, resolve, reject);
                        });
                    };
                }
                var constraints = {
                    audio: false,
                    video: {
                        width: this.videoWidth,
                        height: this.videoHeight,
                        transform: "scaleX(-1)",
                    },
                };
                navigator.mediaDevices
                    .getUserMedia(constraints)
                    .then(function (stream) {
                        // 旧的浏览器可能没有srcObject
                        if ("srcObject" in _this.thisVideo) {
                            _this.thisVideo.srcObject = stream;
                        } else {
                            // 避免在新的浏览器中使用它，因为它正在被弃用。
                            _this.thisVideo.src = window.URL.createObjectURL(stream);
                        }
                        _this.thisVideo.onloadedmetadata = function (e) {
                            _this.thisVideo.play();
                        };
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            },
            //  绘制图片（拍照功能）
            setImage() {
                var that = this;
                // 点击，canvas画图
                that.thisContext.drawImage(
                    that.thisVideo,
                    0,
                    0,
                    that.videoWidth,
                    that.videoHeight
                );
                // 获取图片base64链接
                var image = this.thisCancas.toDataURL("image/png");
                that.tongueImgSrc = image;
                this.$emit("refreshDataList", this.tongueImgSrc);
                console.log(this.tongueImgSrc);
            },
            // base64转文件
          /*  dataURLtoFile(dataurl, filename) {
                var arr = dataurl.split(",");
                var mime = arr[0].match(/:(.*?);/)[1];
                var bstr = atob(arr[1]);
                var n = bstr.length;
                var u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new File([u8arr], filename, { type: mime });
            },*/
            // 关闭摄像头
            stopNavigator() {
                this.thisVideo.srcObject.getTracks()[0].stop();
            },



            tongueImgSubimt(){
                let that= this
                if(this.tongueImgSrc == "" || this.tongueImgSrc == null ) {
                    this.$confirm('还未拍照,不能提交', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning'
                    })
                }
                else {


                    this.$confirm('是否确认提交当前采集的图像？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {


                        this.$axios.post("/doctor/visit/tongueImgCollect", {
                            //当前采集的患者档案号
                            archivesNo: that.nowCollectNo,
                            //图像url
                            tongueImgSrc: that.tongueImgSrc,
                            //当前患者诊次
                            sequence : that.visitSequence,
                        }).then(res => {
                            console.log(res)

                            if (res.data.message == "success") {
                                that.$message({
                                    showClose: true,
                                    message: res.data.data,
                                    type: 'success'
                                });
                                //每次采集完，清空url，避免影响下次
                                that.tongueImgSrc = null;

                            }

                        });

                    })
                }
            },

            tongueCollect(){
                this.dialogVisible3 = true,
                    this.tongueImgSrc = null
            },

            getVisitHistory(){
                let that = this
                this.dialogVisible4 = true,
                    this.$axios.get("/doctor/visit/visitHistory", {
                        //当前采集的患者档案号
                        params:{
                            archivesNo: that.nowCollectNo
                        },

                    }).then(res => {
                        that.visitHistory = res.data.data
                        console.log(res.data.data[0].archivesId)
                        console.log(res.data.data[0].survey)

                    });

            },

            //获取历史就诊 点击的某一行绑定的数据
            getHistoryRow(item){
                console.log(item)
                this.visitHistoryItem = item;
            },
            //更新就诊信息
            updateForm(){
               let that = this
                this.$confirm('是否确认修改当前采集信息？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {


                    this.$axios.post("/doctor/visit/updateForm", {
                        id : that.visitHistoryItem.id,  //要修改的数据的id
                        survey:that.visitHistoryItem.survey //需要更新的问卷信息
                    }).then(res => {
                        console.log(res)

                        if (res.data.message == "success") {
                            that.$message({
                                showClose: true,
                                message: res.data.data,
                                type: 'success'
                            });
                        }

                    });

             });

            },
            //提交传承弟子心得（就诊）
            submitExperience(experience,id){
                let that = this
                this.$confirm('是否确认提交？如果已有心得,提交后将会覆盖之前的心得', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {


                    this.$axios.post("/doctor/visit/updateExperience", {
                        id : id,  //要修改的数据的id
                        experience:experience //需要更新的心得
                    }).then(res => {
                        console.log(res)

                        if (res.data.message == "success") {
                            that.$message({
                                showClose: true,
                                message: res.data.data,
                                type: 'success'
                            });
                        }

                    });

                });
            },



             start(item) {
               let recordBtn = document.getElementById("record-btn")
               let player = document.getElementById("audio-player")
                 player.src = item.soundRecordingUrl
                 if (navigator.mediaDevices.getUserMedia) {
                     var chunks = [];
                     const constraints = { audio: true };
                     navigator.mediaDevices.getUserMedia(constraints).then(
                         stream => {
                             console.log("授权成功！");

                             const mediaRecorder = new MediaRecorder(stream);

                             recordBtn.onclick = () => {
                                 if (mediaRecorder.state === "recording") {
                                     mediaRecorder.stop();
                                     recordBtn.textContent = "录音";
                                     console.log("录音结束");
                                 } else {
                                     mediaRecorder.start();
                                     console.log("录音中...");
                                     recordBtn.textContent = "结束";
                                 }
                                 console.log("录音器状态：", mediaRecorder.state);
                             };

                             mediaRecorder.ondataavailable = e => {
                                 chunks.push(e.data);
                             };

                             mediaRecorder.onstop = e => {
                                 var blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
                                 chunks = [];
                               //  var audioURL = window.URL.createObjectURL(blob);
                               //  player.src = audioURL;

                                 this.getBase64(blob).then(res=>{
                                    player.src = res;
                                     item.soundRecordingUrl = res;

                                     console.log(res)
                                 });
                             };
                         },
                         () => {
                             console.error("授权失败！");
                         }
                     );
                 } else {
                     console.error("浏览器不支持 getUserMedia");
                 }
    },
            getBase64(file) {
                return new Promise((resolve, reject) => {
                    let reader = new FileReader();
                    let fileResult = "";
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                        fileResult = reader.result;
                    };
                    reader.onerror = (error) => {
                        reject(error);
                    };
                    reader.onloadend = () => {
                        resolve(fileResult);
                    };
                });
            },
            //提交名老中医点评录音 （就诊）
            submitSoundRecording(id,url){
                let that = this
                this.$confirm('是否确认提交？如果已有点评,提交后将会覆盖之前的点评', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    this.$axios.post("/doctor/visit/updateSound", {
                        id : id,  //要修改的数据的id
                        soundRecordingUrl:url //需要更新的录音
                    }).then(res => {
                        console.log(res)

                        if (res.data.message == "success") {
                            that.$message({
                                showClose: true,
                                message: res.data.data,
                                type: 'success'
                            });
                        }

                    });

                });
            }


    },
        //相机相关方法
        mounted() {
            this.getCompetence();
        },



        //页面渲染时，请求
        created() {
            this.onSubmit()
        }

    }
</script>

<style  scoped>
    .camera_outer {
        position: relative;
        overflow: hidden;
        background-size: 100%;
    }
        video,
        canvas,
        .tx_img {
            -moz-transform: scaleX(-1);
            -webkit-transform: scaleX(-1);
            -o-transform: scaleX(-1);
            transform: scaleX(-1);
        }

        .img_bg_camera {
            position: absolute;
            right: 0;
            top: 0;
        }
            img {
                width: 300px;
                height: 300px;
            }


</style>