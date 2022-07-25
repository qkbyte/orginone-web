<template>
    <div>
        <div class="design">
            <div class="top">
                <div class="top__button">
                    <el-button v-if="active!=0"
                               style="margin: 0 auto;color: white;background-color: #154AD8;width: 74px;" type="text"
                               @click="back"
                               v-loading.fullscreen.lock="fullscreenLoading">
                        <!--                    <div  class="el-icon-back"></div>-->
                        上一步
                    </el-button>
                </div>
                <el-steps style="width: 60%" :active="active" finish-status="success" simple align-center>
                    <el-step title="基础信息"></el-step>
                    <el-step title="表单设计"></el-step>
                    <el-step title="流程设计"></el-step>
                </el-steps>
                <div class="top__button">
                    <el-button v-if="active!=2" style="margin: 0 auto" type="text" @click="saveIt">
                        保存
                    </el-button>

                    <el-button v-if="active==1" style="margin: 0 auto" type="text" @click="preview">
                        预览
                    </el-button>
                    <el-button v-if="active==1" style="margin: 0 auto" type="text" @click="simpleApproval">
                        简易审批
                    </el-button>
                    <el-button v-if="active!=2"
                               style="margin: 0 auto;color: white;background-color: #154AD8;width: 74px;" type="text"
                               @click="next">下一步
                        <!--                    <div class="el-icon-right"></div>-->
                    </el-button>


                    <!--                <el-button v-if="active==2" style="margin: 0 auto" type="text">发布-->
                    <!--                </el-button>-->

                </div>
            </div>

            <div class="body">
                <baseInfo v-if="active===0" :formId="formId" :templateId="templateId" ref="base"
                          @saveFirstFormId="saveFirstFormId"></baseInfo>
                <formDesign v-if="active===1" :formId="formId" :templateId="templateId" ref="formDesign"
                            @saveSecFormId="saveSecFormId"></formDesign>
                <flowDesign v-if="active===2" :formId="formId" ref="flowDesign"></flowDesign>
            </div>

            <div style="margin-top: 1rem;height: 1rem">
                <span></span>
            </div>

        </div>
        <ApprovalFormTransfer
                ref="ApprovalFormTransfer"
                v-if="dialogShow" :dialogShow="dialogShow"
                :value="transferList"
                @saveInfo="saveSimpleInfo"
                @closeDialog="dialogShow=false"
                headName="终审设置"
        >

        </ApprovalFormTransfer>
    </div>
</template>

<script>
    import baseInfo from "./body/baseInfo";
    import formDesign from "./body/formDesign";
    import flowDesign from "./body/flowDesign";
    import DiyTitle from "@components/DiyTitle/index";
    import ApprovalFormTransfer from "../components/ApprovalFormTransfer";
    import {mapState, mapGetters} from "vuex";
    import {get} from "@api/flow"
    export default {
        name: "index",
        data() {
            return {
                active: -1,
                formId: '',
                isTemplate: '',
                fullscreenLoading: false,
                templateId: '',
                isSave: false,
                dialogShow:false,
                transferList:[],
            }
        },
        components: {
            baseInfo,
            formDesign,
            flowDesign,
            DiyTitle,
            ApprovalFormTransfer,
        },
        computed: {
            ...mapState("user", ["userId"]),
            ...mapGetters("tenant", ["curTenantCode"]),
        },

        mounted() {
            // console.log(this.$route.params.templateId+"12313")
            // console.log("12313");
            if (this.$route.params.templateId != undefined) {
                this.templateId = this.$route.params.templateId
            }
            if (this.$route.params.formId != undefined) {
                this.formId = this.$route.params.formId
            }
            this.active = 0;
        },

        methods: {
            next() {
                // if (this.active++ >= 2) this.active = 2;
                this.fullscreenLoading = true;
                if (this.active === 0) {

                    if (this.formId == "") {
                        this.$refs.base.setFormInfo()
                    } else
                        this.$refs.base.editFormInfo(this.formId)
                }
                if (this.active === 1) {
                    this.$refs.formDesign.savaSecForm(this.isTemplate, this.formId, 0)
                }
                this.fullscreenLoading = false;


            },
            saveSimpleInfo(info){
                // this.saveIt();


                let userId=[];
                info.forEach(item=>{
                    userId.push(item.id);
                });


                this.dialogShow=false;
            },
            saveIt() {
                this.isSave = true;
                this.next();
                // this.active--;
            },

            preview() {
                this.$refs.formDesign.showPreview();
            },

            simpleApproval(){
                this.fullscreenLoading = true;
                // console.log("userId"+this.userId);
                // console.log("curTenantCode"+this.curTenantCode);
                // this.transferList= [
                //     {id: "1272914195944538874",label: "pzk22"},
                //     {id: "1272914195944538909",label: "聂富强"},
                //     {id: "1272914195944538910",label: "超管"}
                // ];

                let params={
                    tenantCode:this.curTenantCode,
                    userId:this.userId
                };

                get("/dev-api/asset-system/person/get/all/person/in/dept", params).then(res => {
                    this.fullscreenLoading = false;
                    this.dialogShow=true;
                    this.transferList=[];
                    if (res.data.data){
                        res.data.data.forEach(item=>{
                            this.transferList.push({
                                id: item.userId,
                                label: item.realName
                            })
                        });
                    }
                    this.transferList= [
                        {id: "1272914195944538874",label: "pzk22"},
                        {id: "1272914195944538909",label: "聂富强"},
                        {id: "1272914195944538910",label: "超管"}
                    ];
                }).catch(err => {
                    this.fullscreenLoading = false;
                    this.dialogShow=true;
                    this.$message.error({
                        message: "获取信息失败",
                        duration: 700
                    });
                });




            },

            saveFirstFormId(formId, isTemplate) {
                this.formId = formId;
                this.isTemplate = isTemplate ? 1 : 0;
                if (!this.isSave)
                    this.active++;
                else {
                    this.isSave = false;
                    this.$message.success("保存成功")
                }
                // this.isTemplate = isTemplate;
            },
            saveSecFormId(formId, isTemplate, back) {
                this.formId = formId;
                this.isTemplate = isTemplate ? 1 : 0;
                this.templateId = '';
                if (!this.isSave) {
                    if (back != 1)
                        this.active++;
                    else
                        this.active--;
                } else {
                    this.isSave = false;
                    this.$message.success("保存成功")
                }


                // this.isTemplate = isTemplate;
            },


            back() {

                if (this.active === 1) {
                    this.$refs.formDesign.savaSecForm(this.isTemplate, this.formId, 1);
                }
                if (this.active === 2) this.active--;
            },

        }
    }
</script>

<style lang="scss" scoped>

    .design {
        width: 100%;
        min-width: 1000px;
        margin-top: 1rem;
        height: 80%;
    }

    .top {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background-color: #fff;

        &__button {
            width: 20%;
            display: flex;
            align-items: center;
        }
    }

    .body {

    }
</style>