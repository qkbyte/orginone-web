<template>
  <el-dialog
    center
    title="菜单排序(拖动排序)"
    top="10vh"
    width="800px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
    :append-to-body="true"
  >
    <div>
      <diyAppsList
        ref="diyApp"
        :appListData="handleAppData(appMenu)"
        :sort="true"
      ></diyAppsList>
    </div>
    <span slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleClick">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { sortUserMenu, sortUserMenuByUnit } from "@api/market";
import diyAppsList from "@components/DiyAppBox/TheAppsList";
import { mapGetters, mapState } from "vuex";
import Bus from "@utils/eventBus";
export default {
  name: "TheAppDialog",
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "menuName",
      },
      menuData: [],
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  created() {},
  mounted() {
    this.menuData = JSON.parse(JSON.stringify(this.menuList));
    Bus.$on("updateMenuList", (data) => {
      this.menuData = data;
    });
  },
  components: {
    diyAppsList,
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
    ...mapState("menu", ["menuState", "menuList"]),
    ...mapState("user", ["userId"]),
    appMenu() {
      return this.menuData.filter((el) => el.type === "app");
    },
  },
  watch: {},
  methods: {
    handleClick() {
      this.$confirm("请选择针对单位或个人", "提示", {
        confirmButtonText: "个人",
        cancelButtonText: "单位",
        type: "warning",
      })
        .then(() => {
          let arr = [];
          this.menuData.forEach((el) => {
            arr.push(el.id);
          });
          let params = {
            userId: this.userId,
            menuIdList: arr,
          };
          sortUserMenu(params).then((res) => {
            location.reload();
          });
        })
        .catch(() => {
          let arr = [];
          this.menuData.forEach((el) => {
            arr.push(el.id);
          });
          let params = {
            tenantCode: this.curTenantCode,
            menuIdList: arr,
          };
          sortUserMenuByUnit(params).then((res) => {
            location.reload();
          });
        });
    },
    handleClose() {
      this.$emit("closeDialog", "sort");
    },
    handleAppData(data) {
      let _this = this;
      function addProp(obj) {
        for (var i in obj) {
          _this.$set(obj[i], "showSubData", false);
          if (obj[i].children) {
            addProp(obj[i].children);
          }
        }
      }
      addProp(data);
      return data;
    },
  },
};
</script>

<style lang="scss" scoped>
.diy-dialog-footer .el-button:first-child {
  margin-right: 40px;
}
::v-deep .el-dialog__body {
  overflow: auto;
  height: 600px;
}
</style>
