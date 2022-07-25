<template>
  <div class="flex-column">
    <DiyBoxLayout class="unit-info">
      <div class="flex-between">
        <div class="unit-info__title">单位信息 </div>
        <div>
          <el-button
            v-if="roleId == '2' || roleId == '1'"
            type="text"
            @click="handleView"
            >查看更多</el-button
          >
          <el-button
            v-if="roleId == '2' || roleId == '1'"
            type="text"
            @click="handleEditTenantInfo"
            >编辑单位信息</el-button
          >
        </div>
      </div>
      <div class="unit-info__content" style="margin-top:20px;">
        <div class="unit-info__content--header">
          <!-- <div class="img-box">
            <img :src=" unitInfo.img ? unitInfo.img : require('@assets/system/default-company.png')" />
          </div> -->
          <div class="img-default">{{ name }}</div>
          <div class="unitNameBox">{{ unitInfo.unitName }}</div>
        </div>
        <div class="unit-info__content--body">
          <el-row type="flex" class="unitInfoRow">
            <div class="unitInner">
              单位联系人:
              <span style="margin-left:8px">{{ unitInfo.linkMan }}</span>
            </div>
            <div class="unitInner">
              法人代表:
              <span style="margin-left:8px">{{
                unitInfo.corporateRepresentative
              }}</span>
            </div>
            <div class="unitInner">
              统一社会信用代码:
              <span style="margin-left:8px">
                {{ unitInfo.socialCreditCode }}
              </span>
            </div>
          </el-row>
          <el-row type="flex" class="unitInfoRow" style="height:40px">
            <div class="unitInner" style="margin:0px">
              单位编码:
              <span
                class="code"
                >{{ unitInfo.unitCode }}</span
              >
            </div>
            <div class="unitInner">
              联系方式:
              <span style="margin-left:8px">{{ unitInfo.linkPhone }}</span>
            </div>
            <div class="unitInner unitInnerBottom">
              单位地址:
              <span style="margin-left:8px">{{ unitInfo.province }}</span>
              <span style="margin-left:8px">{{ unitInfo.city }}</span>
              <span style="margin-left:8px">{{ unitInfo.streetAddress }}</span>
            </div>
          </el-row>
          <el-row type="flex" class="unitInfoRow">
            <div class="unitInner">
              区划编码:
              <span style="margin-left:8px">{{
                unitInfo.administrationDivisionCode
              }}</span>
            </div>
            <div class="unitInner">
              区划名称:
              <span style="margin-left:8px">{{
                administrationDivisionName
              }}</span>
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
          :hasTabs="true"
          @handleUpdate="loadData"
        >
          <template v-slot:slot-tabs>
            <DiyTabs
              ref="type-list"
              :tabList="allType"
              :curTab.sync="curTab"
            ></DiyTabs>
          </template>
          <template v-slot:buttons>
            <el-button @click="goApplyRecord" type="text">查看申请</el-button>
            <el-button @click="handleJoinGroup" type="text">加入集团</el-button>
            <el-button @click="handleCreateGroup" type="text"
              >创建集团</el-button
            >
          </template>
          <template v-slot:operate="scope" v-if="CURRENT_ENV !== 'production'">
            <TheTableButton
              v-if="scope.row.isCreate == 1"
              :data="scope.row"
              :isOwner="scope.row.tenantCode == curTenantCode"
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
        @closeDialog="handleCloseDialog"
      ></editUnitInfo>
      <TheViewDialog
        v-if="item.key === 'view' && item.value"
        :key="item.key"
        :dialogShow="item"
        :tenantInfo="unitInfo"
        @closeDialog="handleCloseDialog"
      ></TheViewDialog>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { getTenantInfoDetail } from "@api/tenant";
