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
            v-show="curTab === '1'"
            style="margin-right:20px"
            type="text"
            @click="messageTableDelete"
            >删除</el-button
          >
          <el-button
            v-show="curTab === '1'"
            type="text"
            @click="messageTableAdd"
            >新增</el-button
          >
          <el-button
            v-show="curTab === '2'"
            style="margin-right:20px"
            type="text"
            @click="taskDelete"
            >删除</el-button
          >
          <el-button
            v-show="curTab === '3'"
            style="margin-right:20px"
            type="text"
            @click="announceDelete"
            >删除</el-button
          >
          <el-button v-show="curTab === '3'" type="text" @click="announceAdd"
            >新增</el-button
          >
          <el-button
            v-show="curTab === '4'"
            style="margin-right:20px"
            type="text"
            @click="SMSHistory"
            >历史记录</el-button
          >
          <el-button
            v-show="curTab === '4'"
            style="margin-right:20px"
            type="text"
            @click="SMSDelete"
            >删除</el-button
          >
          <el-button v-show="curTab === '4'" type="text" @click="SMSAdd"
            >新增</el-button
          >
        </div>
      </div>
      <TheMessageTable v-if="curTab === '1'" ref="table"></TheMessageTable>
      <TheTaskWaring v-else-if="curTab === '2'" ref="taskWaring"></TheTaskWaring>
      <TheAnnounceTable
        v-else-if="curTab === '3'"
        ref="announceTable"
      ></TheAnnounceTable>
      <TheSMSTable v-else-if="curTab === '4'" ref="SMS"></TheSMSTable>
    </DiyBoxLayout>
  </div>
</template>

<script>
import DiyTitle from "@components/DiyTitle/index";
import TheMessageTable from "./components/TheMessageTable";
import TheTaskWaring from "./components/TheTaskWaring";
import TheAnnounceTable from "./components/TheAnnounceTable";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheSMSTable from "./components/TheSMSTable"
import DiyTabs from "@components/DiyTabs/index";
export default {
  data() {
    return {
      allType: [
        { id: "1", title: "私信" },
        { id: "2", title: "消息预警" },
        { id: "3", title: "通知公告" },
        { id: "4", title: "短信设置" },
      ],
      curTab: "1",
    };
  },
  components: {
    DiyBoxLayout,
    TheMessageTable,
    TheTaskWaring,
    TheAnnounceTable,
    TheSMSTable,
    DiyTitle,
    DiyTabs,
  },
  watch: {},
  created() {},
  mounted() {},
  computed: {},
  methods: {
    messageTableDelete() {
      this.$refs.table.handleMoreDel();
    },
    messageTableAdd() {
      this.$refs.table.handleAdd();
    },
    taskDelete() {
      this.$refs.taskWaring.handleDeletes();
    },
    announceDelete() {
      this.$refs.announceTable.handleDeletes();
    },
    announceAdd() {
      this.$refs.announceTable.handleAdd();
    },
    SMSDelete(){
      this.$refs.SMS.handleDeletes();
    },
    SMSAdd(){
      this.$refs.SMS.handleAdd();
    },
    SMSHistory(){
      this.$router.push({name: 'message-history'})
    }
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
