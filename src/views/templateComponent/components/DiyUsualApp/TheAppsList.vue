<template>
  <div class="app-list">
    <div
      class="app-main"
      v-for="(item, index) in appListData"
      :key="'item-' + item.id + index"
      @click="handleClickRoot(item)"
      :style="cliheight > 800 ? 'margin-bottom:25px': 'margin-bottom:45px'"
    >
      <TheAppItem  :editShow="editShow" :sendData="item"></TheAppItem>
    </div>
    <i v-for="index in 20" :key="index"></i>
    <TheAppDialog
      :dialogShow="dialog.isVisible"
      :sendData="dialog.sendData"
      @closeDialog="closeDialogByChild"
    ></TheAppDialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import TheAppDialog from "./TheAppDialog";
import TheAppItem from "./TheAppUsual";
import { marketusedappSortUsedApp } from "@api/user";
export default {
  name: "DiyAppList",
  data() {
    return {
      dialog: {
        isVisible: false,
        sendData: {},
      },
      dragging: null,
      menuList: [],
      appIdList: [],
      cliheight:0,
    };
  },
  components: {
    TheAppDialog,
    TheAppItem,
  },
  props: {
    appListData: {  
      type: Array,
      default: () => [],
    },
    editShow: {
      type: Boolean,
      default: false,
    },
  },
  mounted(){
    this.cliheight = document.documentElement.clientHeight
  },
  methods: {
    ...mapActions("menu", ["changeMenu"]),
    handleClickRoot(obj) {
      if (this.editShow) {
        return;
      } else {
        if (obj.children && obj.children.length !== 0) {
          this.dialog.sendData = obj;
          this.dialog.isVisible = true;
        } else {
          obj.type = 'app'
          obj.url = obj.menuUrl
          this.changeMenu(obj);
        }
      }
    },
    closeDialogByChild() {
      this.dialog.isVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.app-list {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  .app-main {
    margin-right: 20px;
  }
  & > i {
    width: 104px;
  }
}
.oftenapp-more {
  border: 1px dashed #ebeef5;
  width: 67px;
  height: 67px;
  font-size: 40px;
  text-align: center;
  line-height: 67px;
  color: #999;
  cursor: pointer;
  margin-bottom: 15%;
}
@media screen and (max-width: 1500px) {
  .app-list {
    .app-main {
      margin-right: 20px;
      // margin-bottom: 25px;
    }
    & > i {
      width: 104px;
    }
  }
  .oftenapp-more {
    width: 48px;
    height: 48px;
    font-size: 30px;
    line-height: 48px;
  }
}
</style>
