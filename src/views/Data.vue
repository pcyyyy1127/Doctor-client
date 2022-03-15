<template>
  <div style="width: 94%; display: flex;flex-direction: row">


    <!--数据展示-->
    <div style="width:88%;margin-top: 20px;margin-left: 20px">

      <div class="echartsDiv">
        <div class="chartDiv">
          <div id="myChart3" style="width: 550px;height: 400px;"></div>
        </div>
        <div class="chartDiv">
          <div id="myChart4" style="width: 550px;height: 400px;"></div>
        </div>
      </div>

      <div class="echartsDiv">
        <div class="chartDiv">
          <div id="myChart1" style="width: 550px;height: 400px;"></div>
        </div>
        <div class="chartDiv">
          <div id="myChart2" style="width: 550px;height: 400px;"></div>
        </div>
      </div>

    </div>


    <!--数据导出-->
    <div style="width: 10%;margin-top: 20px;margin-right: 20px">
      <el-form class="demo-form-inline" label-width="100px">

        <!--导出就诊数据按钮-->
        <el-form-item>
          <el-button style="background-color: #668c5d; color: white;" @click="showDialog()">导出就诊数据
          </el-button>
        </el-form-item>
        <!--导出随访数据按钮-->
        <el-form-item>
          <el-button style="background-color: #efbf53; color: white" @click="showDialogFollow()">
            导出随访数据
          </el-button>
        </el-form-item>
      </el-form>


      <!--数据导出范围-->
      <el-dialog :visible.sync="dialogVisible" width="40%">
        <h2 style="margin-top: -10%">请选择导出范围</h2>
        <el-form>

          <el-form-item label="导出范围：">
            <el-radio v-model="type" label="全部" @change="inputVisible = false">全部</el-radio>
            <el-radio v-model="type" label="按档案号" @change="inputVisible = true">按档案号</el-radio>
            <el-input v-if="inputVisible" v-model="archivesId" placeholder="请输入档案号" size="mini"
                      style="width: 140px"></el-input>
          </el-form-item>
        </el-form>

        <el-button  style="background-color: #668c5d; color: white;" @click="exportVisit()">导出</el-button>


      </el-dialog>


      <!--数据导出范围-->
      <el-dialog :visible.sync="dialogVisible2" width="40%">
        <h2 style="margin-top: -10%">请选择导出范围</h2>
        <el-form>

          <el-form-item label="导出范围：">
            <el-radio v-model="type" label="全部" @change="inputVisible = false">全部</el-radio>
            <el-radio v-model="type" label="按档案号" @change="inputVisible = true">按档案号</el-radio>
            <el-input v-if="inputVisible" v-model="archivesId" placeholder="请输入档案号" size="mini"
                      style="width: 140px"></el-input>
          </el-form-item>
        </el-form>

        <el-button style="background-color: #efbf53; color: white" @click="exportFollow()">导出</el-button>


      </el-dialog>


    </div>


  </div>

</template>

<script>


import * as echarts from 'echarts';


