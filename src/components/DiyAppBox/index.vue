<template>
  <div class="apps">
    <div class="apps__layout">
      <span class="apps__title">{{ listName }}</span>
      <div v-if="listName == '常用应用'">
        <div class="apps__btn" @click="handleEdit" v-show="!editShow">编辑</div>
        <div class="apps__btn" @click="handleEdit" v-show="editShow">完成</div>
      </div>
    </div>
    <div class="apps__list">
      <diyUsualList
        v-if="listName == '常用应用'"
        :editShow="editShow"
      ></diyUsualList>
      <diyAppsList
        v-else
        ref="diyApp"
        :appListData="handleAppData(applist)"
        :editShow="editShow"
      ></diyAppsList>
    </div>
  </div>
</template>

<script>
import diyAppsList from "./TheAppsList";
import diyUsualList from "./TheUsualList";
import { mapState } from "vuex";
export default {
  name: "Apps",
  data() {
    return {
      usualList:[]
    };
  },
  components: { diyAppsList, diyUsualList },
  props: {
    listName: {
      type: String,
      default: "",
    },
    applist: {
      type: Array,
      default: () => [],
    },
    editShow:{
      type: Boolean,
      default: false,
    }
  },
  methods: {
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
    handleEdit() {
      this.$emit('handleEditShow')
    },
  },
};
</script>

<style lang="scss" scoped>
.apps__layout {
  display: flex;
  justify-content: space-between;
}
.apps {
  width: 100%;
  margin-top: 4px;
  background: rgba(255, 255, 255, 1);
  opacity: 1;
  border-radius: 4px;
  padding: 20px 24px;
  position: relative;
  &__title {
    font-size: 16px;
    font-weight: bold;
    line-height: 44px;
    color: rgba(81, 81, 81, 1);
    opacity: 1;
  }
  &__btn {
    position: absolute;
    right: 35px;
    top: 20px;
    font-size: 16px;
    line-height: 44px;
    color: rgba(81, 81, 81, 1);
    opacity: 1;
    cursor: pointer;
  }
}
</style>
