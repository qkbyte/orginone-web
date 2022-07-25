<template>
    <div style="height: 100%;width: 100%">
        <div class="approvalItem">

            <div class="info"
                 v-loading.fullscreen.lock="fullscreenLoading"
            >

                <div class="info__top">
                    <div style="color: #303133;font-size: 1.2rem;font-weight: bold;display: flex;align-items: center">
                        自建审批信息
                    </div>
                    <div style="width: 30%;display: flex;justify-content: space-between;">
                        <div style="width: 20%;height: 100%">
                            <el-popover
                                    placement="bottom"
                                    width="150"
                                    trigger="hover"
                                    :disabled="isStart===1"
                            >
                                <div class="diy-button" @click="handleEdit">编辑</div>
                                <!--                            <div class="diy-button">重命名</div>-->
                                <!--                            <div class="diy-button">更换分组</div>-->
                                <div class="diy-button" style="color: #F76C6F" @click="handleDelete">删除</div>
                                <div slot="reference"
                                     style="height:100%;width: 100%;display: flex;flex-direction: row; justify-content: center;align-items: center;">
                                    <div style="height:65%;display: flex;flex-direction: column;justify-content: space-between">
                                        <div style="height: 3px;width: 3px;border-radius: 3px;background-color: #909399"></div>
                                        <div style="height: 3px;width: 3px;border-radius: 3px;background-color: #909399"></div>
                                        <div style="height: 3px;width: 3px;border-radius: 3px;background-color: #909399"></div>
                                    </div>
                                </div>
                            </el-popover>

                        </div>

                        <!--                    <div style="width: 25%;height: 100%;display: flex;align-items: center">-->
                        <!--                        <el-button type="text" :disabled="isStart!=1" @click="addApproval">新增该审批</el-button>-->
                        <!--                    </div>-->

                        <div style="width: 25%;height: 100%;display: flex;align-items: center">
                            <el-button type="text" :disabled="isStart===1" @click="handleEdit">编辑表单</el-button>
                        </div>

                        <div v-if="isStart===1" style="width: 25%;height: 100%">
                            <el-button style="color: red" @click="changeStatus">停用</el-button>
                        </div>


                        <div v-if="isStart!=1" style="width: 25%;height: 100%">
                            <el-button style="color: #154AD8" @click="changeStatus">启用</el-button>
                        </div>

                    </div>


                </div>

                <div class="info__name">
                    <div style="width: 28px;">
                        <img style="width: 100%;height: 100%;" src="@assets/store/app-icon-1.png"/>
                    </div>
                    <div style="display: flex;align-items: center;height: 100%;margin-left: 5px;font-weight: bold;">
                        自建审批名称
                    </div>
                </div>

                <div class="info__detail">
                    <div>
                        分组：{{itemInfo.categoryName}}
                    </div>
                    <div>
                        可发起人：
                        <div style="display: inline-block;color:blue">
                            <el-button :disabled="isStart===1" type="text" @click="handleAuth" size="small">查看
                            </el-button>
                        </div>
                    </div>
                    <div>
                        创建人：{{createUserName}}
                    </div>
                </div>
                <div class="info__description">
                    应用描述:{{itemInfo.description}}
                </div>

            </div>

            <div class="list">
                <div style="display: flex;justify-content: space-between;align-items: center">
                    <div style="color: #303133;font-size: 1.2rem;font-weight: bold;">审批信息</div>
                    <el-button type="text" style="font-size: 1rem;">查看</el-button>
                </div>

                <el-table
                        :data="instanceTableData"
                        style="width: 100%"
                        :header-cell-style="getRowClass"
                >
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            type="index"
                            label="序号"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="procInstName"
                            label="实例名称"
                            width="180"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            label="实例状态"
                            width="180">
                        <template slot-scope="scope">
                            <div v-if="scope.row.status===0">
                                <div style="text-align:center;background-color: #e0f2d8;width: 8rem;border-radius:10px;display: flex;align-items: center;">
                                    <div style=" margin-left: 0.5rem;width: 0.5rem;height: 0.5rem;background-color: #67C23A;border-radius: 0.5rem;"></div>
                                    <span style="margin-left:0.5rem;color: #303133">正在办理</span>
                                </div>

                            </div>
                            <div v-else>
                                <div style="text-align:center;background-color: #f3f5f9;width: 6rem;border-radius:10px;display: flex;align-items: center;">
                                    <div style=" margin-left: 0.5rem;width: 0.5rem;height: 0.5rem;background-color: #C0C4CC;border-radius: 0.5rem;"></div>
                                    <span style="margin-left:0.5rem;color: #303133">已办结</span>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="runningNode"
                            label="运行节点"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="sponsor"
                            label="发起人">
                    </el-table-column>
                    <el-table-column
                            prop="commitTime"
                            label="发起时间">
                    </el-table-column>

                    <el-table-column
                            label="操作"
                            align="center"
                    >
                        <template>
                            <ApprovalItemTableButton></ApprovalItemTableButton>
                        </template>

                    </el-table-column>
                </el-table>

                <div class="formList__footer">
                    <div class="footer-buttons">
                        <div class="footer-operate">
                            <el-dropdown trigger="click">
                                <span class="el-dropdown-link">
                                  批量操作<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item
                                            v-for="item in batchOperate"
                                            :command="item.key"
                                            :key="item.key"
                                    >{{ item.label }}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="footer-pagination">
                        <el-pagination
                                background
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                v-bind="page"
                                :pager-count="5"
                                style="text-align:right;margin-top:10px;"
                        ></el-pagination>
                    </div>
                </div>

                <ApprovalAuthDialog
                        v-if="isShowAuth.value"
                        :key="isShowAuth.key"
                        :dialogShow="isShowAuth"
                        :value="authInfo.index"
                        @closeDialog="handleCloseDialog"
                        @saveInfo="handleSave"
                ></ApprovalAuthDialog>

            </div>

        </div>
    </div>
