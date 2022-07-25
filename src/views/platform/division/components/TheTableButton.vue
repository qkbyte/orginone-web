<template>
  <DiyButton>
    <template v-slot:opt>
      <div
        class="diy-button"
        @click="handleDelete(row)"
      >
        删除
      </div>
    </template>
  </DiyButton>
</template>

<script>
import DiyButton from "@components/DiyButton/index";
import { mapGetters } from "vuex";
import { updateAppOffSale, checkRedeploy } from "@api/market";

export default {
  data() {
    return {};
  },
  components: {
    DiyButton,
  },
  props: ["row"],
  methods: {
    handleEdit(row){
      this.$emit("handleEdit",row)
    },
    handleDelete(row){
      this.$emit("handleDelete", row)
    }
  },
};
</script>

<style lang="scss" scoped></style>
