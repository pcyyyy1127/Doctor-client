<template>
    <div>

        <el-form :inline="true" class="demo-form-inline" label-width="200px" >


            <el-form-item >
                <span>筛选条件</span>
            </el-form-item>


            <el-form-item >
                <el-input  placeholder="姓名/档案号" v-model="type" clearable></el-input>
            </el-form-item>

            <el-form-item>
                <el-select v-model="searchStatus" placeholder="请选择" @change="searchChange">
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
                    prop="finishSequence"
                    width="100"
                    label="已完成随访次数">
            </el-table-column>

            <el-table-column
                    prop="nextDate"
                    width="200"
                    label="下次随访时间">
            </el-table-column>

            <el-table-column
                    prop="nowStatus"
                    width="200"
                    label="当前状态">
            </el-table-column>


            <el-table-column
                    prop="option"
                    label="操作"
                    width="200">
                <template slot-scope="scope">
                    <el-button size="mini" round  @click="choose(scope.row)">随访</el-button>
                    <el-button size="mini" round  @click="getFollowHistory(scope.row)" >历史随访</el-button>
                </template>
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


        <!--随访信息采集对话框-->
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


        <!--历史随访-->
        <el-dialog
                :visible.sync="dialogVisible3"
                width="90%"
        >

            <div v-for="(item, index) in followHistory" :key="index" @click="getFollowRow(item)">
                <el-collapse  accordion>
                    <el-collapse-item >
                        <template slot="title">
                            <h2>第{{item.sequence}}次随访</h2><i class="header-icon el-icon-info"></i>
                            <h3 v-if="item.status == 1" style="margin-left: 5%"> 采集进行中</h3>
                            <h3 v-if="item.status == 2" style="margin-left: 5%"> 采集已完成</h3>
                            <h3 style="margin-left: 5%"> 最后采集时间：{{item.finishTime}}</h3>
                            <h3 style="margin-left: 5%"> 患者提交图像时间：{{item.patientSubmitTime}}</h3>
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
                                            患者暂未上传图像
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

                                    <div v-if="item.different.main != '0' " class="differentText">*上诊次差异结果：{{item.different.main}}</div>
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
                                    <div v-if="item.different.present != '0' " class="differentText">*上诊次差异结果：{{item.different.present}}</div>
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
                                    <div v-if="item.different.visible != '0' " class="differentText">*上诊次差异结果：{{item.different.visible}}</div>
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
                                    <div v-if="item.different.cough != '0' " class="differentText">*上诊次差异结果：{{item.different.cough}}</div>

                                    <el-form-item label="" prop="cough" >
                                        <el-radio-group v-model="item.survey.cough">
                                            <el-radio label="无"></el-radio>
                                            <el-radio label="有"></el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-descriptions-item>

                                <el-descriptions-item label="性质">
                                    <div v-if="item.different.nature != '0' " class="differentText">*上诊次差异结果：{{item.different.nature}}</div>

                                    <el-form-item prop="nature">
                                        <el-radio-group v-model="item.survey.nature">
                                            <el-radio label="干咳"></el-radio>
                                            <el-radio label="湿咳（每天痰量>10ml）"></el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-descriptions-item>

                                <el-descriptions-item label="程度">
                                    <div v-if="item.different.degree != '0' " class="differentText">*上诊次差异结果：{{item.different.degree}}</div>

                                    <el-form-item  prop="degree">
                                        <el-radio-group v-model="item.survey.degree">
                                            <el-radio label="偶有短暂咳嗽"></el-radio>
                                            <el-radio label="频繁咳嗽，轻度影响日常生活"></el-radio>
                                            <el-radio label="频繁咳嗽，严重影响日常生活"></el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-descriptions-item>

                                <el-descriptions-item label="加重因素">
                                    <div v-if="item.different.increaseFactors != '0' " class="differentText">*上诊次差异结果：{{item.different.increaseFactors}}</div>
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
                                    <div v-if="item.different.decreaseFactors != '0' " class="differentText">*上诊次差异结果：{{item.different.decreaseFactors}}</div>
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
                                    <div v-if="item.different.expectoration != '0' " class="differentText">*上诊次差异结果：{{item.different.expectoration}}</div>

                                    <el-form-item prop="expectoration">
                                        <el-radio-group v-model="item.survey.expectoration">
                                            <el-radio label="无"></el-radio>
                                            <el-radio label="有"></el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-descriptions-item>

                                <el-descriptions-item label="痰量">
                                    <div v-if="item.different.volume != '0' " class="differentText">*上诊次差异结果：{{item.different.volume}}</div>

                                    <el-form-item prop="volume">
                                        <el-radio-group v-model="item.survey.volume">
                                            <el-radio label="少量（昼夜咯痰10-50ml）"></el-radio>
                                            <el-radio label="中等量（昼夜咯痰51-100ml）"></el-radio>
                                            <el-radio label="大量（昼夜咯痰>100ml）"></el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-descriptions-item>



                                <el-descriptions-item label="痰色">
                                    <div v-if="item.different.phlegmColor != '0' " class="differentText">*上诊次差异结果：{{item.different.phlegmColor}}</div>

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
                                    <div v-if="item.different.phlegmQuality != '0' " class="differentText">*上诊次差异结果：{{item.different.phlegmQuality}}</div>

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
                                    <div v-if="item.different.phlegmTaste != '0' " class="differentText">*上诊次差异结果：{{item.different.phlegmTaste}}</div>

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
                                    <div v-if="item.different.dyspnea != '0' " class="differentText">*上诊次差异结果：{{item.different.dyspnea}}</div>

                                    <el-form-item prop="dyspnea">
                                        <el-radio-group v-model="item.survey.dyspnea">
                                            <el-radio label="无"></el-radio>
                                            <el-radio label="有"></el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-descriptions-item>

                                <el-descriptions-item label="呼吸困难加重因素">
                                    <div v-if="item.different.dyspneaIncrease != '0' " class="differentText">*上诊次差异结果：{{item.different.dyspneaIncrease}}</div>
                                    <el-form-item prop="dyspneaIncrease">
                                        <el-checkbox-group v-model="item.survey.dyspneaIncrease">
                                            <el-checkbox label="活动"></el-checkbox>
                                            <el-checkbox label="平卧"></el-checkbox>
                                            <el-checkbox label="情绪波动"></el-checkbox>
                                            <el-checkbox label="呼吸道感染"></el-checkbox>
                                            <el-checkbox label="其他"></el-checkbox>
                                            <el-form-item prop="dyspneaIncreaseOther">
                                                <div v-if="item.different.dyspneaIncreaseOther != '0' " class="differentText">*上诊次差异结果：{{item.different.dyspneaIncreaseOther}}</div>

                                                <el-input v-model="item.survey.dyspneaIncreaseOther"  size="mini" placeholder="请在此补充其他呼吸困难加重因素" style="width: 200px" ></el-input>
                                            </el-form-item>
                                        </el-checkbox-group>
                                    </el-form-item>
                                </el-descriptions-item>

                                <el-descriptions-item label="呼吸困难缓解因素">
                                    <div v-if="item.different.dyspneaDecrease != '0' " class="differentText">*上诊次差异结果：{{item.different.dyspneaDecrease}}</div>

                                    <el-form-item prop="dyspneaDecrease">
                                        <el-checkbox-group v-model="item.survey.dyspneaDecrease">
                                            <el-checkbox label="休息"></el-checkbox>
                                            <el-checkbox label="吸氧"></el-checkbox>
                                            <el-checkbox label="其他"></el-checkbox>
                                            <el-form-item prop="dyspneaDecreaseOther">
                                                <div v-if="item.different.dyspneaDecreaseOther != '0' " class="differentText">*上诊次差异结果：{{item.different.dyspneaDecreaseOther}}</div>

                                                <el-input v-model="item.survey.dyspneaDecreaseOther"  size="mini" placeholder="请在此补充其他呼吸困难缓解因素" style="width: 200px" ></el-input>

                                            </el-form-item>
                                        </el-checkbox-group>
                                    </el-form-item>
                                </el-descriptions-item>



                                <el-descriptions-item label="呼吸困难程度">
                                    <div v-if="item.different.dyspneaDegree != '0' " class="differentText">*上诊次差异结果：{{item.different.dyspneaDegree}}</div>

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
                                    <div v-if="item.different.accompanyingSymptoms != '0' " class="differentText">*上诊次差异结果：{{item.different.accompanyingSymptoms}}</div>

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
                                                <div v-if="item.different.accompanyingSymptomsOther != '0' " class="differentText">*上诊次差异结果：{{item.different.accompanyingSymptomsOther}}</div>

                                                <el-input v-model="item.survey.accompanyingSymptomsOther"  size="mini" placeholder="请在此补充其他伴随症状" style="width: 200px" ></el-input>

                                            </el-form-item>
                                        </el-checkbox-group>
                                    </el-form-item>
                                </el-descriptions-item>




                            </el-descriptions>






                            <el-descriptions style="margin-top:0%" title="中医证候信息表" direction="vertical" :column="1" border >

                                <el-descriptions-item label="肺系">
                                    <el-form-item prop="pulmonarySystem">
                                        <div v-if="item.different.pulmonarySystem != '0' " class="differentText">*上诊次差异结果：{{item.different.pulmonarySystem}}</div>

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
                                                <div v-if="item.different.pulmonarySystemOther != '0' " class="differentText">*上诊次差异结果：{{item.different.pulmonarySystemOther}}</div>

                                                <el-input v-model="item.survey.pulmonarySystemOther"  size="mini" placeholder="请在此补充其他肺系情况" style="width: 200px" ></el-input>
                                            </el-form-item>
                                        </el-checkbox-group>
                                    </el-form-item>
                                </el-descriptions-item>



                                <el-descriptions-item label="寒热">
                                    <el-form-item prop="coldAndHeat">
                                        <div v-if="item.different.coldAndHeat != '0' " class="differentText">*上诊次差异结果：{{item.different.coldAndHeat}}</div>

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
                                        <div v-if="item.different.perspiration != '0' " class="differentText">*上诊次差异结果：{{item.different.perspiration}}</div>

                                        <el-checkbox-group v-model="item.survey.perspiration">
                                            <el-checkbox label="正常"></el-checkbox>
                                            <el-checkbox label="无汗"></el-checkbox>
                                            <el-checkbox label="自汗"></el-checkbox>
                                            <el-checkbox label="盗汗"></el-checkbox>
                                            <el-checkbox label="头汗"></el-checkbox>
                                            <el-checkbox label="手足心汗"></el-checkbox>
                                            <el-checkbox label="其他"></el-checkbox>
                                            <el-form-item prop="perspirationOther">
                                                <div v-if="item.different.perspirationOther != '0' " class="differentText">*上诊次差异结果：{{item.different.perspirationOther}}</div>

                                                <el-input v-model="item.survey.perspirationOther"  size="mini" placeholder="请在此补充其他汗出情况" style="width: 200px" ></el-input>
                                            </el-form-item>

                                        </el-checkbox-group>
                                    </el-form-item>
                                </el-descriptions-item>



                                <el-descriptions-item label="精神">
                                    <el-form-item prop="spirit">
                                        <div v-if="item.different.spirit != '0' " class="differentText">*上诊次差异结果：{{item.different.spirit}}</div>

                                        <el-checkbox-group v-model="item.survey.spirit">
                                            <el-checkbox label="正常"></el-checkbox>
                                            <el-checkbox label="乏力"></el-checkbox>
                                            <el-checkbox label="神疲"></el-checkbox>
                                            <el-checkbox label="嗜睡"></el-checkbox>
                                            <el-checkbox label="烦躁"></el-checkbox>
                                            <el-checkbox label="神昏"></el-checkbox>
                                            <el-checkbox label="其他"></el-checkbox>
                                            <el-form-item prop="spiritOther">
                                                <div v-if="item.different.spiritOther != '0' " class="differentText">*上诊次差异结果：{{item.different.spiritOther}}</div>

                                                <el-input v-model="item.survey.spiritOther"  size="mini" placeholder="请在此补充其他精神情况" style="width: 200px" ></el-input>
                                            </el-form-item>

                                        </el-checkbox-group>
                                    </el-form-item>
                                </el-descriptions-item>



                                <el-descriptions-item label="情志">
                                    <el-form-item prop="emotion">
                                        <div v-if="item.different.emotion != '0' " class="differentText">*上诊次差异结果：{{item.different.emotion}}</div>

                                        <el-checkbox-group v-model="item.survey.emotion">
                                            <el-checkbox label="正常"></el-checkbox>
                                            <el-checkbox label="烦躁易怒"></el-checkbox>
                                            <el-checkbox label="抑郁"></el-checkbox>
                                            <el-checkbox label="健忘"></el-checkbox>
                                            <el-checkbox label="易惊"></el-checkbox>
                                            <el-checkbox label="其他"></el-checkbox>
                                            <el-form-item prop="emotionOther">
                                                <div v-if="item.different.emotionOther != '0' " class="differentText">*上诊次差异结果：{{item.different.emotionOther}}</div>

                                                <el-input v-model="item.survey.emotionOther"  size="mini" placeholder="请在此补充其他情志情况" style="width: 200px" ></el-input>

                                            </el-form-item>

                                        </el-checkbox-group>
                                    </el-form-item>
                                </el-descriptions-item>


                                <el-descriptions-item label="面色">
                                    <el-form-item prop="complexion">
                                        <div v-if="item.different.complexion != '0' " class="differentText">*上诊次差异结果：{{item.different.complexion}}</div>

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
                                                <div v-if="item.different.complexionOther != '0' " class="differentText">*上诊次差异结果：{{item.different.complexionOther}}</div>

                                                <el-input v-model="item.survey.complexionOther"  size="mini" placeholder="请在此补充其他面色情况" style="width: 200px" ></el-input>

                                            </el-form-item>

                                        </el-checkbox-group>
                                    </el-form-item>
                                </el-descriptions-item>



                                <el-descriptions-item label="饮食">
                                    <el-form-item >
                                        <div>食：</div>
                                        <el-form-item prop="food">
                                            <div v-if="item.different.food != '0' " class="differentText">*上诊次差异结果：{{item.different.food}}</div>

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
                                                    <div v-if="item.different.foodOther != '0' " class="differentText">*上诊次差异结果：{{item.different.foodOther}}</div>

                                                    <el-input v-model="item.survey.foodOther"  size="mini" placeholder="请在此补充其他" style="width: 200px" ></el-input>

                                                </el-form-item>

                                            </el-checkbox-group>
                                        </el-form-item >

                                        <div>饮：</div>
                                        <el-form-item prop="drink">
                                            <div v-if="item.different.drink != '0' " class="differentText">*上诊次差异结果：{{item.different.drink}}</div>

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
                                                    <div v-if="item.different.drinkOther != '0' " class="differentText">*上诊次差异结果：{{item.different.drinkOther}}</div>

                                                    <el-input v-model="item.survey.drinkOther"  size="mini" placeholder="请在此补充其他" style="width: 200px" ></el-input>
                                                </el-form-item >
                                            </el-checkbox-group>
                                        </el-form-item >
                                        <div>味：</div>
                                        <el-form-item prop="taste">
                                            <div v-if="item.different.taste != '0' " class="differentText">*上诊次差异结果：{{item.different.taste}}</div>

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
                                                    <div v-if="item.different.tasteOther != '0' " class="differentText">*上诊次差异结果：{{item.different.tasteOther}}</div>

                                                    <el-input v-model="item.survey.tasteOther"  size="mini" placeholder="请在此补充其他" style="width: 200px" ></el-input>
                                                </el-form-item >
                                            </el-checkbox-group>
                                        </el-form-item >
                                    </el-form-item>
                                </el-descriptions-item>



                                <el-descriptions-item label="二便">
                                    <el-form-item prop="urine">
                                        <div>小便：</div>
                                        <div v-if="item.different.urine != '0' " class="differentText">*上诊次差异结果：{{item.different.urine}}</div>

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
                                                <div v-if="item.different.urineOther != '0' " class="differentText">*上诊次差异结果：{{item.different.urineOther}}</div>

                                                <el-input v-model="item.survey.urineOther"  size="mini" placeholder="请在此补充其他小便情况" style="width: 200px" ></el-input>

                                            </el-form-item>

                                        </el-checkbox-group>
                                    </el-form-item>
                                    <el-form-item prop="defecate">

                                        <div>大便：</div>
                                        <div v-if="item.different.defecate != '0' " class="differentText">*上诊次差异结果：{{item.different.defecate}}</div>

                                        <el-checkbox-group v-model="item.survey.defecate">

                                            <el-checkbox label="正常"></el-checkbox>
                                            <el-checkbox label="干结"></el-checkbox>
                                            <el-checkbox label="稀溏"></el-checkbox>
                                            <el-checkbox label="排便无力"></el-checkbox>
                                            <el-checkbox label="黏滞不爽"></el-checkbox>
                                            <el-checkbox label="完谷不化"></el-checkbox><br>
                                            <el-checkbox label="其他"></el-checkbox>
                                            <el-form-item prop="defecateOther">
                                                <div v-if="item.different.defecateOther != '0' " class="differentText">*上诊次差异结果：{{item.different.defecateOther}}</div>

                                                <el-input v-model="item.survey.defecateOther"  size="mini" placeholder="请在此补充其他大便情况" style="width: 200px" ></el-input>

                                            </el-form-item>

                                        </el-checkbox-group>

                                    </el-form-item>


                                </el-descriptions-item>


                                <el-descriptions-item label="睡眠">
                                    <el-form-item prop="sleep">
                                        <div v-if="item.different.sleep != '0' " class="differentText">*上诊次差异结果：{{item.different.sleep}}</div>

                                        <el-checkbox-group v-model="item.survey.sleep">
                                            <el-checkbox label="正常"></el-checkbox>
                                            <el-checkbox label="迟难入睡"></el-checkbox>
                                            <el-checkbox label="多梦"></el-checkbox>
                                            <el-checkbox label="易醒"></el-checkbox>
                                            <el-checkbox label="其他"></el-checkbox>
                                            <el-form-item prop="sleepOther">
                                                <div v-if="item.different.sleepOther != '0' " class="differentText">*上诊次差异结果：{{item.different.sleepOther}}</div>

                                                <el-input v-model="item.survey.sleepOther"  size="mini" placeholder="请在此补充其他睡眠情况" style="width: 200px" ></el-input>

                                            </el-form-item>

                                        </el-checkbox-group>

                                    </el-form-item>
                                </el-descriptions-item>


                                <el-descriptions-item label="周身四肢">
                                    <el-form-item prop="bodyAndLimbs">
                                        <div v-if="item.different.bodyAndLimbs != '0' " class="differentText">*上诊次差异结果：{{item.different.bodyAndLimbs}}</div>

                                        <el-checkbox-group v-model="item.survey.bodyAndLimbs">
                                            <el-checkbox label="正常"></el-checkbox>
                                            <el-checkbox label="腰膝酸软"></el-checkbox>
                                            <el-checkbox label="肢冷"></el-checkbox>
                                            <el-checkbox label="耳鸣"></el-checkbox>
                                            <el-checkbox label="目干"></el-checkbox>
                                            <el-checkbox label="面目或肢体浮肿"></el-checkbox>
                                            <el-checkbox label="其他"></el-checkbox>
                                            <el-form-item prop="bodyAndLimbsOthers">
                                                <div v-if="item.different.bodyAndLimbsOthers != '0' " class="differentText">*上诊次差异结果：{{item.different.bodyAndLimbsOthers}}</div>

                                                <el-input v-model="item.survey.bodyAndLimbsOthers"  size="mini" placeholder="请在此补充其他周身四肢情况" style="width: 200px" ></el-input>

                                            </el-form-item>

                                        </el-checkbox-group>

                                    </el-form-item>
                                </el-descriptions-item>


                                <el-descriptions-item label="舌象">
                                    <el-form-item prop="tongueColor">
                                        <div>舌色 <div v-if="item.different.tongueColor != '0' " class="differentText">*上诊次差异结果：{{item.different.tongueColor}}</div></div>

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
                                        <div>舌形<div v-if="item.different.tongueShape != '0' " class="differentText">*上诊次差异结果：{{item.different.tongueShape}}</div></div>
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
                                        <div>舌态<div v-if="item.different.tongueState != '0' " class="differentText">*上诊次差异结果：{{item.different.tongueState}}</div></div>
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
                                        <div>苔质<div v-if="item.different.coatingNature != '0' " class="differentText">*上诊次差异结果：{{item.different.coatingNature}}</div></div>
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
                                        <div>苔色 <div v-if="item.different.coatingColour != '0' " class="differentText">*上诊次差异结果：{{item.different.coatingColour}}</div> </div>
                                        <el-checkbox-group v-model="item.survey.coatingColour">
                                            <el-checkbox label="白"></el-checkbox>
                                            <el-checkbox label="黄"></el-checkbox>
                                            <el-checkbox label="灰"></el-checkbox>
                                            <el-checkbox label="黑"></el-checkbox>
                                        </el-checkbox-group>

                                    </el-form-item>

                                    <el-form-item prop="tongueUnder">
                                        <div>舌下络脉</div>
                                        <div v-if="item.different.tongueUnder != '0' " class="differentText">*上诊次差异结果：{{item.different.tongueUnder}}</div>
                                        <el-checkbox-group v-model="item.survey.tongueUnder">
                                            <el-checkbox label="正常"></el-checkbox>
                                            <el-checkbox label="粗胀"></el-checkbox>
                                            <el-checkbox label="青紫"></el-checkbox>
                                            <el-checkbox label="其他"></el-checkbox>
                                            <el-form-item prop="tongueUnderOther">
                                                <div v-if="item.different.tongueUnderOther != '0' " class="differentText">*上诊次差异结果：{{item.different.tongueUnderOther}}</div>

                                                <el-input v-model="item.survey.tongueUnderOther"  size="mini" placeholder="请在此补充其他舌下络脉情况" style="width: 200px" ></el-input>
                                            </el-form-item>
                                        </el-checkbox-group>

                                    </el-form-item>

                                </el-descriptions-item>


                                <el-descriptions-item label="脉象">
                                    <el-form-item prop="pulseCondition">
                                        <div v-if="item.different.pulseCondition != '0' " class="differentText">*上诊次差异结果：{{item.different.pulseCondition}}</div>

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
                                        <div v-if="item.different.disease != '0' " class="differentText">*上诊次差异结果：{{item.different.disease}}</div>

                                        <el-input
                                                type="textarea"
                                                :autosize="{ minRows: 2, maxRows: 4}"
                                                placeholder="请输入中医诊断疾病内容"
                                                v-model="item.survey.disease">
                                        </el-input>

                                    </el-form-item>

                                    <el-form-item prop="syndromeType">
                                        <div>证型：</div>
                                        <div v-if="item.different.syndromeType != '0' " class="differentText">*上诊次差异结果：{{item.different.syndromeType}}</div>

                                        <el-input
                                                type="textarea"
                                                :autosize="{ minRows: 2, maxRows: 4}"
                                                placeholder="请输入中医诊断证型内容"
                                                v-model="item.survey.syndromeType">
                                        </el-input>

                                    </el-form-item>
                                </el-descriptions-item>



                            </el-descriptions>

                            <el-descriptions style="margin-top:0%" title="处方信息" direction="vertical" :column="1" border >
                                <el-descriptions-item label="治法">
                                    <div v-if="item.different.therapy != '0' " class="differentText">*上诊次差异结果：{{item.different.therapy}}</div>

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
                                    <div v-if="item.different.prescriptionName != '0' " class="differentText">*上诊次差异结果：{{item.different.prescriptionName}}</div>

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
                                    <div v-if="item.different.prescription != '0' " class="differentText">*上诊次差异结果：{{item.different.prescription}}</div>

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
                                            <div v-if="item.different.medicineNum != '0' " class="differentText">*上诊次差异结果：{{item.different.medicineNum}}剂</div>

                                            <el-input-number v-model="item.survey.medicineNum"  :min="1" :max="999" ></el-input-number>  剂

                                        </div>


                                    </el-form-item>
                                    <el-form-item prop="decoctingMethod">
                                        <div>煎服法：</div>
                                        <div v-if="item.different.decoctingMethod != '0' " class="differentText">*上诊次差异结果：{{item.different.decoctingMethod}}</div>

                                        <el-input
                                                type="textarea"
                                                :autosize="{ minRows: 2, maxRows: 4}"
                                                placeholder="请输入煎服法"
                                                v-model="item.survey.decoctingMethod">
                                        </el-input>
                                    </el-form-item>

                                </el-descriptions-item>

                                <el-descriptions-item label="中成药处方">
                                    <div v-if="item.different.chinesePatentMedicine != '0' " class="differentText">*上诊次差异结果：{{item.different.chinesePatentMedicine}}</div>

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
                                    <div v-if="item.different.acupunctureAndMassage != '0' " class="differentText">*上诊次差异结果：{{item.different.acupunctureAndMassage}}</div>

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
                                    <div v-if="item.different.westernMedicinePrescription != '0' " class="differentText">*上诊次差异结果：{{item.different.westernMedicinePrescription}}</div>

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
                                        <div v-if="item.different.adviceForFood != '0' " class="differentText">*上诊次差异结果：{{item.different.adviceForFood}}</div>

                                        <el-input
                                                type="textarea"
                                                :autosize="{ minRows: 5, maxRows: 10}"
                                                placeholder="请输入饮食相关医嘱"
                                                v-model="item.survey.adviceForFood">
                                        </el-input>
                                    </el-form-item>

                                    <el-form-item prop="adviceForDailyLife">
                                        <div>起居：</div>
                                        <div v-if="item.different.adviceForDailyLife != '0' " class="differentText">*上诊次差异结果：{{item.different.adviceForDailyLife}}</div>

                                        <el-input
                                                type="textarea"
                                                :autosize="{ minRows: 5, maxRows: 10}"
                                                placeholder="请输入起居相关医嘱"
                                                v-model="item.survey.adviceForDailyLife">
                                        </el-input>
                                    </el-form-item>

                                    <el-form-item prop="adviceForEmotion">
                                        <div>情志：</div>
                                        <div v-if="item.different.adviceForEmotion != '0' " class="differentText">*上诊次差异结果：{{item.different.adviceForEmotion}}</div>

                                        <el-input
                                                type="textarea"
                                                :autosize="{ minRows: 5, maxRows: 10}"
                                                placeholder="请输入情志相关医嘱"
                                                v-model="item.survey.adviceForEmotion">
                                        </el-input>
                                    </el-form-item>

                                    <el-form-item prop="adviceForOther">
                                        <div>其他：</div>
                                        <div v-if="item.different.adviceForOther != '0' " class="differentText">*上诊次差异结果：{{item.different.adviceForOther}}</div>

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
                                        <div v-if="item.different.hrctDate != '0' " class="differentText">*上诊次差异结果：{{item.different.hrctDate}}</div>


                                        <div>检查日期：<el-date-picker type="date" placeholder="选择日期" v-model="item.survey.hrctDate" style="width: 50%;"></el-date-picker></div>
                                    </el-form-item>
                                    <el-form-item  prop="hrctStore">
                                        <div>是否已留存：
                                            <div v-if="item.different.hrctStore != '0' " class="differentText">*上诊次差异结果：{{item.different.hrctStore}}</div>

                                            <el-radio-group v-model="item.survey.hrctStore">
                                                <el-radio label="是"></el-radio>
                                                <el-radio label="否"></el-radio>

                                            </el-radio-group>

                                        </div>
                                    </el-form-item>


                                    <div>肺功能： </div>
                                    <el-form-item  prop="lungFunctionDate">
                                        <div v-if="item.different.lungFunctionDate != '0' " class="differentText">*上诊次差异结果：{{item.different.lungFunctionDate}}</div>

                                        <div>检查日期：<el-date-picker type="date" placeholder="选择日期" v-model="item.survey.lungFunctionDate" style="width: 50%;"></el-date-picker></div>
                                    </el-form-item>
                                    <el-form-item  prop="lungFunctionStore">
                                        <div>是否已留存：
                                            <div v-if="item.different.lungFunctionStore != '0' " class="differentText">*上诊次差异结果：{{item.different.lungFunctionStore}}</div>

                                            <el-radio-group v-model="item.survey.lungFunctionStore">
                                                <el-radio label="是"></el-radio>
                                                <el-radio label="否"></el-radio>

                                            </el-radio-group>

                                        </div>
                                    </el-form-item>


                                    <div>动脉血气分析： </div>
                                    <el-form-item  prop="bloodGasAnalysisDate">
                                        <div v-if="item.different.bloodGasAnalysisDate != '0' " class="differentText">*上诊次差异结果：{{item.different.bloodGasAnalysisDate}}</div>

                                        <div>检查日期：<el-date-picker type="date" placeholder="选择日期" v-model="item.survey.bloodGasAnalysisDate" style="width: 50%;"></el-date-picker></div>
                                    </el-form-item>
                                    <el-form-item  prop="bloodGasAnalysisStore">
                                        <div>是否已留存：
                                            <div v-if="item.different.bloodGasAnalysisStore != '0' " class="differentText">*上诊次差异结果：{{item.different.bloodGasAnalysisStore}}</div>

                                            <el-radio-group v-model="item.survey.bloodGasAnalysisStore">
                                                <el-radio label="是"></el-radio>
                                                <el-radio label="否"></el-radio>

                                            </el-radio-group>

                                        </div>
                                    </el-form-item>



                                    <div>6分钟步行试验： </div>
                                    <el-form-item  prop="walkTestDate">
                                        <div v-if="item.different.walkTestDate != '0' " class="differentText">*上诊次差异结果：{{item.different.walkTestDate}}</div>

                                        <div>检查日期：<el-date-picker type="date" placeholder="选择日期" v-model="item.survey.walkTestDate" style="width: 50%;"></el-date-picker></div>
                                    </el-form-item>
                                    <el-form-item  prop="walkTestStore">
                                        <div>是否已留存：
                                            <div v-if="item.different.walkTestStore != '0' " class="differentText">*上诊次差异结果：{{item.different.walkTestStore}}</div>

                                            <el-radio-group v-model="item.survey.walkTestStore">
                                                <el-radio label="是"></el-radio>
                                                <el-radio label="否"></el-radio>

                                            </el-radio-group>

                                        </div>
                                    </el-form-item>



                                    <div>胸部X线： </div>
                                    <el-form-item  prop="rayDate">
                                        <div v-if="item.different.rayDate != '0' " class="differentText">*上诊次差异结果：{{item.different.rayDate}}</div>

                                        <div>检查日期：<el-date-picker type="date" placeholder="选择日期" v-model="item.survey.rayDate" style="width: 50%;"></el-date-picker></div>
                                    </el-form-item>
                                    <el-form-item  prop="rayStore">
                                        <div>是否已留存：
                                            <div v-if="item.different.rayStore != '0' " class="differentText">*上诊次差异结果：{{item.different.rayStore}}</div>

                                            <el-radio-group v-model="item.survey.rayStore">
                                                <el-radio label="是"></el-radio>
                                                <el-radio label="否"></el-radio>

                                            </el-radio-group>

                                        </div>
                                    </el-form-item>


                                    <div>心脏彩超： </div>
                                    <el-form-item  prop="colourSonographyDate">
                                        <div v-if="item.different.colourSonographyDate != '0' " class="differentText">*上诊次差异结果：{{item.different.colourSonographyDate}}</div>

                                        <div>检查日期：<el-date-picker type="date" placeholder="选择日期" v-model="item.survey.colourSonographyDate" style="width: 50%;"></el-date-picker></div>
                                    </el-form-item>
                                    <el-form-item  prop="colourSonographyStore">
                                        <div>是否已留存：
                                            <div v-if="item.different.colourSonographyStore != '0' " class="differentText">*上诊次差异结果：{{item.different.colourSonographyStore}}</div>

                                            <el-radio-group v-model="item.survey.colourSonographyStore">
                                                <el-radio label="是"></el-radio>
                                                <el-radio label="否"></el-radio>

                                            </el-radio-group>

                                        </div>
                                    </el-form-item>



                                    <div>血常规： </div>
                                    <el-form-item  prop="routineBloodTestDate">
                                        <div v-if="item.different.routineBloodTestDate != '0' " class="differentText">*上诊次差异结果：{{item.different.routineBloodTestDate}}</div>


                                        <div>检查日期：<el-date-picker type="date" placeholder="选择日期" v-model="item.survey.routineBloodTestDate" style="width: 50%;"></el-date-picker></div>
                                    </el-form-item>
                                    <el-form-item  prop="routineBloodTestStore">
                                        <div>是否已留存：
                                            <div v-if="item.different.routineBloodTestStore != '0' " class="differentText">*上诊次差异结果：{{item.different.routineBloodTestStore}}</div>

                                            <el-radio-group v-model="item.survey.routineBloodTestStore">
                                                <el-radio label="是"></el-radio>
                                                <el-radio label="否"></el-radio>

                                            </el-radio-group>

                                        </div>
                                    </el-form-item>




                                    <div>血生化检查： </div>
                                    <el-form-item  prop="bloodExaminationDate">
                                        <div v-if="item.different.bloodExaminationDate != '0' " class="differentText">*上诊次差异结果：{{item.different.bloodExaminationDate}}</div>

                                        <div>检查日期：<el-date-picker type="date" placeholder="选择日期" v-model="item.survey.bloodExaminationDate" style="width: 50%;"></el-date-picker></div>
                                    </el-form-item>
                                    <el-form-item  prop="bloodExaminationStore">
                                        <div>是否已留存：
                                            <div v-if="item.different.bloodExaminationStore != '0' " class="differentText">*上诊次差异结果：{{item.different.bloodExaminationStore}}</div>

                                            <el-radio-group v-model="item.survey.bloodExaminationStore">
                                                <el-radio label="是"></el-radio>
                                                <el-radio label="否"></el-radio>

                                            </el-radio-group>

                                        </div>
                                    </el-form-item>


                                    <div>凝血功能和D二聚体： </div>
                                    <el-form-item  prop="coagulationFunctionDate">
                                        <div v-if="item.different.coagulationFunctionDate != '0' " class="differentText">*上诊次差异结果：{{item.different.coagulationFunctionDate}}</div>

                                        <div>检查日期：<el-date-picker type="date" placeholder="选择日期" v-model="item.survey.coagulationFunctionDate" style="width: 50%;"></el-date-picker></div>
                                    </el-form-item>
                                    <el-form-item  prop="coagulationFunctionStore">
                                        <div>是否已留存：
                                            <div v-if="item.different.coagulationFunctionStore != '0' " class="differentText">*上诊次差异结果：{{item.different.coagulationFunctionStore}}</div>

                                            <el-radio-group v-model="item.survey.coagulationFunctionStore">
                                                <el-radio label="是"></el-radio>
                                                <el-radio label="否"></el-radio>

                                            </el-radio-group>

                                        </div>
                                    </el-form-item>



                                </el-descriptions-item>


                                <el-descriptions-item label="院外合并治疗情况(西药)">
                                    <div v-if="item.different.westernMedicineHas != '0' " class="differentText">*上诊次差异结果：{{item.different.westernMedicineHas}}</div>


                                    <el-form-item prop="westernMedicineHas">

                                        <div>西药：
                                            <el-radio-group v-model="item.survey.westernMedicineHas">
                                                <el-radio label="有"></el-radio>
                                                <el-radio label="无"></el-radio>
                                            </el-radio-group>
                                        </div>

                                    </el-form-item>

                                    <el-form-item prop="westernMedicineMain">
                                        <div v-if="item.different.westernMedicineMain != '0' " class="differentText">*上诊次差异结果：{{item.different.westernMedicineMain}}</div>

                                        <div>如有，记录主要药物名称：
                                            <el-checkbox-group v-model="item.survey.westernMedicineMain">
                                                <el-checkbox label="吡非尼酮/尼达尼布"></el-checkbox>
                                                <el-checkbox label="N-乙酰半胱氨酸"></el-checkbox>
                                            </el-checkbox-group>
                                        </div>
                                    </el-form-item>

                                    <el-form-item prop="westernMedicineMainOther">
                                        <div v-if="item.different.westernMedicineMainOther != '0' " class="differentText">*上诊次差异结果：{{item.different.westernMedicineMainOther}}</div>

                                        其他：
                                        <el-input v-model="item.survey.westernMedicineMainOther"  size="mini" placeholder="请在此补充其他西药" style="width: 200px" ></el-input>
                                    </el-form-item>


                                </el-descriptions-item>


                                <el-descriptions-item label="院外合并治疗情况(中成药)">


                                    <el-form-item prop="chinesePatentMedicineHas">

                                        <div v-if="item.different.chinesePatentMedicineHas != '0' " class="differentText">*上诊次差异结果：{{item.different.chinesePatentMedicineHas}}</div>

                                        <div>中成药：
                                            <el-radio-group v-model="item.survey.chinesePatentMedicineHas">
                                                <el-radio label="有"></el-radio>
                                                <el-radio label="无"></el-radio>
                                            </el-radio-group>
                                        </div>

                                    </el-form-item>


                                    <el-form-item prop="chinesePatentMedicineMain">
                                        <div v-if="item.different.chinesePatentMedicineMain != '0' " class="differentText">*上诊次差异结果：{{item.different.chinesePatentMedicineMain}}</div>

                                        如有，记录主要中成药名称：
                                        <el-input v-model="item.survey.chinesePatentMedicineMain"  size="mini" placeholder="请在此补充主要中成药名称" style="width: 500px" ></el-input>
                                    </el-form-item>


                                </el-descriptions-item>


                                <el-descriptions-item label="院外合并治疗情况(其他疗法)">


                                    <el-form-item prop="therapyHas">

                                        <div v-if="item.different.therapyHas != '0' " class="differentText">*上诊次差异结果：{{item.different.therapyHas}}</div>

                                        <div>其他疗法：
                                            <el-radio-group v-model="item.survey.therapyHas">
                                                <el-radio label="有"></el-radio>
                                                <el-radio label="无"></el-radio>
                                            </el-radio-group>
                                        </div>

                                    </el-form-item>

                                    <el-form-item prop="therapyMain">
                                        <div v-if="item.different.therapyMain != '0' " class="differentText">*上诊次差异结果：{{item.different.therapyMain}}</div>


                                        <div>如有，记录具体疗法：
                                            <el-checkbox-group v-model="item.survey.therapyMain">
                                                <el-checkbox label="氧疗"></el-checkbox>
                                            </el-checkbox-group>
                                        </div>
                                    </el-form-item>

                                    <el-form-item prop="therapyMainOther">
                                        <div v-if="item.different.therapyMainOther != '0' " class="differentText">*上诊次差异结果：{{item.different.therapyMainOther}}</div>

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
                                        <div v-if="item.different.mymopOnePointOne != '0' " class="differentText">*上诊次差异结果：{{item.different.mymopOnePointOne}}</div>

                                        <el-input placeholder="请在此填写症状一" v-model="item.survey.mymopOnePointOne" style="width: 20%">
                                        </el-input>

                                        <div v-if="item.different.mymopOnePointOneScore != '0' " class="differentText">*上诊次差异结果：{{item.different.mymopOnePointOneScore}}</div>

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
                                        <div v-if="item.different.mymopOnePointTwo != '0' " class="differentText">*上诊次差异结果：{{item.different.mymopOnePointTwo}}</div>

                                        <el-input placeholder="请在此填写症状二" v-model="item.survey.mymopOnePointTwo" style="width: 20%">
                                        </el-input>

                                        <el-form-item prop="mymopOnePointTwoScore">
                                            <div v-if="item.different.mymopOnePointTwoScore != '0' " class="differentText">*上诊次差异结果：{{item.different.mymopOnePointTwoScore}}</div>

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
                                        <div v-if="item.different.mymopTwo != '0' " class="differentText">*上诊次差异结果：{{item.different.mymopTwo}}</div>

                                        <el-input placeholder="请在此填写活动" v-model="item.survey.mymopTwo" style="width: 20%">
                                        </el-input>

                                        <div v-if="item.different.mymopTwoScore != '0' " class="differentText">*上诊次差异结果：{{item.different.mymopTwoScore}}</div>

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


                                    <div v-if="item.different.mymopThree != '0' " class="differentText">*上诊次差异结果：{{item.different.mymopThree}}</div>

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

                                    <div v-if="item.different.mymopFour != '0' " class="differentText">*上诊次差异结果：{{item.different.mymopFour}}</div>


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


                                    <div v-if="item.different.mymopFive != '0' " class="differentText">*上诊次差异结果：{{item.different.mymopFive}}</div>

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

                                    <div v-if="item.different.mymopSixPointOne != '0' " class="differentText">*上诊次差异结果：{{item.different.mymopSixPointOne}}</div>


                                    <el-form-item prop="mymopSixPointOne">
                                        <div>药物名称：
                                            <el-input placeholder="请在此填写药物名称" v-model="item.survey.mymopSixPointOne" style="width: 20%">
                                            </el-input>
                                        </div>

                                    </el-form-item>
                                    <div v-if="item.different.mymopSixPointTwo != '0' " class="differentText">*上诊次差异结果：{{item.different.mymopSixPointTwo}}</div>


                                    <el-form-item prop="mymopSixPointTwo">
                                        <div>使用量：
                                            <el-input placeholder="请在此填写使用量" v-model="item.survey.mymopSixPointTwo" style="width: 20%">
                                            </el-input>
                                        </div>

                                    </el-form-item>



                                </el-descriptions-item>



                                <el-descriptions-item label="7.你认为减少使用这些药物有多重要？">


                                    <div v-if="item.different.mymopSeven != '0' " class="differentText">*上诊次差异结果：{{item.different.mymopSeven}}</div>

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

                                    <div v-if="item.different.mymopEight != '0' " class="differentText">*上诊次差异结果：{{item.different.mymopEight}}</div>


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
                                    <div v-if="item.different.sgrqDescription != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqDescription}}</div>

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
                                        <div v-if="item.different.sgrqPartOnePointOne != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartOnePointOne}}</div>

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
                                        <div v-if="item.different.sgrqPartOnePointTwo != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartOnePointTwo}}</div>

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
                                        <div v-if="item.different.sgrqPartOnePointThree != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartOnePointThree}}</div>

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
                                        <div v-if="item.different.sgrqPartOnePointFour != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartOnePointFour}}</div>

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
                                        <div v-if="item.different.sgrqPartOnePointFive != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartOnePointFive}}</div>

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
                                        <div v-if="item.different.sgrqPartOnePointSix != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartOnePointSix}}</div>

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
                                        <div v-if="item.different.sgrqPartOnePointSeven != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartOnePointSeven}}</div>

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
                                        <div v-if="item.different.sgrqPartTwoOnePointOne != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoOnePointOne}}</div>

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
                                        <div v-if="item.different.sgrqPartTwoOnePointTwo != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoOnePointTwo}}</div>

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
                                        <div v-if="item.different.sgrqPartTwoTwoPointOne != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoTwoPointOne}}</div>

                                        <el-form-item prop="sgrqPartTwoTwoPointOne">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoTwoPointOne">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>2．洗漱或穿衣
                                        <div v-if="item.different.sgrqPartTwoTwoPointTwo != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoTwoPointTwo}}</div>

                                        <el-form-item prop="sgrqPartTwoTwoPointTwo">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoTwoPointTwo">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>3．在室内走动
                                        <div v-if="item.different.sgrqPartTwoTwoPointThree != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoTwoPointThree}}</div>

                                        <el-form-item prop="sgrqPartTwoTwoPointThree">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoTwoPointThree">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>4．在户外平台上走动
                                        <div v-if="item.different.sgrqPartTwoTwoPointFour != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoTwoPointFour}}</div>

                                        <el-form-item prop="sgrqPartTwoTwoPointFour">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoTwoPointFour">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>5．上一层楼
                                        <div v-if="item.different.sgrqPartTwoTwoPointFive != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoTwoPointFive}}</div>

                                        <el-form-item prop="sgrqPartTwoTwoPointFive">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoTwoPointFive">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>6．爬坡
                                        <div v-if="item.different.sgrqPartTwoTwoPointSix != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoTwoPointSix}}</div>

                                        <el-form-item prop="sgrqPartTwoTwoPointSix">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoTwoPointSix">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>7. 运动性体育活动或运动性游戏
                                        <div v-if="item.different.sgrqPartTwoTwoPointSeven != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoTwoPointSeven}}</div>

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
                                        <div v-if="item.different.sgrqPartTwoThreePointOne != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoThreePointOne}}</div>

                                        <el-form-item prop="sgrqPartTwoThreePointOne">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoThreePointOne">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>2．咳嗽时我感到疲倦
                                        <div v-if="item.different.sgrqPartTwoThreePointTwo != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoThreePointTwo}}</div>

                                        <el-form-item prop="sgrqPartTwoThreePointTwo">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoThreePointTwo">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>3．谈话时，我会感到喘不过气来
                                        <div v-if="item.different.sgrqPartTwoThreePointThree != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoThreePointThree}}</div>

                                        <el-form-item prop="sgrqPartTwoThreePointThree">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoThreePointThree">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>4．弯腰时，我觉得喘不过气来
                                        <div v-if="item.different.sgrqPartTwoThreePointFour != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoThreePointFour}}</div>

                                        <el-form-item prop="sgrqPartTwoThreePointFour">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoThreePointFour">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>5．咳嗽或呼吸困难影响我的睡眠
                                        <div v-if="item.different.sgrqPartTwoThreePointFive != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoThreePointFive}}</div>

                                        <el-form-item prop="sgrqPartTwoThreePointFive">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoThreePointFive">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>6．我经常疲惫不堪
                                        <div v-if="item.different.sgrqPartTwoThreePointSix != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoThreePointSix}}</div>

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
                                        <div v-if="item.different.sgrqPartTwoFourPointOne != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoFourPointOne}}</div>

                                        <el-form-item prop="sgrqPartTwoFourPointOne">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoFourPointOne">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>2．我的呼吸问题让我的家人担心
                                        <div v-if="item.different.sgrqPartTwoFourPointTwo != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoFourPointTwo}}</div>

                                        <el-form-item prop="sgrqPartTwoFourPointTwo">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoFourPointTwo">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>3．当喘不过气来时，我感到害怕或惊恐
                                        <div v-if="item.different.sgrqPartTwoFourPointThree != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoFourPointThree}}</div>

                                        <el-form-item prop="sgrqPartTwoFourPointThree">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoFourPointThree">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>4．我觉得我的呼吸问题很严重
                                        <div v-if="item.different.sgrqPartTwoFourPointFour != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoFourPointFour}}</div>

                                        <el-form-item prop="sgrqPartTwoFourPointFour">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoFourPointFour">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>5．我觉得我的呼吸问题不能好转
                                        <div v-if="item.different.sgrqPartTwoFourPointFive != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoFourPointFive}}</div>

                                        <el-form-item prop="sgrqPartTwoFourPointFive">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoFourPointFive">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>6．我的呼吸问题使我变得虚弱、活动不便
                                        <div v-if="item.different.sgrqPartTwoFourPointSix != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoFourPointSix}}</div>

                                        <el-form-item prop="sgrqPartTwoFourPointSix">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoFourPointSix">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>7．体育运动对我来说是不安全的
                                        <div v-if="item.different.sgrqPartTwoFourPointSeven != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoFourPointSeven}}</div>

                                        <el-form-item prop="sgrqPartTwoFourPointSeven">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoFourPointSeven">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>8．做任何事情我都很吃力
                                        <div v-if="item.different.sgrqPartTwoFourPointEight != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoFourPointEight}}</div>

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
                                        <div v-if="item.different.sgrqPartTwoFivePoint != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoFivePoint}}</div>

                                        <el-form-item prop="sgrqPartTwoFivePoint">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoFivePoint">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>
                                    如果接受过治疗，对于下面每一个问题，请根据您的实际情况，选择“是”或“否”
                                    <div>1．治疗对我来说没有多大帮助
                                        <div v-if="item.different.sgrqPartTwoFivePointOne != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoFivePointOne}}</div>

                                        <el-form-item prop="sgrqPartTwoFivePointOne">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoFivePointOne">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>2．在他人面前用药让我感到难堪
                                        <div v-if="item.different.sgrqPartTwoFivePointTwo != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoFivePointTwo}}</div>

                                        <el-form-item prop="sgrqPartTwoFivePointTwo">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoFivePointTwo">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>3．治疗引起了不良的药物副作用
                                        <div v-if="item.different.sgrqPartTwoFivePointThree != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoFivePointThree}}</div>

                                        <el-form-item prop="sgrqPartTwoFivePointThree">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoFivePointThree">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>4．治疗严重干扰了我的生活
                                        <div v-if="item.different.sgrqPartTwoFivePointFour != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoFivePointFour}}</div>

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
                                        <div v-if="item.different.sgrqPartTwoSixPointOne != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoSixPointOne}}</div>

                                        <el-form-item prop="sgrqPartTwoSixPointOne">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoSixPointOne">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>2．我不能洗澡或淋浴，或需要花很长的时间
                                        <div v-if="item.different.sgrqPartTwoSixPointTwo != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoSixPointTwo}}</div>

                                        <el-form-item prop="sgrqPartTwoSixPointTwo">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoSixPointTwo">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>3．我走得比别人慢，或常常停下来休息
                                        <div v-if="item.different.sgrqPartTwoSixPointThree != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoSixPointThree}}</div>

                                        <el-form-item prop="sgrqPartTwoSixPointThree">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoSixPointThree">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>4．我做家务事非常慢，或常常停下来休息
                                        <div v-if="item.different.sgrqPartTwoSixPointFour != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoSixPointFour}}</div>

                                        <el-form-item prop="sgrqPartTwoSixPointFour">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoSixPointFour">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>5．上一层楼时，我得慢慢走或停下来休息
                                        <div v-if="item.different.sgrqPartTwoSixPointFive != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoSixPointFive}}</div>

                                        <el-form-item prop="sgrqPartTwoSixPointFive">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoSixPointFive">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>6．如果赶时间或快走，我不得不休息或放慢速度
                                        <div v-if="item.different.sgrqPartTwoSixPointSix != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoSixPointSix}}</div>

                                        <el-form-item prop="sgrqPartTwoSixPointSix">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoSixPointSix">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>7．呼吸困难使我在进行诸如上坡、提东西上楼、在花园中除草、跳舞、练气功或做操等活动时感到困难
                                        <div v-if="item.different.sgrqPartTwoSixPointSeven != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoSixPointSeven}}</div>

                                        <el-form-item prop="sgrqPartTwoSixPointSeven">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoSixPointSeven">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>8．呼吸问题使我在进行诸如搬运重物、在花园中挖土、铲雪、慢跑或快走（8公里/小时）、舞剑或游泳时感到困难
                                        <div v-if="item.different.sgrqPartTwoSixPointEight != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoSixPointEight}}</div>

                                        <el-form-item prop="sgrqPartTwoSixPointEight">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoSixPointEight">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>9．呼吸问题使我在进行诸如重体力活、跑步、骑自行车、快速游泳、进行剧烈的体育运动时感到困难
                                        <div v-if="item.different.sgrqPartTwoSixPointNine != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoSixPointNine}}</div>

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
                                        <div v-if="item.different.sgrqPartTwoSevenPointOne != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoSevenPointOne}}</div>

                                        <el-form-item prop="sgrqPartTwoSevenPointOne">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoSevenPointOne">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>2．我不能外出娱乐或消遣
                                        <div v-if="item.different.sgrqPartTwoSevenPointTwo != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoSevenPointTwo}}</div>

                                        <el-form-item prop="sgrqPartTwoSevenPointTwo">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoSevenPointTwo">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>3．我不能外出购物
                                        <div v-if="item.different.sgrqPartTwoSevenPointThree != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoSevenPointThree}}</div>

                                        <el-form-item prop="sgrqPartTwoSevenPointThree">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoSevenPointThree">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>4．我不能做家务
                                        <div v-if="item.different.sgrqPartTwoSevenPointFour != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoSevenPointFour}}</div>

                                        <el-form-item prop="sgrqPartTwoSevenPointFour">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoSevenPointFour">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>5．我不能走得离床或椅子太远
                                        <div v-if="item.different.sgrqPartTwoSevenPointFive != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoSevenPointFive}}</div>

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
                                        <div v-if="item.different.sgrqPartTwoEightPointOne != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoEightPointOne}}</div>

                                        <el-form-item prop="sgrqPartTwoEightPointOne">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoEightPointOne">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>2．在家干活
                                        <div v-if="item.different.sgrqPartTwoEightPointTwo != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoEightPointTwo}}</div>

                                        <el-form-item prop="sgrqPartTwoEightPointTwo">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoEightPointTwo">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>3．性生活
                                        <div v-if="item.different.sgrqPartTwoEightPointThree != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoEightPointThree}}</div>

                                        <el-form-item prop="sgrqPartTwoEightPointThree">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoEightPointThree">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>4．上商场、菜市场或进行娱乐活动
                                        <div v-if="item.different.sgrqPartTwoEightPointFour != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoEightPointFour}}</div>

                                        <el-form-item prop="sgrqPartTwoEightPointFour">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoEightPointFour">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>

                                    <div>5．在天气不好时外出或进入有烟味的房间
                                        <div v-if="item.different.sgrqPartTwoEightPointFive != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoEightPointFive}}</div>

                                        <el-form-item prop="sgrqPartTwoEightPointFive">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoEightPointFive">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>


                                    <div>6．探亲访友或与孩子玩耍
                                        <div v-if="item.different.sgrqPartTwoEightPointSix != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoEightPointSix}}</div>

                                        <el-form-item prop="sgrqPartTwoEightPointSix">

                                            <el-radio-group v-model="item.survey.sgrqPartTwoEightPointSix">
                                                <el-radio label="是" ></el-radio>
                                                <el-radio label="否" ></el-radio>
                                            </el-radio-group>


                                        </el-form-item>
                                    </div>






                                </el-descriptions-item>

                                <el-descriptions-item label="现在请您选择一项最能反映您的呼吸问题对您的影响的选项">

                                    <div v-if="item.different.sgrqPartTwoNinePointOne != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartTwoNinePointOne}}</div>


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
                                        <div v-if="item.different.sgrqPartThree != '0' " class="differentText">*上诊次差异结果：{{item.different.sgrqPartThree}}</div>
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
                                <div v-if="item.different.level != '0' " class="differentText">*上诊次差异结果：{{item.different.level}}</div>
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
        name: "FollowUp",

        data() {
            return {
                dialogVisible2 : false,
                dialogVisible3 : false,
                currentPage: 1,
                pageSize:10,
                total:null,
               // disablebtn:false,
                //当前选择的患者档案号
                nowCollectNo:null,
                type:null,  //档案号 /姓名 查询条件
                searchStatus:"待随访",//默认待随访
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
                options: [{
                    value: '待随访',
                    label: '待随访'
                }, {
                    value: '已超时',
                    label: '已超时'
                }, {
                    value: '已完成三次随访',
                    label: '已完成三次随访'
                }],
                tableData: [],
                //历史就诊数据
                followHistory:null,
                //历史就诊界面选中的某条数据
                followHistoryItem:null,
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

            searchChange(changeData){
                this.searchStatus = changeData
                if (changeData == '待排期'){
                    this.disablebtn = true
                }
                else{
                    this.disablebtn = false
                }

            },


            resetFormForCollect(collectForm){
                this.$refs[collectForm].resetFields();
            },
            //点击随访触发 弹窗以及回写数据
            choose(row){
               let that = this
                console.log(row);
                this.dialogVisible2 = true
                this.nowCollectNo = row.archivesNo

                this.$axios.post("/doctor/follow/getLastSurvey",{
                    //患者档案号
                    archivesId:that.nowCollectNo,
                    sequence : row.finishSequence

                }).then(res =>{
                    console.log(res)
                    if (res.data.message == "success" && res.data.data.sequence != null ){

                        that.$message('系统匹配到当前患者存在上一诊次的记录,已自动回写历史数据,您只需在上次的基础上修改即可提交');
                        that.collectForm = res.data.data.survey
                    }
                    // 第一诊 或上一诊无数据的 重新设置表单字段为 返回的null值 ，避免 将别的病人的数据 错误回写到 当前病人表单中
                    else {
                        that.collectForm = res.data.data.survey
                    }


                })


            },

            //随访信息采集
            saveCollectForm(){

                let that= this
                this.$axios.post("/doctor/follow/saveFollowForm",{
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
                    that.created()

                })

            },
            //修改随访信息
            updateForm(){
                let that = this
                this.$confirm('是否确认修改当前采集信息？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {


                    this.$axios.post("/doctor/follow/updateForm", {
                        id : that.followHistoryItem.id,  //要修改的数据的id
                        survey:that.followHistoryItem.survey //需要更新的问卷信息
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

            //获取历史就诊 点击的某一行绑定的数据
            getFollowRow(item){
                console.log(item)
                this.followHistoryItem = item;
            },

            //历史随访
            getFollowHistory(row){
                let that = this
                this.dialogVisible3 = true
                this.nowCollectNo = row.archivesNo
                    this.$axios.get("/doctor/follow/followHistory", {
                        //当前采集的患者档案号
                        params:{
                            archivesNo: that.nowCollectNo
                        },

                    }).then(res => {
                        that.followHistory = res.data.data
                        console.log(that.followHistory)


                    });

            },

            //提交传承弟子心得（随访）
            submitExperience(experience,id){
                let that = this
                this.$confirm('是否确认提交？如果已有心得,提交后将会覆盖之前的心得', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {


                    this.$axios.post("/doctor/follow/updateExperience", {
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

            //提交名老中医点评录音 （随访）
            submitSoundRecording(id,url){
                let that = this
                this.$confirm('是否确认提交？如果已有点评,提交后将会覆盖之前的点评', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    this.$axios.post("/doctor/follow/updateSound", {
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
            },

            //录音
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
            //页面渲染时，请求


        },
        created() {
            this.onSubmit()
        }
    }
</script>

<style scoped>
    .differentText {
        color: red;
    }
</style>