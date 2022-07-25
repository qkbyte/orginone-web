<template>
  <div class="wel">
    <div class="welMain">
      <div class="sep">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: '消息' }">消息</el-breadcrumb-item>
          <el-breadcrumb-item>单据审批</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="con">
        <div class="info">
          <div class="tit">
            <div></div>
            <div>
              <i class="el-icon-s-check"></i>
              <span>XX业务审批单</span>
            </div>
            <div class="flow">
              <el-button type="text" @click="toFlow">
                <i class="el-icon-share"></i>查看流程
              </el-button>
            </div>
          </div>
          <div class="head">基本信息</div>
          <div class="table">
            <div class="row-1">
              <div class="col input"> 
                <div class="tHead">审批部门</div>
                <div class="tBody">
                  <el-input v-model="form.name" disabled placeholder="财务部"></el-input>
                </div>
              </div>
              <div class="col input">
                <div class="tHead">申请人</div>
                <div class="tBody">
                  <el-input v-model="form.tag" disabled placeholder="XXX"></el-input>
                </div>
              </div>
            </div>
            <div class="row-2">
              <div class="col input">
                <div class="tHead">联系电话</div>
                <div class="tBody">
                  <el-input v-model="form.phone" disabled placeholder="13888888888"></el-input>
                </div>
              </div>
              <div class="col input">
                <div class="tHead">申请事由</div>
                <div class="tBody">
                  <el-input v-model="form.phone" placeholder="请填写事由"></el-input>
                </div>
              </div>
            </div>
            <div class="row-3">
              <div class="col input">
                <div class="tHead">申请拨款金额</div>
                <div class="tBody">
                  <el-input v-model="form.name" placeholder="请填写拨款金额"></el-input>
                </div>
              </div>
              <div class="col input">
                <div class="tHead">测算依据</div>
                <div class="tBody">
                  <el-input v-model="form.tag" placeholder="请填写测算依据"></el-input>
                </div>
              </div>
            </div>
            <div class="row-4">
              <div class="col input">
                <div class="tHead">上传附件</div>
              </div>
            </div>
          </div>
        </div>
        <div class="form">
          <div class="head">扩展信息</div>
          <div class="table">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="name" label="预算名称" width="180"></el-table-column>
              <el-table-column prop="del" label="支出预算" width="180"></el-table-column>
              <el-table-column prop="add" label="收入预算" width="180"></el-table-column>
              <el-table-column prop="date" label="时间"></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="opinion">
          <div class="tit">
            <div class="head">审批意见</div>
            <div class="btn">
              <i class="el-icon-s-comment"></i> 常用语
            </div>
          </div>
          <div class="table">
            <div class="row-1">
              <div class="col input">
                <div class="tHead">我的意见</div>
                <div class="tBody">
                  <el-input v-model="form.name" placeholder="请输入意见"></el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="option">
          <div>
            <el-button type="primary" class="primary" @click="handleReturn">同意</el-button>
          </div>
          <div>
            <el-button
              type="primary"
              @click="handleReturn()"
              class="primary"
              style="margin-left:30px;"
            >退回</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      form: {
        name: "",
        tag: "",
        phone: "",
        type: "",
        con: "",
        file: []
      },
      tableData: [
        {
          date: "2016-05-02",
          name: "XX预算",
          add: "1000",
          del: "999"
        },
        {
          date: "2016-05-02",
          name: "XX预算",
          add: "1000",
          del: "999"
        },
        {
          date: "2016-05-02",
          name: "XX预算",
          add: "1000",
          del: "999"
        },
        {
          date: "2016-05-02",
          name: "XX预算",
          add: "1000",
          del: "999"
        }
      ]
    };
  },
  mounted: function() {},
  methods: {
    //返回
    handleReturn() {
      this.$router.go(-1);
    },
    toFlow() {
      this.$router.push({ name: "flow" });
    }
  }
};
</script>
<style lang="scss" scoped>
.wel {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  .welMain {
    display: flex;
    flex-direction: column;
    padding: 3%;

    .con {
      width: 100%;
      margin-top: 30px;

      .info {
        width: 100%;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 6px 10px rgba(5, 36, 83, 0.12);
        border-radius: 4px;
        border-top: 6px solid rgba(21, 74, 216, 1);
        box-sizing: border-box;
        padding: 0 4% 4%;

        .tit {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100px;

          i {
            font-size: 2.125rem;
            color: rgba(21, 74, 216, 1);
          }
          span {
            margin-left: 5px;
            font-size: 2.125rem;
            color: rgba(21, 74, 216, 1);
            font-weight: bold;
          }

          .flow {
            display: flex;
            right: 0px;
          }
        }

        .head {
          font-size: 1.875rem;
          font-weight: bold;
          color: rgba(102, 102, 102, 1);
        }

        .table {
          width: 100%;
          border: 1px solid rgba(203, 208, 215, 1);
          border-radius: 8px;
          overflow: hidden;
          box-sizing: border-box;
          margin-top: 30px;

          .row-1,
          .row-2,
          .row-3,
          .row-4 {
            width: 100%;
            height: 80px;
            display: flex;

            .col {
              width: 50%;
              height: 100%;
              display: flex;
              line-height: 80px;

              .tHead {
                width: 130px;
                text-align: center;
                background: rgba(248, 250, 251, 1);
                font-weight: bold;
                color: rgba(51, 51, 51, 1);
              }
              .tBody {
                flex: 1;
              }
            }
          }

          .row-4 {
            height: 150px;

            & > .col {
              width: 100%;
              line-height: 150px;
            }
          }
        }
      }

      .form {
        margin-top: 30px;
        width: 100%;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 6px 10px rgba(5, 36, 83, 0.12);
        border-radius: 4px;
        box-sizing: border-box;
        padding: 4%;

        .head {
          font-size: 1.875rem;
          font-weight: bold;
          color: rgba(102, 102, 102, 1);
        }

        .table {
          width: 100%;
          border: 1px solid rgba(203, 208, 215, 1);
          border-radius: 8px;
          overflow: hidden;
          box-sizing: border-box;
          margin-top: 30px;
        }
      }

      .opinion {
        margin-top: 30px;
        width: 100%;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 6px 10px rgba(5, 36, 83, 0.12);
        border-radius: 4px;
        box-sizing: border-box;
        padding: 4%;

        .tit {
          display: flex;
          justify-content: space-between;

          .head {
            font-size: 1.875rem;
            font-weight: bold;
            color: rgba(102, 102, 102, 1);
          }

          i {
            color: rgba(21, 74, 216, 1);
            font-size: 1.4rem;
          }

          .btn {
            font-size: 1.25rem;
          }
        }

        .table {
          width: 100%;
          border: 1px solid rgba(203, 208, 215, 1);
          border-radius: 8px;
          overflow: hidden;
          box-sizing: border-box;
          margin-top: 30px;

          .row-1 {
            width: 100%;
            height: 120px;
            display: flex;

            .col {
              width: 100%;
              height: 100%;
              display: flex;
              line-height: 120px;

              .tHead {
                width: 130px;
                text-align: center;
                background: rgba(248, 250, 251, 1);
                font-weight: bold;
                color: rgba(51, 51, 51, 1);
              }
              .tBody {
                flex: 1;
              }
            }
          }
        }
      }

      .option {
        margin-top: 60px;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.input ::v-deep .el-input__inner {
  width: 100%;
  border-radius: 0 !important;
  height: 80px;
  border: none !important;
  border-bottom: 1px solid #dcdfe6 !important;
}
.input ::v-deep .el-select {
  width: 100%;
}
.input ::v-deep .el-textarea__inner {
  width: 100%;
  border-radius: 0 !important;
  height: 150px;
  border: none !important;
  border-bottom: 1px solid #dcdfe6 !important;
}

.opinion ::v-deep .el-input__inner {
  width: 100%;
  border-radius: 0 !important;
  height: 120px;
  border: none !important;
  border-bottom: 1px solid #dcdfe6 !important;
}

.option ::v-deep .el-button {
  width: 150px;
}
.option ::v-deep .el-button:hover {
  color: #fff !important;
  background-color: #1549d8e5 !important;
  border-color: #1549d8e5 !important;
  font-weight: 400 !important;
}
</style>