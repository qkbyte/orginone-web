<template>
  <div id="invitation">
    <div class="invitation-box">
      <div class="member-left">
        <div class="member-img">
          <img src="@assets/img/work-icon8.png" />
        </div>
        <div class="invitation-member">
          <p class="invitation-member-text">邀请更多成员</p>
          <p
            class="inviteCode"
            id="inviteCode"
            v-text="short_url"
            v-show="0"
          ></p>
          <p class="invitation-member-team">
            <span class="invitation-member-team-span" @click="invMember"
              >邀请</span
            >更多成员加入团队吧！
          </p>
        </div>
      </div>
      <div class="invitation-line">
        <div class="vertical-line"></div>
      </div>
      <div class="member-left">
        <div class="member-img">
          <img src="@assets/img/work-icon7.svg" />
        </div>
        <div class="invitation-member">
          <p class="invitation-member-text">探索更多功能</p>
          <p class="invitation-member-team">
            <span class="invitation-member-team-span" @click="goHelp"
              >查看应用中心</span
            >探索更多功能吧!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      short_url: "",
    };
  },
  props: ["roleid"],
  created() {
    this.short_url =
      "资产云2.0全新升级，带给你不一样的用户体验，来http://platform.assetcloud.org.cn/#/login 注册登录，快来加入我们吧！！！";
  },
  methods: {
    goHelp() {
      if (this.roleid != 3) {
        this.$router.push({
          name: "app-center",
        });
      } else {
        window.open("http://www.assetcloud.org.cn/#/application");
      }
    },
    invMember() {
      var Url2 = document.getElementById("inviteCode").innerText;
      var oInput = document.createElement("input");
      oInput.value = Url2;
      document.body.appendChild(oInput);
      oInput.select();
      document.execCommand("Copy");
      oInput.className = "oInput";
      oInput.style.display = "none";
      this.$message({
        message: "邀请链接已复制!可以去钉钉，QQ，微信粘贴",
        type: "success",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
#invitation {
  height: 202px;
}
.invitation-box {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .member-left {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    .member-img img {
      width: 222px;
      height: 119px;
    }
    .invitation-member {
      margin-left: 73px;
      .invitation-member-text {
        font-weight: 600;
        color: rgba(48, 49, 51, 1);
        font-size: 22px;
        margin-bottom: 22px;
      }
      .invitation-member-team {
        font-size: 20px;
        .invitation-member-team-span {
          color: rgba(21, 74, 216, 1);
          cursor: pointer;
        }
      }
    }
  }
  .vertical-line {
    width: 1px;
    height: 143px;
    background-color: #ebeef5;
  }
}
@media screen and (max-width: 1500px) {
  #invitation {
    height: 144px;
  }
  .invitation-box {
    .member-left {
      .member-img img {
        width: 165px;
        height: 109px;
      }
      .invitation-member {
        margin-left: 53px;
        .invitation-member-text {
          font-size: 16px;
          margin-bottom: 16px;
        }
        .invitation-member-team {
          font-size: 14px;
          .invitation-member-team-span {
            color: rgba(21, 74, 216, 1);
            cursor: pointer;
          }
        }
      }
    }
    .vertical-line {
      height: 102px;
    }
  }
}
</style>
