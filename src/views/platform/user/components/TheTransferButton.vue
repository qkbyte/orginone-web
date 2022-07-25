<template>
  <div class="button-box" style="width:100%">
    <div class="diy-button-bg" @click="handleOpen" v-show="!row.isShow">
        <slot name="icon"> <img src="@assets/btn-operation.svg" alt=""></slot>
    </div>
    <div v-show="row.isShow">
        <slot name="icon"> 
            <div @click="handleClose" class="el-icon-circle-close"></div>
            <div @click="handleCheck" class="el-icon-circle-check"></div>
        </slot>
    </div>
  </div>
</template>

<script>
import Bus from "./eventBus"
export default {
  data() {
    return {
      editData:[]
    };
  },
  watch:{
  },
  props: ["index","row"],
  components: {},
  mounted(){
    Bus.$on('getEditData', target=>{
      this.editData = target
    })
  },
  methods:{
    handleOpen(){
      this.row.isShow = true
      this.$parent.$parent.tableData[this.index].showInput = true
    },
    handleClose(){
      this.row.isShow = false
      this.$parent.$parent.tableData[this.index].showInput = false
      if(this.editData.length == 0){
        this.$parent.$parent.tableData.splice(this.index,1)
      }
      Bus.$emit('handleClose')
    },
    handleCheck(){
      this.row.isShow = false
      this.$parent.$parent.tableData[this.index].showInput = false
      Bus.$emit('handleCheck')
    }
  }
};
</script>

<style lang="scss" scoped>
.diy-button-bg {
  width: 38px;
  height: 20px;
  background: rgba(235, 238, 245, 1);
  border-radius: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  i {
    font-size: 16px;
    color: #61626b;
  }
}
.el-icon-circle-close{
    cursor: pointer;
    margin-right: 10px;
    color: #fb8f90;
    font-size: 20px;
}
.el-icon-circle-check{
    font-size: 20px;
    color:#88d25e;
    cursor: pointer;
}
</style>
