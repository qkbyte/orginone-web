<template>
  <div class="layout-box">
    <div class="content">
      <div class="content__background">
        <div class="content__taskbtn"></div>
      </div>
      <div class="content__text">
        风险预警
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.layout-box {
  width: 100%;
  height: 100%;
  background: white;
}
.content {
  background: white;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  &__background {
    width: 32px;
    height: 32px;
    background: rgba(249, 60, 100, 0.1);
    margin: 20px 10px 20px 40px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__taskbtn {
    width: 25px;
    height: 25px;
    background: url(../../assets/taskbtn.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  &__text {
    width: 67px;
    height: 22px;
    font-size: 24px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #303133;
    line-height: 22px;
    margin: 29px 44px 29px 0;
    white-space: nowrap;
  }
}
</style>
