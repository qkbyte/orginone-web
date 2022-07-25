<template>
  <div class="app-list">
    <template v-if="!sort">
      <div
        class="app-main"
        v-for="(item, index) in appListData"
        :key="'item-' + item.id + index"
        @click="handleClickRoot(item)"
      >
        <TheAppItem :editShow="editShow" :sendData="item"></TheAppItem>
      </div>
    </template>
    <template v-else>
      <div
        class="app-main"
        v-for="(item, index) in appListData"
        :key="'item-' + item.id + index"
        @click="handleClickRoot(item)"
        draggable="true"
        @dragstart="handleDragStart($event, item)"
        @dragover.prevent="handleDragOver($event, item)"
        @dragenter="handleDragEnter($event, item)"
        @dragend="handleDragEnd($event, item)"
      >
        <TheAppItem :editShow="editShow" :sendData="item"></TheAppItem>
      </div>
    </template>
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
import TheAppItem from "./TheAppItem";
import Bus from "@utils/eventBus";
export default {
  name: "DiyAppList",
  data() {
    return {
      dialog: {
        isVisible: false,
        sendData: {},
      },
    };
  },
  components: {
    TheAppDialog,
    TheAppItem,
  },
  props: {
    sort: {
      type: Boolean,
      default: false,
    },
    appListData: {
      type: Array,
      default: () => [],
    },
    editShow: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    console.log("appListData", this.appListData);
  },
  methods: {
    ...mapActions("menu", ["changeMenu", "setNewMenu"]),

    handleClickRoot(obj) {
      if (this.editShow) {
        return;
      } else {
        if (obj.children && obj.children.length !== 0) {
          this.dialog.sendData = obj;
          this.dialog.isVisible = true;
        } else {
          console.log("ovj", obj);
          this.changeMenu(obj);
        }
      }
    },
    closeDialogByChild() {
      this.dialog.isVisible = false;
    },
    handleDragStart(e, item) {
      this.dragging = item;
    },
    handleDragEnd(e, item) {
      this.dragging = null;
      // this.appIdList = [];
      // this.appListData.forEach((el) => {
      //   this.appIdList.push(el.id);
      // });
      // marketusedappSortUsedApp(this.appIdList);
    },
    //首先把div变成可以放置的元素，即重写dragenter/dragover
    // DataTransfer 对象用来保存，通过拖放动作，拖动到浏览器的数据。
    // 如果dropEffect 属性设定为none,则不允许被拖放到目标元素中。
    handleDragOver(e) {
      e.dataTransfer.dropEffect = "move"; // e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
    },
    handleDragEnter(e, item) {
      e.dataTransfer.effectAllowed = "move"; //为需要移动的元素设置dragstart事件
      if (item === this.dragging) {
        return;
      }
      const newItems = [...this.appListData];
      const src = newItems.indexOf(this.dragging);
      const dst = newItems.indexOf(item);
      // 替换
      newItems.splice(dst, 0, ...newItems.splice(src, 1));
      // 让item的颜色等于新交换的颜色
      Bus.$emit("updateMenuList", newItems);
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
