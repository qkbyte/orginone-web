<template>
  <div class="diy-dialog-body">
      <getTreeBox
        :dataList="data"
        :number="total"
        :select="selectList"
        :codeShow="true"
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
      scroll: false,
    };
  },
  props:{
    type:{
      type:String,
      default: ''
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
  components: {
    getTreeBox
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  created() {
     
  },
  mounted() {
    this.loadUserList();
  },
  methods: {
    async handlerFilter(val) {
      let select = this.$children[0].selectList
      if (this.query !== val) {
        this.query = val;

        let params = {
          current: this.current,
          size: 10,
          tenantCode: this.curTenantCode,
          isActivate: 3,
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
          isActivate: 3,
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
        isActivate: 3,
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
.diy-dialog-body{
  width: 100%;
}
</style>
