<template>
    <div class="history">
<!--        <DiyTitle></DiyTitle>-->
        <div class="contentBody">
            <!--            :tableName="tableName"-->
            <DiyTable
                    ref="table"
                    :tableHead="tableHead"
                    :options="options"
                    :batchOperate="batchOperate"
                    :tableData="tableData"
                    @handleUpdate="loadlistData"
            >
                <template v-slot:slot-title>

                    <div class="type">
                        <div
                                v-for="item in tabItems"
                                :key="item.id"
                                style="position: relative;"
                        >
                            <div
                                    class="type__item"
                                    :class="
                                item.isCur
                                ? 'type__item--is-active'
                                : 'type__item--is-noactive'
                                "
                                    @click="changeTab(item)"
                            >
                                {{ item.name }}
                            </div>
                        </div>
                    </div>

                </template>
                <template v-slot:buttons>
                    <!--                    <el-button>使用</el-button>-->
                    <!--                    <el-button >新增</el-button>-->
                    <!--                    <el-button style="color: #F76C6F;">删除</el-button>-->
                </template>
                <template v-slot:operate="scope">
                    <DiyButton>
                        <template v-slot:opt>
                            <div v-if="type==0" class="diy-button" @click="goApprovalIssue(scope.row.id)">使用</div>
                            <div v-if="type!=0" class="diy-button" @click="goApprovalComplete(scope.row.id)">使用</div>
                            <!--                            <div class="diy-button" >新增</div>-->
                            <div  v-if="type==0" class="diy-button" style="color: #F76C6F" @click="deleteById(scope.row.id)">删除</div>
                        </template>
                    </DiyButton>
                </template>
                <template v-slot:icon="scope">
                    <svg class="icon" aria-hidden="true">
                        <use :xlink:href="'#' + scope.row.source"></use>
                    </svg>
                </template>
            </DiyTable>
        </div>
    </div>
</template>

<script>
    import DiyTitle from "@components/DiyTitle/index";
    import DiyTable from "@components/DiyTable/index";
    import DiyButton from "@components//DiyButton/index";
    import {
        get,
        post,
        deleteHelper
    } from "@api/flow";
    import {mapGetters, mapState} from "vuex";

    export default {
        data() {
            let _this = this;
            return {
                tabItems: [{
                    id: "0",
                    name: "草稿",
                    isCur: true,
                }, {
                    id: "1",
                    name: "已提交",
                    isCur: false,
                }, {
                    id: "2",
                    name: "已完成",
                    isCur: false,
                },
                    {
                        id: "3",
                        name: "抄送",
                        isCur: false,
                    }
                ],
                tableName: "",
                tableData: [{
                    name: 'dasdas',
                    type: 'dasdsa',
                    remarks: 'dasdsa'
                }],
                tableHead: [
                    {
                        prop: "id",
                        label: "单据编号",
                        'min-width': "250",
                    },
                    {
                        prop: "remark",
                        label: "内容摘要",
                        'min-width': "300",
                    },
                    {
                        prop: "app",
                        label: "所属应用",
                        'min-width': "150",
                    },
                    {
                        prop: "type",
                        label: "应用类型",
                        'min-width': "150",
                    },
                    {
                        prop: "userName",
                        label: "发起人",
                        'min-width': "100",
                    },
                    {
                        prop: "bm",
                        label: "发起部门",
                        'min-width': "100",
                    },
                    {
                        prop: "time",
                        label: "保存时间",
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
                        layout: " prev, pager, next, sizes"
                    }
                },
                tableButton: [
                    {
                        key: "edit",
                        type: "text",
                        icon: "el-icon-edit",
                        value: "编辑",
                        func: function (index, row) {
                            _this.handleEdit(index, row);
                        },
                    },
                    {
                        type: "text",
                        icon: "el-icon-delete",
                        value: "删除",
                        func: function (index, row) {
                            _this.handleDelete(index, row);
                        },
                    },
                ],
                batchOperate: [],
                type:0,
            }
        },
        components: {
            DiyTitle,
            DiyTable,
            DiyButton
        },
        computed: {
            ...mapState("user", ["userId"]),
            ...mapGetters("tenant", ["curTenantCode"]),

        },
        mounted() {
            // this.$refs.table.loading = false;
            this.$nextTick(() => {
                this.loadlistData();
            });
        },
        methods: {
            loadlistData() {
                this.$refs.table.loading = true;

               let params={
                   userId:this.userId,
                   type:this.type
               };
                get("/dev-bmp/form_inst/draftList", params).then(res => {
                    this.$refs.table.loading = false;
                    this.tableData = res.data.obj;
                }).catch(err => {
                    // this.fullscreenLoading = false;
                    this.$message.error({
                        message: "保存失败",
                        duration: 700
                    });
                });
            },
            handleEdit(index, row) {

            },
            handleDelete(index, row) {

            },
            goApprovalIssue(id) {
                // console.log(id)
                this.$router.push({name: "approvalIssue", params: {draftId: id}});
            },
            goApprovalComplete(id) {
                // console.log(id)
                this.$router.push({name: "approvalComplete", params: {id: id,type:this.type}});
            },
            deleteById(id) {
                this.$refs.table.loading = true;
                let params = {
                    draftId: id
                }
                deleteHelper('/dev-bmp/form_inst/deleteDraft', params).then(res => {
                    if (res.data.code == 200) {
                        this.$refs.table.loading = false;
                        this.$message.success({
                            message: "删除成功",
                            duration: 700
                        });
                        this.loadlistData();
                    }

                }).catch(err => {
                    // this.fullscreenLoading = false;
                    this.$message.error({
                        message: "保存失败",
                        duration: 700
                    });
                });
            },
            changeTab: function (obj) {

                this.type=parseInt(obj.id);
                this.loadlistData();


                this.tabItems.forEach(function (item) {
                    if (item.id == obj.id) {
                        item.isCur = true;
                    } else {
                        item.isCur = false;
                    }
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    .history {
        width: 100%;
        height: 100%;
        overflow: auto;


    }

    .contentBody {
        width: 100%;
        height: calc(100vh - 110px);
        margin-top: 4px;
        padding: 0 20px;
        background-color: white;
    }

    .type {
        display: flex;
        flex-direction: row;
        /*justify-content: space-between;*/
        color: #606266;
        min-width: 420px;
        /*margin-left: 20px;*/
        overflow: auto;

        &__item {
            font-size: 16px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            border-radius: 4px 4px 0px 0px;
            cursor: pointer;
            margin-left: 20px;
            position: relative;

            &--is-active {
                font-size: 20px;
                font-weight: bold;
                color: #303133;
            }

            &--is-active:after {
                content: " ";
                width: 1.5rem;
                height: 0.2rem;
                background: #154ad8;
                position: absolute;
                bottom: 0.3rem;
                left: 50%;
                transform: translateX(-50%); //居中处理
            }

            &--is-noactive {
                color: #606266;
                font-weight: normal;
            }
        }
    }
</style>