<template>
  <div>
    <div class="main-info">
      <div class="main-info__con">
        <el-form
          :model="dynamicValidateForm"
          :inline="true"
          :rules="rules"
          ref="dynamicValidateForm"
        >
          <el-form-item label="表单名称：" prop="input">
            <el-input
              v-model="dynamicValidateForm.input"
              placeholder="请输入表单名称"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="表单分组：">
            <el-select
              :disabled="groupdisabled"
              v-model="dynamicValidateForm.group"
              placeholder="请选择表单分组（若不选择默认未分组）"
            >
              <el-option
                v-for="item in options"
                :key="item.groupId"
                :label="item.groupName"
                :value="item.groupId"
              >
                <span style="float: left">{{ item.groupName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.groupId
                }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <div>
          <el-button @click="back">返回发布页面 </el-button>

          <el-button type="primary" @click="getjson()"
            >{{ buttonName }}
          </el-button>
        </div>
      </div>
    </div>
    <div class="main-form">
      <fm-making-form upload ref="makingform" preview>
        <template slot="action"></template>
      </fm-making-form>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import DiyTitle from "@components/DiyTitle/index";

export default {
  name: "formDesign",
  data() {
    return {
      appid: "",
      group: "",
      formName: "",
      formid: "",
      formjson: "",
      input: "",
      dynamicValidateForm: {
        input: "",
        group: 0,
      },
      storage: "",
      rules: {
        input: [{ required: true, message: "请输入表单名称", trigger: "blur" }],
      },
      //是否修改，为0保存表单，为1修改表单
      wheaterModifier: 0,
      groupdisabled: false,
      options: [],
      buttonName: "保存表单",
    };
  },
  components: {
    DiyTitle,
  },
  mounted() {
    this.$nextTick(function() {
      this.getinitalize(1);
      this.getJoinAndCreateGroupList(1);
    });
  },
  computed: {
    ...mapState("user", ["userId"]),
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  methods: {
    //得到路由传过来的参数
    getinitalize() {
      if (this.formjson) {
        this.dynamicValidateForm.input = this.formName;
        this.dynamicValidateForm.group = this.group;
        this.$refs.makingform.setJSON(JSON.parse(this.formjson));
        this.wheaterModifier = 1;
        this.groupdisabled = true;
        this.buttonName = "修改表单";
      }
    },
    getJoinAndCreateGroupList() {},
    /**获取设计器json数据**/
    getjson() {
      this.storage = this.$refs.makingform.getJSON();
      this.$refs.dynamicValidateForm.validate((valid) => {
        if (valid) {
          //如果新创建，则保存表单
          if (this.wheaterModifier == 0) {
            var Params = {
              icon_cls: "",
              app_id: "1f15ab23-f477-11e9-90e4-0242ac120006",
              form_name: this.dynamicValidateForm.input,
              form_sheet: JSON.stringify(this.storage),
              created_by: this.userId,
              tenant_id: this.curTenantCode,
            };
            //              url: "/dev-bmp/form_model/save",
            this.$ajax({
              url: "/dev-bmp/form_model/save",
              method: "POST",
              contentType: "application/json; charset=utf-8",
              data: Params,
            })
              .then((res) => {
                if (res.data.obj.id) {
                  this.$root.appid = res.data.obj.id;
                  this.$message({
                    type: "success",
                    message: "保存成功",
                  });
                  this.$router.push({
                    path: "/light-app/issue_form",
                  });
                  //添加到权限中
                } else {
                  this.$message({
                    type: "error",
                    message: "保存失败",
                  });
                }
              })
              .catch((error) => {});
          }
          //修改表单
          else {
          }
        } else {
          return false;
        }
      });
    },
    back() {
      this.$router.push({
        path: "/light-app/issue_form",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main-info {
  width: 100%;
  height: 100px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 6px 10px rgba(5, 36, 83, 0.06);
  border-radius: 4px;
  margin-top: 30px;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__con {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 25px;
  }
}

.main-form {
  margin-top: 30px;
}
</style>

<style lang="scss" scoped>
.main-form::v-deep .icon {
  display: inline !important;
}

.fm2-container {
  height: 600px;
  border: none;
  box-shadow: 0px 6px 10px rgba(5, 36, 83, 0.06);
  border-radius: 4px;
  padding: 20px;
}

.main-form::v-deep .center-container {
  border: none;
}

.main-form::v-deep > section > main > section ::-webkit-scrollbar-thumb {
  height: 0px;
  border-radius: 4px;
  background: #e7e7e7;
}

.main-form::v-deep > section > main > section > section:nth-child(2) .el-main {
  border-left: 2px solid #e4e7ed;
  border-bottom: 2px solid #e4e7ed;
}

.main-form::v-deep .widget-form-list {
  border-color: #d9d9d9;
}

.main-form::v-deep .el-footer {
  display: none;
}
</style>
