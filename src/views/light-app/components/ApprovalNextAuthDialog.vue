<template>
    <div>
        <el-dialog
                v-loading="loading"
                element-loading-background="rgba(0, 0, 0, 0.7)"
                element-loading-text="加载中"
                center
                top="10vh"
                width="540px"
                :visible.sync="dialogShow.value"
                :modal-append-to-body="true"
                :close-on-click-modal="false"
        >

            <span slot="title" class="diy-dialog-title">
                 选择审批人员:
             </span>

            <div class="tabs">
                <div class="tabs__tit">请选择节点：</div>
                <DiyTabs
                        ref="typeItem"
                        :tabList="dialogShow.sendData.roleList"
                        :title="'roleName'"
                        :selectTab="dialogShow.sendData.roleId"
                        :curTab.sync="curTab"
                ></DiyTabs>
            </div>

            <div>
                请选择方式：
                <template>
                    <el-radio-group v-model="selectType">
                        <el-radio :label="0">按人员</el-radio>
                        <el-radio :label="1">按岗位</el-radio>
                        <el-radio :label="2">按部门</el-radio>
                    </el-radio-group>
                </template>
            </div>

            <div class="diy-dialog-body">
                <template v-if="selectType === 0">
                    <div class="diy-dialog-body--left">
                        <searchDiy
                                ref="list"
                                :listData="userIdLists[curTabIndex]"
                                @handleSelection="handleSelection"
                                :selectList="selectListIds"
                                :title="'realName'"
                                :type="0"
                        ></searchDiy>
                    </div>
                    <div class="diy-dialog-body--right">
                        <div class="diy-dialog-body__title">
                            已选择 {{ selectList.length }} 人
                        </div>
                        <div class="diy-dialog-body__list">
                            <ul>
                                <li v-for="item in selectList" :key="item.userId">
                                    <div>
                                        {{ item.label }}
                                    </div>
                                    <div @click="handleRemove(item)">
                                        <i class="el-icon-circle-close"></i>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </template>
                <template v-else-if="selectType === 1">
                    <div class="diy-dialog-body--left">
                        <searchDiy
                                ref="list"
                                :listData="jobIdLists[curTabIndex]"
                                @handleSelection="handleSelection"
                                :selectList="selectListIds"
                                :title="'jobName'"
                                :type="0"
                        ></searchDiy>
                    </div>
                    <div class="diy-dialog-body--right">
                        <div class="diy-dialog-body__title">
                            已选择 {{ selectList.length }} 个岗位
                        </div>
                        <div class="diy-dialog-body__list">
                            <ul>
                                <li v-for="item in selectList" :key="item.id">
                                    <div>
                                        {{ item.label }}
                                    </div>
                                    <div @click="handleRemoveid(item)">
                                        <i class="el-icon-circle-close"></i>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="diy-dialog-body--left">
                        <searchDiy
                                ref="list"
                                :listData="agencyIdLists[curTabIndex]"
                                :selectList="selectListIds"
                                @handleSelection="handleSelection"
                                :title="'agencyName'"
                                :type="0"
                        ></searchDiy>
                    </div>
                    <div class="diy-dialog-body--right">
                        <div class="diy-dialog-body__title">
                            已选择 {{ selectList.length }} 个部门
                        </div>
                        <div class="diy-dialog-body__list">
                            <ul>
                                <li v-for="item in selectList" :key="item.id">
                                    <div>
                                        {{ item.label }}
                                    </div>
                                    <div @click="handleRemoveid(item)">
                                        <i class="el-icon-circle-close"></i>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </template>
            </div>

            <span slot="footer" class="diy-dialog-footer">
<!--                 <el-button type="primary" @click="handleSave">确 定</el-button>-->
<!--                <el-button @click="handleClose">取 消</el-button>-->
                <slot name="theFooter"></slot>
              </span>
        </el-dialog>
    </div>
</template>

