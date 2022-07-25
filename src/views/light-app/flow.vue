<template>
  <div id="flowDesign" class="flow-design">
    <iframe
      :src="url"
      frameborder="0"
      width="100%"
      height="100%"
      name="myframe"
      id="myframe"
      class="flow-design-main"
    >
    </iframe>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  name: "flowDesign",
  data() {
    return {
      url: "/static/index.html",
    };
  },
  created() {
    this.url +=
      "?" +
      "token" +
      "=" +
      this.token +
      "&userId=" +
      this.userId +
      "&tenant_id=" +
      this.curTenantCode;
  },
  computed: {
    ...mapState("user", ["token"]),
    ...mapState("user", ["userId"]),
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.flow-design {
  width: 100%;
  height: 100%;
}
</style>
