<template>
  <div class="title">
    <div>
      <DiyBreadcrumb></DiyBreadcrumb>
    </div>
    <div class="title-right">
      <slot name="search">
        <div class="search-input">
          <el-input v-model="content" :placeholder="searchName" size="small" style="width:220px;border:0;"
            @keyup.enter.native="startSearch">
            <i slot="prefix" class="search-icon" @click="startSearch">
              <img src="@assets/search-icon.png" alt="" />
            </i>
          </el-input>
          <el-tooltip class="item" effect="dark" content="筛选" placement="bottom">
            <svg v-if="iconShow" class="icon title-icon" aria-hidden="true" @click="onClick">
              <use :xlink:href="'#icon-shaixuan'"></use>
            </svg>
          </el-tooltip>
        </div>
      </slot>
      <slot name="screen" v-if="screenVal== 1  && pageName == '待办中心' || screenVal== 2 && pageName == '待办中心' || screenVal== 3 && pageName == '待办中心' || screenVal== 4 && pageName == '待办中心'">
        <i title="点击筛选" class="iconfont iconshaixuan" @click="screen"></i>
        <el-drawer class="drawer" :visible.sync="screenvisible" direction="rtl" :append-to-body="false"
          :before-close="handleClose" :modal-append-to-body="false" size="400px" :modal="false">
          <div slot="title">
            <span title="筛选" class="drawer-title">筛选</span>
          </div>
          <div class="drawer-content">
            <div class="drawer-info">
              <el-tabs id="tabs" v-model="draweractiveName" class="zstars-tabs-config">
                <el-form ref="form" :model="drawerform" class="zstars-search" v-if="screenVal== 1">
                  <el-form-item class="formitem">
                    <template>
                      <div slot="label">
                        <span>收到时间</span>
                      </div>
                    </template>
                    <el-date-picker
                      v-model="drawerform.time"
                      type="daterange"
                      range-separator="-"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      format="yy-MM-dd"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item class="formitem">
                    <template>
                      <div slot="label">
                        <span>发起单位</span>
                      </div>
                    </template>
                    <el-input v-model="drawerform.input" placeholder="请选择单位"></el-input>
                  </el-form-item>
                  <el-form-item class="formitem">
                    <template>
                      <div slot="label">
                        <span>单据编号</span>
                      </div>
                    </template>
                    <el-input v-model="drawerform.Djh" placeholder="请输入单据号"></el-input>
                  </el-form-item>
                  <el-form-item class="formitem">
                    <template>
                      <div slot="label">
                        <span>业务类型</span>
                      </div>
                    </template>
                    <el-input v-model="drawerform.YYlx" placeholder="请输入业务类型"></el-input>
                  </el-form-item>
                </el-form>
                <el-form ref="form" :model="drawerform2" class="zstars-search" v-if="screenVal== 2">
                  <el-form-item class="formitem">
                    <template>
                      <div slot="label">
                        <span>收到时间</span>
                      </div>
                    </template>
                    <el-date-picker
                      v-model="drawerform2.time"
                      type="daterange"
                      range-separator="-"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      format="yy-MM-dd"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item class="formitem">
                    <template>
                      <div slot="label">
                        <span>发起单位</span>
                      </div>
                    </template>
                    <el-input v-model="drawerform2.input" placeholder="请选择单位"></el-input>
                  </el-form-item>
                  <el-form-item class="formitem">
                    <template>
                      <div slot="label">
                        <span>单据编号</span>
                      </div>
                    </template>
                    <el-input v-model="drawerform2.Djh" placeholder="请输入单据号"></el-input>
                  </el-form-item>
                  <el-form-item class="formitem">
                    <template>
                      <div slot="label">
                        <span>业务类型</span>
                      </div>
                    </template>
                    <el-input v-model="drawerform2.YYlx" placeholder="请输入业务类型"></el-input>
                  </el-form-item>
                </el-form>
                <el-form ref="form" :model="drawerform3" class="zstars-search" v-if="screenVal== 3">
                  <el-form-item class="formitem">
                    <template>
                      <div slot="label">
                        <span>完成时间</span>
                      </div>
                    </template>
                    <el-date-picker
                      v-model="drawerform3.time"
                      type="daterange"
                      range-separator="-"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      format="yy-MM-dd"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item class="formitem">
                    <template>
                      <div slot="label">
                        <span>发起单位</span>
                      </div>
                    </template>
                    <el-input v-model="drawerform3.input" placeholder="请选择单位"></el-input>
                  </el-form-item>
                  <el-form-item class="formitem">
                    <template>
                      <div slot="label">
                        <span>单据编号</span>
                      </div>
                    </template>
                    <el-input v-model="drawerform3.Djh" placeholder="请输入单据号"></el-input>
                  </el-form-item>
                  <el-form-item class="formitem">
                    <template>
                      <div slot="label">
                        <span>业务类型</span>
                      </div>
                    </template>
                    <el-input v-model="drawerform3.YYlx" placeholder="请输入业务类型"></el-input>
                  </el-form-item>
                </el-form>
                <el-form ref="form" :model="drawerform4" class="zstars-search" v-if="screenVal== 4">
                  <el-form-item class="formitem">
                    <template>
                      <div slot="label">
                        <span>收到时间</span>
                      </div>
                    </template>
                    <el-date-picker
                      v-model="drawerform4.time"
                      type="daterange"
                      range-separator="-"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      format="yy-MM-dd"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item class="formitem">
                    <template>
                      <div slot="label">
                        <span>发起单位</span>
                      </div>
                    </template>
                    <el-input v-model="drawerform4.input" placeholder="请选择单位"></el-input>
                  </el-form-item>
                  <el-form-item class="formitem">
                    <template>
                      <div slot="label">
                        <span>单据编号</span>
                      </div>
                    </template>
                    <el-input v-model="drawerform4.Djh" placeholder="请输入单据号"></el-input>
                  </el-form-item>
                  <el-form-item class="formitem">
                    <template>
                      <div slot="label">
                        <span>业务类型</span>
                      </div>
                    </template>
                    <el-input v-model="drawerform4.YYlx" placeholder="请输入业务类型"></el-input>
                  </el-form-item>
                </el-form>
              </el-tabs>
              <div class="filter-btn" style="display: flex;justify-content: center;margin-top: 30px;width: 100%;" v-if="screenVal== 1">
                <el-button size="mini" type="primary" icon="el-icon-search" @click="search" style="width: 30%;">查询
                </el-button>
                <el-button size="mini" type="info" icon="el-icon-refresh" @click="searchCZ" style="width: 30%;">重置
                </el-button>
              </div>
              <div class="filter-btn" style="display: flex;justify-content: center;margin-top: 30px;width: 100%;" v-if="screenVal== 2">
                <el-button size="mini" type="primary" icon="el-icon-search" @click="search2" style="width: 30%;">查询
                </el-button>
                <el-button size="mini" type="info" icon="el-icon-refresh" @click="searchCZ2" style="width: 30%;">重置
                </el-button>
              </div>
              <div class="filter-btn" style="display: flex;justify-content: center;margin-top: 30px;width: 100%;" v-if="screenVal== 3">
                <el-button size="mini" type="primary" icon="el-icon-search" @click="search3" style="width: 30%;">查询
                </el-button>
                <el-button size="mini" type="info" icon="el-icon-refresh" @click="searchCZ3" style="width: 30%;">重置
                </el-button>
              </div>
              <div class="filter-btn" style="display: flex;justify-content: center;margin-top: 30px;width: 100%;" v-if="screenVal== 4">
                <el-button size="mini" type="primary" icon="el-icon-search" @click="search4" style="width: 30%;">查询
                </el-button>
                <el-button size="mini" type="info" icon="el-icon-refresh" @click="searchCZ4" style="width: 30%;">重置
                </el-button>
              </div>
            </div>
          </div>
        </el-drawer>
      </slot>
    </div>
  </div>
