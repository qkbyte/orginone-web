<template>
  <!-- 全屏加载-ElementUI -->
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <div style="display: flex;justify-content: space-between;margin-top: 4px;">
      <!-- 发起审批 -->
      <div class="formTemplate">
        <div class="templateHead">
          <div style="margin-left: 20px; width: 100%;display:flex;justify-content: space-between;">
            <div style="font-size: 18px;font-weigh:800;color: #303133;font-weight: bold; height:40px; line-height:40px;">
              发起审批
            </div>
            <div>
              <el-button
                type="text"
                @click="gotoMessage()"
                style="margin-right: 3rem"
              >
                历史审批
              </el-button>
              <!-- v-if待后端完善，由后端返回可显示 创建审批 的人员 -->
              <el-button
                v-if="roleId.indexOf('3') == -1 && roleId.indexOf('257') == -1"
                type="text"
                @click="gotoList()"
                style="margin-right: 1rem"
              >
                创建审批
              </el-button>
            </div>
          </div>
        </div>

        <div class="templateIndex">
          <div class="templateIndex__type">
            <div
              v-for="item in tabItems"
              :key="item.id"
              style="position: relative;"
            >
              <div
                class="templateIndex__type__item"
                :class="
                  item.isCur
                    ? 'templateIndex__type__item--is-active'
                    : 'templateIndex__type__item--is-noactive'
                "
                @click="changeTab(item)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>

        <div class="templateContent">
          <!-- 当前tab下无内容时 -->
          <div
            v-if="infoItem.length < 1"
            style="width: 100%;height: 100%;display: flex;align-items: center"
          >
            <div style="width: 100%;text-align: center;">
              <img
                style="width: 221px;height: 106px"
                src="@assets/approval/others/approval_null2.png"
              />
              <div
                style="margin-top: 16px;font-size:12px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(144,147,153,1);line-height:17px;"
              >
                暂无审批业务
              </div>
            </div>
          </div>
          <!-- 当前tab下有内容 -->
          <div class="templateContent__line">
            <div
              v-for="(temp, key) in infoItem"
              :key="key"
              class="templateContent__box"
            >
              <!-- 上-收藏 -->
              <div
                style="cursor:pointer"
                @click="updateIfUserStatus(temp.id, temp.ifUsed)"
              >
                <img
                  v-if="temp.ifUsed == 0"
                  style="height: 12px;width:12px"
                  :src="require(`@assets/approval/others/app_common2.png`)"
                />
                <img
                  v-else
                  style="height: 12px;width:12px"
                  :src="require(`@assets/approval/others/app_common1.png`)"
                />
              </div>
              <!-- 中-图标、标题、发起按钮 -->
              <div style="margin-left: 12px">
                <div class="templateContent__box__left">
                  <div
                    style="height:50%;font-size: 1.5rem;color: #303133;display: flex;flex-direction: column;justify-content: center"
                  >
                    <div style="height: 34px;">
                      <div style="display: inline-block;height: 100%;">
                        <img
                          v-if="temp.iconCls"
                          style="height: 100%;"
                          :src="require(`@assets/approval/${temp.iconCls}.png`)"
                        />
                        <img
                          v-else
                          style="height: 100%;"
                          :src="require(`@assets/approval/app-icon-1.png`)"
                        />
                      </div>
                      <div
                        style="margin-left: 10px; display: inline-block;align-items-align: center;height: 100%;"
                      >
                        <el-tooltip
                          effect="dark"
                          :content="temp.formName"
                          placement="top-start"
                        >
                          <span>{{ temp.formName | omitName(screenWidth) }}</span>
                        </el-tooltip>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="templateContent__box__right">
                  <div style="display: flex;justify-content: flex-end;">
                    <el-button
                      round
                      style="font-size: 1rem;color: #154AD8"
                      size="mini"
                      @click="showItem(temp.id)"
                    >
                      发起
                    </el-button>
                  </div>
                </div>
              </div>
              <!-- 下-内容 -->
              <div
                style="height: 50%;width:50%;display: flex;flex-direction: column;justify-content: center;margin-left: 12px"
              >
                <el-tooltip
                  effect="dark"
                  :content="temp.descirp"
                  placement="top-start"
                >
                  <span>
                    {{ temp.descirp | omitDescrip }}
                  </span>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-pagination"></div>
      </div>
      <!-- 常用功能-右侧一栏 -->
      <commonForm ref="commonForm" @goToItem="showItem"></commonForm>
    </div>
  </div>
