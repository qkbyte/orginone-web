<template>
  <div class="base-layout">
    <DiyBoxLayout>
      <template>
        <TheGroupListTable ref="table"></TheGroupListTable
      ></template>
    </DiyBoxLayout>
  </div>
</template>

<script>
import TheGroupListTable from "./components/TheGroupListTable";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import DiyTitle from "@components/DiyTitle/index";
export default {
  data() {
    return {
      
    };
  },
  components: {
    DiyBoxLayout,
    TheGroupListTable,
    DiyTitle,
  },
};
</script>

<style lang="scss" scoped>
.main {
  display: flex;

  .box {
    min-height: 620px;
    padding-top: 20px;
    padding-bottom: 20px;
  }

  &--left {
    width: 260px;
  }

  &--right {
    flex: 1;
    margin-left: 16px;
  }
}

.btn-add {
  width: 20px;
  height: 20px;
  background: rgba(21, 74, 216, 1);
  border-radius: 50%;
  cursor: pointer;

  div {
    width: 100%;
    height: 100%;
  }
  i {
    color: #fff;
  }
}
</style>
