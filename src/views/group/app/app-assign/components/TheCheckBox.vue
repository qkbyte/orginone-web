<template>
<div class="main">
  <el-checkbox-group v-if="tabs == 0" v-model="checkUnit" @change="handleCheck">
    <el-checkbox v-for="item in unit" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
  </el-checkbox-group>
  <el-checkbox-group v-else v-model="checkRemove" @change="handleCheckRemove">
    <el-checkbox v-for="item in unit" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
  </el-checkbox-group>
</div>
</template>

<script>
export default {
  data() {
    return {
        checkAll: false,
        checkUnit:[],
        checkRemove:[],
        unit: [
          {
            id:'1',
            name:'全选'
          },
          {
            id:'2',
            name:'主管单位'
          },
          {
            id:'3',
            name:'基层单位'
          }
        ],
        isIndeterminate: true
      };  
  },
  props:['tabs'],
  components: {
  },
  async created() {
  },
  mounted() {
  },
  computed: {
  },
  watch: {
    checkUnit(val){
      console.log('val',val);
    }
  },
  methods: {
    handleCheck(val){
      this.$emit('checkChange', val)
    },
    handleCheckRemove(val){
      this.$emit('checkChange', val)
    }
  },
};
</script>

<style lang="scss" scoped>
.main{
  display: flex;
  flex-direction: row;
}
</style>
