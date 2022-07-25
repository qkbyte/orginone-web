<template>
  <div
    class="base-flex"
    style="height:100%"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="保存中"
  >
    <el-scrollbar style="height:100%;padding-top:5px;padding-bottom:10px">
      <div ref="treeBox" class="tree" :style="styleTree">
        <el-tree
          v-show="checkValue !== 0"
          class="filter-tree"
          :data="deptTree"
          node-key="id"
          highlight-current
          default-expand-all
          :current-node-key="currentKey"
          :filter-node-method="filterNode"
          ref="tree"
        >
          <div
            class="node-model"
            @click.stop="handleClick(data)"
            slot-scope="{ node, data }"
          >
            <div class="node-model--left" v-show="checkValue == 1">
              <div class="node-model__title" :title="data.agencyName">
                <svg class="icon " aria-hidden="true">
                  <use :xlink:href="'#icon-zuzhiguanli1'"></use>
                </svg>
                {{ data.agencyName }}
              </div>
            </div>

            <div class="node-model--left" v-show="checkValue == 2">
              <div class="node-model__title" :title="data.agencyName">
                <svg class="icon " aria-hidden="true">
                  <use :xlink:href="'#icon-zuzhiguanli1'"></use>
                </svg>
                {{ data.agencyCode }}
              </div>
            </div>

            <div class="node-model--left" v-show="checkValue == 3">
              <div class="node-model__title" :title="data.agencyName">
                <svg class="icon " aria-hidden="true">
                  <use :xlink:href="'#icon-zuzhiguanli1'"></use>
                </svg>
                {{ data.agencyCode }} {{ data.agencyName }}
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
      deptTree: [],
      loading: false,
      currentKey: -1,
      beginWidth: 0,
      styleTree: {},
      checkValue: 1,
    };
  },
  watch: {
    checkList(val) {
      if (val.length == 2) {
        this.checkValue = 3;
      } else {
        if (val.indexOf("部门名") !== -1) {
          this.checkValue = 1;
        } else if (val.indexOf("部门编码") !== -1) {
          this.checkValue = 2;
        } else {
          this.checkValue = 0;
        }
      }
      console.log("checkValue", this.checkValue);
    },
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode", "curTenant"]),
  },
  props: {
    checkList: {
      type: Array,
      default: () => [],
    },
  },
  components: { DiyButton },
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
            agencyName: this.curTenant.name,
            children: [],
          },
        ];
        this.deptTree[0].children = this.deptTree[0].children.concat(resList);
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(this.$parent.$parent.curDept);
          this.beginWidth = this.$refs.treeBox.clientWidth;
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
      if (data.id == -1) {
        this.$parent.$parent.$refs.table.value1 = true;
        this.$parent.$parent.buttons = [];
      } else {
        this.$parent.$parent.$refs.table.value1 = false;
        this.$parent.$parent.buttons = [
          {
            label: "分配人员",
            event: "handleDistribute",
          },
        ];
      }
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
@import "@styles/common.scss";
::v-deep .is-vertical {
  display: none;
}
::v-deep .el-scrollbar__wrap {
  overflow: auto;
}
.tree {
  @include background_color("background_color3");
  min-width: 220px;
  display: inline-block;
  padding-top: 5px;
  // flex:auto;
  background: white;
  .el-tree-node {
    .el-tree-node__content {
      height: 40px;
      min-width: 100%;
      display: inline-flex;
    }
    .el-tree-node__children {
      overflow: unset;
      width: 100%;
    }
  }
}
.filter-tree {
  @include background_color("background_color3");
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
