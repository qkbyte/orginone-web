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
          :hasTabs="true"
          @handleUpdate="loadlistData"
        >
       <template v-slot:slot-tabs>
        <DiyTabs
          ref="type-list"
          :tabList="allType"
          :curTab.sync="curTab"
        ></DiyTabs>
      </template>
       <template v-slot:operate="scope">
        <template v-if="scope.row.type !== '3' ">
          <TheTableButtonSuperMana
            v-if="scope.row.modifytype =='13'"
            :index="scope.index"
            :row="scope.row"
            @handlesuperman="handlesuperman"
          ></TheTableButtonSuperMana>
          <TheTableButtonTenant
            v-if="scope.row.modifytype =='14'"
            :index="scope.index"
            :row="scope.row"
            @handletenant="handletenant"
          ></TheTableButtonTenant>
          <TheTableButtonUser
            v-if="scope.row.modifytype =='15'"
            :index="scope.index"
            :row="scope.row"
            @handleuser="handleuser"
          ></TheTableButtonUser>
          <TheTableButtonUserName
            v-if="scope.row.modifytype =='17'"
            :index="scope.index"
            :row="scope.row"
           @handleusername="handleusername"
          ></TheTableButtonUserName>
          <TheTableButtonUserPhone
            v-if="scope.row.modifytype =='16'"
            :index="scope.index"
            :row="scope.row"
            @handleuserphone="handleuserphone"
          ></TheTableButtonUserPhone>
        </template>
      </template>
          <template v-slot:icon="scope">
            <i :class="scope.row.source"></i>
          </template>
          <template v-slot:type="scope">
            <div v-if="scope.row.type === 3">自动修复</div>
            <div v-if="scope.row.type === 2">按用户修复</div>
            <div v-if="scope.row.type === 1">按租户修复</div>
          </template>
          <template v-slot:if_modify="scope">
            <el-tag v-if="scope.row.if_modify === 1" type="success">
            已修复
            </el-tag>
            <el-tag v-if="scope.row.if_modify === 0" type="warning">
            未修复
            </el-tag>
          </template>
        </DiyTable>
      </template>
    </DiyBoxLayout>
    <template v-for="item in dialogShow">
      <ModifySuperManagerDialog
        v-if="item.key === 'supermana' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></ModifySuperManagerDialog>
      <ModifyTenant
        v-if="item.key === 'tenant' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></ModifyTenant>
      <ModifyUserDialog
        v-if="item.key === 'user' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></ModifyUserDialog>
      <ModifyUserNameDialog
        v-if="item.key === 'username' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></ModifyUserNameDialog>
      <ModifyUserPhoneDialog
        v-if="item.key === 'userphone' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></ModifyUserPhoneDialog>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getpubliccontainbyfilter,
  deletePublicContainByRecid,
} from "@api/home";
import {
  getallitopsdetail,
} from "@api/itops";
import DiyTable from "@components/DiyTable/index";
import DiyTabs from "@components/DiyTabs/index";
import DiyTitle from "@components/DiyTitle/index";
import DiySearch from "@components/DiySearch/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheTableButtonSuperMana from "./components/TheTableButtonSuperMana";
import TheTableButtonTenant from "./components/TheTableButtonTenant";
import TheTableButtonUser from "./components/TheTableButtonUser";
import TheTableButtonUserName from "./components/TheTableButtonUserName";
import TheTableButtonUserPhone from "./components/TheTableButtonUserPhone";
import ModifySuperManagerDialog from "./components/ModifySuperManagerDialog";
import ModifyTenant from "./components/ModifyTenant";
import ModifyUserDialog from "./components/ModifyUserDialog";
import ModifyUserNameDialog from "./components/ModifyUserNameDialog";
import ModifyUserPhoneDialog from "./components/ModifyUserPhoneDialog";

