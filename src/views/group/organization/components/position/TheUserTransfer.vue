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
import { getTenantListFromGroup, getPropertiesUnit } from "@api/group";
import getTreeBox from "@components/DiyTreeList/TheBox";

export default {
  data() {
    return {
      total: 0,
      selectList: [],
      current: 1,
      query: "",
      data: [],
      value: [],
    };
  },
  components: {
    getTreeBox
  },
  computed: {
    ...mapGetters("group", ["curGroup"]),
  },
  created() {
  },
  props:{
    type:{
      type:String,
      default: ''
    },
    select: {
      type: Array,
      default: ()=>[]
    },
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  mounted(){
    this.loadUserList();
    this.getDefaultList();
  },
  methods: {
    getDefaultList(){
      if(this.type == 'edit'){
        // let list =  this.$parent.$parent.$parent.$children[3].$children[0].tableData
        // this.selectList = this.getChangeData(list)
        // let id = []
        // this.selectList.forEach(element => {
        //   id = [...id, element.id]
        // });
        // this.$children[0].$refs.leftlist.$refs.tree.setCheckedKeys(id);
          let params = {
            propertiesId: this.dialogShow.sendData.id,
          };
          getPropertiesUnit(params).then((res) => {
            console.log(res);
            let data = res.data.data;
            this.selectList = this.getChangeData(data)
            let id = []
            this.selectList.forEach(element => {
              id = [...id, element.id]
            });
            this.$children[0].$refs.leftlist.$refs.tree.setCheckedKeys(id);
          });
        
      }else{
        return
      }
    },
    async handlerFilter(val) {
      let select = this.$children[0].selectList
      if (this.query !== val) {
        this.query = val;

        let params = {
          current: this.current,
          size: 10,
          groupId:this.curGroupId,
          name: this.query
        };
        await getTenantListBelowGroup(params).then((res) => {
          const { records, total } = res.data.data;
          this.total = total;
          this.data = this.getChangeData(records)
          this.current = 1;
        });
        this.selectList = select
        if(select){
          this.$children[0].$refs.leftlist.multipleSelection = select
          this.$children[0].$refs.leftlist.setCheckedNodes()
        }else{
          return true
        }
      }
    },

    async loadUserList() {
      let params = {
        groupId: this.curGroup.groupId,
        current: this.current,
        size: 10,
      };
      await getTenantListFromGroup(params).then((res) => {
        let  records= res.data.data.records;
        records =  this.getChangeData(records)
        this.data = this.data.concat(records);
      });
    },

    getChangeData(data){
      let list = []
      for(let i=0;i<data.length;i++){
        list[i] = {
          realName: data[i].unitName,
          id: data[i].tenantId,
        }
      }
      return list
    }
  },
};
</script>

<style lang="scss" scoped>
.diy-dialog-body{
  width: 100%;
}
</style>
