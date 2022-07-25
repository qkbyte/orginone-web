<template>
    <el-dialog
            top="8vh"
            width="420px"
            class="diy-dialog"
            :visible.sync="dialogShow.value"
            v-loading.fullscreen.lock="fullscreenLoading"
    >
        <span slot="title" class="diy-dialog-title">编辑分组</span>


        <div style="font-size:14px;color:#303133;">已选择：{{curCategoryName}}</div>
        <div style="font-size:12px;color:rgba(144,147,153,1);margin-top: 30px">分组</div>
        <el-select ref="select" style="margin-top: 5px" v-model="infoGroup" placeholder="请选择应用分组" @change="changeInfoGroup">
            <el-option
                    v-for="item in groupOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                <div style="display: flex;justify-content: space-between;align-items: center;">
                    <span >{{ item.label }}</span>
                    <div>
                        <div class="el-icon-document-add" @click.stop.prevent="editGroup(item)">
                        </div>
                        <div class="el-icon-close" @click.stop.prevent="deleteGroup(item)">
                        </div>
                    </div>

                </div>

            </el-option>
            <el-option disabled label="新增" :value="13543">
                <el-button type="text">
                    <div class="el-icon-plus" @click.stop.prevent="addGroup()">新增</div>
                </el-button>
            </el-option>


        </el-select>


    </el-dialog>
</template>

<script>
    import {getTemplateGroup} from "@api/flow"
    import {categoryAdd,categoryEdit,getCategoryNameByCategoryId,deleteCategoryNameByCategoryId,changeCategoryByForm} from "@api/flow-message"
    import {mapGetters, mapState} from "vuex";

    export default {
        name: "editGroup",
        props: {
            dialogShow: {
                type: Object,
                default: () => {
                }
            },
            chooseFormList: {
                type: Array,
                default: () => {
                }
            },
            isTemplate: {
                type: Int16Array,
                default: () => {
                }
            }
        },
        data() {
            return {
                fullscreenLoading:false,
                infoGroup: '',
                groupOptions: [],
                curCategoryName: '',
                addNewDialog: false
            }
        },
        mounted() {
            this.getGroup();
            this.curCategoryName = this.chooseFormList[0].categoryName;
            this.infoGroup = this.chooseFormList[0].categoryId;
        },
        computed: {
            ...mapGetters("tenant", ["curTenantCode"]),
        },
        methods: {
            getGroup() {
                this.fullscreenLoading=true;
                let params={
                    tenantCode:   this.curTenantCode
                };
                getTemplateGroup(params).then(res => {
                    this.fullscreenLoading=false;
                    this.groupOptions = [];
                    res.data.data.forEach((item, index) => {
                        let temp = {
                            value: item.id,
                            label: item.name,
                        };
                        this.groupOptions.push(temp)
                    });


                    console.log(JSON.stringify(this.groupOptions))

                })
            },


            getCategoryName(){
                let params={
                    id:this.infoGroup
                };

                getCategoryNameByCategoryId(params).then(res=>{
                    if (res.data.code===200){
                        this.curCategoryName=res.data.data.name;
                    }
                })
            },


            addGroup() {
                this.$refs.select.blur();
                console.log(15613153);

                this.$prompt('请输入分类', '新增', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValidator: this.isValidate,
                    inputErrorMessage: '长度不能超过8个字'
                }).then(({value}) => {
                    let params={
                        name:value,
                        tenantCode:this.curTenantCode,
                        code:'FORM_TEMPLATE'
                    };
                    this.fullscreenLoading=true;
                    categoryAdd(params).then(res=>{
                        this.fullscreenLoading=false;
                        if (res.data.code===200){
                            this.$message.success("新增成功！")
                            this.getGroup()
                        }

                    })
                }).catch(() => {
                });


            },
            isValidate(value) {
                if (value.length > 8)
                    return false;
                else return true;
            },


            changeInfoGroup(value){
                console.log(value);
                let params={
                    formId:this.chooseFormList[0].id,
                    categoryId:value,
                    isTemplate:this.isTemplate
                };
                this.fullscreenLoading=false;
                changeCategoryByForm(params).then(res=>{
                    this.fullscreenLoading=false;
                    if (res.data.code===200){
                        this.$message.success("修改成功！")
                        this.getGroup();
                        this.getCategoryName();
                        this.$emit('updataInfo')
                    }
                })

            },

            editGroup(item){
                this.$refs.select.blur();
                console.log(item);


                this.$prompt('请输入分类', '编辑', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue:item.label,
                    inputValidator: this.isValidate,
                    inputErrorMessage: '长度不能超过8个字'
                }).then(({value}) => {
                    let params={
                        name:value,
                        id:item.value,
                        tenantCode:this.curTenantCode,
                        code:'FORM_TEMPLATE'
                    };
                    this.fullscreenLoading=true;
                    categoryEdit(params).then(res=>{
                        this.fullscreenLoading=false;

                        if (res.data.code===200){
                            this.$message.success("编辑成功！")
                            this.getGroup();
                            this.getCategoryName();
                            this.$emit('updataInfo')
                        }

                    })
                }).catch(() => {
                });


            },

            deleteGroup(item){
                this.$refs.select.blur();
                this.$confirm('此操作将永久删除该分组, 是否继续?', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                   let params={
                       ids:item.value
                   };
                    this.fullscreenLoading=true;
                    deleteCategoryNameByCategoryId(params).then(res=>{
                        this.fullscreenLoading=false;
                        if (res.data.code===200){
                            this.$message.success("删除成功")
                            this.getGroup();
                            this.getCategoryName();
                            this.$emit('updataInfo');
                        }
                    })


                }).catch(() => {
                });
            }


        }


    }
</script>

<style scoped>

</style>