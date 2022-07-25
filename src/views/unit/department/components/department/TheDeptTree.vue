<template>
  <div
    class="base-flex"
    style="height:100%"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="保存中"
  >
    <TheSearchInput
      placeholder="输入部门名称进行搜索"
      :filterText.sync="filterText"
    ></TheSearchInput>
    <el-scrollbar style="height:100%;padding-top:5px;padding-bottom:10px">
    <div ref="treeBox" class="tree" :style="styleTree">
      <el-tree
        class="filter-tree"
        :data="deptTree"
        node-key="id"
        highlight-current
        default-expand-all
        :filter-node-method="filterNode"
        ref="tree"
      >
        <div
          class="node-model"
          @click.stop="handleClick(data)"
          slot-scope="{ node, data }"
        >
          <div class="node-model--left">
            <div class="node-model__title" :title="data.agencyName">
              <svg class="icon " aria-hidden="true">
                <use :xlink:href="'#icon-zuzhiguanli1'"></use>
              </svg>
              {{ data.agencyName }}
            </div>
          </div>
        </div>
      </el-tree>
    </div>
    </el-scrollbar>
    <div
      style="height:45px;border-top:1px solid #EBEEF5;margin-bottom:8px"
      class="flex-center"
    >
      <el-button
        type="text"
        style="width:100%;font-size:16px;"
        @click="$emit('handle-go')"
        >部门维护</el-button
      >
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TheSearchInput from "../TheSearchInput";
import DiyButton from "@components/DiyButton/index";
import { getDepartmentTree, deleteDepartment } from "@api/department";

export default {
  name: "TheDeptTree",
  data() {
    return {
      dialogShow: [
        {
          key: "edit",
          value: false,
        },
      ],
      filterText: "",
      deptTree: [],
      loading: false,
      beginWidth: 0,
      styleTree:{}
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode", "curTenant"]),
  },
  components: { TheSearchInput, DiyButton },
  created() {
    this.$nextTick(() => {
      this.loadData();
    });
  },
  methods: {
    loadData() {
      let params = {
        tenantCode: this.curTenantCode,
      };
      getDepartmentTree(params).then((res) => {
        let resList = res.data.data[0].children;
        this.deptTree = [
          {
            id: -1,
            agencyName: "未分配人员",
          },
        ];
        this.deptTree.push.apply(this.deptTree, resList);
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(this.$parent.$parent.curDept);
          this.beginWidth = this.$refs.treeBox.clientWidth
        });
      });
    },

    //设置当前选中部门节点
    handleClick(data) {
      this.$parent.$parent.curNode = data;
      this.$parent.$parent.mainTableData[0].value1 = data.agencyName;
      this.$parent.$parent.$refs.table.$refs.table.page.currentPage = 1;
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(data.id);
      });
      this.$emit("update:curDept", data.id);
      this.$emit("update:curPos", "");
    },

    //据关键字筛选部门树
    filterNode(value, data) {
      if (!value) return true;
      return data.agencyName.indexOf(value) !== -1;
    },

    handleCloseDialog(key) {
      this.dialogShow.map((el) => {
        if (el.key === key) {
          el.value = false;
        }
      });
      this.loadData();
      this.$emit("handleUpdate");
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .is-vertical{
  display: none;
}
::v-deep .el-scrollbar__wrap{
  overflow: auto;
}
.tree{
    min-width: 210px;
    display: inline-block;
    padding-top: 5px;
    // flex:auto;
    background: white;
    .el-tree-node {
      .el-tree-node__content {
        height: 40px;
        min-width:100%;
        display:inline-flex;
      }
      .el-tree-node__children {
        overflow: unset;
        width: 100%;
      }
    }
}
.filter-tree {
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 100%;
  .node-model {
    width: 100%;
    height: 30px;
    line-height: 30px;
    display: flex;
    justify-content: space-between;

    &--left {
      flex: 1;
    }

    &__title {
      overflow: hidden;

      svg {
        margin-right: 5px;
      }
    }
    &__btn {
      width: 20px;
      display: flex;
      align-items: center;
    }
  }
}
.filter-tree ::v-deep .el-tree-node__content {
  height: 30px;
}
.node-model__btn ::v-deep .diy-button-bg {
  background-color: transparent;
}
</style>
