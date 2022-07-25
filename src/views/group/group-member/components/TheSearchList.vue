<template>
  <div class="search-list" style="height:300px">
    <div class="search-list__option">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>
    </div>
    <el-scrollbar style="height:100%;padding-top:5px;padding-bottom: 10px" id="scroll">
    <div class="search-list__list tree">
      <el-tree
        ref="tree"
        :props="listOption"
        :data="listData"
        node-key="id"
        show-checkbox
        :check-strictly="true"
        :load="loadNode"
        :filter-node-method="filterNode"
        @check="handleCheckChange"
        lazy
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span v-if="data.type === 1" >
            <i
              style="color:rgba(37,110,255,0.8);"
              class="el-icon-office-building"
            ></i>
          </span>
          <span v-else>
            <i style="color:rgba(16,182,255,0.8);" class="el-icon-school"></i
          ></span>
          <span style="margin-left:5px;">{{ node.label }}</span>
        </span>
      </el-tree>
    </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getGroupData,getBelowLayer } from "@api/group"
export default {
  data() {
    return {
      checkOption: 2, //关联下级节点
      listOption: {
        label: "",
        children: "children",
        isLeaf: 'leaf',
      },
      multipleSelection: [],
      filterText:"",
      radioLabel:"",
      listData: [],
    };
  },
  props: {
    listTitle: {
      type: String,
      default: "列表",
    },
    // listData: {
    //   type: Array,
    //   default: () => [],
    // },
    title: {
      type: String,
      default: "title",
    },
    radio:{
      type: Number,
      default:0,
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    radio:{
      handler(val){
        switch (val) {
          case 1:
            this.radioLabel = '无关联';
            break;
          case 3:
            this.radioLabel = '关联全部下级';
            break;
          case 2:
            this.radioLabel = '关联直接下级';
            break;
        }
      },
      immediate:true,
    }
  },
  created() {
    this.listOption.label = this.title;
  },
  computed: {
    ...mapGetters("group", ["curGroupId"]),
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  methods: {
    loadNode(node, resolve) {        // 加载 树数据   
      let that = this;
      if (node.level === 0) {
        that.loadtreeData(resolve);
      }
      if (node.level >= 1) {
        this.getChildByList(node.data.id, resolve);
        // return resolve([]); // 加上这个，防止在该节点没有子节点时一直转圈的问题发生。
      } 
    },
    loadtreeData( resolve) {      // 获取loadtreeData 就是父节点数据，getChildByList就是异步获取子节点数据
      let params = {
        groupId: this.curGroupId,
      };
      getGroupData(params).then((res) => {
        console.log('res', res);
        if( res.data.success == true){
          let data = [res.data.data]
          data.forEach((el)=>{
            el.name = el.groupName
            delete el.groupName
            el.children = []
            el.parentId = -1;
          })
          resolve(data)
        }else{
          return false;
        }
      });
    },
    getChildByList( _parentID,resolve) {     // 获取子节点请求
      let params = {
        groupId: _parentID,
        sourceGroupId: this.curGroupId,
      }
      getBelowLayer(params).then((res) => {
        if(res.data.success == true){
          let data = res.data.data
          data.forEach((el)=>{
            if(!el.below){
              el.leaf = true;
            }
          })
          resolve(data)
        }else{
          return false
        }
      });
    },
    handleCheck(data) {
      const node = this.$refs.tree.getNode(data.id);
      this.setNode(node);
    },
    handleCheckChange(data, checked) {
      console.log('-------------data',data,checked);
      // 触发选择事件
      let select = this.$parent.$parent.selectOneList
      console.log('select', select);
      let del = 0
      let judge = false
      for(var i=0;i<checked.checkedNodes.length;i++){
          if(data == checked.checkedNodes[i]){
            judge = true //选择
            break
          }else{
            judge = false //取消选择
          }
        }
        if(judge){
          data.label = this.radioLabel
          data.radio = this.radio
          select = [...select,data]
        }else{
          for(let i=0;i<select.length;i++){
            if(select[i].id == data.id){
              del = i
            }
          }
          select.splice(del,1)
        }  
        this.multipleSelection = this.getCheckedNodes();
        this.$emit("handleSelection", this.multipleSelection,select);
    },
    //递归设置子节点和父节点
    // setNode(node) {
    //   if (this.checkOption === 1) {
    //     //关联子节点
    //     if (node.checked) {
    //       //如果选中当前节点,则递归设置子节点全部取消选中
    //       this.setChildNdoe(node, true);
    //     } else {
    //       //如果取消选中当前节点,则递归设置子节点全部选中
    //       this.setChildNdoe(node, false);
    //     }
    //   }
    // },
    //递归设置子节点状态
    // setChildNdoe(node, check) {
    //   if (node.childNodes && node.childNodes.length) {
    //     node.childNodes.forEach((item) => {
    //       item.checked = check;
    //       this.setChildNdoe(item, check);
    //     });
    //   }
    // },
    // handleCheckChange(data, checked, indeterminate) {
    //   this.multipleSelection = this.getCheckedNodes();
    //   console.log('mul', this.multipleSelection);
    //   this.$emit("handleSelection", this.multipleSelection);
    // },
    getCheckedNodes() {
      return this.$refs.tree.getCheckedNodes();
    },
    filterNode(value, data) {
      console.log('value', value, 'data', data);
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .is-vertical{
  display: none;
}
::v-deep .el-scrollbar__view{
  display: inline-block;
}
::v-deep .el-scrollbar__wrap{
  overflow: auto;
}
.tree{
    min-width: 278px;
    padding-top: 5px;
    flex:auto;
    background: white;
    .el-tree-node {
      .el-tree-node__content {
        height: 40px;
        min-width:100%;
        display:inline-flex;
      }
      .el-tree-node__children {
        overflow: unset;
        width: 100%;
      }
    }
}
::-webkit-scrollbar {
  width: 8px;
  height: 0px;
  background: #ffffff;
}
::-webkit-scrollbar-thumb {
  height: 0px;
  border-radius: 4px;
  background: #90939928;
}
::-webkit-scrollbar-thumb:hover {
  width: 8px;
  background: #90939967;
}
.search-list {
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
