<template>
  <div class="main">
    <div class="main-box" :style="menuState === 2 ? '' : 'padding:4px'">
      <div class="base-layout">
        <DiyTitle
          v-if="isShow"
          :iconShow="iconShow"
          :searchName="searchName"
        ></DiyTitle>
        <router-view :key="$route.fullPath" class="view"></router-view>
        <el-drawer
          v-if="iconShow"
          class="drawer"
          title="筛选"
          :wrapperClosable="false"
          :visible.sync="formShow.show"
          :direction="direction"
          :append-to-body="false"
          :before-close="handleClose"
          :modal-append-to-body="false"
        >
          <main>
            <el-form ref="form" label-position="top" :model="form">
              <el-form-item
                v-for="(item, key, index) in formList"
                :key="index"
                :label="formData[index]"
              >
                <el-input v-model="form[key]" clearable></el-input>
              </el-form-item>
            </el-form>
          </main>
          <footer class="footer box">
            <div class="divide"></div>
            <el-button @click="reset" class="btn-reset" type="primary"
              >重置</el-button
            >
            <el-button
              @click="submit"
              icon="el-icon-search"
              class="btn"
              type="primary"
              >筛选</el-button
            >
          </footer>
        </el-drawer>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import DiyTitle from "@components/DiyTitle/index";
import { match } from "path-to-regexp";

export default {
  data() {
    return {
      isShow: true,
      iconShow: false,
      drawer: {},
      direction: "rtl",
      form: {},
      formData: [],
      searchName: "请输入搜索内容",
    };
  },
  created() {
    this.getShow();
  },
  mounted() {
    this.formData = Object.keys(this.formList);
  },
  computed: {
    ...mapState("menu", ["menuState"]),
    ...mapState("options", ["formList", "formShow"]),
    ...mapState("router", ["appBack"]),
  },
  methods: {
    ...mapMutations(["SET_SEARCH_DATA"]),
    ...mapActions("options", ["getFormShow"]),
    ...mapActions("router", ["handleRouter", "deleRouter", "changeBack"]),
    getShow() {
      let matched = {};
      this.$route.matched.forEach((item) => {
        if (item.path == this.$route.fullPath) {
          matched = item;
        }
      });
      try {
        if (matched.meta.hasOwnProperty("isShow")) {
          this.isShow = matched.meta.isShow;
        }
        if (matched.meta.iconShow) {
          this.iconShow = matched.meta.iconShow;
        }
        if (matched.meta.searchName) {
          this.searchName = matched.meta.searchName;
        }
        if (this.$route.name !== "app-test") {
          if (!this.appBack) {
            this.handleRouter(this.$route);
          }
          this.changeBack(false);
        }
      } catch (error) {}
    },
    submit() {
      this.SET_SEARCH_DATA(this.form);
      this.drawer = {
        show: false,
        load: false,
      };
      this.getFormShow(this.drawer);
    },
    reset() {
      for (let key in this.form) {
        this.form[key] = "";
      }
      this.SET_SEARCH_DATA(this.form);
    },
    handleClose() {
      this.drawer = {
        show: false,
        load: true,
      };
      this.getFormShow(this.drawer);
    },
  },
  components: {
    DiyTitle,
  },
};
</script>

<style lang="scss" scoped>
@import "@styles/common.scss";
::v-deep .v-modal {
  position: absolute !important;
}
::v-deep .el-drawer {
  width: 340px !important;
}
::v-deep .el-drawer__header {
  font-size: 16px;
  font-weight: bold;
  color: #000000;
}
::v-deep .el-drawer__body {
  height: 80%;
}
::v-deep .btn .el-icon-search {
  position: absolute;
  left: 15px;
  top: 8px;
}
::v-deep .btn span {
  position: absolute;
  left: 30px;
  top: 8px;
}
::v-deep .btn-reset span {
  position: absolute;
  left: 50%;
  top: 8px;
  transform: translate(-50%);
  color: #ffffff;
}
main {
  width: 100%;
  height: 85%;
  padding: 0 20px;
  overflow: hidden;
}
main:hover {
  overflow: auto;
}
footer {
  width: 100%;
  height: 15%;
  position: relative;
  .btn {
    width: 77px;
    height: 30px;
    position: absolute;
    left: 60%;
    top: 70%;
    transform: translate(0, -50%);
    text-align: center;
  }
  .btn-reset {
    border: 0;
    width: 77px;
    height: 30px;
    position: absolute;
    left: 30%;
    top: 70%;
    transform: translate(0, -50%);
  }
  .divide {
    width: 90%;
    border-top: 1px solid #eeeeee;
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%);
  }
}
.main {
  flex: 1;
  @include background_color("background_color4");

  .main-box {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    overflow-y: hidden;

    .base-layout {
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
      // height: 50em;
      .drawer {
        position: absolute;
        z-index: -1;
      }
      .view {
        flex: 1;
        height: 0;
      }
    }
  }

  ::-webkit-scrollbar {
    width: 8px;
  }
}
</style>
