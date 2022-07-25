<template>
    <div class="complete">
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

        <div>
            <div class="complete__title">
                <h1>
                    <span style="margin: 0 0.5rem"><img src="@/assets/edit.png" alt=""/></span>{{ title }}<span style="color:#000">内容</span>
                </h1>
            </div>

            <div class="complete__body">
                <div class="complete__body__title">
                    <div style="width:4px;height:17px;background-color: #154AD8;display: inline-block;"></div>
                    <div style="display: inline-block;margin-left: 10px;color:#303133;width:102px;">单据基础信息</div>
                </div>
                <div class="complete__body__content">
                    <fm-generate-form
                            :key="index"
                            :data="jsonData"
                            :remote="remoteFuncs"
                            :value="values"
                            ref="generateForm"
                            disabled="true"
                    >
                    </fm-generate-form>
                </div>
                <div class="complete__body__buttons">
                    <el-button @click="showProcess" style="width:144px;height:38px; margin-left: 58px;color: white;font-weight:bold;background-color: #154AD8">查看进度</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        get,
        post,
    } from "@api/flow";
    export default {
        data(){
            return{
                id:'',
                type:'',
                title:'请假审批',
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
                                disabled: true,
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
                remoteFuncs: {},
                values: {},

                procInstId:'',
                formModelId:'',
            }
        },
        mounted() {
            if(this.$route.params.id){
                this.id=this.$route.params.id;
                this.type=this.$route.params.type;
                this.getInfo();
                this.$refs.generateForm.$refs.generateForm.disabled=true;
            }else {
                this.goback();
            }
        },
        methods:{
            goback() {
                this.$router.go(-1);
            },
            showProcess(){
            },
            getInfo(){
                let params={
                    id:this.id,
                    type:this.type
                };
                get("/dev-bmp/form_inst/procDetail",params).then(res => {
                    // this.$refs.table.loading = false;
                    // this.tableData = res.data.obj;
                    // console.log(res.data);

                    this.jsonData=JSON.parse(res.data.obj.formInstSheet);
                    this.values=JSON.parse(res.data.obj.formInstValue);

                    this.procInstId=res.data.obj.procInstId;
                    this.formModelId=res.data.obj.formModelId;

                    setTimeout(()=>{
                        this.$refs.generateForm.$refs.generateForm.disabled=true;
                    },200)
                    // console.log()
                    // console.log(this.$refs.generateForm)


                }).catch(err => {
                    this.$message.error({
                        message: "加载失败",
                        duration: 700
                    });
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    .complete{
        height: 100%;
        margin-top: 4px;
        background: white;
        padding: 20px;
        overflow: auto;
        &__title{
            text-align: center;
        }
        &__body{
            width: 100%;
            padding: 0.5rem 196px 20px;
            &__title{
                display: flex;
                align-items: center;
            }
            &__content{
                margin-top: 20px;

            }
            &__buttons{
                margin-top: 20px;
                text-align: right;
            }
         }
    }
</style>