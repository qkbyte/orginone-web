<template>
  <div @mouseleave="handleClose()">
    <template v-if="unitCount !== 0">
      <div
        class="select-menu"
        @click="showTenantList()"
        :title="curTenant.name"
      >
        <div class="select-item select-item--active">
          <div class="select-item__img">
            {{ curTenant.name.slice(0, 1) }}
          </div>
          <div class="select-item__title">{{ curTenant.name }}</div>
          <svg
            class="svg-icon arrow-icon"
            aria-hidden="true"
            :style="
              btnType ? 'transform: rotate(180deg);' : 'transform: rotate(0);'
            "
          >
            <use :xlink:href="'#icon-down'"></use>
          </svg>
        </div>
        <div class="select-drop" :style="getDropMenuStyle">
          <div
            class="select-item-box select-item-box--item "
            :style="unitCount < 6 ? 'overflow: hidden;' : 'overflow: auto;'"
            v-if="dropUnitList.length > 0"
          >
            <div
              class="select-item select-item--noactive"
              @click="switchTenant(item.tenantCode)"
              v-for="item in dropUnitList"
              :key="item.tenantCode"
            >
              <div class="select-item__imgSelect">
                {{ item.name.slice(0, 1) }}
              </div>
              <div class="select-item__titleSelect">{{ item.name }}</div>
              <div class="select-item__titleNum">{{ item.todoNum }}</div>
            </div>
          </div>
          <div
            class="select-item-box select-item-box--btn"
            :style="
              dropUnitList.length > 0
                ? 'border-top: 1px solid rgb(233, 233, 233);margin-top:10px;'
                : ''
            "
          >
            <div
              class="select-item select-item--noactive"
              @click="createUnit"
              v-if="CURRENT_ENV != 'production' || isShow"
            >
              <div class="select-item__btn">
                <i class="el-icon-plus"></i> 创建单位
              </div>
            </div>
          </div>
        </div>
        <template v-for="item in dialogShow">
          <TheAddDialog
            v-if="item.key === 'add' && item.value"
            :key="item.key"
            :dialogShow="item"
            @closeDialog="handleCloseDialog"
          ></TheAddDialog>
        </template>
      </div>
    </template>
    <template v-else>
      <div
        class="select-item select-item--noactive"
        style="cursor: pointer;margin-left:20px"
        @click="createUnit"
      >
        <div class="select-item__btn">
          <i class="el-icon-plus"></i> 创建单位
        </div>
      </div>
      <template v-for="item in dialogShow">
        <TheAddDialog
          v-if="item.key === 'add' && item.value"
          :key="item.key"
          :dialogShow="item"
          @closeDialog="handleCloseDialog"
        ></TheAddDialog>
      </template>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { async } from "q";
import TheAddDialog from "./TheAddDialog";
import store from "@/store";
import { Loading } from "element-ui";
import { getUnitActTodoNumbe } from "@api/acttodo";

export default {
  data() {
    return {
      btnType: false,
      dialogShow: [
        {
          key: "add",
          value: false,
        },
      ],
      isShow: false,
    };
  },
  components: { TheAddDialog },
  computed: {
    ...mapGetters("tenant", ["unitCount", "dropUnitList", "curTenant"]),
    ...mapState("user", ["userName"]),
    getDropMenuStyle() {
      let height = this.unitCount < 6 ? this.unitCount : 6;
      return this.btnType
        ? "height:" + (height * 45 + 35) + "px;"
        : "height:0px";
    },
  },
  mounted() {
    if (window.location.href.indexOf("10.63.74.122") != -1) {
      this.isShow = true;
    }
    this.getUnitTodo();
  },
  methods: {
    ...mapActions("tenant", ["toggleUnit", "getChangeDropUnitList"]),
    getUnitTodo() {
      let params = {
        phoneNumber: this.userName.accountName,
      };
      getUnitActTodoNumbe(params).then((res) => {
        console.log(res);
        let data = res.data.data;
        this.getChangeDropUnitList(data);
      });
    },
    handleClose() {
      this.btnType = false;
    },
    showTenantList() {
      this.btnType = !this.btnType;
    },
    createUnit() {
      this.dialogShow.map((el) => {
        if (el.key === "add") {
          el.value = true;
        }
      });
    },
    async switchTenant(obj) {
      this.$router.push({ name: "/" });
      const options = {
        lock: true,
        text: "拼命加载中",
        spinner: "el-icon-loading",
      };
      store.dispatch("loading", {
        status: true,
        instance: Loading.service(options),
      });
      await this.toggleUnit(obj);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@styles/common.scss";
::-webkit-scrollbar {
  width: 8px;
  height: 0px;
  background: #ffffff;
}
::-webkit-scrollbar-thumb {
  height: 0px;
  border-radius: 4px;
  background: #90939928;
}
::-webkit-scrollbar-thumb:hover {
  width: 8px;
  background: #90939967;
}
.select-menu {
  height: 48px;
  position: relative;
  cursor: pointer;

  .select-drop {
    position: relative;
    overflow: hidden;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    transition: all 0.5s;
    box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.161);
    border-radius: 0 0 4px 4px;
  }
  .select-item-box {
    &--item {
      margin-top: 5px;
    }
    &--btn {
      padding: 10px 0;
    }
  }

  .select-item {
    width: auto;
    min-height: 45px;
    background: transparent;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    padding-left: 15px;
    padding-right: 15px;
    margin-left: 5px;
    margin-right: 5px;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;

    &__img {
      height: 25px;
      width: 25px;
      border-radius: 50%;
      font-size: 15px;
      @include background_color("background_color7");
      @include font_color("font_color3");
      line-height: 25px;
      text-align: center;
    }
    &__imgSelect {
      height: 25px;
      width: 25px;
      border-radius: 50%;
      background: $theme-color;
      font-size: 15px;
      color: #ffffff;
      line-height: 25px;
      text-align: center;
    }
    &__title {
      height: 25px;
      line-height: 25px;
      font-size: 16px;
      font-weight: 400;
      margin-right: 12px;
      margin-left: 15px;
      @include font_color("font_color2");
    }
    &__titleSelect {
      height: 25px;
      line-height: 25px;
      font-size: 16px;
      font-weight: 400;
      margin-right: 12px;
      margin-left: 15px;
    }
    &__titleNum {
      padding: 2px;
      width: fit-content;
      height: fit-content;
      border-radius: 50%;
      font-size: 12px;
      text-align: center;
      display: flex;
      align-items: center;
      background: red;
      color: white;
    }
    &__btn {
      color: #0b3ed3;
    }

    &--active {
      height: 48px;
    }
    &--noactive {
      &:hover {
        background-color: rgba(245, 246, 252, 1);
      }
    }
    .arrow-icon {
      transition: all 0.5s;
      width: 10px;
      height: 8px;
      @include fill_color("fill_color1");
    }
  }
}
</style>
