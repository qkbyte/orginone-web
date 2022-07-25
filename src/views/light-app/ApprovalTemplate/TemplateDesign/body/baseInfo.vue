<template>

    <div class="baseInfo">
        <div class="layout">
            <div class="layout__title">
                应用信息
            </div>


            <!--            <div style="margin-top: 1rem">-->
            <!--                <span style="color: #909399">应用图标</span>-->

            <!--                <div style="display: inline-block;margin-left: 1rem">-->
            <!--                    <el-button type="text">-->
            <!--                        <span style="color: #F76C6F">未设置应用图标</span>-->
            <!--                    </el-button>-->
            <!--                </div>-->
            <!--            </div>-->

            <!--            <div style="margin-top: 1rem">-->
            <!--                <div style="display: inline-block">-->
            <!--                    <img style="width: 34px;height: 34px;" src="@assets/store/app-icon-1.png"/>-->
            <!--                </div>-->
            <!--                <div style="display: inline-block;margin-left: 1rem">-->
            <!--                    <el-button type="text">编辑图标</el-button>-->
            <!--                </div>-->

            <!--                <div style="display: inline-block;margin-left: 1rem">-->
            <!--                    <el-switch-->
            <!--                            v-model="isTemplate"-->
            <!--                            active-text="设为模板"-->
            <!--                            inactive-text="设为审批"-->
            <!--                            style="display: block"-->
            <!--                            active-color="#13ce66"-->
            <!--                            inactive-color="#ff4949"-->
            <!--                    >-->
            <!--                    </el-switch>-->
            <!--                </div>-->

            <!--            </div>-->

            <div v-if="formInfo.infoIcon===''" style="margin-top: 1rem">
                <span style="color: #909399">应用图标</span>

                <div style="display: inline-block;margin-left: 1rem">
<!--                    <el-button type="text" @click="showIcon">-->
<!--                        <span style="color: #F76C6F">未设置应用图标</span>-->
<!--                    </el-button>-->
                    <ApprovalIconPop
                            @setIcon="handleSetIcon"
                            :choosed="this.formInfo.infoIcon"
                    >
                        <template slot="refContent"

                        >
                            <el-button type="text">
                                <span style="color: #F76C6F">未设置应用图标</span>
                            </el-button>
                        </template>
                    </ApprovalIconPop>
                </div>
            </div>

            <div v-else style="margin-top: 1rem">
                <div style="display: inline-block">
                    <img style="width: 34px;height: 34px;" :src="require(`@assets/approval/${formInfo.infoIcon}.png`)"/>
                </div>
                <div style="display: inline-block;margin-left: 1rem">
<!--                    <el-button type="text" @click="showIcon">编辑图标</el-button>-->
                    <ApprovalIconPop
                            @setIcon="handleSetIcon"
                            :choosed="this.formInfo.infoIcon">
                        <template slot="refContent">
                            <el-button type="text">
                                <span style="color: #154AD8">编辑图标</span>
                            </el-button>
                        </template>
                    </ApprovalIconPop>
                </div>

                <!--                <div style="display: inline-block;margin-left: 1rem">-->
                <!--                    <el-switch-->
                <!--                            v-model="isTemplate"-->
                <!--                            active-text="设为模板"-->
                <!--                            inactive-text="设为审批"-->
                <!--                            style="display: block"-->
                <!--                            active-color="#13ce66"-->
                <!--                            inactive-color="#ff4949"-->
                <!--                    >-->
                <!--                    </el-switch>-->
                <!--                </div>-->

            </div>

            <el-form ref="formInfo" :model="formInfo" status-icon :rules="formRule">
                <div style="margin-top: 2rem;display: flex;justify-content: space-between">


                    <div style="width: 25%;">
                        <el-form-item label="应用名称" prop="infoName">
                            <el-input style="margin-top: 5px" v-model="formInfo.infoName"
                                      placeholder="请输入应用名称" v-loading.fullscreen.lock="fullscreenLoading"></el-input>
                        </el-form-item>
                    </div>

                    <div style="width: 15%;">


                        <el-form-item label="应用分组（默认为全部）" prop="infoGroup">
                            <el-select style="margin-top: 5px" v-model="formInfo.infoGroup" placeholder="请选择应用分组">
                                <el-option
                                        v-for="item in groupOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <div style="color:#909399"></div>


                    </div>

                    <div style="width: 45%;">
                        <el-form-item label="应用描述" prop="infoDes">
                            <el-input style="margin-top: 5px" v-model="formInfo.infoDes"
                                      placeholder="请输入应用描述"></el-input>
                        </el-form-item>
                    </div>
                </div>
            </el-form>

        </div>

        <div class="layout">
            <div class="layout__title">
                应用管理
            </div>

            <!--            <div style="margin-top: 2rem">-->
            <!--                <div>谁可以发起这个流程</div>-->
            <!--                <el-select style="margin-top: 5px" v-model="role" placeholder="请选择权限范围">-->
            <!--                    <el-option-->
            <!--                            v-for="item in roleOptions"-->
            <!--                            :key="item.value"-->
            <!--                            :label="item.label"-->
            <!--                            :value="item.value">-->
            <!--                    </el-option>-->
            <!--                </el-select>-->

            <!--            </div>-->

            <div style="margin-top: 1rem">
