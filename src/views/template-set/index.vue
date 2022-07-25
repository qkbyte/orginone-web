<template>
  <div class="base-layout templateSet">
    <DiyTitle></DiyTitle>
    <div class="con-box">
      <el-collapse v-model="activeNames">
        <el-collapse-item
          v-for="(item, index) in zcData"
          :name="index"
          :key="item.title"
        >
          <template slot="title">
            <el-divider content-position="left" class="title-txt"
              >{{ item.title }}（{{ item.data.length }}）</el-divider
            >
          </template>
          <div class="collapse-item-con">
            <el-row :gutter="20">
              <el-col
                :span="6"
                v-for="(item2, index2) in item.data"
                :key="index2"
              >
                <div class="row-item">
                  <el-card
                    class="box-card"
                    shadow="hover"
                    :body-style="{ padding: '0px' }"
                  >
                    <div class="card-con">
                      <div class="card-left">
                        <div><i class="el-icon-setting"></i></div>
                        <el-button size="mini">下载</el-button>
                      </div>
                      <div class="card-right">
                        <div class="card-right-top card-right-item">
                          <h4>
                            {{ item2.title }}<i class="el-icon-star-on red"></i>
                          </h4>
                        </div>
                        <div class="card-right-item">
                          需求方：{{ item2.xqf }}
                        </div>
                        <div class="card-right-item">
                          实施方：{{ item2.ssf }}
                        </div>
                      </div>
                    </div>
                  </el-card>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import DiyTitle from "@components/DiyTitle/index";
export default {
  name: "templateSet",
  components: {
    DiyTitle,
  },
  data() {
    return {
      activeNames: [0],
      zcData: [
        {
          title: "固定资产",
          data: [
            {
              title: "车辆",
              xqf: "测试单位1",
              ssf: "元翼科技",
            },
            {
              title: "文物",
              xqf: "测试单位2",
              ssf: "元翼科技",
            },
            {
              title: "图书",
              xqf: "测试单位3",
              ssf: "元翼科技",
            },
            {
              title: "通用设备",
              xqf: "测试单位4",
              ssf: "元翼科技",
            },
            {
              title: "房屋",
              xqf: "测试单位5",
              ssf: "元翼科技",
            },
            {
              title: "专用设备",
              xqf: "测试单位6",
              ssf: "元翼科技",
            },
            {
              title: "电脑",
              xqf: "测试单位7",
              ssf: "元翼科技",
            },
          ],
        },
        {
          title: "无形资产",
          data: [
            {
              title: "车辆",
              xqf: "测试单位1",
              ssf: "元翼科技",
            },
            {
              title: "文物",
              xqf: "测试单位2",
              ssf: "元翼科技",
            },
            {
              title: "图书",
              xqf: "测试单位3",
              ssf: "元翼科技",
            },
            {
              title: "通用设备",
              xqf: "测试单位4",
              ssf: "元翼科技",
            },
            {
              title: "房屋",
              xqf: "测试单位5",
              ssf: "元翼科技",
            },
          ],
        },
      ],
    };
  },
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.con-box {
  margin-top: 10px;
  padding: 10px 20px;
  background: #fff;
  border-radius: 4px;
  .title-txt {
    color: #333;
    .el-divider__text {
      font-size: 16px;
      font-weight: bold;
    }
  }
  .collapse-item-con {
    .row-item {
      margin-top: 20px;
      .box-card {
        .el-card__body {
          padding: 0;
        }
        .card-con {
          display: flex;
          align-items: center;
          background: #c6e2ff;
          .card-left {
            width: 30%;
            text-align: center;
            i {
              font-size: 42px;
              color: green;
            }
            .el-button {
              margin-top: 15px;
              padding: 5px 15px;
            }
          }
          .card-right {
            background: #fff;
            padding: 10px 15px;
            flex-grow: 1;
            .card-right-top {
              h4 {
                font-size: 18px;
                color: #333;
                i {
                  float: right;
                  font-size: 21px;
                  &.red {
                    color: #ff0000;
                  }
                  &.gray {
                    color: #ccc;
                  }
                }
              }
            }
            .card-right-item {
              margin: 10px 0;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
}
</style>
<style>
.templateSet .el-collapse {
  border: 0;
}
.templateSet .el-collapse-item__header {
  border: 0;
}
.templateSet .el-collapse-item__wrap {
  border: 0;
}
</style>
