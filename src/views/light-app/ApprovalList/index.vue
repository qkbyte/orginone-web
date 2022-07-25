<template>
    <div style="width: 100%;height: 100%">
        <div style="height: 100%;">
            <div class="formList">
                <!--                <div class="formList_header">-->
                <!--                    <div style="width: 70%;display: flex;align-items: center;">-->
                <!--                        <span style="width:96px;height:22px;font-size:16px;font-family:PingFangSC-Semibold,PingFang SC;font-weight:600;color:rgba(48,49,51,1);line-height:22px;">审批业务列表</span>-->
                <!--                    </div>-->
                <!--                    <div style="width: 25%;display: flex;flex-direction: row;justify-content: space-between">-->
                <!--                        <el-button type="text" @click="handleDelte"><span style="color: #F76C6F">删除</span></el-button>-->
                <!--                        <el-button type="text" @click="handleGroup"><span style="color: #154AD8">编辑分组</span></el-button>-->
                <!--                        <el-button type="primary" icon="el-icon-plus" @click="addForm">新增</el-button>-->
                <!--                    </div>-->
                <!--                </div>-->
                <!--                <div style="margin-top: 1rem">-->
                <!--                    <el-table-->
                <!--                            ref="multipleTable"-->
                <!--                            :data="formListTableData"-->
                <!--                            style="width: 100%"-->
                <!--                            :header-cell-style="getRowClass"-->
                <!--                            @filter-change="filterChange"-->
                <!--                            @select="getFormList"-->
                <!--                    >-->
                <!--                        <el-table-column-->
                <!--                                type="selection"-->
                <!--                                width="55"-->
                <!--                                :selectable="selectable"-->
                <!--                        >-->
                <!--                        </el-table-column>-->
                <!--                        <el-table-column-->
                <!--                                type="index"-->
                <!--                                label="序号"-->
                <!--                                width="180">-->
                <!--                        </el-table-column>-->
                <!--                        <el-table-column-->
                <!--                                prop="formName"-->
                <!--                                label="业务名称"-->
                <!--                                width="180"-->
                <!--                        >-->
                <!--                            <template slot-scope="scope">-->
                <!--                                <el-button @click="showItem(scope.row.id)" type="text"-->
                <!--                                           v-loading.fullscreen.lock="fullscreenLoading">{{scope.row.formName}}-->
                <!--                                </el-button>-->
                <!--                            </template>-->
                <!--                        </el-table-column>-->
                <!--                        <el-table-column-->
                <!--                                prop="status"-->
                <!--                                label="状态"-->
                <!--                                width="180">-->
                <!--                            <template slot-scope="scope">-->
                <!--                                <div @click="handleChangeStatus(scope.row)" style="cursor: pointer">-->
                <!--                                    <div v-if="scope.row.status===1">-->
                <!--                                        <div style="text-align:center;background-color: #e0f2d8;width: 6rem;border-radius:10px;display: flex;align-items: center;">-->
                <!--                                            <div style=" margin-left: 0.5rem;width: 0.5rem;height: 0.5rem;background-color: #67C23A;border-radius: 0.5rem;"></div>-->
                <!--                                            <span style="margin-left:0.5rem;color: #303133">启用中</span>-->
                <!--                                        </div>-->

                <!--                                    </div>-->
                <!--                                    <div v-else>-->
                <!--                                        <div style="text-align:center;background-color: #f3f5f9;width: 6rem;border-radius:10px;display: flex;align-items: center;">-->
                <!--                                            <div style=" margin-left: 0.5rem;width: 0.5rem;height: 0.5rem;background-color: #C0C4CC;border-radius: 0.5rem;"></div>-->
                <!--                                            <span style="margin-left:0.5rem;color: #303133">已停止</span>-->
                <!--                                        </div>-->
                <!--                                    </div>-->
                <!--                                </div>-->

                <!--                            </template>-->
                <!--                        </el-table-column>-->
                <!--                        <el-table-column-->
                <!--                                prop="categoryName"-->
                <!--                                label="分组"-->
                <!--                                width="180"-->
                <!--                                :filters=tabItems-->
                <!--                                filter-placement="bottom-end"-->
                <!--                                :filter-multiple="false"-->
                <!--                        >-->
                <!--                        </el-table-column>-->
                <!--                        <el-table-column-->
                <!--                                prop="authority"-->
                <!--                                label="权限">-->
                <!--                            <template slot-scope="scope">-->
                <!--                                <el-button :disabled="scope.row.status===1" type="text" @click="handleAuth(scope.row)">-->
                <!--                                    设置-->
                <!--                                </el-button>-->
                <!--                            </template>-->
                <!--                        </el-table-column>-->
                <!--                        <el-table-column-->
                <!--                                prop="description"-->
                <!--                                label="描述">-->
                <!--                        </el-table-column>-->
                <!--                        <el-table-column-->
                <!--                                prop="createdTime"-->
                <!--                                label="创建时间">-->
                <!--                        </el-table-column>-->

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
                <!--                    </el-table>-->


                <!--                </div>-->
                <DiyTable
                        ref="table"
                        :tableHead="tableHead"
                        :options="options"
                        :batchOperate="batchOperate"
                        :tableData="formListTableData"
                        @handleUpdate="loadlistData"
                >
                    <template v-slot:slot-title>

                        <span style="width:96px;height:22px;font-size:16px;font-family:PingFangSC-Semibold,PingFang SC;font-weight:600;color:rgba(48,49,51,1);line-height:22px;">审批业务列表</span>

                    </template>
                    <template v-slot:buttons>
                        <el-button type="text" @click="handleDelte"><span style="color: #F76C6F">删除</span></el-button>

                        <el-button type="text" @click="handleGroup"><span style="color: #154AD8">编辑分组</span></el-button>
                        <el-button type="primary" icon="el-icon-plus" @click="addForm">新增</el-button>
                    </template>

                    <template v-slot:formName="scope">
                        <el-button @click="showItem(scope.row.id)" type="text"
                                   v-loading.fullscreen.lock="fullscreenLoading">{{scope.row.formName}}
                        </el-button>
                    </template>

                    <template v-slot:status="scope">
                            <div @click="handleChangeStatus(scope.row)" style="cursor: pointer">
                                <div v-if="scope.row.status===1">
                                    <div style="text-align:center;background-color: #e0f2d8;width: 6rem;border-radius:10px;display: flex;align-items: center;">
                                        <div style=" margin-left: 0.5rem;width: 0.5rem;height: 0.5rem;background-color: #67C23A;border-radius: 0.5rem;"></div>
                                        <span style="margin-left:0.5rem;color: #303133">启用中</span>
                                    </div>

                                </div>
                                <div v-else>
                                    <div style="text-align:center;background-color: #f3f5f9;width: 6rem;border-radius:10px;display: flex;align-items: center;">
                                        <div style=" margin-left: 0.5rem;width: 0.5rem;height: 0.5rem;background-color: #C0C4CC;border-radius: 0.5rem;"></div>
                                        <span style="margin-left:0.5rem;color: #303133">已停止</span>
                                    </div>
                                </div>
                            </div>
                    </template>

                    <template v-slot:authority="scope">
                        <el-button :disabled="scope.row.status===1" type="text" @click="handleAuth(scope.row)">
                            设置
                        </el-button>
                    </template>

                    <template v-slot:operate="scope">
                        <ApprovalListTableButton
                                :theId="scope.row.id"
                                :row="scope.row"
                                @handleGroupByButton="handleGroupByButton(scope)"
                                @handleDelteFormByButton="handleDelteFormByButton(scope)"
                                @handleChangeStatus="handleChangeStatus(scope.row)"
                        ></ApprovalListTableButton>
                    </template>
                    <template v-slot:icon="scope">
                        <svg class="icon" aria-hidden="true">
                            <use :xlink:href="'#' + scope.row.source"></use>
                        </svg>
                    </template>
                </DiyTable>


