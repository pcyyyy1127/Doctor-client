<template>
  <div style="width: 100%;">



    <!--就诊信息档案筛选——回车可执行-->
    <el-form :inline="true" class="demo-form-inline" label-width="200px">
      <!--姓名/档案号筛选-->
      <el-form-item>
        <span>筛选条件</span>
      </el-form-item>
      <el-form-item>
        <el-input v-model="type" clearable placeholder="姓名/档案号"></el-input>
      </el-form-item>
      <!--建档日期筛选-->
      <el-form-item style="margin-left: 10px">
        <span>建档日期</span>
      </el-form-item>
      <el-form-item>
        <!--日期选择器-->
        <el-col :span="8">
          <el-date-picker v-model="rangeDate" end-placeholder="结束日期"
                          range-separator="至" start-placeholder="开始日期" type="daterange">
          </el-date-picker>
        </el-col>
      </el-form-item>
      <!--筛选查询按钮-->
      <el-form-item>
        <el-button style="background-color: #668c5d; border-radius: 10px;color: white" @click="onSubmit">查询</el-button>
      </el-form-item>
      <!--新建档案按钮-->
      <el-form-item>
        <el-button style="background-color: #efbf53; border-radius: 10px;color: white" @click="dialogVisible = true">
          新建档案
        </el-button>
      </el-form-item>
    </el-form>



    <!--档案与操作-->
    <div style="width: 100%;height:80vh; display: flex;flex-direction: row">
      <!--病人档案数据区-->
      <div class="table-column">
        <div class="archives" > 病人档案数据区</div>
        <!--病人档案数据表单,固定表头，表格样式固定-->
<!--        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"-->
        <el-table :data="tableData"
                  border default-expand-all  row-key="id"
                  height="250"
                  style="width: 902px; margin-left: 0px; border-radius: 15px; border: #aaaaaa solid 1px;">
          <el-table-column label="档案号" prop="archivesNo" width="120" ></el-table-column>
          <el-table-column label="建档日期" prop="date" width="120"></el-table-column>
          <el-table-column label="姓名" prop="name" width="120"></el-table-column>
          <el-table-column label="年龄" prop="age" width="70"></el-table-column>
          <el-table-column label="性别" prop="sex" width="70"></el-table-column>
          <el-table-column label="联系电话" prop="phone" width="130"></el-table-column>
          <el-table-column label="地址" prop="address" width="170"></el-table-column>
          <!--操作列-->
          <el-table-column label="操作" prop="option" width="100">
            <!--  <el-button size="mini" round @click="drawer = true">选中</el-button>-->
            <template slot-scope="scope">
              <el-button round size="mini" @click="choose(scope.row)" style="border: #90b477 solid 1px; color:#1f5548; background-color: #d2efc3">选中</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--档案分页-->
        <div class="block">
          <el-pagination
              :current-page="currentPage"
              :page-size="pageSize"
              :page-sizes="[5, 10, 30]"
              :total="total"
              background
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange">
          </el-pagination>
        </div>
      </div>


      <!--就诊操作区-->
      <div class="table-operation">
        <div class="archives">就诊信息采集区</div>

        <!--就诊信息采集-->
        <div class="formOne" style="width: 400px;">

          <div class="form-text">
            <div class="item-text1">诊次</div>
            <div class="item-text2" style="font-size:20px; color: #eebb4e">{{ visitSequence }}次</div>
          </div>
          <div class="form-text">
            <div class="item-text1">就诊</div>
            <div class="item-text2">
              <el-button round size="medium" style="background-color: #1c5149;border-radius: 10px;width:100px; height:50px;color: white" @click="showVisitForm()">采集</el-button>
            </div>
          </div>
          <div class="form-text">
            <div class="item-text1">舌象</div>
            <div class="item-text2">
              <el-button round size="medium" style="background-color: #1c5149;border-radius: 10px; width:100px; height:50px;color: white" @click="tongueCollect()">采集</el-button>
            </div>
          </div>
        </div>

        <!--档案处理区-->
        <div class="table-operation">
          <div class="archives" >就诊档案操作区</div>
          <!--档案处理-->
          <div class="formTwo" >
            <div class="form-text2">
              <div style="width: 50%;">
                <el-button  style="background-color: #edbd51; font-size:18px; border-radius: 10px;width:120px; height:45px;color: white" @click="pushFollow()">转入随访</el-button>
              </div>
              <div  style="width: 50%;">
                <el-button style="background-color: #9ba08a; border-radius: 10px; width:120px; font-size:18px; height:45px;color: white" @click="over()">本次结束</el-button>
              </div>
            </div>
            <div class="form-text2">
              <div  style="width: 50%;">
                <el-button  style="background-color: #668c5d; font-size:18px; border-radius: 10px;width:120px; height:45px;color: white" @click="getVisitHistory()">历史就诊</el-button>
              </div>
              <div  style="width: 50%;">
                <el-button  style="background-color: #1c5149; font-size:18px; border-radius: 10px;width:120px; height:45px;color: white" @click="showMedicalAdvice()">医患沟通</el-button>
              </div>
            </div>



          </div>
        </div>

      </div>
    </div>



    <!--新建档案对话框-->
    <el-dialog :visible.sync="dialogVisible" width="70%" >
      <!--大标题-->
      <h2 style="display: flex;justify-content: center;">基本信息建档</h2>
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" style="margin-top:20px; margin-left: 20px;">

        <el-descriptions :column="1" border direction="vertical"  title="诊断标准" >
          <el-descriptions-item label="1. IPF诊断遵循如下标准 诊断标准：">
            ①排除其他已知原因的ILD(例如家庭或职业环境暴露、结缔组织病和药物毒性)。
            <br>②HRCT表现为UIP型(此类患者不建议行外科肺活检)。
            <br>③已进行外科肺活检的患者，根据HRCT和外科肺活检特定的组合进行诊断。
            <el-form-item label="" prop="checkOne">
              <el-radio-group v-model="ruleForm.checkOne">
                <el-radio label="是"></el-radio>
                <el-radio label="否"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="2. IPF急性加重(acute exacerbation of IPF) IPF病人出现新的弥漫性肺泡损伤导致急性或显著的呼吸困难恶化即为AE-IPF。诊断标准:">
            ①过去或现在诊断IPF；<br>②1个月内发生显著的呼吸困难加重；<br>③CT表现为UIP背景下出现新的双侧磨玻璃影伴或不伴实变影；<br>④不能完全由心衰或液体过载解释。
            <el-form-item label="" prop="checkTwo">
              <el-radio-group v-model="ruleForm.checkTwo">
                <el-radio label="是"></el-radio>
                <el-radio label="否"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-descriptions-item>


        </el-descriptions>
        <el-descriptions>
          <el-descriptions-item label="注">如果以上任何一项答案为“是”，可以诊断为特发性肺纤维化。</el-descriptions-item>
        </el-descriptions>


        <el-descriptions :column="1" border direction="vertical" title="纳入标准（任何一项选“否” 即不能纳入本研究）">
          <el-descriptions-item label="1.符合西医特发性肺纤维化诊断">
            <el-form-item label="" prop="addOne">
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
        <el-descriptions>
          <el-descriptions-item label="注">如果以上任何一项答案为“否”，此患者不能纳入本研究。</el-descriptions-item>
        </el-descriptions>


        <el-descriptions :column="1" border direction="vertical" title="排除标准（任何一项选“是” 即不能纳入本研究）">
          <el-descriptions-item label="1.正在参加其他临床研究者">
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
        <el-descriptions>
          <el-descriptions-item label="注">如果以上任何一项答案为“是”，此患者不能纳入本研究。</el-descriptions-item>
        </el-descriptions>

        <div style="display: flex;justify-content: center">
          <h2>一般资料及主要病史</h2>
        </div>
        <el-descriptions :column="1" border direction="vertical" title="人口学资料">
          <el-descriptions-item label="性别">
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
                <el-date-picker v-model="ruleForm.birth" placeholder="选择日期" style="width: 100%;"
                                type="date"></el-date-picker>
              </el-form-item>
            </el-col>

          </el-descriptions-item>

          <el-descriptions-item label="民族">
            <el-form-item label="" prop="nation">
              <el-radio-group v-model="ruleForm.nation">
                <el-radio label="汉族"></el-radio>
                <el-radio label="壮族"></el-radio>
                <el-radio label="满族"></el-radio>
                <el-radio label="回族"></el-radio>
                <el-radio label="其他"></el-radio>
                <el-input v-model="ruleForm.nation" placeholder="请输入民族" size="mini" style="width: 140px"></el-input>

              </el-radio-group>
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="婚否">
            <el-form-item label="" prop="marriage">
              <el-radio-group v-model="ruleForm.marriage">
                <el-radio label="是"></el-radio>
                <el-radio label="否"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-descriptions-item>


          <el-descriptions-item label="教育程度">
            <el-form-item label="" prop="edu">
              <el-radio-group v-model="ruleForm.edu">
                <el-radio label="硕士以上"></el-radio>
                <el-radio label="本科"></el-radio>
                <el-radio label="大学专科"></el-radio>
                <el-radio label="高中/中专/技校"></el-radio>
                <el-radio label="初中"></el-radio>
                <el-radio label="小学"></el-radio>
                <el-radio label="其他"></el-radio>
                <el-input v-model="ruleForm.edu" placeholder="请输入教育程度" size="mini" style="width: 140px"></el-input>

              </el-radio-group>
            </el-form-item>
          </el-descriptions-item>


          <el-descriptions-item label="职业">
            <el-form-item label="" prop="profession">
              <el-radio-group v-model="ruleForm.profession">
                <el-radio label="工人"></el-radio>
                <el-radio label="农民"></el-radio>
                <el-radio label="教师"></el-radio>
                <el-radio label="军人/警察"></el-radio>
                <el-radio label="学生"></el-radio>
                <el-radio label="公务员"></el-radio>
                <el-radio label="医务工作者"></el-radio>
                <el-radio label="律师"></el-radio>
                <el-radio label="职员"></el-radio>
                <el-radio label="离退休"></el-radio>
                <el-radio label="自由职业者"></el-radio>
                <el-radio label="其他" style="margin-top: 2%"></el-radio>
                <el-input v-model="ruleForm.profession" placeholder="请输入职业" size="mini" style="width: 140px"></el-input>

              </el-radio-group>
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="身高体重">
            <el-form-item label="" prop="height">

              <div>身高(cm)</div>
              <el-input v-model="ruleForm.height" placeholder="请输入身高" size="mini" style="width: 140px"></el-input>

            </el-form-item>
            <el-form-item label="" prop="weight">
              <div>体重(kg)</div>
              <el-input v-model="ruleForm.weight" placeholder="请输入体重" size="mini" style="width: 140px"></el-input>
            </el-form-item>

          </el-descriptions-item>

        </el-descriptions>


        <el-descriptions :column="1" border direction="vertical" title="基本病史">

          <el-descriptions-item label="起病时间">

            <el-col :span="11">
              <el-form-item prop="startDate">
                <el-date-picker v-model="ruleForm.startDate" placeholder="选择日期" style="width: 100%;"
                                type="date"></el-date-picker>
              </el-form-item>
            </el-col>

          </el-descriptions-item>

          <el-descriptions-item label="确诊时间">

            <el-col :span="11">
              <el-form-item prop="sureDate">
                <el-date-picker v-model="ruleForm.sureDate" placeholder="选择日期" style="width: 100%;"
                                type="date"></el-date-picker>
              </el-form-item>
            </el-col>

          </el-descriptions-item>

          <el-descriptions-item label="既往史">
            <el-form-item prop="pastHistory">


              <el-checkbox-group v-model="ruleForm.pastHistory">
                <el-checkbox label="无"></el-checkbox>
                <el-checkbox label="反流性食管炎"></el-checkbox>
                <el-checkbox label="脑卒中"></el-checkbox>
                <el-checkbox label="冠心病"></el-checkbox>
                <el-checkbox label="糖尿病"></el-checkbox>
                <el-checkbox label="高血压"></el-checkbox>
                <el-checkbox label="慢性阻塞性肺病"></el-checkbox>
                <el-checkbox label="睡眠呼吸暂停综合征"></el-checkbox>
                <el-checkbox label="脏器移植史"></el-checkbox>
                <br>
                <el-form-item>
                  <div>特殊药物应用史：(
                    <el-checkbox label="胺碘酮"></el-checkbox>
                    <el-checkbox label="甲氨蝶呤"></el-checkbox>
                    <el-checkbox label="其他特殊药物应用史"></el-checkbox>
                    )
                  </div>

                </el-form-item>


              </el-checkbox-group>
            </el-form-item>

            <el-form-item prop="otherPastHistory">
              <div>
                其他既往史:
                <el-input v-model="ruleForm.otherPastHistory" placeholder="请输入其他既往史" size="mini"
                          style="width: 80%"></el-input>

              </div>


            </el-form-item>
          </el-descriptions-item>


          <el-descriptions-item label="个人史">


            <div>吸烟史(若无则不填)
              <el-form-item prop="smokeHistoryYear">时间（年）：
                <el-input v-model="ruleForm.smokeHistoryYear" placeholder="请输入吸烟史时长（年）" size="mini"
                          style="width: 20%"></el-input>
                (若无则不填)<br></el-form-item>
              <el-form-item prop="smokeNum">支/天：
                <el-input v-model="ruleForm.smokeNum" placeholder="请输入每天吸烟支数" size="mini" style="width: 17%"></el-input>
                (若无则不填)<br></el-form-item>
              <el-form-item prop="noSmokeDays">已戒烟:
                <el-input v-model="ruleForm.noSmokeDays" placeholder="请输入戒除天数" size="mini"
                          style="width: 17%"></el-input>
                天(若未戒则不填)
              </el-form-item>

            </div>

            <div>饮酒史(若无则不填)
              <el-form-item prop="drinkHistoryYear"> 时间(年)：
                <el-input v-model="ruleForm.drinkHistoryYear" placeholder="请输入饮酒史时长（年）" size="mini"
                          style="width: 20%"></el-input>
                (若无则不填)<br></el-form-item>
              <el-form-item prop="whiteDrink">白酒 :
                <el-input v-model="ruleForm.whiteDrink" placeholder="请输入每天白酒饮用量" size="mini"
                          style="width: 17%"></el-input>
                两/天(若无则不填)<br></el-form-item>
              <el-form-item prop="bearDrink">啤酒 :
                <el-input v-model="ruleForm.bearDrink" placeholder="请输入每天啤酒饮用量" size="mini"
                          style="width: 17%"></el-input>
                瓶/天(若无则不填)<br></el-form-item>

              <el-form-item prop="noDrinkDays">已戒酒:
                <el-input v-model="ruleForm.noDrinkDays" placeholder="请输入戒除天数" size="mini"
                          style="width: 17%"></el-input>
                天（若未戒则不填）
              </el-form-item>
            </div>

            <div>职业环境与暴露史(若无则不填)
              <el-form-item prop="exposureHistoryYear"> 时间（年）：
                <el-input v-model="ruleForm.exposureHistoryYear" placeholder="请输入职业环境与暴露史时长（年）" size="mini"
                          style="width: 40%"></el-input>
                (若无则不填)<br></el-form-item>
              <el-form-item prop="exposureHistory"> 职业环境与暴露史类型:
                <el-input v-model="ruleForm.exposureHistory" placeholder="请输入职业环境暴露史类型（如：粉尘）" size="mini"
                          style="width: 40%"></el-input>
                (若无则不填)<br></el-form-item>
            </div>

            <div>宠物嗜好与接触史(若无则不填)
              <el-form-item prop="pets">
                <el-input v-model="ruleForm.pets" placeholder="请输入宠物嗜好与接触史" size="mini" style="width: 40%"></el-input>
                (若无则不填)<br></el-form-item>
            </div>


          </el-descriptions-item>


          <el-descriptions-item label="家族史">


            <el-radio-group v-model="ruleForm.familyHistory">
              <el-form-item prop="familyHistory">
                <el-radio label="无"></el-radio>
                <el-radio label="特发性肺纤维化"></el-radio>
              </el-form-item>

              <el-form-item prop="otherFamilyHistory">
                <div>
                  其他家族史(若无则不填):
                  <el-input v-model="ruleForm.otherFamilyHistory" placeholder="请输入其他家族史" size="mini"
                            style="width: 60%"></el-input>
                </div>
              </el-form-item>

            </el-radio-group>


          </el-descriptions-item>


          <el-descriptions-item label="药物过敏史">


            <el-radio-group v-model="ruleForm.drugAllergyHistory">
              <el-form-item prop="drugAllergyHistory">
                <el-radio label="无"></el-radio>
                <el-radio label="有"></el-radio>
              </el-form-item>
              <el-form-item prop="drugAllergyHistoryDetail">
                <div>
                  如有药物过敏史,详细记载:
                  <el-input v-model="ruleForm.drugAllergyHistoryDetail" placeholder="请输入药物过敏史" size="mini"
                            style="width: 60%"></el-input>
                </div>
              </el-form-item>

            </el-radio-group>


          </el-descriptions-item>

          <el-descriptions-item label="系统字段">


            <div>
              <el-form-item label="姓名" prop="name">
                <el-input v-model="ruleForm.name" placeholder="请输入姓名" size="mini" style="width: 60%"></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="phone">
                <el-input v-model="ruleForm.phone" placeholder="请输入电话" prop="phone" size="mini"
                          style="width: 60%"></el-input>
              </el-form-item>
              <el-form-item label="住址" prop="address">
                <el-input v-model="ruleForm.address" placeholder="请输入住址" prop="address" size="mini"
                          style="width: 60%"></el-input>
              </el-form-item>
              <el-form-item label="出生日期" prop="birthDate">
                <el-date-picker
                    v-model="ruleForm.birthDate"
                    placeholder="选择日期"
                    type="date">
                </el-date-picker>
              </el-form-item>
            </div>


          </el-descriptions-item>


        </el-descriptions>


        <el-form-item style="margin-top: 5%; display: flex;justify-content: center">
          <el-button style=" background-color:#9fc58a;color: white" @click="saveArchives">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>



    <!--就诊信息采集对话框-->
    <el-dialog :visible.sync="dialogVisible2" width="70%">
      <el-form ref="collectForm" :model="collectForm" label-width="100px">
        <div style="display: flex;justify-content: center">
          <h2>中医信息采集</h2>
        </div>
        <el-descriptions :column="1" border direction="vertical">


          <el-descriptions-item label="主诉">

            <el-form-item prop="main">
              <el-input
                  v-model="collectForm.main"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入主诉内容"
                  type="textarea">
              </el-input>
            </el-form-item>


          </el-descriptions-item>

          <el-descriptions-item label="现病史">
            <el-form-item prop="present">
              <el-input v-model="collectForm.present" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入现病史内容" type="textarea">
              </el-input>
            </el-form-item>

          </el-descriptions-item>

          <el-descriptions-item label="刻下症">
            <el-form-item prop="visible">
              <el-input v-model="collectForm.visible" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入刻下症内容" type="textarea">
              </el-input>
            </el-form-item>
          </el-descriptions-item>
        </el-descriptions>

        <div style="margin-top: 20px;display: flex; justify-content: center"> <h3>主症</h3></div>
        <el-descriptions :column="1" border direction="vertical" title="">

          <el-descriptions-item label="咳嗽">
            <el-form-item label="" prop="cough">
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
            <el-form-item prop="degree">
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
                <el-radio label="其他"></el-radio>
                <el-input v-model="collectForm.increaseFactors" placeholder="请输入其他加重因素" size="mini"
                          style="width: 140px"></el-input>
              </el-radio-group>
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="缓解因素">
            <el-form-item prop="decreaseFactors">
              <el-radio-group v-model="collectForm.decreaseFactors">
                <el-radio label="痰出"></el-radio>
                <el-radio label="休息"></el-radio>
                <el-radio label="无明显缓解因素"></el-radio>
                <el-radio label="其他"></el-radio>
                <el-input v-model="collectForm.decreaseFactors" placeholder="请输入其他缓解因素" size="mini"
                          style="width: 140px"></el-input>
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
                <el-input v-model="collectForm.phlegmColor" placeholder="请输入其他痰色" size="mini"
                          style="width: 140px"></el-input>
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
                <el-input v-model="collectForm.phlegmQuality" placeholder="请输入其他痰质" size="mini"
                          style="width: 140px"></el-input>
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
                <el-input v-model="collectForm.phlegmTaste" placeholder="请输入其他痰味" size="mini"
                          style="width: 140px"></el-input>
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
                  <el-input v-model="collectForm.dyspneaIncreaseOther" placeholder="请在此补充其他呼吸困难加重因素" size="mini"
                            style="width: 200px"></el-input>
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
                  <el-input v-model="collectForm.dyspneaDecreaseOther" placeholder="请在此补充其他呼吸困难缓解因素" size="mini"
                            style="width: 200px"></el-input>

                </el-form-item>
              </el-checkbox-group>
            </el-form-item>
          </el-descriptions-item>


          <el-descriptions-item label="呼吸困难程度">
            <el-form-item prop="dyspneaDegree">
              <el-radio-group v-model="collectForm.dyspneaDegree">
                <el-radio label="0级 只在剧烈运动时才出现呼吸困难"></el-radio>
                <br>
                <el-radio label="1级 在走路较急或爬缓坡时会出现呼吸困难"></el-radio>
                <br>
                <el-radio label="2级 按平时走路方式走时会出现气短，必须停下来休息，走路比同龄人慢"></el-radio>
                <br>
                <el-radio label="3级 步行100码（91.44米）或几分钟后需要停下来休息"></el-radio>
                <br>
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
                  <el-input v-model="collectForm.accompanyingSymptomsOther" placeholder="请在此补充其他伴随症状" size="mini"
                            style="width: 200px"></el-input>

                </el-form-item>
              </el-checkbox-group>
            </el-form-item>
          </el-descriptions-item>


        </el-descriptions>

        <div style="margin-top: 20px;display: flex; justify-content: center"> <h3>中医证候信息表</h3></div>
        <el-descriptions :column="1" border direction="vertical"  title="">

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
                  <el-input v-model="collectForm.pulmonarySystemOther" placeholder="请在此补充其他肺系情况" size="mini"
                            style="width: 200px"></el-input>
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
                  <el-input v-model="collectForm.perspirationOther" placeholder="请在此补充其他汗出情况" size="mini"
                            style="width: 200px"></el-input>
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
                  <el-input v-model="collectForm.spiritOther" placeholder="请在此补充其他精神情况" size="mini"
                            style="width: 200px"></el-input>
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
                  <el-input v-model="collectForm.emotionOther" placeholder="请在此补充其他情志情况" size="mini"
                            style="width: 200px"></el-input>

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
                <el-checkbox label="青紫"></el-checkbox>
                <br>
                <el-checkbox label="晦暗"></el-checkbox>
                <el-checkbox label="面色黧黑、肌肤甲错"></el-checkbox>
                <el-checkbox label="其他"></el-checkbox>
                <el-form-item prop="complexionOther">
                  <el-input v-model="collectForm.complexionOther" placeholder="请在此补充其他面色情况" size="mini"
                            style="width: 200px"></el-input>

                </el-form-item>

              </el-checkbox-group>
            </el-form-item>
          </el-descriptions-item>


          <el-descriptions-item label="饮食">
            <el-form-item>
              <div>食：</div>
              <el-form-item prop="food">
                <el-checkbox-group v-model="collectForm.food">
                  <el-checkbox label="正常"></el-checkbox>
                  <el-checkbox label="纳差"></el-checkbox>
                  <el-checkbox label="饥不欲食"></el-checkbox>
                  <el-checkbox label="消谷善饥"></el-checkbox>
                  <el-checkbox label="恶心呕吐"></el-checkbox>
                  <br>
                  <el-checkbox label="朝食暮吐、暮食朝吐"></el-checkbox>
                  <el-checkbox label="脘闷"></el-checkbox>
                  <el-checkbox label="腹胀"></el-checkbox>
                  <el-checkbox label="其他"></el-checkbox>
                  <el-form-item prop="foodOther">
                    <el-input v-model="collectForm.foodOther" placeholder="请在此补充其他" size="mini"
                              style="width: 200px"></el-input>

                  </el-form-item>

                </el-checkbox-group>
              </el-form-item>

              <div>饮：</div>
              <el-form-item prop="drink">
                <el-checkbox-group v-model="collectForm.drink">
                  <el-checkbox label="正常"></el-checkbox>
                  <el-checkbox label="口不渴"></el-checkbox>
                  <el-checkbox label="渴喜冷饮"></el-checkbox>
                  <el-checkbox label="渴喜热饮"></el-checkbox>
                  <el-checkbox label="渴不欲饮"></el-checkbox>
                  <br>
                  <el-checkbox label="渴饮不多"></el-checkbox>
                  <el-checkbox label="口渴但欲漱水不欲咽"></el-checkbox>
                  <el-checkbox label="水入即吐"></el-checkbox>
                  <el-checkbox label="其他"></el-checkbox>
                  <el-form-item prop="drinkOther">
                    <el-input v-model="collectForm.drinkOther" placeholder="请在此补充其他" size="mini"
                              style="width: 200px"></el-input>
                  </el-form-item>
                </el-checkbox-group>
              </el-form-item>
              <div>味：</div>
              <el-form-item prop="taste">
                <el-checkbox-group v-model="collectForm.taste">
                  <el-checkbox label="正常"></el-checkbox>
                  <el-checkbox label="口苦"></el-checkbox>
                  <el-checkbox label="口淡"></el-checkbox>
                  <el-checkbox label="口咸"></el-checkbox>
                  <el-checkbox label="口腥"></el-checkbox>
                  <br>
                  <el-checkbox label="口甜"></el-checkbox>
                  <el-checkbox label="口腻"></el-checkbox>
                  <el-checkbox label="其他"></el-checkbox>
                  <el-form-item prop="tasteOther">
                    <el-input v-model="collectForm.tasteOther" placeholder="请在此补充其他" size="mini"
                              style="width: 200px"></el-input>
                  </el-form-item>
                </el-checkbox-group>
              </el-form-item>
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
                <el-checkbox label="小便涩痛"></el-checkbox>
                <br>
                <el-checkbox label="淋漓不尽"></el-checkbox>
                <el-checkbox label="遗尿"></el-checkbox>
                <el-checkbox label="其他"></el-checkbox>
                <el-form-item prop="urineOther">
                  <el-input v-model="collectForm.urineOther" placeholder="请在此补充其他小便情况" size="mini"
                            style="width: 200px"></el-input>

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
                <el-checkbox label="完谷不化"></el-checkbox>
                <br>
                <el-checkbox label="其他"></el-checkbox>
                <el-form-item prop="defecateOther">
                  <el-input v-model="collectForm.defecateOther" placeholder="请在此补充其他大便情况" size="mini"
                            style="width: 200px"></el-input>

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
                  <el-input v-model="collectForm.sleepOther" placeholder="请在此补充其他睡眠情况" size="mini"
                            style="width: 200px"></el-input>

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
                  <el-input v-model="collectForm.bodyAndLimbsOthers" placeholder="请在此补充其他周身四肢情况" size="mini"
                            style="width: 200px"></el-input>

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
                  <el-input v-model="collectForm.tongueUnderOther" placeholder="请在此补充其他舌下络脉情况" size="mini"
                            style="width: 200px"></el-input>
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
                  v-model="collectForm.disease"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入中医诊断疾病内容"
                  type="textarea">
              </el-input>

            </el-form-item>

            <el-form-item prop="syndromeType">
              <div>证型：</div>
              <el-input
                  v-model="collectForm.syndromeType"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入中医诊断证型内容"
                  type="textarea">
              </el-input>

            </el-form-item>
          </el-descriptions-item>


        </el-descriptions>

        <div style="margin-top: 20px;display: flex; justify-content: center"> <h3>处方信息</h3></div>
        <el-descriptions :column="1" border direction="vertical"  title="">
          <el-descriptions-item label="治法">
            <el-form-item prop="therapy">
              <el-input
                  v-model="collectForm.therapy"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入治法"
                  type="textarea">
              </el-input>


            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="方剂名称">
            <el-form-item prop="prescriptionName">
              <el-input
                  v-model="collectForm.prescriptionName"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入方剂名称"
                  type="textarea">
              </el-input>

            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="中药处方">
            <el-form-item prop="prescription">
              <el-input
                  v-model="collectForm.prescription"
                  :autosize="{ minRows: 5, maxRows: 10}"
                  placeholder="请输入中药处方"
                  type="textarea">
              </el-input>

            </el-form-item>
            <el-form-item prop="medicineNum">
              <div>
                <el-input-number v-model="collectForm.medicineNum" :max="999" :min="1"></el-input-number>
                剂
              </div>


            </el-form-item>
            <el-form-item prop="decoctingMethod">
              <div>煎服法：</div>
              <el-input
                  v-model="collectForm.decoctingMethod"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入煎服法"
                  type="textarea">
              </el-input>
            </el-form-item>

          </el-descriptions-item>

          <el-descriptions-item label="中成药处方">
            <el-form-item prop="chinesePatentMedicine">
              <el-input
                  v-model="collectForm.chinesePatentMedicine"
                  :autosize="{ minRows: 5, maxRows: 10}"
                  placeholder="请输入中成药处方"
                  type="textarea">
              </el-input>
            </el-form-item>

          </el-descriptions-item>

          <el-descriptions-item label="针灸推拿">
            <el-form-item prop="acupunctureAndMassage">
              <el-input
                  v-model="collectForm.acupunctureAndMassage"
                  :autosize="{ minRows: 5, maxRows: 10}"
                  placeholder="请输入针灸推拿相关内容"
                  type="textarea">
              </el-input>
            </el-form-item>

          </el-descriptions-item>

          <el-descriptions-item label="西药处方">
            <el-form-item prop="westernMedicinePrescription">
              <el-input
                  v-model="collectForm.westernMedicinePrescription"
                  :autosize="{ minRows: 5, maxRows: 10}"
                  placeholder="请输入西药处方"
                  type="textarea">
              </el-input>
            </el-form-item>

          </el-descriptions-item>

          <el-descriptions-item label="医嘱">
            <el-form-item prop="adviceForFood">
              <div>饮食：</div>
              <el-input
                  v-model="collectForm.adviceForFood"
                  :autosize="{ minRows: 5, maxRows: 10}"
                  placeholder="请输入饮食相关医嘱"
                  type="textarea">
              </el-input>
            </el-form-item>

            <el-form-item prop="adviceForDailyLife">
              <div>起居：</div>
              <el-input
                  v-model="collectForm.adviceForDailyLife"
                  :autosize="{ minRows: 5, maxRows: 10}"
                  placeholder="请输入起居相关医嘱"
                  type="textarea">
              </el-input>
            </el-form-item>

            <el-form-item prop="adviceForEmotion">
              <div>情志：</div>
              <el-input
                  v-model="collectForm.adviceForEmotion"
                  :autosize="{ minRows: 5, maxRows: 10}"
                  placeholder="请输入情志相关医嘱"
                  type="textarea">
              </el-input>
            </el-form-item>

            <el-form-item prop="adviceForOther">
              <div>其他：</div>
              <el-input
                  v-model="collectForm.adviceForOther"
                  :autosize="{ minRows: 5, maxRows: 10}"
                  placeholder="请输入其他医嘱"
                  type="textarea">
              </el-input>
            </el-form-item>

          </el-descriptions-item>

          <el-descriptions-item label="">
            <div>必要的临床检查</div>
            <div>胸部HRCT：</div>
            <el-form-item prop="hrctDate">

              <div>检查日期：
                <el-date-picker v-model="collectForm.hrctDate" placeholder="选择日期" style="width: 50%;"
                                type="date"></el-date-picker>
              </div>
            </el-form-item>
            <el-form-item prop="hrctStore">
              <div>是否已留存：
                <el-radio-group v-model="collectForm.hrctStore">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>

                </el-radio-group>

              </div>
            </el-form-item>


            <div>肺功能：</div>
            <el-form-item prop="lungFunctionDate">

              <div>检查日期：
                <el-date-picker v-model="collectForm.lungFunctionDate" placeholder="选择日期" style="width: 50%;"
                                type="date"></el-date-picker>
              </div>
            </el-form-item>
            <el-form-item prop="lungFunctionStore">
              <div>是否已留存：
                <el-radio-group v-model="collectForm.lungFunctionStore">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>

                </el-radio-group>

              </div>
            </el-form-item>


            <div>动脉血气分析：</div>
            <el-form-item prop="bloodGasAnalysisDate">

              <div>检查日期：
                <el-date-picker v-model="collectForm.bloodGasAnalysisDate" placeholder="选择日期" style="width: 50%;"
                                type="date"></el-date-picker>
              </div>
            </el-form-item>
            <el-form-item prop="bloodGasAnalysisStore">
              <div>是否已留存：
                <el-radio-group v-model="collectForm.bloodGasAnalysisStore">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>

                </el-radio-group>

              </div>
            </el-form-item>


            <div>6分钟步行试验：</div>
            <el-form-item prop="walkTestDate">

              <div>检查日期：
                <el-date-picker v-model="collectForm.walkTestDate" placeholder="选择日期" style="width: 50%;"
                                type="date"></el-date-picker>
              </div>
            </el-form-item>
            <el-form-item prop="walkTestStore">
              <div>是否已留存：
                <el-radio-group v-model="collectForm.walkTestStore">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>

                </el-radio-group>

              </div>
            </el-form-item>


            <div>胸部X线：</div>
            <el-form-item prop="rayDate">

              <div>检查日期：
                <el-date-picker v-model="collectForm.rayDate" placeholder="选择日期" style="width: 50%;"
                                type="date"></el-date-picker>
              </div>
            </el-form-item>
            <el-form-item prop="rayStore">
              <div>是否已留存：
                <el-radio-group v-model="collectForm.rayStore">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>

                </el-radio-group>

              </div>
            </el-form-item>


            <div>心脏彩超：</div>
            <el-form-item prop="colourSonographyDate">

              <div>检查日期：
                <el-date-picker v-model="collectForm.colourSonographyDate" placeholder="选择日期" style="width: 50%;"
                                type="date"></el-date-picker>
              </div>
            </el-form-item>
            <el-form-item prop="colourSonographyStore">
              <div>是否已留存：
                <el-radio-group v-model="collectForm.colourSonographyStore">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>

                </el-radio-group>

              </div>
            </el-form-item>


            <div>血常规：</div>
            <el-form-item prop="routineBloodTestDate">

              <div>检查日期：
                <el-date-picker v-model="collectForm.routineBloodTestDate" placeholder="选择日期" style="width: 50%;"
                                type="date"></el-date-picker>
              </div>
            </el-form-item>
            <el-form-item prop="routineBloodTestStore">
              <div>是否已留存：
                <el-radio-group v-model="collectForm.routineBloodTestStore">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>

                </el-radio-group>

              </div>
            </el-form-item>


            <div>血生化检查：</div>
            <el-form-item prop="bloodExaminationDate">

              <div>检查日期：
                <el-date-picker v-model="collectForm.bloodExaminationDate" placeholder="选择日期" style="width: 50%;"
                                type="date"></el-date-picker>
              </div>
            </el-form-item>
            <el-form-item prop="bloodExaminationStore">
              <div>是否已留存：
                <el-radio-group v-model="collectForm.bloodExaminationStore">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>

                </el-radio-group>

              </div>
            </el-form-item>


            <div>凝血功能和D二聚体：</div>
            <el-form-item prop="coagulationFunctionDate">

              <div>检查日期：
                <el-date-picker v-model="collectForm.coagulationFunctionDate" placeholder="选择日期" style="width: 50%;"
                                type="date"></el-date-picker>
              </div>
            </el-form-item>
            <el-form-item prop="coagulationFunctionStore">
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
              <el-input v-model="collectForm.westernMedicineMainOther" placeholder="请在此补充其他西药" size="mini"
                        style="width: 200px"></el-input>
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
              <el-input v-model="collectForm.chinesePatentMedicineMain" placeholder="请在此补充主要中成药名称" size="mini"
                        style="width: 500px"></el-input>
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
              <el-input v-model="collectForm.therapyMainOther" placeholder="请在此补充其他疗法" size="mini"
                        style="width: 200px"></el-input>
            </el-form-item>


          </el-descriptions-item>

        </el-descriptions>

        <div style="margin-top: 20px;display: flex; justify-content: center"> <h3>病例资料拓展（特色模块）</h3></div>
        <el-descriptions :column="1" border direction="vertical" title="">

          <el-descriptions-item label="病例资料拓展">
            <el-form-item prop="dataExpansion">
              <el-input
                  v-model="collectForm.dataExpansion"
                  :autosize="{ minRows: 25, maxRows: 999}"
                  placeholder="请在此补充病例资料"
                  type="textarea">
              </el-input>

            </el-form-item>
          </el-descriptions-item>
        </el-descriptions>


        <span style="justify-content: center;display: flex"><h3>疗效评价</h3></span>

        <div style="margin-top: 20px;display: flex; justify-content: center"> <h3>自评医疗成效问卷（MYMOP）</h3></div>
        <el-descriptions :column="1" border direction="vertical" title="">

          <el-descriptions-item label="1.请选出一或两项最令你困扰的症状（可以身体上或精神上的），写在下方输入框中。