</template>

<script>
import { getTemplateGroup, getFormInfoWithUserId, post2 } from "@api/flow";
import { mapGetters } from "vuex";
import DiyTitle from "@components/DiyTitle/index";
import commonForm from "../components/ApprovalCommonForm";

export default {
  name: "index",
  data() {
    return {
      tabItems: [],
      fullscreenLoading: false,
      page: {
        total: 0, // 总条数
        currentPage: 1, // 当前页
        pageSize: 10, // 每页条数
        pageSizes: [10, 20, 50, 70, 100], // 分页数量列表
        layout: "total, prev, pager, next, sizes",
      },
      groupId: "",
      info: [], //所有tab下的item，info[0]为第一个tab下的item
      infoItem: [], //选中tab下的item
      screenWidth: "",
      timer: false,
      roleId: [],
    };
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  components: {
    DiyTitle,
    commonForm,
  },
  mounted() {
    this.getGroup()

    this.screenWidth = document.body.clientWidth;
    const that = this;
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        that.screenWidth = window.screenWidth;
      })();
    };
    
    this.roleId = this.$store.state.user.roleId.toString().split(",");
  },
  watch: {
    screenWidth(val) {
      if (!this.timer) {
        this.screenWidth = val;
        this.timer = true;
        let that = this;
        setTimeout(function() {
          that.timer = false;
        });
      }
    },
  },
  filters: {
    // 显示不下的内容用...
    omitDescrip(info) {
      let temp = info + "";
      if (temp.length > 10) return temp.substring(0, 10) + "...";
      return info;
    },
    omitName(info, screenWidth) {
      let temp = info + "";

      if (screenWidth > 1900 && temp.length > 5)
        return temp.substring(0, 5) + "...";
      else if (screenWidth < 1200 && temp.length > 2)
        return temp.substring(0, 2) + "...";
      else if (temp.length > 5) return temp.substring(0, 5) + "...";
      return info;
    },
  },
  methods: {
    // 跳转到历史审批页面
    gotoMessage() {
      this.$router.push({ name: "light_history" });
    },
    // 跳转到创建审批页面
    gotoList() {
      this.$router.push({ name: "approvalList" });
    },
    // 获取当前组织的tab，item
    getGroup() {
      let params = {
        tenantCode: this.curTenantCode,
      };
      // 获取所有的tab，并传到tabItems中
      getTemplateGroup(params).then((res) => {
        this.tabItems = [];
        let temp = {
          id: "",
          name: "全部",
          isCur: true,
        };
        this.getInfo();
        this.tabItems.push(temp);
        res.data.data.forEach((item, index) => {
          let temp = {
            id: item.id,
            name: item.name,
            isCur: false,
          };
          this.tabItems.push(temp);
        });
      });
    },
    // 呀这个函数没用到:)
    showGroup(idx) {
      this.tabItems[idx].isShow = !this.tabItems[idx].isShow;
    },
    // 收藏到常用功能或取消收藏
    updateIfUserStatus(id, status) {
      status = status == 0 ? 1 : 0;
      let params = {
        tenantCode: this.curTenantCode,
        formId: id,
        flag: status,
      };
      this.fullscreenLoading = true;
      post2("/dev-api/asset-form/if/used", params)
        .then((res) => {
          this.fullscreenLoading = false;

          if (res.data.code == 200) {
            this.getGroup();
            this.$refs.commonForm.getInfo();
          } else {
            this.$message.error("设置失败");
          }
        })
        .catch((err) => {
          this.$message.error("设置失败");
        });
    },
    // 跳转到approvalIssue页面
    showItem(id) {
      this.$router.push({ name: "approvalIssue", params: { formId: id } });
    },
    // 获取所有item，并分配给每个tab
    getInfo() {
      let params = {
        current: 1,
        size: 1000,
        categoryId: "",
        formName: "",
      };
      //加载中~
      this.fullscreenLoading = true;

      getFormInfoWithUserId(params).then((res) => {
        this.fullscreenLoading = false;

        this.info = [];

        let data = res.data.data.records;

        this.info = [];
        for (
          let otherTemp1 = 0;
          otherTemp1 < this.tabItems.length;
          otherTemp1++
        ) {
          this.info[otherTemp1] = [];
        }

        for (let index = 0; index < data.length; index++) {
          let temp = {
            formName: data[index].formName,
            id: data[index].id,
            iconCls: data[index].iconCls,
            categoryId: data[index].categoryId,
            descirp: data[index].description,
            ifUsed: data[index].ifUsed,
          };
          // info[0]中放了全部的item
          this.info[0].push(temp);

          //将item分到相应的tab内
          for (
            let otherTemp = 0;
            otherTemp < this.tabItems.length;
            otherTemp++
          ) {
            if (temp.categoryId === this.tabItems[otherTemp].id) {
              this.info[otherTemp].push(temp);
            }
          }
        }
        //初始化显示info[0]中的item
        this.infoItem = this.info[0];
      });
    },
    // 呀这个函数没用到:)
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.page.currentPage = 1;
      this.getInfo();
    },
    // 呀这个函数没用到:)
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.getInfo();
    },
    // 切换tab
    changeTab: function(obj) {
      // id为空-显示“全部”
      if (obj.id == "") {
        this.infoItem = this.info[0];
      }
      this.groupId = obj.id;
      
      this.tabItems.forEach((item, index) => {
        if (item.id == obj.id) {
          item.isCur = true; 
          this.infoItem = this.info[index];
          // console.log(JSON.stringify(this.info));
          // console.log(JSON.stringify(this.infoItem));
        } else {
          item.isCur = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.group {
  width: 100%;
  margin-top: 20px;
  padding: 10px 0;
}

.formTemplate {
  width: 100%;
  height: calc(100vh - 20px);
  /*height: 1032px;*/
  padding: 15px 20px;
  background: #fff;
  overflow: auto;

  .templateHead {
    width: 100%;
    margin-top: 1px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .templateIndex {
    width: 100%;
    margin-top: 0.5rem;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    &__type {
      display: flex;
      flex-direction: row;
      /*justify-content: space-between;*/
      color: #606266;
      width: 80%;
      /*margin-left: 20px;*/
      overflow: auto;

      &__item {
        height: 50px;
        line-height: 50px;
        text-align: center;
        border-radius: 4px 4px 0px 0px;
        cursor: pointer;
        margin-left: 20px;

        &--is-active {
          font-size: 1.2rem;
          font-weight: bold;
          color: #303133;
        }

        &--is-active:after {
          content: " ";
          width: 1.5rem;
          height: 0.12rem;
          background: #154ad8;
          position: absolute;
          bottom: 0.3rem;
          left: 50%;
          // transform: translateX(-50%); //居中处理
        }

        &--is-noactive {
          color: #606266;
        }
      }
    }

    &__button {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      color: #154ad8;
      width: 75%;
    }
  }

  .templateContent {
    width: 100%;
    padding: 0px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 75%;

    &__box {
      width: 18%;
      min-width: 330px;
      height: 8rem;
      min-height: 105px;
      padding: 8px;
      margin: 1%;
      display: inline-block;
      border: 1px solid #ebeef5;

      &__left {
        width: 65%;
        display: inline-block;
      }

      &__right {
        width: 35%;
        display: inline-block;
      }
    }
  }
}

.c-img {
  max-width: 1rem;
  max-height: 1rem;
  margin-bottom: 3px;
  margin-right: 4px;
}

.diy-button {
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background: rgba(235, 238, 245, 1);
    border-radius: 4px;
  }
}
</style>