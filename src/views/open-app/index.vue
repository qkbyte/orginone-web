<template>
  <div class="open-app">
    <Sandbox :targetUrl="openUrl" :sourceAppId="openMenu.appId" :key="menuKey"></Sandbox>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import Sandbox from "@components/Sandbox";
export default {
  data() {
    return {
      redirecturl: "",
      sourceAppId: "",
    };
  },
  components: { Sandbox },
  watch: {
    "$store.state.menu.openMenu": function() {},
    $route(val) {},
  },
  beforeCreate() {
    if (!this.$store.state.menu.openUrl) {
      this.$router.push({ path: "/404" });
    }
  },
  computed: {
    ...mapState("menu", ["openMenu","menuKey"]),
    ...mapGetters("menu", ["openUrl"]),
  },
  created() {
    console.log('openMenu', this.openUrl);
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.open-app {
  width: 100%;
  height: 100%;
  position: relative;
}

::-webkit-scrollbar {
  width: 0px !important;
}
</style>
