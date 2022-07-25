<template>
  <div class="diy-dialog-body">
      <template>
        <div class="diy-dialog-body--left">
          <div class="diy-dialog-body--leftTop">
              <!-- <el-checkbox class="el-checkbox" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
              <p style="margin-right:30px">{{selectList.length}} / {{total}}</p> -->
          </div>
          
          <LeftList
            class="diy-dialog-body--leftList"
            ref="leftlist"
            :listData="data"
            @handleSelection="handleSelection"
            :title="'realName'"
            :codeShow="codeShow"
          ></LeftList>
        </div>
        <div class="diy-dialog-body--right">
          <div class="diy-dialog-body--rightTop"></div>
          <RightList
            class="diy-dialog-body--rightList"
            ref="rightlist"
            :selectList="selectList"
            :searchList="searchList"
            :codeShow="codeShow"
          ></RightList>
        </div>
      </template>
  </div>
</template>

<script>
import LeftList from "./TheLeftList";
import RightList from "./TheRightList";

export default {
  data() {
    return {
      checkAll: false,
      data: [], //所有用户
      total: 0,
      value: [],
      current: 1,
      query: "",
      loading: false,
      selectList: [], //当前选择用户
      val: [],
      expandedKeys: [],
      isCurrent: false,
      isChoose: true,
      deptId: -1,
      determin: [],
      isSelect:false,
      searchList: []
    };
  },
  components: {
    LeftList,
    RightList,
  },
  props:{
    type:{
      type:String,
      default:''
    },
    number:{
      type:Number,
      default:0
    },
    dataList:{
      type:Array,
      default:() => {}
    },
    select:{
      type:Array,
      default:() => {}
    },
    codeShow:{
      type:Boolean,
      default:false
    }
  },
  watch:{
     number:{
      handler(val, oldVal){
        this.total = val
      },
      deep:true //true 深度监听
     },
     dataList:{
      handler(val, oldVal){
        this.data = val
      },
      deep:true //true 深度监听
     },
     select:{
      handler(val, oldVal){
        this.selectList = val
        this.getValue(val)
      },
      deep:true //true 深度监听
     }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    getValue(val){
      this.value = []
      val.forEach((element)=>{
        this.value = [...this.value, element.id]
      })
    },
    handleSelection(val,select,isSearch) {
      if(isSearch){
        this.selectList = select
        if(this.$refs.rightlist.isShow){ // 在两边都处于搜索状态时，执行
          this.determin = select
          this.fuzzyQuery(this.$refs.rightlist.searchInput)
        }
      }else{
        this.selectList = select
        this.determin = select
        if(select.length == 0){
          this.$parent.selectList = select
        }
        this.fuzzyQuery(this.$refs.rightlist.searchInput)
      }
      this.getValue(this.selectList)
    },
    fuzzyQuery(val){
      if(val == ''){
        if(this.determin.length != 0){
          this.selectList = this.determin
        }else{
          this.selectList = this.select
        }
        // this.selectList = this.determin
      }else{
        this.searchList = []
        for(var i=0;i<this.selectList.length;i++){
          if(this.selectList[i].realName.indexOf(val) >= 0){
            this.searchList.push(this.selectList[i])
          }
        }
        // this.selectList = arr
      }
    }
    // handleCheckAllChange(val) {
    //     if (this.checkAll) {
    //         this.$refs.leftlist.$refs.tree.setCheckedNodes(this.data);
    //     } else {
    //         this.$refs.leftlist.$refs.tree.setCheckedKeys([]);
    //     }
    // }
  },
};
</script>

<style lang="scss" scoped>
.el-checkbox{
  margin-left: 20px;
}
.diy-dialog-body {
  box-sizing: border-box;
  border-radius: 4px;
  justify-content: flex-start;
  margin-top: 23px;

  &--left,
  &--right {
    width: 48%;
    height: 350px;
  }

  &--left{
    margin-right: 20px;
  }

  &--box{
    border:1px solid rgba(235, 238, 245, 1);
    height: 310px;
  }
  &--leftList,
  &--rightList{
    border:1px solid rgba(235, 238, 245, 1);
  }

  &--leftTop,
  &--rightTop{
    width: 100%;
    height: 40px;
    border-radius: 10px 10px 0px 0px;
    border: 1px solid rgba(235, 238, 245, 1);
    background-color: #f5f7fa;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  &__title {
    font-size: 14px;
    font-weight: 500;
    line-height: 40px;
    color: rgba(48, 49, 51, 1);
  }

  &__list {
    height: 280px;
    margin-top: 20px;
    overflow: auto;

    li {
      height: 26px;
      line-height: 26px;
      display: flex;
      justify-content: space-between;

      i {
        color: #c0c4cc;
        cursor: pointer;
        margin-right: 20px;
        &:hover {
          color: #9da1a8;
        }
      }
    }
  }
}
</style>
