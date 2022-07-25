<template>
    <div>
        表单显示demo
        <br>
        <br>
        <fm-generate-form
                :key="index"
                :data="jsonData"
                :remote="remoteFuncs"
                :value="values"
                ref="generateForm"
        >
        </fm-generate-form>
        <br>
        <br>
        <el-button @click="getFormInfo">获取表单数据</el-button>

        <div id="demo"></div>


    </div>
</template>

<script>
    import Vue from "vue";
    export default {
        data(){
            return{
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
                            name: "单行文本数据",
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
                            name: "多行文本数据",
                            key: "1581772111000_22509",
                            model: "textarea_1581772111000_22509",
                            rules: []
                        },
                        {
                            type: 'application',
                            icon: 'icon-code',
                            options: {
                                defaultValue: 'This is a application form',
                                //申请人
                                proposer:'1',
                                //申请类型
                                applicationType:'2',
                                //申请来源
                                applicationSource:'3',
                                //申请数据
                                applicationData:'46515',
                                //申请路由
                                applicationRoute:'/test',
                            },
                            name: "申请组件",
                            key: "1581772111012_22509",
                            model: "application_1589255754000_65203",
                            rules: []
                        },
                        {
                            type: 'annotation',
                            icon: 'icon-code',
                            options: {
                                defaultValue: 'This is a annotation',
                            },
                            name: "注释",
                            key: "1581772111000_21509",
                            model: "annotation_1581772111000_253153",
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
                //申请组件内容
                proposer:'',
                applicationType:'',
                applicationSource:'',
                applicationData:'',
                applicationRoute:'',
                formJson:'',
                form:{
                    newTemplate:123
                },

            }
        },
        created() {
            this.modificationFormInfo();
        },
        methods:{
            //跳转后通过路由获取信息，填充进表单数据中。
            modificationFormInfo(){
                if (this.$route.query.proposer!=undefined){
                    this.proposer=this.$route.query.proposer
                }
                if (this.$route.query.applicationType!=undefined){
                    this.applicationType=this.$route.query.applicationType
                }
                if (this.$route.query.applicationSource!=undefined){
                    this.applicationSource=this.$route.query.applicationSource
                }
                if (this.$route.query.applicationData!=undefined){
                    this.applicationData=this.$route.query.applicationData
                }
                if (this.$route.query.applicationRoute!=undefined){
                    this.applicationRoute=this.$route.query.applicationRoute
                }
                this.jsonData.list.forEach((item, i) => {
                    if (item.type === "application")
                        item.options.proposer = this.proposer;
                        item.options.applicationType = this.applicationType;
                        item.options.applicationSource = this.applicationSource;
                        item.options.applicationData = this.applicationData;
                        item.options.applicationRoute = this.applicationRoute;
                })
            },
            getFormInfo(){
                this.$refs.generateForm
                    .getData()
                    .then(data => {
                        this.formJson = data;
                    })
            },
        }
    }
</script>

<style scoped>

</style>