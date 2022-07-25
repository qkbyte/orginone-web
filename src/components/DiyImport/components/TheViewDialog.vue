<template>
  <el-dialog
    center
    width="700px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
  >
    <span slot="title" class="diy-dialog-title"> 导入结果 </span>
    <div class="diy-dialog-body">
      <div class="form">
        <div style="width:250px"><span style="width:70px">文件名：</span>{{ dialogShow.sendData.fileName }}</div>
        <div>
          <span>导入结果：</span>{{ result[dialogShow.sendData.status] }}
        </div>
      </div>
      <div class="table">
        <ul>
          <li v-for="(item,index) in tableList" :key="index" class="table__li">{{item}}</li>
        </ul>
      </div>
    </div>
  </el-dialog>
</template>

<script>

export default {
  data() {
    return {
      result: ["导入中", "成功", "失败"],
      tableList: []
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    this.tableList = this.dialogShow.sendData.context.split(',')
  },
  methods: {
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },
  },
};
</script>

<style lang="scss" scoped>
.diy-dialog-body {
  .form {
    width: 100%;
    display: flex;
    justify-content: space-around;

    & > div {
      display: flex;
      justify-content: center;
      width: 30%;
    }
  }

  .table {
    width: 80%;
    height: 400px;
    margin-top: 10px;
    overflow: auto;
    &__li{
      margin-top: 15px;
      margin-left: 20px;
    }
  }
}
</style>
