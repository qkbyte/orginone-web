<template>
<div class="main">
    <div class="main-list" v-for="item in selectedList" :key="item.id">
      <div class="main-list-left">
        <i @click="handleRemoveid(item)" style="margin-top:3px" class="el-icon-circle-close"></i>
        <el-tooltip class="main-list-left__text" :content="item.name" placement="top">
            <div v-if="item.name.length > 9">{{item.name}}</div>
        </el-tooltip>
        <div class="main-list-left__text" v-if="item.name.length<= 9"> {{item.name}} </div>
      </div>
      <div class="main-list-right">{{item.label}}</div>
    </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      selectedList:[]
    };  
  },
  props: {
    selectList:{
      type: Array,
      default: ()=>[]
    },
  },
  watch:{
    selectList:{
      handler(val){
        this.selectedList = val
      },
      deep:true,
      immediate:true,
    }
  },
  components: {
  },
  created() {
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    handleRemoveid(data){
      let select = this.$parent.$parent.selectTwoList
      let index = select.indexOf(data)
      if(index >= 0){
        select.splice(index, 1)
      }
      this.$parent.$parent.$refs.removeList.$refs.tree.setChecked(data.id, false);
    }
  },
};
</script>

<style lang="scss" scoped>
.main{
  padding-top: 40px;
  &-header{
      margin-top: 10px;
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: 22px;
  }
  &-list{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;
    &-left{
      display: flex;
      flex-direction: row;
      width: 60%;
      i{
        cursor: pointer;
      }
      &__text{
        margin-left: 10px;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
    }
  }
}
</style>
