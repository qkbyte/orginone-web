<template>
<div class="main">
  <el-radio-group v-if="tabs == '0'" v-model="radio" @change="handleCheck">
    <el-radio v-for="item in radioBox" :key="item.label" :label="item.label">{{item.value}}</el-radio>
  </el-radio-group>
  <el-radio-group v-else v-model="radioRemove" @change="handleCheckRemove">
    <el-radio v-for="item in radioBox" :key="item.label" :label="item.label">{{item.value}}</el-radio>
  </el-radio-group>
</div>
</template>

<script>
export default {
  data() {
    return {
        radio: 1,
        radioRemove:1,
        radioBox: [
            {
                label:1,
                value: "无关联"
            },
            {
                label:3,
                value: "关联全部下级"
            },
            {
                label:2,
                value: "关联直接下级"
            },

        ]
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
  },
  methods: {
    handleCheck(val){
      console.log('val',val);
      this.$emit('radioChange', val)
    },
    handleCheckRemove(val){
      console.log('val',val);
      this.$emit('radioChange', val)
    },
  },
};
</script>

<style lang="scss" scoped>
.main{
  display: flex;
  flex-direction: row;
}
</style>