<script>
    import searchDiy from "./DiySearchList/TheSearchList"
    import DiyTabs from "../components/DiyTabs/index";

    export default {
        data() {
            let _this = this;
            return {
                curTab: this.dialogShow.sendData.roleId,
                curTabIndex: 0,
                allList: [], //所有用户
                selectList: [], //当前选择用户
                selectType: 0, //分配方式
                loading: false,
                allRetList: [],
                selectListIds: [],
            };
        },
        props: {
            dialogShow: {
                type: Object,
                default: () => {
                },
            },
            jobIdLists: {
                type: Array,
                default: () => {
                },
            },
            agencyIdLists: {
                type: Array,
                default: () => {
                },
            },
            userIdLists: {
                type: Array,
                default: () => {
                },
            },
        },
        mounted() {
            this.allRetList = [];
            this.dialogShow.sendData.roleList.forEach((item, idx) => {
                let temp = [];
                for (let i = 0; i < 3; i++) {
                    temp.push([]);
                }
                this.allRetList.push(temp);
            })
        },
        watch: {
            curTab: {
                handler(newValue, oldValue) {
                    let oldIndex = 0;
                    this.dialogShow.sendData.roleList.forEach((item, index) => {
                        if (item.id === newValue) {
                            this.curTabIndex = index;
                        }
                        if (item.id === oldValue) {
                            oldIndex = index;
                        }
                    });

                    this.allRetList[oldIndex][this.selectType] = this.selectList;
                    this.selectList = this.allRetList[this.curTabIndex][this.selectType];
                    this.selectListIds = [];
                    this.selectList.forEach(item => {
                        this.selectListIds.push(item.id);
                    })

                },
            },
            selectType: {
                handler(n, o) {

                    this.allRetList[this.curTabIndex][o] = this.selectList;
                    this.selectList = this.allRetList[this.curTabIndex][n];
                    this.selectList.forEach(item => {
                        this.selectListIds.push(item.id);
                    })

                },
            },
        },
        methods: {
            handleSave() {
                let returnList = [];
                if ( this.allRetList.length===0){
                    this.$emit("saveIt",returnList);
                    return;
                }
                this.allRetList[this.curTabIndex][this.selectType] = this.selectList;
                console.log(JSON.stringify(this.allRetList) + "dasdas");
                this.allRetList.forEach((item, index) => {
                    let temp = [];
                    item.forEach((the_item, idx) => {


                        let temp3 = [];
                        the_item.forEach(item => {
                            temp3.push(item.id);
                        });
                        if (temp.length === 0) {
                            temp = temp3;
                        } else
                            temp.concat(temp3);
                    });

                    let temp2 = {};
                    let the_result = [];
                    temp.map((item, index) => {
                        if (!temp2[item.id]) {
                            the_result.push(item);
                            temp[item.id] = true
                        }
                    });
                    returnList.push(the_result);

                });

                console.log(JSON.stringify(returnList) + "dasd123");

                this.$emit("saveIt",returnList);


            },
            handleClose() {
                // console.log(this.curTab+"2321");
                // console.log(this.curTabIndex+"8785");
                // console.log(this.selectType+"8543");
                // console.log(JSON.stringify(this.selectList)+"8543");
                // console.log(JSON.stringify(this.dialogShow.sendData.roleList)+"dsa");
                // console.log(JSON.stringify(this.allRetList)+"dasda")

                this.$emit("closeDialog", this.dialogShow.key);

            },

            handleSelection(val) {
                this.selectList = val;
            },
            handleRemove(val) {
                this.$refs.list.$refs.tree.setChecked(val.id, false);
            },
            handleRemoveid(val) {
                this.$refs.list.$refs.tree.setChecked(val.id, false);
            },
        },
        components: {
            searchDiy,
            DiyTabs
        },
    }
</script>

<style lang="scss" scoped>
    ::-webkit-scrollbar {
        width: 7px;
        height: 7px;
        background: #ffffff;
    }

    ::-webkit-scrollbar-thumb {
        height: 0px;
        border-radius: 4px;
        background: #e7e7e7b7;
    }

    .tabs {
        display: flex;
        align-items: center;
        width: 490px;

        &__tit {
            padding: 0 0 15px;
        }
    }

    .diy-dialog-body {
        border: 1px solid rgba(235, 238, 245, 1);
        border-radius: 4px;
        justify-content: flex-start;
        margin-top: 20px;

        &--left,
        &--right {
            width: 50%;
            height: 350px;
            padding: 16px;
        }

        &--left {
            border-right: 1px solid rgba(235, 238, 245, 1);
        }

        &__title {
            font-size: 14px;
            font-weight: 500;
            line-height: 40px;
            color: rgba(48, 49, 51, 1);
        }

        &__list {
            height: 250px;
            margin-top: 20px;
            overflow-y: scroll;

            li {
                height: 26px;
                line-height: 26px;
                display: flex;
                justify-content: space-between;

                i {
                    color: #c0c4cc;
                    cursor: pointer;

                    &:hover {
                        color: #9da1a8;
                    }
                }
            }
        }
    }
</style>