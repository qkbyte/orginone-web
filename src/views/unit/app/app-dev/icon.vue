<template>
  <div class="base-layout">
    <div class="base-layout__button">
      <el-button type="text" @click="addIcon">添加</el-button>
      <el-button v-if="!isCheckBox" type="text" @click="deleteAllShow">批量删除</el-button>
      <div v-else>
        <el-button type="text" @click="handleDelete">删除</el-button>
        <el-button type="text" @click="cancel">取消</el-button>
      </div>
      <el-button type="text" @click="back">返回</el-button>
    </div>
    <div class="base-layout__box">
      <div class="base-layout__image"
        v-for="(item,index) in tableData" :key="item.id"
        @mouseover="mouseover(index)"
        @click="getCheckBox(item)"
        :style="{'background-image': 'url(' + item.icon + ')','background-repeat':'no-repeat','background-size':'100% 100%', 'cursor': ( isCheckBox ? 'pointer' : '' )}"
      >
        <div v-if="!isCheckBox">
          <div v-show="isShow && index == isIndex" class="base-layout__mask" @mouseleave="mouseleave">
            <div class="el-icon-delete" @click="handleDelete(item,index)"></div>
          </div>
        </div>
        <div v-else>
          <input class="base-layout__checkBox" type="checkbox" :value="item.id" v-model="selectArr">
        </div>
      </div>
    </div>

    <template v-for="item in dialogShow">
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
import {tenanticonRemove ,getTenanticonList } from "@api/market";
import TheAddDialog from "./components/TheAddDialog";
import { getDictItemObject } from "@utils/index";

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
      tableData: [],
      tenantIcon: "",
      imageEdit:"",
      selectArr:[],
      // 判断数据
      isShow:false,
      isCheckBox:false, // 控制是否进行批量删除
      isIndex:0,
      isCheck:false // 控制是否已经点击状态
    };
  },
  components: {
    TheAddDialog
  },
  created() {
    this.$nextTick(async () => {
      this.appType = await getDictItemObject(this.dict.APP_TYPE);
      this.loadData();
    });
  },
  mounted() {},
  methods: {
    loadData() {
      let params = {
        tenantIcon: this.tenantIcon
      };

      getTenanticonList(params).then((res) => {
        console.log('res', res);
        this.tableData = res.data.data;
        console.log('tablke', this.tableData);
      });
    },
    addIcon(){
      this.dialogShow.map((el) => {
        if (el.key === "add") {
          el.value = true;
        }
      });
    },
    deleteAllShow(){
      this.isCheckBox = true
    },
    cancel(){
      this.isCheckBox = false
    },
    back(){
      this.$router.push({ name: "app-dev" })
    },
    /**
     * 表格内按钮操作
     */
    handleDelete(row,index) {
      let params = {}
      if(!this.isCheckBox){
        params = {
          ids: row.id
        }
        this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteImage(params)
        }).catch(() => {
          return           
        });
      }else{
        if(this.selectArr == ''){
          this.$message({
            message: '请至少选择一张图片',
            type: 'warning'
          });
          return
        }else{
          let arr = this.selectArr.join(",")
          params = {
            ids: arr
          }
          this.$confirm('此操作将永久删除所选择的图片, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteImage(params)
          }).catch(() => {
            return          
          });
        }
      }
    },
    deleteImage(params){
      tenanticonRemove(params).then((res) => {
        if(res.data.code == 200){
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.loadData() 
        }
      });
    },
    getCheckBox(item){
      if(this.isCheckBox){
        if(this.selectArr.indexOf(item.id)>=0){
          let index = this.selectArr.indexOf(item.id)
          this.selectArr.splice(index, 1)
        }else{
          this.selectArr = [...this.selectArr, item.id]
        }
      }
    },
    mouseover(index){
      this.isIndex = index
      this.isShow = true
    },
    mouseleave(){
      this.isShow = false
    }
  },
};
</script>

<style lang="scss" scoped>
.el-icon-delete{
  color: #ffffff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  cursor: pointer;
}
.base-layout{
  width: 100%;
  height: 100%;
  background: #ffffff;
  margin-top: 4px;
  .el-button{
    margin-right: 20px;
  }
  &__button{
    display: flex;
    flex-direction: row-reverse;
  }
  &__box{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  &__image{
    position: relative;
    margin: 20px 20px;
    width: 60px;
    height: 60px;
  }
  &__mask{
    position: absolute;
    width: 60px;
    height: 60px;
    background: rgba($color: #000000, $alpha: 0.5);
  }
}
</style>
