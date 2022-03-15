<template>

  <div style="width: 100%;height:100vh; display: flex;flex-direction: row">
    <!-- 筛选与自我管理数据-->
    <div style="width: 45%;display: flex;flex-direction: column">
      <div  style="width:100%;">
        <!--自我管理信息筛选——回车可执行-->

          <el-form :inline="true" class="demo-form-inline" label-width="200px" style="width:100%; display: flex;flex-direction: row">
            <!--姓名/档案号筛选-->
            <el-form-item>
              <span>筛选条件</span>
            </el-form-item>
            <el-form-item>
              <el-input v-model="type" clearable placeholder="档案号" @input="change($event)"></el-input>
            </el-form-item>

            <!--筛选查询按钮-->
            <el-form-item>
              <el-button style="background-color: #668c5d; border-radius: 10px;color: white" @click="onSubmit">查询
              </el-button>
            </el-form-item>

          </el-form>




        <!--患者自我管理数据与查看详情-->
        <div style="width: 100%; height:80vh; display: flex;flex-direction: row">
          <!--自我管理数据区-->
          <div class="table-column">
            <div class="archives"> 患者自我管理数据</div>
            <!--病人档案数据表单-->

            <el-table :data="tableData" border border
                      default-expand-all height="250"
                      row-key="id" style="width: 522px;  margin-left: 50px; border-radius: 15px; border: #aaaaaa solid 1px;">
              <el-table-column label="档案号" prop="archivesId" width="150"></el-table-column>
              <el-table-column label="姓名" prop="name" width="120"></el-table-column>
              <el-table-column label="上次提交时间" prop="lastTime" width="150"></el-table-column>
              <!--操作列-->
              <el-table-column label="操作" prop="option" width="100">
                <!--  <el-button size="mini" round @click="drawer = true">选中</el-button>-->
                <template slot-scope="scope">
                  <el-button round size="mini" style="border: #90b477 solid 1px; color:#1f5548; background-color: #d2efc3"
                             @click="seeDetails(scope.row)">查看
                  </el-button>
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
        </div>
      </div>

    </div>




    <!--患者自我管理详情-->
    <div style="width: 55%;">
      <div class="table-column" style="height: 95vh;">
        <div class="archives">患者自我管理详情</div>
        <el-table height="250"
            :data="tableData2"
            style="width: 100%;border-radius: 15px; border: #aaaaaa solid 1px;">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form class="demo-table-expand" inline label-position="left">
                <el-form-item label="1.	你的居住环境是否舒适？">
                  <span>{{ props.row.selfManageSurvey.lifeOne }}</span>
                </el-form-item>
                <el-form-item label="2.你是否发生过敏反应？">
                  <span>{{ props.row.selfManageSurvey.lifeTwo }}</span>
                </el-form-item>
                <el-form-item label="3.你是否戒烟戒酒？">
                  <span>{{ props.row.selfManageSurvey.lifeThree }}</span>
                </el-form-item>
                <el-form-item label="4.你是否发生感染现象？">
                  <span>{{ props.row.selfManageSurvey.lifeFour }}</span>
                </el-form-item>
                <el-form-item label="5.你的睡眠和饮食怎么样？">
                  <span>{{ props.row.selfManageSurvey.lifeFive }}</span>
                </el-form-item>
                <el-form-item label="6.你是否感到焦虑或者压抑？">
                  <span>{{ props.row.selfManageSurvey.moodOne }}</span>
                </el-form-item>
                <el-form-item label="7.产生焦虑或者抑郁现状，你是否有通过以下方式缓解？">
                  <span>{{ props.row.selfManageSurvey.moodTwo }}</span>
                </el-form-item>
                <el-form-item label="8.你是否遵从医嘱按时做常规运动？">
                  <span>{{ props.row.selfManageSurvey.sportOne }}</span>
                </el-form-item>
                <el-form-item label="9.你做了以下哪些运动？">
                  <span>{{ props.row.selfManageSurvey.sportTwo }}</span>
                </el-form-item>
                <el-form-item label="10.你总计运动时长大约为？">
                  <span>{{ props.row.selfManageSurvey.sportThree }}</span>
                </el-form-item>
                <el-form-item label="11.你做运动时是否感到吃力和困难？">
                  <span>{{ props.row.selfManageSurvey.sportFour }}</span>
                </el-form-item>
                <el-form-item label="12.你认为你做的运动训练项目是否需要调整？">
                  <span>{{ props.row.selfManageSurvey.sportFive }}</span>
                </el-form-item>
                <el-form-item label="13.你是否遵从医嘱按时进行呼吸训练？">
                  <span>{{ props.row.selfManageSurvey.breathOne }}</span>
                </el-form-item>
                <el-form-item label="14.你做了以下哪种呼吸训练？ ">
                  <span>{{ props.row.selfManageSurvey.breathTwo }}</span>
                </el-form-item>
                <el-form-item label="15.你做呼吸训练时是否感到吃力和困难？">
                  <span>{{ props.row.selfManageSurvey.breathThree }}</span>
                </el-form-item>
                <el-form-item label="16.你总计呼吸训练时长大约为？">
                  <span>{{ props.row.selfManageSurvey.breathFour }}</span>
                </el-form-item>
                <el-form-item label="17.你认为你做的呼吸训练项目是否需要调整？">
                  <span>{{ props.row.selfManageSurvey.breathFive }}</span>
                </el-form-item>
                <el-form-item label="18.你是否遵从医嘱按时做了护理活动？ ">
                  <span>{{ props.row.selfManageSurvey.nursingOne }}</span>
                </el-form-item>
                <el-form-item label="19.你做了以下护理活动？ ">
                  <span>{{ props.row.selfManageSurvey.nursingTwo }}</span>
                </el-form-item>
                <el-form-item label="20.你认为你做的护理项目是否需要调整？">
                  <span>{{ props.row.selfManageSurvey.nursingThree }}</span>
                </el-form-item>
                <el-form-item label="21.你是否按时按量服药？">
                  <span>{{ props.row.selfManageSurvey.medicineOne }}</span>
                </el-form-item>
                <el-form-item label="22.你是否觉得要坚持治疗计划有困难？">
                  <span>{{ props.row.selfManageSurvey.medicineTwo }}</span>
                </el-form-item>
                <el-form-item label="23.你是否感受到呼吸困难？">
                <span>{{ props.row.selfManageSurvey.medicineThree }}</span>
                </el-form-item>
                <el-form-item label="24.你认为你做的治疗项目是否需要调整？">
                  <span>{{ props.row.selfManageSurvey.medicineFour }}</span>
                </el-form-item>
                <el-form-item label="25.你是否有什么需要和医生交流的？">
                  <span>{{ props.row.otherChat }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
              label="日期"
              prop="createTime">
          </el-table-column>
          <el-table-column
              label="档案号"
              prop="id">{{tableData2.id}}
          </el-table-column>
          <el-table-column
              label="答题人"
              prop="resultName">{{tableData2.resultName}}
          </el-table-column>
          <el-table-column
              label="其他"
              prop="otherChat">
          </el-table-column>
        </el-table>
      </div>
    </div>


  </div>


</template>

<script>

export default {
  name: "SelfManage",

  data() {
    return {
      type: null,  //档案号 非必填(查询条件)
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: null,
      drawer: false,
      //当前选中的患者id和姓名
      nowCollectNo: null,
      nowName:null,
      //自我管理问卷内容
      tableData2:[
        {
          createTime:'例：2022-01-01',
          otherChat: "可不填",
          id:'0000000001',
          resultName:'张**',
          selfManageSurvey:{
            lifeOne: "",
            lifeTwo: " ",
            lifeThree: " ",
            lifeFour: " ",
            lifeFive: " ",
            moodOne: " ",
            moodTwo: " ",
            sportOne: " ",
            sportTwo: " ",
            sportThree: " ",
            sportFour: " ",
            sportFive: " ",
            breathOne: " ",
            breathTwo: " ",
            breathThree: " ",
            breathFour: " ",
            breathFive: " ",
            nursingOne: " ",
            nursingTwo: " ",
            nursingThree: " ",
            medicineOne: " ",
            medicineTwo: " ",
            medicineThree: " ",
            medicineFour: " "
          },

        },

      ],






    }

  },
  methods: {
    //输入框无法输入问题解决
    change(e) {
      this.$forceUpdate();
    },
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
      let that = this
      console.log("查询")
      console.log(this.archivesId)
      this.$axios.get("/doctor/selfManage/list", {
            params: {
              archivesId: that.type,//(档案号，非必填)
              currentPage: that.currentPage,//(当前页号，必填)
              pageSize: that.pageSize,//(每页数量，必填)
            },
          }
      ).then(res => {
        console.log(res)
        //表单中显示符合的数据（多条）
        that.tableData = res.data.data.list//自我管理列表内容
        that.total = res.data.data.total
        that.pageSize = res.data.data.pageSize
        console.log(that.tableData)
      })
    },

    //查看详情
    seeDetails(row) {
      let that = this
      console.log(row);
      //当前选中的患者档案号和姓名
      this.nowCollectNo = row.archivesId


      //this.drawer = true
      this.$axios.get("/doctor/selfManage/detail", {
        params: {
          //患者档案号
          archivesId: that.nowCollectNo,
        },
      }).then(res => {
        console.log("日期：",that.nowCollectNo)
        if (res.data.message == "success") {
          that.tableData2=res.data.data
          that.tableData2.id =that.nowCollectNo
          that.tableData2.resultName = row.name

          // console.log(that.tableData2.resultName)

        }

      })
    },

  },
  created() {
    this.onSubmit()


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
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/*患者自我管理区域标题*/
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

/*患者自我管理详情*/

.el-form-item{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}

</style>