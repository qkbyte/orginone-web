<template>
  <div id="indexcard">
    <div class="indexcard-box">
      <div class="card-top">
        <h3>资产卡片</h3>
        <p class="card-details" @click="skipAssets('all')">
          查看更多
          <i class="iconfont icon-right_blod"></i>
        </p>
      </div>
      <div class="card-bottom" v-if="!getAssetGroup.length">
        <div class="card-item card-color1" @click="skipAssets('all')">
          <div class="card-item-img">
            <img src="@assets/img/work-icon19.png" />
          </div>
          <div class="card-item-dec">
            <h5>房屋及构筑物</h5>
            <p class="card-item-num">
              件数:
              <span class="card-num-count">0</span>
            </p>
            <p class="card-item-gold">
              金额:
              <span class="card-gold-count">0</span>元
            </p>
          </div>
        </div>
        <div class="card-item card-color2" @click="skipAssets('all')">
          <div class="card-item-img">
            <img src="@assets/img/work-icon18.png" />
          </div>
          <div class="card-item-dec">
            <h5>专用设备</h5>
            <p class="card-item-num">
              件数:
              <span class="card-num-count">0</span>
            </p>
            <p class="card-item-gold">
              金额:
              <span class="card-gold-count">0</span>元
            </p>
          </div>
        </div>
        <div class="card-item card-color3" @click="skipAssets('all')">
          <div class="card-item-img">
            <img src="@assets/img/work-icon17.png" />
          </div>
          <div class="card-item-dec">
            <h5>文物和陈列品</h5>
            <p class="card-item-num">
              件数:
              <span class="card-num-count">0</span>
            </p>
            <p class="card-item-gold">
              金额:
              <span class="card-gold-count">0</span>元
            </p>
          </div>
        </div>
        <div class="card-item card-color4" @click="skipAssets('all')">
          <div class="card-item-img">
            <img src="@assets/img/work-icon16.png" />
          </div>
          <div class="card-item-dec">
            <h5>图书和档案</h5>
            <p class="card-item-num">
              件数:
              <span class="card-num-count">0</span>
            </p>
            <p class="card-item-gold">
              金额:
              <span class="card-gold-count">0</span>元
            </p>
          </div>
        </div>
        <div class="card-item card-color5" @click="skipAssets('all')">
          <div class="card-item-img">
            <img src="@assets/img/work-icon15.png" />
          </div>
          <div class="card-item-dec">
            <h5 title="家具、用具、装具及动植物">家具、用具、装具及动植物</h5>
            <p class="card-item-num">
              件数:
              <span class="card-num-count">0</span>
            </p>
            <p class="card-item-gold">
              金额:
              <span class="card-gold-count">0</span>元
            </p>
          </div>
        </div>
      </div>
      <div class="card-bottom" v-else>
        <div :class="['card-item', 'card-color' + (index+1)]" v-for="(item, index) in getAssetGroup" :key="index" @click="skipAssets(item)">
          <div class="card-item-img">
            <img :src="require('@assets/img/work-icon1'+ (9-index) +'.png')" />
          </div>
          <div class="card-item-dec">
            <h5>{{ item.assetCateName }}</h5>
            <p class="card-item-num">
              件数:
              <span class="card-num-count" :title="item.gropDetail.totalCount">{{ item.gropDetail.totalCount }}</span>
            </p>
            <p class="card-item-gold">
              金额:
              <span class="card-gold-count" :title="item.gropDetail.totalPrice + '元'">{{ item.gropDetail.totalPrice }}</span>元
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { getAssetsCard } from '@api/assetsCard.js'
import { getTenantInfoDetail } from '@api/tenant.js'
export default {
  mounted() {
    this.getAssets()
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode", "curTenantId"]),
    ...mapState("user", ["userId"]),
  },
  data() {
    return {
      getAssetGroup: []
    }
  },
  methods: {
    //卡片接口
    getAssets() {
      let parms = {
          tenantId: this.curTenantId
      }
      getTenantInfoDetail(parms).then((resq) => {
        let orgid =  resq.data.data.id
        let data = {
          assetCode: "A",
          orgId: orgid,
        }
      getAssetsCard(data).then((res) => {
        if(res.data && res.data.data && res.data.data.length) {
          this.getAssetGroup = res.data.data.slice(0, 5)
        }
      })
      })
      
    },
    ...mapActions("menu", ["changeMenu"]),
    skipAssets(val) {
      if(val == 'all') {
        let menu = {
        id: -1,
        url: 'http://online.zamsupervice.assetcloud.org.cn/platform/slogin/defalut/zvue/711897411064172544?tenant=jgd',
        type: "app",
      };
      this.changeMenu(menu);
      }else {
        let menu = {
        id: -1,
        url: 'http://online.zamsupervice.assetcloud.org.cn/platform/slogin/defalut/zvue/711897411064172544?tenant=jgd&assetCateCode='+ val.assetCateCode + '&assetCateName=' + val.assetCateName + '&type=seatch&totalCount=' + val.gropDetail.totalCount + '&totalPrice=' + val.gropDetail.totalPrice +'&isCall=yes',
        type: "app",
      };
      this.changeMenu(menu);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.indexcard-box {
  .card-top {
    display: flex;
    
    justify-content: space-between;
    align-items: center;
    h3 {
      font-size: 22px;
      font-weight: 600;
      color: rgba(48, 49, 51, 1);
    }
    .card-details {
      cursor: pointer;
      margin-right: 20px;
      font-size: 20px;
      font-weight: 400;
      color: rgba(21, 74, 216, 1);
      .icon-right_blod {
        margin-left: 10px;
      }
    }
  }

  .card-bottom {
    margin-top: 22px;
    display: flex;
    .card-color1 {
      box-shadow: 0px 0px 17px 0px rgba(121, 132, 178, 0.08);
      background: rgba(155, 226, 226, 0.2);
    }
    .card-color2 {
      margin-left: 23px;
      background: rgba(48, 192, 242, 0.1);
      box-shadow: 0px 0px 17px 0px rgba(121, 132, 178, 0.08);
    }
    .card-color3 {
       margin-left: 23px;
      background: rgba(255, 198, 129, 0.1);
      box-shadow: 0px 0px 17px 0px rgba(121, 132, 178, 0.08);
    }
    .card-color4 {
       margin-left: 23px;
      background: rgba(235, 241, 251, 1);
      box-shadow: 0px 0px 17px 0px rgba(121, 132, 178, 0.08);
    }
    .card-color5 {
       margin-left: 23px;
      background: rgba(255, 242, 238, 1);
      box-shadow: 0px 0px 17px 0px rgba(121, 132, 178, 0.08);
    }
    .card-item {
      cursor: pointer;
      width: 230px;
      height: 90px;
      box-shadow: 0px 0px 17px 0px rgba(121, 132, 178, 0.08);
      border-radius: 6px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .card-item-img img {
        margin-left: 12px;
        width: 61px;
        height: 50px;
      }
      .card-item-dec {
        margin-right: 20px;
        max-width: 150px;
        margin-left: 10px;
        h5 {
          width: 100px;
          height: 20px;
          font-size: 14px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #303133;
          line-height: 20px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .card-item-num {
          margin: 5px 0;
          font-size: 12px;
          color: rgba(144, 147, 153, 0.8);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .card-item-gold {
          font-size: 12px;
          color: rgba(144, 147, 153, 0.8);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
@media screen and (max-width: 1500px) {
  #indexcard {
    height: 160px;
    padding: 20px 16px;
  }
  .indexcard-box {
    .card-top {
      h3 {
        font-size: 16px;
      }
      .card-details {
        margin-right: 20px;
        font-size: 14px;
        .icon-right_blod {
          margin-left: 5px;
        }
      }
    }

    .card-bottom {
      width:100%;
      margin-top: 16px;
      .card-item {
        flex: 1;
        width:0;
        height: 90px;
        border-radius: 4px;
        .card-item-img img {
          margin-left: 10px;
          width: 61px;
          height: 50px;
        }
        .card-item-dec {
          margin-right: 15px;
          max-width: 100px;
          h5 {
            width: 95px;
            font-size: 14px;
          }
          .card-item-num {
            margin: 3px 0;
            font-size: 12px;
          }
          .card-item-gold {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
