<template>
    <div class="formDesign" v-loading.fullscreen.lock="fullscreenLoading">
        <fm-making-form ref="makingform" >
            <template slot="action"></template>
        </fm-making-form>


    </div>
</template>

<script>
    import {mapGetters, mapState} from "vuex";
    import {editFormInfo2, getFormOrTemplateInfo} from "@api/flow"

    export default {
        name: "formDesign",
        data() {
            return {
                fullscreenLoading: false,
                storage: "",
                modelSheet: ''
            }
        },
        computed: {
            ...mapState("user", ["userId"]),
            ...mapGetters("tenant", ["curTenantCode"]),
        },
        props: {
            formId: {
                type: String,
                default: () => {
                }
            },
            templateId: {
                type: String,
                default: () => {
                }
            },
        },

        mounted() {
            this.getInfo();
        },
        methods: {
            savaSecForm(isTemplate, formId, back) {
                this.fullscreenLoading = true;
                this.storage = this.$refs.makingform.getJSON();
                var params = {
                    isTemplate: isTemplate,
                    form_sheet: JSON.stringify(this.storage),
                    form_model_id: formId
                };

                editFormInfo2(params).then(res => {
                    this.fullscreenLoading = false;

                    if (res.data.code === 200)
                        this.$emit("saveSecFormId", formId, isTemplate, back)
                })
            },


            getInfo() {
                this.fullscreenLoading = true;
                let id = '';
                let isTemplate = 0;
                if (this.templateId != '') {
                    id = this.templateId;
                    isTemplate = 1;
                } else if (this.formId != '') {
                    id = this.formId;
                    isTemplate = 0;
                } else
                    return;

                let params = {
                    id: id,
                    isTemplate: isTemplate,
                    tenantId: this.curTenantCode
                };
                getFormOrTemplateInfo(params).then(res => {
                    this.fullscreenLoading = false;
                    let data = res.data.data;
                    if (!isTemplate)
                        this.modelSheet = data.modelSheet;
                    else
                        this.modelSheet=data.modelSheetJson;
                    if (this.modelSheet != "{}" && this.modelSheet != null)
                        this.$refs.makingform.setJSON(JSON.parse(this.modelSheet));
                })

            },

            showPreview(){
               // console.log( this.$refs.makingform)
                // this.$refs.makingform.preview=true;
                this.$refs.makingform.previewVisible=true;
            },

        },


    }
</script>

<style lang="scss" scoped>
    .formDesign {
        margin-top: 1rem;
        width: 100%;
        height: 80vh;
    }

</style>
