<template>
    <el-dialog
            center
            top="8vh"
            width="600px"
            class="diy-dialog"
            :visible.sync="dialogShow.value"
            :close-on-click-modal="false"

    >
        <div slot="title" style="text-align: left;">
            <span  class="auth-title">
            {{headName}}
             </span>
        </div>

        <!--        <div style="display: flex;align-items: center;flex-direction: column;">-->
        <!--            <el-transfer-->
        <!--                    v-model="temp_value"-->
        <!--                    :data="data"-->
        <!--                    :titles="['可选', '已选']"-->
        <!--            ></el-transfer>-->
        <!--        </div>-->

        <div class="diy-dialog-body">
            <template >
                <div class="diy-dialog-body--left">
                    <searchDiy
                            ref="list"
                            :listData="value"
                            :selectList="selectList"
                            @handleSelection="handleSelection"
                            :title="'agencyName'"
                            :type="0"
                    ></searchDiy>
                </div>
                <div class="diy-dialog-body--right">
                    <div class="diy-dialog-body__title">
                        已选择 {{ selectList.length }} 个用户
                    </div>
                    <div class="diy-dialog-body__list">
                        <ul>
                            <li v-for="item in selectList" :key="item.key">
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
      <el-button type="primary" @click="handleSave">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
    </el-dialog>
</template>

<script>
    import {get} from "@api/flow"
    import searchDiy from "./DiySearchList/TheSearchList"
    import DiyTabs from "../components/DiyTabs/index";

    export default {
        name: "ApprovalAuthDialog",
        data() {

            return {
                // data: generateData(),
                // data: [],
                // info: [],
                // temp_value: [],
                selectList:[]
            };
        },
        computed: {},
        components: {
            searchDiy,
            DiyTabs
        },
        mounted() {
            // this.temp_value = this.value;
            // console.log(this.hasList+'ds');
            // if (this.hasList){
            //     this.selectList=this.hasList;
            //     console.log(this.selectList)
            // }
        },
        props: {
            dialogShow: {
                type: Object,
                default: () => {
                }
            },
            value: {
                type: Array,
                default: () => []
            },
            headName:{
                type:String,
                default: () => ''
            },
            hasList: {
                type: Array,
                default: () => []
            },
        },
        methods: {
            handleSave() {
                // let ret = {
                //     id: [],
                //     name: [],
                //     index: []
                // };
                //
                //
                //
                // this.selectList.forEach((item) => {
                //     ret.id.push(this.info[item.id].userId)
                //     ret.name.push(this.info[item.id].realName)
                //     ret.index.push(item.id)
                // })
                this.$emit("saveInfo", this.selectList);
                // console.log(this.selectList)

            },
            handleClose() {
                // console.log(JSON.stringify(this.data) + "das");
                // console.log(JSON.stringify(this.temp_value) + "das");
                this.$emit("closeDialog");
            },

            handleSelection(val) {
                this.selectList = val;
                console.log(this.selectList);
            },
            handleRemove(val) {
                this.$refs.list.$refs.tree.setChecked(val.id, false);
            },
            handleRemoveid(val) {
                // console.log(val);

                this.$refs.list.$refs.tree.setChecked(val.id, false);
                // console.log(JSON.stringify(this.temp_value));
                // console.log(JSON.stringify(this.selectList));
            },
        }
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

    .auth-title{
        width:122px;
        height:20px;
        font-size:20px;
        font-weight:600;
        line-height:25px;
        color:rgba(48,49,51,1);
        opacity:1;
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
        margin-top: 4px;

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