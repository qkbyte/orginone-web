<template>
  <div class="diy-dialog-body">
      <getTreeBox
        :dataList="data"
        :number="total"
        :select="selectList"
      ></getTreeBox>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getHasSelectUserList, getUserList } from "@api/user";
import getTreeBox from "@components/DiyTreeList/TheBox";

export default {
  data() {
    return {
      total: 0,
      data: [],
      selectList: [],
      current: 1,
      query: "",
      scroll: false
    };
  },
  props:{
    type:{
      type:String,
      default: ''
    }
  },
  components: {
    getTreeBox
  },
  props:{
    type:{
      type:String,
      default:''
    },
    select:{
      type:Array,
      default:()=>[]
    }
  },
  watch:{
    select:{
      handler(val){
        // 新增type为add 分配为edit
        if(this.type == 'edit'){
          this.selectList = val
          let id = []
          this.selectList.forEach(element => {
            id = [...id, element.id]
          });
          this.$children[0].$refs.leftlist.$refs.tree.setCheckedKeys(id);
        }else{
          this.selectList = []
        }
      }
    }
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  created() {
  },
  beforeDestroy() {},
  mounted() {
    this.loadUserList();
  },
  methods: {
    async handlerFilter(val) {
      let select = this.$children[0].selectList
      console.log('val', val,'query',this.query);
      if (this.query !== val) {
        this.query = val;
        let params = {
          current: this.current,
          size: 10,
          tenantCode: this.curTenantCode,
          isActivate: 1,
          fuzzyVal: this.query,
        };
        await getUserList(params).then((res) => {
          const { records, total } = res.data.data;
          this.total = total;
          this.data = records;
          this.current = 1;
        });
        this.selectList = select
        if(select){
          this.$children[0].$refs.leftlist.multipleSelection = select
          this.$children[0].$refs.leftlist.setCheckedNodes()
        }
      }else{ // 如果已经处于搜索状态则获得的数据进行叠加
        let params = {
          current: this.current,
          size: 10,
          tenantCode: this.curTenantCode,
          isActivate: 1,
          fuzzyVal: this.query,
        };
        await getUserList(params).then((res) => {
          const { records, total } = res.data.data;
          this.total = total;
          this.data = this.data.concat(records);
        });
        this.selectList = select
        if(select){
          this.$children[0].$refs.leftlist.multipleSelection = select
          this.$children[0].$refs.leftlist.setCheckedNodes()
        }
      }
    },

    async loadUserList(val) {
      let params = {
        current: this.current,
        size: 10,
        tenantCode: this.curTenantCode,
        flag: 0,
        isActivate: 1,
        fuzzyVal: this.query,
      };

      await getUserList(params).then((res) => {
        const { records, total } = res.data.data;
        this.total = total;
        this.data = this.data.concat(records);
      });
      if(this.scroll){
        let select = this.$children[0].selectList
        this.$children[0].$refs.leftlist.multipleSelection = select
        this.$children[0].$refs.leftlist.setCheckedNodes()
        this.scroll = false
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-checkbox{
  margin-left: 20px;
}
.diy-dialog-body {
  box-sizing: border-box;
  border-radius: 4px;
  justify-content: flex-start;
  margin-top: 23px;
  width: 100%;

  &--left,
  &--right {
    width: 48%;
    height: 350px;
  }

  &--left{
    margin-right: 20px;
  }

  &--box{
    border:1px solid rgba(235, 238, 245, 1);
    height: 310px;
  }
  &--leftList,
  &--rightList{
    border:1px solid rgba(235, 238, 245, 1);
  }

  &--leftTop,
  &--rightTop{
    width: 100%;
    height: 40px;
    border-radius: 10px 10px 0px 0px;
    border: 1px solid rgba(235, 238, 245, 1);
    background-color: #f5f7fa;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  &__title {
    font-size: 14px;
    font-weight: 500;
    line-height: 40px;
    color: rgba(48, 49, 51, 1);
  }

  &__list {
    height: 280px;
    margin-top: 20px;
    overflow: auto;

    li {
      height: 26px;
      line-height: 26px;
      display: flex;
      justify-content: space-between;

      i {
        color: #c0c4cc;
        cursor: pointer;
        margin-right: 20px;
        &:hover {
          color: #9da1a8;
        }
      }
    }
  }
}
</style>
