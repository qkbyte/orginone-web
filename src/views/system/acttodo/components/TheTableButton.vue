<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" @click="handleReview(index, row)">查看</div>
    </template>
  </DiyButton>
</template>

<script>
import DiyButton from "@components/DiyButton/index";
export default {
  data() {
    return {};
  },
  computed: {},
  components: { DiyButton },
  created() {},
  props: ["row", "index"],
  methods: {
    handleReview(index, row) {
      this.$emit("handleReview", index, row);
    }
  },
};
</script>

<style lang="scss" scoped></style>
