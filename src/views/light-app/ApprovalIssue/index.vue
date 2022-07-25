<template>
    <div style="width: 100%;height: 100%">

        <div class="issue">

            <div class="top__button">
                <el-button style="margin: 0 auto" type="text" @click="goback">
                    <div class="el-icon-back"></div>
                    返回
                </el-button>
            </div>
            <div class="issue__title">
                {{formName}}
            </div>
            <div style="display: flex;
                align-items: center;
                height:22px;
                font-size:16px;
                font-family:LucidaGrande;
                margin-top: 32px;
                color:rgba(48,49,51,1);
                line-height:18px;" >
                <div style="width:4px;height:17px;background-color: #154AD8;display: inline-block;"></div>
                <div style="display: inline-block;margin-left: 10px;color:#303133;width:102px;">单据基础信息</div>
            </div>
            <div class="issue__body">
                <fm-generate-form
                        :key="index"
                        :data="jsonData"
                        :remote="remoteFuncs"
                        :value="values"
                        ref="generateForm"
                >
                </fm-generate-form>
            </div>
            <div class="issue__button_wrapper">
                <div style="display: inline-block;width: 10%;text-align: left;margin-top: 1rem;">
                  <span style="width:219px;height:20px;font-size:14px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(142,146,152,1);line-height:20px;">
                  <!-- 共2轮审批，下一审批经办人：侯芳-->
                  </span>
                </div>

                <div style="margin-top: 1rem; display: inline-block;height: 4rem;text-align: center;min-width:300px;">
                    <el-button type="text" style="width:32px;
                      height:22px;
                      font-size:16px;
                      font-family:PingFangSC-Regular,PingFang SC;
                      font-weight:400;
                      color:rgba(21,74,216,1);
                      line-height:22px;" @click="draftList">保存
                    </el-button>
                    <el-button class="issue_button" @click="dialogShowAll.value=true">提交审批
                    </el-button>
                    <el-button class="issue_button" @click="showCopyTo">抄送设置
                    </el-button>
                </div>
            </div>

            <approvalNextAuth ref="approvalNextAuth" 
                              v-if="dialogShowAll.value" 
                              :dialogShow="dialogShowAll"
                              :jobIdLists="jobIdLists" 
                              :agencyIdLists="agencyIdLists" 
                              :userIdLists="userIdLists"
                              @closeDialog="closeNextDialog"
                              @saveIt="initiateProcessAddAuth"
            >
                <div slot="theFooter">
                    <el-button @click="closeNextDialog">取 消</el-button>
                    <el-button type="primary" @click="soltFunction">确 定</el-button>
                </div>
            </approvalNextAuth>

            <el-dialog
                    center
                    top="8vh"
                    width="840px"
                    class="diy-dialog"
                    :visible.sync="dialogShowUser"
                    :close-on-click-modal="false"
                    style="text-align: center;"
            >
                <div class="diy-tab">
                    <div
                        class="diy-tab__item"
                        :class="item.isCur? 'diy-tab__item--is-active': 'diy-tab__item--is-noactive'"
                        v-for="(item,index) in authItem"
                        @click="changeTab(item)"
                        :key="item.id"
                    >
                        <div style="margin-top: 10px">
                            <el-tooltip
                                effect="dark"
                                :content="next_node_names[index]"
                                placement="top-start"
                            >
                                <span style="white-space: nowrap;overflow:hidden;text-overflow:ellipsis;width: 100%">{{ next_node_names[index] |omitName}}</span>
                            </el-tooltip>
                        </div>
                    </div>
                </div>

                <div v-if="authItem.length>0">

                    <div style="text-align: center;margin-top: 10px">
                        默认用户：
                        <span style="margin-left: 10px" v-for="item in userIdLists[curShow]" :key="item">{{item}}</span>
                    </div>

                    <div style="text-align: center;margin-top: 10px">
                        所选部门权限：
                        <span style="margin-left: 10px" v-for="item in agencyIdLists[curShow]"
                              :key="item">{{item}}</span>

                    </div>

                    <div style="text-align: center;margin-top: 10px">
                        默认岗位权限：
                        <span style="margin-left: 10px" v-for="item in jobIdLists[curShow]" :key="item">{{item}}</span>
                    </div>


                    <div style="text-align: center;margin-top: 10px">
                        <span slot="title" class="diy-dialog-title" style="text-align: center;">{{next_node_names[curShow]}}节点:选择人员</span>
                    </div>

                    <div style="display: flex;align-items: center;flex-direction: column;margin-top: 10px">

                        <div v-if="!isShowUser" style="margin-top: 10px">当前无可选节点</div>

                        <el-transfer
                            v-if="isShowUser"
                            v-model="valueU[curShow]"
                            :data="dataU[curShow]"
                            :titles="['可选', '已选']"
                        ></el-transfer>

                    </div>
                </div>


                <span slot="footer" class="diy-dialog-footer">
                     <el-button 
                          type="primary" 
                          @click="initiateProcessAddAuth"
                          v-loading.fullscreen.lock="fullscreenLoading">发 起</el-button>
                     <el-button @click="dialogShowUser=false">取 消</el-button>
            </span>
            </el-dialog>


        </div>
        <ApprovalFormTransfer
            ref="ApprovalCopyTo"
            :dialogShow="dialogShowCopyTo"
            :value="this.copyToInfo"
            @saveInfo="saveCopyTo"
            @closeDialog="dialogShowCopyTo.value=false"
            headName="抄送人员选择"
        >
        </ApprovalFormTransfer>
    </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import {get, post, getFormAuthList} from "@api/flow"