并把适当的数字勾上以表示该症状在过去一星期的情况有多坏（0代表情况算是最好，6代表情况算是最坏）">
            <el-form-item prop="mymopOnePointOne">
              <div>症状一：</div>
              <el-input v-model="collectForm.mymopOnePointOne" placeholder="请在此填写症状一" style="width: 20%">
              </el-input>

              <el-form-item prop="mymopOnePointOneScore">
                <div>情况算是最好
                  <el-radio-group v-model="collectForm.mymopOnePointOneScore">
                    <el-radio label="1"></el-radio>
                    <el-radio label="2"></el-radio>
                    <el-radio label="3"></el-radio>
                    <el-radio label="4"></el-radio>
                    <el-radio label="5"></el-radio>
                    <el-radio label="6"></el-radio>
                  </el-radio-group>
                  情况算是最坏
                </div>
              </el-form-item>
            </el-form-item>


            <el-form-item prop="mymopOnePointTwo">
              <div>症状二：</div>
              <el-input v-model="collectForm.mymopOnePointTwo" placeholder="请在此填写症状二" style="width: 20%">
              </el-input>

              <el-form-item prop="mymopOnePointTwoScore">
                <div>情况算是最好
                  <el-radio-group v-model="collectForm.mymopOnePointTwoScore">
                    <el-radio label="1"></el-radio>
                    <el-radio label="2"></el-radio>
                    <el-radio label="3"></el-radio>
                    <el-radio label="4"></el-radio>
                    <el-radio label="5"></el-radio>
                    <el-radio label="6"></el-radio>
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
              <el-input v-model="collectForm.mymopTwo" placeholder="请在此填写活动" style="width: 20%">
              </el-input>

              <el-form-item prop="mymopTwoScore">
                <div>情况算是最好
                  <el-radio-group v-model="collectForm.mymopTwoScore">
                    <el-radio label="1"></el-radio>
                    <el-radio label="2"></el-radio>
                    <el-radio label="3"></el-radio>
                    <el-radio label="4"></el-radio>
                    <el-radio label="5"></el-radio>
                    <el-radio label="6"></el-radio>
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
                  <el-radio label="1"></el-radio>
                  <el-radio label="2"></el-radio>
                  <el-radio label="3"></el-radio>
                  <el-radio label="4"></el-radio>
                  <el-radio label="5"></el-radio>
                  <el-radio label="6"></el-radio>
                </el-radio-group>
                情况算是最坏
              </div>
            </el-form-item>

          </el-descriptions-item>

          <el-descriptions-item label="4.你上述的 症状一出现了多久？（不论是连续出现，或是断续地出现）">


            <el-form-item prop="mymopFour">
              <div>
                <el-radio-group v-model="collectForm.mymopFour">
                  <el-radio label="0-4星期"></el-radio>
                  <el-radio label="4-12星期"></el-radio>
                  <el-radio label="3个月至1年"></el-radio>
                  <el-radio label="1-5年"></el-radio>
                  <el-radio label="超过5年"></el-radio>
                </el-radio-group>

              </div>
            </el-form-item>

          </el-descriptions-item>


          <el-descriptions-item label="5.你有没有使用任何药物来治疗症状一？">


            <el-form-item prop="mymopFive">
              <div>
                <el-radio-group v-model="collectForm.mymopFive">
                  <el-radio label="有"></el-radio>
                  <el-radio label="没有（跳至第8题）"></el-radio>

                </el-radio-group>

              </div>
            </el-form-item>

          </el-descriptions-item>

          <el-descriptions-item label="6.请写出该药物的名称及每天／每周使用量。">


            <el-form-item prop="mymopSixPointOne">
              <div>药物名称：
                <el-input v-model="collectForm.mymopSixPointOne" placeholder="请在此填写药物名称" style="width: 20%">
                </el-input>
              </div>

            </el-form-item>

            <el-form-item prop="mymopSixPointTwo">
              <div>使用量：
                <el-input v-model="collectForm.mymopSixPointTwo" placeholder="请在此填写使用量" style="width: 20%">
                </el-input>
              </div>

            </el-form-item>


          </el-descriptions-item>


          <el-descriptions-item label="7.你认为减少使用这些药物有多重要？">


            <el-form-item prop="mymopSeven">
              <div>
                <el-radio-group v-model="collectForm.mymopSeven">
                  <el-radio label="不重要"></el-radio>
                  <el-radio label="少许重要"></el-radio>
                  <el-radio label="非常重要"></el-radio>
                  <el-radio label="不适用"></el-radio>

                </el-radio-group>

              </div>
            </el-form-item>

          </el-descriptions-item>


          <el-descriptions-item label="8.对症状一来说，你认为不使用任何药物有多重要？">


            <el-form-item prop="mymopEight">
              <div>
                <el-radio-group v-model="collectForm.mymopEight">
                  <el-radio label="不重要"></el-radio>
                  <el-radio label="少许重要"></el-radio>
                  <el-radio label="非常重要"></el-radio>
                  <el-radio label="不适用"></el-radio>

                </el-radio-group>

              </div>
            </el-form-item>

          </el-descriptions-item>


        </el-descriptions>

        <div style="margin-top: 20px;display: flex; justify-content: center"> <h3>圣乔治呼吸调查问卷</h3></div>
        <el-descriptions :column="1" border direction="vertical" title="">
          <el-descriptions-item label="这份问卷是用来帮助我们了解你的呼吸问题是如何正在困扰你的，以及它是如何影响你的生活的。我们通过它发现疾病在哪一方面对你的影响最大,但这不是医生或护士所认为的那些问题。
                        请仔细阅读下列指导性语句，若有不明白之处请提问。不要花费太长的时间来决定你的答案。在完成余下的问卷前，请选择一个能体现你目前健康状况的描述：">
            <div></div>
            <el-form-item prop="sgrqDescription">

              <el-radio-group v-model="collectForm.sgrqDescription">
                <el-radio label="很好"></el-radio>
                <el-radio label="好"></el-radio>
                <el-radio label="一般"></el-radio>
                <el-radio label="不好"></el-radio>
                <el-radio label="很差"></el-radio>

              </el-radio-group>


            </el-form-item>
          </el-descriptions-item>


          <el-descriptions-item label="第一部分：关于过去6个月内您的呼吸困难问题，每个问题只选择一个答案：">
            <div>1．在过去6个月内，咳嗽情况：
              <el-form-item prop="sgrqPartOnePointOne">

                <el-radio-group v-model="collectForm.sgrqPartOnePointOne">
                  <el-radio label="1周中绝大部分时间"></el-radio>
                  <el-radio label="1周中有几天"></el-radio>
                  <el-radio label="l月中有几天"></el-radio>
                  <el-radio label="仅在肺部感染时"></el-radio>
                  <el-radio label="没有"></el-radio>

                </el-radio-group>


              </el-form-item>
            </div>

            <div>2．在过去6个月内，咳痰情况：
              <el-form-item prop="sgrqPartOnePointTwo">

                <el-radio-group v-model="collectForm.sgrqPartOnePointTwo">
                  <el-radio label="1周中绝大部分时间"></el-radio>
                  <el-radio label="1周中有几天"></el-radio>
                  <el-radio label="l月中有几天"></el-radio>
                  <el-radio label="仅在肺部感染时"></el-radio>
                  <el-radio label="没有"></el-radio>

                </el-radio-group>


              </el-form-item>
            </div>

            <div>3．在过去6个月内，呼吸急促的发生情况：
              <el-form-item prop="sgrqPartOnePointThree">

                <el-radio-group v-model="collectForm.sgrqPartOnePointThree">
                  <el-radio label="1周中绝大部分时间"></el-radio>
                  <el-radio label="1周中有几天"></el-radio>
                  <el-radio label="l月中有几天"></el-radio>
                  <el-radio label="仅在肺部感染时"></el-radio>
                  <el-radio label="没有"></el-radio>

                </el-radio-group>


              </el-form-item>
            </div>

            <div>4．在过去6个月内，气喘发作情况：
              <el-form-item prop="sgrqPartOnePointFour">

                <el-radio-group v-model="collectForm.sgrqPartOnePointFour">
                  <el-radio label="1周中绝大部分时间"></el-radio>
                  <el-radio label="1周中有几天"></el-radio>
                  <el-radio label="l月中有几天"></el-radio>
                  <el-radio label="仅在肺部感染时"></el-radio>
                  <el-radio label="没有"></el-radio>

                </el-radio-group>


              </el-form-item>
            </div>

            <div>5．在过去6个月内，我曾出现过几次严重的或极不舒服的呼吸困难：
              <el-form-item prop="sgrqPartOnePointFive">

                <el-radio-group v-model="collectForm.sgrqPartOnePointFive">
                  <el-radio label="超过3次"></el-radio>
                  <el-radio label="3次发作"></el-radio>
                  <el-radio label="2次发作"></el-radio>
                  <el-radio label="l次发作"></el-radio>
                  <el-radio label="没有发作"></el-radio>

                </el-radio-group>


              </el-form-item>
            </div>

            <div>6．在过去6个月内，平均每周有几天呼吸是正常的（没有呼吸困难）
              <el-form-item prop="sgrqPartOnePointSix">

                <el-radio-group v-model="collectForm.sgrqPartOnePointSix">
                  <el-radio label="没有一天正常"></el-radio>
                  <el-radio label="l到2天正常"></el-radio>
                  <el-radio label="3到4天正常"></el-radio>
                  <el-radio label="几乎每天都正常"></el-radio>
                  <el-radio label="每一天都正常"></el-radio>

                </el-radio-group>


              </el-form-item>
            </div>

            <div>7．如果有喘息，是否在清晨起来时加重？
              <el-form-item prop="sgrqPartOnePointSeven">

                <el-radio-group v-model="collectForm.sgrqPartOnePointSeven">
                  <el-radio label="否"></el-radio>
                  <el-radio label="是"></el-radio>

                </el-radio-group>


              </el-form-item>
            </div>

          </el-descriptions-item>


          <el-descriptions-item label="第二部分：（一）您如何描述您目前的呼吸困难？ ">
            <div>1.您如何评价呼吸困难对您生活的影响？
              <el-form-item prop="sgrqPartTwoOnePointOne">

                <el-radio-group v-model="collectForm.sgrqPartTwoOnePointOne">
                  <el-radio label="呼吸困难严重影响了我的全部生活"></el-radio>
                  <br>
                  <el-radio label="呼吸困难影响了我的全部生活"></el-radio>
                  <br>
                  <el-radio label="呼吸困难影响了我的部分生活"></el-radio>
                  <br>
                  <el-radio label="呼吸困难没有影响我的生活"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>2．关于呼吸对工作的影响，请从中选择一项
              <el-form-item prop="sgrqPartTwoOnePointTwo">

                <el-radio-group v-model="collectForm.sgrqPartTwoOnePointTwo">
                  <el-radio label="我的呼吸问题使我完全中止工作"></el-radio>
                  <br>
                  <el-radio label="我的呼吸问题影响我的工作或使我改变工作"></el-radio>
                  <br>
                  <el-radio label="我的呼吸问题不影响我的工作"></el-radio>
                  <br>
                  <el-radio label="我没有工作"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

          </el-descriptions-item>


          <el-descriptions-item label="第二部分：（二）下面问题是关于这些天来哪些活动经常让您觉得喘不过气来：对于每一个问题根据您的实际情况，选择“是”或“否” ">
            <div>1．静坐或静躺
              <el-form-item prop="sgrqPartTwoTwoPointOne">

                <el-radio-group v-model="collectForm.sgrqPartTwoTwoPointOne">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>2．洗漱或穿衣
              <el-form-item prop="sgrqPartTwoTwoPointTwo">

                <el-radio-group v-model="collectForm.sgrqPartTwoTwoPointTwo">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>3．在室内走动
              <el-form-item prop="sgrqPartTwoTwoPointThree">

                <el-radio-group v-model="collectForm.sgrqPartTwoTwoPointThree">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>4．在户外平台上走动
              <el-form-item prop="sgrqPartTwoTwoPointFour">

                <el-radio-group v-model="collectForm.sgrqPartTwoTwoPointFour">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>5．上一层楼
              <el-form-item prop="sgrqPartTwoTwoPointFive">

                <el-radio-group v-model="collectForm.sgrqPartTwoTwoPointFive">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>6．爬坡
              <el-form-item prop="sgrqPartTwoTwoPointSix">

                <el-radio-group v-model="collectForm.sgrqPartTwoTwoPointSix">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>7. 运动性体育活动或运动性游戏
              <el-form-item prop="sgrqPartTwoTwoPointSeven">

                <el-radio-group v-model="collectForm.sgrqPartTwoTwoPointSeven">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>


          </el-descriptions-item>

          <el-descriptions-item label="第二部分：（三）下面问题是关于这些天来您的咳嗽及气喘问题：对于每一个问题根据您的实际情况，选择“是”或“否”">
            <div>1．咳嗽使我感到痛苦
              <el-form-item prop="sgrqPartTwoThreePointOne">

                <el-radio-group v-model="collectForm.sgrqPartTwoThreePointOne">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>2．咳嗽时我感到疲倦
              <el-form-item prop="sgrqPartTwoThreePointTwo">

                <el-radio-group v-model="collectForm.sgrqPartTwoThreePointTwo">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>3．谈话时，我会感到喘不过气来
              <el-form-item prop="sgrqPartTwoThreePointThree">

                <el-radio-group v-model="collectForm.sgrqPartTwoThreePointThree">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>4．弯腰时，我觉得喘不过气来
              <el-form-item prop="sgrqPartTwoThreePointFour">

                <el-radio-group v-model="collectForm.sgrqPartTwoThreePointFour">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>5．咳嗽或呼吸困难影响我的睡眠
              <el-form-item prop="sgrqPartTwoThreePointFive">

                <el-radio-group v-model="collectForm.sgrqPartTwoThreePointFive">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>6．我经常疲惫不堪
              <el-form-item prop="sgrqPartTwoThreePointSix">

                <el-radio-group v-model="collectForm.sgrqPartTwoThreePointSix">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>


          </el-descriptions-item>

          <el-descriptions-item label="第二部分：（四）下面问题是关于这些天来您的呼吸困难可能对您的其他方面的影响，对于每一个问题根据您的实际情况，选择“是”或“否”">
            <div>1．咳嗽或呼吸困难使我心情不愉快
              <el-form-item prop="sgrqPartTwoFourPointOne">

                <el-radio-group v-model="collectForm.sgrqPartTwoFourPointOne">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>2．我的呼吸问题让我的家人担心
              <el-form-item prop="sgrqPartTwoFourPointTwo">

                <el-radio-group v-model="collectForm.sgrqPartTwoFourPointTwo">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>3．当喘不过气来时，我感到害怕或惊恐
              <el-form-item prop="sgrqPartTwoFourPointThree">

                <el-radio-group v-model="collectForm.sgrqPartTwoFourPointThree">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>4．我觉得我的呼吸问题很严重
              <el-form-item prop="sgrqPartTwoFourPointFour">

                <el-radio-group v-model="collectForm.sgrqPartTwoFourPointFour">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>5．我觉得我的呼吸问题不能好转
              <el-form-item prop="sgrqPartTwoFourPointFive">

                <el-radio-group v-model="collectForm.sgrqPartTwoFourPointFive">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>6．我的呼吸问题使我变得虚弱、活动不便
              <el-form-item prop="sgrqPartTwoFourPointSix">

                <el-radio-group v-model="collectForm.sgrqPartTwoFourPointSix">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>7．体育运动对我来说是不安全的
              <el-form-item prop="sgrqPartTwoFourPointSeven">

                <el-radio-group v-model="collectForm.sgrqPartTwoFourPointSeven">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>8．做任何事情我都很吃力
              <el-form-item prop="sgrqPartTwoFourPointEight">

                <el-radio-group v-model="collectForm.sgrqPartTwoFourPointEight">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>


          </el-descriptions-item>


          <el-descriptions-item label="第二部分：（五）下列问题是关于您的治疗问题，请根据您的实际情况，选择“是”或“否”">
            <div>我接受过治疗
              <el-form-item prop="sgrqPartTwoFivePoint">

                <el-radio-group v-model="collectForm.sgrqPartTwoFivePoint">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>
            如果接受过治疗，对于下面每一个问题，请根据您的实际情况，选择“是”或“否”
            <div>1．治疗对我来说没有多大帮助
              <el-form-item prop="sgrqPartTwoFivePointOne">

                <el-radio-group v-model="collectForm.sgrqPartTwoFivePointOne">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>2．在他人面前用药让我感到难堪
              <el-form-item prop="sgrqPartTwoFivePointTwo">

                <el-radio-group v-model="collectForm.sgrqPartTwoFivePointTwo">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>3．治疗引起了不良的药物副作用
              <el-form-item prop="sgrqPartTwoFivePointThree">

                <el-radio-group v-model="collectForm.sgrqPartTwoFivePointThree">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>4．治疗严重干扰了我的生活
              <el-form-item prop="sgrqPartTwoFivePointFour">

                <el-radio-group v-model="collectForm.sgrqPartTwoFivePointFour">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>


          </el-descriptions-item>


          <el-descriptions-item label="第二部分：（六）下列问题是关于您的呼吸困难可能如何影响您的活动，对于每一个问题，请根据您的实际情况，选择“是”或“否”">
            <div>1．我洗脸刷牙或穿衣时，感到费力
              <el-form-item prop="sgrqPartTwoSixPointOne">

                <el-radio-group v-model="collectForm.sgrqPartTwoSixPointOne">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>2．我不能洗澡或淋浴，或需要花很长的时间
              <el-form-item prop="sgrqPartTwoSixPointTwo">

                <el-radio-group v-model="collectForm.sgrqPartTwoSixPointTwo">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>3．我走得比别人慢，或常常停下来休息
              <el-form-item prop="sgrqPartTwoSixPointThree">

                <el-radio-group v-model="collectForm.sgrqPartTwoSixPointThree">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>4．我做家务事非常慢，或常常停下来休息
              <el-form-item prop="sgrqPartTwoSixPointFour">

                <el-radio-group v-model="collectForm.sgrqPartTwoSixPointFour">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>5．上一层楼时，我得慢慢走或停下来休息
              <el-form-item prop="sgrqPartTwoSixPointFive">

                <el-radio-group v-model="collectForm.sgrqPartTwoSixPointFive">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>6．如果赶时间或快走，我不得不休息或放慢速度
              <el-form-item prop="sgrqPartTwoSixPointSix">

                <el-radio-group v-model="collectForm.sgrqPartTwoSixPointSix">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>7．呼吸困难使我在进行诸如上坡、提东西上楼、在花园中除草、跳舞、练气功或做操等活动时感到困难
              <el-form-item prop="sgrqPartTwoSixPointSeven">

                <el-radio-group v-model="collectForm.sgrqPartTwoSixPointSeven">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>8．呼吸问题使我在进行诸如搬运重物、在花园中挖土、铲雪、慢跑或快走（8公里/小时）、舞剑或游泳时感到困难
              <el-form-item prop="sgrqPartTwoSixPointEight">

                <el-radio-group v-model="collectForm.sgrqPartTwoSixPointEight">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>9．呼吸问题使我在进行诸如重体力活、跑步、骑自行车、快速游泳、进行剧烈的体育运动时感到困难
              <el-form-item prop="sgrqPartTwoSixPointNine">

                <el-radio-group v-model="collectForm.sgrqPartTwoSixPointNine">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>


          </el-descriptions-item>


          <el-descriptions-item label="第二部分：（七）下列问题是您的呼吸问题如何影响您，对于每一个问题，请根据您的实际情况，选择“是”或“否”">
            <div>1．我不能进行体育活动或运动性活动
              <el-form-item prop="sgrqPartTwoSevenPointOne">

                <el-radio-group v-model="collectForm.sgrqPartTwoSevenPointOne">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>2．我不能外出娱乐或消遣
              <el-form-item prop="sgrqPartTwoSevenPointTwo">

                <el-radio-group v-model="collectForm.sgrqPartTwoSevenPointTwo">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>3．我不能外出购物
              <el-form-item prop="sgrqPartTwoSevenPointThree">

                <el-radio-group v-model="collectForm.sgrqPartTwoSevenPointThree">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>4．我不能做家务
              <el-form-item prop="sgrqPartTwoSevenPointFour">

                <el-radio-group v-model="collectForm.sgrqPartTwoSevenPointFour">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>5．我不能走得离床或椅子太远
              <el-form-item prop="sgrqPartTwoSevenPointFive">

                <el-radio-group v-model="collectForm.sgrqPartTwoSevenPointFive">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>


          </el-descriptions-item>


          <el-descriptions-item label="下面是一些由于您的呼吸问题无法进行的其他活动项目，请您根据实际情况选择“是”或“否”。">
            <div>1．散步或遛狗
              <el-form-item prop="sgrqPartTwoEightPointOne">

                <el-radio-group v-model="collectForm.sgrqPartTwoEightPointOne">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>2．在家干活
              <el-form-item prop="sgrqPartTwoEightPointTwo">

                <el-radio-group v-model="collectForm.sgrqPartTwoEightPointTwo">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>3．性生活
              <el-form-item prop="sgrqPartTwoEightPointThree">

                <el-radio-group v-model="collectForm.sgrqPartTwoEightPointThree">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>4．上商场、菜市场或进行娱乐活动
              <el-form-item prop="sgrqPartTwoEightPointFour">

                <el-radio-group v-model="collectForm.sgrqPartTwoEightPointFour">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>

            <div>5．在天气不好时外出或进入有烟味的房间
              <el-form-item prop="sgrqPartTwoEightPointFive">

                <el-radio-group v-model="collectForm.sgrqPartTwoEightPointFive">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>


            <div>6．探亲访友或与孩子玩耍
              <el-form-item prop="sgrqPartTwoEightPointSix">

                <el-radio-group v-model="collectForm.sgrqPartTwoEightPointSix">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>


          </el-descriptions-item>

          <el-descriptions-item label="现在请您选择一项最能反映您的呼吸问题对您的影响的选项">

            <el-form-item prop="sgrqPartTwoNinePointOne">

              <el-radio-group v-model="collectForm.sgrqPartTwoNinePointOne">
                <el-radio label="影响所有我想做的事情"></el-radio>
                <el-radio label="影响我做的大多数事情"></el-radio>
                <el-radio label="影响我想做的1－2件事情"></el-radio>
                <el-radio label="不影响我想做的任何事情"></el-radio>
              </el-radio-group>


            </el-form-item>


          </el-descriptions-item>


          <el-descriptions-item label="第三部分 （MRC呼吸困难分级）">

            <div>据以上调查，请根据您的实际情况选择一项最能反应您的呼吸困难情况的选项
              <el-form-item prop="sgrqPartThree">

                <el-radio-group v-model="collectForm.sgrqPartThree">
                  <el-radio label="除剧烈运外，一般不感到呼吸困难"></el-radio>
                  <br>
                  <el-radio label="平地急行时气短或上坡时气短"></el-radio>
                  <br>
                  <el-radio label="因气短平地行走时慢于同龄人以自己的步速平地行走时必须停下来喘气"></el-radio>
                  <br>
                  <el-radio label="平地行走100米或数分钟即有气短"></el-radio>
                  <br>
                  <el-radio label="因气短而不能离开房间"></el-radio>
                </el-radio-group>


              </el-form-item>
            </div>


          </el-descriptions-item>


        </el-descriptions>

        <div style="margin-top: 20px;display: flex; justify-content: center"> <h3>呼吸困难量表评分（mMRC）</h3></div>
        <el-descriptions :column="1" :size="size" border title="">

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
          <el-select v-model="collectForm.level" clearable placeholder="请选择分级">
            <el-option label="0级" value="0级"></el-option>
            <el-option label="1级" value="1级"></el-option>
            <el-option label="2级" value="2级"></el-option>
            <el-option label="3级" value="3级"></el-option>
            <el-option label="4级" value="4级"></el-option>

          </el-select>
        </el-form-item>


        <el-form-item style="margin-top: 5%;display: flex; justify-content: center">
          <el-button @click="saveCollectForm" style="background-color: #9fc58a; color: white">提交</el-button>
          <el-button @click="resetFormForCollect('collectForm')">重置</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>




    <!--面相采集对话框-->
    <el-dialog :visible.sync="dialogVisible3" width="70%" center title="舌象采集">
      <template>
        <div style="width:100%; display:flex; flex-direction: row">
          <!--摄像头与canvas-->
          <div style="width: 33.3%;height:100%; display: flex;flex-direction: row">
            <video
                id="videoCamera"
                :height="videoHeight"
                :width="videoWidth"
                autoplay></video>
            <canvas
                id="canvasCamera"
                :height="videoHeight"
                :width="videoWidth"
                style="display: none;"></canvas>
          </div>
          <!--操作按钮-->
          <div style="width: 20%;display: flex;flex-direction: column;justify-content: center;">
            <el-button @click="getCompetence()" style="margin: 20px;background-color: #7d9a62;color: white">打开摄像头</el-button>
            <el-button @click="stopNavigator()"style="margin: 20px; background-color: #243e31;color: white">关闭摄像头</el-button>
            <el-button @click="setImage()" style="margin: 20px; background-color: #e9c152;color: white;">拍照</el-button>
            <el-button @click="tongueImgSubimt()"  style=" margin: 20px;background-color: #8bb174; color: white">提交</el-button>
          </div>
          <!--采集结果-->
          <div v-if="tongueImgSrc" class="img_bg_camera">
            <div style="display:flex; justify-content: center;margin-top: 50px">采集结果</div>
            <div style="width: 100%;display: flex;justify-content: center">
              <img :src="tongueImgSrc" alt="" class="tx_img">
            </div>
          </div>
        </div>
      </template>
    </el-dialog>




    <!--历史就诊-->
    <el-dialog :visible.sync="dialogVisible4" width="70%" center title="历史就诊">

      <div v-for="(item, index) in visitHistory" :key="index" @click="getHistoryRow(item)">
        <el-collapse accordion>
          <!--历史就诊信息列表-->
          <el-collapse-item>
            <template slot="title">
              <h2>第{{ item.sequence }}次就诊</h2><i class="header-icon el-icon-info"></i>
              <!--就诊状态与最后采集时间-->
              <h3 v-if="item.status == 1" style="margin-left: 5%"> 采集进行中</h3>
              <h3 v-if="item.status == 2" style="margin-left: 5%"> 采集已完成</h3>
              <h3 style="margin-left: 5%"> 最后采集时间：{{ item.collectTime }}</h3>
              <!--传承弟子心得-->
              <el-popover height="400" placement="right" style="margin-left: 5%" trigger="click" width="400">
                <!--心得输入框-->
                <el-input v-model="item.experience" :autosize="{ minRows: 5, maxRows: 5}" placeholder="暂无" type="textarea"></el-input>
                <!--提交-->
                <el-button style="margin: 15px;background-color: #7d9a62;color: white" @click="submitExperience(item.experience,item.id)">提交</el-button>
                <el-button slot="reference" @click.stop style="background-color: #618758;color: white">传承弟子心得</el-button>
              </el-popover>
              <!--舌象-->
              <el-popover height="400" placement="top" style="margin-left: 5%" trigger="click" width="400">
                <div>
                  <!--舌象图片-->
                  <el-image :src="item.imageUrlOne" style="width: 90%; height: 90%">
                    <!--无图片-->
                    <div slot="error">暂无图像</div>
                  </el-image>
                </div>
                <el-button slot="reference" @click.stop style="background-color: #9ec489;color: white">舌象</el-button>
              </el-popover>
              <!--名老中医点评录音-->
              <el-popover height="400" placement="top" style="margin-left: 5%" trigger="click" width="400">
                <audio id="audio-player" controls></audio>
                <div>
                  <el-button id="record-btn" style="margin: 15px;background-color: #90b477;color: white">录音</el-button>
                  <el-button style="margin: 15px;background-color: #7d9a62;color: white" @click="submitSoundRecording(item.id,item.soundRecordingUrl)  ">提交</el-button>
                </div>
                <el-button slot="reference" @click.stop="start(item)" style="background-color: #3a664d;color: white">名老中医点评录音</el-button>
              </el-popover>
            </template>

            <!--就诊信息采集结果-->
            <el-form ref="item.survey" :model="item.survey" label-width="100px">
              <div style="display: flex;justify-content: center">
                <h2>中医信息采集</h2>
              </div>
              <el-descriptions :column="1" border direction="vertical">
                <el-descriptions-item label="主诉">
                  <!--差异结果显示-->
                  <div v-if="item.different.main != '0' " class="differentText">*上诊次差异结果：{{ item.different.main }}</div>
                  <el-form-item prop="main">
                    <el-input
                        v-model="item.survey.main"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入主诉内容"
                        type="textarea">
                    </el-input>
                  </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item label="现病史">
                  <div v-if="item.different.present != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.present }}
                  </div>
                  <el-form-item prop="present">
                    <el-input
                        v-model="item.survey.present"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入现病史内容"
                        type="textarea">
                    </el-input>
                  </el-form-item>

                </el-descriptions-item>

                <el-descriptions-item label="刻下症">
                  <div v-if="item.different.visible != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.visible }}
                  </div>
                  <el-form-item prop="visible">
                    <el-input
                        v-model="item.survey.visible"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入刻下症内容"
                        type="textarea">
                    </el-input>
                  </el-form-item>
                </el-descriptions-item>
              </el-descriptions>

              <div style="margin-top: 20px;display: flex; justify-content: center"> <h3>主症</h3></div>
              <el-descriptions :column="1" border direction="vertical" title="">
                <el-descriptions-item label="咳嗽">
                  <div v-if="item.different.cough != '0' " class="differentText">*上诊次差异结果：{{ item.different.cough }}
                  </div>

                  <el-form-item label="" prop="cough">
                    <el-radio-group v-model="item.survey.cough">
                      <el-radio label="无"></el-radio>
                      <el-radio label="有"></el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item label="性质">
                  <div v-if="item.different.nature != '0' " class="differentText">*上诊次差异结果：{{ item.different.nature }}
                  </div>

                  <el-form-item prop="nature">
                    <el-radio-group v-model="item.survey.nature">
                      <el-radio label="干咳"></el-radio>
                      <el-radio label="湿咳（每天痰量>10ml）"></el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item label="程度">
                  <div v-if="item.different.degree != '0' " class="differentText">*上诊次差异结果：{{ item.different.degree }}
                  </div>

                  <el-form-item prop="degree">
                    <el-radio-group v-model="item.survey.degree">
                      <el-radio label="偶有短暂咳嗽"></el-radio>
                      <el-radio label="频繁咳嗽，轻度影响日常生活"></el-radio>
                      <el-radio label="频繁咳嗽，严重影响日常生活"></el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item label="加重因素">
                  <div v-if="item.different.increaseFactors != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.increaseFactors }}
                  </div>
                  <el-form-item prop="increaseFactors">
                    <el-radio-group v-model="item.survey.increaseFactors">
                      <el-radio label="活动后加重"></el-radio>
                      <el-radio label="无明显加重因素"></el-radio>
                      <el-radio label="其他"></el-radio>
                      <el-input v-model="item.survey.increaseFactors" placeholder="请输入其他加重因素" size="mini"
                                style="width: 140px"></el-input>
                    </el-radio-group>
                  </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item label="缓解因素">
                  <div v-if="item.different.decreaseFactors != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.decreaseFactors }}
                  </div>
                  <el-form-item prop="decreaseFactors">
                    <el-radio-group v-model="item.survey.decreaseFactors">
                      <el-radio label="痰出"></el-radio>
                      <el-radio label="休息"></el-radio>
                      <el-radio label="无明显缓解因素"></el-radio>
                      <el-radio label="其他"></el-radio>
                      <el-input v-model="item.survey.decreaseFactors" placeholder="请输入其他缓解因素" size="mini"
                                style="width: 140px"></el-input>
                    </el-radio-group>
                  </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item label="咳痰">
                  <div v-if="item.different.expectoration != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.expectoration }}
                  </div>

                  <el-form-item prop="expectoration">
                    <el-radio-group v-model="item.survey.expectoration">
                      <el-radio label="无"></el-radio>
                      <el-radio label="有"></el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item label="痰量">
                  <div v-if="item.different.volume != '0' " class="differentText">*上诊次差异结果：{{ item.different.volume }}
                  </div>

                  <el-form-item prop="volume">
                    <el-radio-group v-model="item.survey.volume">
                      <el-radio label="少量（昼夜咯痰10-50ml）"></el-radio>
                      <el-radio label="中等量（昼夜咯痰51-100ml）"></el-radio>
                      <el-radio label="大量（昼夜咯痰>100ml）"></el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-descriptions-item>


                <el-descriptions-item label="痰色">
                  <div v-if="item.different.phlegmColor != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.phlegmColor }}
                  </div>

                  <el-form-item prop="phlegmColor">
                    <el-radio-group v-model="item.survey.phlegmColor">
                      <el-radio label="白"></el-radio>
                      <el-radio label="灰"></el-radio>
                      <el-radio label="黄"></el-radio>
                      <el-radio label="带血"></el-radio>
                      <el-radio label="其他"></el-radio>
                      <el-input v-model="item.survey.phlegmColor" placeholder="请输入其他痰色" size="mini"
                                style="width: 140px"></el-input>
                    </el-radio-group>
                  </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item label="痰质">
                  <div v-if="item.different.phlegmQuality != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.phlegmQuality }}
                  </div>

                  <el-form-item prop="phlegmQuality">
                    <el-radio-group v-model="item.survey.phlegmQuality">
                      <el-radio label="清稀"></el-radio>
                      <el-radio label="泡沫"></el-radio>
                      <el-radio label="黏稠"></el-radio>
                      <el-radio label="破絮"></el-radio>
                      <el-radio label="拉丝"></el-radio>
                      <el-radio label="其他"></el-radio>
                      <el-input v-model="item.survey.phlegmQuality" placeholder="请输入其他痰质" size="mini"
                                style="width: 140px"></el-input>
                    </el-radio-group>
                  </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item label="痰味">
                  <div v-if="item.different.phlegmTaste != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.phlegmTaste }}
                  </div>

                  <el-form-item prop="phlegmTaste">
                    <el-radio-group v-model="item.survey.phlegmTaste">
                      <el-radio label="无"></el-radio>
                      <el-radio label="甜"></el-radio>
                      <el-radio label="咸"></el-radio>
                      <el-radio label="腥"></el-radio>
                      <el-radio label="其他"></el-radio>
                      <el-input v-model="item.survey.phlegmTaste" placeholder="请输入其他痰味" size="mini"
                                style="width: 140px"></el-input>
                    </el-radio-group>
                  </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item label="呼吸困难">
                  <div v-if="item.different.dyspnea != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.dyspnea }}
                  </div>

                  <el-form-item prop="dyspnea">
                    <el-radio-group v-model="item.survey.dyspnea">
                      <el-radio label="无"></el-radio>
                      <el-radio label="有"></el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item label="呼吸困难加重因素">
                  <div v-if="item.different.dyspneaIncrease != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.dyspneaIncrease }}
                  </div>
                  <el-form-item prop="dyspneaIncrease">
                    <el-checkbox-group v-model="item.survey.dyspneaIncrease">
                      <el-checkbox label="活动"></el-checkbox>
                      <el-checkbox label="平卧"></el-checkbox>
                      <el-checkbox label="情绪波动"></el-checkbox>
                      <el-checkbox label="呼吸道感染"></el-checkbox>
                      <el-checkbox label="其他"></el-checkbox>
                      <el-form-item prop="dyspneaIncreaseOther">
                        <div v-if="item.different.dyspneaIncreaseOther != '0' " class="differentText">
                          *上诊次差异结果：{{ item.different.dyspneaIncreaseOther }}
                        </div>

                        <el-input v-model="item.survey.dyspneaIncreaseOther" placeholder="请在此补充其他呼吸困难加重因素" size="mini"
                                  style="width: 200px"></el-input>
                      </el-form-item>
                    </el-checkbox-group>
                  </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item label="呼吸困难缓解因素">
                  <div v-if="item.different.dyspneaDecrease != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.dyspneaDecrease }}
                  </div>

                  <el-form-item prop="dyspneaDecrease">
                    <el-checkbox-group v-model="item.survey.dyspneaDecrease">
                      <el-checkbox label="休息"></el-checkbox>
                      <el-checkbox label="吸氧"></el-checkbox>
                      <el-checkbox label="其他"></el-checkbox>
                      <el-form-item prop="dyspneaDecreaseOther">
                        <div v-if="item.different.dyspneaDecreaseOther != '0' " class="differentText">
                          *上诊次差异结果：{{ item.different.dyspneaDecreaseOther }}
                        </div>

                        <el-input v-model="item.survey.dyspneaDecreaseOther" placeholder="请在此补充其他呼吸困难缓解因素" size="mini"
                                  style="width: 200px"></el-input>

                      </el-form-item>
                    </el-checkbox-group>
                  </el-form-item>
                </el-descriptions-item>


                <el-descriptions-item label="呼吸困难程度">
                  <div v-if="item.different.dyspneaDegree != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.dyspneaDegree }}
                  </div>

                  <el-form-item prop="dyspneaDegree">
                    <el-radio-group v-model="item.survey.dyspneaDegree">
                      <el-radio label="0级 只在剧烈运动时才出现呼吸困难"></el-radio>
                      <br>
                      <el-radio label="1级 在走路较急或爬缓坡时会出现呼吸困难"></el-radio>
                      <br>
                      <el-radio label="2级 按平时走路方式走时会出现气短，必须停下来休息，走路比同龄人慢"></el-radio>
                      <br>
                      <el-radio label="3级 步行100码（91.44米）或几分钟后需要停下来休息"></el-radio>
                      <br>
                      <el-radio label="4级 因呼吸困难严重不能离家，或穿脱衣时出现呼吸困难"></el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-descriptions-item>


                <el-descriptions-item label="伴随症状">
                  <div v-if="item.different.accompanyingSymptoms != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.accompanyingSymptoms }}
                  </div>

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
                        <div v-if="item.different.accompanyingSymptomsOther != '0' " class="differentText">
                          *上诊次差异结果：{{ item.different.accompanyingSymptomsOther }}
                        </div>

                        <el-input v-model="item.survey.accompanyingSymptomsOther" placeholder="请在此补充其他伴随症状" size="mini"
                                  style="width: 200px"></el-input>

                      </el-form-item>
                    </el-checkbox-group>
                  </el-form-item>
                </el-descriptions-item>


              </el-descriptions>

              <div style="margin-top: 20px;display: flex; justify-content: center"> <h3>中医证候信息表</h3></div>
              <el-descriptions :column="1" border direction="vertical" style="margin-top:0%" title="">

                <el-descriptions-item label="肺系">
                  <el-form-item prop="pulmonarySystem">
                    <div v-if="item.different.pulmonarySystem != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.pulmonarySystem }}
                    </div>

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
                        <div v-if="item.different.pulmonarySystemOther != '0' " class="differentText">
                          *上诊次差异结果：{{ item.different.pulmonarySystemOther }}
                        </div>

                        <el-input v-model="item.survey.pulmonarySystemOther" placeholder="请在此补充其他肺系情况" size="mini"
                                  style="width: 200px"></el-input>
                      </el-form-item>
                    </el-checkbox-group>
                  </el-form-item>
                </el-descriptions-item>


                <el-descriptions-item label="寒热">
                  <el-form-item prop="coldAndHeat">
                    <div v-if="item.different.coldAndHeat != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.coldAndHeat }}
                    </div>

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
                    <div v-if="item.different.perspiration != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.perspiration }}
                    </div>

                    <el-checkbox-group v-model="item.survey.perspiration">
                      <el-checkbox label="正常"></el-checkbox>
                      <el-checkbox label="无汗"></el-checkbox>
                      <el-checkbox label="自汗"></el-checkbox>
                      <el-checkbox label="盗汗"></el-checkbox>
                      <el-checkbox label="头汗"></el-checkbox>
                      <el-checkbox label="手足心汗"></el-checkbox>
                      <el-checkbox label="其他"></el-checkbox>
                      <el-form-item prop="perspirationOther">
                        <div v-if="item.different.perspirationOther != '0' " class="differentText">
                          *上诊次差异结果：{{ item.different.perspirationOther }}
                        </div>

                        <el-input v-model="item.survey.perspirationOther" placeholder="请在此补充其他汗出情况" size="mini"
                                  style="width: 200px"></el-input>
                      </el-form-item>

                    </el-checkbox-group>
                  </el-form-item>
                </el-descriptions-item>


                <el-descriptions-item label="精神">
                  <el-form-item prop="spirit">
                    <div v-if="item.different.spirit != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.spirit }}
                    </div>

                    <el-checkbox-group v-model="item.survey.spirit">
                      <el-checkbox label="正常"></el-checkbox>
                      <el-checkbox label="乏力"></el-checkbox>
                      <el-checkbox label="神疲"></el-checkbox>
                      <el-checkbox label="嗜睡"></el-checkbox>
                      <el-checkbox label="烦躁"></el-checkbox>
                      <el-checkbox label="神昏"></el-checkbox>
                      <el-checkbox label="其他"></el-checkbox>
                      <el-form-item prop="spiritOther">
                        <div v-if="item.different.spiritOther != '0' " class="differentText">
                          *上诊次差异结果：{{ item.different.spiritOther }}
                        </div>

                        <el-input v-model="item.survey.spiritOther" placeholder="请在此补充其他精神情况" size="mini"
                                  style="width: 200px"></el-input>
                      </el-form-item>

                    </el-checkbox-group>
                  </el-form-item>
                </el-descriptions-item>


                <el-descriptions-item label="情志">
                  <el-form-item prop="emotion">
                    <div v-if="item.different.emotion != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.emotion }}
                    </div>

                    <el-checkbox-group v-model="item.survey.emotion">
                      <el-checkbox label="正常"></el-checkbox>
                      <el-checkbox label="烦躁易怒"></el-checkbox>
                      <el-checkbox label="抑郁"></el-checkbox>
                      <el-checkbox label="健忘"></el-checkbox>
                      <el-checkbox label="易惊"></el-checkbox>
                      <el-checkbox label="其他"></el-checkbox>
                      <el-form-item prop="emotionOther">
                        <div v-if="item.different.emotionOther != '0' " class="differentText">
                          *上诊次差异结果：{{ item.different.emotionOther }}
                        </div>

                        <el-input v-model="item.survey.emotionOther" placeholder="请在此补充其他情志情况" size="mini"
                                  style="width: 200px"></el-input>

                      </el-form-item>

                    </el-checkbox-group>
                  </el-form-item>
                </el-descriptions-item>


                <el-descriptions-item label="面色">
                  <el-form-item prop="complexion">
                    <div v-if="item.different.complexion != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.complexion }}
                    </div>

                    <el-checkbox-group v-model="item.survey.complexion">
                      <el-checkbox label="常色"></el-checkbox>
                      <el-checkbox label="淡白无华"></el-checkbox>
                      <el-checkbox label="㿠白"></el-checkbox>
                      <el-checkbox label="萎黄"></el-checkbox>
                      <el-checkbox label="潮红"></el-checkbox>
                      <el-checkbox label="青紫"></el-checkbox>
                      <br>
                      <el-checkbox label="晦暗"></el-checkbox>
                      <el-checkbox label="面色黧黑、肌肤甲错"></el-checkbox>
                      <el-checkbox label="其他"></el-checkbox>
                      <el-form-item prop="complexionOther">
                        <div v-if="item.different.complexionOther != '0' " class="differentText">
                          *上诊次差异结果：{{ item.different.complexionOther }}
                        </div>

                        <el-input v-model="item.survey.complexionOther" placeholder="请在此补充其他面色情况" size="mini"
                                  style="width: 200px"></el-input>

                      </el-form-item>

                    </el-checkbox-group>
                  </el-form-item>
                </el-descriptions-item>


                <el-descriptions-item label="饮食">
                  <el-form-item>
                    <div>食：</div>
                    <el-form-item prop="food">
                      <div v-if="item.different.food != '0' " class="differentText">*上诊次差异结果：{{ item.different.food }}
                      </div>

                      <el-checkbox-group v-model="item.survey.food">
                        <el-checkbox label="正常"></el-checkbox>
                        <el-checkbox label="纳差"></el-checkbox>
                        <el-checkbox label="饥不欲食"></el-checkbox>
                        <el-checkbox label="消谷善饥"></el-checkbox>
                        <el-checkbox label="恶心呕吐"></el-checkbox>
                        <br>
                        <el-checkbox label="朝食暮吐、暮食朝吐"></el-checkbox>
                        <el-checkbox label="脘闷"></el-checkbox>
                        <el-checkbox label="腹胀"></el-checkbox>
                        <el-checkbox label="其他"></el-checkbox>
                        <el-form-item prop="foodOther">
                          <div v-if="item.different.foodOther != '0' " class="differentText">
                            *上诊次差异结果：{{ item.different.foodOther }}
                          </div>

                          <el-input v-model="item.survey.foodOther" placeholder="请在此补充其他" size="mini"
                                    style="width: 200px"></el-input>

                        </el-form-item>

                      </el-checkbox-group>
                    </el-form-item>

                    <div>饮：</div>
                    <el-form-item prop="drink">
                      <div v-if="item.different.drink != '0' " class="differentText">
                        *上诊次差异结果：{{ item.different.drink }}
                      </div>

                      <el-checkbox-group v-model="item.survey.drink">
                        <el-checkbox label="正常"></el-checkbox>
                        <el-checkbox label="口不渴"></el-checkbox>
                        <el-checkbox label="渴喜冷饮"></el-checkbox>
                        <el-checkbox label="渴喜热饮"></el-checkbox>
                        <el-checkbox label="渴不欲饮"></el-checkbox>
                        <br>
                        <el-checkbox label="渴饮不多"></el-checkbox>
                        <el-checkbox label="口渴但欲漱水不欲咽"></el-checkbox>
                        <el-checkbox label="水入即吐"></el-checkbox>
                        <el-checkbox label="其他"></el-checkbox>
                        <el-form-item prop="drinkOther">
                          <div v-if="item.different.drinkOther != '0' " class="differentText">
                            *上诊次差异结果：{{ item.different.drinkOther }}
                          </div>

                          <el-input v-model="item.survey.drinkOther" placeholder="请在此补充其他" size="mini"
                                    style="width: 200px"></el-input>
                        </el-form-item>
                      </el-checkbox-group>
                    </el-form-item>
                    <div>味：</div>
                    <el-form-item prop="taste">
                      <div v-if="item.different.taste != '0' " class="differentText">
                        *上诊次差异结果：{{ item.different.taste }}
                      </div>

                      <el-checkbox-group v-model="item.survey.taste">
                        <el-checkbox label="正常"></el-checkbox>
                        <el-checkbox label="口苦"></el-checkbox>
                        <el-checkbox label="口淡"></el-checkbox>
                        <el-checkbox label="口咸"></el-checkbox>
                        <el-checkbox label="口腥"></el-checkbox>
                        <br>
                        <el-checkbox label="口甜"></el-checkbox>
                        <el-checkbox label="口腻"></el-checkbox>
                        <el-checkbox label="其他"></el-checkbox>
                        <el-form-item prop="tasteOther">
                          <div v-if="item.different.tasteOther != '0' " class="differentText">
                            *上诊次差异结果：{{ item.different.tasteOther }}
                          </div>

                          <el-input v-model="item.survey.tasteOther" placeholder="请在此补充其他" size="mini"
                                    style="width: 200px"></el-input>
                        </el-form-item>
                      </el-checkbox-group>
                    </el-form-item>
                  </el-form-item>
                </el-descriptions-item>


                <el-descriptions-item label="二便">
                  <el-form-item prop="urine">
                    <div>小便：</div>
                    <div v-if="item.different.urine != '0' " class="differentText">*上诊次差异结果：{{ item.different.urine }}
                    </div>

                    <el-checkbox-group v-model="item.survey.urine">
                      <el-checkbox label="正常"></el-checkbox>
                      <el-checkbox label="清长"></el-checkbox>
                      <el-checkbox label="短赤"></el-checkbox>
                      <el-checkbox label="便黄"></el-checkbox>
                      <el-checkbox label="夜尿频数"></el-checkbox>
                      <el-checkbox label="小便涩痛"></el-checkbox>
                      <br>
                      <el-checkbox label="淋漓不尽"></el-checkbox>
                      <el-checkbox label="遗尿"></el-checkbox>
                      <el-checkbox label="其他"></el-checkbox>
                      <el-form-item prop="urineOther">
                        <div v-if="item.different.urineOther != '0' " class="differentText">
                          *上诊次差异结果：{{ item.different.urineOther }}
                        </div>

                        <el-input v-model="item.survey.urineOther" placeholder="请在此补充其他小便情况" size="mini"
                                  style="width: 200px"></el-input>

                      </el-form-item>

                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item prop="defecate">

                    <div>大便：</div>
                    <div v-if="item.different.defecate != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.defecate }}
                    </div>

                    <el-checkbox-group v-model="item.survey.defecate">

                      <el-checkbox label="正常"></el-checkbox>
                      <el-checkbox label="干结"></el-checkbox>
                      <el-checkbox label="稀溏"></el-checkbox>
                      <el-checkbox label="排便无力"></el-checkbox>
                      <el-checkbox label="黏滞不爽"></el-checkbox>
                      <el-checkbox label="完谷不化"></el-checkbox>
                      <br>
                      <el-checkbox label="其他"></el-checkbox>
                      <el-form-item prop="defecateOther">
                        <div v-if="item.different.defecateOther != '0' " class="differentText">
                          *上诊次差异结果：{{ item.different.defecateOther }}
                        </div>

                        <el-input v-model="item.survey.defecateOther" placeholder="请在此补充其他大便情况" size="mini"
                                  style="width: 200px"></el-input>

                      </el-form-item>

                    </el-checkbox-group>

                  </el-form-item>


                </el-descriptions-item>


                <el-descriptions-item label="睡眠">
                  <el-form-item prop="sleep">
                    <div v-if="item.different.sleep != '0' " class="differentText">*上诊次差异结果：{{ item.different.sleep }}
                    </div>

                    <el-checkbox-group v-model="item.survey.sleep">
                      <el-checkbox label="正常"></el-checkbox>
                      <el-checkbox label="迟难入睡"></el-checkbox>
                      <el-checkbox label="多梦"></el-checkbox>
                      <el-checkbox label="易醒"></el-checkbox>
                      <el-checkbox label="其他"></el-checkbox>
                      <el-form-item prop="sleepOther">
                        <div v-if="item.different.sleepOther != '0' " class="differentText">
                          *上诊次差异结果：{{ item.different.sleepOther }}
                        </div>

                        <el-input v-model="item.survey.sleepOther" placeholder="请在此补充其他睡眠情况" size="mini"
                                  style="width: 200px"></el-input>

                      </el-form-item>

                    </el-checkbox-group>

                  </el-form-item>
                </el-descriptions-item>


                <el-descriptions-item label="周身四肢">
                  <el-form-item prop="bodyAndLimbs">
                    <div v-if="item.different.bodyAndLimbs != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.bodyAndLimbs }}
                    </div>

                    <el-checkbox-group v-model="item.survey.bodyAndLimbs">
                      <el-checkbox label="正常"></el-checkbox>
                      <el-checkbox label="腰膝酸软"></el-checkbox>
                      <el-checkbox label="肢冷"></el-checkbox>
                      <el-checkbox label="耳鸣"></el-checkbox>
                      <el-checkbox label="目干"></el-checkbox>
                      <el-checkbox label="面目或肢体浮肿"></el-checkbox>
                      <el-checkbox label="其他"></el-checkbox>
                      <el-form-item prop="bodyAndLimbsOthers">
                        <div v-if="item.different.bodyAndLimbsOthers != '0' " class="differentText">
                          *上诊次差异结果：{{ item.different.bodyAndLimbsOthers }}
                        </div>

                        <el-input v-model="item.survey.bodyAndLimbsOthers" placeholder="请在此补充其他周身四肢情况" size="mini"
                                  style="width: 200px"></el-input>

                      </el-form-item>

                    </el-checkbox-group>

                  </el-form-item>
                </el-descriptions-item>


                <el-descriptions-item label="舌象">
                  <el-form-item prop="tongueColor">
                    <div>舌色
                      <div v-if="item.different.tongueColor != '0' " class="differentText">
                        *上诊次差异结果：{{ item.different.tongueColor }}
                      </div>
                    </div>

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
                    <div>舌形
                      <div v-if="item.different.tongueShape != '0' " class="differentText">
                        *上诊次差异结果：{{ item.different.tongueShape }}
                      </div>
                    </div>
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
                    <div>舌态
                      <div v-if="item.different.tongueState != '0' " class="differentText">
                        *上诊次差异结果：{{ item.different.tongueState }}
                      </div>
                    </div>
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
                    <div>苔质
                      <div v-if="item.different.coatingNature != '0' " class="differentText">
                        *上诊次差异结果：{{ item.different.coatingNature }}
                      </div>
                    </div>
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
                    <div>苔色
                      <div v-if="item.different.coatingColour != '0' " class="differentText">
                        *上诊次差异结果：{{ item.different.coatingColour }}
                      </div>
                    </div>
                    <el-checkbox-group v-model="item.survey.coatingColour">
                      <el-checkbox label="白"></el-checkbox>
                      <el-checkbox label="黄"></el-checkbox>
                      <el-checkbox label="灰"></el-checkbox>
                      <el-checkbox label="黑"></el-checkbox>
                    </el-checkbox-group>

                  </el-form-item>

                  <el-form-item prop="tongueUnder">
                    <div>舌下络脉</div>
                    <div v-if="item.different.tongueUnder != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.tongueUnder }}
                    </div>
                    <el-checkbox-group v-model="item.survey.tongueUnder">
                      <el-checkbox label="正常"></el-checkbox>
                      <el-checkbox label="粗胀"></el-checkbox>
                      <el-checkbox label="青紫"></el-checkbox>
                      <el-checkbox label="其他"></el-checkbox>
                      <el-form-item prop="tongueUnderOther">
                        <div v-if="item.different.tongueUnderOther != '0' " class="differentText">
                          *上诊次差异结果：{{ item.different.tongueUnderOther }}
                        </div>

                        <el-input v-model="item.survey.tongueUnderOther" placeholder="请在此补充其他舌下络脉情况" size="mini"
                                  style="width: 200px"></el-input>
                      </el-form-item>
                    </el-checkbox-group>

                  </el-form-item>

                </el-descriptions-item>


                <el-descriptions-item label="脉象">
                  <el-form-item prop="pulseCondition">
                    <div v-if="item.different.pulseCondition != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.pulseCondition }}
                    </div>

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
                    <div v-if="item.different.disease != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.disease }}
                    </div>

                    <el-input
                        v-model="item.survey.disease"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入中医诊断疾病内容"
                        type="textarea">
                    </el-input>

                  </el-form-item>

                  <el-form-item prop="syndromeType">
                    <div>证型：</div>
                    <div v-if="item.different.syndromeType != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.syndromeType }}
                    </div>

                    <el-input
                        v-model="item.survey.syndromeType"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入中医诊断证型内容"
                        type="textarea">
                    </el-input>

                  </el-form-item>
                </el-descriptions-item>


              </el-descriptions>

              <div style="margin-top: 20px;display: flex; justify-content: center"> <h3>处方信息</h3></div>
              <el-descriptions :column="1" border direction="vertical" style="margin-top:0%" title="">
                <el-descriptions-item label="治法">
                  <div v-if="item.different.therapy != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.therapy }}
                  </div>

                  <el-form-item prop="therapy">
                    <el-input
                        v-model="item.survey.therapy"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入治法"
                        type="textarea">
                    </el-input>


                  </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item label="方剂名称">
                  <div v-if="item.different.prescriptionName != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.prescriptionName }}
                  </div>

                  <el-form-item prop="prescriptionName">
                    <el-input
                        v-model="item.survey.prescriptionName"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入方剂名称"
                        type="textarea">
                    </el-input>

                  </el-form-item>
                </el-descriptions-item>


                <el-descriptions-item label="中药处方">
                  <div v-if="item.different.prescription != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.prescription }}
                  </div>

                  <el-form-item prop="prescription">
                    <el-input
                        v-model="item.survey.prescription"
                        :autosize="{ minRows: 5, maxRows: 10}"
                        placeholder="请输入中药处方"
                        type="textarea">
                    </el-input>

                  </el-form-item>
                  <el-form-item prop="medicineNum">
                    <div>
                      <div v-if="item.different.medicineNum != '0' " class="differentText">
                        *上诊次差异结果：{{ item.different.medicineNum }}剂
                      </div>

                      <el-input-number v-model="item.survey.medicineNum" :max="999" :min="1"></el-input-number>
                      剂

                    </div>


                  </el-form-item>
                  <el-form-item prop="decoctingMethod">
                    <div>煎服法：</div>
                    <div v-if="item.different.decoctingMethod != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.decoctingMethod }}
                    </div>

                    <el-input
                        v-model="item.survey.decoctingMethod"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入煎服法"
                        type="textarea">
                    </el-input>
                  </el-form-item>

                </el-descriptions-item>

                <el-descriptions-item label="中成药处方">
                  <div v-if="item.different.chinesePatentMedicine != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.chinesePatentMedicine }}
                  </div>

                  <el-form-item prop="chinesePatentMedicine">
                    <el-input
                        v-model="item.survey.chinesePatentMedicine"
                        :autosize="{ minRows: 5, maxRows: 10}"
                        placeholder="请输入中成药处方"
                        type="textarea">
                    </el-input>
                  </el-form-item>

                </el-descriptions-item>


                <el-descriptions-item label="针灸推拿">
                  <div v-if="item.different.acupunctureAndMassage != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.acupunctureAndMassage }}
                  </div>

                  <el-form-item prop="acupunctureAndMassage">
                    <el-input
                        v-model="item.survey.acupunctureAndMassage"
                        :autosize="{ minRows: 5, maxRows: 10}"
                        placeholder="请输入针灸推拿相关内容"
                        type="textarea">
                    </el-input>
                  </el-form-item>

                </el-descriptions-item>


                <el-descriptions-item label="西药处方">
                  <div v-if="item.different.westernMedicinePrescription != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.westernMedicinePrescription }}
                  </div>

                  <el-form-item prop="westernMedicinePrescription">
                    <el-input
                        v-model="item.survey.westernMedicinePrescription"
                        :autosize="{ minRows: 5, maxRows: 10}"
                        placeholder="请输入西药处方"
                        type="textarea">
                    </el-input>
                  </el-form-item>

                </el-descriptions-item>


                <el-descriptions-item label="医嘱">
                  <el-form-item prop="adviceForFood">
                    <div>饮食：</div>
                    <div v-if="item.different.adviceForFood != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.adviceForFood }}
                    </div>

                    <el-input
                        v-model="item.survey.adviceForFood"
                        :autosize="{ minRows: 5, maxRows: 10}"
                        placeholder="请输入饮食相关医嘱"
                        type="textarea">
                    </el-input>
                  </el-form-item>

                  <el-form-item prop="adviceForDailyLife">
                    <div>起居：</div>
                    <div v-if="item.different.adviceForDailyLife != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.adviceForDailyLife }}
                    </div>

                    <el-input
                        v-model="item.survey.adviceForDailyLife"
                        :autosize="{ minRows: 5, maxRows: 10}"
                        placeholder="请输入起居相关医嘱"
                        type="textarea">
                    </el-input>
                  </el-form-item>

                  <el-form-item prop="adviceForEmotion">
                    <div>情志：</div>
                    <div v-if="item.different.adviceForEmotion != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.adviceForEmotion }}
                    </div>

                    <el-input
                        v-model="item.survey.adviceForEmotion"
                        :autosize="{ minRows: 5, maxRows: 10}"
                        placeholder="请输入情志相关医嘱"
                        type="textarea">
                    </el-input>
                  </el-form-item>

                  <el-form-item prop="adviceForOther">
                    <div>其他：</div>
                    <div v-if="item.different.adviceForOther != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.adviceForOther }}
                    </div>

                    <el-input
                        v-model="item.survey.adviceForOther"
                        :autosize="{ minRows: 5, maxRows: 10}"
                        placeholder="请输入其他医嘱"
                        type="textarea">
                    </el-input>
                  </el-form-item>

                </el-descriptions-item>


                <el-descriptions-item label="必要的临床检查">
                  <div>胸部HRCT：</div>
                  <el-form-item prop="hrctDate">
                    <div v-if="item.different.hrctDate != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.hrctDate }}
                    </div>


                    <div>检查日期：
                      <el-date-picker v-model="item.survey.hrctDate" placeholder="选择日期" style="width: 50%;"
                                      type="date"></el-date-picker>
                    </div>
                  </el-form-item>
                  <el-form-item prop="hrctStore">
                    <div>是否已留存：
                      <div v-if="item.different.hrctStore != '0' " class="differentText">
                        *上诊次差异结果：{{ item.different.hrctStore }}
                      </div>

                      <el-radio-group v-model="item.survey.hrctStore">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>

                      </el-radio-group>

                    </div>
                  </el-form-item>


                  <div>肺功能：</div>
                  <el-form-item prop="lungFunctionDate">
                    <div v-if="item.different.lungFunctionDate != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.lungFunctionDate }}
                    </div>

                    <div>检查日期：
                      <el-date-picker v-model="item.survey.lungFunctionDate" placeholder="选择日期" style="width: 50%;"
                                      type="date"></el-date-picker>
                    </div>
                  </el-form-item>
                  <el-form-item prop="lungFunctionStore">
                    <div>是否已留存：
                      <div v-if="item.different.lungFunctionStore != '0' " class="differentText">
                        *上诊次差异结果：{{ item.different.lungFunctionStore }}
                      </div>

                      <el-radio-group v-model="item.survey.lungFunctionStore">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>

                      </el-radio-group>

                    </div>
                  </el-form-item>


                  <div>动脉血气分析：</div>
                  <el-form-item prop="bloodGasAnalysisDate">
                    <div v-if="item.different.bloodGasAnalysisDate != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.bloodGasAnalysisDate }}
                    </div>

                    <div>检查日期：
                      <el-date-picker v-model="item.survey.bloodGasAnalysisDate" placeholder="选择日期" style="width: 50%;"
                                      type="date"></el-date-picker>
                    </div>
                  </el-form-item>
                  <el-form-item prop="bloodGasAnalysisStore">
                    <div>是否已留存：
                      <div v-if="item.different.bloodGasAnalysisStore != '0' " class="differentText">
                        *上诊次差异结果：{{ item.different.bloodGasAnalysisStore }}
                      </div>

                      <el-radio-group v-model="item.survey.bloodGasAnalysisStore">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>

                      </el-radio-group>

                    </div>
                  </el-form-item>


                  <div>6分钟步行试验：</div>
                  <el-form-item prop="walkTestDate">
                    <div v-if="item.different.walkTestDate != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.walkTestDate }}
                    </div>

                    <div>检查日期：
                      <el-date-picker v-model="item.survey.walkTestDate" placeholder="选择日期" style="width: 50%;"
                                      type="date"></el-date-picker>
                    </div>
                  </el-form-item>
                  <el-form-item prop="walkTestStore">
                    <div>是否已留存：
                      <div v-if="item.different.walkTestStore != '0' " class="differentText">
                        *上诊次差异结果：{{ item.different.walkTestStore }}
                      </div>

                      <el-radio-group v-model="item.survey.walkTestStore">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>

                      </el-radio-group>

                    </div>
                  </el-form-item>


                  <div>胸部X线：</div>
                  <el-form-item prop="rayDate">
                    <div v-if="item.different.rayDate != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.rayDate }}
                    </div>

                    <div>检查日期：
                      <el-date-picker v-model="item.survey.rayDate" placeholder="选择日期" style="width: 50%;"
                                      type="date"></el-date-picker>
                    </div>
                  </el-form-item>
                  <el-form-item prop="rayStore">
                    <div>是否已留存：
                      <div v-if="item.different.rayStore != '0' " class="differentText">
                        *上诊次差异结果：{{ item.different.rayStore }}
                      </div>

                      <el-radio-group v-model="item.survey.rayStore">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>

                      </el-radio-group>

                    </div>
                  </el-form-item>


                  <div>心脏彩超：</div>
                  <el-form-item prop="colourSonographyDate">
                    <div v-if="item.different.colourSonographyDate != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.colourSonographyDate }}
                    </div>

                    <div>检查日期：
                      <el-date-picker v-model="item.survey.colourSonographyDate" placeholder="选择日期" style="width: 50%;"
                                      type="date"></el-date-picker>
                    </div>
                  </el-form-item>
                  <el-form-item prop="colourSonographyStore">
                    <div>是否已留存：
                      <div v-if="item.different.colourSonographyStore != '0' " class="differentText">
                        *上诊次差异结果：{{ item.different.colourSonographyStore }}
                      </div>

                      <el-radio-group v-model="item.survey.colourSonographyStore">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>

                      </el-radio-group>

                    </div>
                  </el-form-item>


                  <div>血常规：</div>
                  <el-form-item prop="routineBloodTestDate">
                    <div v-if="item.different.routineBloodTestDate != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.routineBloodTestDate }}
                    </div>


                    <div>检查日期：
                      <el-date-picker v-model="item.survey.routineBloodTestDate" placeholder="选择日期" style="width: 50%;"
                                      type="date"></el-date-picker>
                    </div>
                  </el-form-item>
                  <el-form-item prop="routineBloodTestStore">
                    <div>是否已留存：
                      <div v-if="item.different.routineBloodTestStore != '0' " class="differentText">
                        *上诊次差异结果：{{ item.different.routineBloodTestStore }}
                      </div>

                      <el-radio-group v-model="item.survey.routineBloodTestStore">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>

                      </el-radio-group>

                    </div>
                  </el-form-item>


                  <div>血生化检查：</div>
                  <el-form-item prop="bloodExaminationDate">
                    <div v-if="item.different.bloodExaminationDate != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.bloodExaminationDate }}
                    </div>

                    <div>检查日期：
                      <el-date-picker v-model="item.survey.bloodExaminationDate" placeholder="选择日期" style="width: 50%;"
                                      type="date"></el-date-picker>
                    </div>
                  </el-form-item>
                  <el-form-item prop="bloodExaminationStore">
                    <div>是否已留存：
                      <div v-if="item.different.bloodExaminationStore != '0' " class="differentText">
                        *上诊次差异结果：{{ item.different.bloodExaminationStore }}
                      </div>

                      <el-radio-group v-model="item.survey.bloodExaminationStore">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>

                      </el-radio-group>

                    </div>
                  </el-form-item>


                  <div>凝血功能和D二聚体：</div>
                  <el-form-item prop="coagulationFunctionDate">
                    <div v-if="item.different.coagulationFunctionDate != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.coagulationFunctionDate }}
                    </div>

                    <div>检查日期：
                      <el-date-picker v-model="item.survey.coagulationFunctionDate" placeholder="选择日期"
                                      style="width: 50%;"
                                      type="date"></el-date-picker>
                    </div>
                  </el-form-item>
                  <el-form-item prop="coagulationFunctionStore">
                    <div>是否已留存：
                      <div v-if="item.different.coagulationFunctionStore != '0' " class="differentText">
                        *上诊次差异结果：{{ item.different.coagulationFunctionStore }}
                      </div>

                      <el-radio-group v-model="item.survey.coagulationFunctionStore">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>

                      </el-radio-group>

                    </div>
                  </el-form-item>


                </el-descriptions-item>


                <el-descriptions-item label="院外合并治疗情况(西药)">
                  <div v-if="item.different.westernMedicineHas != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.westernMedicineHas }}
                  </div>


                  <el-form-item prop="westernMedicineHas">

                    <div>西药：
                      <el-radio-group v-model="item.survey.westernMedicineHas">
                        <el-radio label="有"></el-radio>
                        <el-radio label="无"></el-radio>
                      </el-radio-group>
                    </div>

                  </el-form-item>

                  <el-form-item prop="westernMedicineMain">
                    <div v-if="item.different.westernMedicineMain != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.westernMedicineMain }}
                    </div>

                    <div>如有，记录主要药物名称：
                      <el-checkbox-group v-model="item.survey.westernMedicineMain">
                        <el-checkbox label="吡非尼酮/尼达尼布"></el-checkbox>
                        <el-checkbox label="N-乙酰半胱氨酸"></el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </el-form-item>

                  <el-form-item prop="westernMedicineMainOther">
                    <div v-if="item.different.westernMedicineMainOther != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.westernMedicineMainOther }}
                    </div>

                    其他：
                    <el-input v-model="item.survey.westernMedicineMainOther" placeholder="请在此补充其他西药" size="mini"
                              style="width: 200px"></el-input>
                  </el-form-item>


                </el-descriptions-item>


                <el-descriptions-item label="院外合并治疗情况(中成药)">


                  <el-form-item prop="chinesePatentMedicineHas">

                    <div v-if="item.different.chinesePatentMedicineHas != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.chinesePatentMedicineHas }}
                    </div>

                    <div>中成药：
                      <el-radio-group v-model="item.survey.chinesePatentMedicineHas">
                        <el-radio label="有"></el-radio>
                        <el-radio label="无"></el-radio>
                      </el-radio-group>
                    </div>

                  </el-form-item>


                  <el-form-item prop="chinesePatentMedicineMain">
                    <div v-if="item.different.chinesePatentMedicineMain != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.chinesePatentMedicineMain }}
                    </div>

                    如有，记录主要中成药名称：
                    <el-input v-model="item.survey.chinesePatentMedicineMain" placeholder="请在此补充主要中成药名称" size="mini"
                              style="width: 500px"></el-input>
                  </el-form-item>


                </el-descriptions-item>


                <el-descriptions-item label="院外合并治疗情况(其他疗法)">


                  <el-form-item prop="therapyHas">

                    <div v-if="item.different.therapyHas != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.therapyHas }}
                    </div>

                    <div>其他疗法：
                      <el-radio-group v-model="item.survey.therapyHas">
                        <el-radio label="有"></el-radio>
                        <el-radio label="无"></el-radio>
                      </el-radio-group>
                    </div>

                  </el-form-item>

                  <el-form-item prop="therapyMain">
                    <div v-if="item.different.therapyMain != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.therapyMain }}
                    </div>


                    <div>如有，记录具体疗法：
                      <el-checkbox-group v-model="item.survey.therapyMain">
                        <el-checkbox label="氧疗"></el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </el-form-item>

                  <el-form-item prop="therapyMainOther">
                    <div v-if="item.different.therapyMainOther != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.therapyMainOther }}
                    </div>

                    其他：
                    <el-input v-model="item.survey.therapyMainOther" placeholder="请在此补充其他疗法" size="mini"
                              style="width: 200px"></el-input>
                  </el-form-item>


                </el-descriptions-item>


              </el-descriptions>

              <div style="margin-top: 20px;display: flex; justify-content: center"> <h3>病例资料拓展（特色模块）</h3></div>
              <el-descriptions :column="1" border direction="vertical" title="">

                <el-descriptions-item label="病例资料拓展">
                  <el-form-item prop="dataExpansion">
                    <el-input
                        v-model="item.survey.dataExpansion"
                        :autosize="{ minRows: 25, maxRows: 999}"
                        placeholder="请在此补充病例资料"
                        type="textarea">
                    </el-input>

                  </el-form-item>
                </el-descriptions-item>
              </el-descriptions>


              <span style="justify-content: center;display: flex"><h3>疗效评价</h3></span>

              <div style="margin-top: 20px;display: flex; justify-content: center"> <h3>自评医疗成效问卷（MYMOP）</h3></div>
              <el-descriptions :column="1" border direction="vertical">

                <el-descriptions-item label="1.请选出一或两项最令你困扰的症状（可以身体上或精神上的），写在下方输入框中。
