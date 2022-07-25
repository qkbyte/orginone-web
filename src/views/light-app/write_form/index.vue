<template>
    <div style="height: 100%;">
        <div class="write_form"
             v-loading.fullscreen.lock="fullscreenLoading"
        >
            <!--        <div class="top">-->
            <!--            <div class="top_title">{{ pageName }}</div>-->
            <!--        </div>-->

            <el-button
                    type="text"
                    style="font-size: 1rem;font-weight: bold;margin-left: 20px"
                    @click="goback"
            >
                <div class="el-icon-back"></div>
                <div style="display: inline-block; font-size:14px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;line-height:20px;">
                    返回
                </div>

            </el-button>
            <div class="firstBody">
                <div class="write_form_title">
                    <h1>
          <span style="margin: 0 0.5rem"
          ><img src="@/assets/edit.png" alt=""/></span
          >{{ title }}<span style="color:#000">内容</span>
                    </h1>
                </div>

                <div class="write_form_operation">
                    <!--                <el-button-->
                    <!--                        type="text"-->
                    <!--                        style="font-size: 1rem;font-weight: bold;"-->
                    <!--                        @click="showFlowProgress"-->
                    <!--                        v-loading.fullscreen.lock="fullscreenLoading"-->
                    <!--                >流程进度-->
                    <!--                </el-button>-->
                    <!--                                <el-button-->
                    <!--                                        type="text"-->
                    <!--                                        style="font-size: 1rem;font-weight: bold;"-->
                    <!--                                        @click="goback"-->
                    <!--                                >返回-->
                    <!--                                </el-button>-->
                    <!--        <el-button-->
                    <!--          type="text"-->
                    <!--          style="font-size: 1rem;font-weight: bold;"-->
                    <!--          @click="showTest"-->
                    <!--          >打印二维码-->
                    <!--        </el-button>-->
                    <!--        <el-button type="text" style="font-size: 1rem;font-weight: bold;"-->
                    <!--          >暂存-->
                    <!--        </el-button>-->
                    <!--        <el-button type="text" style="font-size: 1rem;font-weight: bold;"-->
                    <!--          >删除-->
                    <!--        </el-button>-->
                    <!--        <el-button-->
                    <!--          type="text"-->
                    <!--          style="font-size: 1rem;font-weight: bold;margin-right: 1.5rem"-->
                    <!--          >打印-->
                    <!--        </el-button>-->
                </div>

                <div class="write_form_firstContent">

                    <div class="write_form_firstContent_subtitle">
                        <div style="width:4px;height:17px;background-color: #154AD8;display: inline-block;"></div>
                        <div style="display: inline-block;margin-left: 10px;color:#303133;width:102px;">单据基础信息</div>
                    </div>
                    <div class="write_form_firstContent_main">
                        <fm-generate-form
                                :key="index"
                                :data="jsonData"
                                :remote="remoteFuncs"
                                :value="values"
                                ref="generateForm"
                        >
                        </fm-generate-form>
                    </div>

                    <!--                <div v-if="nodeType === 1" class="write_form_firstContent_button">-->
                    <!--                    <el-button-->
                    <!--                            style="width: 10rem; color: #0B3ED3;font-weight:bold;"-->
                    <!--                            @click="writeProcess"-->
                    <!--                    >填写完成-->
                    <!--                    </el-button>-->
                    <!--                    &lt;!&ndash;          <span style="margin-left: 2rem;">&ndash;&gt;-->
                    <!--                    &lt;!&ndash;            <img src="@assets/issue/msg.png" height="22" width="21" />&ndash;&gt;-->
                    <!--                    &lt;!&ndash;            <el-button type="text">存为草稿</el-button>&ndash;&gt;-->
                    <!--                    &lt;!&ndash;          </span>&ndash;&gt;-->
                    <!--                </div>-->

                    <!--                <div v-if="nodeType === 2" class="write_form_firstContent_button">-->
                    <!--                    <el-button-->
                    <!--                            style="width: 10rem; color: #0B3ED3;font-weight:bold;"-->
                    <!--                            @click="approveProcess(1)"-->
                    <!--                    >同意-->
                    <!--                    </el-button>-->

                    <!--                    <span style="margin-left: 1rem">不同意操作：</span>-->
                    <!--                    <el-select-->
                    <!--                            v-model="disapproveValue"-->
                    <!--                            clearable-->
                    <!--                            placeholder="请选择,默认为结束流程"-->
                    <!--                    >-->
                    <!--                        <el-option-->
                    <!--                                v-for="item in disapproveOptions"-->
                    <!--                                :key="item.value"-->
                    <!--                                :label="item.label"-->
                    <!--                                :value="item.value"-->
                    <!--                        >-->
                    <!--                        </el-option>-->
                    <!--                    </el-select>-->
                    <!--                    <el-button-->
                    <!--                            style="width: 10rem; color: #0B3ED3;font-weight:bold;"-->
                    <!--                            @click="approveProcess(0)"-->
                    <!--                    >不同意，提交-->
                    <!--                    </el-button>-->

                    <!--                    &lt;!&ndash;          <span style="margin-left: 2rem;">&ndash;&gt;-->
                    <!--                    &lt;!&ndash;            <img src="@assets/issue/msg.png" height="22" width="21" />&ndash;&gt;-->
                    <!--                    &lt;!&ndash;            <el-button type="text">存为草稿</el-button>&ndash;&gt;-->
                    <!--                    &lt;!&ndash;          </span>&ndash;&gt;-->
                    <!--                </div>-->


                    <div style="display: flex;justify-content: space-between;">
                        <div style="display: inline-block;width: 50%;text-align: left;margin-top: 1rem;">
                         <span style="width:219px;height:20px;font-size:14px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(142,146,152,1);line-height:20px;">