import { getJoinAndCreateGroupList, applyGroup } from "@api/group";
import DiyTable from "@components/DiyTable/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheApplyJoinGroupDialog from "./components/TheApplyJoinGroup";
import TheCreateGroupDialog from "./components/TheCreateGroupDialog";
import editUnitInfo from "./components/editUnitInfo";
import TheViewDialog from "./components/TheViewDialog";
import TheTableButton from "./components/TheTableButton";
import DiyTabs from "@components/DiyTabs/index";
export default {
  data() {
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
        {
          key: "view",
          value: false,
        },
      ],
      tableName: "集团列表",
      tableData: [],
      tableHead: [
        {
          prop: "groupCode",
          label: "集团编码",
          width: "180",
        },
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
          prop: "unitName",
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
      allType: [
        { id: "1", title: "全部" },
        { id: "2", title: "创建的" },
        { id: "3", title: "已加入" },
      ],
      curTab: "1",
      count: 1,
      name: "",
      administrationDivisionName: "",
    };
  },
  components: {
    DiyTable,
    DiyBoxLayout,
    TheApplyJoinGroupDialog,
    TheCreateGroupDialog,
    editUnitInfo,
    TheTableButton,
    TheViewDialog,
    DiyTabs,
  },
  created() {
    this.$nextTick(() => {
      this.loadData();
    });
  },
  mounted() {},
  computed: {
    ...mapGetters("tenant", ["curTenantCode", "curTenantId"]),
    ...mapState("user", ["isCreated","roleId"]),
    getFilterText() {
      return this.$store.state.searchContent;
    },
  },
  watch: {
    curTab(val) {
      switch (val) {
        case "1":
          this.count = 1;
          break;
        case "2":
          this.count = 2;
          break;
        case "3":
          this.count = 3;
          break;
      }
      this.loadData();
    },
    getFilterText(val) {
      this.filterText = val;
      this.loadGroupList('search');
    },
  },
  methods: {
    handleCloseDialog(key) {
      this.dialogShow.map((el) => {
        if (el.key === key) {
          el.value = false;
        }
      });
    },
    //载入数据入口
    loadData() {
      this.loadUnitInfo();
      this.loadGroupList();
    },

    //获取单位信息
    loadUnitInfo() {
      let data = {
        tenantId: this.curTenantId,
      };
      getTenantInfoDetail(data).then((res) => {
        this.unitInfo = res.data.data;
        this.name = this.unitInfo.unitName.substr(0, 1);
        this.administrationDivisionName = this.unitInfo.administrationDivisionName.replace(
          /,/g,
          " "
        );
      });
    },

    //获取单位加入和管理的集团列表
    loadGroupList(str) {
      this.$refs.table.loading = true;
      let currentPage = 1;
      let pageSize = 20;
      if (str) {
        pageSize = this.$refs.table.page.pageSize;
        this.$refs.table.page.currentPage = 1;
      } else {
        currentPage = this.$refs.table.page.currentPage;
        pageSize = this.$refs.table.page.pageSize;
      }
      let params = {
        current: currentPage,
        size: pageSize,
        tenantId: this.curTenantId,
        groupName: this.filterText,
        type: this.count,
      };
      getJoinAndCreateGroupList(params).then((res) => {
        const { records, total } = res.data.data;
        this.tableData = records;
        this.$refs.table.page.total = total;
        this.$refs.table.loading = false;
      });
    },

    //查看租户申请集团历史记录
    goApplyRecord() {
      this.$router.push({
        name: "tenant-apply-group",
      });
    },

    //创建集团
    handleCreateGroup() {
      this.dialogShow.map((el) => {
        if (el.key === "apply") {
          el.value = true;
        }
      });
    },

    //加入集团
    handleJoinGroup() {
      this.dialogShow.map((el) => {
        if (el.key === "join") {
          el.value = true;
        }
      });
    },

    //编辑单位信息
    handleEditTenantInfo() {
      this.dialogShow.map((el) => {
        if (el.key === "editTenant") {
          el.value = true;
        }
      });
    },
    handleView(){
      this.dialogShow.map((el) => {
        if (el.key === "view") {
          el.value = true;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@styles/common.scss";
.code {
  margin-left: 8px;
  width: 205px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: -5px;
}
.unit-info {
  height: 280px;
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
      .img-default {
        width: 50px;
        height: 50px;
        @include background_color("background_color13");
        border-radius: 50%;
        text-align: center;
        font-size: 20px;
        line-height: 50px;
        color: #ffffff;
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
