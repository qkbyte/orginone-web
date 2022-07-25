<template>
<div class="main" style="height:100%;">
  <div class="flex-column" style="height:100%">
    <div class="head-layout">
      <el-checkbox v-model="checked">全选</el-checkbox>
      <div class="number">20/40</div>
    </div>
    <div class="checkBox">
      <el-checkbox-group v-model="checkList">
        <el-checkbox style="margin-top:5px" v-for="item in listData" :key="item.id" :label="item[nodeKey]">{{item.realName}}</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</div>
</template>

<script>
export default {  
  data() {
    return {
      checked:false,
      searchInput:"",
      listData:[],
      checkList:[]
    };
  },
  props:{
    nodeKey:{
      type:String,
      default:'id'
    },  
    selectType:{
      type:Number,
      default:0
    },
    listTitle: {
      type: String,
      default: "列表",
    },
    data: {
      type: [Object,Array],
    },
    props:{
      type: Object,
      default: ()=>{}
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
    data:{
      handler(val){
        this.listData = JSON.parse(JSON.stringify(val))
        this.listData.map((el)=>{
          el.check = false
        })
      },
      immediate:true,
      deep:true
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    a(item){
        console.log('item', item);
    },
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
::v-deep .el-checkbox-group{
    display: flex;
    flex-direction: column;
}
::v-deep .el-checkbox{
    width: fit-content;
}
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
  overflow: auto;
}
</style>
