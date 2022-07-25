<template>
  <div>
    <DiyTitle></DiyTitle>
    <DiyBoxLayout>
      <template v-slot:tabs>
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="待办" name="待办"></el-tab-pane>
          <el-tab-pane label="待阅" name="待阅"></el-tab-pane>
          <el-tab-pane label="办结" name="办结"></el-tab-pane>
          <el-tab-pane label="已办" name="已办"></el-tab-pane>
        </el-tabs>
      </template>
      <template v-slot:table>
        <TheMessageTable
          v-show="activeName === '待办'"
          tableName="待办列表"
          v-bind:activeId="0"
        ></TheMessageTable>
        <TheMessageTable
          v-show="activeName === '待阅'"
          tableName="待阅列表"
          v-bind:activeId="1"
        ></TheMessageTable>
        <TheMessageTable
          v-show="activeName === '办结'"
          tableName="办结列表"
          v-bind:activeId="2"
        ></TheMessageTable>
        <TheMessageTable
          v-show="activeName === '已办'"
          tableName="已办列表"
          v-bind:activeId="3"
        ></TheMessageTable>
      </template>
    </DiyBoxLayout>
  </div>
</template>

<script>
import DiyTitle from "@components/DiyTitle/index";
import TheMessageTable from "./components/TheMessageTable";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";

export default {
  data() {
    return {
      activeName: "待办",
    };
  },
  components: {
    DiyTitle,
    TheMessageTable,
    DiyBoxLayout,
  },
  computed: {},
  created() {},
  mounted() {
    if (this.$route.query.title) this.activeName = this.$route.query.title;
  },
  methods: {},
};
</script>

<style lang="scss" scoped></style>