</template>

<script>
    import ApprovalItemTableButton from "../components/ApprovalItemTableButton";
    import {getItemInfo, getInstanceInfo, getAuthList, setFormAuthList} from "@api/flow"
    import {mapState, mapGetters} from "vuex";
    import ApprovalAuthDialog from "../components/ApprovalAuthDialog";
    import {deleteFromByCategoryId} from "@api/flow-message"
    import DiyTitle from "@components/DiyTitle/index";

    export default {
        data() {
            return {
                instanceTableData: [
                    {
                        index: '1',
                        name: '我的工作流程',
                        status: "1",
                        runningNode: '辅导员',
                        sponsor: 'pzk',
                        FoundingTime: '03-18',
                    }, {
                        index: '2',
                        name: '我的工作流程',
                        status: "2",
                        runningNode: '保卫处',
                        sponsor: 'pzk',
                        FoundingTime: '04-18',
                    }, {
                        index: '3',
                        name: '我的工作流程',
                        status: "2",
                        runningNode: '保卫处',
                        sponsor: 'pzk',
                        FoundingTime: '05-18',
                    }],
                page: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页
                    pageSize: 10, // 每页条数
                    pageSizes: [10, 20, 50, 70, 100], // 分页数量列表
                    layout: "total, prev, pager, next, sizes"
                },
                batchOperate: [
                    {
                        value: "选项1",
                        label: "删除"
                    }
                ],
                isStart: 0,
                formId: '',
                itemInfo: [],
                isShowAuth: {
                    value: false,
                    key: 'auth'
                },

                isShowGroup: {
                    value: false,
                    key: 'auth'
                },

                row: {},
                authInfo: {
                    id: [],
                    name: [],
                    index: []
                },
                fullscreenLoading: false,
                createUserName: '',
            }
        },

        computed: {
            ...mapState("user", ["userId"]),
            ...mapGetters("tenant", ["curTenantCode"]),
        },
        mounted() {
            if (this.$route.params.formId != undefined) {
                this.formId = this.$route.params.formId;
                this.getInfo();
                this.getInstance();
            } else {
                this.$router.push({name: "approvalList"});
            }

        },

        components: {
            ApprovalItemTableButton,
            ApprovalAuthDialog,
            DiyTitle,
        },

        methods: {
            getRowClass({row, column, rowIndex, columnIndex}) {
                if (rowIndex === 0) {
                    return "background:rgba(236,239,253,1);color:#333333;font-weight:bold";
                } else {
                    return "";
                }
            },

            handleEdit() {
                this.$router.push({name: "approvalDesign", params: {formId: this.formId}})
            },

            handleAuth() {
                this.isShowAuth.value = true;
            },

            handleDelete() {
                let params = {
                    flag: 104,
                    formModelIds: this.formId
                };
                this.fullscreenLoading = true;
                deleteFromByCategoryId(params).then(res => {
                    this.fullscreenLoading = false;
                    if (res.data.code === 200) {
                        this.$message.success("删除成功！")
                        this.$router.push({name: "approvalList"});
                    }
                })
            },
            handleCloseDialog() {
                this.isShowAuth.value = false;
                this.isShowGroup.value = false;

            },
            handleGroup() {
                this.isShowGroup.value = true;
            },


            handleSave(key) {
                this.authInfo = key;
                let list = this.authInfo.id;

                let params = {
                    userIds: list,
                    id: this.row.id
                };
                this.fullscreenLoading = true;
                setFormAuthList(params).then(res => {
                    this.fullscreenLoading = false;
                    if (res.data.code === 200) {
                        this.$message.success("设置成功！！");
                    } else
                        this.$message.error("设置失败！！");
                });

                console.log(JSON.stringify(list));
                this.handleCloseDialog();
            },


            getInfo() {

                let params = {
                    id: this.formId,
                    isTemplate: 0,
                    tenantId: this.curTenantCode
                };
                this.fullscreenLoading = true;

                getItemInfo(params).then(res => {
                    this.itemInfo = res.data.data;
                    let data = res.data.data;

                    this.authInfo.id = data.userIds;

                    this.createUserName = data.createUserName;

                    this.isStart = data.status;
                    this.fullscreenLoading = false;

                    this.row = data;
                    getAuthList('').then(res => {
                        this.fullscreenLoading = false;
                        res.data.data.forEach((item, index) => {
                            this.authInfo.id.forEach((it, idx) => {
                                it = it + '';
                                if (it === item.userId)
                                    this.authInfo.index.push(index)
                            })
                        })
                    });


                })
            },

            getInstance() {
                let params = {
                    form_model_id: this.formId,
                    current: this.page.currentPage,
                    size: this.page.pageSize,
                };
                this.fullscreenLoading = true;
                getInstanceInfo(params).then(res => {
                    this.fullscreenLoading = false;
                    this.instanceTableData = res.data.obj;
                })
            },
            handleSizeChange() {

            },
            handleCurrentChange() {

            },
            changeStatus() {
                let flag = this.row.status === 1 ? 103 : 102;

                let params = {
                    flag: flag,
                    formModelIds: this.row.id
                };

                console.log(JSON.stringify(params));
                this.fullscreenLoading = true;
                deleteFromByCategoryId(params).then(res => {
                    this.fullscreenLoading = false;
                    if (res.data.code === 200) {
                        this.$message.success("操作成功！");
                        this.getInfo()
                    }
                })
            },
            addApproval() {
                this.$router.push({name: "approvalIssue", params: {formId: this.formId}});
            }
        }
    }