export default {
  name: "Data",
  data() {
    return {
      inputVisible: false,
      dialogVisible: false,
      dialogVisible2: false,
      type: "全量",
      archivesId: null
    }
  },
  created() {
    this.onSubmit()
  },

  mounted() {
    this.drawLine();
  },


  methods: {
    drawLine() {
      let that = this
      // 基于准备好的dom，初始化echarts实例
      let myChart1 = echarts.init(document.getElementById('myChart1'));
      let myChart2 = echarts.init(document.getElementById('myChart2'));
      let myChart3 = echarts.init(document.getElementById('myChart3'));
      let myChart4 = echarts.init(document.getElementById('myChart4'));
      console.log("数据展示")

      //舌象分布饼状图
      this.$axios.get("/doctor/data/tongueColor").then(res => {
        //先声明一个空数组来存放获取到的柱状条的数据
        let seriesData3 = [];
        //空数组存放获取到的柱状条数据对应的名称
        let nameData3 = [];
        //获取到的数据为JSON对象
        let data1 = res.data.data
        //根据返回的数据，循环遍历出要展示的数据
        for (let i in data1) {
          nameData3.push(data1[i].therapy)
          seriesData3.push(data1[i].num)
        }
        // 图表内容
        let option1 = {

          title: {
            text: '舌象分布比例图',
            subtext: 'Tongue image distribution scale',
            left: 'left'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            top: 'bottom',
            data: nameData3
          },

          toolbox: {
            show: true,
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          series: [

            {
              name: 'Area Mode',
              type: 'pie',
              radius: [20, 140],
              center: ['50%', '50%'],
              roseType: 'area',
              itemStyle: {
                borderRadius: 5
              },
              data: res.data.data
            }
          ]

        }


        // 绘制图表
        myChart1.setOption(option1)

      })

      //脉象分布饼状图
      this.$axios.get("/doctor/data/pulseCondition").then(res => {

        // 图表内容
        let option2 = {
          title: {
            text: '脉象分布比例图',

            left: 'left'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '5%',
            left: 'center'
          },

          series: [
            {
              name: '脉象',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {

                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },


              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '40',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: res.data.data
            }
          ]
        }

        // 绘制图表
        myChart2.setOption(option2)
      })

      //证型TOP10柱状图
      this.$axios.get("/doctor/data/syndromeType").then(res => {

            //先声明一个空数组来存放获取到的柱状条的数据
            let seriesData = [];
            //空数组存放获取到的柱状条数据对应的名称
            let nameData = [];
            //获取到的数据为JSON对象
            let data3 = res.data.data
            //根据返回的数据，循环遍历出要展示的数据
            for (let i in data3) {
              nameData.push(data3[i].syndromeType)
              seriesData.push(data3[i].num)
            }
            let yMax = 50;
            let dataShadow = [];
            for (let i = 0; i < seriesData.length; i++) {
              dataShadow.push(yMax);

            }
            //console.log('柱状条数据对应的名称',data3[0].syndromeType)
            //console.log('柱状条数据',data3[0].num)
            // 图表内容
            let option3 = {
              title: {
                text: '患者证型TOP10统计图',//大标题
                subtext: 'Statistical chart of top 10 syndrome types of patients'//小标题
                //left:'center'//标题摆放的位置
              },
              xAxis: {
                data: nameData,//这里是和柱状条数据对应的名称
                axisLabel: {
                  inside: true,
                  color: '#fff'
                },
                axisTick: {
                  show: false
                },
                axisLine: {
                  show: false
                },
                z: 10
              },
              yAxis: {
                axisLine: {
                  show: false
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                  color: '#999'
                }
              },
              dataZoom: [
                {
                  type: 'inside'
                }
              ],
              series: [
                {
                  //name: '人数',//数据的名称，例如销量
                  type: 'bar',
                  showBackground: true,
                  itemStyle:
                      {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                          {offset: 0, color: '#5e8254'},
                          {offset: 0.5, color: '#46724f'},
                          {offset: 1, color: '#1e514a'}])
                      },
                  emphasis: {
                    itemStyle: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {offset: 0, color: '#63895a'},
                        {offset: 0.7, color: '#8eb479'},
                        {offset: 1, color: '#d4ecca'}
                      ])
                    }
                  },
                  //barWidth:'60%',
                  data: seriesData//一定要赋值给data
                }
              ],

            }
            // 绘制图表
            myChart3.setOption(option3)
            const zoomSize = 6;
            myChart3.on('click', function (params) {
              console.log(nameData[Math.max(params.dataIndex - zoomSize / 2, 0)]);
              myChart3.dispatchAction({
                type: 'dataZoom',
                startValue: nameData[Math.max(params.dataIndex - zoomSize / 2, 0)],
                endValue:
                    nameData[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
              });
            });
          }
      )

      //治法TOP10柱状图
      this.$axios.get("/doctor/data/therapy").then(res => {
        //console.log(res.data)
        //先声明一个空数组来存放获取到的柱状条的数据
        let seriesData2 = [];
        //空数组存放获取到的柱状条数据对应的名称
        let nameData2 = [];
        //获取到的数据为JSON对象
        let data4 = res.data.data
        //根据返回的数据，循环遍历出要展示的数据
        for (let i in data4) {
          nameData2.push(data4[i].therapy)
          seriesData2.push(data4[i].num)
        }
        // 图表内容
        let option4 = {
          title: {
            text: '处方治法TOP10统计图',
            subtext: 'Top 10 statistical chart of prescription treatment'//小标题
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {},
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          color: ['#edcd82'],
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: nameData2
          },
          series: [
            {
              name: '次数',
              type: 'bar',
              data: seriesData2,
            }
          ]

        }


        // 绘制图表
        myChart4.setOption(option4)


      })
    },

    onSubmit() {
      console.log("查询")
      this.$axios.get("http://47.108.215.55:5001/doctor/selfManage/list?currentPage=1&pageSize=10").then(res => {
        console.log(res)
      })
    },

    showDialog() {
      this.dialogVisible = true;
    },


    showDialogFollow() {
      this.dialogVisible2 = true;
    },

    exportVisit() {
      let that = this
      if ((this.type == '按档案号' || this.type == '') && this.archivesId == null) {
        that.$message({
          showClose: true,
          message: "按档案号导出时档案号不能为空！",
          type: 'error'
        });
      } else {
        this.$axios.get("/doctor/visit/export", {
          params: {
            type: that.type,
            archivesId: that.archivesId
          },
          responseType: "blob"
        }).then((res) => {

          let link = document.createElement("a");
          //    后端返回的是文件流 用Blob来接收二进制文件流 并制定类型和编码
          let blob = new Blob([res.data], {type: "application/vnd.ms-excel;charset=utf-8"})
          let objectUrl = window.URL.createObjectURL(blob);
          link.href = objectUrl;
          let date = new Date();
          let name = "就诊历史数据-" + date.getFullYear() + "年" + date.getMonth() + 1 + "月" + date.getDate() + "日"
              + date.getHours() + "时" + date.getMinutes() + "分" + date.getSeconds() + "秒" + ".xls";
          link.download = name;
          link.click();
          window.URL.revokeObjectURL(objectUrl);
        });
      }


    },


    exportFollow() {
      let that = this
      if ((this.type == '按档案号' || this.type == '') && this.archivesId == null) {
        that.$message({
          showClose: true,
          message: "按档案号导出时档案号不能为空！",
          type: 'error'
        });
      } else {
        this.$axios.get("/doctor/follow/export", {
              params: {
                type: that.type,
                archivesId: that.archivesId
              },
              responseType: "blob"
            }
        ).then((res) => {

          let link = document.createElement("a");
          //    后端返回的是文件流 用Blob来接收二进制文件流 并制定类型和编码
          let blob = new Blob([res.data], {type: "application/vnd.ms-excel;charset=utf-8"})
          let objectUrl = window.URL.createObjectURL(blob);
          link.href = objectUrl;
          let date = new Date();
          let name = "随访历史数据-" + date.getFullYear() + "年" + date.getMonth() + 1 + "月" + date.getDate() + "日"
              + date.getHours() + "时" + date.getMinutes() + "分" + date.getSeconds() + "秒" + ".xls";
          link.download = name;
          link.click();
          window.URL.revokeObjectURL(objectUrl);
        });
      }


    },
  },
}

</script>

<style scoped>

.echartsDiv {
  width: 100%;
  height: 400px;
  display: flex;
  margin-top: 20px;
  flex-direction: row;
  justify-content: center;

}

/*数据展示框*/
.chartDiv {
  width: 550px;
  border: #cccccc solid 1px;
  border-radius: 15px;
  height: 400px;
  /*border: 1px solid #164d43;*/
  display: flex;
  margin-left: 20px;
margin-right: 20px;
  flex-direction: column;
  justify-content: center;

}


</style>