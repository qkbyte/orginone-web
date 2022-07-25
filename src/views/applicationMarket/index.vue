<template>
  <div class="base-layout">
    <DiyBoxLayout class="layout">
      <div class="tabs">
        <div class="box">
          <el-button
            v-if="
              roleId !== '278' &&
                roleId &&
                '268' &&
                roleId !== '267' &&
                roleId !== '3'
            "
            type="primary"
            size="small"
            @click="goDevCenter"
            >开发者中心</el-button
          >
        </div>
      </div>
      <div class="tables">
        <UnitTable></UnitTable>
      </div>
    </DiyBoxLayout>
    <template v-for="item in dialogShow">
      <TheCreateGroupDialog
        v-if="item.key === 'apply' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheCreateGroupDialog>
    </template>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
// import { marketappList } from "@api/market"
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import DiyTabs from "@components/DiyTabs/index";
import JobsTable from "./appCenter/index";
import UnitTable from "./unitAppCenter/index";
import TheCreateGroupDialog from "./appCenter/components/TheCreateGroupDialog";
export default {
  data() {
    return {
      allType: [{ id: "1", title: "集团应用" }, { id: "2", title: "单位应用" }],
      curTab: "1",
      dialogShow: [
        {
          key: "apply",
          value: false,
        },
      ],
    };
  },
  components: {
    DiyBoxLayout,
    DiyTabs,
    JobsTable,
    UnitTable,
    TheCreateGroupDialog,
  },
  computed: {
    ...mapState("user", ["userName", "roleId"]),
    ...mapGetters("group", ["curGroupId"]),
  },
  methods: {
    goDevCenter() {
      this.$router.push({ name: "app-dev" });
    },
    //创建集团
    handleCreateGroup() {
      this.dialogShow.map((el) => {
        if (el.key === "apply") {
          el.value = true;
        }
      });
    },
  },
};
</script>
<style scoped>
.layout {
  display: flex;
  flex-direction: column;
}
.tables {
  width: 100%;
  flex: 1;
  height: 1px;
}
.tabs {
  display: flex;
  flex-direction: row-reverse;
}
.box {
  margin: 10px 20px 0 0;
}
</style>