</script>

<style lang="scss" scoped>
    .approvalItem {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        margin-top: 1rem;
    }

    .info {
        background-color: white;
        width: 100%;
        height: 200px;
        padding: 2%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        &__top {
            width: 100%;
            height: 20%;
            display: flex;
            justify-content: space-between;
        }

        &__name {
            width: 100%;
            height: 28px;
            margin-top: 0.5rem;
            display: flex;
            justify-content: flex-start;
        }

        &__detail {
            margin-top: 2%;
            margin-left: 2rem;
            width: 45%;
            display: flex;
            justify-content: space-between;
        }

        &__description {
            margin-left: 2rem;

        }
    }

    .list {
        margin-top: 1rem;
        background-color: white;
        width: 100%;
        padding: 2%;
    }

    .formList__footer {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .footer-operate {
            width: 110px;
            height: 40px;
            border: 1px solid rgba(209, 223, 245, 1);
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;

            .el-dropdown {
                width: 100%;
                height: 100%;
            }

            .el-dropdown-link {
                width: 100%;
                height: 100%;
                display: block;
                text-align: center;
                height: 38px;
                line-height: 38px;
                font-size: 14px;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
            }
        }

        .footer-buttons {
            width: 350px;
            display: flex;
            justify-content: space-between;

            .select-options {
                width: 150px;
            }
        }
    }


</style>