<template>
  <div class="diy-sidebar">
    <div class="diy-sidebar__box">
      <div class="diy-sidebar__img flex-center">
        <TheCenterSelect></TheCenterSelect>
      </div>
      <div class="diy-sidebar__menu"><TheButtons></TheButtons></div>
    </div>
    <div>
      <div class="diy-sidebar__list">
        <TheUnitList></TheUnitList>
      </div>
    </div>
  </div>
</template>

<script>
import TheTopBarSelect from "../DiyTopBar/TheTopBarSelect";
import TheCenterSelect from "../DiyTopBar/TheCenterSelect";
import TheUnitList from "./TheTopBarSelect";
import TheButtons from "../DiyTopBar";

export default {
  data() {
    return {};
  },
  components: {
    TheTopBarSelect,
    TheCenterSelect,
    TheButtons,
    TheUnitList,
  },
  computed: {},
  watch: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
@import "@styles/common.scss";
.diy-sidebar {
  @include background_color("background_color1");
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-content: center;
  &__img {
    width: 100%;
    height: 72px;
  }

  &__menu {
    margin-top: 8px;
    width: 100%;
  }

  &__list {
    width: 100%;
    margin-bottom: 40px;
  }
}
</style>
