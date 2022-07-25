<template>
  <div>
    <template v-if="groupCount !== 0">
      <div
        class="select-menu"
        @click="showGroupList()"
        :title="curGroup.name"
        :style="dropGroupList.length > 0 ? 'cursor: pointer;' : ''"
      >
        <div class="select-item select-item--active">
          <div class="select-item__img" >
            {{ curGroup.name.slice(0, 1) }}
          </div>
          <div class="select-item__title">{{ curGroup.name }}</div>
          <svg
            class="svg-icon arrow-icon"
            aria-hidden="true"
            v-if="dropGroupList.length > 0"
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
            v-if="dropGroupList.length > 0"
          >
            <div
              class="select-item select-item--noactive"
              @click="switchGroup(item.groupId)"
              v-for="item in dropGroupList"
              :key="item.groupId"
            >
              <div class="select-item__img">{{ item.name.slice(0, 1) }}</div>
              <div class="select-item__title">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>

    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { async } from "q";

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
  components: {},
  computed: {
    ...mapGetters("group", ["groupCount", "dropGroupList", "curGroup"]),
    getDropMenuStyle() {
      return this.btnType
        ? "height:365px;"
        : "height:0px";
    },
  },
  mounted() {
    document.addEventListener("click", (e) => {
      if (!this.$el.contains(e.target)) {
        this.btnType = false;
      }
    });
  },
  methods: {
    ...mapActions("group", ["toggleGroup"]),
    showGroupList() {
      if (this.dropGroupList.length > 0) this.btnType = !this.btnType;
    },
    async switchGroup(obj) {
      await this.toggleGroup(obj);
      // this.$emit("handleUpdate");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@styles/common.scss";
.select-menu {
  height: 40px;
  position: relative;

  .select-drop {
    position: relative;
    overflow: auto;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    transition: all 0.5s;
    box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.161);
    border-radius: 0 0 4px 4px;
    z-index: 2148;
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
      font-size: 13px;
      border-radius: 50%;
      @include background_color("background_color13");
      color: #ffffff;
      line-height: 25px;
      text-align: center;
    }

    &__title {
      height: 30px;
      min-width: 160px;
      width:fit-content;
      line-height: 30px;
      font-size: 16px;
      font-weight: 400;
      margin-right: 12px;
      margin-left: 20px;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }

    &__btn {
      color: #0b3ed3;
    }

    &--active {
      height: 60px;
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
      fill: #909399;
    }
  }
}
</style>
