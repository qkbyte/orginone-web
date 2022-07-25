<template>
  <div
    class="base-flex"
    style="flex:1;height:1px "
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="保存中"
  >
    <TheSearchInput
      placeholder="输入字典内容进行搜索"
      :filterText.sync="filterText"
    ></TheSearchInput>

    <div class="tree">
      <el-tree
        class="filter-tree"
        draggable
        :allow-drop="allowDrop"
        :data="deptTree"
        node-key="id"
        highlight-current
        default-expand-all
        :filter-node-method="filterNode"
        ref="tree"
      >
        <div
          class="node-model"
          slot-scope="{ node, data }"
          @click.stop="handleClick(data)"
        >
          <div class="node-model--left">
            <div v-show="checkValue == 1" class="node-model__title" :title="data.dictValue">
              <svg class="icon " aria-hidden="true">
                <use :xlink:href="'#icon-zuzhiguanli1'"></use>
              </svg>
              {{ data.dictValue }}
            </div>
            <div v-show="checkValue == 2" class="node-model__title" :title="data.dictValue">
              <svg class="icon " aria-hidden="true">
                <use :xlink:href="'#icon-zuzhiguanli1'"></use>
              </svg>
              {{ data.code }}
            </div>
            <div v-show="checkValue == 3" class="node-model__title" :title="data.dictValue">
              <svg class="icon " aria-hidden="true">
                <use :xlink:href="'#icon-zuzhiguanli1'"></use>
              </svg>
              {{ data.code }}  {{data.dictValue}}
            </div>
          </div>
        </div>
      </el-tree>
    </div>

    <div
      style="height:55px;border-top:1px solid #EBEEF5;margin-bottom:8px"
      class="flex-center"
    >
      <el-button
        type="text"
        style="width:100%;font-size:16px;"
        @click="handleGo"
        >字典维护</el-button
      >
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TheSearchInput from "./TheSearchInput";
import DiyButton from "@components/DiyButton/index";
import { getDictList,filterbydict,getDictMax } from "@api/dict";
export default {
  name: "TheDeptTree",
  data() {
    return {
      dialogShow: [
        {
          key: "edit",
          value: false,
        },
      ],
      filterText: "",
      deptTree: [],
      loading: false,
      current:1,
      size: 50,
      code: '',
      dictValue: '',
      checkValue: 1,
      timer: null,
      isClick: false
    };
  },
  watch: {
    filterText(val) {
      this.current = 1
      this.handleFilterText(val)
    },
    checkList(val){
      if(val.length == 2){
        this.checkValue = 3
      }else{
        if(val.indexOf('字典名') !== -1){
          this.checkValue = 1
        }else if(val.indexOf('字典编码') !== -1){
          this.checkValue = 2
        }else{
          this.checkValue = 0
        }
      }
    }
  },
  props:{
    checkList:{
      type: Array,
      default: ()=>[]
    }
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode", "curTenant"]),
  },
  components: { TheSearchInput, DiyButton },
  created() {
    this.$nextTick(() => {
      this.loadData();
    });
  },
  mounted(){
     // 滚动加载数据
    this.$nextTick(() => {
      let handler = (event) => {
        // var left = document.getElementById("list");
        var left = document.getElementsByClassName('filter-tree')[0];
        var scrollTop = left.scrollTop;
        var windowHeight = left.clientHeight;
        var scrollHeight = left.scrollHeight;
        // console.log(scrollTop,windowHeight,scrollHeight);
        if (scrollTop + windowHeight + 0.5  >= scrollHeight) {
          this.timer = setTimeout(()=>{
            let search = this.searchInput
            if(search == ''){
              this.current += 1;
              this.loadData();
            }else{
              this.current += 1;
              this.loadData(search)
            }
          }, 500)
        }
      };
      // let listener = document.getElementById("list");
      let listener = document.getElementsByClassName('filter-tree')[0];
      listener.addEventListener("scroll", handler, true);
      this.$once("hook:beforeDestroy", (e) => {
        listener.removeEventListener("scroll", handler);
      });
    });
  },
  beforeDestroy(){
    clearTimeout(this.timer)
    this.timer = null
  },
  methods: {
    // 搜索过滤
    handleFilterText(val){
      let params = {
        current: this.current,
        size: this.size,
        filtertext: "dict_value like '%"+val+"%'"
      }
      filterbydict(params).then((res) => {
        //let resList = res.data.data.records;
        this.deptTree = res.data.data.records;
        console.log('res', res);
      })
    },
    // 树组件拖拽功能
    allowDrop(draggingNode, dropNode, type){
      if(draggingNode.level === dropNode.level){
        if(draggingNode.parent.id === dropNode.parent.id){
          return type === 'prev'
        }
      }else{
         // 不同级进行处理
      }
    },
    loadData() {
      let params = {
        code: this.code,
        current: this.current,
        dictValue: this.dictValue,
        size: this.size,
      };
      getDictList(params).then((res) => {
        let resList = res.data.data.records;
        this.deptTree = this.deptTree.concat(resList)
        if(resList.length !== 0){ // 到底部的判断
          if(this.isClick){
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(this.$parent.$parent.dictData.id);
              this.handleClick(this.$parent.$parent.dictData)
            });
          }else{
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(this.deptTree[0].id);
              this.handleClick(this.deptTree[0])
            });
          }
        }
      });
    },
    //设置当前选中部门节点
    handleClick(data) {
      // data = this.getMaxVersion(data)
      this.$parent.$parent.dictData = data
      this.isClick = true
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(data.id);
      });
    },
    //  获取最大版本号
    // getMaxVersion(data){
    //   console.log(data);
    //   let params={
    //     parentid: data.id
    //   }
    //   getDictMax(params).then((res) => {
    //     data.version = res.data
    //   });
    //   return data
    // },
    //据关键字筛选部门树
    filterNode(value, data) {
      if (!value) return true;
      return data.agencyName.indexOf(value) !== -1;
    },

    handleCloseDialog(key) {
      this.dialogShow.map((el) => {
        if (el.key === key) {
          el.value = false;
        }
      });
      this.loadData();
      this.$emit("handleUpdate");
    },

    //跳转
    handleGo(){
      this.$router.push({name:"dictionary-maintenance"})
    }
  },
};
</script>

<style lang="scss" scoped>
.tree {
  height: 1vh;
  flex: 1;
  overflow: auto;
  background: white;
  margin-top: 15px;
  margin-bottom: 10px;
  .el-tree-node {
    .el-tree-node__content {
      height: 40px;
      min-width: 100%;
      display: inline-flex;
    }
    .el-tree-node__children {
      overflow: unset;
      width: 100%;
    }
  }
}
.filter-tree {
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 100%;
  .node-model {
    width: 100%;
    height: 30px;
    line-height: 30px;
    display: flex;
    justify-content: space-between;

    &--left {
      flex: 1;
    }

    &__title {
      overflow: hidden;

      svg {
        margin-right: 5px;
      }
    }
    &__btn {
      width: 20px;
      display: flex;
      align-items: center;
    }
  }
}
.filter-tree ::v-deep .el-tree-node__content {
  height: 30px;
}
.node-model__btn ::v-deep .diy-button-bg {
  background-color: transparent;
}
</style>
