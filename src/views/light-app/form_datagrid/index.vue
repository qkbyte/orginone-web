<template>
  <div class="form">
    <div class="main">
      <el-container style="height:100%; width:100%; border: 1px solid #eee">
        <el-header
          style="text-align: left; display: flex;flex-direction: row;padding: 10px"
        >
          <div style="margin-left: 1rem"></div>
          <div
            class="main__item"
            :class="
              item.isCur ? 'main__item--is-active' : 'main__item--is-noactive'
            "
            @click="changeTab(item)"
            v-for="item in showItems"
            :key="item.id"
          >
            {{ item.name }}
          </div>
        </el-header>
        <el-container style=" width:100%;">
          <el-aside
            width="20%"
            style="background-color: rgb(238, 241, 246);margin-top: 20px"
          >
            <div style="padding: 6px;text-align: center">
              <el-input
                v-model="classifyName"
                placeholder="请输入分类名称"
                style="width: 70%"
              ></el-input>
              <el-button
                icon="el-icon-search"
                circle
                style="margin-left: 3px"
              ></el-button>
            </div>

            <el-menu :default-openeds="['1', '3']">
              <el-submenu index="1">
                <template slot="title"
                  ><i class="el-icon-message"></i>子分类A</template
                >
                <el-menu-item-group>
                  <template slot="title">分组一</template>
                  <el-menu-item index="1-1">选项1</el-menu-item>
                  <el-menu-item index="1-2">选项2</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                  <el-menu-item index="1-3">选项3</el-menu-item>
                </el-menu-item-group>
                <el-submenu index="1-4">
                  <template slot="title">选项4</template>
                  <el-menu-item index="1-4-1">选项4-1</el-menu-item>
                </el-submenu>
              </el-submenu>
              <el-submenu index="2">
                <template slot="title"
                  ><i class="el-icon-menu"></i>导航二</template
                >
                <el-menu-item-group>
                  <template slot="title">分组一</template>
                  <el-menu-item index="2-1">选项1</el-menu-item>
                  <el-menu-item index="2-2">选项2</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                  <el-menu-item index="2-3">选项3</el-menu-item>
                </el-menu-item-group>
                <el-submenu index="2-4">
                  <template slot="title">选项4</template>
                  <el-menu-item index="2-4-1">选项4-1</el-menu-item>
                </el-submenu>
              </el-submenu>
              <el-submenu index="3">
                <template slot="title"
                  ><i class="el-icon-setting"></i>导航三</template
                >
                <el-menu-item-group>
                  <template slot="title">分组一</template>
                  <el-menu-item index="3-1">选项1</el-menu-item>
                  <el-menu-item index="3-2">选项2</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                  <el-menu-item index="3-3">选项3</el-menu-item>
                </el-menu-item-group>
                <el-submenu index="3-4">
                  <template slot="title">选项4</template>
                  <el-menu-item index="3-4-1">选项4-1</el-menu-item>
                </el-submenu>
              </el-submenu>
            </el-menu>
          </el-aside>

          <el-main>
            <div
              style=" padding: 6px; width: 100%;display: flex;justify-content: space-between"
            >
              <div style="margin-left: 1rem; width: 60%">
                <el-input
                  v-model="searchFormName"
                  placeholder="请输入表单名称"
                  style=" width: 50%"
                ></el-input>
                <el-button style="margin-left: 6px">确认</el-button>
              </div>

              <div>
                <el-button type="primary" style="margin-right: 1rem"
                  >新增</el-button
                >
              </div>
            </div>

            <el-table :data="tableData">
              <el-table-column prop="formName" label="表单名称" width="140">
              </el-table-column>
              <el-table-column prop="name" label="分类" width="120">
              </el-table-column>
              <el-table-column prop="address" label="创建时间">
              </el-table-column>
              <el-table-column prop="address" label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    v-for="item in tableButton"
                    :key="item.key"
                    :type="item.type"
                    :icon="item.icon"
                    @click="item.func(scope.index, scope.row)"
                    >{{ item.value }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
import DiyTitle from "@components/DiyTitle/index";

export default {
  data() {
    let _this = this;
    return {
      //搜索表单名称
      searchFormName: "",
      //搜索分类名称
      classifyName: "",
      //选择显示内容
      showItems: [
        {
          id: "1",
          name: "表单列表",
          url: "",
          isCur: true
        },
        {
          id: "2",
          name: "表单模板",
          url: "",
          isCur: false
        }
      ],
      tableData: [
        {
          formName: "表单A"
        }
      ],
      tableButton: [
        {
          key: "see",
          type: "text",
          icon: "el-icon-view",
          value: "查看",
          func: function(index, row) {
          }
        },
        {
          key: "edit",
          type: "text",
          icon: "el-icon-edit",
          value: "编辑",
          func: function(index, row) {
          }
        },
        {
          key: "table-del",
          type: "text",
          icon: "el-icon-delete",
          value: "删除",
          func: function(index, row) {
          }
        }
      ],
      ispassShow: 0
    };
  },
  components: {
    DiyTitle
  },
  created() {
    this.$nextTick(() => {
      this.loadlistData();
    });
  },
  methods: {
    changeTab: function(obj) {
      if (obj.id == 1) {
        this.ispassShow = 1;
      } else {
        this.ispassShow = 0;
      }
      this.$route.query.index = obj.id;
      this.showList(obj);
      this.showItems.forEach(function(item) {
        if (item.id == obj.id) {
          item.isCur = true;
        } else {
          item.isCur = false;
        }
      });
    },
    showList(obj) {},

    loadlistData() {}
  }
};
</script>

<style lang="scss" scoped>
.el-header {
  color: #333;
}

.el-aside {
  color: #333;
}
</style>

<style lang="scss" scoped>
.form {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  .main {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 3%;

    &__item {
      width: 20%;
      min-width: 160px;
      max-width: 240px;
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
}
</style>
