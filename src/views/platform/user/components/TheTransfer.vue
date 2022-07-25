<template>
  <el-dialog
      title="角色管理"
      :visible.sync="dialogShow.value"
      width="30%"
      class="dialog-role"
      :close-on-click-modal='false'
      @close="handleClose('ruleForm')"
    >
      <TheTable
        ref="table"
        :tableHead="tableHead"
        :options="options"
        :tableData="tableData"
        @handleUpdate="loadData"
      >
        <template v-slot:buttons>
          <el-button type="text" @click="handleAdd">新增</el-button>
          <el-button type="text" @click="handleDel">删除</el-button>
        </template>
        <template v-slot:operate="scope">
          <TheTransferButton
            ref="transferBtn"
            :index="scope.index"
            :row="scope.row"
          ></TheTransferButton>
        </template>
      </TheTable>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="handleClick('ruleForm')">完 成</el-button>
      </span>
    </el-dialog>
</template>

<script>
import Bus from "./eventBus"
import { mapState } from "vuex";
import { getUserRole,deleteRolesToUsers,updateRolesToUsers } from "@api/role";
import TheTable from "./TheTransferTable"
import TheTransferButton from "./TheTransferButton"
export default {
  name: "TheAppDialog",
  data() {
    return {
      options: {
        labelWidth: "150px",
      },
      ruleForm: {
        groupName:'',
        groupCode: '',
        groupDescription: '',
        linkMan: '',
        linkPhone: '',
        status: '',
        tenantCode: '',
        type:'',
        unitName: '',
      },
      tableHead: [
        {
          prop: "id",
          label: "id",
          minWidth: "100",
        },
        {
          type: "slot",
          label: "操作",
          fixed: "right",
          align: "center",
          width: "80",
          minWidth: "80",
          name: "operate",
        },
      ],
      options: {
        checkBox: true,
        order: true,
        defaultSort: { prop: "createdTime", order: "descending" },
        treeProps: {
          children: "children",
          hasChildren: "hasChildren",
        },
      },
      tableData:[],
      show:false
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
    editData:{
      type:Object,
      default: () => {},
    }
  },
  watch:{
    editData:{
      handler(val){
        this.loading(val)
      }
    },
  },
  components: {
    TheTable,
    TheTransferButton
  },
  created() {
    this.$nextTick(()=>{
      this.loadData()
    })
  },
  mounted(){
    Bus.$on('handleCheck', ()=>{
      this.tableData.forEach((el,index)=>{
        el.id = this.$refs.table.editData[index].id
      })
    })
  },
  destroyed(){
    Bus.$off('handleCheck')
  },
  computed: {
  },
  methods: {
    handleCheck(){},
    loadData(){
      const { currentPage, pageSize } = this.$refs.table.page;
      let params = {
        id: this.dialogShow.sendData.id,
        current: currentPage,
        size: pageSize,
      }
      getUserRole(params).then((res) => {
        const { records, total } = res.data.data
        // this.tableData = data.data
        let obj = []
        records.forEach(el => {
          obj.push({id: el, showInput:false, isShow:false})
        });
        this.tableData = obj
        this.$refs.table.page.total = total;
        this.$refs.table.loading = false;
      });
    },
    handleClose(formRef) {
      this.$emit('closeEdit', this.dialogShow.key)
    },
    handleDel(){
      let ids = [];
      this.$refs.table.multipleSelection.forEach((element) => {
        ids.push(element.id);
      });
      if (ids.length === 0) {
        return this.$message.warning("请至少选择一个角色");
      }else{
        this.$confirm('此操作将永久所选角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
           roleId: ids.join(","),
           id: this.dialogShow.sendData.id,
          };
          deleteRolesToUsers(params).then((res) => {
            this.loadData()
            this.$message.success("删除角色成功");
          });
        }).catch(() => {
          return         
        });
      }
    },
    handleAdd(){
      let judge = this.handleRule()
      if(judge){
        this.$message.warning('正在进行修改或新增角色')
      }else{
        this.tableData.push({id:'', showInput: true, isShow:true})
      }
    },
    handleRule(){ // 判断是否正在进行修改角色或者新增角色
      let rule = false
      for (let i = 0; i < this.tableData.length; i++) {
        if(this.tableData[i].showInput){
          rule = true
          break;
        }
      }
      return rule
    },
    handleClick(formName) {
      let arr = []
      let editData = this.$refs.table.$parent.$parent.$refs.table.editData
      editData.forEach((el)=>{
        arr = [...arr, el.id]
      })
      arr = arr.join(',')
      let params = {
        roleId: arr,
        userId: this.dialogShow.sendData.id
      }
      updateRolesToUsers(params).then((res) => {
        if(res.data.code == 200){
          this.$message.success('角色修改成功')
          this.handleClose()
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-role ::v-deep .el-dialog{
  height: 70%;
}
.diy-dialog-footer .el-button:first-child {
  margin-right: 40px;
}
.demo-ruleForm{
  padding-right: 40px;
  padding-top: 30px;
}
::v-deep .el-dialog{
       display: flex;
       flex-direction: column;
       margin:0 !important;
       position:absolute;
       top:50%;
       left:50%;
       transform:translate(-50%,-50%);
       /*height:600px;*/
       max-height:calc(100% - 30px);
       max-width:calc(100% - 30px);
   }
::v-deep .el-dialog .el-dialog__body{
       flex:1;
       overflow: auto;
   }
</style>
