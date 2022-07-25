<template>
  <div>
    <div class="main-con">
      <div class="diy-tab">
        <div
          class="diy-tab__item"
          :class="
            item.isCur
              ? 'diy-tab__item--is-active'
              : 'diy-tab__item--is-noactive'
          "
          @click="changeTab(item)"
          v-for="item in tabItems"
          :key="item.id"
          v-loading.fullscreen.lock="fullscreenLoading"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="diy-table">
        <div class="diy-table__header">
          <div class="header-title"><i class="el-icon-s-order"></i> 列表</div>
          <div class="header-buttons"></div>
        </div>
        <div class="diy-table__body">
          <div class="diy-table__body-box">
            <el-table
              ref="multipleTable"
              :data="tableData"
              :header-cell-style="getRowClass"
              tooltip-effect="dark"
              style="width: 100%;"
              @selection-change="handleSelectionChange"
              stripe
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column
                prop="title"
                label="名称"
                width="180"
                show-overflow-tooltip
              ></el-table-column>
              <!--              <el-table-column-->
              <!--                prop="executor"-->
              <!--                label="来源"-->
              <!--                width="120"-->
              <!--              ></el-table-column>-->
              <el-table-column
                prop="content"
                label="类型"
                width="120"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column prop="status" label="状态" width="120">
                <template slot-scope="scope"
                  >{{ scope.row.status ? "已完结" : "处理中" }}
                </template>
              </el-table-column>
              <el-table-column label="日期">
                <template slot-scope="scope"
                  >{{ scope.row.executeTime }}
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                fixed="right"
                align="center"
                min-width="230"
              >
                <template slot-scope="scope">
                  <!--                  <el-button-->
                  <!--                    v-show="ispassShow"-->
                  <!--                    @click="handlePassClick(scope.row, 1)"-->
                  <!--                    type="text"-->
                  <!--                    size="small"-->
                  <!--                    icon="el-icon-check"-->
                  <!--                    >通过-->
                  <!--                  </el-button>-->
                  <el-button
                    type="text"
                    v-show="ispassShow"
                    size="small"
                    icon="el-icon-edit"
                    @click="goToWriteForm(scope.row)"
                    >内容
                  </el-button>
                  <!--                  <el-button-->
                  <!--                    @click="hanleSeeClick(scope.row)"-->
                  <!--                    v-show="ispassShow"-->
                  <!--                    type="text"-->
                  <!--                    size="small"-->
                  <!--                    icon="el-icon-view"-->
                  <!--                    >查看-->
                  <!--                  </el-button>-->
                  <!--                  <el-button-->
                  <!--                    v-show="ispassShow"-->
                  <!--                    type="text"-->
                  <!--                    size="small"-->
                  <!--                    icon="el-icon-close"-->
                  <!--                    @click="handlePassClick(scope.row, 0)"-->
                  <!--                    >退回-->
                  <!--                  </el-button>-->
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="diy-table__footer">
          <div class="footer-buttons">
            <!--            <div>-->
            <!--              <el-button icon="el-icon-search">全选</el-button>-->
            <!--            </div>-->
            <!--            <div>-->
            <!--              <el-button icon="el-icon-search">反选</el-button>-->
            <!--            </div>-->
            <!--            <div>-->
            <!--              <el-select-->
            <!--                class="select-options"-->
            <!--                v-model="operateItem"-->
            <!--                placeholder="批量操作"-->
            <!--              >-->
            <!--                <el-option-->
            <!--                  v-for="item in optionsOperate"-->
            <!--                  :key="item.value"-->
            <!--                  :label="item.label"-->
            <!--                  :value="item.value"-->
            <!--                ></el-option>-->
            <!--              </el-select>-->
            <!--            </div>-->
          </div>
          <div class="footer-pagination">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageSize"
              :pager-count="5"
              layout="prev, pager, next,sizes"
              :total="Total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import DiyTitle from "@components/DiyTitle/index";
import { showMessageList } from "@api/flow-message";
import { get, post } from "@api/flow";

