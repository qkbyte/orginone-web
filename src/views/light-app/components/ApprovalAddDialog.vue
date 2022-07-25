<template>
    <el-dialog
            top="8vh"
            width="840px"
            class="diy-dialog"
            :visible.sync="dialogShow.value"

    >
        <span slot="title" class="diy-dialog-title">
      创建审批
    </span>

        <el-button type="primary" @click="goToDesignWithout">创建审批</el-button>

        <div style="margin-top: 1rem;padding: 1%;">
            <span>按模板创建</span>
            <div>
                <div v-for="(temp,index) in data" :key="index" style="display: inline-block;width: 45%;margin-left: 2%">
                    <TemplateSimpleTag
                            @goToDesign="goToDesign(temp.id)"
                            :info="temp"
                    ></TemplateSimpleTag>
                </div>

            </div>

            <div class="footer-pagination">
                <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        v-bind="page"
                        :pager-count="5"
                        style="text-align:right;margin-top:10px;"
                ></el-pagination>
            </div>


            <div style="margin-left: 2%;">
                <el-button type="text" @click="goToTemplate"><span style="font-size: 1.2rem">审批模板管理</span></el-button>
            </div>


        </div>


    </el-dialog>

</template>

<script>
    import TemplateSimpleTag from "../components/TemplateSimpleTag"
    import {getTemplateInfoWithGroup} from "@api/flow"
    import {mapGetters, mapState} from "vuex";


    export default {
        name: "ApprovalAddDialog",

        data() {
            return {
                data: [],
                page: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页
                    pageSize: 10, // 每页条数
                    pageSizes: [10, 20, 50, 70, 100], // 分页数量列表
                    layout: "total, prev, pager, next, sizes"
                },
            }
        },
        computed: {
            ...mapGetters("tenant", ["curTenantCode"]),

        },
        props: {
            dialogShow: {
                type: Object,
                default: () => {
                }
            }
        },
        mounted() {
            this.getInfo();
        },
        methods: {
            goToTemplate() {
                this.$router.push({name: "approvalTemplate"});
            },
            goToDesign(id) {
                this.$router.push({name: "approvalDesign",params:{templateId:id}})
            },
            goToDesignWithout(){
                this.$router.push({name: "approvalDesign"})
            },
            getInfo() {
                let params = {
                    tenantCode: this.curTenantCode,
                    categoryId: '',
                    current: this.page.currentPage,
                    size: this.page.pageSize,
                    formName:'',
                    created_by:''
                };
                getTemplateInfoWithGroup(params).then(res => {
                    this.data = [];
                    let data = res.data.data.records;

                    data.forEach((item,index)=>{
                        let temp={
                            formName:item.name,
                            id:item.id,
                            descirp:item.description
                        }
                        this.data.push(temp);
                    })

                    this.page.currentPage=res.data.data.current;
                    this.page.total=res.data.data.total;


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

        },
        components: {
            TemplateSimpleTag
        }
    }
</script>

<style scoped>

</style>