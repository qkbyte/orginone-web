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
import {
  getTenantListFromGroup,
  getTenantListUnderGroup,
  getAllTenantListFromGroup,
  getTenantListBelowGroup,
} from "@api/group";
import { mapGetters } from "vuex";
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
      scroll: false,
      size:99999,
      current:1,
    };
  },
  components: {
    getTreeBox,
  },
  computed: {
    ...mapGetters("group", ["curGroupId"]),
  },
  props:{
    sendData:{
      type:Object,
      default: ()=>{}
    }
  },
  created() {},
  mounted() {
    this.loadUserList();
    this.getDefaultList();
  },
  methods: {
    async getDefaultList() {
      let params = {
        current: this.current,
        size: this.size,
        groupId: this.sendData.id,
      };
      let res = await getTenantListBelowGroup(params)
      let list =  res.data.data.records
      this.selectList = this.getChangeData(list);
      let id = [];
      this.selectList.forEach((element) => {
        id = [...id, element.id];
      });
      this.$children[0].$refs.leftlist.$refs.tree.setCheckedKeys(id);
    },

    async handlerFilter(val) {
      let select = this.$children[0].selectList;
      if (this.query !== val) {
        this.query = val;

        let params = {
          current: this.current,
          size: 10,
          groupId: this.curGroupId,
          name: this.query,
        };
        await getTenantListFromGroup(params).then((res) => {
          const { records, total } = res.data.data;
          this.total = total;
          this.data = this.getChangeData(records);
          this.current = 1;
        });
        this.selectList = select;
        if (select) {
          this.$children[0].$refs.leftlist.multipleSelection = select;
          this.$children[0].$refs.leftlist.setCheckedNodes();
        }
      } else {
        let params = {
          current: this.current,
          size: 10,
          groupId: this.curGroupId,
          name: this.query,
        };
        await getTenantListFromGroup(params).then((res) => {
          const { records, total } = res.data.data;
          this.total = total;
          this.data = this.data.concat(records);
          this.data = this.getChangeData(this.data);
          this.current = 1;
        });
        this.selectList = select;
        if (select) {
          this.$children[0].$refs.leftlist.multipleSelection = select;
          this.$children[0].$refs.leftlist.setCheckedNodes();
        }
      }
    },

    async loadUserList(val) {
      let params = {
        groupId: this.curGroupId,
        current: this.current,
        size: 10,
      };
      await getTenantListFromGroup(params).then((res) => {
        let records = res.data.data.records;
        records = this.getChangeData(records);
        this.data = this.data.concat(records);
      });
      if (this.scroll) {
        let select = this.$children[0].selectList;
        this.$children[0].$refs.leftlist.multipleSelection = select;
        this.$children[0].$refs.leftlist.setCheckedNodes();
        this.scroll = false;
      }
    },
    getChangeData(data) {
      let list = [];
      for (let i = 0; i < data.length; i++) {
        list[i] = {
          realName: data[i].unitName,
          id: data[i].tenantId,
        };
      }
      return list;
    },
  },
};
</script>

<style lang="scss" scoped>
.diy-dialog-body {
  width: 100%;
}
</style>