export default {
  data() {
    return {
      currentPage: 1,
      Total: 10,
      pageSize: 10,
      ispassShow: false,
      tabItems: [
        {
          id: "1",
          name: "待办",
          url: "",
          isCur: true,
        },
        {
          id: "2",
          name: "待阅",
          url: "",
          isCur: false,
        },
        {
          id: "3",
          name: "办结",
          url: "",
          isCur: false,
        },
        {
          id: "4",
          name: "已办",
          url: "",
          isCur: false,
        },
      ],
      tableData: [],
      operateItem: "",
      optionsOperate: [
        {
          value: "选项1",
          label: "通过",
        },
        {
          value: "选项2",
          label: "退回",
        },
      ],
      multipleSelection: [],
      fullscreenLoading: false,
    };
  },
  components: {
    DiyTitle,
  },
  computed: {
    ...mapState("user", ["userId"]),
    ...mapGetters("tenant", ["curTenantCode"]),
    ...mapState(["sectionId", "allUsersId"]),
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.showList(0);
      this.ispassShow = 1;
    });
  },
  methods: {
    changeTab: function(obj) {
      if (obj.id != 4) {
        this.ispassShow = 1;
      } else {
        this.ispassShow = 0;
      }
      this.$route.query.index = obj.id;
      this.showList(obj.id - 1);
      this.tabItems.forEach(function(item) {
        if (item.id == obj.id) {
          item.isCur = true;
        } else {
          item.isCur = false;
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background:rgba(236,239,253,1);color:#333333;font-weight:bold";
      } else {
        return "";
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    handlePassClick(row, isAgree) {
      //通过按钮  页面再刷新一下
      let params = {
        approve_result: isAgree,
        form_inst_id: row.id,
        editor: this.userId,
        task_id: row.taskId,
        proc_inst_id: row.procInstId,
        form_model_id: row.formModelId,
        form_inst_sheet: JSON.parse(row.formInstSheetStr),
        form_inst_value: row.formInstValue,
      };
      post(`/dev-app/form_inst/approval_node`, params)
        .then((res) => {
          this.$message.success({
            message: isAgree == 1 ? "已通过" : "已驳回",
            duration: 700,
          });
          this.showList(this.ispassShow);
        })
        .catch((err) => {});
    },
    hanleSeeClick(value) {
      this.$router.push({ path: "/todo/approval", query: { msg: value } });
    },

    //去填写表单内容
    goToWriteForm(obj) {
      this.$router.push({
        path: "/light-app/write_form",
        query: {
          id: obj.formModelId,
          title: obj.title,
          procModelId: obj.procInstId,
          task_id: obj.id,
        },
      });
    },
    showList(index) {
      this.fullscreenLoading = true;
      let val = {
        num: 5,
        taskType: index | 0,
        userId: this.userId,
        tenantId: this.curTenantCode,
        sectionId: this.sectionId,
        curSectionUsers: this.allUsersId,
      };
      showMessageList(this.currentPage, this.pageSize, val).then((res) => {
        this.fullscreenLoading = false;
        this.tableData = res.data.obj.list;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main-search {
  width: 100%;
  height: 100px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 6px 10px rgba(5, 36, 83, 0.06);
  border-radius: 4px;
  margin-top: 30px;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &--left {
    width: 80%;
    display: flex;

    .input-content {
      width: 30%;
      min-width: 200px;
      max-width: 300px;
    }

    .select-state,
    .select-type {
      margin-left: 20px;
      width: 30%;
      min-width: 240px;
      max-width: 340px;
    }
  }
}

.main-con {
  width: 100%;
  margin-top: 30px;

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

  .diy-table {
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 6px 10px rgba(5, 36, 83, 0.12);
    border-radius: 4px;
    padding: 0 3% 5%;

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 70px;
      max-height: 100px;

      .header-title {
        font-size: 1.875rem;
        font-weight: bold;
        color: rgba(102, 102, 102, 1);

        i {
          font-size: 1.875rem;
          color: rgba(21, 74, 216, 1);
        }
      }
    }

    &__body {
      width: 100%;
      display: flex;

      &-box {
        width: 1vw;
        flex: auto;
      }
    }

    &__footer {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .footer-buttons {
        width: 350px;
        display: flex;
        justify-content: space-between;

        .select-options {
          width: 150px;
        }
      }
    }
  }
}
@media screen and (max-width: 1280px) {
  .diy-table__header{
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
