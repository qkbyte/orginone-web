<template>
<div class="main" style="height:100%;">
  <div class="search-list__search">
      <el-input
        prefix-icon="el-icon-search"
        v-model="searchInput"
        placeholder="请输入搜索内容"
      ></el-input>
  </div>
  <div style="flex:1;height:1px">
      <checkBox
        node-key="id"
        :props="listOption"
        :selectType="selectType"
        :listTitle="listTitle"
        :data="listData"
        :title="title"
        :type="type"
        :isChoose="isChoose"
        :curTab="curTab"
        :allListData="allListData"
      >
      </checkBox>
  </div>
</div>
</template>

<script>
import checkBox from "@components/DiyCheckBox/index"
export default {  
  data() {
    return {
      checked:false,
      searchInput:"",
      listOption: {
        label: "id",
        children: "children",
      },
    };
  },
  props:{
    selectType:{
      type:Number,
      default:0
    },
    listTitle: {
      type: String,
      default: "列表",
    },
    listData: {
      type: [Object,Array],
    },
    title: {
      type: String,
      default: "title",
    },
    type: {
      type: Number,
      default: 0,
    },
    isChoose: {
      type: Boolean,
      default: false
    },
    curTab:{
      type:String,
      default:''
    },
    allListData:{
      type:Array,
      default:()=>[]
    },
  },
  components: {
    checkBox
  },
  computed: {
  },
  watch: {
    searchInput(val) {
      if(this.selectType == 0){
        this.$parent.$parent.handlerSearchRight(val);
      }else{
        this.$parent.$parent.allList = []
        this.$parent.$parent.searchJobList(val)
      }
    },
  },
  created() {
  },
  mounted() {
  },
  methods: {
    load(){},
    getChoseTree(){ // 用来获取已选中的树
    },
    handleCheck(data) {
    },
    //递归设置子节点和父节点
    setNode(node) {
    },
    //递归设置子节点状态
    setChildNdoe(node, check) {
    },
    radioChange(val){
    },
    handleNodeClick(data,node,obj){
    },
    handleCheckChange(data, checked, indeterminate) {
    },
    getCheckedNodes() {
    },
    setCheckedNodes(){
    },
    filterNode(value, data) {
    },
    handleRepeat(arr, key){
    }
  },
};
</script>

<style lang="scss" scoped>
.head-layout{
  margin-top: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .number{
    margin-top: 2px;
  }
}
.checkBox{
  display: flex;
  flex-direction: column;
  margin-top: 3px;
}
.main{
  display: flex;
  flex-direction: column;
}
</style>
