<template>
  <div class="base-layout">
    <DiyBoxLayout id="daibanDivId">
      <template v-slot:table
        ><DiyTable
          ref="table"
          :tableHead="tableHead"
          :options="options"
          :tableData="tableData"
          :hasTabs="true"
          @handleUpdate="loadData"
          @handleRowClick="goItem"
        >
          <template v-if="announceShow" v-slot:noticeUnitIds="scope">
            <el-tag v-if="scope.row.noticeUnitIds[0].type == 1"
              >信息上报</el-tag
            >
            <el-tag
              v-else-if="scope.row.noticeUnitIds[0].type == 2"
              type="success"
              >日常通知</el-tag
            >
            <el-tag
              v-else-if="scope.row.noticeUnitIds[0].type == 3"
              type="danger"
              >安全生产</el-tag
            >
            <el-tag v-else type="warning">信息审核</el-tag>
          </template>
          <template v-slot:buttons>
            <el-button v-if="curTab == '1'" type="text" @click="handlePass">批量审核</el-button>
            <el-button v-if="curTab == '1'" type="text" @click="handleBack(0)">退回到发起</el-button>
            <el-button v-if="curTab == '1'" type="text" @click="handleBack(1)">退回到上级</el-button>
            <el-button v-if="curTab == '5'" type="text" @click="handleRead">已读</el-button>
          </template>
          <template v-slot:slot-tabs>
            <DiyTabs
              ref="types"
              :tabList="todoType"
              :curTab.sync="curTab"
              :selectTab="curTab"
              :hasNum="true"
              :numList="todoNum"
            />
            <template v-for="item in dialogShow">
              <TheReviewDialog
                v-if="item.key === 'review' && item.value"
                :key="item.key"
                :dialogShow="item"
                @closeEdit="closeEdit"
              />
              <TheAnnounceDialog
                v-if="item.key === 'announce' && item.value"
                :key="item.key"
                :dialogShow="item"
                @closeEdit="closeEdit"
              />
            </template>
          </template>
          <template v-slot:icon="scope">
            <i :class="scope.row.source"></i>
          </template>
          <template v-slot:operate="scope">
            <TheTableButton
              :rowData="scope.row"
              @handleDel="handleDel"
            ></TheTableButton>
          </template>
        </DiyTable>
      </template>
    </DiyBoxLayout>

    <el-dialog
      v-if="centerDialogVisible"
      top="2vh"
      class="diy-dialog"
      :visible.sync="centerDialogVisible"
      width="90%"
      style="height:100%;margin:0 auto"
      center
    >
      <div slot="title"></div>
      <SandBox
        :targetUrl="redirecturl"
        :sourceAppId="appItem"
        @closeDialog="closeDialog"
      ></SandBox>
      <div slot="footer"></div>
    </el-dialog>


      <el-dialog 
        center
        width="30%"
        class="dialogPLSP"
        :visible.sync="nexeUserModel"
        :close-on-click-modal="false"
        :append-to-body="true"
        v-loading="nexeUserModelLoading"
        element-loading-background="rgba(0, 0, 0, 0.7)"
        element-loading-text="保存中">
        <span slot="title" class="diy-dialog-title"> 请选择审核人 </span>
        <div class="diy-dialog-body" style="height:70px">
          <el-form>
            <el-form-item>
              <el-checkbox-group v-if="nextExeUser.length>0 && nextExeUser[0].loginName!=''" v-model="checkedUsers">
                <el-checkbox v-for="user in nextExeUser" :label="user.userName" :key="user.loginName">{{user.userName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <el-autocomplete
                v-model="auditContent"
                :fetch-suggestions="querySearch"
                placeholder="请输入审核意见">
                <i class="el-icon-edit el-input__icon" slot="suffix">
                </i>
                <template slot-scope="{ item }">
                  <div class="name">{{ item }}</div>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="diy-dialog-footer" style="justify-content: center;margin-top: 30px;">
          <el-button type="primary" @click="ok">确 定</el-button>
          <el-button @click="nexeUserModel=false">取 消</el-button>
        </span>
      </el-dialog>

  </div>
</template>

<script>
import DiyTabs from "@components/DiyTabs/index";
import DiyTable from "@components/DiyTable/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import { mapActions, mapState, mapGetters } from "vuex";
import Bus from "@utils/eventBus";
import {
  getallacttodo,
  getallfinishacttodo,
  getallhistoryacttodo,
  getallinitiateacttodo,
  getMyMessages,
  getMyMessage,
  getUnReadNumber,
  getDefaultGroup,
  getallacttodobysearch,
  messageDelete,
  getallhistoryacttodobysearch,
  getallmysendacttodoBySearch,
  unRead,batchPass,batchBack
} from "@api/acttodo";
import TheTableButton from "./components/TheTableButtonTwo.vue";
import TheReviewDialog from "./components/TheReviewDialog";
import TheAnnounceDialog from "./components/TheAnnounceDialog";
import { isDistributed } from "@api/market";
import { marketappnoticeMyAlertList } from "@api/market";
import SandBox from "@/components/Sandbox/index";

export default {
  data() {
    return {
      PASS_CONTENT: [],
      BACK_CONTENT: [],
      //通过或退回标记
      AUDIT_TYPE: "",
      //退回上级、退回发起人标记
      BACK_TYPE: "",
      //审核意见
      auditContent: "",
      nexeUserModelLoading: false,
      nexeUserModel: false,
      nextExeUser:[],
      checkedUsers: [],
      dialogShow: [
        {
          key: "review",
          value: false,
        },
        {
          key: "app",
          value: false,
        },
        {
          key: "announce",
          value: false,
        },
      ],
      tableData: [],
      tableHead: [],
      tableHeadA: [],
      tableHeadB: [
        {
          prop: "title",
          label: "标题",
          "min-width": "150",
        },
        {
          prop: "content",
          label: "内容",
          "min-width": "200",
        },
        {
          prop: "url",
          label: "链接",
          "min-width": "120",
        },
        {
          prop: "sender",
          label: "发送人",
          "min-width": "100",
        },
        {
          prop: "sendTime",
          label: "发送时间",
          width: "200",
        },
        {
          prop: "readStatus",
          label: "阅读状态",
          width: "100",
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
      tableHeadC: [
        {
          prop: "noticeTitle",
          label: "标题",
          width: "250",
        },
        {
          prop: "noticeContent",
          label: "内容",
        },
        {
          type: "slot",
          name: "noticeUnitIds",
          label: "公告类型",
          width: "250",
        },
        {
          prop: "noticeReleaseTime",
          label: "发布时间",
          width: "250",
        },
      ],
      options: {
        checkBox: true,
        order: true,
      },
      curTab: this.$store.state.work.skipState,
      todoType: [
        { id: "1", title: "待办事项" },
        { id: "2", title: "已办事项" },
        { id: "3", title: "已完成事项" },
        { id: "4", title: "我发起的" },
        { id: "5", title: "消息" },
        { id: "6", title: "平台通知公告" },
      ],
      todoNum: [0, , , , 0, 0],
      announceShow: false,
      todotime: "",
      todoSendTenantName: "",
      todotitle: "",
      taskid: "",
      todotime2: "",
      todoSendTenantName2: "",
      todotitle2: "",
      taskid2: "",
      finishtime3: "",
      todoSendTenantName3: "",
      todotitle3: "",
      taskid3: "",
      finishtime4: "",
      todoSendTenantName4: "",
      todotitle4: "",
      taskid4: "",
      centerDialogVisible: false,
      redirecturl: "",
      searchParameter: "",
      appItem: {},
    };
  },
  components: {
    DiyTabs,
    DiyTable,
    DiyBoxLayout,
    TheReviewDialog,
    SandBox,
    TheTableButton,
    TheAnnounceDialog,
  },
  created() {
    Bus.$on("searchEnter", (search) => {
      this.loadData(search);
    });
    this.loadTableHead();
    this.initData();
  },
  computed: {
    ...mapGetters("menu", ["openUrl"]),
    ...mapState("user", ["userId", "userName", "roleId"]),
    ...mapState("user", ["roleName", "userName", "userPhoto", "roleId"]),
    ...mapGetters("tenant", ["curTenantId"]),
    ...mapState("group", ["groupList"]),
    getFilterText() {
      return this.$store.state.searchContent;
    },
  },
  watch: {
    openUrl(n, o) {
      this.initData();
    },
    "$store.state.work.isReresh": function() {
      if (this.$store.state.work.isReresh) {
        this.loadData();
      }
    },
    curTab: {
      handler(newValue, oldValue) {
        console.log("newval", newValue, typeof newValue);
        this.announceShow = false;
        this.Taskid = "";
        this.loadData();
        // this.loadTodoNum();
        (this.todotime = ""),
          (this.todoSendTenantName = ""),
          (this.todotitle = ""),
          (this.taskid = ""),
          (this.todotime2 = ""),
          (this.todoSendTenantName2 = ""),
          (this.todotitle2 = ""),
          (this.taskid2 = ""),
          (this.finishtime3 = ""),
          (this.todoSendTenantName3 = ""),
          (this.todotitle3 = ""),
          (this.taskid3 = ""),
          (this.finishtime4 = ""),
          (this.todoSendTenantName4 = ""),
          (this.todotitle4 = ""),
          (this.taskid4 = ""),
          (this.searchParameter = "");
        Bus.$emit("curTabnewValue", newValue);
      },
      immediate: true,
    },
    getFilterText(val) {
      this.filterText = val;
      console.log("val", val);
      // this.loadGroupList('search');
    },
  },
  mounted() {
    Bus.$on("searchEnter", (e) => {
      this.searchParameter = e;
      this.loadData();
      this.loadTodoNum();
    });
    Bus.$on("drawerform", (e) => {
      if (this.curTab == "1") {
        this.todotime = e.time;
        this.todoSendTenantName = e.input;
        this.todotitle = e.YYlx;
        this.taskid = e.Djh;
        const { currentPage, pageSize } = this.$refs.table.page;
        let params = {
          current: currentPage,
          size: pageSize,
          todotime: this.todotime,
          todoSendTenantName: this.todoSendTenantName,
          todotitle: this.todotitle,
          taskid: this.taskid,
          todotype: this.curTab,
        };
        getallacttodobysearch(params).then((res) => {
          // console.log("records", res.data.data.records);
          const { records, total } = res.data.data;
          this.tableData = records;
          this.$refs.table.page.total = JSON.parse(total);
        }, this);
        this.loadTodoNum();
      }
    });
    Bus.$on("drawerform2", (e) => {
      if (this.curTab == "2") {
        this.todotime2 = e.time;
        this.todoSendTenantName2 = e.input;
        this.todotitle2 = e.YYlx;
        this.taskid2 = e.Djh;
        const { currentPage, pageSize } = this.$refs.table.page;
        let params = {
          current: currentPage,
          size: pageSize,
          todotime: this.todotime2,
          todoSendTenantName: this.todoSendTenantName2,
          todotitle: this.todotitle2,
          taskid: this.taskid2,
          todotype: this.curTab,
        };
        getallacttodobysearch(params).then((res) => {
          // console.log("records", res.data.data.records);
          const { records, total } = res.data.data;
          this.tableData = records;
          this.$refs.table.page.total = JSON.parse(total);
        }, this);
        this.loadTodoNum();
      }
    });
    Bus.$on("drawerform3", (e) => {
      if (this.curTab == "3") {
        this.finishtime3 = e.time;
        this.todoSendTenantName3 = e.input;
        this.todotitle3 = e.YYlx;
        this.taskid3 = e.Djh;
        const { currentPage, pageSize } = this.$refs.table.page;
        let params = {
          current: currentPage,
          size: pageSize,
          finishtime: this.finishtime3,
          todoSendPersonName: this.todoSendPersonName3,
          todotitle: this.todotitle3,
          taskid: this.taskid3,
        };
        getallhistoryacttodobysearch(params).then((res) => {
          // console.log("records", res.data.data.records);
          const { records, total } = res.data.data;
          let newRes = records;
          newRes.forEach((el) => {
            el["todoappname"] = el.launshappname;
            el["todoSendPersonName"] = el.launshSendPersonName;
            el["todotime"] = el.finishtime;
          });
          this.tableData = records;
          this.$refs.table.page.total = JSON.parse(total);
        }, this);
        this.loadTodoNum();
      }
    });
    Bus.$on("drawerform4", (e) => {
      if (this.curTab == "4") {
        this.finishtime4 = e.time;
        this.todoSendTenantName4 = e.input;
        this.todotitle4 = e.YYlx;
        this.taskid4 = e.Djh;
        const { currentPage, pageSize } = this.$refs.table.page;
        let params = {
          current: currentPage,
          size: pageSize,
          finishtime: this.finishtime4,
          todoSendTenantName: this.todoSendTenantName4,
          todotitle: this.todotitle4,
          taskid: this.taskid4,
          todotype: this.curTab,
        };
        getallmysendacttodoBySearch(params).then((res) => {
          // console.log("records", res.data.data.records);
          const { records, total } = res.data.data;
          let newRes = records;
          newRes.forEach((el) => {
            el["todoappname"] = el.launshappname;
            el["todoSendPersonName"] = el.launshSendPersonName;
            el["todotime"] = el.finishtime;
          });
          this.tableData = records;
          this.$refs.table.page.total = JSON.parse(total);
        }, this);
        this.loadTodoNum();
      }
    });
    //父页面监听第三方应用
    window.name = `${this.name}`;
    let handler = (event) => {
      const message = event.data;
      console.log("message", message);
      if (message.type && message.type == "GO_HOME") {
        this.centerDialogVisible = false;
        this.loadTodoNum();
        this.loadData();
      }
      // if (message.newadd  == true) {
      //   this.centerDialogVisible = false
      //   this.loadTodoNum()
      // }
    };
    window.addEventListener("message", handler);
    this.$once("hook:beforeDestroy", (e) => {
      window.removeEventListener("message", handler);
    });

    this.loadContents();
  },
  methods: {
    ...mapActions("menu", ["changeMenu"]),
    loadContents(){
      // debugger;
      var obj = localStorage.getItem("PASS_CONTENT");
      if(obj){
        this.PASS_CONTENT = obj.split(",");
        if(this.PASS_CONTENT.length>=15){
          this.PASS_CONTENT.substring(this.PASS_CONTENT.length-15,this.PASS_CONTENT.length-1);
        }
      }
      obj = localStorage.getItem("BACK_CONTENT");
      if(obj){
        this.BACK_CONTENT= obj.split(",");
        if(this.BACK_CONTENT.length>=15){
          this.BACK_CONTENT.substring(this.BACK_CONTENT.length-15,this.BACK_CONTENT.length-1);
        }
      }
    },
    querySearch(queryString, cb) {
      var restaurants = "";
      if(this.AUDIT_TYPE==1){
        restaurants = this.PASS_CONTENT;
      }else{
        restaurants = this.BACK_CONTENT;
      }
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    ok(){
      if(!this.auditContent || this.auditContent==""){
        this.$message.warning("请输入审核意见！");
        return;
      }
      if(this.AUDIT_TYPE==1){
        if (this.nextExeUser.length>0 && this.nextExeUser[0].loginName!='' && (!this.checkedUsers || this.checkedUsers.length == 0)) {
          this.$message.warning("必须选择一个处理人");
          return;
        }
        this.selectUsers = [];
        for (var i = 0; i < this.nextExeUser.length; i++) {
          if(this.nextExeUser[i].userName==''){
            this.selectUsers.push(this.nextExeUser[i]);
          }else{
            for (var k = 0; k < this.checkedUsers.length; k++) {
                if (this.nextExeUser[i].userName == this.checkedUsers[k]) {
                    this.selectUsers.push(this.nextExeUser[i]);
                }
            }
          }
        }
        this.passDo(null,null,null,this.selectUsers);
      }else{
        this.backDo();
      }
      this.nexeUserModel = false;
    },
    handlePass(){
      var selectDatas = this.$refs.table.multipleSelection;
      if(this.valid(selectDatas)){
        this.passDo();
      }
    },
    passDo(a,b,c,selectUsers){
      var selectDatas = this.$refs.table.multipleSelection;
      if(!this.valid(selectDatas)){
        return;
      }
      var that = this;
      var allloading = this.$loading({
        lock: true,
        fullscreen: false,
        target: "#daibanDivId",
        text: "处理中...",
        spinner: 'el-icon-loading',
      });
      setTimeout(() => {
        if(allloading)allloading.close();
      }, 120000);
      var recidList = [];
      selectDatas.forEach(data=>recidList.push(data.recid));
      if(!selectUsers || selectUsers.length==0){
        selectUsers = null;
      }
      this.AUDIT_TYPE = 1;
      batchPass({recids:recidList,nextNodeInfo:selectUsers,content:that.auditContent}).then((res) => {
        that.putContentToStorge(that.auditContent);
        that.nexeUserModel = false;
        if(allloading)allloading.close();
        if (res.data.code == 200) {
          if(res.data.data && res.data.data.code==1){
            that.nexeUserModel = true;
            that.nextExeUser = res.data.data.nextNodeInfo;
            that.auditContent = "同意";
            return;
          }else if(res.data.data && res.data.data.code==0){
            this.$message.warning(res.data.data.message);
          }else{
            this.$message.success("操作成功");
            this.refreshDaiBan();
          }
        }
      },
      () => {
        if(allloading)allloading.close();
      });
    },
    putContentToStorge(content){
      // debugger;
      if(this.AUDIT_TYPE==1){
        if(this.PASS_CONTENT){
          for(var i=0;i<this.PASS_CONTENT.length;i++){
            if(this.PASS_CONTENT[i]==content){
              return;
            }
          }
          this.PASS_CONTENT.push(content); 
          localStorage.setItem("PASS_CONTENT",this.PASS_CONTENT);
        }
      }else{
        if(this.BACK_CONTENT){
          for(var i=0;i<this.BACK_CONTENT.length;i++){
            if(this.BACK_CONTENT[i]==content){
              return;
            }
          }
          this.BACK_CONTENT.push(content);
          localStorage.setItem("BACK_CONTENT",this.BACK_CONTENT);
        }
      }
    },
    handleBack(type){
      var selectDatas = this.$refs.table.multipleSelection;
      if(this.valid(selectDatas)){
        this.auditContent = "不同意";
        this.BACK_TYPE = false;
        if(type==1){
          this.BACK_TYPE = true;
        }
        //退回
        this.AUDIT_TYPE = 2;
        this.nexeUserModel = true;
      }
    },
    backDo(){
      var selectDatas = this.$refs.table.multipleSelection;
      if(!this.valid(selectDatas)){
        return;
      }
      var allloading = this.$loading({
          lock: true,
          fullscreen: false,
          target: "#daibanDivId",
          text: "处理中...",
          spinner: 'el-icon-loading',
        });
        setTimeout(() => {
          if(allloading)allloading.close();
        }, 120000);
        var recidList = [];
        selectDatas.forEach(data=>recidList.push(data.recid));
        var that = this;
        batchBack({recids:recidList,isBackPre:this.BACK_TYPE,content:this.auditContent}).then((res) => {
          if(allloading)allloading.close();
          that.putContentToStorge(that.auditContent);
          if (res.data.code == 200) {
            this.$message.success("操作成功");
            this.refreshDaiBan();
          }else{
            this.$message.success(res.data.msg || res.data.data.message);
          }
        },
        () => {
          if(allloading)allloading.close();
        });
    },
    refreshDaiBan(){
      const { currentPage, pageSize } = this.$refs.table.page;
      let params = {
        current: currentPage,
        size: pageSize,
      };
      getallacttodo(params).then((res) => {
        // console.log("records", res.data.data.records);
        const { records, total } = res.data.data;
        this.tableData = records;
        this.$refs.table.page.total = JSON.parse(total);
      }, this);
    },
    valid(selectDatas){
      if (!selectDatas || selectDatas.length === 0) {
        this.$message.warning("请至少选择一行信息");
        return false;
      }else{
        var checker = null;
        for(var i=0;i<selectDatas.length;i++){
          var key = selectDatas[i].todoappid+selectDatas[i].todotitle;
          if(checker==null){
            checker = key
          }else{
            if(checker!=key){
              this.$message.warning("批量操作只能针对同一个应用和业务类型的进行！！！");
              return false;
            }
          }
        }
      }
      return true;
    },
    handleRead() {
      let idusers = [];
      this.$refs.table.multipleSelection.forEach((element) => {
        idusers.push(element.id);
      });
      let params = {
        idList: idusers,
      };
      unRead(params).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("设置成功");
          this.loadData();
        }
      });
    },
    handleDel(val) {
      let params = {
        deleteIds: [val.id],
      };
      messageDelete(params).then((res) => {
        if (res.data.code == 200) {
          this.$message.success({
            message: "删除成功",
            duriation: 200,
          });
          this.loadData();
        }
      });
    },
    initData() {
      let token = localStorage.getItem("ZCY_TOKEN");
      // let url = "";
      // debugger;
      // if (this.redirecturl.indexOf("?") != -1) {
      //   url =
      //     this.redirecturl +
      //     "&userId=" +
      //     encodeURIComponent(this.userId) +
      //     "&__t__=" +
      //     new Date().getTime();
      // } else {
      //   url =
      //     this.redirecturl +
      //     "?userId=" +
      //     encodeURIComponent(this.userId) +
      //     "&__t__=" +
      //     new Date().getTime();
      // }
      // this.redirecturl = url;
    },
    closeDialog() {
      this.tableData = [];
      this.centerDialogVisible = false;
      this.loadData();
    },
    loadTableHead() {
      let arr = [];
      this.groupList.forEach((el) => {
        arr.push(el.groupId);
      });
      getDefaultGroup(arr).then((res) => {
        console.log("res", res);
        if (!res.data.data) {
          this.tableHeadA = [
            {
              prop: "budgetCode",
              label: "预算代码",
              align: "center",
              "min-width": "100",
            },
            {
              prop: "todoSendTenantName",
              label: "发起单位",
              align: "center",
              "min-width": "230",
            },
            {
              prop: "unitCode",
              label: "单位代码",
              align: "center",
              "min-width": "120",
            },
            {
              prop: "taskid",
              label: "单据编号",
              "min-width": "200",
            },
            {
              prop: "todocontent",
              label: "内容摘要",
              "min-width": "400",
            },
            {
              prop: "todotitle",
              label: "业务类型",
              "min-width": "120",
            },
            {
              prop: "todoSendPersonName",
              label: "发起人",
              "min-width": "100",
            },
            // {
            //   prop: "deptName",
            //   label: "发起部门",
            //   align: "center",
            //   "min-width": "100",
            // },
            {
              prop: "todotime",
              label: "收到时间",
              "min-width": "180",
            },
            {
              prop: "todoappname",
              label: "来源",
              "min-width": "120",
            },
          ];
        } else {
          this.tableHeadA = [
            {
              prop: "todoappname",
              label: "来源",
              "min-width": "100",
            },
            {
              prop: "todotitle",
              label: "业务类型",
              "min-width": "120",
            },
            {
              prop: "todoSendPersonName",
              label: "发起人",
              "min-width": "100",
            },
            {
              prop: "deptName",
              label: "发起部门",
              align: "center",
              "min-width": "100",
            },
            {
              prop: "todotime",
              label: "收到时间",
              "min-width": "150",
            },
            {
              prop: "todoSendTenantName",
              label: "发起单位",
              align: "center",
              "min-width": "100",
            },
          ];
        }
        this.$nextTick(async () => {
          await this.loadData();
        });
      });
    },
    handleReview(index, row) {
      getMyMessage({ id: row.id }).then((res) => {
        this.dialogShow.map((el) => {
          if (el.key === "review") {
            el.value = true;
            el.sendData = res.data.data;
          }
        });
      });
    },
    closeEdit(val) {
      this.dialogShow.map((el) => {
        if (el.key == val) {
          el.value = false;
          this.loadData();
          this.$store.dispatch(
            "changeMutation",
            this.$store.state.work.todoNumIndexSend + 1
          );
        }
      });
    },
    async goItem(row) {
      this.appItem = row.launshappid || row.todoappid;
      this.redirecturl = row.pcformlink;
      this.initData();
      if (this.curTab !== "6" && this.curTab !== "5") {
        this.centerDialogVisible = true;
      }
      if (this.curTab === "5") {
        this.handleReview(0, row);
        return;
      }
      const { todoappid, pcformlink, launshappid } = row;
      if (todoappid === "0") {
        this.centerDialogVisible = true;
        let url = pcformlink;
        if (url.indexOf("?") == -1) {
          this.$router.push({
            path: url,
          });
        } else {
          let obj = {};
          let link = url.split("?")[0];
          let array = url.split("?")[1].split("&");
          array.forEach((item) => {
            obj[item.split("=")[0]] = item.split("=")[1];
          });
          this.$router.push({
            path: link,
            query: obj,
          });
        }
      } else if (this.curTab == "6") {
        this.dialogShow.map((el) => {
          if (el.key === "announce") {
            el.value = true;
            el.sendData = row;
          }
        });
      } else if (this.curTab == "3") {
        this.centerDialogVisible = true;
        let menu = {
          id: -1,
          appId: launshappid,
          url: pcformlink,
          type: "app",
          isDialog: true,
        };
        this.changeMenu(menu);
      } else if (this.curTab !== "6" && this.curTab !== "3") {
        this.centerDialogVisible = true;
        let menu = {
          id: -1,
          appId: todoappid,
          url: pcformlink,
          type: "app",
          isDialog: true,
        };
        this.changeMenu(menu);
      }
    },

    isZero(m) {
      return m < 10 ? "0" + m : m;
    },
    loadData(str) {
      this.$nextTick(async () => {
        try {
          this.$refs.table.loading = true;
          if (str) {
            console.log("this.$refs.table.page", this.$refs.table.page);
          } else {
            var { currentPage, pageSize } = this.$refs.table.page;
          }
          let params = {
            current: currentPage,
            size: pageSize,
            searchParameter: this.searchParameter,
          };
          switch (this.curTab) {
            case "1":
              this.tableHead = this.tableHeadA;
              await getallacttodo(params).then((res) => {
                // console.log("records", res.data.data.records);
                const { records, total } = res.data.data;
                this.tableData = records;
                this.$refs.table.page.total = JSON.parse(total);
              }, this);
              break;
            case "2":
              this.tableHead = this.tableHeadA;
              await getallfinishacttodo(params).then((res) => {
                const { records, total } = res.data.data;
                this.tableData = records;
                this.$refs.table.page.total = JSON.parse(total);
              }, this);
              break;
            case "3":
              this.tableHead = this.tableHeadA;
              await getallhistoryacttodo(params).then((res) => {
                const { records, total } = res.data.data;
                let newRes = records;
                newRes.forEach((el) => {
                  el["todoappname"] = el.launshappname;
                  el["todoSendPersonName"] = el.launshSendPersonName;
                  el["todotime"] = el.finishtime;
                });
                this.tableData = newRes;
                this.$refs.table.page.total = JSON.parse(total);
              }, this);
              break;
            case "4":
              this.tableHead = this.tableHeadA;
              await getallinitiateacttodo(params).then((res) => {
                const { records, total } = res.data.data;
                let newRes = records;
                newRes.forEach((el) => {
                  el["todoappname"] = el.launshappname;
                  el["deptName"] = "-";
                  el["todoSendPersonName"] = el.launshSendPersonName;
                  el["todotime"] = el.finishtime;
                });
                this.tableData = records;
                this.$refs.table.page.total = JSON.parse(total);
              }, this);
              break;
            case "5":
              this.tableHead = this.tableHeadB;
              await getMyMessages(params).then((res) => {
                const { records, total } = res.data.data;
                records.forEach((el) => {
                  el.readStatus = el.readStatus ? "已读" : "未读";
                  !el.url && (el.url = "-");
                });
                this.tableData = records;
                // debugger;
                this.$refs.table.page.total = JSON.parse(total);
              }, this);
              break;
            case "6":
              this.tableHead = this.tableHeadC;
              this.getAnnounceData();
              break;
            default:
              break;
          }
        } catch (error) {
          this.$refs.table.loading = false;
        }
        await this.loadTodoNum();
        this.$refs.table.loading = false;
      });
    },
    // 获取通知公告
    getAnnounceData() {
      let arr = [];
      arr.push(this.curTenantId);
      let jsonObject = {
        role: this.roleId.split(","),
        unit: arr,
      };
      const { currentPage, pageSize } = this.$refs.table.page;
      let params = {
        current: currentPage,
        size: pageSize,
        jsonObject: jsonObject,
      };

      marketappnoticeMyAlertList(params).then((res) => {
        const { records } = res.data.data;
        // console.log("records", records);
        let arr = [];
        records.forEach((el) => {
          if (el.noticeReleaseStatus !== 0 && el.isDeleted !== 1) {
            arr.push(el);
          }
        });
        let list = arr;
        list.forEach((el) => {
          el.noticeUnitIds = JSON.parse(el.noticeUnitIds);
        });
        this.$nextTick(() => {
          this.tableData = list;
          this.$refs.table.page.total = list.length;
          this.announceShow = true;
        });
      });
    },
    //加载待办数
    async loadTodoNum() {
      let that = this;
      this.$refs.table.loading = true;
      try {
        const { currentPage, pageSize } = this.$refs.table.page;
        let params = {
          current: currentPage,
          size: pageSize,
          searchParameter: this.searchParameter,
        };
        let arr = [];
        arr.push(this.curTenantId);
        let jsonObject = {
          role: this.roleId.split(","),
          unit: arr,
        };
        let obj = {
          current: currentPage,
          size: pageSize,
          jsonObject: jsonObject,
        };
        await getUnReadNumber().then((res) => {
          this.todoNum.splice(4, 1, res.data.data);
        });
        if (
          this.todotime != "" ||
          this.todoSendTenantName != "" ||
          this.todotitle != "" ||
          this.taskid != "" ||
          this.todotime2 != "" ||
          this.todoSendTenantName2 != "" ||
          this.todotitle2 != "" ||
          this.taskid2 != ""
        ) {
          let params = {
            current: currentPage,
            size: pageSize,
            todotime: this.todotime,
            todoSendTenantName: this.todoSendTenantName,
            todotype: that.curTab,
            searchParameter: this.searchParameter,
          };
          await getallacttodobysearch(params).then((res) => {
            var { total } = res.data.data;
            if (that.curTab == 1) {
              this.todoNum[0] = parseInt(total);
            }
          }, this);
        } else {
          await getallacttodo(params).then((res) => {
            const { records, total } = res.data.data;
            this.todoNum[0] = parseInt(total);
          }, this);
          // await getallfinishacttodo(params).then((res) => {
          //   const { total } = res.data.data;
          //   this.todoNum[1] = parseInt(total);
          // }, this);
        }
        // await getallhistoryacttodo(params).then((res) => {
        //   const { total } = res.data.data;
        //   this.todoNum[2] = parseInt(total);
        // }, this);
        // await getallinitiateacttodo(params).then((res) => {
        //   const { total } = res.data.data;
        //   this.todoNum[3] = parseInt(total);
        // }, this);
        await marketappnoticeMyAlertList(obj).then((res) => {
          const { records } = res.data.data;
          let arr = [];
          records.forEach((el) => {
            if (el.noticeReleaseStatus !== 0 && el.isDeleted !== 1) {
              arr.push(el);
            }
          });
          this.todoNum[5] = arr.length;
        }, this);
      } catch (error) {
        this.$refs.table.loading = false;
      }
      this.$refs.types.handleUpdate(this.todoNum);
      this.$refs.table.loading = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.tabs-btn {
  color: $theme-color;
  cursor: pointer;
  margin-top: 10px;
}
::v-deep .el-dialog {
  height: 95%;
}
::v-deep .el-dialog__body {
  height: 100%;
}

.diy-dialog ::v-deep .el-dialog__header {
  padding: 0px;
}
.diy-dialog ::v-deep .el-dialog__footer {
  padding: 0px;
}
.el-dialog__wrapper ::v-deep .el-dialog {
  margin: 0 auto;
}
.el-dialog__wrapper ::v-deep .el-dialog__headerbtn i {
  font-size: 25px;
  z-index: 1111;
  position: absolute;
  right: -13px;
}
.dialogPLSP ::v-deep .el-dialog {
  height: 35%;
}
.dialogPLSP ::v-deep .el-dialog__body {
  height: 35%;
}
</style>
