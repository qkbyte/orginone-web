<template>
  <DiyBoxLayout class="layout" style="height:auto;">
    <div class="main-form">
      <div class="title">
        <div class="title-left">{{ title }}</div>
        <div
          class="title-right"
          v-if="!['未分配人员', '未分配单位'].includes(mainTableData[0].value1)"
        >
          <slot name="buttons">
            <span
              v-for="item in buttons"
              :key="item.label"
              @click="handleClick(item.event)"
              >{{ item.label }}</span
            >
          </slot>
        </div>
      </div>
      <table class="table-mytable">
        <tr v-for="(item, index) in mainTableData" :key="index">
          <td class="left">{{ item.label1 }}</td>
          <td class="column">{{ item.value1 }}</td>
          <td class="left">{{ item.label2 }}</td>
          <td class="column">{{ item.value2 }}</td>
        </tr>
      </table>
    </div>
  </DiyBoxLayout>
</template>

<script>
import DiyBoxLayout from "@layout/DiyBoxLayout/index";

export default {
  props: {
    mainTableData: {
      type: Array,
      default: [],
    },
    title: {
      type: String,
      default: "",
    },
    buttons: {
      type: Array,
      default: ()=>[],
    },
  },
  components: {
    DiyBoxLayout,
  },
  methods: {
    handleClick(e) {
      this.$emit(e);
    },
  },
};
</script>

<style lang="scss" scoped>
.main-form {
  padding: 15px 0 25px 0;
  .title {
    display: flex;
    justify-content: space-between;
    .title-left {
      font-size: 16px;
      font-weight: 600;
      color: rgba(48, 49, 51, 1);
      margin-bottom: 20px;
    }
    span {
      margin-left: 12px;
      color: #154ad8;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }
  }
}
.table-mytable {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}
td,
tr {
  border: 1px solid rgba(239, 242, 247);
  color: #666;
  height: 45px;
}
.left {
  background: rgb(245, 246, 252);
  width: 10.4%;
  min-width: 110px;
}
.column {
  width: 39.6%;
  text-align: left;
  padding: 0 20px;
}
</style>
