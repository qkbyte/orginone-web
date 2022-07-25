<template>
  <div class="base-layout">
    <DiyBoxLayout class="border">
      <div class="flex-between">
        <DiyTabs
          ref="type-list"
          :tabList="allType"
          :curTab.sync="curTab"
        ></DiyTabs>
        <div class="flex-row">
          <el-button
            v-show="curTab === '2'"
            style="margin-right: 20px"
            type="text"
            @click="dialogShow"
            >拒绝</el-button
          >
          <el-button v-show="curTab === '2'" type="text" @click="agreeApproval"
            >通过</el-button
          >
        </div>
      </div>
      <TheMessageTable v-if="curTab === '1'" ref="table"></TheMessageTable>
      <TheTaskWaring
        v-else-if="curTab === '2'"
        ref="taskWaringParent"
      ></TheTaskWaring>
      <TheAnnounceTable
        v-else-if="curTab === '3'"
        ref="announceTable"
      ></TheAnnounceTable>
      <!-- <TheSMSTable v-else-if="curTab === '4'" ref="SMS"></TheSMSTable> -->
    </DiyBoxLayout>
    <el-dialog title="请输入" :visible.sync="dialogFormVisible" width="30%">
      <el-form>
        <el-form-item label="拒绝理由:" label-width="80px">
          <el-input v-model="disagreement" style="width: 90%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="RefusedApproval">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import DiyTitle from "@components/DiyTitle/index";
import TheMessageTable from "./components/TheMessageTable";
import TheTaskWaring from "./components/TheTaskWaring";
import TheAnnounceTable from "./components/TheAnnounceTable";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import { success, fail } from "@api/configApproval";
// import TheSMSTable from "./components/TheSMSTable"
import DiyTabs from "@components/DiyTabs/index";
export default {
  data() {
    return {
      allType: [
        { id: "1", title: "全部" },
        { id: "2", title: "待办" },
        { id: "3", title: "已完成" },
      ],
      curTab: "1",
      disagreement: "",
      dialogFormVisible: false,
    };
  },
  components: {
    DiyBoxLayout,
    TheMessageTable,
    TheTaskWaring,
    TheAnnounceTable,
    // TheSMSTable,
    // DiyTitle,
    DiyTabs,
  },
  watch: {},
  created() {},
  mounted() {},
  computed: {},
  methods: {
    dialogShow(){
      this.dialogFormVisible=true;
      this.disagreement=""
    },
    RefusedApproval() {
        let disagreement = this.disagreement;
        // console.log(this.$refs.taskWaringParent);
        let selectlist = this.$refs.taskWaringParent.getTaskData();
        selectlist.forEach((item) => {
          item.disagreement = disagreement;
          let str = 0;
          switch (item.status) {
            case "审批中":
              str = 1;
              break;
            case "已通过":
              str = 3;
              break;
            case "未通过":
              str = 4;
              break;
            default:
              break;
          }
          let str2 = "";
          switch (item.type) {
            case "字典":
              str2 = 1;
              break;
            case "元数据":
              str2 = 2;
              break;
            default:
              break;
          }
          item.status = str;
          item.type=str2
        });
        // console.log("111111111111110", selectlist);
    if (selectlist.length) {
        fail(selectlist).then((res) => {
          // console.log("1111111111111",res)
          if (res.data.code === 200) {
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: "success",
            });
            this.dialogFormVisible=false
            this.$refs.taskWaringParent.loadData();
          } else {
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: "error",
            });
            return;
          }
        });
      } else {
        this.$message({
          showClose: true,
          message: "请选择一条数据",
          type: "error",
        });
        this.dialogFormVisible=false
        return;
      }
    },
    agreeApproval() {
      // console.log(this.$refs.taskWaringParent);
      let selectlist = this.$refs.taskWaringParent.getTaskData();
      // console.log(selectlist);
      selectlist.forEach((item) => {
        let str = 0;
        switch (item.status) {
          case "审批中":
            str = 1;
            break;
          case "已通过":
            str = 3;
            break;
          case "未通过":
            str = 4;
            break;
          default:
            break;
        }
        let str2 = "";
          switch (item.type) {
            case "字典":
              str2 = 1;
              break;
            case "元数据":
              str2 = 2;
              break;
            default:
              str2="未知"
              break;
          }
        item.status = str;
        item.type=str2;
      });
      if (selectlist.length) {
        success(selectlist).then((res) => {
          if (res.data.code === 200) {
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: "success",
            });
            this.$refs.taskWaringParent.loadData();
          } else {
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: "error",
            });
            return;
          }
        });
      } else {
        this.$message({
          showClose: true,
          message: "请选择一条数据",
          type: "error",
        });
        return;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.border-top {
  margin: 4px 4px 0 4px;
}
.border {
  display: flex;
  flex-direction: column;
}
</style>
