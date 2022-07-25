<template>
  <div class="diy-search-list">
    <div class="diy-search-list__title">
      {{ listTitle }}
    </div>
    <div class="diy-search-list__search">
      <el-input
        prefix-icon="el-icon-search"
        v-model="searchInput"
        placeholder="请输入搜索内容"
      ></el-input>
    </div>
    <div class="diy-search-list__list">
      <el-radio
        v-model="selectValue"
        :label="item.value"
        v-for="(item, index) in targetUser"
        v-show="isShow(item)"
        @change="handleFilter"
        :key="index"
        >{{ item.label }}
      </el-radio>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchInput: "",
      dataList: [],
      selectValue: '',
    };
  },
  props: {
    listTitle: {
      type: String,
      default: "列表",
    },
    listData: {
      type: Array,
      default: () => [],
    },
    selected:{
      type:[String, Number],
      default:""
    },
    targetUser:{
      type:Array,
      default:()=>[]
    }
  },
  watch:{
    selected(val){
      this.selectValue = val
    } 
  },
  created() {
    // this.dataList = this.listData;
    // if (this.listData) {
    //   this.selected = this.listData[0].value;
    // }
  },
  mounted(){},
  methods: {
    isShow(val) {
      if (!this.searchInput) return true;
      return val.key.includes(this.searchInput);
    },
    handleFilter() {
      this.$emit("handleFilter", this.selectValue);
    },
  },
};
</script>

<style lang="scss" scoped>
.diy-search-list {
  margin-top: 4px;
  margin-right: 4px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  display: flex;
  flex-direction: column;

  &__title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    padding-bottom: 20px;
    color: rgba(102, 102, 102, 1);
  }

  &__list {
    display: flex;
    flex-direction: column;

    .el-radio {
      margin-top: 20px;
    }
  }
}
</style>
