<template>
  <el-dialog
      title="转移权限"
      :visible.sync="dialogShow.value"
      width="30%"
      class="dialog-person"
      :close-on-click-modal="false"
    >
    <el-select 
      v-model="value" 
      v-loadmore="incomLoadmore"
      filterable
      :filter-method="filter" 
      placeholder="请选择"
    >
      <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>
    </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleClick('ruleForm')">完 成</el-button>
      </span>
    </el-dialog>
</template>

<script>
import { mapState,mapGetters } from "vuex";
import { getSearchPersonList, updateTransferPerson } from "@api/user";
export default {
  name: "TheAppDialog",
  data() {
    return {
      options: [],
      value: '',
      currentPage: 1,
      pageSize: 10,
      isActivate: 3,
      searchName: ''
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: ()=>{},
    }
  },
  created() {
  },
  mounted() {
    this.loading()
  },
  computed:{
    ...mapGetters("tenant", ["curTenantCode", "curTenant"]),
  },
  methods: {
    filter(val){
      this.searchName = val
      this.options = []
      this.loading()
    },
    incomLoadmore(){
      this.currentPage ++
      this.loading()
    },
    loading(){
      let params = {
        current: this.currentPage,
        size: this.pageSize,
        tenantCode: this.dialogShow.sendData.tenantCode,
        fuzzyVal: this.searchName,
      };
      getSearchPersonList(params).then((res) => {
        const {records} = res.data.data;
        let data = {}
        for (let i = 0; i < records.length; i++) {
          data = {
            value: records[i].userId,
            label: records[i].realName
          }
          this.options = [...this.options, data]
        }
      });
    },
    handleClose() {
      this.$parent.handleCloseDialog('transfer')
    },
    handleClick() {
      let params = {
        tenantCode: this.curTenantCode,
        userId: this.value,
      };
      updateTransferPerson(params)
        .then((res) => {
          this.$message.success("权限转移成功");
          this.$parent.handleCloseDialog('transfer')
          location.reload();
        })
    },
  },
};
</script>

<style lang="scss" scoped>
.diy-dialog-footer .el-button:first-child {
  margin-right: 40px;
}
.demo-ruleForm{
  padding-right: 40px;
  padding-top: 30px;
}
::v-deep .el-select{
    width: 100%;
    margin: 20px 0;
}
</style>