并把适当的数字勾上以表示该症状在过去一星期的情况有多坏（0代表情况算是最好，6代表情况算是最坏）">
                  <el-form-item prop="mymopOnePointOne">
                    <div>症状一：</div>
                    <div v-if="item.different.mymopOnePointOne != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.mymopOnePointOne }}
                    </div>

                    <el-input v-model="item.survey.mymopOnePointOne" placeholder="请在此填写症状一" style="width: 20%">
                    </el-input>

                    <div v-if="item.different.mymopOnePointOneScore != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.mymopOnePointOneScore }}
                    </div>

                    <el-form-item prop="mymopOnePointOneScore">
                      <div>情况算是最好
                        <el-radio-group v-model="item.survey.mymopOnePointOneScore">
                          <el-radio label="1"></el-radio>
                          <el-radio label="2"></el-radio>
                          <el-radio label="3"></el-radio>
                          <el-radio label="4"></el-radio>
                          <el-radio label="5"></el-radio>
                          <el-radio label="6"></el-radio>
                        </el-radio-group>
                        情况算是最坏
                      </div>
                    </el-form-item>
                  </el-form-item>


                  <el-form-item prop="mymopOnePointTwo">
                    <div>症状二：</div>
                    <div v-if="item.different.mymopOnePointTwo != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.mymopOnePointTwo }}
                    </div>

                    <el-input v-model="item.survey.mymopOnePointTwo" placeholder="请在此填写症状二" style="width: 20%">
                    </el-input>

                    <el-form-item prop="mymopOnePointTwoScore">
                      <div v-if="item.different.mymopOnePointTwoScore != '0' " class="differentText">
                        *上诊次差异结果：{{ item.different.mymopOnePointTwoScore }}
                      </div>

                      <div>情况算是最好
                        <el-radio-group v-model="item.survey.mymopOnePointTwoScore">
                          <el-radio label="1"></el-radio>
                          <el-radio label="2"></el-radio>
                          <el-radio label="3"></el-radio>
                          <el-radio label="4"></el-radio>
                          <el-radio label="5"></el-radio>
                          <el-radio label="6"></el-radio>
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
                    <div v-if="item.different.mymopTwo != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.mymopTwo }}
                    </div>

                    <el-input v-model="item.survey.mymopTwo" placeholder="请在此填写活动" style="width: 20%">
                    </el-input>

                    <div v-if="item.different.mymopTwoScore != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.mymopTwoScore }}
                    </div>

                    <el-form-item prop="mymopTwoScore">
                      <div>情况算是最好
                        <el-radio-group v-model="item.survey.mymopTwoScore">
                          <el-radio label="1"></el-radio>
                          <el-radio label="2"></el-radio>
                          <el-radio label="3"></el-radio>
                          <el-radio label="4"></el-radio>
                          <el-radio label="5"></el-radio>
                          <el-radio label="6"></el-radio>
                        </el-radio-group>
                        情况算是最坏
                      </div>
                    </el-form-item>
                  </el-form-item>
                </el-descriptions-item>


                <el-descriptions-item label="3.在过去一星期，你对自己身心状况的整体感觉如何？">


                  <div v-if="item.different.mymopThree != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.mymopThree }}
                  </div>

                  <el-form-item prop="mymopThree">
                    <div>情况算是最好
                      <el-radio-group v-model="item.survey.mymopThree">
                        <el-radio label="1"></el-radio>
                        <el-radio label="2"></el-radio>
                        <el-radio label="3"></el-radio>
                        <el-radio label="4"></el-radio>
                        <el-radio label="5"></el-radio>
                        <el-radio label="6"></el-radio>
                      </el-radio-group>
                      情况算是最坏
                    </div>
                  </el-form-item>

                </el-descriptions-item>

                <el-descriptions-item label="4.你上述的 症状一出现了多久？（不论是连续出现，或是断续地出现）">

                  <div v-if="item.different.mymopFour != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.mymopFour }}
                  </div>


                  <el-form-item prop="mymopFour">
                    <div>
                      <el-radio-group v-model="item.survey.mymopFour">
                        <el-radio label="0-4星期"></el-radio>
                        <el-radio label="4-12星期"></el-radio>
                        <el-radio label="3个月至1年"></el-radio>
                        <el-radio label="1-5年"></el-radio>
                        <el-radio label="超过5年"></el-radio>
                      </el-radio-group>

                    </div>
                  </el-form-item>

                </el-descriptions-item>


                <el-descriptions-item label="5.你有没有使用任何药物来治疗症状一？">


                  <div v-if="item.different.mymopFive != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.mymopFive }}
                  </div>

                  <el-form-item prop="mymopFive">
                    <div>
                      <el-radio-group v-model="item.survey.mymopFive">
                        <el-radio label="有"></el-radio>
                        <el-radio label="没有（跳至第8题）"></el-radio>

                      </el-radio-group>

                    </div>
                  </el-form-item>

                </el-descriptions-item>

                <el-descriptions-item label="6.请写出该药物的名称及每天／每周使用量。">

                  <div v-if="item.different.mymopSixPointOne != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.mymopSixPointOne }}
                  </div>


                  <el-form-item prop="mymopSixPointOne">
                    <div>药物名称：
                      <el-input v-model="item.survey.mymopSixPointOne" placeholder="请在此填写药物名称" style="width: 20%">
                      </el-input>
                    </div>

                  </el-form-item>
                  <div v-if="item.different.mymopSixPointTwo != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.mymopSixPointTwo }}
                  </div>


                  <el-form-item prop="mymopSixPointTwo">
                    <div>使用量：
                      <el-input v-model="item.survey.mymopSixPointTwo" placeholder="请在此填写使用量" style="width: 20%">
                      </el-input>
                    </div>

                  </el-form-item>


                </el-descriptions-item>


                <el-descriptions-item label="7.你认为减少使用这些药物有多重要？">


                  <div v-if="item.different.mymopSeven != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.mymopSeven }}
                  </div>

                  <el-form-item prop="mymopSeven">
                    <div>
                      <el-radio-group v-model="item.survey.mymopSeven">
                        <el-radio label="不重要"></el-radio>
                        <el-radio label="少许重要"></el-radio>
                        <el-radio label="非常重要"></el-radio>
                        <el-radio label="不适用"></el-radio>

                      </el-radio-group>

                    </div>
                  </el-form-item>

                </el-descriptions-item>


                <el-descriptions-item label="8.对症状一来说，你认为不使用任何药物有多重要？">

                  <div v-if="item.different.mymopEight != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.mymopEight }}
                  </div>


                  <el-form-item prop="mymopEight">
                    <div>
                      <el-radio-group v-model="item.survey.mymopEight">
                        <el-radio label="不重要"></el-radio>
                        <el-radio label="少许重要"></el-radio>
                        <el-radio label="非常重要"></el-radio>
                        <el-radio label="不适用"></el-radio>

                      </el-radio-group>

                    </div>
                  </el-form-item>

                </el-descriptions-item>


              </el-descriptions>

              <div style="margin-top: 20px;display: flex; justify-content: center"> <h3>圣乔治呼吸调查问卷</h3></div>
              <el-descriptions :column="1" border direction="vertical" >
                <el-descriptions-item label="这份问卷是用来帮助我们了解你的呼吸问题是如何正在困扰你的，以及它是如何影响你的生活的。我们通过它发现疾病在哪一方面对你的影响最大,但这不是医生或护士所认为的那些问题。
                        请仔细阅读下列指导性语句，若有不明白之处请提问。不要花费太长的时间来决定你的答案。在完成余下的问卷前，请选择一个能体现你目前健康状况的描述：">
                  <div></div>
                  <div v-if="item.different.sgrqDescription != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.sgrqDescription }}
                  </div>

                  <el-form-item prop="sgrqDescription">

                    <el-radio-group v-model="item.survey.sgrqDescription">
                      <el-radio label="很好"></el-radio>
                      <el-radio label="好"></el-radio>
                      <el-radio label="一般"></el-radio>
                      <el-radio label="不好"></el-radio>
                      <el-radio label="很差"></el-radio>

                    </el-radio-group>


                  </el-form-item>
                </el-descriptions-item>


                <el-descriptions-item label="第一部分：关于过去6个月内您的呼吸困难问题，每个问题只选择一个答案：">
                  <div>1．在过去6个月内，咳嗽情况：
                    <div v-if="item.different.sgrqPartOnePointOne != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartOnePointOne }}
                    </div>

                    <el-form-item prop="sgrqPartOnePointOne">

                      <el-radio-group v-model="item.survey.sgrqPartOnePointOne">
                        <el-radio label="1周中绝大部分时间"></el-radio>
                        <el-radio label="1周中有几天"></el-radio>
                        <el-radio label="l月中有几天"></el-radio>
                        <el-radio label="仅在肺部感染时"></el-radio>
                        <el-radio label="没有"></el-radio>

                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>2．在过去6个月内，咳痰情况：
                    <div v-if="item.different.sgrqPartOnePointTwo != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartOnePointTwo }}
                    </div>

                    <el-form-item prop="sgrqPartOnePointTwo">

                      <el-radio-group v-model="item.survey.sgrqPartOnePointTwo">
                        <el-radio label="1周中绝大部分时间"></el-radio>
                        <el-radio label="1周中有几天"></el-radio>
                        <el-radio label="l月中有几天"></el-radio>
                        <el-radio label="仅在肺部感染时"></el-radio>
                        <el-radio label="没有"></el-radio>

                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>3．在过去6个月内，呼吸急促的发生情况：
                    <div v-if="item.different.sgrqPartOnePointThree != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartOnePointThree }}
                    </div>

                    <el-form-item prop="sgrqPartOnePointThree">

                      <el-radio-group v-model="item.survey.sgrqPartOnePointThree">
                        <el-radio label="1周中绝大部分时间"></el-radio>
                        <el-radio label="1周中有几天"></el-radio>
                        <el-radio label="l月中有几天"></el-radio>
                        <el-radio label="仅在肺部感染时"></el-radio>
                        <el-radio label="没有"></el-radio>

                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>4．在过去6个月内，气喘发作情况：
                    <div v-if="item.different.sgrqPartOnePointFour != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartOnePointFour }}
                    </div>

                    <el-form-item prop="sgrqPartOnePointFour">

                      <el-radio-group v-model="item.survey.sgrqPartOnePointFour">
                        <el-radio label="1周中绝大部分时间"></el-radio>
                        <el-radio label="1周中有几天"></el-radio>
                        <el-radio label="l月中有几天"></el-radio>
                        <el-radio label="仅在肺部感染时"></el-radio>
                        <el-radio label="没有"></el-radio>

                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>5．在过去6个月内，我曾出现过几次严重的或极不舒服的呼吸困难：
                    <div v-if="item.different.sgrqPartOnePointFive != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartOnePointFive }}
                    </div>

                    <el-form-item prop="sgrqPartOnePointFive">

                      <el-radio-group v-model="item.survey.sgrqPartOnePointFive">
                        <el-radio label="超过3次"></el-radio>
                        <el-radio label="3次发作"></el-radio>
                        <el-radio label="2次发作"></el-radio>
                        <el-radio label="l次发作"></el-radio>
                        <el-radio label="没有发作"></el-radio>

                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>6．在过去6个月内，平均每周有几天呼吸是正常的（没有呼吸困难）
                    <div v-if="item.different.sgrqPartOnePointSix != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartOnePointSix }}
                    </div>

                    <el-form-item prop="sgrqPartOnePointSix">

                      <el-radio-group v-model="item.survey.sgrqPartOnePointSix">
                        <el-radio label="没有一天正常"></el-radio>
                        <el-radio label="l到2天正常"></el-radio>
                        <el-radio label="3到4天正常"></el-radio>
                        <el-radio label="几乎每天都正常"></el-radio>
                        <el-radio label="每一天都正常"></el-radio>

                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>7．如果有喘息，是否在清晨起来时加重？
                    <div v-if="item.different.sgrqPartOnePointSeven != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartOnePointSeven }}
                    </div>

                    <el-form-item prop="sgrqPartOnePointSeven">

                      <el-radio-group v-model="item.survey.sgrqPartOnePointSeven">
                        <el-radio label="否"></el-radio>
                        <el-radio label="是"></el-radio>

                      </el-radio-group>


                    </el-form-item>
                  </div>

                </el-descriptions-item>


                <el-descriptions-item label="第二部分：（一）您如何描述您目前的呼吸困难？ ">
                  <div>1.您如何评价呼吸困难对您生活的影响？
                    <div v-if="item.different.sgrqPartTwoOnePointOne != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoOnePointOne }}
                    </div>

                    <el-form-item prop="sgrqPartTwoOnePointOne">

                      <el-radio-group v-model="item.survey.sgrqPartTwoOnePointOne">
                        <el-radio label="呼吸困难严重影响了我的全部生活"></el-radio>
                        <br>
                        <el-radio label="呼吸困难影响了我的全部生活"></el-radio>
                        <br>
                        <el-radio label="呼吸困难影响了我的部分生活"></el-radio>
                        <br>
                        <el-radio label="呼吸困难没有影响我的生活"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>2．关于呼吸对工作的影响，请从中选择一项
                    <div v-if="item.different.sgrqPartTwoOnePointTwo != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoOnePointTwo }}
                    </div>

                    <el-form-item prop="sgrqPartTwoOnePointTwo">

                      <el-radio-group v-model="item.survey.sgrqPartTwoOnePointTwo">
                        <el-radio label="我的呼吸问题使我完全中止工作"></el-radio>
                        <br>
                        <el-radio label="我的呼吸问题影响我的工作或使我改变工作"></el-radio>
                        <br>
                        <el-radio label="我的呼吸问题不影响我的工作"></el-radio>
                        <br>
                        <el-radio label="我没有工作"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                </el-descriptions-item>


                <el-descriptions-item label="第二部分：（二）下面问题是关于这些天来哪些活动经常让您觉得喘不过气来：对于每一个问题根据您的实际情况，选择“是”或“否” ">
                  <div>1．静坐或静躺
                    <div v-if="item.different.sgrqPartTwoTwoPointOne != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoTwoPointOne }}
                    </div>

                    <el-form-item prop="sgrqPartTwoTwoPointOne">

                      <el-radio-group v-model="item.survey.sgrqPartTwoTwoPointOne">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>2．洗漱或穿衣
                    <div v-if="item.different.sgrqPartTwoTwoPointTwo != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoTwoPointTwo }}
                    </div>

                    <el-form-item prop="sgrqPartTwoTwoPointTwo">

                      <el-radio-group v-model="item.survey.sgrqPartTwoTwoPointTwo">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>3．在室内走动
                    <div v-if="item.different.sgrqPartTwoTwoPointThree != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoTwoPointThree }}
                    </div>

                    <el-form-item prop="sgrqPartTwoTwoPointThree">

                      <el-radio-group v-model="item.survey.sgrqPartTwoTwoPointThree">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>4．在户外平台上走动
                    <div v-if="item.different.sgrqPartTwoTwoPointFour != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoTwoPointFour }}
                    </div>

                    <el-form-item prop="sgrqPartTwoTwoPointFour">

                      <el-radio-group v-model="item.survey.sgrqPartTwoTwoPointFour">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>5．上一层楼
                    <div v-if="item.different.sgrqPartTwoTwoPointFive != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoTwoPointFive }}
                    </div>

                    <el-form-item prop="sgrqPartTwoTwoPointFive">

                      <el-radio-group v-model="item.survey.sgrqPartTwoTwoPointFive">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>6．爬坡
                    <div v-if="item.different.sgrqPartTwoTwoPointSix != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoTwoPointSix }}
                    </div>

                    <el-form-item prop="sgrqPartTwoTwoPointSix">

                      <el-radio-group v-model="item.survey.sgrqPartTwoTwoPointSix">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>7. 运动性体育活动或运动性游戏
                    <div v-if="item.different.sgrqPartTwoTwoPointSeven != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoTwoPointSeven }}
                    </div>

                    <el-form-item prop="sgrqPartTwoTwoPointSeven">

                      <el-radio-group v-model="item.survey.sgrqPartTwoTwoPointSeven">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>


                </el-descriptions-item>

                <el-descriptions-item label="第二部分：（三）下面问题是关于这些天来您的咳嗽及气喘问题：对于每一个问题根据您的实际情况，选择“是”或“否”">
                  <div>1．咳嗽使我感到痛苦
                    <div v-if="item.different.sgrqPartTwoThreePointOne != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoThreePointOne }}
                    </div>

                    <el-form-item prop="sgrqPartTwoThreePointOne">

                      <el-radio-group v-model="item.survey.sgrqPartTwoThreePointOne">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>2．咳嗽时我感到疲倦
                    <div v-if="item.different.sgrqPartTwoThreePointTwo != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoThreePointTwo }}
                    </div>

                    <el-form-item prop="sgrqPartTwoThreePointTwo">

                      <el-radio-group v-model="item.survey.sgrqPartTwoThreePointTwo">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>3．谈话时，我会感到喘不过气来
                    <div v-if="item.different.sgrqPartTwoThreePointThree != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoThreePointThree }}
                    </div>

                    <el-form-item prop="sgrqPartTwoThreePointThree">

                      <el-radio-group v-model="item.survey.sgrqPartTwoThreePointThree">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>4．弯腰时，我觉得喘不过气来
                    <div v-if="item.different.sgrqPartTwoThreePointFour != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoThreePointFour }}
                    </div>

                    <el-form-item prop="sgrqPartTwoThreePointFour">

                      <el-radio-group v-model="item.survey.sgrqPartTwoThreePointFour">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>5．咳嗽或呼吸困难影响我的睡眠
                    <div v-if="item.different.sgrqPartTwoThreePointFive != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoThreePointFive }}
                    </div>

                    <el-form-item prop="sgrqPartTwoThreePointFive">

                      <el-radio-group v-model="item.survey.sgrqPartTwoThreePointFive">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>6．我经常疲惫不堪
                    <div v-if="item.different.sgrqPartTwoThreePointSix != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoThreePointSix }}
                    </div>

                    <el-form-item prop="sgrqPartTwoThreePointSix">

                      <el-radio-group v-model="item.survey.sgrqPartTwoThreePointSix">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>


                </el-descriptions-item>

                <el-descriptions-item label="第二部分：（四）下面问题是关于这些天来您的呼吸困难可能对您的其他方面的影响，对于每一个问题根据您的实际情况，选择“是”或“否”">
                  <div>1．咳嗽或呼吸困难使我心情不愉快
                    <div v-if="item.different.sgrqPartTwoFourPointOne != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoFourPointOne }}
                    </div>

                    <el-form-item prop="sgrqPartTwoFourPointOne">

                      <el-radio-group v-model="item.survey.sgrqPartTwoFourPointOne">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>2．我的呼吸问题让我的家人担心
                    <div v-if="item.different.sgrqPartTwoFourPointTwo != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoFourPointTwo }}
                    </div>

                    <el-form-item prop="sgrqPartTwoFourPointTwo">

                      <el-radio-group v-model="item.survey.sgrqPartTwoFourPointTwo">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>3．当喘不过气来时，我感到害怕或惊恐
                    <div v-if="item.different.sgrqPartTwoFourPointThree != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoFourPointThree }}
                    </div>

                    <el-form-item prop="sgrqPartTwoFourPointThree">

                      <el-radio-group v-model="item.survey.sgrqPartTwoFourPointThree">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>4．我觉得我的呼吸问题很严重
                    <div v-if="item.different.sgrqPartTwoFourPointFour != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoFourPointFour }}
                    </div>

                    <el-form-item prop="sgrqPartTwoFourPointFour">

                      <el-radio-group v-model="item.survey.sgrqPartTwoFourPointFour">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>5．我觉得我的呼吸问题不能好转
                    <div v-if="item.different.sgrqPartTwoFourPointFive != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoFourPointFive }}
                    </div>

                    <el-form-item prop="sgrqPartTwoFourPointFive">

                      <el-radio-group v-model="item.survey.sgrqPartTwoFourPointFive">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>6．我的呼吸问题使我变得虚弱、活动不便
                    <div v-if="item.different.sgrqPartTwoFourPointSix != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoFourPointSix }}
                    </div>

                    <el-form-item prop="sgrqPartTwoFourPointSix">

                      <el-radio-group v-model="item.survey.sgrqPartTwoFourPointSix">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>7．体育运动对我来说是不安全的
                    <div v-if="item.different.sgrqPartTwoFourPointSeven != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoFourPointSeven }}
                    </div>

                    <el-form-item prop="sgrqPartTwoFourPointSeven">

                      <el-radio-group v-model="item.survey.sgrqPartTwoFourPointSeven">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>8．做任何事情我都很吃力
                    <div v-if="item.different.sgrqPartTwoFourPointEight != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoFourPointEight }}
                    </div>

                    <el-form-item prop="sgrqPartTwoFourPointEight">

                      <el-radio-group v-model="item.survey.sgrqPartTwoFourPointEight">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>


                </el-descriptions-item>


                <el-descriptions-item label="第二部分：（五）下列问题是关于您的治疗问题，请根据您的实际情况，选择“是”或“否”">
                  <div>我接受过治疗
                    <div v-if="item.different.sgrqPartTwoFivePoint != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoFivePoint }}
                    </div>

                    <el-form-item prop="sgrqPartTwoFivePoint">

                      <el-radio-group v-model="item.survey.sgrqPartTwoFivePoint">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>
                  如果接受过治疗，对于下面每一个问题，请根据您的实际情况，选择“是”或“否”
                  <div>1．治疗对我来说没有多大帮助
                    <div v-if="item.different.sgrqPartTwoFivePointOne != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoFivePointOne }}
                    </div>

                    <el-form-item prop="sgrqPartTwoFivePointOne">

                      <el-radio-group v-model="item.survey.sgrqPartTwoFivePointOne">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>2．在他人面前用药让我感到难堪
                    <div v-if="item.different.sgrqPartTwoFivePointTwo != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoFivePointTwo }}
                    </div>

                    <el-form-item prop="sgrqPartTwoFivePointTwo">

                      <el-radio-group v-model="item.survey.sgrqPartTwoFivePointTwo">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>3．治疗引起了不良的药物副作用
                    <div v-if="item.different.sgrqPartTwoFivePointThree != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoFivePointThree }}
                    </div>

                    <el-form-item prop="sgrqPartTwoFivePointThree">

                      <el-radio-group v-model="item.survey.sgrqPartTwoFivePointThree">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>4．治疗严重干扰了我的生活
                    <div v-if="item.different.sgrqPartTwoFivePointFour != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoFivePointFour }}
                    </div>

                    <el-form-item prop="sgrqPartTwoFivePointFour">

                      <el-radio-group v-model="item.survey.sgrqPartTwoFivePointFour">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>


                </el-descriptions-item>


                <el-descriptions-item label="第二部分：（六）下列问题是关于您的呼吸困难可能如何影响您的活动，对于每一个问题，请根据您的实际情况，选择“是”或“否”">
                  <div>1．我洗脸刷牙或穿衣时，感到费力
                    <div v-if="item.different.sgrqPartTwoSixPointOne != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoSixPointOne }}
                    </div>

                    <el-form-item prop="sgrqPartTwoSixPointOne">

                      <el-radio-group v-model="item.survey.sgrqPartTwoSixPointOne">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>2．我不能洗澡或淋浴，或需要花很长的时间
                    <div v-if="item.different.sgrqPartTwoSixPointTwo != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoSixPointTwo }}
                    </div>

                    <el-form-item prop="sgrqPartTwoSixPointTwo">

                      <el-radio-group v-model="item.survey.sgrqPartTwoSixPointTwo">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>3．我走得比别人慢，或常常停下来休息
                    <div v-if="item.different.sgrqPartTwoSixPointThree != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoSixPointThree }}
                    </div>

                    <el-form-item prop="sgrqPartTwoSixPointThree">

                      <el-radio-group v-model="item.survey.sgrqPartTwoSixPointThree">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>4．我做家务事非常慢，或常常停下来休息
                    <div v-if="item.different.sgrqPartTwoSixPointFour != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoSixPointFour }}
                    </div>

                    <el-form-item prop="sgrqPartTwoSixPointFour">

                      <el-radio-group v-model="item.survey.sgrqPartTwoSixPointFour">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>5．上一层楼时，我得慢慢走或停下来休息
                    <div v-if="item.different.sgrqPartTwoSixPointFive != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoSixPointFive }}
                    </div>

                    <el-form-item prop="sgrqPartTwoSixPointFive">

                      <el-radio-group v-model="item.survey.sgrqPartTwoSixPointFive">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>6．如果赶时间或快走，我不得不休息或放慢速度
                    <div v-if="item.different.sgrqPartTwoSixPointSix != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoSixPointSix }}
                    </div>

                    <el-form-item prop="sgrqPartTwoSixPointSix">

                      <el-radio-group v-model="item.survey.sgrqPartTwoSixPointSix">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>7．呼吸困难使我在进行诸如上坡、提东西上楼、在花园中除草、跳舞、练气功或做操等活动时感到困难
                    <div v-if="item.different.sgrqPartTwoSixPointSeven != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoSixPointSeven }}
                    </div>

                    <el-form-item prop="sgrqPartTwoSixPointSeven">

                      <el-radio-group v-model="item.survey.sgrqPartTwoSixPointSeven">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>8．呼吸问题使我在进行诸如搬运重物、在花园中挖土、铲雪、慢跑或快走（8公里/小时）、舞剑或游泳时感到困难
                    <div v-if="item.different.sgrqPartTwoSixPointEight != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoSixPointEight }}
                    </div>

                    <el-form-item prop="sgrqPartTwoSixPointEight">

                      <el-radio-group v-model="item.survey.sgrqPartTwoSixPointEight">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>9．呼吸问题使我在进行诸如重体力活、跑步、骑自行车、快速游泳、进行剧烈的体育运动时感到困难
                    <div v-if="item.different.sgrqPartTwoSixPointNine != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoSixPointNine }}
                    </div>

                    <el-form-item prop="sgrqPartTwoSixPointNine">

                      <el-radio-group v-model="item.survey.sgrqPartTwoSixPointNine">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>


                </el-descriptions-item>


                <el-descriptions-item label="第二部分：（七）下列问题是您的呼吸问题如何影响您，对于每一个问题，请根据您的实际情况，选择“是”或“否”">
                  <div>1．我不能进行体育活动或运动性活动
                    <div v-if="item.different.sgrqPartTwoSevenPointOne != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoSevenPointOne }}
                    </div>

                    <el-form-item prop="sgrqPartTwoSevenPointOne">

                      <el-radio-group v-model="item.survey.sgrqPartTwoSevenPointOne">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>2．我不能外出娱乐或消遣
                    <div v-if="item.different.sgrqPartTwoSevenPointTwo != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoSevenPointTwo }}
                    </div>

                    <el-form-item prop="sgrqPartTwoSevenPointTwo">

                      <el-radio-group v-model="item.survey.sgrqPartTwoSevenPointTwo">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>3．我不能外出购物
                    <div v-if="item.different.sgrqPartTwoSevenPointThree != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoSevenPointThree }}
                    </div>

                    <el-form-item prop="sgrqPartTwoSevenPointThree">

                      <el-radio-group v-model="item.survey.sgrqPartTwoSevenPointThree">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>4．我不能做家务
                    <div v-if="item.different.sgrqPartTwoSevenPointFour != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoSevenPointFour }}
                    </div>

                    <el-form-item prop="sgrqPartTwoSevenPointFour">

                      <el-radio-group v-model="item.survey.sgrqPartTwoSevenPointFour">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>5．我不能走得离床或椅子太远
                    <div v-if="item.different.sgrqPartTwoSevenPointFive != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoSevenPointFive }}
                    </div>

                    <el-form-item prop="sgrqPartTwoSevenPointFive">

                      <el-radio-group v-model="item.survey.sgrqPartTwoSevenPointFive">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>


                </el-descriptions-item>


                <el-descriptions-item label="下面是一些由于您的呼吸问题无法进行的其他活动项目，请您根据实际情况选择“是”或“否”。">
                  <div>1．散步或遛狗
                    <div v-if="item.different.sgrqPartTwoEightPointOne != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoEightPointOne }}
                    </div>

                    <el-form-item prop="sgrqPartTwoEightPointOne">

                      <el-radio-group v-model="item.survey.sgrqPartTwoEightPointOne">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>2．在家干活
                    <div v-if="item.different.sgrqPartTwoEightPointTwo != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoEightPointTwo }}
                    </div>

                    <el-form-item prop="sgrqPartTwoEightPointTwo">

                      <el-radio-group v-model="item.survey.sgrqPartTwoEightPointTwo">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>3．性生活
                    <div v-if="item.different.sgrqPartTwoEightPointThree != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoEightPointThree }}
                    </div>

                    <el-form-item prop="sgrqPartTwoEightPointThree">

                      <el-radio-group v-model="item.survey.sgrqPartTwoEightPointThree">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>4．上商场、菜市场或进行娱乐活动
                    <div v-if="item.different.sgrqPartTwoEightPointFour != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoEightPointFour }}
                    </div>

                    <el-form-item prop="sgrqPartTwoEightPointFour">

                      <el-radio-group v-model="item.survey.sgrqPartTwoEightPointFour">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>

                  <div>5．在天气不好时外出或进入有烟味的房间
                    <div v-if="item.different.sgrqPartTwoEightPointFive != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoEightPointFive }}
                    </div>

                    <el-form-item prop="sgrqPartTwoEightPointFive">

                      <el-radio-group v-model="item.survey.sgrqPartTwoEightPointFive">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>


                  <div>6．探亲访友或与孩子玩耍
                    <div v-if="item.different.sgrqPartTwoEightPointSix != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartTwoEightPointSix }}
                    </div>

                    <el-form-item prop="sgrqPartTwoEightPointSix">

                      <el-radio-group v-model="item.survey.sgrqPartTwoEightPointSix">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>


                </el-descriptions-item>

                <el-descriptions-item label="现在请您选择一项最能反映您的呼吸问题对您的影响的选项">

                  <div v-if="item.different.sgrqPartTwoNinePointOne != '0' " class="differentText">
                    *上诊次差异结果：{{ item.different.sgrqPartTwoNinePointOne }}
                  </div>


                  <el-form-item prop="sgrqPartTwoNinePointOne">

                    <el-radio-group v-model="item.survey.sgrqPartTwoNinePointOne">
                      <el-radio label="影响所有我想做的事情"></el-radio>
                      <el-radio label="影响我做的大多数事情"></el-radio>
                      <el-radio label="影响我想做的1－2件事情"></el-radio>
                      <el-radio label="不影响我想做的任何事情"></el-radio>
                    </el-radio-group>


                  </el-form-item>


                </el-descriptions-item>


                <el-descriptions-item label="第三部分 （MRC呼吸困难分级）">

                  <div>据以上调查，请根据您的实际情况选择一项最能反应您的呼吸困难情况的选项
                    <div v-if="item.different.sgrqPartThree != '0' " class="differentText">
                      *上诊次差异结果：{{ item.different.sgrqPartThree }}
                    </div>
                    <el-form-item prop="sgrqPartThree">

                      <el-radio-group v-model="item.survey.sgrqPartThree">
                        <el-radio label="除剧烈运外，一般不感到呼吸困难"></el-radio>
                        <br>
                        <el-radio label="平地急行时气短或上坡时气短"></el-radio>
                        <br>
                        <el-radio label="因气短平地行走时慢于同龄人以自己的步速平地行走时必须停下来喘气"></el-radio>
                        <br>
                        <el-radio label="平地行走100米或数分钟即有气短"></el-radio>
                        <br>
                        <el-radio label="因气短而不能离开房间"></el-radio>
                      </el-radio-group>


                    </el-form-item>
                  </div>


                </el-descriptions-item>


              </el-descriptions>

              <div style="margin-top: 20px;display: flex; justify-content: center"> <h3>呼吸困难量表评分（mMRC）</h3></div>
              <el-descriptions :column="1" :size="size" border >
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
                <el-select v-model="item.survey.level" clearable placeholder="请选择分级">
                  <el-option label="0级" value="0级"></el-option>
                  <el-option label="1级" value="1级"></el-option>
                  <el-option label="2级" value="2级"></el-option>
                  <el-option label="3级" value="3级"></el-option>
                  <el-option label="4级" value="4级"></el-option>

                </el-select>
                <div v-if="item.different.level != '0' " class="differentText">*上诊次差异结果：{{ item.different.level }}</div>
              </el-form-item>


              <el-form-item style="margin-top: 5%;display: flex;justify-content: center">
                <el-button style="background-color:#efbb4e;color: white" @click="updateForm">修改</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-dialog>




    <!--医嘱-->
    <el-dialog :visible.sync="dialogVisible5" width="60%">
      <h2 style="margin-top: -10%">请选择医嘱类型</h2>
      <el-form>

        <el-form-item label="类型：">
          <el-radio v-model="medicalAdviceField" label="长期医嘱" @change="longTermShow ()">长期医嘱</el-radio>
          <el-radio v-model="medicalAdviceField" label="临时医嘱" @change="tempShow ()">临时医嘱</el-radio>


        </el-form-item>
      </el-form>
      <!-- 长期医嘱模板-->
      <el-descriptions v-if="self.status == 0" :column="1" :size="size" border>
        <el-descriptions-item>
          <el-form>
            <div v-if="self.status == 0">生活环境：</div>
            <el-input
                v-if="self.status == 0"
                v-model="self.lifeEnvironment"
                :autosize="{ minRows: 0, maxRows: 10}"
                style="width: 800px"
                type="textarea"
            >

            </el-input>
            <div v-if="self.status == 0">呼吸训练：</div>
            <el-input
                v-if="self.status == 0"
                v-model="self.breathTrain"
                :autosize="{ minRows: 0, maxRows: 10}"
                style="width: 800px"
                type="textarea"
            >
            </el-input>
            <div v-if="self.status == 0">运动建议：</div>
            <el-input
                v-if="self.status == 0"
                v-model="self.sportsAdvice"
                :autosize="{ minRows: 0, maxRows: 10}"
                style="width: 800px"
                type="textarea"
            >
            </el-input>
            <div v-if="self.status == 0">情志管理：</div>
            <el-input
                v-if="self.status == 0"
                v-model="self.emotionManage"
                :autosize="{ minRows: 0, maxRows: 10}"
                style="width: 800px"
                type="textarea"
            >
            </el-input>
            <div v-if="self.status == 0">医疗护理：</div>
            <el-input
                v-if="self.status == 0"
                v-model="self.medicalCare"
                :autosize="{ minRows: 0, maxRows: 10}"
                style="width: 800px"
                type="textarea"
            >
            </el-input>
          </el-form>

        </el-descriptions-item>
      </el-descriptions>

      <!-- 临时医嘱-->
      <el-descriptions v-if="self.status == 1" :column="1" :size="size" border>
        <el-descriptions-item>
          <el-form>
            <div v-if="self.status == 1">临时/备用医嘱：</div>
            <el-input
                v-if="self.status == 1"
                v-model="self.detail"
                :autosize="{ minRows: 5, maxRows: 10}"
                style="width: 800px"
                type="textarea"
            >

            </el-input>

          </el-form>

        </el-descriptions-item>
      </el-descriptions>


      <el-button v-if="self.status == 1 || self.status == 0" @click="pushMedicalAdvice()">推送</el-button>

    </el-dialog>




  </div>