<!--                <div>-->
<!--                    <div class="formList__footer">-->
<!--                        <div class="footer-buttons">-->
<!--                            &lt;!&ndash;                    <div class="footer-operate">&ndash;&gt;-->
<!--                            &lt;!&ndash;                        <el-dropdown trigger="click">&ndash;&gt;-->
<!--                            &lt;!&ndash;                                <span class="el-dropdown-link">&ndash;&gt;-->
<!--                            &lt;!&ndash;                                  批量操作<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>&ndash;&gt;-->
<!--                            &lt;!&ndash;                                </span>&ndash;&gt;-->
<!--                            &lt;!&ndash;                            <el-dropdown-menu slot="dropdown">&ndash;&gt;-->
<!--                            &lt;!&ndash;                                <el-dropdown-item&ndash;&gt;-->
<!--                            &lt;!&ndash;                                        v-for="item in batchOperate"&ndash;&gt;-->
<!--                            &lt;!&ndash;                                        :command="item.key"&ndash;&gt;-->
<!--                            &lt;!&ndash;                                        :key="item.key"&ndash;&gt;-->
<!--                            &lt;!&ndash;                                >&ndash;&gt;-->
<!--                            &lt;!&ndash;                                    <div @click="handleDelte">&ndash;&gt;-->
<!--                            &lt;!&ndash;                                        {{ item.label }}&ndash;&gt;-->
<!--                            &lt;!&ndash;                                    </div>&ndash;&gt;-->
<!--                            &lt;!&ndash;                                </el-dropdown-item>&ndash;&gt;-->
<!--                            &lt;!&ndash;                            </el-dropdown-menu>&ndash;&gt;-->
<!--                            &lt;!&ndash;                        </el-dropdown>&ndash;&gt;-->
<!--                            &lt;!&ndash;                    </div>&ndash;&gt;-->