export default {
  data() {
    let _this = this;
    return {
      dialogShow: [
        {
          key: "supermana",
          value: false,
        },
        {
          key: "tenant",
          value: false,
        },
        {
          key: "user",
          value: false,
        },
        {
          key: "username",
          value: false,
        },
        {
          key: "userphone",
          value: false
        },        
      ],
      searchItem: {
        accuontName: "",
        realName: "",
      },
      tableName: "数据修复明细列表",
      tableData: [],
      tableHead: [
        {
          prop: "tenant_name",
          label: "租户名称",
          width: "150",
        },
        {
          prop: "user_name",
          label: "用户名称",
          width: "300",
        },
        {
          prop: "content",
          label: "内容",
          width: "100",
        },
        {
          prop: "phone_number",
          label: "手机号",
          width: "100",
        },
        {
          prop: "detail_reason",
          label: "具体原因",
          width: "100",
        },
        {
          type: "slot",
          name: "type",
          prop: "type",
          label: "运维类型",
        },
        {
          type: "slot",
          name: "if_modify",
          prop: "if_modify",
          label: "是否已修复",
        },
        {
          prop: "number",
          label: "修复数量",
        },
        {
          prop: "modify_time",
          label: "修复时间",
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
      allType: [
        { id: "1", title: "全部" },
        { id: "2", title: "已修复" },
        { id: "3", title: "未修复" },
      ],
      curTab: "1",
      ifmodify: 1,
      options: {
        checkBox: true,
        order: true,
        defaultSort: { prop: "modify_time", order: "modify_time" },
      },
      tableButton: [
        {
          key: "supermana",
          type: "text",
          icon: "el-icon-edit",
          value: "超级管理员修复",
          func: function(index, row) {
            _this.handlesuperman(index, row);
          },
        },
        {
          key: "tenant",
          type: "text",
          icon: "el-icon-edit",
          value: "租户修复",
          func: function(index, row) {
            _this.handletenant(index, row);
          },
        },
        {
          key: "user",
          type: "text",
          icon: "el-icon-edit",
          value: "用户密码修复",
          func: function(index, row) {
            _this.handleuser(index, row);
          },
        },
        {
          key: "username",
          type: "text",
          icon: "el-icon-edit",
          value: "用户名称修复",
          func: function(index, row) {
            _this.handleusername(index, row);
          },
        },
        {
          key: "userphone",
          type: "text",
          icon: "el-icon-edit",
          value: "用户手机号修复",
          func: function(index, row) {
            _this.handleuserphone(index, row);
          },
        },
      ],
    };
  },
  components: {
    DiyTable,
    DiyTabs,
    DiyTitle,
    DiyBoxLayout,
  },
  created() {
    this.$nextTick(() => {
      this.loadlistData();
    });
  },
  mounted() {},
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
    getFilterText() {
      return this.$store.state.searchContent;
    },
  },
  watch: {
    getFilterText(val) {
     // this.ifmodify = 1;
     // this.searchItem.containName = val;
      this.loadlistData();
    },
    curTab(newVal, oldVal) {
      this.filterList(newVal);
    },
  },
  methods: {
    loadlistData() {
      let params = {
        itopsid: this.$route.query.itopsid,
        ifmodify:this.ifmodify,
      };
      this.$refs.table.loading = true;
      getallitopsdetail(params).then((res) => {
        let data = res.data.data;
        this.tableData = data;
        this.$refs.table.total = data.total;
        this.$refs.table.loading = false;
      });
    },
        /*
    筛选框点击操作
    */
    filterList(val) {
      switch (val) {
        case "1":
          this.ifmodify = 1;
          break;
        case "2":
          this.ifmodify = 2;
          break;
        case "3":
          this.ifmodify = 3;
          break;
      }
      this.$refs.table.initPage();
      this.loadlistData();
    },

    /**
     * 表格内按钮操作
     */
    handlesuperman(index,row){
      this.index = index;
      this.dialogShow.map((el) => {
        if (el.key === "supermana") {
          el.value = true;
          el.sendData = row;
        }
      });
    },
    handletenant(index,row){
      this.index = index;
      this.dialogShow.map((el) => {
        if (el.key === "tenant") {
          el.value = true;
          el.sendData = row;
        }
      });
    },
    handleuser(index,row){
      this.index = index;
      this.dialogShow.map((el) => {
        if (el.key === "user") {
          el.value = true;
          el.sendData = row;
        }
      });
    },
    handleusername(index,row){
      this.index = index;
      this.dialogShow.map((el) => {
        if (el.key === "username") {
          el.value = true;
          el.sendData = row;
        }
      });
    },
    handleuserphone(index,row){
      this.index = index;
      this.dialogShow.map((el) => {
        if (el.key === "userphone") {
          el.value = true;
          el.sendData = row;
        }
      });
    },
    handleCloseDialog(key) {
      this.dialogShow.map((el) => {
        if (el.key === key) {
          el.value = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main-search {
  width: 100%;
  height: 80px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  margin-top: 12px;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;

  &--left {
    display: flex;

    .input-name {
      width: 30%;
      min-width: 200px;
      max-width: 300px;
    }

    .input-other-name {
      margin-left: 20px;
    }
  }
}
</style>
