<template>
    <div class="issue">
        <div class="top" >
            <div class="top_title">{{ pageName }}</div>
<!--            <div class="top_search">-->
<!--                <el-input-->
<!--                        placeholder="搜索"-->
<!--                        suffix-icon="el-icon-search"-->
<!--                        style="width: 20rem"-->
<!--                ></el-input>-->
<!--            </div>-->
            <div class="top_add">
                <el-button type="primary" @click="addForm">新增表单</el-button>
            </div>
        </div>

        <div class="content">
            <div class="content_left" style="background: white">
                <div class="content_left_search">
                    <p style="padding: 10px 0px;font-size: 1.2rem;font-weight:bold"> 表单搜索</p>
                    <el-input
                            placeholder="搜索"
                            suffix-icon="el-icon-search"
                            style="padding: 10px 0px; width: 100%"
                            v-model="search"
                    ></el-input>
                </div>

                <div class="content_left_body">
                    <p style="padding: 10px 0px;font-size: 1.2rem;font-weight:bold"> 表单列表</p>
                    <!--                    <form_tag class="content_left_body_tag" :title="listData[0].formName" describe="desdesdes" ></form_tag>-->
                    <!--                    <form_tag class="content_left_body_tag"></form_tag>-->
                    <form_tag v-for="(obj,index) in FilteredList " :key="index" class="content_left_body_tag" :class="obj.isCur ? 'content_left_body--is-active': 'content_left_body--is-noactive'"
                              :title="obj.formName" describe="desdesdes" :formId="obj.id" :procModelId="obj.procModelId"
                              :createdBy="obj.createdBy" @emitFormInfo="showFormInfo"></form_tag>
                </div>

            </div>

            <div class="content_right" style="background: white">
                <div class="content_right_title">
                    <h1>
                          <span style="margin: 0 0.5rem"
                          ><img src="@/assets/edit.png" alt=""/></span
                          >{{ form_title }}<span style="color:#000">填写</span>
                    </h1>
                </div>

                <div class="content_right_operation">
                    <el-button
                            type="text"
                            style="font-size: 1rem;font-weight: bold;"
                    >流程进度
                    </el-button>
                    <el-button type="text" style="font-size: 1rem;font-weight: bold;"
                    >打印二维码
                    </el-button
                    >
                    <el-button type="text" style="font-size: 1rem;font-weight: bold;"
                    >暂存
                    </el-button
                    >
                    <el-button type="text" style="font-size: 1rem;font-weight: bold;"
                    >删除
                    </el-button
                    >
                    <el-button
                            type="text"
                            style="font-size: 1rem;font-weight: bold;margin-right: 1.5rem"
                    >打印
                    </el-button
                    >
                </div>

                <div class="content_right_firstContent">
                    <div class="content_right_firstContent_subtitle">
                        单据基础信息
                    </div>
                    <div class="content_right_firstContent_main">
                        <fm-generate-form
                                :key="index"
                                :data="jsonData"
                                :remote="remoteFuncs"
                                :value="values"
                                ref="generateForm"
                        >
                        </fm-generate-form>
                    </div>

                    <div class="content_right_firstContent_button">
                        <el-button
                                style="width: 10rem; color: #0B3ED3;font-weight:bold;"
                                @click="initiateProcess"
                                v-loading.fullscreen.lock="fullscreenLoading"
                        >提交发布
                        </el-button>
                        <span style="margin-left: 2rem;">
                            <img src="@assets/issue/msg.png" height="22" width="21"/>
                            <el-button type="text">存为草稿</el-button>
                          </span>
                    </div>


                </div>


            </div>

        </div>
    </div>
</template>

