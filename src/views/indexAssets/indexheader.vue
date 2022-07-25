<template>
  <div id="indexHeader">
    <div class="indexHeader-box">
      <div class="header-left">
        <h3 class="index-title">首页</h3>
        <div style="margin-left:10px" @click="goHelp">
        <i class="iconfont iconbangzhu"></i>
      </div>
      </div>
      <div class="header-right">
        <div class="seachsBox">
          <div class="seachs">
            <span class="el-icon-search"></span>
            <input type="text" placeholder="输入框提示文本" />
          </div>
        </div>
        <i class="iconfont icon-search_list"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goHelp(){
      window.open("http://assetdocs.assetcloud.org.cn/Ues/")
    },
  }
};
</script>
<style lang="scss" scoped>
#indexHeader {
  height: 67px;
}
.indexHeader-box {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-left{
  display: flex;
  align-items: center;
  .iconbangzhu{
    cursor: pointer;
  }
}
.index-title {
  margin-left: 20px;
  font-size: 20px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: rgba(48, 49, 51, 1);
}
.icon-search_list {
  font-size: 25px;
  margin-right: 31px;
}
.seachsBox {
  display: flex;
  align-items: center;
  margin-right: 20px;
  .seachs {
    width: 312px;
    height: 45px;
    padding: 12px 0;
    padding-left: 24px;
    background: rgba(242, 246, 252, 1);
    border-radius: 21px;
    .el-icon-search {
      width: 17px;
      height: 17px;
      margin-right: 15px;
    }
    input {
      border: none;
      outline: none;
      background: transparent;
      color: #909399;
      font-size: 17px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
    }
  }
}
.header-right {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .iconshaixuan:before {
    content: "\E686";
  }
}
@media screen and (max-width: 1500px) {
  #indexHeader {
  height: 48px;
}
.iconbangzhu{
  width: 12px;
  height: 12px;
  transform: scale(0.5);
}
.index-title {
  font-size: 14px;
}
.icon-search_list {
  font-size: 18px;
  margin-right: 22px;
}
.seachsBox {
  margin-right: 15px;
  .seachs {
    width: 222px;
    height: 32px;
    padding: 8px 0;
    padding-left: 17px;
    border-radius: 15px;
    .el-icon-search {
      width: 12px;
      height: 12px;
      margin-right: 15px;
    }
    input {
      font-size: 14px;
    }
  }
}
}
</style>