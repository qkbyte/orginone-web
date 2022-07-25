<template>
  <div class="base-layout">
    <DiyBoxLayout>
      <template v-slot:table
        ><DiyTable
          ref="table"
          :tableName="tableName"
          :tableHead="tableHead"
          :options="options"
          :tableData="tableData"
          @handleUpdate="loadData"
          ><template v-slot:buttons>
            <el-button type="text" @click="handleDeleteRoles">删除</el-button>
          </template>
          <template v-slot:operate="scope">
            <TheTableButton
              :index="scope.index"
              :row="scope.row"
              @handleEdit="handleEdit"
              @handleDelete="handleDelete"
            ></TheTableButton>
          </template>
          <template v-slot:icon="scope">
            <i :class="scope.row.source"></i>
          </template>
        </DiyTable>
      </template>
    </DiyBoxLayout>

    <template v-for="item in dialogShow">
      <TheEditDialog
        v-if="item.key === 'edit' && item.value"
        :key="item.key"
        :dialogShow="item"
        @handleUpdate="loadData"
        @closeDialog="handleCloseDialog"
      ></TheEditDialog>
      <TheAddDialog
        v-if="item.key === 'add' && item.value"
        :key="item.key"
        :dialogShow="item"
        @handleUpdate="loadData"
        @closeDialog="handleCloseDialog"
      ></TheAddDialog>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import {
  getOrgansList,
  deleteOrgansList,
  deletesOrgansList,
  delOrgansList,
} from "@api/organization";
import { getUserInfoById } from "@api/user";
import { deleteTenantByTenantId } from "@api/tenant";
import DiyTable from "@components/DiyTable/index";
import TheEditDialog from "./components/TheEditDialog";
import TheAddDialog from "./components/TheAddDialog";
import DiyTitle from "@components/DiyTitle/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheTableButton from "./components/TheTableButton";
import Bus from "@utils/eventBus";
export default {
  data() {
    let _this = this;
    return {
      dialogShow: [
        {
          key: "auth",
          value: false,
        },
        {
          key: "edit",
          value: false,
        },
        {
          key: "add",
          value: false,
        },
      ],
      tableName: "单位列表",
      tableData: [],
      tableHead: [
        {
          prop: "id",
          label: "id",
          width: "200",
        },
        {
          prop: "unitName",
          label: "unitName",
          width: "200",
        },
        {
          prop: "socialCreditCode",
          label: "socialCreditCode",
          width: "200",
        },
        {
          prop: "linkMan",
          label: "linkMan",
          width: "200",
        },
        {
          prop: "linkPhone",
          label: "linkPhone",
          minWidth: "200",
        },
        {
          prop: "tenantId",
          label: "tenantId",
          width: "200",
        },
        {
          prop: "isDeleted",
          label: "isDeleted",
          width: "120",
        },
        {
          prop: "unitNameEn",
          label: "unitNameEn",
          width: "200",
        },

        {
          prop: "unitCode",
          label: "unitCode",
          width: "200",
        },
        {
          prop: "unitRemark",
          label: "unitRemark",
          width: "200",
        },
        {
          prop: "unitType",
          label: "unitType",
          width: "200",
        },
        {
          prop: "unitTypeCode",
          label: "unitTypeCode",
          width: "200",
        },
        {
          prop: "unitTypeName",
          label: "unitTypeName",
          width: "200",
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
      unitName: "",
      user: {},
      form: {
        id: "",
        unitName: "",
        socialCreditCode: "",
        tenantId: "",
        isDeleted: "",
      },
      filterText: "",
      searchData: "",
    };
  },
  components: {
    DiyTable,
    TheEditDialog,
    TheAddDialog,
    DiyBoxLayout,
    DiyTitle,
    TheTableButton,
  },
  created() {
    this.$nextTick(() => {
      this.getUser();
      this.loadData();
    });
  },
  mounted() {
    this.getSearchForm(this.form);
    Bus.$on("searchEnter", (target) => {
      this.filterText = target;
      this.searchData = "";
      this.loadData("search");
    });
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
    ...mapState("user", ["userId"]),
    ...mapState("options", ["formShow"]),
    getSearchData() {
      return this.$store.state.searchData;
    },
  },
  watch: {
    formShow(val) {
      if (val.load == false && val.show == false) {
        this.filterText = "";
        this.searchData = this.getSearchData;
        this.loadData();
      }
    },
  },
  methods: {
    ...mapActions("options", ["getSearchForm"]),
    async getUser() {
      let info = await getUserInfoById({
        id: this.userId,
      });
      this.user = info.data.data;
    },
    loadData(str) {
      this.$refs.table.loading = true;
      // const { currentPage, pageSize } = this.$refs.table.page;
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
      };
      if (this.filterText == "" && this.searchData !== "") {
        (params.unitName = this.searchData.unitName),
          (params.id = this.searchData.id);
        params.socialCreditCode = this.searchData.socialCreditCode;
        params.tenantId = this.searchData.tenantId;
        params.isDeleted = this.searchData.isDeleted;
      } else {
        params.unitName = this.filterText;
      }
      getOrgansList(params).then((res) => {
        const { records, total } = res.data.data;
        this.tableData = records;
        this.$refs.table.page.total = total;
        this.$refs.table.loading = false;
        if (
          this.$refs.table.tableData.length == 0 &&
          this.$refs.table.page.currentPage >= 2
        ) {
          this.$refs.table.page.currentPage -= 1;
          this.loadData();
        }
      });
    },
    /**
     * 按钮操作
     */
    handleAddUser() {
      this.dialogShow.map((el) => {
        if (el.key === "add") {
          el.value = true;
        }
      });
    },

    handleCloseDialog(val) {
      this.dialogShow.map((el) => {
        if (el.key == val) {
          el.value = false;
        }
      });
    },

    // handleDeleteRoles() {
    //   let tenantCode = [];
    //   let load = false
    //   this.$refs.table.multipleSelection.forEach((element) => {
    //     tenantCode.push(element.tenantCode);
    //     if(element.linkPhone == this.user.phoneNumber){
    //       load = true
    //     }
    //   });
    //   if (tenantCode.length === 0) {
    //     return this.$message.warning("请至少选择一个角色");
    //   }else{
    //     this.$confirm('此操作将永久所选单位, 是否继续?', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       let params = {
    //        tenantCode: tenantCode.join(","),
    //       };
    //       deleteTenantByTenantId(params).then((res) => {
    //         if(load){
    //           location.reload();
    //         }else{
    //           this.loadData()
    //         }
    //          this.$message.success("删除单位成功");
    //       });
    //     }).catch(() => {
    //       return
    //     });
    //   }
    // },

    handleDeleteRoles() {
      let ids = [];
      this.$refs.table.multipleSelection.forEach((element) => {
        ids.push(element.id);
      });
      if (ids.length === 0) {
        return this.$message.warning("请至少选择一个单位");
      } else {
        this.$confirm("此操作将永久所选单位, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let params = {
              ids: ids.join(","),
            };
            delOrgansList(params).then((res) => {
              this.loadData();
              this.$message.success("删除单位成功");
            });
          })
          .catch(() => {
            return;
          });
      }
    },

    /**
     * 表格内按钮操作
     */
    handleEdit(row) {
      this.dialogShow.map((el) => {
        if (el.key === "edit") {
          el.value = true;
          el.sendData = row;
        }
      });
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除该单位, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            tenantCode: row.tenantCode,
          };
          deleteTenantByTenantId(params).then((res) => {
            if (row.linkPhone == this.user.phoneNumber) {
              location.reload();
            } else {
              this.loadData();
            }
            this.$message.success("删除单位成功");
          });
        })
        .catch(() => {
          return;
        });
    },
    handleReset() {
      (this.searchData = {}), (this.filterText = ""), this.loadData();
    },
  },
};
</script>

<style lang="scss" scoped></style>
