<template>
  <div class="flow-wrap" v-loading="loading">
    <el-card class="box-card">
      <div v-if="generateStartFormVisible">
        <fm-generate-form :data="startFormJson" ref="generateStartForm">
        </fm-generate-form>
      </div>
      <div v-if="noformFlag" class="tip">
        暂无可用的配置工单
      </div>
      <div class="flow-footer" v-if="generateStartFormVisible">
        <div style="margin-left: auto">
          <el-button
            icon="el-icon-close"
            @click="goBack"
            >取消</el-button>
          <el-button 
            icon="el-icon-check" 
            type="primary" 
            @click="doStartInstance">确定
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getAction, postAction } from "@/api/workordermanage";
import { Message } from "element-ui";
import { getProcessDefinition } from "@api/acttodo";

export default {
  name: "StartProcess",
  props: {},
  computed: {
    dialogStartProcessVisibleInChild: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      },
    },
  },
  data() {
    return {
      // fullscreen: true,
      generateStartFormVisible: false,
      noformFlag: false,
      loading: false,
      startFormJson: undefined,
      variables: undefined,
      showBusinessKey: false,
      businessKey: undefined,
      selectUserVisible: false,
      formKey: '',
      id: '',
      ccToVos: [],
    };
  },
  created() {
    if (!this.formKey) {
      // let hash = decodeURIComponent(window.location.hash)
      // let hashArr = hash.split('?')
      // if (hashArr && hashArr.length ) {
      //   let queryObj =  this.parseQuery(hashArr[1])
      //   if (Object.keys(queryObj).length) {
      //     this.id = queryObj.id
      //     this.formKey = queryObj.formKey
      //   }
      // }
      this.getProcessDefinitionParams()
    } else {
      this.initData();
    }
  },
  methods: {
    parseQuery(query) {
      var vars = query.split("&");
      let result = {}
      for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        result[pair[0]] = pair[1]
      }
      return result
    },
    getProcessDefinitionParams() {
      if (!this.formKey && !this.id ) {
        getProcessDefinition().then(res => {
          let processDefinition = res.data.data
          if (processDefinition.formKey && processDefinition.id) {
            this.formKey = processDefinition.formKey
            this.id = processDefinition.id
            this.initData()
          }
        }).catch(() => {
          // this.$message.error('暂无可配置的工单')
        })
      }
    },
    initData() {
      this.loading = true
      if (this.formKey) {
        getAction("/dev-api/asset-work-order/flowable/processDefinition/renderedStartForm", {
          processDefinitionId: this.id,
        }).then((res) => {
          const { data } = res.data;
          this.showBusinessKey = data.showBusinessKey;
          if (data.renderedStartForm) {
            this.startFormJson = JSON.parse(data.renderedStartForm);
            this.generateStartFormVisible = true;
            this.noformFlag = false
          } else {
            this.noformFlag = true
          }
          this.loading = false
        });
      }
      // else {
      //     this.fullscreen = false
      // }
    },
    doStartInstance() {
      if (this.$refs.generateStartForm) {
        this.$refs.generateStartForm
          .getData()
          .then((values) => {
            if (values && values != undefined) {
              let processInstanceFormData = JSON.stringify(values);
              let realValues = Object.assign(
                { processInstanceFormData },
                values
              );
              return postAction("/dev-api/asset-work-order/flowable/processInstance/start", {
                processDefinitionId: this.id,
                businessKey: this.businessKey,
                values: realValues,
                ccToVos: this.ccToVos,
                tenantId: this.$route.query.tenantId
              }).then(({ data }) => {
                Message.success(data.msg);
                this.$router.back(-1)
              });
            }
          })
          .catch((e) => {});
      } else {
        postAction("/dev-api/asset-work-order/flowable/processInstance/start", {
          processDefinitionId: this.id,
          businessKey: this.businessKey,
          ccToVos: this.ccToVos,
          tenantId: this.$route.query.tenantId
        }).then(({ data }) => {
          Message.success(data.msg);
          this.$router.back(-1)
        });
      }
    },
    goBack() {
      this.$router.back(-1)
    }
  },
};
</script>
<style >
  .tip {
    text-align: center;
    margin-top: -26px;
    font-size: 16px;
  }
  .flow-wrap {
    margin-top: 100px;
  }
  .box-card {
    padding-top: 40px;
    width: 800px;
    margin: 0 auto;
  }
  .flow-footer {
    display: flex;
    justify-content: end;
  }
</style>


