<template>
  <div class="search-list" style="height:314px;">
    <div class="search-list__search">
      <el-input
        prefix-icon="el-icon-search"
        v-model="searchInput"
        placeholder="请输入搜索内容"
      ></el-input>
    </div>
    <el-scrollbar style="height:100%;padding-top:10px">
      <div class="diy-dialog-body__list">
        <ul v-if="!isShow && codeShow">
          <li v-for="item in dataList" :key="item.id">
            <div style="margin-left:20px" @click="handleRemoveid(item)">
              <i class="el-icon-circle-close"></i>
            </div>
            <div>{{ item.userCode }} {{ item.realName }}</div>
          </li>
        </ul>
        <ul v-else-if="!isShow && !codeShow">
          <li v-for="item in dataList" :key="item.id">
            <div style="margin-left:20px" @click="handleRemoveid(item)">
              <i class="el-icon-circle-close"></i>
            </div>
            <div>
              {{ item.realName }}
            </div>
          </li>
        </ul>
        <ul v-else-if="isShow && codeShow">
          <li v-for="item in searchData" :key="item.id">
            <div style="margin-left:20px" @click="handleRemoveid(item)">
              <i class="el-icon-circle-close"></i>
            </div>
            <div>{{ item.userCode }} {{ item.realName }}</div>
          </li>
        </ul>
        <ul v-else>
          <li v-for="item in searchData" :key="item.id">
            <div style="margin-left:20px" @click="handleRemoveid(item)">
              <i class="el-icon-circle-close"></i>
            </div>
            <div>
              {{ item.realName }}
            </div>
          </li>
        </ul>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchInput: "",
      dataList: [],
      isShow: false,
      searchData: [],
    };
  },
  props: {
    selectList: {
      type: Array,
      default: () => [],
    },
    searchList: {
      type: Array,
      default: () => [],
    },
    codeShow: {
      type: Boolean,
    },
  },
  watch: {
    searchInput(val) {
      if (val == "") {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
      this.$parent.fuzzyQuery(val);
    },
    selectList(val) {
      console.log("rightselect", val);
      this.dataList = val;
    },
    searchList(val) {
      this.searchData = val;
    },
  },
  created() {},
  mounted() {},
  methods: {
    handleRemoveid(val) {
      let data = this.$parent.data;
      if (this.handleIndex(data, val) < 0) {
        let dataIndex = this.searchData.indexOf(val);
        this.searchData.splice(dataIndex, 1);
        let index = this.$parent.selectList.indexOf(val);
        this.$parent.selectList.splice(index, 1);
      } else {
        this.$parent.$refs.leftlist.$refs.tree.setChecked(val.id, false);
        this.$parent.$refs.leftlist.rightDel(val);
      }
      // let index = this.$parent.selectList.indexOf(val)
      // console.log('this1', this.$parent.selectList);
      // this.$parent.selectList = this.$parent.selectList.splice(index,1)
      // console.log('this2', this.$parent.selectList);
    },
    handleIndex(data, val) {
      let index = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i].id == val.id) {
          index = i;
          return index;
        } else {
          index = -1;
        }
      }
      return index;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .is-vertical {
  display: none;
}
::v-deep .el-scrollbar__view {
  display: inline-block;
}
::v-deep .el-scrollbar__wrap {
  overflow: auto;
}
.search-list {
  width: 100%;
  display: flex;
  flex-direction: column;

  &__search {
    margin-top: 20px;
    text-align: center;
    ::v-deep .el-input--prefix .el-input__inner {
      width: 260px;
      border-radius: 100px;
    }
    ::v-deep .el-icon-search:before {
      margin-left: 20px;
    }
  }

  &__list {
    height: 212px;
    margin-top: 20px;
    overflow-y: scroll;
  }
}
.el-checkbox {
  margin-left: 20px;
}
.diy-dialog-body {
  // border: 1px solid rgba(235, 238, 245, 1);
  box-sizing: border-box;
  border-radius: 4px;
  justify-content: flex-start;
  margin-top: 23px;

  &--left,
  &--right {
    width: 48%;
    height: 350px;
  }

  &--left {
    margin-right: 20px;
  }

  &--box {
    border: 1px solid rgba(235, 238, 245, 1);
    height: 310px;
  }
  &--diyList {
    border: 1px solid rgba(235, 238, 245, 1);
  }

  &--leftTop,
  &--rightTop {
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
    height: 230px;
    margin-top: 5px;

    li {
      height: 26px;
      line-height: 26px;
      display: flex;
      flex-direction: row;
      white-space: nowrap;
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
