<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" v-if="!rowData.ifPurchase" @click="getApp">
        获取
      </div>
      <div class="diy-button" v-else @click="openApp">打开</div>
    </template>
  </DiyButton>
</template>

<script>
import DiyButton from "@components/DiyButton/index";
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  components: { DiyButton },
  created() {},
  props: {
    rowData: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    getApp() {
      this.$emit("handlePurchase", this.rowData);
    },
    openApp() {
      this.$router.push({
        name: "group-app-manage-view",
        query: {
          id: this.rowData.id,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
