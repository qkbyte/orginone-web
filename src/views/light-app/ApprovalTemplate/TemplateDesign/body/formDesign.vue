<template>
    <div class="formDesign">
        <fm-making-form ref="makingform" >
            <template slot="action"></template>
        </fm-making-form>


    </div>
</template>

<script>
    import {mapGetters, mapState} from "vuex";
    import {editTempInfo2,getFormOrTemplateInfo} from "@api/flow"

    export default {
        name: "formDesign",
        data() {
            return {
                storage: "",
                modelSheet:''
            }
        },
       props:{
           templateId: {
               type: String,
               default: () => {
               }
           },
       },
        computed: {
            ...mapState("user", ["userId"]),
            ...mapGetters("tenant", ["curTenantCode"]),

        },
        mounted() {
            this.getInfo();
        },

        methods: {
            savaSecForm(templateId, back) {
                this.storage = this.$refs.makingform.getJSON();
                var params = {
                    isTemplate: 1,
                    template_sheet: JSON.stringify(this.storage),
                    template_id: templateId
                };
                console.log(JSON.stringify(params));
                editTempInfo2(params).then(res => {
                    if (res.data.code === 200) {
                        this.$emit("saveSecFormId", templateId);
                        if (back === 0)
                            this.$router.push({name: "approvalTemplate"});
                    }

                })
            },
            getInfo(){
                this.fullscreenLoading = true;
                let id='';
                let isTemplate=0;
                if (this.templateId!=''){
                    id=this.templateId;
                    isTemplate=1;
                }else
                    return;

                let params={
                    id:id,
                    isTemplate:1,
                    tenantId:this.curTenantCode
                };
                getFormOrTemplateInfo(params).then(res=>{
                    this.fullscreenLoading = false;
                    let data=res.data.data;
                    this.modelSheet=data.modelSheetJson;
                    console.log(this.modelSheet);
                    if (this.modelSheet!="{}"&&this.modelSheet!=null)
                        this.$refs.makingform.setJSON(JSON.parse(this.modelSheet));
                })

            },
            showPreview(){
                this.$refs.makingform.previewVisible=true;
            },

        }


    }
</script>

<style lang="scss" scoped>
    .formDesign {
        margin-top: 1rem;
        width: 100%;
        height: 80vh;
    }

</style>