<!--                            共2轮审批，下一审批经办人：待定-->
                             <!--                            当前会签通过率：62%，通过所需：100%-->
                         </span>
                            <el-button
                                    type="text"
                                    style="width:84px;height:20px;font-size: 14px;
                                 font-weight: bold;color: #154AD8;margin-left: 12px;
                                 font-family:PingFangSC-Regular,PingFang SC;
                                 font-weight:400;
                                 color:rgba(21,74,216,1);
                                   line-height:20px;
                                "
                                    @click="showFlowProgress"
                                    v-loading.fullscreen.lock="fullscreenLoading"
                            >流程进度
                            </el-button>
                        </div>


                        <div v-if="isSimple!=1">
                            <div v-if="nodeType === 3" class="write_form_firstContent_button">
                                <!--                            <el-button type="text" style="width:32px;-->
                                <!--                            height:22px;-->
                                <!--                            font-size:16px;-->
                                <!--                            font-family:PingFangSC-Regular,PingFang SC;-->
                                <!--                            font-weight:400;-->
                                <!--                            color:rgba(21,74,216,1);-->
                                <!--                            line-height:22px;" @click="draftList">保存-->
                                <!--                            </el-button>-->
                                <el-button
                                        style="margin-left: 85px; width:144px;height:38px; color: white;font-weight:bold;background-color: #154AD8"
                                        @click="readProcess"
                                >已阅
                                </el-button>
                                <!--          <span style="margin-left: 2rem;">-->
                                <!--            <img src="@assets/issue/msg.png" height="22" width="21" />-->
                                <!--            <el-button type="text">存为草稿</el-button>-->
                                <!--          </span>-->
                            </div>
                            <div v-if="nodeType != 3" style="margin-top: 1rem" class="write_form_firstContent_button">
                                <span></span>
                                <!--                            <el-button type="text" style="width:32px;-->
                                <!--                            height:22px;-->
                                <!--                            font-size:16px;-->
                                <!--                            font-family:PingFangSC-Regular,PingFang SC;-->
                                <!--                            font-weight:400;-->
                                <!--                            color:rgba(21,74,216,1);-->
                                <!--                            line-height:22px;" @click="draftList">保存-->
                                <!--                            </el-button>-->
                                <el-button
                                        v-if="dialogShowAll.sendData.roleList.length!=0"
                                        style="width:144px;height:38px; margin-left: 58px;color: white;font-weight:bold;background-color: #154AD8"
                                        @click="dialogShowAll.value=true">
                                    设置审批人
                                </el-button>
                                <template v-else>
                                    <template v-if="nodeType === 1">
                                        <el-button
                                                style="width: 10rem; color: white;font-weight:bold;background-color: #154AD8"
                                                @click="writeProcessAuth([])"
                                        >填写完成
                                        </el-button>
                                        <el-button
                                                v-if="dialogShowAll.sendData.roleList.length!=0&&isSimple!=2"
                                                style="width:144px;height:38px; margin-left: 58px;color: white;font-weight:bold;background-color: #154AD8"
                                                @click="showTran">
                                            审批转移
                                        </el-button>
                                    </template>
                                    <template v-if="nodeType === 2">
                                        <div style="text-align: right;">
                                            <el-button
                                                    style="width:144px;height:38px; margin-left: 58px;color: white;font-weight:bold;background-color: #154AD8"
                                                    @click="showTran">
                                                审批转交
                                            </el-button>
                                            <el-button
                                                    style="color: white;font-weight:bold;background-color: #154AD8"
                                                    @click="approveProcessAuth(1,[])"
                                            >同意
                                            </el-button>
                                        </div>

                                        <div style="margin-top: 1rem;text-align: right;">
                                            <span style="margin-left: 1rem">不同意操作：</span>
                                            <el-select
                                                    v-model="disapproveValue"
                                                    clearable
                                                    placeholder="请选择处理类型"
                                                    style="width:150px;height:32px;font-size:12px;"
                                            >
                                                <!--                            -->
                                                <!--                            <template slot="prefix">请选择处理类型</template>-->
                                                <el-option
                                                        v-for="item in disapproveOptions"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value"
                                                >
                                                </el-option>
                                            </el-select>

                                            <el-button
                                                    v-if="disapproveValue==''"
                                                    disabled='true'
                                                    style="color: #D0D0D0;font-weight:bold;background-color: #EFEDF1"
                                            >提交
                                            </el-button>

                                            <el-button
                                                    v-else
                                                    style="color: white;font-weight:bold;background-color: #154AD8"
                                                    @click="approveProcessAuth(0,[])"
                                            >提交
                                            </el-button>
                                        </div>

                                    </template>
                                </template>
                                <el-button
                                        v-if="dialogShowAll.sendData.roleList.length!=0&&isSimple!=2"
                                        style="width:144px;height:38px; margin-left: 58px;color: white;font-weight:bold;background-color: #154AD8"
                                        @click="showTran">
                                    审批转移
                                </el-button>
                            </div>
                        </div>

                        <div v-else>
                            <el-button

                                    style="width:144px;height:38px; margin-left: 58px;color: white;font-weight:bold;background-color: #154AD8"
                                    @click="showTran2">
                                审批转交
                            </el-button>
                        </div>

                    </div>


                </div>
            </div>

            <el-dialog :visible.sync="dialogVisible" width="66%">
                <span slot="title" style="color: #303133;font-size: 20px;font-weight: bold">审批流程</span>
                <div class="flowProgress">
                    <!--        <div style="float: right;">-->
                    <!--          <img-->
                    <!--            src="@assets/issue/allProcess.png"-->
                    <!--            width="18"-->
                    <!--            height="18"-->
                    <!--            style="margin-top: 8px"-->
                    <!--          />-->
                    <!--          <el-button-->
                    <!--            type="text"-->
                    <!--            style="float: right; font-size: 1rem;font-weight: bold;padding: 0.4rem 0.3rem"-->
                    <!--            @click="getPicture"-->
                    <!--          >-->
                    <!--            查看全部流程-->
                    <!--          </el-button>-->
                    <!--        </div>-->

                    <div style="margin-top: 1rem">
                        <img :src="flowPic" height="275" width="100%"/>
                    </div>

                    <div>
                        <el-table
                                ref="multipleTable"
                                :data="flowData"
                                style="width: 100%"
                                :header-cell-style="getRowClass"

                        >
                            <el-table-column
                                    type="selection"
                                    width="55"
                            >
                            </el-table-column>
                            <el-table-column
                                    type="index"
                                    label="序号"
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="title"
                                    label="审核节点"
                                    width="180"
                            >

                            </el-table-column>
                            <el-table-column
                                    prop="executorName"
                                    label="审批人"
                                    width="100">
                            </el-table-column>
                            <el-table-column
                                    prop="runStatus"
                                    label="审核状态"
                                    width="100"
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="result"
                                    label="审核建议">
                            </el-table-column>
                            <el-table-column
                                    prop="executeTime"
                                    label="审核时间"
                                    width="300"
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="phoneNumber"
                                    label="联系方式">
                            </el-table-column>

                            <!--                        <el-table-column-->
                            <!--                                label="操作"-->
                            <!--                                align="center"-->
                            <!--                        >-->
                            <!--                            <template slot-scope="scope">-->
                            <!--                                <ApprovalListTableButton-->
                            <!--                                        :theId="scope.row.id"-->
                            <!--                                        :row="scope.row"-->
                            <!--                                        @handleGroupByButton="handleGroupByButton(scope)"-->
                            <!--                                        @handleDelteFormByButton="handleDelteFormByButton(scope)"-->
                            <!--                                        @handleChangeStatus="handleChangeStatus(scope.row)"-->
                            <!--                                ></ApprovalListTableButton>-->
                            <!--                            </template>-->

                            <!--                        </el-table-column>-->
                        </el-table>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
        >确 定</el-button
        >
      </span>
            </el-dialog>

            <approvalNextAuth ref="approvalNextAuth" v-if="dialogShowAll.value" :dialogShow="dialogShowAll"
                              :jobIdLists="jobIdLists" :agencyIdLists="agencyIdLists" :userIdLists="userIdLists"
                              @closeDialog="closeNextDialog"
                              @saveIt="initiateProcessAddAuth"
            >

                <div slot="theFooter">

                    <template v-if="nodeType === 1">
                        <el-button
                                style="width: 10rem; color: white;font-weight:bold;background-color: #154AD8"
                                @click="soltFunction(0)"
                        >填写完成
                        </el-button>
                    </template>
                    <template v-if="nodeType === 2">
                        <div style="text-align: right;">
                            <el-button @click="closeNextDialog" style="color: #154AD8">取 消</el-button>
                            <el-button
                                    style="color: white;font-weight:bold;background-color: #154AD8"
                                    @click="soltFunction(1)"
                            >同意
                            </el-button>
                        </div>

                        <div style="margin-top: 1rem">
                            <span style="margin-left: 1rem">不同意操作：</span>
                            <el-select
                                    v-model="disapproveValue"
                                    clearable
                                    placeholder="请选择处理类型"
                                    style="width:150px;height:32px;font-size:12px;"
                            >
                                <!--                            -->
                                <!--                            <template slot="prefix">请选择处理类型</template>-->
                                <el-option
                                        v-for="item in disapproveOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                >
                                </el-option>
                            </el-select>

                            <el-button
                                    v-if="disapproveValue==''"
                                    disabled='true'
                                    style="color: #D0D0D0;font-weight:bold;background-color: #EFEDF1"
                            >提交
                            </el-button>

                            <el-button
                                    v-else
                                    style="color: white;font-weight:bold;background-color: #154AD8"
                                    @click="soltFunction(2)"
                            >提交
                            </el-button>
                        </div>

                    </template>

                </div>
            </approvalNextAuth>

            <ApprovalFormTransfer
                    ref="ApprovalFormTransfer"
                    v-if="dialogShowTran.value" :dialogShow="dialogShowTran"
                    :value="this.transferList"
                    @saveInfo="saveTransfer"
                    @closeDialog="dialogShowTran.value=false"
                    headName="审批转移"
            >
            </ApprovalFormTransfer>


            <ApprovalFormTransfer
                    ref="ApprovalFormTransfer2"
                    v-if="dialogShowTran2.value" :dialogShow="dialogShowTran2"
                    :value="this.transferList2"
                    @saveInfo="saveTransfer2"
                    @closeDialog="dialogShowTran2.value=false"
                    headName="审批转交"
            >
            </ApprovalFormTransfer>


            <!--        <el-dialog-->
            <!--                center-->
            <!--                top="8vh"-->
            <!--                width="840px"-->
            <!--                class="diy-dialog"-->
            <!--                :visible.sync="dialogShowUser"-->
            <!--                :close-on-click-modal="false"-->
            <!--                style="text-align: center;"-->
            <!--        >-->

            <!--            <div class="diy-tab">-->
            <!--                <div-->
            <!--                        class="diy-tab__item"-->
            <!--                        :class="item.isCur? 'diy-tab__item&#45;&#45;is-active': 'diy-tab__item&#45;&#45;is-noactive'"-->
            <!--                        v-for="(item,index) in authItem"-->
            <!--                        @click="changeTab(item)"-->
            <!--                        :key="item.id"-->
            <!--                >-->
            <!--                    <div style="margin-top: 10px">-->
            <!--                        <el-tooltip-->
            <!--                                effect="dark"-->
            <!--                                :content="nextNodeIdList[index]"-->
            <!--                                placement="top-start"-->
            <!--                        >-->
            <!--                            <span style="white-space: nowrap;overflow:hidden;text-overflow:ellipsis;width: 100%">{{ nextNodeIdList[index] |omitName}}</span>-->
            <!--                        </el-tooltip>-->
            <!--                    </div>-->


            <!--                </div>-->
            <!--            </div>-->


            <!--            <div v-if="authItem.length>0">-->

            <!--                <div style="display: flex;align-items: center;flex-direction: column;">-->


            <!--                    <div style="text-align: center;">-->
            <!--                        默认用户：-->
            <!--                        <span style="margin-left: 10px" v-for="item in userIdLists[curShow]" :key="item">{{item}}</span>-->
            <!--                    </div>-->

            <!--                    <div style="text-align: center;">-->
            <!--                        所选部门权限：-->
            <!--                        <span style="margin-left: 10px" v-for="item in agencyIdLists[curShow]"-->
            <!--                              :key="item">{{item}}</span>-->

            <!--                    </div>-->

            <!--                    &lt;!&ndash;                    <div style="text-align: center;">&ndash;&gt;-->
            <!--                    &lt;!&ndash;                        默认角色权限：&ndash;&gt;-->
            <!--                    &lt;!&ndash;                        <span style="margin-left: 10px" v-for="item in roleIdLists[curShow]" :key="item">{{item}}</span>&ndash;&gt;-->
            <!--                    &lt;!&ndash;                    </div>&ndash;&gt;-->

            <!--                    <div style="text-align: center;">-->
            <!--                        默认岗位权限：-->
            <!--                        <span style="margin-left: 10px" v-for="item in jobIdLists[curShow]" :key="item">{{item}}</span>-->
            <!--                    </div>-->


            <!--                    <div style="text-align: center;">-->
            <!--                        <span slot="title" class="diy-dialog-title" style="text-align: center;">{{nextNodeIdList[curShow]|omitName}}节点:选择人员</span>-->
            <!--                    </div>-->

            <!--                    <div style="display: flex;align-items: center;flex-direction: column;">-->

            <!--                        <div v-if="!isShowUser">当前无可选节点</div>-->

            <!--                        <el-transfer-->
            <!--                                v-if="isShowUser"-->
            <!--                                v-model="valueU[curShow]"-->
            <!--                                :data="dataU[curShow]"-->
            <!--                                :titles="['可选', '已选']"-->
            <!--                        ></el-transfer>-->


            <!--                    </div>-->
            <!--                </div>-->


            <!--                &lt;!&ndash;                     <el-button type="primary" @click="approveProcessAuth(1)">发 起</el-button>&ndash;&gt;-->
            <!--            </div>-->


            <!--            <div v-if="nodeType === 1">-->
            <!--                <el-button-->
            <!--                        style="width: 10rem; color: #0B3ED3;font-weight:bold;"-->
            <!--                        @click="writeProcessAuth"-->
            <!--                >填写完成-->
            <!--                </el-button>-->
            <!--                &lt;!&ndash;          <span style="margin-left: 2rem;">&ndash;&gt;-->
            <!--                &lt;!&ndash;            <img src="@assets/issue/msg.png" height="22" width="21" />&ndash;&gt;-->
            <!--                &lt;!&ndash;            <el-button type="text">存为草稿</el-button>&ndash;&gt;-->
            <!--                &lt;!&ndash;          </span>&ndash;&gt;-->
            <!--            </div>-->
            <!--            <span slot="footer" class="diy-dialog-footer">-->
            <!--            <div v-if="nodeType === 2">-->
            <!--                <el-button-->
            <!--                        style="color: #0B3ED3;font-weight:bold;"-->
            <!--                        @click="approveProcessAuth(1)"-->
            <!--                >同意-->
            <!--                </el-button>-->

            <!--                <span style="margin-left: 1rem">不同意操作：</span>-->
            <!--                <el-select-->
            <!--                        v-model="disapproveValue"-->
            <!--                        clearable-->
            <!--                        placeholder="请选择,默认为结束流程"-->
            <!--                >-->
            <!--                    <el-option-->
            <!--                            v-for="item in disapproveOptions"-->
            <!--                            :key="item.value"-->
            <!--                            :label="item.label"-->
            <!--                            :value="item.value"-->
            <!--                    >-->
            <!--                    </el-option>-->
            <!--                </el-select>-->
            <!--                <el-button-->
            <!--                        style="color: #0B3ED3;font-weight:bold;"-->
            <!--                        @click="approveProcessAuth(0)"-->
            <!--                >不同意，提交-->
            <!--                </el-button>-->

            <!--                &lt;!&ndash;          <span style="margin-left: 2rem;">&ndash;&gt;-->
            <!--                &lt;!&ndash;            <img src="@assets/issue/msg.png" height="22" width="21" />&ndash;&gt;-->
            <!--                &lt;!&ndash;            <el-button type="text">存为草稿</el-button>&ndash;&gt;-->
            <!--                &lt;!&ndash;          </span>&ndash;&gt;-->
            <!--            </div>-->

            <!--            <el-button @click="dialogShowUser=false">取 消</el-button>-->
            <!--            </span>-->
            <!--        </el-dialog>-->


        </div>
    </div>

