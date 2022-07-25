<template>
  <div class="unit-list">
    <template v-if="unitCount !== 0">
      <div>
        <div class="select-item" :title="curTenant.name">
          <div  class="select-item__img active">
            {{ curTenant.name.slice(0, 1) }}
          </div>
        </div>
      </div>
      <div v-for="item in getShowList" :key="item.tenantId">
        <div
          :title="item.name"
          class="select-item "
          @click="switchTenant(item.tenantCode)"
        >
          <div class="select-item__img no-active">
            {{ item.name.slice(0, 1) }}
          </div>
        </div>
      </div>
      <div v-if="unitCount > 3">
        <el-dropdown
          @command="handleCommand"
          :placement="menuStyle ? 'left-start' : ''"
        >
          <div class="select-item " :title="curTenant.name">
            <div class="select-item__img no-active" style="line-height:26px">
              ...
            </div>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="item in getNoShowList"
              :key="item.tenantId"
              :command="item.tenantCode"
              >{{ item.name }}</el-dropdown-item
            >
            <el-dropdown-item v-if="CURRENT_ENV != 'production'">
              <div class="select-item__btn">
                <i class="el-icon-plus"></i> 创建单位
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </template>
    <template v-else>
      <div
        class="select-item select-item--noactive"
        @click="createUnit"
        v-if="CURRENT_ENV != 'production'"
      >
        <div class="select-item__btn">
          <i class="el-icon-plus"></i> 创建单位
        </div>
      </div>
    </template>
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

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import TheAddDialog from "../DiyTopBar/TheAddDialog";
import store from "@/store";
import { Loading } from "element-ui";

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
    };
  },
  components: { TheAddDialog },
  computed: {
    ...mapState("options", ["menuStyle"]),
    ...mapGetters("tenant", ["unitCount", "dropUnitList", "curTenant"]),
    getDropMenuStyle() {
      let height = this.unitCount < 6 ? this.unitCount : 6;
      return this.btnType
        ? "height:" + (height * 45 + 35) + "px;"
        : "height:0px";
    },
    getShowList() {
      let res = this.dropUnitList;
      return res.slice(0, 2);
    },
    getNoShowList() {
      let res = this.dropUnitList;
      return res.slice(2);
    },
  },
  mounted() {},
  methods: {
    ...mapActions("tenant", ["toggleUnit"]),
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
    handleCommand(val) {
      if (val) {
        this.switchTenant(val);
      } else {
        this.createUnit();
      }
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
}

.unit-list {
  width: 100%;
  display: flex;
  flex-direction: column-reverse;

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

    &:hover {
      cursor: pointer;
    }

    &__img {
      height: 32px;
      width: 32px;
      border-radius: 50%;
      background: $theme-color;
      color: #ffffff;
      line-height: 32px;
      font-weight: 600;
      text-align: center;
    }
    .no-active {
      margin-bottom: 24px;
      font-weight: 600;
      @include font_color("font_color7");
      // border:1px solid red;
      @include border_color("border_color2");
      @include background_color("background_color10");
    }
    .no-active:hover {
      @include border_color("border_color3");
    }
    .active{
      @include background_color("background_color9");
      @include font_color("font_color6");
    }
  }
}
</style>