<script>
    import form_tag from "./components/form_tag";
    import {mapState, mapGetters } from "vuex";
    export default {
        data() {
            return {
                pageName: '',
                listData: [],
                form_title: '',
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
                formId:"",
                procModelId:"",
                fullscreenLoading: false,
                search:""
            }
        },
        created: function () {
            this.pageName = this.$route.meta.title;
            this.getFormList()
        },
        components: {
            form_tag
        },
        computed: {
            ...mapState("user", ["userId"]),
            ...mapGetters("tenant", ["getCurTenantCode"]),
            FilteredList(){
                let  arr = [];
                this.listData.forEach((obj, index)=>{
                    if(obj.formName.search(this.search) != -1){
                        arr.push(obj)
                    }
                });
                return arr;
            }
        },
        methods: {
            // goToWriteForm() {
            //     console.log("daswe")
            //     this.$router.push({ //核心语句
            //         path: '/light-app/form_index',  //跳转的路径
            //         // query:{          //路由传参时push和query搭配使用 ，作用时传递参数
            //         //     id:this.id ,
            //         // }
            //     })
            // },

            showFormInfo(formId, title, procModelId, createdBy) {
                // console.log(formId + "" + title + "" + procModelId + "" + createdBy + "");
                this.fullscreenLoading = true;
                this.form_title = title;
                this.formId=formId;
                this.procModelId=procModelId;
                let params = {
                    form_model_id: formId
                };
                this.listData.forEach((obj, index)=>{
                    if (obj.id===formId)
                        this.listData[index].isCur=1;
                    else
                        this.listData[index].isCur=0

                });


                this.get(`/dev-bmp/form_inst/form_sheet`, params)
                    .then(res => {
                        console.log(res.data);
                        if (res.data.code == 200) {
                            this.jsonData = JSON.parse(res.data.obj.form_json);
                        }
                        this.fullscreenLoading = false;
                    })
                    .catch(err => {
                        console.log(err);
                        this.fullscreenLoading = false;
                        this.$message.error({
                            message: "表单格式数据失败",
                            duration: 700
                        });
                    });
            },
            getFormList() {
                this.fullscreenLoading = true;
                let params = {
                    group_id: -1,
                    form_status: 2,
                    tenant_id:this.getCurTenantCode,
                };
                this.get(`/dev-form/v2/form_model/models`, params)
                    .then(res => {
                        console.log(res.data);
                        if (res.data.code == 200) {
                            // this.listData = res.data.obj;
                            this.listData=[];
                            res.data.obj.forEach((obj, index)=>{
                                let temp={
                                    formName:obj.formName,
                                    id:obj.id,
                                    procModelId:obj.procModelId,
                                    createdBy:obj.createdBy,
                                    isCur:0
                                };
                                if (index===0){
                                    temp.isCur=1;
                                    this.showFormInfo(temp.id, temp.formName, temp.procModelId, temp.createdBy)
                                }
                                this.listData.push(temp)
                            });
                        }
                        this.fullscreenLoading = false;
                    }).catch(err => {
                    this.fullscreenLoading = false;
                    this.$message.error({
                        message: '表单加载失败',
                        duration: 700
                    })
                })
            },
            addForm(){
                this.$router.push({
                    path: '/light-app/form'
                })
            },
            initiateProcess() {
                this.$refs.generateForm
                    .getData()
                    .then(data => {
                        this.fullscreenLoading = true;
                        let params = {
                            editor: this.userId,
                            form_inst_sheet: JSON.stringify(this.jsonData),
                            form_inst_value: JSON.stringify(data),
                            form_model_id: this.formId
                        };
                        // console.log(JSON.stringify(params));

                        this.post("/dev-bmp/form_inst/save", params)
                            .then(res => {
                                // console.log(res.data);
                                this.$message.success("发起流程成功");
                                this.getFormList();
                            })
                            .catch(err => {
                                this.fullscreenLoading = false;
                                this.$message.error({
                                    message: "发起流程失败",
                                    duration: 700
                                });
                            });
                    })
                    .catch(e => {
                        this.$message.error("数据校验失败");
                    });
            },

        }
    }
</script>

<style lang="scss" scoped>
    .issue {
        height: 100%;
        width: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 3%;


        .top {
            display: flex;
            justify-content: space-between;
            margin-left: 2.5rem;
            padding: 1rem;


            &_title {
                font-size: 2rem;
                font-weight: bold;
                line-height: 50px;
                color: rgba(51, 51, 51, 1);
            }
            &_add {
                line-height: 50px;
               text-align: right;
            }
            /*&_search {*/
            /*    margin-left: 7rem;*/
            /*    padding: 0.4%;*/
            /*}*/
        }

        .content {
            width: 100%;
            margin-top: 1rem;
            display: flex;
            justify-content: space-between;
            height: 100%;
            /*overflow-x: auto;*/
            /*overflow-y: hidden;*/
            /*overflow: -moz-scrollbars-none;*/

            &_left {
                width: 22%;
                height: 100%;
                overflow-y: auto;
                padding: 1rem 1rem;


                &_search {
                    display: flex;
                    flex-direction: column;
                }

                &_body {

                    &_tag:hover {
                        background: #CCFFFF;
                    }
                    &--is-active {
                        background: #66FFFF;
                        /*color: rgba(255, 255, 255, 1);*/
                    }

                    &--is-noactive {
                        color: rgba(153, 153, 153, 1);
                    }
                }
            }

            &_right {
                width: 72%;
                height: 100%;

                &_title {
                    width: 100%;
                    height: 4rem;
                    text-align: center;
                }

                &_operation {
                    width: 100%;
                    text-align: right;
                }

                &_firstContent {
                    width: 100%;
                    padding: 0.5rem;

                    &_subtitle {
                        font-size: 1.5rem;
                        font-weight: bold;
                        color: #0b3ed3;
                    }

                    &_main {
                        padding: 1rem;
                    }

                    &_button {
                        width: 100%;
                        height: 4rem;
                        text-align: center;
                    }
                }



            }
        }

    }
</style>