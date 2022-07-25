<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" @click="handleEdit(row)">编辑</div>
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
  props: {
    row: {
      type: Object,
    },
  },
  methods: {
    /**编辑角色 */
    handleEdit(row) {
      this.$emit("handleEdit", row);
    },
  },
};
</script>

<style lang="scss" scoped></style>
