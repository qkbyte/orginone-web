<template>
  <div class="base-layout">
    <DiyBoxLayout>
      <template v-slot:table>
        <DiyTable
          ref="table"
          :tableName="tableName"
          :tableHead="tableHead"
          :options="options"
          :tableData="tableData"
          @handleUpdate="loadData"
          @handleLazyTree="handleLazyTree"
          ><template v-slot:buttons>
            <el-button type="text" @click="back">返回</el-button>
            <el-button type="text" @click="sort">初始化排序</el-button>
            <el-button type="text" @click="handleDeletes">删除</el-button>
            <el-button
              type="text"
              @click="$router.push({ name: 'organization-import' })"
              >组织关系导入</el-button
            >
            <el-button type="text" @click="handleAdd">新增</el-button>
          </template>
          <template v-slot:operate="scope">
            <TheTableButton
              v-if="scope.index !== 0"
              :index="scope.index"
              :row="scope.row"
              @handleEdit="handleEdit"
              @handleDelete="handleDelete"
            ></TheTableButton>
          </template>
          <template v-slot:icon="scope">
            <i :class="scope.row.source"></i>
          </template>
        </DiyTable>
      </template>
    </DiyBoxLayout>

    <template v-for="item in dialogShow">
      <TheEditDialog
        v-if="item.key === 'edit' && item.value"
        :key="item.key"
        :dialogShow="item"
        @handleUpdate="loadData"
        @closeDialog="handleCloseDialog"
      ></TheEditDialog>
      <TheAddDialog
        v-if="item.key === 'add' && item.value"
        :key="item.key"
        :dialogShow="item"
        @handleUpdate="loadData"
        @closeDialog="handleCloseDialog"
      ></TheAddDialog>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {  deletesDepartment, disbandGroup, getGroupTree,getBelowGroup,getGroupData,sortLazyTree } from "@api/group";
import DiyTable from "@components/DiyTable/index";
import TheEditDialog from "./TheEditDialog";
import TheAddDialog from "./TheAddDialog";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheTableButton from "./TheTableButton";
import launchFlowVue from '../../../../workorder-launch/launchFlow.vue';

export default {
  data() {
    let _this = this;
    return {
      dialogShow: [
        {
          key: "edit",
          value: false,
        },
        {
          key: "add",
          value: false,
        },
      ],
      tableName: "组织列表",
      tableData: [],
      tableHead: [
        {
          prop: "groupName",
          label: "组织名称",
          width: "400",
        },
        {
          prop: "updateTime",
          label: "更新时间",
          minWidth: "400",
        },
        {
          type: "slot",
          label: "操作",
          fixed: "right",
          align: "center",
          width: "80",
          name: "operate",
        },
      ],
      options: {
        checkBox: true,
        order: true,
        defaultSort: { prop: "createTime", order: "descending" },
        treeProps: {
          children: "children",
          hasChildren: "below",
        },
        noPage: true,
      },
      filterText: "",
      unitName:'',
    };
  },
  components: {
    DiyTable,
    TheEditDialog,
    TheAddDialog,
    DiyBoxLayout,
    TheTableButton,
  },
  created() {
    this.$nextTick(() => {
      this.loadData();
    });
  },
  mounted() {},
  computed: {
     ...mapGetters("group", ["curGroupId"]),
    getFilterText() {
      return this.$store.state.searchContent;
    },
  },
  watch: {
    getFilterText(val) {
      this.filterText = val;
      this.loadData();
    },
  },
  methods: {
    async handleLazyTree(tree,callback){
      let params = {
        groupId: tree.id,
      }
      const res = await getBelowGroup(params)
      let list = res.data.data
      callback(res.data.data)
    },
    back(){
      this.$router.go(-1)
    },
    handleCloseDialog(val){
      this.dialogShow.map((el)=>{
        if(el.key == val){
          el.value = false
        }
      })
      this.loadData()
    },
    async loadData() {
      this.$refs.table.loading = true;
      this.tableData = []
      let params = {
        groupId: this.curGroupId,
      };
      try {
        await getGroupData(params).then((res) => {
          let resList = res.data.data;
          resList.below = true
          this.tableData.push(resList);
          this.$refs.table.loading = false;
        });
      } catch (error) {
        this.$message.warning(error)
      }
    },
    handleAdd() {
      this.dialogShow.map((el) => {
        if (el.key === "add") {
          el.value = true;
        }
      });
    },
    sort(){ // 初始化排序
      let params = {
        sourceGroupId:this.curGroupId,
        orderStatus: 'init',
      }
      sortLazyTree(params).then((res)=>{
        console.log('res', res);
        this.$message.success('初始化排序成功')
      })
    },
    // 批量删除
    handleDeletes() {
      let ids = [];
      this.$refs.table.multipleSelection.forEach((element) => {
        ids.push(element.id);
      });
      if (ids.length === 0) {
        return this.$message.warning("请至少选择一个组织");
      }else{
        this.$confirm('此操作将永久删除所选组织, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            groupIdList: ids,
            sourceGroupId: this.curGroupId,
          };
          deletesDepartment(params).then((res) => {
            this.$message.success("删除组织成功");
            this.loadData()
          });
        }).catch(() => {
          return       
        });

      }
    },

    handleEdit(index, row) {
      this.dialogShow.map((el) => {
        if (el.key === "edit") {
          el.value = true;
          el.sendData = row;
        }
      });
      
    },
    handleDelete(index, row) {
      if(row.parentId == -1){
        this.$message.warning("不能删除根节点")
        return
      }else if(row.children.length !== 0){
        this.$confirm('此操作将永久删除该节点以及下级的所有节点, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            groupId: row.id,
            sourceGroupId: this.curGroupId,
          };
          disbandGroup(params).then(
            (res) => {
              this.loadData();
              this.$message.success({
                message: "删除成功",
                duriation: 700,
              });
            },
            (err) => {
              loading.close();
            }
          );
        }).catch(() => {
          return         
        });
      }else{
        this.$confirm('此操作将永久删除该节点, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            groupId: row.id,
            sourceGroupId: this.curGroupId,
          };
          disbandGroup(params).then(
            (res) => {
              this.loadData()
              this.$message.success({
                message: "删除成功",
                duriation: 700,
              });
            },
            (err) => {
              loading.close();
            }
          );
        }).catch(() => {
          return           
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