<!--                <span style="color: #909399">权限分配</span>-->

                <div style="display: inline-block;margin-left: 1rem">
                    <el-button type="text" @click="handleAuth">
                        <span style="color: #154AD8">审批业务可见范围</span>
                    </el-button>
                </div>
            </div>
        </div>

        <ApprovalAuthDialog
                v-if="isShowAuth.value"
                :key="isShowAuth.key"
                :dialogShow="isShowAuth"
                :value="authInfo.index"
                @closeDialog="handleCloseDialog"
                @saveInfo="handleSave"
        ></ApprovalAuthDialog>

        <ApprovalIconDialog
                v-if="isShowIcon.value"
                :key="isShowIcon.key"
                :dialogShow="isShowIcon"
                :value="formInfo.infoIcon"
                @setIcon="handleSetIcon"
                @closeDialog="this.isShowIcon.value = false"
        >
        </ApprovalIconDialog>


    </div>

</template>

<script>
    import ApprovalAuthDialog from "../../../components/ApprovalAuthDialog"
    import {getTemplateGroup, getFormOrTemplateInfo, editTempFirstInfo,setTempFirstInfo, getAuthList} from "@api/flow"
    import {mapState,mapGetters} from "vuex";
    import ApprovalIconDialog from "@views/light-app/components/ApprovalIcon";
    import ApprovalIconPop from "@views/light-app/components/ApprovalIconPop";



    export default {
        name: "baseInfo",
        data() {
            return {
                fullscreenLoading: false,
                groupOptions: [
                    {
                        value: '选项1',
                        label: '选项1'
                    }, {
                        value: '选项2',
                        label: '选项2'
                    }, {
                        value: '选项3',
                        label: '选项3'
                    }, {
                        value: '选项4',
                        label: '选项4'
                    }, {
                        value: '选项5',
                        label: '选项5'
                    }],
                role: '',
                roleOptions: [
                    {
                        value: '选项1',
                        label: '选项1'
                    }, {
                        value: '选项2',
                        label: '选项2'
                    }, {
                        value: '选项3',
                        label: '选项3'
                    }, {
                        value: '选项4',
                        label: '选项4'
                    }, {
                        value: '选项5',
                        label: '选项5'
                    }],
                isTemplate: 0,

                formInfo: {
                    infoName: '',
                    infoGroup: '',
                    infoDes: '',
                    infoIcon: ''
                },
                formRule: {
                    infoName: [{required: true, message: '请输入名称', trigger: 'blur'}],
                    infoDes: [{required: true, message: '请输入名称', trigger: 'blur'}],
                },

                isShowAuth: {
                    value: false,
                    key: 'auth'
                },

                isShowIcon: {
                    value: false,
                    key: 'icon'
                },

                authInfo: {
                    id: [],
                    name: [],
                    index: []
                },

            }
        },
        computed: {
            ...mapState("user", ["userId"]),
            ...mapGetters("tenant", ["curTenantCode"]),
        },
        components: {
            ApprovalAuthDialog,
            ApprovalIconDialog,
            ApprovalIconPop
        },
        mounted() {
            this.getGroup();

            this.getInfo();

        },
        props: {
            templateId: {
                type: String,
                default: () => {
                }
            }
        },

        methods: {
            handleCloseDialog() {
                this.isShowAuth.value = false;
            },
            handleSave(key) {
                this.authInfo = key;
                console.log(key);
                this.handleCloseDialog();
            },
            handleSetIcon(key) {
                this.formInfo.infoIcon = key;
                this.isShowIcon.value = false
            },

            getInfo() {

                // console.log("dasd"+this.formId)
                // console.log("da12sd"+this.templateId);
                // this.fullscreenLoading=true;
                //
                //
                let id = '';
                let is_template = '';
                if (this.templateId != '') {
                    id = this.templateId;
                    is_template = 1;
                } else {
                    return
                }

                let params = {
                    id: id,
                    isTemplate: 1,
                    tenantId: this.curTenantCode
                }
                getFormOrTemplateInfo(params).then(res => {

                    let data = res.data.data;

                    this.formInfo.infoName = data.name;
                    this.formInfo.infoGroup = data.categoryId;
                    this.formInfo.infoDes = data.description;
                    this.formInfo.infoIcon = data.iconCls;
                    this.authInfo.id = [];

                    data.userIdList.forEach((item,index)=>{
                        let temp=item+'';
                        // if (index===0)
                        //     temp=temp.substr(1);

                        temp=temp.replace(' ','');
                        temp=temp.replace('[','');
                        temp=temp.replace(']','');


                        this.authInfo.id.push(temp);
                    });




                    getAuthList('').then(res=>{
                        this.fullscreenLoading=false;
                        res.data.data.forEach((item,index)=>{
                            this.authInfo.id.forEach((it,idx)=>{
                                it=it+'';
                                if (it===item.userId)
                                    this.authInfo.index.push(index)
                            })
                            // console.log(item.userId+"wew12313")
                        })
                    });

                })


                // console.log(this.authInfo.index+"wew12313")


            },

            showIcon() {
                this.isShowIcon.value = true;
            },

            handleAuth() {
                this.isShowAuth.value = true;
            },
            getGroup() {

                // this.fullscreenLoading=true;
                let params={
                    tenantCode:   this.curTenantCode
                };
                getTemplateGroup(params).then(res => {
                    this.groupOptions = [];
                    let temp = {
                        value: '',
                        label: "全部",
                    };
                    this.groupOptions.push(temp);
                    res.data.data.forEach((item, index) => {
                        let temp = {
                            value: item.id,
                            label: item.name,
                        };
                        this.groupOptions.push(temp)
                    })

                })
            },

            setFormInfo() {

                this.$refs["formInfo"].validate((valid) => {
                    if (valid) {
                        this.fullscreenLoading = true;

                        let userIds = [];
                        console.log(userIds.length+"setFormInfo")
                        console.log(this.authInfo.id.length+"setFormInfo")
                        console.log(JSON.stringify(this.authInfo.id)+"setFormInfo")


                        if (this.authInfo.id.length > 0)
                            this.authInfo.id.forEach((item, index) => {
                                userIds.push(item + "")
                            });
                        userIds.push(this.userId + '')


                        let temp = {
                            template_name: this.formInfo.infoName,
                            description: this.formInfo.infoDes,
                            created_by: this.userId,
                            icon_cls: this.formInfo.infoIcon,
                            tenant_id: this.curTenantCode,
                            isTemplate: 1,
                            categoryId: this.formInfo.infoGroup,
                            userIds: userIds,
                            template_id: "13545"
                            // userIds:["1"],
                        };

                        if (this.formId != '') {
                            temp.formId = this.formId
                        }
                        console.log(JSON.stringify(temp))
                        setTempFirstInfo(temp).then(res => {
                            this.fullscreenLoading = false;
                            if (res.data.code === 200)
                                this.$emit("saveFirstFormId", res.data.data.id, this.isTemplate)
                            return false;
                        });

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            editFormInfo(formId) {
                this.fullscreenLoading = true;

                this.$refs["formInfo"].validate((valid) => {
                    if (valid) {

                        let userIds = [];
                        console.log(userIds.length+"editFormInfo")
                        console.log(this.authInfo.id.length+"editFormInfo")
                        console.log(JSON.stringify(this.authInfo.id)+"editFormInfo")

                        if (this.authInfo.id.length > 0)
                            this.authInfo.id.forEach((item, index) => {
                                userIds.push(item + "")
                            });
                        userIds.push(this.userId + '')

                        let temp = {
                            template_name: this.formInfo.infoName,
                            description: this.formInfo.infoDes,
                            created_by: this.userId,
                            icon_cls: this.formInfo.infoIcon,
                            tenant_id: this.curTenantCode,
                            isTemplate: 1,
                            categoryId: this.formInfo.infoGroup,
                            userIds: userIds,
                            template_id: formId
                        };

                        editTempFirstInfo(temp).then(res => {
                            this.fullscreenLoading = false;
                            if (res.data.code === 200)
                                this.$emit("saveFirstFormId", res.data.data.id, 1);
                            return false;
                        });

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },

        }
    }
</script>

<style lang="scss" scoped>
    .layout {
        width: 100%;
        height: auto;
        background-color: #FFF;
        padding: 2%;
        margin-top: 1rem;

        &__title {
            font-size: 1.2rem;
            font-weight: bold;
        }
    }


</style>