</template>

<script>
    import {mapState, mapGetters} from "vuex";
    import approvalNextAuth from "../components/ApprovalNextAuthDialog";
    import ApprovalFormTransfer from "../components/ApprovalFormTransfer";
    import {
        getFlowDiagramById,
        getFormInstById,
        approveHTTP,
        readDone,
        get,
        post,
        post2,
        getFormAuthList
    } from "@api/flow";
    import DiyTitle from "@components/DiyTitle/index";

    export default {
        data() {
            return {
                pageName: "",
                title: "项目审批单批示项目审",
                index: 0,
                jsonData: {
                    list: [
                        {
                            type: "input",
                            icon: "icon-input",
                            options: {
                                width: "100%",
                                defaultValue: "",
                                required: false,
                                dataType: "string",
                                pattern: "",
                                placeholder: "",
                                disabled: false,
                                remoteFunc: "func_1581772110000_28532"
                            },
                            name: "单行文本",
                            key: "1581772110000_28532",
                            model: "input_1581772110000_28532",
                            rules: [
                                {
                                    type: "string",
                                    message: "单行文本格式不正确"
                                }
                            ]
                        },
                        {
                            type: "textarea",
                            icon: "icon-diy-com-textarea",
                            options: {
                                width: "100%",
                                defaultValue: "",
                                required: false,
                                disabled: false,
                                pattern: "",
                                placeholder: "",
                                remoteFunc: "func_1581772111000_22509"
                            },
                            name: "多行文本",
                            key: "1581772111000_22509",
                            model: "textarea_1581772111000_22509",
                            rules: []
                        }
                    ],
                    config: {
                        labelWidth: 100,
                        labelPosition: "top",
                        size: "small"
                    }
                },
                jsonData1: {},
                remoteFuncs: {},
                values: {},
                formId: "",
                dialogVisible: false,
                procModelId: "",
                createdBy: "",
                form_inst_value: "",
                //判断是发布表单，还是填写
                // type: 1,
                flowPic: "",
                task_id: "",
                //判断是 审批、办理、还是阅读。
                nodeType: 1,
                //判读拒绝操作后执行的步骤
                disapproveOptions: [
                    {
                        value: "0",
                        label: "结束当前流程"
                    },
                    //     {
                    //     value: '1',
                    //     label: '退回到上一个经办节点'
                    // }, {
                    //     value: '2',
                    //     label: '由审批人选择回滚到一节点'
                    // },
                    {
                        value: "3",
                        label: "继续执行"
                    }
                ],
                disapproveValue: "",
                //    页面进度条
                fullscreenLoading: false,
                dialogShowUser: false,
                dialogShowJ: false,
                dialogShowB: false,
                dialogShowG: false,
                valueG: [],
                dataG: [],
                valueB: [],
                dataB: [],
                valueJ: [],
                dataJ: [],

                valueU: [],
                dataU: [],
                isShowUser: true,
                nextNodeIdList: [],


                curShow: 0,
                authItem: [],

                jobIdLists: [],
                roleIdLists: [],
                agencyIdLists: [],
                userIdLists: [],
                next_node_names: [],


                dialogShowAll: {
                    value: false,
                    sendData: {
                        roleId: 0,
                        roleList: [],
                    }
                },
                dialogShowTran: {
                    value: false,

                },
                dialogShowTran2: {
                    value: false,

                },


                transferList: [],
                transferList2: [],

                endType: 0,
                flowData: [],
                isSimple:0,
            };
        },
        computed: {
            ...mapState("user", ["userId"]),
            ...mapState("user", ["token"]),
            ...mapGetters("tenant", ["curTenantCode"]),

        },
        filters: {
            omitName(info) {
                if (info.length > 5) return info.substring(0, 5) + "...";
                return info;
            },

        },
        components: {
            approvalNextAuth,
            DiyTitle,
            ApprovalFormTransfer,
        },
        methods: {
            showFlowProgress() {
                this.dialogVisible = true;
                this.getFlowList();
            },
            getFlowList() {
                this.fullscreenLoading = true;
                let params = {
                    proc_inst_id: this.procModelId
                };
                get(`dev-api/asset-bpm/admin/proc_inst/nodeList`, params)
                    .then(res => {
                        this.fullscreenLoading = false;
                        this.flowData = res.data.obj;

                    })
                    .catch(err => {
                        this.fullscreenLoading = false;
                    });

            },
            showTran() {
                let params = {
                    taskId: this.task_id,
                };
                post2(`dev-api/asset-bpm/form_inst/transferList`, params).then(res => {
                    this.transferList = [];
                    let temp = res.data.obj.userIdList;
                    for (let i = 0; i < temp.length; i = i + 2) {
                        this.transferList.push({
                            id: temp[i],
                            label: temp[i + 1],
                        })
                    }

                    this.dialogShowTran.value = true;
                    console.log(this.transferList)
                });

            },
            showTran2() {
                let params = {
                    taskId: this.task_id,
                };
                post2(`dev-api/asset-bpm/form_inst/transferList`, params).then(res => {
                    this.transferList2 = [];
                    let temp = res.data.obj.userIdList;
                    for (let i = 0; i < temp.length; i = i + 2) {
                        this.transferList2.push({
                            id: temp[i],
                            label: temp[i + 1],
                        })
                    }

                    this.dialogShowTran2.value = true;
                    console.log(this.transferList2)
                });

            },
            saveTransfer(info) {
                this.fullscreenLoading = true;
                let userIds = [];
                info.forEach(item => {
                    userIds.push(item.id)
                });
                let params = {
                    taskId: this.task_id,
                    userIds:userIds.join(','),
                    curUserId:this.userId
                };
                post2('dev-api/asset-bpm/form_inst/transfer',params).then(res=>{
                    this.fullscreenLoading = false;
                    this.$message.success('转交成功');
                    this.goback();
                }).catch(err => {
                    this.fullscreenLoading = false;
                    this.dialogShowTran.value=false;
                    this.$message.error({
                        message: "转交失败",
                        duration: 700
                    });
                });
            },
            saveTransfer2(info) {
                this.fullscreenLoading = true;
                let userIds = [];
                info.forEach(item => {
                    userIds.push(item.id)
                });
                let params = {
                    taskId: this.task_id,
                    userIds:userIds.join(','),
                    curUserId:this.userId
                };
                post2('dev-api/asset-bpm/form_inst/transfer',params).then(res=>{
                    this.fullscreenLoading = false;
                    this.$message.success('转交成功');
                    this.goback();
                }).catch(err => {
                    this.fullscreenLoading = false;
                    this.dialogShowTran.value=false;
                    this.$message.error({
                        message: "转交失败",
                        duration: 700
                    });
                });
            },
            draftList() {
                this.fullscreenLoading = true;
                this.form_inst_value = "";
                this.$refs.generateForm
                    .getData()
                    .then(data => {
                        // let CandidateUserIdLists = [];
                        //
                        // for (let i = 0; i < this.valueU.length; i++) {
                        //     CandidateUserIdLists[i] = this.valueU[i];
                        // }
                        let params = {
                            editor: this.userId,
                            form_inst_sheet: JSON.stringify(this.jsonData),
                            form_inst_value: JSON.stringify(data),
                            form_model_id: this.formId,
                            proc_inst_id: this.procModelId,
                            task_id: this.task_id,
                            candidateUserIdLists: [],
                            nextNodeIdList: this.nextNodeIdList,
                        };
                        // console.log(JSON.stringify(params));

                        post("/dev-bmp/form_inst/draft", params)
                            .then(res => {
                                console.log(res.data);
                                this.$message.success("保存成功");
                                this.goback();
                            })
                            .catch(err => {
                                this.fullscreenLoading = false;
                                this.$message.error({
                                    message: "保存失败",
                                    duration: 700
                                });
                            });
                    })
                    .catch(e => {
                        this.$message.error("数据校验失败");
                    });
            },
            getRowClass({row, column, rowIndex, columnIndex}) {
                if (rowIndex === 0) {
                    return "background:rgba(236,239,253,1);color:#333333;font-weight:bold";
                } else {
                    return "";
                }
            },

            changeTab: function (obj) {
                this.curShow = obj.id;
                this.authItem.forEach(function (item) {
                    if (item.id == obj.id) {
                        item.isCur = true;
                    } else {
                        item.isCur = false;
                    }
                });

                this.showUserList(this.curShow);
            },

            getJsonData() {
                this.fullscreenLoading = true;

                let params = {
                    taskId: this.task_id,
                    userId: this.userId,
                    sectionId: "",
                    curSectionUsers: ""
                };
                getFormInstById(params)
                    .then(res => {
                        if (res.data.code == 200) {

                            this.jsonData = JSON.parse(res.data.obj.formInstSheet);
                            this.values = JSON.parse(res.data.obj.formInstValue);
                            this.nodeType = res.data.obj.nodeType;
                            this.nextNodeIdList = res.data.obj.nextNodeIdList;
                            this.title = res.data.obj.title;

                            this.roleIdLists = [];
                            res.data.obj.roleIdLists.forEach(item => {
                                let the_temp = [];
                                item.forEach(the_item => {
                                    if (the_item != '')
                                        the_temp.push(the_item)
                                })
                                this.roleIdLists.push(the_temp)
                            });


                            this.jobIdLists = [];


                            res.data.obj.userIdListsByJobIdLists.forEach((item, index) => {
                                let the_temp = [];
                                item.forEach((the_item, idx) => {
                                    if (the_item != '') {
                                        let node = {
                                            id: the_item,
                                            label: res.data.obj.userNameListsByJobIdLists[index][idx],
                                            children: []
                                        };
                                        the_temp.push(node);
                                    }


                                });
                                this.jobIdLists.push(the_temp)
                            });


                            this.agencyIdLists = [];
                            res.data.obj.userIdListsByAgencyIdLists.forEach((item, index) => {
                                let the_temp = [];
                                item.forEach((the_item, idx) => {
                                    if (the_item != '') {
                                        let node = {
                                            id: the_item,
                                            label: res.data.obj.userNameListsByAgencyIdLists[index][idx],
                                            children: []
                                        };
                                        the_temp.push(node)
                                    }
                                })
                                this.agencyIdLists.push(the_temp)
                            });


                            this.userIdLists = [];
                            res.data.obj.userIdLists.forEach((item, index) => {
                                let the_temp = [];
                                item.forEach((the_item, idx) => {
                                    if (the_item != '') {
                                        let node = {
                                            id: the_item,
                                            label: res.data.obj.userNameLists[index][idx],
                                            children: []
                                        };
                                        the_temp.push(node)
                                    }

                                })
                                this.userIdLists.push(the_temp)
                            });


                            this.next_node_names = res.data.obj.nextNodeNameList;

                            this.nextNodeIdList.forEach((item, index) => {

                                let iatem = {
                                    id: index,
                                    name: item,
                                    isCur: index == 0 ? true : false
                                };
                                let iatem1 = {
                                    id: item,
                                    title: this.next_node_names[index] == '' ? "下一节点" : this.next_node_names[index],
                                };

                                this.authItem.push(iatem);

                                this.dialogShowAll.sendData.roleList.push(iatem1);

                                if (index == 0) {
                                    this.dialogShowAll.sendData.roleId = item;
                                }


                                this.dataU[index] = [];
                                this.valueU[index] = [];


                                this.dataJ[index] = [];
                                this.valueJ[index] = [];

                                this.dataG[index] = [];
                                this.valueG[index] = [];

                                this.dataB[index] = [];
                                this.valueB[index] = [];


                            });


                            this.setImgInfo();


                        } else {
                            this.$message.error({
                                message: "表单格式数据失败",
                                duration: 700
                            });
                            this.fullscreenLoading = false;
                            this.goback();
                        }
                        this.fullscreenLoading = false;
                    })
                    .catch(err => {
                        console.log(err);
                        this.$message.error({
                            message: "表单格式数据失败",
                            duration: 700
                        });
                        this.fullscreenLoading = false;
                        this.goback();
                    });


            },
            setImgInfo() {
                this.jsonData.list.forEach((item, i) => {
                    console.log(item);
                    if (item.type === "MediaIMAGE") {
                        item.zcyToken = this.token;
                        item.action = "http://platform.assetcloud.org.cn/dev-api/asset-form/upload/images";
                    }

                    if (item.type === "accessory") {
                        item.zcyToken = this.token;
                        item.action = "http://platform.assetcloud.org.cn/dev-api/asset-form/upload/files";
                    }

                })

                console.log(JSON.stringify(this.jsonData));

            },

            getManyList() {
                this.dialogShowUser = true;
                this.dialogShowJ = false;
                this.dialogShowB = false;
                this.dialogShowG = false;

                if (this.nextNodeIdList.length > 0)
                    this.showUserList(this.curShow);

                let params = {
                    flag: 1,
                    tenantCode: this.curTenantCode,
                };

                get(`dev-api/asset-system/jobs/v1/get/dept/job/role`, params)
                    .then(res => {
                        // this.valueG = [];
                        // this.dataG = [];

                        for (let index = 0; index < this.valueG.length; index++) {
                            this.dataG[index] = [];
                            this.valueG[index] = [];

                            res.data.data.forEach((item, idx) => {
                                this.dataG[index].push({
                                    key: item.id,
                                    label: item.jobName,
                                })
                            })

                        }
                        this.dialogShowG = true;
                        // console.log(JSON.stringify(res.data.data[0].id))


                    })
                    .catch(err => {
                    });

                let params1 = {
                    flag: 2,
                    tenantCode: this.curTenantCode,
                };

                get(`dev-api/asset-system/jobs/v1/get/dept/job/role`, params1)
                    .then(res => {
                        for (let index = 0; index < this.valueG.length; index++) {
                            this.valueB[index] = [];
                            this.dataB[index] = [];

                            res.data.data.forEach((item, idx) => {
                                this.dataB[index].push({
                                    key: item.id,
                                    label: item.agencyName,
                                })
                            })
                        }
                        this.dialogShowB = true;


                    })
                    .catch(err => {
                    });

                let params2 = {
                    flag: 3,
                    tenantCode: this.curTenantCode,
                };
                get(`dev-api/asset-system/jobs/v1/get/dept/job/role`, params2)
                    .then(res => {

                        for (let index = 0; index < this.valueG.length; index++) {
                            this.valueJ[index] = [];
                            this.dataJ[index] = [];

                            res.data.data.forEach((item, idx) => {
                                this.dataJ[index].push({
                                    key: item.id,
                                    label: item.roleName,
                                })
                            })
                        }

                        this.dialogShowJ = true;

                    })
                    .catch(err => {
                    });


            },
            showUserList(index) {
                this.isShowUser = false;

                // let params = {
                //     tenantCode: this.curTenantCode,
                //     deptId:[1,3,2],
                //     jobId:this.valueG,
                //     roleId:this.valueJ
                // };
                let params = {
                    tenantCode: this.curTenantCode,
                    deptIds: this.agencyIdLists[index],
                    jobIds: this.jobIdLists[index],
                    roleIds: this.roleIdLists[index]
                };

                // get(`dev-api/asset-system/person/get/all/cons/person`, params)
                //     .then(res => {
                //         this.valueU = [];
                //         this.dataU = [];
                //
                //         console.log(JSON.stringify(res.data.data[0].id))
                //
                //         res.data.data.forEach((item, index) => {
                //             this.dataU.push({
                //                 key: item.id,
                //                 label: item.realName,
                //             })
                //         })
                //
                //
                //     })
                //     .catch(err => {
                //     });

                console.log(JSON.stringify(this.valueB[index]) + '1323')

                getFormAuthList(params).then(res => {
                    // this.valueU = [];
                    // this.dataU = [];

                    console.log(JSON.stringify(res.data.data[0].id))
                    this.dataU[index] = [];
                    this.valueU[index] = [];
                    res.data.data.forEach((item, idx) => {

                        this.dataU[index].push({
                            key: item.userId,
                            label: item.realName,
                        })
                    })
                    this.isShowUser = true;

                }).catch(err => {
                });


            },


            //经办节点
            goback() {
                this.$router.go(-1);
            },
            writeProcess() {
                this.fullscreenLoading = true;
                this.form_inst_value = "";
                this.$refs.generateForm
                    .getData()
                    .then(data => {
                        let params = {
                            editor: this.userId,
                            form_inst_sheet: JSON.stringify(this.jsonData),
                            form_inst_value: JSON.stringify(data),
                            form_model_id: this.formId,
                            proc_inst_id: this.procModelId,
                            task_id: this.task_id,
                            candidateUserIdLists: [],
                            nextNodeIdList: this.nextNodeIdList,
                        };
                        // console.log(JSON.stringify(params));

                        post("/dev-bmp/form_inst/apply_node", params)
                            .then(res => {
                                console.log(res.data);
                                this.$message.success("填写表单成功");
                                this.goback();
                            })
                            .catch(err => {
                                this.fullscreenLoading = false;
                                this.$message.error({
                                    message: "填写表单失败",
                                    duration: 700
                                });
                            });
                    })
                    .catch(e => {
                        this.$message.error("数据校验失败");
                    });
            },
            writeProcessAuth(CandidateUserIdLists) {
                this.fullscreenLoading = true;
                this.form_inst_value = "";
                this.$refs.generateForm
                    .getData()
                    .then(data => {
                        // let CandidateUserIdLists = [];
                        //
                        // for (let i = 0; i < this.valueU.length; i++) {
                        //     CandidateUserIdLists[i] = this.valueU[i];
                        // }
                        let params = {
                            editor: this.userId,
                            form_inst_sheet: JSON.stringify(this.jsonData),
                            form_inst_value: JSON.stringify(data),
                            form_model_id: this.formId,
                            proc_inst_id: this.procModelId,
                            task_id: this.task_id,
                            candidateUserIdLists: CandidateUserIdLists,
                            nextNodeIdList: this.nextNodeIdList,
                        };
                        // console.log(JSON.stringify(params));

                        post("/dev-bmp/form_inst/v3/apply_node", params)
                            .then(res => {
                                console.log(res.data);
                                this.$message.success("填写表单成功");
                                this.goback();
                            })
                            .catch(err => {
                                this.fullscreenLoading = false;
                                this.$message.error({
                                    message: "填写表单失败",
                                    duration: 700
                                });
                            });
                    })
                    .catch(e => {
                        this.$message.error("数据校验失败");
                    });
            },

            approveProcess(approve_result) {
                this.fullscreenLoading = true;
                this.form_inst_value = "";
                this.$refs.generateForm
                    .getData()
                    .then(data => {
                        let params;
                        if (this.disapproveValue === null)
                            params = {
                                approve_result: approve_result,
                                form_inst_sheet: JSON.stringify(this.jsonData),
                                form_inst_value: JSON.stringify(data),
                                form_model_id: this.formId,
                                proc_inst_id: this.procModelId,
                                task_id: this.task_id
                            };
                        else
                            params = {
                                approve_result: approve_result,
                                form_inst_sheet: JSON.stringify(this.jsonData),
                                form_inst_value: JSON.stringify(data),
                                form_model_id: this.formId,
                                proc_inst_id: this.procModelId,
                                task_id: this.task_id,
                                approve_type: this.disapproveValue
                            };
                        // console.log(JSON.stringify(params));

                        approveHTTP(params)
                            .then(res => {
                                console.log(res.data);
                                this.$message.success("审批完成");
                                this.goback();
                            })
                            .catch(err => {
                                this.$message.error({
                                    message: "审批失败",
                                    duration: 700
                                });
                            });
                    })
                    .catch(e => {
                        this.fullscreenLoading = false;
                        this.$message.error("数据校验失败");
                    });
            },

            approveProcessAuth(approve_result, CandidateUserIdLists) {
                this.fullscreenLoading = true;
                this.form_inst_value = "";
                this.$refs.generateForm
                    .getData()
                    .then(data => {
                        let params;

                        // let CandidateUserIdLists = [];
                        // for (let i = 0; i < this.valueU.length; i++) {
                        //     CandidateUserIdLists[i] = this.valueU[i];
                        // }
                        if (this.disapproveValue === null) {
                            params = {
                                editor: this.userId,
                                approve_result: approve_result,
                                form_inst_sheet: JSON.stringify(this.jsonData),
                                form_inst_value: JSON.stringify(data),
                                form_model_id: this.formId,
                                proc_inst_id: this.procModelId,
                                task_id: this.task_id,
                                candidateUserIdLists: CandidateUserIdLists,
                                nextNodeIdList: this.nextNodeIdList,
                            };
                        } else
                            params = {
                                approve_result: approve_result,
                                form_inst_sheet: JSON.stringify(this.jsonData),
                                form_inst_value: JSON.stringify(data),
                                form_model_id: this.formId,
                                proc_inst_id: this.procModelId,
                                task_id: this.task_id,
                                approve_type: this.disapproveValue,
                                candidateUserIdLists: CandidateUserIdLists,
                                nextNodeIdList: this.nextNodeIdList,
                            };
                        // console.log(JSON.stringify(params));

                        approveHTTP(params)
                            .then(res => {
                                console.log(res.data);
                                this.$message.success("审批完成");
                                this.goback();
                            })
                            .catch(err => {
                                this.$message.error({
                                    message: "审批失败",
                                    duration: 700
                                });
                            });
                    })
                    .catch(e => {
                        this.fullscreenLoading = false;
                        this.$message.error("数据校验失败");
                    });
            },


            readProcess() {
                this.fullscreenLoading = true;
                let params = {
                    editor: this.userId,
                    form_model_id: this.formId,
                    proc_inst_id: this.procModelId,
                    task_id: this.task_id
                };
                readDone(params)
                    .then(res => {
                        this.$message.success("提交完成");
                        this.goback();
                    })
                    .catch(err => {
                        this.fullscreenLoading = false;
                        this.$message.error({
                            message: "提交失败",
                            duration: 700
                        });
                    });
            },
            getPicture() {
                let params = {
                    proc_inst_id: this.procModelId
                };
                getFlowDiagramById(params)
                    .then(res => {
                        let reader = new window.FileReader();
                        reader.readAsDataURL(res.data);
                        reader.onloadend = () => {
                            let data = reader.result;
                            this.flowPic = data;
                        };
                    })
                    .catch(err => {
                        console.log(err);
                        this.$message.error({
                            message: "图片加载失败",
                            duration: 700
                        });
                    });
            },
            closeNextDialog() {
                this.dialogShowAll.value = false;
            },

            initiateProcessAddAuth(userList) {
                if (this.endType === 0) {
                    this.writeProcessAuth(userList);
                } else if (this.endType === 1) {
                    this.approveProcessAuth(1, userList);
                } else if (this.endType === 2) {
                    this.approveProcessAuth(0, userList);
                }
            },
            soltFunction(type) {
                this.endType = type;
                this.$refs.approvalNextAuth.handleSave();
            },

            showTest() {
                console.log(this.userId);
            }
        },


        created() {
            this.pageName = this.$route.meta.title;
            // console.log(this.$route.query.modelSheet);
            // this.jsonData = JSON.parse(this.$route.query.modelSheet);
            // this.type = this.$route.query.type;
            this.title = this.$route.query.title;
            this.formId = this.$route.query.id;
            this.procModelId = this.$route.query.procModelId;
            // console.log("dasddas"+this.procModelId )

            // if (this.type === 1) {
            //     this.createdBy = this.$route.query.createdBy;
            // }
            // if (this.type === 2) {
            //     this.getPicture();

            // }
            this.getPicture();
            this.task_id = this.$route.query.task_id;
            this.getJsonData();
            // console.log("dasddas"+this.task_id )
        }
    };