</template>

<script>

import Common from './module/Common'

export default {
  name: "Archives",


  data() {
    return {

      type: null,  //档案号 /姓名 (查询条件)
      rangeDate: null,//筛选日期范围
      dialogVisible: false,//新建档案按钮是否可见
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      dialogVisible5: false,
      //----相机相关
      videoWidth: 300,
      videoHeight: 300,

      tongueImgSrc: "",//图片
      thisCancas: null,
      thisContext: null,
      thisVideo: null,
      //------
      currentPage: 1,
      pageSize: 10,
      total: null,
      drawer: false,
      //当前诊次，选中时展示在菜单中
      visitSequence: null,
      //建档采集字段
      ruleForm: {
        checkOne: null,
        checkTwo: null,
        addOne: null,
        addTwo: null,
        addThree: null,
        addFour: null,
        excludeOne: null,
        excludeTwo: null,
        excludeThree: null,
        sex: null,
        birth: null,
        nation: null,
        marriage: null,
        edu: null,
        profession: null,
        height: null,
        weight: null,
        startDate: null,
        sureDate: null,
        pastHistory: [],
        otherPastHistory: null,
        smokeHistoryYear: null,
        smokeNum: null,
        noSmokeDays: null,
        drinkHistoryYear: null,
        whiteDrink: null,
        bearDrink: null,
        noDrinkDays: null,
        exposureHistoryYear: null,
        exposureHistory: null,
        pets: null,
        familyHistory: null,
        otherFamilyHistory: null,
        drugAllergyHistory: null,
        drugAllergyHistoryDetail: null,
        name: null,
        phone: null,
        address: null,
        birthDate: null


      },
      //患者档案数据
      tableData: [],

      //表单校验规则
      rules: {
        name: [
          {required: true, message: '姓名不能为空', trigger: 'blur'},
        ],
        phone: [
          {required: true, message: '电话不能为空', trigger: 'blur'},
        ],
        address: [
          {required: true, message: '地址不能为空', trigger: 'blur'},

        ],
        birthDate: [
          {required: true, message: '出生日期不能为空', trigger: 'blur'},

        ],

      },
      //当前选中的患者id
      nowCollectNo: null,
      //就诊采集字段
      collectForm: {
        //表一字段
        main: null,
        present: null,
        visible: null,//刻下症
        cough: null,
        nature: null,
        degree: null,
        increaseFactors: null,
        decreaseFactors: null,
        expectoration: null,
        volume: null,
        phlegmColor: null,
        phlegmQuality: null,
        phlegmTaste: null,
        dyspnea: null,
        dyspneaIncrease: [],
        dyspneaIncreaseOther: null,
        dyspneaDecrease: [],
        dyspneaDecreaseOther: null,
        dyspneaDegree: null,
        accompanyingSymptoms: [],
        accompanyingSymptomsOther: null,
        pulmonarySystem: [],
        pulmonarySystemOther: null,
        coldAndHeat: [],
        perspiration: [],
        perspirationOther: null,
        spirit: [],
        spiritOther: null,
        emotion: [],
        emotionOther: null,
        complexion: [],
        complexionOther: null,
        food: [],
        foodOther: null,
        drink: [],
        drinkOther: null,
        taste: [],
        tasteOther: null,
        urine: [],
        urineOther: null,
        defecate: [],
        defecateOther: null,
        sleep: [],
        sleepOther: null,
        bodyAndLimbs: [],
        bodyAndLimbsOthers: null,
        tongueColor: [],
        tongueShape: [],
        tongueState: [],
        coatingNature: [],
        coatingColour: [],
        tongueUnder: [],
        tongueUnderOther: null,
        pulseCondition: [],
        disease: null,
        syndromeType: null,
        //处方信息：

        therapy: null,
        prescriptionName: null,
        prescription: null,
        medicineNum: null,
        decoctingMethod: null,
        chinesePatentMedicine: null,
        acupunctureAndMassage: null,
        westernMedicinePrescription: null,
        adviceForFood: null,
        adviceForDailyLife: null,
        adviceForEmotion: null,
        adviceForOther: null,

        //必要的临床检查
        hrctDate: null,
        hrctStore: null,
        lungFunctionDate: null,
        lungFunctionStore: null,
        bloodGasAnalysisDate: null,
        bloodGasAnalysisStore: null,
        walkTestDate: null,
        walkTestStore: null,
        rayDate: null,
        rayStore: null,
        colourSonographyDate: null,
        colourSonographyStore: null,
        routineBloodTestDate: null,
        routineBloodTestStore: null,
        bloodExaminationDate: null,
        bloodExaminationStore: null,
        coagulationFunctionDate: null,
        coagulationFunctionStore: null,
        westernMedicineHas: null,
        westernMedicineMain: [],
        westernMedicineMainOther: null,
        chinesePatentMedicineHas: null,
        chinesePatentMedicineMain: null,
        therapyHas: null,
        therapyMain: [],
        therapyMainOther: null,
        dataExpansion: null,
        //疗效评价
        mymopOnePointOne: null,
        mymopOnePointOneScore: null,
        mymopOnePointTwo: null,
        mymopOnePointTwoScore: null,
        mymopTwo: null,
        mymopTwoScore: null,
        mymopThree: null,
        mymopFour: null,
        mymopFive: null,
        mymopSixPointOne: null,
        mymopSixPointTwo: null,
        mymopSeven: null,
        mymopEight: null,
        //圣乔治
        sgrqDescription: null,
        sgrqPartOnePointOne: null,
        sgrqPartOnePointTwo: null,
        sgrqPartOnePointThree: null,
        sgrqPartOnePointFour: null,
        sgrqPartOnePointFive: null,
        sgrqPartOnePointSix: null,
        sgrqPartOnePointSeven: null,
        sgrqPartTwoOnePointOne: null,
        sgrqPartTwoOnePointTwo: null,

        sgrqPartTwoTwoPointTwo: null,
        sgrqPartTwoTwoPointThree: null,
        sgrqPartTwoTwoPointFour: null,
        sgrqPartTwoTwoPointFive: null,
        sgrqPartTwoTwoPointSix: null,
        sgrqPartTwoTwoPointSeven: null,
        sgrqPartTwoThreePointOne: null,
        sgrqPartTwoThreePointTwo: null,
        sgrqPartTwoThreePointThree: null,
        sgrqPartTwoThreePointFour: null,
        sgrqPartTwoThreePointFive: null,
        sgrqPartTwoThreePointSix: null,
        sgrqPartTwoFourPointOne: null,
        sgrqPartTwoFourPointTwo: null,
        sgrqPartTwoFourPointThree: null,
        sgrqPartTwoFourPointFour: null,
        sgrqPartTwoFourPointFive: null,
        sgrqPartTwoFourPointSix: null,
        sgrqPartTwoFourPointSeven: null,
        sgrqPartTwoFourPointEight: null,
        sgrqPartTwoFivePoint: null,
        sgrqPartTwoFivePointOne: null,
        sgrqPartTwoFivePointTwo: null,
        sgrqPartTwoFivePointThree: null,
        sgrqPartTwoFivePointFour: null,
        sgrqPartTwoSixPointOne: null,
        sgrqPartTwoSixPointTwo: null,
        sgrqPartTwoSixPointThree: null,
        sgrqPartTwoSixPointFour: null,
        sgrqPartTwoSixPointFive: null,
        sgrqPartTwoSixPointSix: null,
        sgrqPartTwoSixPointSeven: null,
        sgrqPartTwoSixPointEight: null,
        sgrqPartTwoSixPointNine: null,
        sgrqPartTwoSevenPointOne: null,
        sgrqPartTwoSevenPointTwo: null,
        sgrqPartTwoSevenPointThree: null,
        sgrqPartTwoSevenPointFour: null,
        sgrqPartTwoSevenPointFive: null,
        sgrqPartTwoEightPointOne: null,
        sgrqPartTwoEightPointTwo: null,
        sgrqPartTwoEightPointThree: null,
        sgrqPartTwoEightPointFour: null,
        sgrqPartTwoEightPointFive: null,
        sgrqPartTwoEightPointSix: null,
        sgrqPartTwoNinePointOne: null,
        sgrqPartThree: null,
        level: null,
        sgrqPartTwoTwoPointOne: null,


      },
      visitHistory: null,
      // 当前操作的某一次就诊历史数据
      visitHistoryItem: null,
      //录音使用
      recorder: null,
      //录音url
      soundRecordingUrl: null,
      // 医嘱字段
      self: {
        lifeEnvironment: "1.（生活环境）注意天气变化，适时増减衣物，冬季外出最好配戴口罩，保证患者居住环境舒适卫生，远离刺激性气味气体，远离外源性过敏原。\n" +
            "2.（戒烟、戒酒）有吸烟史的患者必须戒烟，积极使用戒烟新产品，家庭中的吸烟者禁止在与患者相处期间吸烟，减少患者与其他吸烟者的相处时间。（对患者不健康的、或错误的日常生活习惯提出建议，此点可去除）\n" +
            "3.（生活饮食）饮食上，少食辛辣刺激性、油腻食品，日常饮食中以清淡为主，尽量多食用富含优质蛋白、高热量和高维生素的食物。咳嗽严重的患者，可在饮食中加陈皮或梨；萝卜、生姜有宣肺止咳的效果，有条件的可给予雪梨银耳汤，可清肺祛痰。\n" +
            "4.（预防感染）患者要注意保暖，不可以受寒，同时要预防感染；\n" +
            "注意口腔卫生，观察口腔有无白色点状物或白斑，及时做好口腔护理，有感染情况及时就医。",
        breathTrain: "5.（呼吸训练）患者可以进行呼吸训练，如腹式呼吸、缩唇呼气、吹蜡烛训练、进行四肢伸展、扩胸、弯腰、下蹲等运动，改善患者肺通气、换气功能，每日需进行2次，每次30min。（时间、次数、训练种类由医生根据患者身体情况决定）",
        sportsAdvice: "6.（运动）患者需适度运动，选择如改良式太极、五禽戏、中医八段锦、太极拳、上下楼梯、散步、骑自行车、提高患者运动耐受性，增加潮气量。患者运动期间需有监护人陪同，且以不感到心慌、胸闷、气短为宜，患者视体能状况每日练习30min~40min，以微微出汗为宜，每周运动4～5次。（时间、次数和训练种类由医生根据患者身体情况决定）",
        emotionManage: "7.（心情）保持患者情绪舒畅、稳定，播放舒缓类的音乐或者节目，让患者放松心情，加强沟通，舒缓患者情绪，避免患者的焦虑、抑郁现象；若存在焦虑症状，可应用移情易性的方法，提及患者感兴趣的事情或话题，或者通过中医学的情志相胜法、五音疗法、导引吐纳法，帮助患者缓解。",
        medicalCare: "8.（用药指导）出院带药：需罗列具体药物名称、剂量、用法、频次，开具的数量以及服药注意事项。\n" +
            "9.（用药/治疗）坚持按时服药或治疗，如每周进行2次雾化吸入、排痰训练、家庭氧疗、肺康复治疗及注意事项（医生可根据情况与第8点合并）。\n" +
            "10.（随访）出院后需参与定期随访，定期回医院进行其他治疗的项目，如“2周后门诊行玻璃酸钠注射”等等。\n" +
            "11.（自我管理）患者在家需要记录锻炼情况，按时填写自我管理情况问卷，复诊时间（什么情況下需要复诊或每周哪一天可以到XXX门诊复诊），另其他专科疾病或检查检验结果需其他专科或医院诊治的需告知清楚。",
        status: null,
        detail: null
      },
      // 绑定选择模板的单选按钮 无实际意义
      medicalAdviceField: null,
      size:'',
      archivesId:''
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.onSubmit()//查询
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.onSubmit()
    },
    //筛选条件提交
    onSubmit() {
      let startDate
      let endDate
      let that = this
      //将选择的时间赋值
      if (this.rangeDate != null) {
        startDate = this.rangeDate[0]
        endDate = this.rangeDate[1]
        startDate = startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate()
        endDate = endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate()
      }
      //提交时间，请求访问档案数据
      this.$axios.get("/doctor/archives/getArchivesList", {
        params: {
          type: that.type || "",
          startDate: startDate || "",
          endDate: endDate || "",
          currentPage: that.currentPage,
          pageSize: that.pageSize
        },
      }).then(res => {
        console.log(res)
        //表单中显示符合的数据（多条）
        that.tableData = res.data.data.list
        that.total = res.data.data.total
        that.pageSize = res.data.data.pageSize
        console.log(that.tableData)
      })
    },

    //新建档案
    saveArchives() {
      if (this.ruleForm.name == null || this.ruleForm.phone == null || this.ruleForm.address == null || this.ruleForm.birthDate == null) {
        this.$message({
          showClose: true,
          message: "请输入必填字段后再提交",
          type: 'error'
        });
      } else {


        let that = this
        this.$axios.post("/doctor/archives/saveArchives", {

          checkOne: that.ruleForm.checkOne,
          checkTwo: that.ruleForm.checkTwo,
          addOne: that.ruleForm.addOne,
          addTwo: that.ruleForm.addTwo,
          addThree: that.ruleForm.addThree,
          addFour: that.ruleForm.addFour,
          excludeOne: that.ruleForm.excludeOne,
          excludeTwo: that.ruleForm.excludeTwo,
          excludeThree: that.ruleForm.excludeThree,
          sex: that.ruleForm.sex,
          birth: that.ruleForm.birth,
          nation: that.ruleForm.nation,
          marriage: that.ruleForm.marriage,
          edu: that.ruleForm.edu,
          profession: that.ruleForm.profession,
          height: that.ruleForm.height,
          weight: that.ruleForm.weight,
          startDate: that.ruleForm.startDate,
          endDate: that.ruleForm.sureDate,
          pastHistory: that.ruleForm.pastHistory,
          otherPastHistory: that.ruleForm.otherPastHistory,
          smokeHistoryYear: that.ruleForm.smokeHistoryYear,
          smokeNum: that.ruleForm.smokeNum,
          noSmokeDays: that.ruleForm.noSmokeDays,
          drinkHistoryYear: that.ruleForm.drinkHistoryYear,
          whiteDrink: that.ruleForm.whiteDrink,
          bearDrink: that.ruleForm.bearDrink,
          noDrinkDays: that.ruleForm.noDrinkDays,
          exposureHistoryYear: that.ruleForm.exposureHistoryYear,
          exposureHistory: that.ruleForm.exposureHistory,
          pets: that.ruleForm.pets,
          familyHistory: that.ruleForm.familyHistory,
          otherFamilyHistory: that.ruleForm.otherFamilyHistory,
          drugAllergyHistory: that.ruleForm.drugAllergyHistory,
          drugAllergyHistoryDetail: that.ruleForm.drugAllergyHistoryDetail,
          name: that.ruleForm.name,
          phone: that.ruleForm.phone,
          address: that.ruleForm.address,
          birthDate: that.ruleForm.birthDate,


        }).then(res => {
          console.log(res)
          that.resetForm('ruleForm')
          if (res.data.message == "success") {
            that.dialogVisible = false
            that.$message({
              showClose: true,
              message: res.data.data,
              type: 'success'
            });
            this.onSubmit()

          }

        })
      }

    },
    //重置新建表单
    resetForm(ruleForm) {
      this.$refs[ruleForm].resetFields();
    },
    //重置就诊采集表单
    resetFormForCollect(collectForm) {
      this.$refs[collectForm].resetFields();
    },
    //选中患者
    choose(row) {
      let that = this

      this.nowCollectNo = row.archivesNo

      this.drawer = true

      this.$axios.get("/doctor/visit/getVisitSequence", {
        //当前选中的患者档案号
        params: {
          archivesNo: that.nowCollectNo,
        },

      }).then(res => {
        console.log(res)

        if (res.data.message == "success") {
          that.visitSequence = res.data.data.sequence
        }

      })
    },


    //展开表单问卷 并查询上一次填写的随访记录 进行回写
    showVisitForm() {

      let that = this
      this.dialogVisible2 = true
      this.$axios.post("/doctor/visit/getLastSurvey", {
        //患者档案号
        archivesId: that.nowCollectNo,
        sequence: that.visitSequence

      }).then(res => {
        console.log(res)
        // 非第一诊
        if (res.data.message == "success" && res.data.data.sequence != null) {

          that.$message('系统匹配到当前患者存在上一诊次的记录,已自动回写历史数据,您只需在上次的基础上修改即可提交');
          that.collectForm = res.data.data.survey
        }
        // 第一诊 或上一诊无数据的 重新设置表单字段为 返回的null值 ，避免 将别的病人的数据 错误回写到 当前病人表单中
        else {
          that.collectForm = res.data.data.survey
        }


      })

    },

    //就诊信息采集-表单
    saveCollectForm() {

      let that = this
      this.$axios.post("/doctor/visit/saveCollectForm", {
        //当前采集的患者档案号
        archivesNo: that.nowCollectNo,
        collectForm: that.collectForm,

      }).then(res => {
        console.log(res)
        that.resetFormForCollect('collectForm')
        if (res.data.message == "success") {
          that.dialogVisible2 = false
          that.$message({
            showClose: true,
            message: res.data.data,
            type: 'success'
          });


        }

      })

    },

    //结束本次采集
    over() {
      let that = this
      this.$confirm('该患者本次就诊的相关信息是否采集完成？点击确定患者将会进入下一个诊次。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {


        this.$axios.post("/doctor/visit/overNowCollect", {
          //当前采集的患者档案号
          archivesNo: that.nowCollectNo,
        }).then(res => {
          console.log(res)

          if (res.data.message == "success") {
            that.$message({
              showClose: true,
              message: res.data.data,
              type: 'success'
            });

          }

          this.$axios.get("/doctor/visit/getVisitSequence", {
            //当前选中的患者档案号
            params: {
              archivesNo: that.nowCollectNo,
            },

          }).then(res => {
            console.log(res)

            if (res.data.message == "success") {
              that.visitSequence = res.data.data.sequence
            }

          })
        });

      })


    },
    //转入随访
    pushFollow() {

      let that = this
      this.$confirm('是否将当前用户转入随访流程？（若患者的诊次大于三次,无需手动转入,系统已自动转入随访流程）', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {


        this.$axios.post("/doctor/visit/pushFollow", {
          //当前采集的患者档案号
          archivesNo: that.nowCollectNo,
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

      })

    },




    // 调用权限（打开摄像头功能）
    getCompetence() {
      let _this = this;
      this.$nextTick(()=>{
      //   // 初始化的时候直接让为空
      //  // this.tongueImgSrc='';

        this.thisCancas = document.getElementById("canvasCamera");
        this.thisContext = this.thisCancas.getContext("2d");//报错
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
          const getUserMedia =
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
      const constraints = {
        audio: false,
        video: {
          width: _this.videoWidth,
          height: _this.videoHeight,
          transform: "scaleX(-1)",
        },
      };
      navigator.mediaDevices
          .getUserMedia(constraints)
          .then(function (stream) {
            let _this1=_this
            // 旧的浏览器可能没有srcObject
            if ("srcObject" in _this1.thisVideo) {
              _this.thisVideo.srcObject = stream;
            } else {
              // 避免在新的浏览器中使用它，因为它正在被弃用。
              _this1.thisVideo.src = window.URL.createObjectURL(stream);
            }
            _this1.thisVideo.onloadedmetadata = function (e) {
              _this1.thisVideo.play();
            };
          })
          .catch((err) => {
            console.log(err);
          });

      })
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

    //舌象图片提交
    tongueImgSubimt() {
      let that = this
      if (this.tongueImgSrc == "" || this.tongueImgSrc == null) {
        this.$confirm('还未拍照,不能提交', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      } else {


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
            sequence: that.visitSequence,
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
    //舌象图片采集调用
    tongueCollect() {
      this.dialogVisible3 = true,
          this.tongueImgSrc = null
    },
    //获取历史就诊
    getVisitHistory() {
      let that = this
      this.dialogVisible4 = true,
          this.$axios.get("/doctor/visit/visitHistory", {
            //当前采集的患者档案号
            params: {
              archivesNo: that.nowCollectNo
            },

          }).then(res => {
            that.visitHistory = res.data.data
            console.log(res.data.data[0].archivesId)
            console.log(res.data.data[0].survey)

          });

    },

    //获取历史就诊 点击的某一行绑定的数据
    getHistoryRow(item) {
      console.log(item)
      this.visitHistoryItem = item;
    },
    //更新就诊信息
    updateForm() {
      let that = this
      this.$confirm('是否确认修改当前采集信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {


        this.$axios.post("/doctor/visit/updateForm", {
          id: that.visitHistoryItem.id,  //要修改的数据的id
          survey: that.visitHistoryItem.survey //需要更新的问卷信息
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
    submitExperience(experience, id) {
      let that = this
      this.$confirm('是否确认提交？如果已有心得,提交后将会覆盖之前的心得', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {


        this.$axios.post("/doctor/visit/updateExperience", {
          id: id,  //要修改的数据的id
          experience: experience //需要更新的心得
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

    //开始录音
    start(item) {
      let recordBtn = document.getElementById("record-btn")
      let player = document.getElementById("audio-player")
      player.src = item.soundRecordingUrl
      if (navigator.mediaDevices.getUserMedia) {
        var chunks = [];
        const constraints = {audio: true};
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
                var blob = new Blob(chunks, {type: "audio/ogg; codecs=opus"});
                chunks = [];
                //  var audioURL = window.URL.createObjectURL(blob);
                //  player.src = audioURL;

                this.getBase64(blob).then(res => {
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
    //图片转为64编码
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
    submitSoundRecording(id, url) {
      let that = this
      this.$confirm('是否确认提交？如果已有点评,提交后将会覆盖之前的点评', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        this.$axios.post("/doctor/visit/updateSound", {
          id: id,  //要修改的数据的id
          soundRecordingUrl: url //需要更新的录音
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
    // 弹出医嘱对话框
    showMedicalAdvice() {
      this.dialogVisible5 = true;
    },
    // 选择长期医嘱
    longTermShow() {
      this.self.status = 0;
    },
    // 选择临时医嘱
    tempShow() {
      this.self.status = 1;
    },

    //推送按钮触发
    pushMedicalAdvice() {
      let that = this
      this.$confirm('是否确认推送', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        this.$axios.post("/doctor/medicalAdvice/push", {
          lifeEnvironment: that.self.lifeEnvironment,
          breathTrain: that.self.breathTrain,
          sportsAdvice: that.self.sportsAdvice,
          emotionManagement: that.self.emotionManagement,
          medicalCare: that.self.medicalCare,
          status: that.self.status,
          detail: that.self.detail,
          archivesId: that.nowCollectNo,
        }).then(res => {
          console.log(res)

          if (res.data.message == "success") {
            that.$message({
              showClose: true,
              message: res.data.data,
              type: 'success'
            });
            that.dialogVisible5 = false
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
    let that = this
    //随访超时提醒
    if (!Common.remindFlag) {
      this.$axios.post("/doctor/follow/remind").then(res => {
        console.log(res)

        if (res.data.message == "success") {
          let num = res.data.data
          if (num > 0) {
            this.$notify({
              title: '提示',
              message: '您当前有' + num + '位患者处于随访超时队列,请尽快安排随访工作',
              duration: 0
            });
          }
        }
        Common.remindFlag = true

      });
    }


  }

}
</script>

<style scoped>
/*筛选区域样式*/
.demo-form-inline {
  width: 100%;
  height: 60px;
  margin: 10px;

}

/*患者档案区域*/
.table-column {
  width:65%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/*患者档案区域标题*/
.archives {
  display: flex;
  width: 200px;
  font-size: 18px;
  margin-top: 10px;
  margin-bottom: 30px;
  align-items: center;
  justify-content: center;

  border: #547c59 solid 1px;
  border-radius: 10px;
  height: 55px;
  color: #000000;
  font-weight: bold
}

/*表格标题行*/
.el-table-column {
  height: 30px;
}

/*操作表格区域*/
.table-operation {
  width: 35%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

}

/*1.操作表单*/
.formOne {

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
}

.form-text {
  width: 400px;
  font-size: 18px;
  color: #000;
  height: 70px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;

}
.item-text1{
 width: 50%;
  height: 70px;
  border: #164d43 solid 1px;
  border-right: none;
}
.item-text2{
  width: 50%;
  height: 70px;
  border: #164d43 solid 1px;
}
/*2.处理表单*/
.formTwo {
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: #aaaaaa solid 1px;
  margin-bottom: 30px;
  border-radius: 15px;
}
.form-text2 {
  width: 400px;
  font-size: 18px;
  font-weight: 600;
  color: #000;
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  height: 80px;

}


/*分页*/
.block{
  display: flex;
  width: 100%;
  margin: 10px;
  align-items: center;
  justify-content: center;

}
/*弹窗*/
el-descriptions{
  border-radius: 20px;
}




.differentText {
  color: red;
}

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
  width: 40%;
  display:flex;

  flex-direction: column;
  position: absolute;
  justify-content: center;
  right: 0;
  top: 0;
}

img {
  width: 300px;
  height: 300px;
  border: #3d634a solid 1px
}


</style>