<!--                            <img src="../../../assets/approval/others/app_list1.png" height="20" width="32"/></div>-->
<!--                        <div class="footer-pagination">-->
<!--                            <el-pagination-->
<!--                                    background-->
<!--                                    @size-change="handleSizeChange"-->
<!--                                    @current-change="handleCurrentChange"-->
<!--                                    v-bind="page"-->
<!--                                    :pager-count="5"-->
<!--                                    style="text-align:right;margin-top:10px;color: #154AD8"-->
<!--                            ></el-pagination>-->
<!--                        </div>-->
<!--                    </div>-->

<!--                </div>-->

                <template v-for="item in dialogShow">
                    <ApprovalAddDialog
                            v-if="item.key === 'add' && item.value"
                            :key="item.key"
                            :dialogShow="item"
                            @closeDialog="handleCloseDialog"
                    ></ApprovalAddDialog>
                    <ApprovalAuthDialog
                            v-if="item.key === 'auth' && item.value"
                            :key="item.key"
                            :dialogShow="item"
                            :value="authInfo.index"
                            @closeDialog="handleCloseDialog"
                            @saveInfo="handleSave"
                    ></ApprovalAuthDialog>

                    <editGroup
                            v-if="item.key === 'group' && item.value"
                            :key="item.key"
                            :dialogShow="item"
                            :chooseFormList="chooseFormList"
                            @closeDialog="handleCloseDialog"
                            @updataInfo="loadlistData"
                            :isTemplate="0"
                    >

                    </editGroup>


                </template>


            </div>

        </div>
    </div>
</template>

