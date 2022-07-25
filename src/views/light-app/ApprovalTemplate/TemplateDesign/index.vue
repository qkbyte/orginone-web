<template>
    <div style="height: 100%;width: 100%">
        <div class="design">
            <div class="top">
                <div class="top__button">
                    <el-button v-if="active===1"
                               style="margin: 0 auto;color: white;background-color: #154AD8;width: 74px;" type="text"
                               @click="back"
                               v-loading.fullscreen.lock="fullscreenLoading">
                        <!--                    <div class="el-icon-back"></div>-->
                        上一步
                    </el-button>
                </div>
                <el-steps style="width: 60%" :active="active" finish-status="success" simple align-center>
                    <el-step title="基础信息"></el-step>
                    <el-step title="表单设计"></el-step>
                </el-steps>
                <div class="top__button">
                    <el-button v-if="active!=2" style="margin: 0 auto" type="text" @click="saveIt">
                        保存
                    </el-button>

                    <el-button v-if="active==1" style="margin: 0 auto" type="text" @click="preview">
                        预览
                    </el-button>
                    <el-button style="margin: 0 auto;color: white;background-color: #154AD8;width: 74px;" type="text"
                               @click="next">下一步
                        <!--                    <div class="el-icon-right"></div>-->
                    </el-button>
                </div>
            </div>

            <div class="body">
                <baseInfo v-if="active===0" ref="base" :templateId="templateId"
                          @saveFirstFormId="saveFirstFormId"></baseInfo>
                <formDesign v-if="active===1" :templateId="templateId" ref="formDesign"
                            @saveSecFormId="saveSecFormId"></formDesign>
            </div>

            <div style="margin-top: 1rem;height: 1rem">
                <span></span>
            </div>

        </div>
    </div>
</template>

<script>
    import baseInfo from "./body/baseInfo";
    import formDesign from "./body/formDesign";
    import DiyTitle from "@components/DiyTitle/index";
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
            }
        },
        components: {
            baseInfo,
            formDesign,
            DiyTitle,
        },
        mounted() {
            if (this.$route.params.templateId != undefined) {
                this.templateId = this.$route.params.templateId
            }
            this.active = 0;
        },
        methods: {
            next() {
                // if (this.active++ >= 2) this.active = 2;
                this.fullscreenLoading = true;
                if (this.active === 0) {

                    if (this.templateId == "") {
                        this.$refs.base.setFormInfo()
                    } else
                        this.$refs.base.editFormInfo(this.templateId)
                }
                if (this.active === 1) {
                    this.$refs.formDesign.savaSecForm(this.templateId, this.isSave ? 1 : 0)
                }
                this.fullscreenLoading = false;


            },
            saveIt() {
                this.isSave = true;
                this.next();
                // this.active--;
            },

            preview() {
                this.$refs.formDesign.showPreview();
            },

            saveFirstFormId(templateId, isTemplate) {
                this.templateId = templateId;
                this.isTemplate = 1;
                if (!this.isSave)
                    this.active++;
                else {
                    this.isSave = false;
                    this.$message.success("保存成功")
                }
                // this.isTemplate = isTemplate;
            },

            saveSecFormId(templateId) {
                this.templateId = templateId;
                this.isTemplate = 1;


                if (!this.isSave)
                    this.active--;
                else {
                    this.isSave = false;
                    this.$message.success("保存成功")
                }

                // this.isTemplate = isTemplate;
            },


            back() {
                this.$refs.formDesign.savaSecForm(this.templateId, 1)
            },

        }
    }
</script>

<style lang="scss" scoped>

    .design {
        width: 100%;
        margin-top: 1rem;
        height: auto;
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