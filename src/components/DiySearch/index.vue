<template>
  <div class="search">
    <slot name="searchItem"></slot>
    <slot name="searchBtn"></slot>
  </div>
</template>

<script>
export default {
  name: "DiySearch",
  data() {
    return {};
  },
  created() {}
};
</script>

<style lang="scss" scoped>
.search {
  width: 100%;
  height: 100px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 6px 10px rgba(5, 36, 83, 0.06);
  border-radius: 4px;
  margin-top: 30px;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
