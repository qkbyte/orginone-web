<template>
  <div>
    <DiyBoxLayout class="unit-info">
      <div class="flex-between">
        <TheGroupSelect></TheGroupSelect>
        <div>
          <!-- <el-button type="text" @click="handleEditTenantInfo"
            >编辑集团信息</el-button
          > -->
        </div>
      </div>
      <div class="unit-info__content">
        <div class="unit-info__content--body">
          <el-row type="flex" class="unitInfoRow">
            <div class="unitInner">
              集团描述:
              <span style="margin-left:8px">{{ unitInfo.linkMan }}</span>
            </div>
          </el-row>
        </div>
      </div>
    </DiyBoxLayout>

    <DiyBoxLayout class="unit-table">
      <template v-slot:table>
        <DiyTable
          ref="table"
          :tableHead="tableHead"
          :tableName="tableName"
          :options="options"
          :tableData="tableData"
          @handleUpdate="loadData"
        >
          <template v-slot:buttons>
            <el-button @click="goApplyRecord" type="text">查看申请</el-button>
            <el-button @click="handleJoinGroup" type="text"
              >加入上级集团</el-button
            >
          </template>
          <template v-slot:operate="scope">
            <TheTableButton
              :data="scope.row"
              :isOwner="scope.row.tenantCode == curTenantCode"
              @handleTransfer="handleTransfer"
              @handleDisband="handleDisband"
              @updateData="loadGroupList"
            ></TheTableButton>
          </template>
          <template v-slot:icon="scope">
            <i :class="scope.row.source"></i>
          </template>
        </DiyTable>
      </template>
    </DiyBoxLayout>

    <template v-for="item in dialogShow">
      <TheApplyJoinGroupDialog
        v-if="item.key === 'join' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheApplyJoinGroupDialog>
      <TheCreateGroupDialog
        v-if="item.key === 'apply' && item.value"
        :key="item.key"
        :dialogShow="item"
        @handleUpdate="loadData"
        @closeDialog="handleCloseDialog"
      ></TheCreateGroupDialog>
      <editUnitInfo
        v-if="item.key === 'editTenant' && item.value"
        :key="item.key"
        :dialogShow="item"
        :tenantInfo="unitInfo"
        @freshUnitInfo="loadUnitInfo"
        @closeDialog="closeDialog"
      ></editUnitInfo>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getTenantInfoDetail } from "@api/tenant";
import { getGroupAddGroupList, tenantApplyGroup, applyGroup } from "@api/group";
import TheGroupSelect from "../components/TheGroupSelect";
import DiyTable from "@components/DiyTable/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheApplyJoinGroupDialog from "./components/TheApplyJoinGroup";
import editUnitInfo from "./components/editUnitInfo";
import TheTableButton from "./components/TheTableButton";

export default {
  data() {
    let _this = this;
    return {
      dialogShow: [
        {
          key: "join",
          value: false,
        },
        {
          key: "apply",
          value: false,
        },
        {
          key: "editTenant",
          value: false,
        },
      ],
      tableName: "上级集团列表",
      tableData: [],
      tableHead: [
        {
          prop: "groupName",
          label: "集团名称",
          width: "240",
        },
        {
          prop: "groupDescription",
          label: "集团描述",
          width: "330",
        },
        {
          prop: "tenantName",
          label: "管理单位",
          width: "240",
        },
        {
          prop: "createTime",
          label: "加入时间",
          minWidth: "180",
        },
        {
          type: "slot",
          label: "操作",
          fixed: "right",
          align: "center",
          width: "80",
          name: "operate",
        },
      ],
      options: {
        checkBox: true,
        order: true,
        defaultSort: { prop: "createTime", order: "descending" },
        treeProps: {
          children: "children",
          hasChildren: "hasChildren",
        },
      },
      unitInfo: {},
      filterText: "",
    };
  },
  components: {
    DiyTable,
    DiyBoxLayout,
    TheApplyJoinGroupDialog,
    editUnitInfo,
    TheTableButton,
    TheGroupSelect,
  },
  created() {
    this.$nextTick(() => {
      this.loadData();
    });
  },
  mounted() {},
  computed: {
    ...mapGetters("tenant", ["curTenantCode", "curTenantId"]),
    ...mapGetters("group", ["curGroupId"]),
    getFilterText() {
      return this.$store.state.searchContent;
    },
  },
  watch: {
    getFilterText(val) {
      this.filterText = val;
      this.loadData();
    },
  },
  methods: {
    /**
     * 载入数据入口
     */
    loadData() {
      this.loadGroupInfo();
      this.loadGroupList();
    },

    /**
     * 获取单位信息
     */
    loadGroupInfo() {
      let data = {
        tenantId: this.curTenantId,
      };
      getTenantInfoDetail(data).then((res) => {
        this.unitInfo = res.data.data;
      });
    },

    /**
     * 获取单位加入和创建的集团列表
     */
    loadGroupList() {
      this.$refs.table.loading = true;
      const { currentPage, pageSize } = this.$refs.table.page;
      let params = {
        current: currentPage,
        size: pageSize,
        groupId: this.curGroupId,
        groupName: this.filterText,
      };
      getGroupAddGroupList(params).then((res) => {
        const { records, total } = res.data.data;
        this.tableData = records;
        this.$refs.table.page.total = total;
        this.$refs.table.loading = false;
      });
    },

    /**
     * 查看集团申请上级集团历史记录
     */
    goApplyRecord() {
      this.$router.push({
        name: "group-apply-group",
      });
    },

    /**
     * 加入上级集团
     */
    handleJoinGroup() {
      this.dialogShow.map((el) => {
        if (el.key === "join") {
          el.value = true;
        }
      });
    },

    /**
     * 移交集团
     */
    handleTransfer() {},
    /**
     * 编辑单位信息
     */
    handleEditTenantInfo() {
      this.dialogShow.map((el) => {
        if (el.key === "editTenant") {
          el.value = true;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.unit-info {
  padding-top: 20px;
  padding-bottom: 20px;

  &__title {
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: rgba(48, 49, 51, 1);
  }

  &__content {
    &--header {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: bold;
      line-height: 22px;
      color: rgba(48, 49, 51, 1);

      div + div {
        margin-left: 20px;
      }

      .img-box {
        padding: 5px;
        width: 50px;
        height: 50px;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    &--body {
      margin-left: 70px;

      .unitInner {
        min-width: 200px;
        font-size: 14px;
        height: 20px;
        line-height: 20px;
        margin-right: 80px;
        padding: 20px 0;
      }
      .unitInnerBottom {
        margin-bottom: 12px;
      }
    }
  }
}
.unitInfotitle {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}
</style>
<style lang="scss">
.unit-table {
  .el-divider--vertical {
    width: 2px;
    height: 2em;
    margin: 0 24px;
  }
}
</style>