</script>

<style lang="scss" scoped>
    .write_form {
        height: 100%;
        width: 100%;
        /*overflow-x: hidden;*/
        /*overflow-y: auto;*/
        padding: 20px;
        background: white;
        margin-top: 4px;

        .top {
            display: flex;
            flex-direction: row;
            margin-left: 2.5rem;
            padding: 1rem;

            &_title {
                font-size: 2rem;
                font-weight: bold;
                line-height: 50px;
                color: rgba(51, 51, 51, 1);
            }
        }

        .firstBody {
            width: 100%;
            overflow-x: hidden;
            padding: 0px 1%;
            background: white;
        }

        &_title {
            width: 100%;
            /*height: 4rem;*/
            text-align: center;
        }

        &_operation {
            width: 100%;
            text-align: right;
        }

        &_firstContent {
            width: 100%;
            padding: 0.5rem 196px 20px;

            &_subtitle {
                display: flex;
                align-items: center;
                height: 22px;
                font-size: 16px;
                font-family: LucidaGrande;
                color: rgba(48, 49, 51, 1);
                line-height: 18px;
            }

            &_main {
                padding: 1rem;
            }

            &_button {
                display: inline-block;
                width: 50%;
                min-width: 560px;
                /*height: 4rem;*/
                text-align: center;
            }
        }

        &_secondBody {
            margin-top: 1.5rem;
            max-height: 50%;
            width: 100%;
            overflow-x: hidden;
            overflow-y: auto;
            padding: 3%;
            background: white;

            &_subtitle {
                font-size: 1.5rem;
                font-weight: bold;
                color: #0b3ed3;
            }

            &_main {
                padding: 1rem;
                width: 100%;
            }

            &_button {
                width: 100%;
                height: 4rem;
                text-align: center;
            }
        }

        .flowProgress {
            width: 100%;
            /*padding: 3%;*/
            background: white;
        }
    }


    .diy-tab {
        border-bottom: 3px solid rgba(21, 74, 216, 1);
        display: flex;
        justify-content: flex-start;

        &__item {
            width: 10%;
            min-width: 80px;
            max-width: 120px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            border-radius: 4px 4px 0px 0px;
            cursor: pointer;

            &--is-active {
                background: rgba(21, 74, 216, 1);
                color: rgba(255, 255, 255, 1);
            }

            &--is-noactive {
                color: rgba(153, 153, 153, 1);
            }
        }
    }

    .auth-title{
        width:122px;
        height:20px;
        font-size:20px;
        font-weight:600;
        line-height:25px;
        color:rgba(48,49,51,1);
        opacity:1;
    }

</style>