</template>

<script>
import DiyBreadcrumb from "@components/DiyBreadcrumb/index";
import { mapState, mapMutations, mapActions } from "vuex";
import Bus from "@utils/eventBus"
export default {
  name: "DiyTitle",
  data() {
    return {
      pageName: "",
      content: "",
      drawer: {},
      form: {
        id: '',
        unitName: '',
        tenantCode: '',
      },
      screenvisible: false,
      draweractiveName: "",
      drawerform: {
        time: [],
        input: "",
        Djh:"",
        YYlx:""
      },
      drawerform2: {
        time: [],
        input: "",
        Djh:"",
        YYlx:""
      },
      drawerform3: {
        time: [],
        input: "",
        Djh:"",
        YYlx:""
      },
      drawerform4: {
        time: [],
        input: "",
        Djh:"",
        YYlx:""
      },
      screenVal:"1",
    };
  },
  props: {
    iconShow: {
      type: Boolean,
      default: false
    },
    searchName: {
      type: String,
      default: "请输入搜索内容"
    }
  },
  computed: {
    ...mapState(["searchContent"]),
  },
  mounted() {
    Bus.$on('curTabnewValue',(e)=>{
      console.log("e",e);
       this.screenVal = e
    })
  },
  components: { DiyBreadcrumb },
  created() {
    this.pageName = this.$route.meta.title;
  },
  beforeDestroy() {
    this.content = ""
    this.SET_SEARCH_CONTENT(this.content);
  },
  methods: {
    ...mapMutations(["SET_SEARCH_CONTENT"]),
    ...mapActions("options", ["getFormShow"]),
    startSearch() {
      // 因为怕其他页面使用此方法，所以暂时先使用此方法
      this.SET_SEARCH_CONTENT(this.content);
      // 平台运维工具的搜索使用eventBus进行搜索 
      Bus.$emit('searchEnter', this.content)
    },
    onClick() {
      this.drawer = {
        show: true,
        load: false
      }
      this.getFormShow(this.drawer)
    },
    screen() {
      this.screenvisible = true
    },
    handleClose() {
      this.screenvisible = false
    },
    search(){
      Bus.$emit("drawerform",this.drawerform)
      this.screenvisible = false
      this.drawerform.time = []
      this.drawerform.input = ""
      this.drawerform.Djh = ""
      this.drawerform.YYlx = ""
      // console.log(this.drawerform.time); //todotime
      // console.log(this.drawerform.input); //todoSendTenantName
      // console.log(this.drawerform.Djh); //taskid
      // console.log(this.drawerform.YYlx); //todotitle
      
    },
    searchCZ(){
      this.screenvisible = false
      this.drawerform.time = []
      this.drawerform.input = ""
      this.drawerform.Djh = ""
      this.drawerform.YYlx = ""
      Bus.$emit("drawerform",this.drawerform)
    },
    search2(){
      Bus.$emit("drawerform2",this.drawerform2)
      this.screenvisible = false
      this.drawerform2.time = []
      this.drawerform2.input = ""
      this.drawerform2.Djh = ""
      this.drawerform2.YYlx = ""
    },
    searchCZ2(){
      this.screenvisible = false
      this.drawerform2.time = []
      this.drawerform2.input = ""
      this.drawerform2.Djh = ""
      this.drawerform2.YYlx = ""
      Bus.$emit("drawerform2",this.drawerform2)
    },
    search3(){
      Bus.$emit("drawerform3",this.drawerform3)
      this.screenvisible = false
      this.drawerform3.time = []
      this.drawerform3.input = ""
      this.drawerform3.Djh = ""
      this.drawerform3.YYlx = ""
    },
    searchCZ3(){
      this.screenvisible = false
      this.drawerform3.time = []
      this.drawerform3.input = ""
      this.drawerform3.Djh = ""
      this.drawerform3.YYlx = ""
      Bus.$emit("drawerform3",this.drawerform3)
    },
    search4(){
      Bus.$emit("drawerform4",this.drawerform4)
      this.screenvisible = false
      this.drawerform4.time = []
      this.drawerform4.input = ""
      this.drawerform4.Djh = ""
      this.drawerform4.YYlx = ""
    },
    searchCZ4(){
      this.screenvisible = false
      this.drawerform4.time = []
      this.drawerform4.input = ""
      this.drawerform4.Djh = ""
      this.drawerform4.YYlx = ""
      Bus.$emit("drawerform4",this.drawerform4)
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@styles/common.scss";
.footer {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translate(-50%);
}
.title {
  @include border_color("border_color1");
  height: 48px;
  width: 100%;
  background-color: white;
  border-radius: 4px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .title-icon {
    width: 22px;
    height: 22px;
    color: #909399;
    margin-left: 30px;
    cursor: pointer;
  }
}
.search-icon {
  padding-left: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  img {
    width: 16px;
    height: 16px;
  }
}
.title-right {
  display: flex;
}
.iconshaixuan {
  color: #00f;
  cursor: pointer;
  margin: 10px 0px 10px 25px;
  font-size: 14px;
  line-height: 20px;
}
.drawer-title {
  font-size: 20px;
  outline: none;
  font-weight: 600;
  color: #5c5c5c;
}
.drawer-content {
  margin-top: 20px;
  width: 90%;
  margin: 0 auto;
}
.zstars-search {
  display: flex;
  flex-wrap: wrap;
}
.formitem {
  display: flex;
}
.el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 219px;
}
</style>

<style lang="scss" >
.title {
  %search {
    .el-input__inner {
      border-radius: 16px;
      border: 0;
      padding-left: 42px;
    }
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .search-input {
    @extend %search;
    .el-input__inner {
      background: #f2f4f9;
    }
    .el-input__prefix {
      display: flex;
      align-items: center;
    }
  }
}
</style>