<script>
    import ApprovalListTableButton from "../components/ApprovalListTableButton"
    import ApprovalAddDialog from "../components/ApprovalAddDialog"
    import ApprovalAuthDialog from "../components/ApprovalAuthDialog"
    import editGroup from "../components/editGroup"
    import {getFormInfoWithGroup, getTemplateGroup, getItemInfo, getAuthList, setFormAuthList} from "@api/flow"
    import {deleteFromByCategoryId} from "@api/flow-message"
    import DiyTitle from "@components/DiyTitle/index";
    import DiyTable from "@components/DiyTable/index";
    import DiyButton from "@components//DiyButton/index";
    import {mapGetters, mapState} from "vuex";

    export default {
        data() {
            let _this = this;
            return {
                dialogShow: [
                    {
                        key: "add",
                        value: false,
                    },
                    {
                        key: "auth",
                        value: false,
                    },
                    {
                        key: "group",
                        value: false,
                    },


                ],
                formListTableData: [{
                    index: '1',
                    name: '王小五的表单',
                    status: "1",
                    type: '财务',
                    authority: '操作',
                    originator: '张三',
                    FoundingTime: '03-18',
                }, {
                    index: '2',
                    name: '请假申请',
                    status: "2",
                    type: '未选择',
                    authority: '操作',
                    originator: '未完成',
                    FoundingTime: '未完成',
                }],
                page: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页
                    pageSize: 10, // 每页条数
                    pageSizes: [10, 20, 50, 70, 100], // 分页数量列表
                    layout: " prev, pager, next, sizes"
                    // layout: "total, prev, pager, next, sizes"
                },
                batchOperate: [],
                tabItems: [],
                fullscreenLoading: false,
                groupId: '',
                chooseFormList: [],
                authInfo: {
                    id: [],
                    name: [],
                    index: []
                },
                row: {},
                tableHead: [
                    {
                        prop: "formName",
                        name:'formName',
                        type:'slot',
                        label: "业务名称",
                        'min-width': "140",
                    },
                    {
                        prop: "status",
                        label: "状态",
                        name:'status',
                        type:'slot',
                        'min-width': "140",
                    },
                    {
                        prop: "categoryName",
                        label: "分组",
                        'min-width': "150",
                    },
                    {
                        prop: "authority",
                        label: "权限",
                        name:'authority',
                        type:'slot',
                        'min-width': "150",
                    },
                    {
                        prop: "description",
                        label: "描述",
                        'min-width': "300",
                    },
                    {
                        prop: "createdTime",
                        label: "创建时间",
                        'min-width': "150",
                    },

                    {
                        type: "slot",
                        label: "操作",
                        fixed: "right",
                        align: "center",
                        width: "80",
                        minWidth: "80",
                        name: "operate",
                    },
                ],
                options: {
                    checkBox: true,
                    order: true,
                    treeProps: {
                        children: "children",
                        hasChildren: "hasChildren",
                    },
                    noPage: false,
                    page: {
                        total: 0, // 总条数
                        currentPage: 1, // 当前页
                        pageSize: 10, // 每页条数
                        pageSizes: [10, 20, 50, 70, 100], // 分页数量列表
                        layout: "total,  prev, pager, next, sizes"
                        // layout: "total, prev, pager, next, sizes"
                    },
                },

            }
        },
        mounted() {
            this.loadlistData()
        },
        computed: {
            ...mapGetters("tenant", ["curTenantCode"]),
        },
        methods: {
            loadlistData() {
                this.$refs.table.loading = false;
                this.getGroup()
            },
            getGroup() {
                this.fullscreenLoading = true;
                let params = {
                    tenantCode: this.curTenantCode
                };
                getTemplateGroup(params).then(res => {
                    this.tabItems = [];
                    this.getInfo();
                    res.data.data.forEach((item, index) => {
                        let temp = {
                            value: item.id,
                            text: item.name,
                        };
                        this.tabItems.push(temp)
                    })
                })
            },
            getInfo() {
                this.fullscreenLoading = true;
                let params = {
                    tenantCode: this.curTenantCode,
                    categoryId: this.groupId,
                    current: this.$refs.table.page.currentPage,
                    size: this.$refs.table.page.pageSize,
                    formName: ''
                };
                getFormInfoWithGroup(params).then(res => {
                    this.fullscreenLoading = false;
                    this.formListTableData = res.data.data.records;
                    this.$refs.table.page.total  = res.data.data.total;
                })
            },
            getRowClass({row, column, rowIndex, columnIndex}) {
                if (rowIndex === 0) {
                    return "background:rgba(236,239,253,1);color:#333333;font-weight:bold";
                } else {
                    return "";
                }
            },
            showItem(id) {
                this.$router.push({name: "approvalItem", params: {formId: id}});
            },
            filterChange(filters) {
                this.groupId = '';
                for (let item in filters) {
                    if (filters[item].length > 0)
                        this.groupId = filters[item][0];
                }

                this.getInfo();
            },
            getFormList(selection, row) {
                this.chooseFormList = selection;
            },

            selectable(row, index) {
                return row.status != 1 // isHidden 0-否 1-是 返回false不可选
            },


            addForm() {
                this.dialogShow.map((el) => {
                    if (el.key === "add") {
                        el.value = true;
                    }
                }, this);
            },
            handleAuth(row) {

                let params = {
                    id: row.id,
                    isTemplate: 0,
                    tenantId: this.curTenantCode
                };
                this.fullscreenLoading = true;
                getItemInfo(params).then(res => {
                    this.itemInfo = res.data.data;
                    let data = res.data.data;

                    this.authInfo.id = [];
                    this.authInfo.name = [];
                    this.authInfo.index = [];

                    this.authInfo.id = data.userIds;

                    this.isStart = data.status;

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
                        this.dialogShow.map((el) => {
                            if (el.key === "auth") {
                                el.value = true;
                            }
                        }, this);
                    });


                })

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

            handleGroup() {
                if (this.$refs.table.$refs.diyTable.selection.length != 1) {
                    this.$message.warning("请选择其中一项");
                    return;
                }
                this.chooseFormList =  this.$refs.table.$refs.diyTable.selection;


                this.dialogShow.map((el) => {
                    if (el.key === "group") {
                        el.value = true;
                    }
                }, this);
            },

            handleDelte() {
                if (this.$refs.table.$refs.diyTable.selection.length < 1) {
                    this.$message.warning("请选择至少其中一项");
                    return;
                }

                let formModelIds = [];

                this.$refs.table.$refs.diyTable.selection.forEach(item => {

                    formModelIds.push(item.id)
                });

                console.log(formModelIds);

                let params = {
                    flag: 104,
                    formModelIds: formModelIds.join(",")
                };
                this.fullscreenLoading = true;
                deleteFromByCategoryId(params).then(res => {
                    this.fullscreenLoading = false;
                    if (res.data.code === 200) {
                        this.$message.success("删除成功！");
                        this.loadlistData()
                    }
                })


            },

            handleChangeStatus(row) {

                let flag = row.status === 1 ? 103 : 102;

                let params = {
                    flag: flag,
                    formModelIds: row.id
                };

                console.log(JSON.stringify(params))
                this.fullscreenLoading = true;
                deleteFromByCategoryId(params).then(res => {
                    this.fullscreenLoading = false;
                    if (res.data.code === 200) {
                        this.$message.success("操作成功！");
                        this.loadlistData()
                    }
                })
            },

            handleGroupByButton(rows) {
                this.chooseFormList = [rows.row];
                this.dialogShow.map((el) => {
                    if (el.key === "group") {
                        el.value = true;
                    }
                }, this);
            },

            handleDelteFormByButton(rows) {
                let params = {
                    flag: 104,
                    formModelIds: rows.row.id
                };
                this.fullscreenLoading = true;
                deleteFromByCategoryId(params).then(res => {
                    this.fullscreenLoading = false;
                    if (res.data.code === 200) {
                        this.$message.success("删除成功！")
                        this.loadlistData()
                    }
                })
            },


            handleSizeChange(val) {
                this.page.pageSize = val;
                this.page.currentPage = 1;
                this.getInfo()
            },
            handleCurrentChange(val) {
                this.page.currentPage = val;
                this.getInfo()

            },

            handleCloseDialog() {
                this.dialogShow.map((el) => {
                    if (el.key === 'auth') {
                        el.value = false;
                    }
                }, this);

            },

        },
        components: {
            ApprovalListTableButton,
            ApprovalAddDialog,
            ApprovalAuthDialog,
            editGroup,
            DiyTitle,
            DiyTable,
            DiyButton
        },
    }
</script>

<style lang="scss" scoped>
    .formList {
        margin-top: 4px;
        width: 100%;
        padding: 0 20px 20px 20px;
        height: 100%;
        background: #fff;
        color: #333;

        &_header {
            /*margin-top: 10px;*/
            display: flex;
            flex-direction: row;
            justify-content: space-between;

        }

        &__footer {
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
    }

</style>