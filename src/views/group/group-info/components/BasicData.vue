<template>
  <div class="basic">
    <div class="basic-main">
      <div class="basic-title">基础信息</div>
      <div class="basic-content">
        <div class="basic-content-box">
          <el-table
            class="content"
            :data="message"
            :show-header="showHeader"
            :row-style="{ height: '66px' }"
            :cell-style="changeColor"
          >
            <el-table-column
              prop="label"
              label="类型"
              width="160"
            ></el-table-column>
            <el-table-column prop="data" label="数据"></el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.edit.show"
                  size="medium"
                  :icon="scope.row.edit.icon"
                  @click="handleEdit(scope.$index, scope.row)"
                  >{{ scope.row.edit.label }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getTenantInfo } from "@api/tenant";
export default {
  name: "BasicData",
  components: {},
  props: {
    getUser: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      mobilePhoneVisible: false,
      emailVisible: false,
      showHeader: false,
      configTitle: "",
      configName: "",
      info: [
        {
          name: "unitName",
          label: "单位名称",
          edit: {
            show: false,
            label: "",
          },
        },
        {
          name: "socialCreditCode",
          label: "统一社会信用代码",
          edit: {
            show: false,
            label: "",
          },
        },
        {
          name: "linkMan",
          label: "联系人",
          edit: {
            show: false,
            label: "",
          },
        },
        {
          name: "linkPhone",
          label: "联系方式",
          edit: {
            show: false,
            label: "",
          },
        },
      ],
      user: {},
    };
  },

  computed: {
    ...mapGetters("tenant", ["curTenantId"]),
    message() {
      let val = new Array();
      for (let sum of this.info) {
        if (this.user[sum.name] !== undefined) {
          val.push({
            data: this.user[sum.name],
            name: sum.name,
            label: sum.label,
            edit: sum.edit,
          });
        }
      }
      return val;
    },
  },
  mounted() {
    this.Loading();
  },
  methods: {
    /**
     * 初始化获取用户信息
     */
    async Loading() {
      let _this = this;
      let userId = _this.$store.state.user.userId;
      let info = await getTenantInfo({
        tenantId: this.curTenantId,
      });
      _this.user = info.data.data;
    },
    /**
     * 修改对应的dialog信息
     */
    config(data, title, name) {
      let _this = this;
      if (_this[data] !== undefined) {
        _this[data] = true;
        _this.configTitle = title;
        _this.configName = name;
      }
    },
    /**
     * 对某个字段进行修改
     */
    handleEdit(index, row) {
      let _this = this;
      if (row.name === "phoneNumber") {
        _this.config("mobilePhoneVisible", "", row.name);
      } else if (row.name === "userEmail") {
        _this.config("emailVisible", "", row.name);
      }
    },
    /**
     * 改变第一列背景颜色
     */
    changeColor(row) {
      if (row.columnIndex == 0) {
        return "background:rgba(248,250,251,1);text-align:center";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.basic {
  width: 100%;
  padding: 30px 3% 60px;
  background: white;

  .basic-title {
    font-weight: bold;
    text-align: left;
    color: #666;
    font-size: 16px;
  }
  .basic-content {
    width: 100%;
    display: flex;
    padding-top: 20px;

    .basic-content-box {
      width: 1vw;
      flex: auto;
    }
    .content {
      border: 1px solid #cbd0d7;
      border-radius: 5px;
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td {
      background: rgba(0, 0, 0, 0);
    }
  }
  .basic-dialog {
    box-shadow: 0 0 10px rgba(50, 81, 125, 0.3);
    border-radius: 5px;
  }
}
</style>
