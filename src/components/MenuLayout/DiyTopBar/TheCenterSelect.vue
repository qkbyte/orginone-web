<template>
  <el-dropdown
    style="width:100%;"
    @command="handleCommand"
    :placement="menuStyle ? 'left-start' : ''"
  >
    <div class="el-dropdown-link">
      <div
        :style="menuStyle ? 'width:100%;' : ''"
        :class="menuStyle ? 'flex-center' : ''"
      >
        <div
          class="block"
          :style="
            menuStyle == 0
              ? 'width:30px;height:30px'
              : 'margin-right:0;width:40px;height:40px'
          "
        >
          <img
            v-if="userPhoto"
            :src="
              userPhoto !== ''
                ? userPhoto
                : require('@assets/system/default-user.png')
            "
            alt=""
          />
          <div v-else class="avatar">{{ name }}</div>
        </div>
      </div>
      <template v-if="menuStyle === 0">
        {{ userName.realName
        }}<i class="el-icon-caret-bottom el-icon--right"></i>
      </template>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="a">用户中心</el-dropdown-item>
      <el-dropdown-item command="b">帮助中心</el-dropdown-item>
      <el-dropdown-item command="d">首页配置</el-dropdown-item>
      <el-dropdown-item command="e">切换边栏</el-dropdown-item>
      <el-dropdown-item command="c">注销</el-dropdown-item>
    </el-dropdown-menu>
    <template v-for="item in dialogShow">
      <TheThemeDialog
        v-if="item.key === 'theme' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="closeDialog"
      ></TheThemeDialog>
    </template>
  </el-dropdown>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Template from "../../../views/portal/components/Template.vue";
export default {
  data() {
    return {
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      name: "",
      dialogShow: [
        {
          key: "theme",
          value: false,
        },
      ],
    };
  },
  components: { Template },
  created() {
    this.circleUrl = this.userPhoto;
  },
  mounted() {
    this.name = this.userName.realName.substr(0, 1);
  },
  computed: {
    ...mapState("user", ["userName", "userPhoto", "ifPurchase", "isCreated"]),
    ...mapState("options", ["menuStyle"]),
  },
  methods: {
    ...mapActions("user", ["logout"]),
    ...mapActions("menu", ["changeMenu"]),
    ...mapActions("options", ["setMenuStyle"]),
    async handleCommand(command) {
      if (command === "a") {
        this.changeMenu({
          id: -1,
          type: "platform",
          path: "/user-center",
        });
      } else if (command === "b") {
        window.open("http://assetdocs.assetcloud.org.cn/UserGuide/", "_blank");
      } else if (command === "d") {
        this.$router.push({ name: "home/homePortal" });
      } else if (command === "e") {
        this.setMenuStyle(this.menuStyle ? 0 : 1);
      } else {
        //主页面向iframe发送请求
        await this.logout();
        localStorage.setItem("RELOAD", true);
        this.$message.success({
          duration: 1000,
          message: "注销成功",
        });
        try {
          window.frames[0].postMessage('clear', 'https://zams.assetcloud.org.cn/')
        }catch(e) {
          // console.log('??e', e);
        }
      }
    },
    closeDialog(key) {
      this.dialogShow.map((el) => {
        if (el.key === key) {
          el.value = false;
        }
      }, this);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@styles/common.scss";
.block {
  margin-right: 10px;
  width: 30px;
  height: 30px;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50px;
  }
  .avatar {
    width: 30px;
    height: 30px;
    @include background_color("background_color7");
    @include font_color("font_color3");
    border-radius: 50px;
    color: #ffffff;
    line-height: 30px;
    text-align: center;
  }
}
.el-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  @include font_color("font_color2");
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
