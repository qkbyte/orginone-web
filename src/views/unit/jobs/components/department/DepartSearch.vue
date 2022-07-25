<template>
  <div
    class="base-flex"
    style="height:100%"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="保存中"
  >
    <!-- <div class="person" v-show="list.length !== 0">
        <div class="person-head">人员信息</div>
    </div>
    <div class="depart">
        <div class="headLayout" :class="unitIndex === index ? 'depart-onclick': ''" v-for="(item,index) in list" :key="item.id" @click="handleView(item,index)">
            <div 
              v-if="item.imgUrl"
              class="headLayout-avatar_img" 
              v-bind:style="{'background-image': 'url(' + item.userPhoto + ')','background-repeat':'no-repeat','background-size':'100% 100%' }"
            ></div>
            <div
              v-else 
              class="headLayout-avatar_img2" 
            >{{item.userHead}}</div>
            <div class="headLayout-column">
                <div class="headLayout-column__name">{{item.realName}}</div>
                <div class="headLayout-column__phone">{{item.phoneNumber}}</div>
            </div>
        </div>
    </div> -->
    <div class="depart" v-show="depart.length !== 0">
        <div class="depart-head">部门信息</div>
        <div class="depart-layout" :class="departIndex === index ? 'depart-onclick': ''" @click="handleDepart(item, index)" v-for="(item, index) in depart" :key="item.id">
          <svg class="icon " aria-hidden="true">
            <use :xlink:href="'#icon-department'"></use>
          </svg>
          <div class="depart-layout__name">{{item.agencyName}}</div>
        </div>
    </div>
  </div>
</template>

<script>
import { searchDeptPerson } from '@api/department'
export default {
  data() {
    return {
        loading:false,
        list:[],
        depart:[],
        unitIndex:false,
        departIndex:false,
    };
  },
  props:{
    filterText:{
      type:String,
      default:''
    }
  },
  watch:{
    filterText(val){
      if(val !== ''){
        this.load(val)
      }
    }
  },
  components: {},
  computed: {
  },
  created() {
  },
  mounted() {
    this.list.forEach((el)=>{
      el.userHead = el.name.substr(0, 1)
    })
  },
  methods: {
    handleDepart(data,index){
      this.departIndex = index
      this.unitIndex = false
      this.$emit('handleTreeKey',data)
    },
    load(val){
      let params = {
        name:val
      }
      searchDeptPerson(params).then((res) => {
        if(res.data.code == 200){
          const { deptList, personList } = res.data.data
          personList.forEach(el => {
            el.userHead = el.realName.slice(0,1)
          })
          this.list = personList
          this.depart = deptList
        }
      });
    },
    handleView(data,index){
      this.departIndex = false
      this.unitIndex = index
      this.$emit('appearView',data,true)
    }
  },
};
</script>

<style lang="scss" scoped>
.diy-dialog-body{
  width: 100%;
}
.person{
    &-head{
        margin-top: 10px;
        min-width: 212  px;
        height: 29.6px;
        background: rgb(245, 246, 252);
        line-height: 29.6px;
        padding-left: 10px;
        color: rgb(134, 134, 134);
    }
}
.icon{
  font-size: 14px;
  margin-left: 15px;
  margin-right: 5px;
}
.depart{
  &-onclick{
    background: rgb(236, 241, 252);
  }
  &-head{
        margin-top: 10px;
        min-width: 212px;
        height: 29.6px;
        background: rgb(245, 246, 252);
        line-height: 29.6px;
        padding-left: 10px;
        color: rgb(134, 134, 134);
  }
  &-layout{
    display: flex;
    flex-direction: row;
    height: 40px;
    padding: 25px 0;
    border-bottom: 1px solid #eeeeee;
    align-items: center;
    cursor: pointer;
    &__icon{
      font-size: 15px;
      margin-right: 5px;
      margin-left: 5px;
    }
    .el-icon-orange{
      font-size: 25px;
    }
    &__name{
      font-size: 15px;
      line-height: 22px;
    }
  }
}
.headLayout{
    display: flex;
    flex-direction: row;
    padding-top: 5px;
    height: 55px;
    // margin-bottom: 5px;
    // padding-bottom: 10px;
    border-bottom: 1px solid #eeeeee;
    cursor: pointer;
    &-avatar_img{
      width: 30px;
      height: 30px;
      margin-top: 10px;
      margin-left: 10px;
      border-radius: 50%;
    }
    &-avatar_img2{
      width: 30px;
      height: 30px;
      background: #154AD8;
      margin-top: 10px;
      margin-left: 10px;
      border-radius: 50%;
      text-align: center;
      line-height: 30px;
      font-size: 15px;
      color: #ffffff;
    }
    &-column{
      display: flex;
      flex-direction: column;
      &__name{
        margin-top: 5px;
        margin-left: 5px;
      }
      &__phone{
        margin-top: 5px;
        margin-left: 5px;
      }
    }
}
.headLayout:hover{
  background: #f5f7fa;
}
.depart-layout:hover{
  background: #f5f7fa;
}
</style>
