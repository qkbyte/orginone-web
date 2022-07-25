<template>
  <div class="assetstore">
    <template v-if="menuStyle === 0">
      <div class="top">
        <DiyTopBar />
      </div>
      <div class="body">
        <keep-alive> <DiyLeftMenu></DiyLeftMenu></keep-alive>
        <DiyContentBox></DiyContentBox>
      </div>
    </template>
    <template v-else-if="menuStyle === 1">
      <div class="menu-style-two flex-between">
        <div class="leftBar"><DiySideBar></DiySideBar></div>
        <div class="rightBar">
          <DiyContentBox></DiyContentBox>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import DiyTopBar from "@components/MenuLayout/DiyTopBar";
import DiyLeftMenu from "@components/MenuLayout/DiyLeftMenu";
import DiySideBar from "@components/MenuLayout/DiySideBar";
import DiyContentBox from "@components/DiyContentBox";
export default {
  data() {
    return {};
  },
  watch:{
    appRouter(val){
      console.log('val',val);
    }
  },
  mounted() {
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", this.goBack, false);
    }
  },
  destroyed() {
    window.removeEventListener("popstate", this.goBack, false);
  },
  computed: {
    ...mapState("options", ["menuStyle"]),
    ...mapState("router", ["appRouter","appBack"]),
  },
  methods: {
    ...mapActions("menu", ["changeMenu"]),
    ...mapActions("router", ["handleRouter", "deleRouter","changeBack"]),
    goBack() {
      this.deleRouter()
      let obj = {
        router: this.appRouter[this.appRouter.length - 1],
        str: 'back'
      }
      this.changeBack(true)
      this.changeMenu(obj)
    },
  },
  components: {
    DiyTopBar,
    DiyLeftMenu,
    DiyContentBox,
    DiySideBar,
  },
};
</script>

<style lang="scss" scoped>
.assetstore {
  height: 100%;
  width: 100%;
  min-width: 1200px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  overflow: hidden;

  .top {
    height: 48px;
    width: 100%;
    background: rgba(255, 255, 255, 1);
    z-index: 1602;
  }

  .body {
    position: relative;
    min-width: 1200px;
    width: 100%;
    max-height: calc(100% - 48px);
    min-height: calc(100% - 48px);
    margin: 0 auto;
    display: flex;
    flex-direction: row;
  }

  .menu-style-two {
    width: 100%;
    height: 100%;

    .leftBar {
      width: 74px;
      height: 100%;
    }
    .rightBar {
      width: 100%;
      height: 100%;
      display: flex;
    }
  }
}
</style>
