<template>
  <div class="message-box">
    <div class="message-box__head">
      <div class="message-box__head--left">
        <div class="head-title">{{ title }}</div>
        <div class="head-number">({{ number }})</div>
      </div>
      <el-button type="primary" size="mini" @click="onViewAllBtn()"
        >查看全部</el-button
      >
    </div>
    <div class="message-box__main">
      <ul>
        <li class="message-item" v-for="item in list" :key="item.id">
          <div>{{ item.title }}</div>
          <i class="el-icon-arrow-right"></i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    number: {
      type: Number,
      default: 0
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    onViewAllBtn() {
      this.$router.push({ name: "message",query:{title: this.title} });
    }
  }
};
</script>

<style lang="scss" scoped>
.message-box {
  margin-top: 20px;
  width: 23%;
  height: 100%;
  min-height: 230px;
  max-height: 320px;
  min-width: 240px;
  max-width: 480px;
  background: rgba(255, 255, 255, 1);
  border-top: 9px solid rgba(21, 74, 216, 1);
  opacity: 1;
  border-radius: 4px;
  padding: 10px 30px 20px;

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 40px;

    &--left {
      display: flex;

      .head-title {
        font-size: 16px;
        font-weight: bold;
        line-height: 40px;
        color: rgba(81, 81, 81, 1);
      }

      .head-number {
        margin-left: 10px;
        font-size: 1.25rem;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);

        &:hover {
          color: rgb(201, 0, 0);
          cursor: pointer;
        }
      }
    }
  }

  &__main {
    margin-top: 20px;

    .message-item {
      height: 35px;
      display: flex;
      justify-content: space-between;
      font-size: 1.25rem;
      font-weight: 400;
      color: rgba(112, 112, 112, 1);
      cursor: pointer;
    }
  }
}
</style>
