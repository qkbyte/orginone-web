<template>
  <el-dialog
    title="查看公告"
    :visible.sync="dialogShow.value"
    width="600px"
    class="dialog-person"
    :close-on-click-modal="false"
    :append-to-body="true"
    @close="handleClose"
  >
    <el-form class="demo-ruleForm" label-width="100px" ref="ruleForm">
      <el-form-item label="通知类型：" prop="alertTitle">
        <div
          v-if="ruleForm.noticeUnitIds[0].type == 1"
          class="layout-content__blue"
        >
          信息上报
        </div>
        <div
          v-if="ruleForm.noticeUnitIds[0].type == 2"
          class="layout-content__green"
        >
          日常通知
        </div>
        <div
          v-if="ruleForm.noticeUnitIds[0].type == 3"
          class="layout-content__red"
        >
          安全生产
        </div>
        <div
          v-if="ruleForm.noticeUnitIds[0].type == 4"
          class="layout-content__orange"
        >
          信息审核
        </div>
      </el-form-item>
      <el-form-item label="标题：" prop="alertTitle">
        <div>{{ ruleForm.noticeTitle }}</div>
      </el-form-item>
      <el-form-item label="通知内容：" prop="alertContent">
        <div>{{ ruleForm.noticeContent }}</div>
      </el-form-item>
      <el-form-item label="附件列表:" prop="alertBusiness" style="margin-left:-10px">
        <!-- <div>{{ ruleForm.alertBusiness }}</div> -->
        <a
          v-for="(item, index) in form"
          :key="index"
          :href="item.link"
          :download="item.name + '.pdf'"
          ><ul>
            <li>{{ item.name }}</li>
          </ul></a
        >
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { marketappalertCheckAlert } from "@api/market";
export default {
  name: "TheAppDialog",
  data() {
    return {
      ruleForm: {
        receiver: "",
        title: "",
        content: "",
        url: "",
        readStatus: null,
      },
      form: [
        {
          name:
            "浙江省财政厅关于印发《浙江省省级行 政事业单位房产出租管理暂行办法》的通知",
          link: "../word/four.pdf",
        },
        {
          name:
            "中共浙江省委办公厅 浙江省人民政府办公 厅关于印发《浙江省党政机关办公用房管理实施 办法》的通知",
          link: "../word/three.pdf",
        },
        {
          name: "关于在全省工程建设领域改革保证金制度的通知",
          link: "../word/wordone.pdf",
        },
        {
          name:
            "国家发展改革委 住房城乡建设部关于 印发党政机关办公用房建设标准的通知",
          link: "../word/wordtwo.pdf",
        },
      ],
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.ruleForm = this.dialogShow.sendData;
    });
  },
  methods: {
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },
  },
};
</script>

<style lang="scss" scoped>
ul,li {
  list-style: unset;
  margin-left: 10px;
}
a {
  display: block;
}
.diy-dialog-footer .el-button:first-child {
  margin-right: 40px;
}
.demo-ruleForm {
  padding-right: 40px;
  padding-top: 30px;
  .width {
    width: 400px;
  }
}
.url {
  color: #0023e5;
  cursor: pointer;
  text-decoration: underline;
  &:hover {
    color: #0023e5;
  }
}
::v-deep .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /*height:600px;*/
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}
::v-deep .el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}
</style>