import approvalNextAuth from "../components/ApprovalNextAuthDialog";
import DiyTitle from "@components/DiyTitle/index";
import ApprovalFormTransfer from "../components/ApprovalFormTransfer";

export default {
  name: "index",
  data() {
      return {
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
                      name: "申请人",
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
                      name: "申请内容",
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
          index: '',
          remoteFuncs: {},
          values: {},
          formId: "",
          procModelId: "",
          fullscreenLoading: false,
          dialogShowUser: false,
          dialogShowJ: false,
          dialogShowB: false,
          dialogShowG: false,
          valueG: [],
          dataG: [],
          valueB: [],
          dataB: [],
          valueJ: [],
          dataJ: [],

          valueU: [],
          dataU: [],
          isShowUser: true,
          nextNodeIdList: [],

          authItem: [],

          curShow: 0,


          jobIdLists: [],
          roleIdLists: [],
          agencyIdLists: [],
          userIdLists: [],
          next_node_names: [],
          dialogShowAll: {
              value: false,
              sendData: {
                  roleId: 0,
                  roleList: [],
              }
          },

          dialogShowCopyTo: {
              value: false,
          },
          copyToInfo: [],
          copyToList: [],
          formName: "单据基础信息",
          draftId: '',
      }
  },
  computed: {
    ...mapState("user", ["userId"]),
    ...mapState("user", ["token"]),
    ...mapState("user", ["userName"]),
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  components: {
    approvalNextAuth,
    DiyTitle,
    ApprovalFormTransfer,
  },
  mounted() {
    if (this.$route.params.formId != undefined) {
        this.formId = this.$route.params.formId;
        this.getInfo();

    } else if (this.$route.params.draftId != undefined) {
        this.draftId = this.$route.params.draftId;
        this.getDraftInfo();
    } else {
        this.goback();
    }
  },
  filters: {
    omitName(info) {
      if (info.length > 5) return info.substring(0, 5) + "...";
      return info;
    }
  },
  methods: {
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

                post("/dev-bmp/form_inst/save", params)
                    .then(res => {
                        // console.log(res.data);
                        this.$message.success("发起流程成功");
                        this.goback();
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

    initiateProcessAddAuth(CandidateUserIdLists) {
        this.closeNextDialog();
        this.$refs.generateForm
            .getData()
            .then(data => {
                this.fullscreenLoading = true;

                // let CandidateUserIdLists = [JSON.stringify(this.valueU)]
                // let CandidateUserIdLists = [];
                //
                // for (let i = 0; i < this.valueU.length; i++) {
                //     CandidateUserIdLists[i] = this.valueU[i];
                // }


                // let str=CandidateUserIdLists.toString();


                let params = {
                    editor: this.userId,
                    form_inst_sheet: JSON.stringify(this.jsonData),
                    form_inst_value: JSON.stringify(data),
                    form_model_id: this.formId,
                    nextNodeIdList: this.nextNodeIdList,
                    candidateUserIdLists: CandidateUserIdLists
                };
                // console.log(JSON.stringify(params));

                console.log(JSON.stringify(params) + "123");
                // console.log(str + "321");

                post("/dev-bmp/form_inst/v3/save", params)
                    .then(res => {
                        // console.log(res.data);
                        this.$message.success("发起流程成功");
                        this.goback();
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

    soltFunction() {
        this.$refs.approvalNextAuth.handleSave();
    },

    changeTab: function (obj) {
        this.curShow = obj.id;
        this.authItem.forEach(function (item) {
            if (item.id == obj.id) {
                item.isCur = true;
            } else {
                item.isCur = false;
            }
        });

        this.showUserList(this.curShow);
    },

    showUserList(index) {
        this.isShowUser = false;

        // let params = {
        //     tenantCode: this.curTenantCode,
        //     deptIds: this.valueB[index],
        //     jobIds: this.valueG[index],
        //     roleIds: this.valueJ[index]
        // };
        let params = {
            tenantCode: this.curTenantCode,
            deptIds: this.agencyIdLists[index],
            jobIds: this.jobIdLists[index],
            roleIds: this.roleIdLists[index]
        };

        console.log(JSON.stringify(params) + "dasd");
        getFormAuthList(params).then(res => {

            // console.log(JSON.stringify(res.data.data[0].id))
            this.dataU[index] = [];
            this.valueU[index] = [];

            // console.log(JSON.stringify(res.data.data))
            if (res.data.data.length < 1) {
                console.log("dasdasd");
                return;
            }

            res.data.data.forEach((item, idx) => {

                this.dataU[index].push({
                    key: item.userId,
                    label: item.realName,
                })
            })
            this.isShowUser = true;

        }).catch(err => {
        });


    },

    draftList() {
        this.fullscreenLoading = true;
        // this.form_inst_value = "";
        this.$refs.generateForm
            .getData()
            .then(data => {
                // let CandidateUserIdLists = [];
                //
                // for (let i = 0; i < this.valueU.length; i++) {
                //     CandidateUserIdLists[i] = this.valueU[i];
                // }
                let params = {
                    editor: this.userId,
                    form_inst_sheet: JSON.stringify(this.jsonData),
                    form_inst_value: JSON.stringify(data),
                    form_model_id: this.formId,
                    candidateUserIdLists: [],
                    nextNodeIdList: this.nextNodeIdList,
                };
                // console.log(JSON.stringify(params));

                post("/dev-bmp/form_inst/draft", params)
                    .then(res => {
                        console.log(res.data);
                        this.$message.success("保存成功");
                        this.goback();
                    })
                    .catch(err => {
                        this.fullscreenLoading = false;
                        this.$message.error({
                            message: "保存失败",
                            duration: 700
                        });
                    });
            })
            .catch(e => {
                this.$message.error("数据校验失败");
            });
    },

    getManyList() {
        this.dialogShowUser = true;

        if (this.nextNodeIdList.length > 0)
            this.showUserList(this.curShow);

        this.dialogShowJ = false;
        this.dialogShowB = false;
        this.dialogShowG = false;
        let params = {
            flag: 1,
            tenantCode: this.curTenantCode,
        };

        get(`dev-api/asset-system/jobs/v1/get/dept/job/role`, params)
            .then(res => {
                // this.valueG = [];
                // this.dataG = [];

                for (let index = 0; index < this.valueG.length; index++) {
                    this.dataG[index] = [];
                    this.valueG[index] = [];

                    res.data.data.forEach((item, idx) => {
                        this.dataG[index].push({
                            key: item.id,
                            label: item.jobName,
                        })
                    })

                }
                this.dialogShowG = true;
                // console.log(JSON.stringify(res.data.data[0].id))


            })
            .catch(err => {
            });

        let params1 = {
            flag: 2,
            tenantCode: this.curTenantCode,
        };

        get(`dev-api/asset-system/jobs/v1/get/dept/job/role`, params1)
            .then(res => {
                for (let index = 0; index < this.valueG.length; index++) {
                    this.valueB[index] = [];
                    this.dataB[index] = [];

                    res.data.data.forEach((item, idx) => {
                        this.dataB[index].push({
                            key: item.id,
                            label: item.agencyName,
                        })
                    })
                }
                this.dialogShowB = true;


            })
            .catch(err => {
            });

        let params2 = {
            flag: 3,
            tenantCode: this.curTenantCode,
        };
        get(`dev-api/asset-system/jobs/v1/get/dept/job/role`, params2)
            .then(res => {

                for (let index = 0; index < this.valueG.length; index++) {
                    this.valueJ[index] = [];
                    this.dataJ[index] = [];

                    res.data.data.forEach((item, idx) => {
                        this.dataJ[index].push({
                            key: item.id,
                            label: item.roleName,
                        })
                    })
                }

                this.dialogShowJ = true;
                //
                // let dasf=[]
                // this.roleIdLists.forEach(item=>{
                //     let temp={
                //         id:item,
                //         name:this.showNameById(item,this.dataJ,this.curShow)
                //     }
                //     dasf.push(temp);
                // });


            })
            .catch(err => {
            });


    },

    showNameById(info, resource, curShow) {
        resource[curShow].forEach(item => {
            if (info === item.key)
                return item.name;
        })
        return '';
    },

    setImgInfo() {
        this.jsonData.list.forEach((item, i) => {
            console.log(item);
            if (item.type === "MediaIMAGE") {
                item.zcyToken = this.token;
                item.action = "http://platform.assetcloud.org.cn/dev-api/asset-form/upload/images";
            }

            if (item.type === "accessory") {
                item.zcyToken = this.token;
                item.action = "http://platform.assetcloud.org.cn/dev-api/asset-form/upload/files";
            }
            if (item.type === "issueName") {
                item.options.defaultValue = this.userName.realName;
                item.options.userId = this.userId;
            }

        })

        console.log(JSON.stringify(this.jsonData));

    },

    getInfo() {

        let params = {
            form_model_id: this.formId
        };
        this.fullscreenLoading = true;

        get(`/dev-bmp/form_inst/v2/form_sheet`, params)
            .then(res => {
                console.log(res.data);
                if (res.data.code == 200) {
                    this.jsonData = JSON.parse(res.data.obj.form_json);
                    this.nextNodeIdList = res.data.obj.next_node_ids;
                    this.authItem = [];
                    this.formName = res.data.obj.formName;
                    this.roleIdLists = [];
                    res.data.obj.roleIdLists.forEach(item => {
                        let the_temp = [];
                        item.forEach(the_item => {
                            if (the_item != '')
                                the_temp.push(the_item)
                        })
                        this.roleIdLists.push(the_temp)
                    });


                    this.jobIdLists = [];

                    res.data.obj.userIdListsByJobIdLists.forEach((item, index) => {
                        let the_temp = [];
                        item.forEach((the_item, idx) => {
                            if (the_item != '') {
                                let node = {
                                    id: the_item,
                                    label: res.data.obj.userNameListsByJobIdLists[index][idx],
                                    children: []
                                };
                                the_temp.push(node);
                            }


                        });
                        this.jobIdLists.push(the_temp)
                    });


                    this.agencyIdLists = [];
                    res.data.obj.userIdListsByAgencyIdLists.forEach((item, index) => {
                        let the_temp = [];
                        item.forEach((the_item, idx) => {
                            if (the_item != '') {
                                let node = {
                                    id: the_item,
                                    label: res.data.obj.userNameListsByAgencyIdLists[index][idx],
                                    children: []
                                };
                                the_temp.push(node)
                            }
                        })
                        this.agencyIdLists.push(the_temp)
                    });


                    this.userIdLists = [];
                    res.data.obj.userIdLists.forEach((item, index) => {
                        let the_temp = [];
                        item.forEach((the_item, idx) => {
                            if (the_item != '') {
                                let node = {
                                    id: the_item,
                                    label: res.data.obj.userNameLists[index][idx],
                                    children: []
                                };
                                the_temp.push(node)
                            }

                        })
                        this.userIdLists.push(the_temp)
                    });


                    this.next_node_names = res.data.obj.next_node_names;

                    this.nextNodeIdList.forEach((item, index) => {

                        let iatem = {
                            id: index,
                            name: item,
                            isCur: index == 0 ? true : false
                        };
                        let iatem1 = {
                            id: item,
                            title: this.next_node_names[index] == '' ? "下一节点" : this.next_node_names[index],
                        };

                        this.authItem.push(iatem);

                        this.dialogShowAll.sendData.roleList.push(iatem1);

                        if (index == 0) {
                            this.dialogShowAll.sendData.roleId = item;
                        }


                        this.dataU[index] = [];
                        this.valueU[index] = [];


                        this.dataJ[index] = [];
                        this.valueJ[index] = [];

                        this.dataG[index] = [];
                        this.valueG[index] = [];

                        this.dataB[index] = [];
                        this.valueB[index] = [];


                    });


                    this.setImgInfo();
                } else {
                    // this.goback();
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
                this.goback();
            });
    },

    getDraftInfo() {
        let params = {
            draftId: this.draftId
        };
        this.fullscreenLoading = true;

        get(`/dev-bmp/form_inst/draftDetail`, params)
            .then(res => {
                console.log(res.data);
                if (res.data.code == 200) {

                    this.jsonData = JSON.parse(res.data.obj.formInstSheet);
                    this.values = JSON.parse(res.data.obj.formInstValue);
                    this.nextNodeIdList = res.data.obj.nextNodeIds;
                    this.formId = res.data.obj.formModelId;
                    this.authItem = [];
                    this.formName = res.data.obj.formName;
                    this.roleIdLists = [];
                    // res.data.obj.roleIdLists.forEach(item => {
                    //     let the_temp = [];
                    //     item.forEach(the_item => {
                    //         if (the_item != '')
                    //             the_temp.push(the_item)
                    //     })
                    //     this.roleIdLists.push(the_temp)
                    // });


                    this.jobIdLists = [];

                    res.data.obj.userIdListsByJobIdLists.forEach((item, index) => {
                        let the_temp = [];
                        item.forEach((the_item, idx) => {
                            if (the_item != '') {
                                let node = {
                                    id: the_item,
                                    label: res.data.obj.userNameListsByJobIdLists[index][idx],
                                    children: []
                                };
                                the_temp.push(node);
                            }


                        });
                        this.jobIdLists.push(the_temp)
                    });


                    this.agencyIdLists = [];
                    res.data.obj.userIdListsByAgencyIdLists.forEach((item, index) => {
                        let the_temp = [];
                        item.forEach((the_item, idx) => {
                            if (the_item != '') {
                                let node = {
                                    id: the_item,
                                    label: res.data.obj.userNameListsByAgencyIdLists[index][idx],
                                    children: []
                                };
                                the_temp.push(node)
                            }
                        })
                        this.agencyIdLists.push(the_temp)
                    });


                    this.userIdLists = [];
                    res.data.obj.userIdLists.forEach((item, index) => {
                        let the_temp = [];
                        item.forEach((the_item, idx) => {
                            if (the_item != '') {
                                let node = {
                                    id: the_item,
                                    label: res.data.obj.userNameLists[index][idx],
                                    children: []
                                };
                                the_temp.push(node)
                            }

                        })
                        this.userIdLists.push(the_temp)
                    });
                    // debugger;


                    this.next_node_names = res.data.obj.nextNodeNames;

                    this.nextNodeIdList.forEach((item, index) => {

                        let iatem = {
                            id: index,
                            name: item,
                            isCur: index == 0 ? true : false
                        };
                        let iatem1 = {
                            id: item,
                            title: this.next_node_names[index] == '' ? "下一节点" : this.next_node_names[index],
                        };

                        this.authItem.push(iatem);

                        this.dialogShowAll.sendData.roleList.push(iatem1);

                        if (index == 0) {
                            this.dialogShowAll.sendData.roleId = item;
                        }


                        this.dataU[index] = [];
                        this.valueU[index] = [];


                        this.dataJ[index] = [];
                        this.valueJ[index] = [];

                        this.dataG[index] = [];
                        this.valueG[index] = [];

                        this.dataB[index] = [];
                        this.valueB[index] = [];


                    });


                    this.setImgInfo();
                } else {
                    this.goback();
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
                this.goback();
            });
    },

    saveCopyTo(info){
        this.copyToList=info;
        // console.log( this.copyToList)
        this.dialogShowCopyTo.value=false;
    },

    showCopyTo(){
        get('dev-api/asset-user/user/get/person/tenantCode/v2',{}) .then(res => {
            this.dialogShowCopyTo.value=true;
            let data=res.data.data;

            let list=[];
            data.forEach(item=>{
                list.push({
                    id:item.id,
                    label:item.userName,
                })
            });
            this.copyToInfo=list;
            setTimeout(()=>{
                this.$refs.ApprovalCopyTo.handleSelection(this.copyToList);
                this.$refs.ApprovalCopyTo.$refs.list.$refs.tree.setCheckedNodes(this.copyToList);
            },200);

        }).catch(err => {
            // console.log(err);
            this.fullscreenLoading = false;
            this.$message.error({
                message: "获取数据失败",
                duration: 700
            });
            this.goback();
        });

    },

    goback() {
        this.$router.go(-1);
    },
    
    closeNextDialog() {
        this.dialogShowAll.value = false;
    }

  }
}
</script>

<style lang="scss" scoped>
.issue {
  width: 100%;
  min-height: 100vh;
  /*height: 100%;*/
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  margin-top: 4px;
  background-color: white;
  padding: 2% 196px;

  &__title {
    height: 33px;
    font-size: 24px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(48, 49, 51, 1);
    line-height: 33px;
    text-align: center;
  }

  &__body {
    margin-top: 1rem;
    width: 100%;
  }

  &__button {
    width: 100%;
    text-align: center;
  }
}

.diy-tab {
  border-bottom: 3px solid rgba(21, 74, 216, 1);
  display: flex;
  justify-content: flex-start;

  &__item {
    width: 10%;
    min-width: 80px;
    max-width: 120px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-radius: 4px 4px 0px 0px;
    cursor: pointer;

    &--is-active {
      background: rgba(21, 74, 216, 1);
      color: rgba(255, 255, 255, 1);
    }

    &--is-noactive {
      color: rgba(153, 153, 153, 1);
    }
  }
}

.issue__button_wrapper {
  display: flex;
  justify-content: space-between;
}

.issue_button {
  width:144px;
  height:38px; 
  margin-left: 58px;
  color: white;
  font-weight:bold;
  background-color: #154AD8;
}
</style>