<template>
  <BaseDialog v-if="dialogShow" :dialogShow="dialogShow">
    <template>
      <div class="container">
        <div class="container__header">
          <div class="container__header-back-btn" @click="handleBack">
            <i class="el-icon-arrow-left" v-show="getShowBack"></i>
          </div>
          <div class="container__header-title">{{ getCurData.name }}</div>
          <div class="container__header-close-btn" @click="handleClose">
            <i class="el-icon-close"></i>
          </div>
        </div>
        <div class="container__body">
          <TheAppItem
            class="app-item"
            v-for="item in getCurList"
            :key="item.id"
            @click.native="handleClick(item)"
            :sendData="item"
          ></TheAppItem>
          <i v-for="index in 5" :key="index"></i>
        </div>
        <div class="container__footer">
          <el-pagination
            small
            layout="prev, pager, next"
            :total="getTotalPages"
            :current-page="currentPage"
            @current-change="handleCurrentChange"
            current-change
          >
          </el-pagination>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>

<script>
import { mapActions } from "vuex";
import BaseDialog from "@/components/BaseDialog";
import TheAppItem from "./TheAppItem";
import SdkClient from "@assetcloud/asset-sdk";
export default {
  name: "TheAppDialog",
  data() {
    return {
      supFile: [],
      currentPage: 1,
      sdk: "",
    };
  },
  components: {
    TheAppItem,
    BaseDialog,
  },
  props: {
    dialogShow: {
      type: Boolean,
      default: false,
    },
    sendData: {
      type: Object,
      default: () => {},
    },
  },
  created() {
    this.$nextTick(async () => {
      this.sdk = new SdkClient(5);
      let res = await this.sdk.init();
    });
  },
  mounted() {},
  computed: {
    getCurData() {
      return this.supFile[this.supFile.length - 1];
    },
    getTransArr() {
      let tempArr = this.getCurData.children;
      let res = this.arrTrans(15, tempArr);
      return res;
    },
    getCurList() {
      return this.getTransArr[this.currentPage - 1];
    },
    getTotalPages() {
      return this.getCurData.children.length;
    },
    getShowBack() {
      return this.supFile.length !== 1;
    },
  },
  watch: {
    sendData: {
      handler(newValue, oldValue) {
        this.supFile = [this.sendData];
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions("menu", ["changeMenu"]),
    handleClose() {
      this.currentPage = 1;
      this.supFile = [this.supFile[0]];
      this.$emit("closeDialog");
    },
    handleBack() {
      this.supFile.pop();
    },
    async handleClick(obj) {
      console.log('obj', obj);
      if (obj.children && obj.children.length !== 0) {
        this.supFile.push(obj);
      } else {
        try {
          obj.pcformlink = obj.path
          obj.todoappid ='0'
          const res = await this.sdk.sendAsync("OPEN_MENU",obj);
        } catch (error) {
          console.error(error.data.msg);
        }
      }
    },
    arrTrans(num, arr) {
      let newArr = [];
      let [...tempArr] = arr;
      while (tempArr.length > 0) {
        newArr.push(tempArr.splice(0, num));
      }
      return newArr;
    },
    /**
     * 分页
     */
    handleCurrentChange(val) {
      this.currentPage = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.diy-dialog__wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  overflow: auto;
  z-index: 2048;
}
.diy-dialog__container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2049;

  .container {
    width: 550px;
    height: 550px;
    background-color: #fff;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    padding: 20px;

    &__header {
      height: 40px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      &-back-btn {
        font-size: 1.25rem;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        cursor: pointer;
      }
      &-title {
        font-size: 1.5rem;
        font-weight: bold;
        line-height: 29px;
        color: rgba(51, 51, 51, 1);
      }
      &-close-btn {
        cursor: pointer;
      }
    }

    &__body {
      height: 75%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      padding: 0 10px;
      & > i {
        width: 84px;
      }
    }

    &__footer {
      flex: 1;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
