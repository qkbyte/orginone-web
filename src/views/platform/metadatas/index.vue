<template>
  <div class="main">
    <div class="main--left box" style="margin-right:4px">
      <DiyBoxLayout class="flex-column" style="padding-top:20px;">
        <DiyList
          ref="list"
          listTitle="类型列表"
          :listData="metadataList"
          :targetUser="targetUser"
          :selected="selected"
          @handleFilter="handleFilter"
        >
        </DiyList>
      </DiyBoxLayout>
    </div>
    <div class="main--right box right-FBL">
      <DiyBoxLayout class="main--right box" style="padding-top:5px">
        <TheDataTable :filterValue="filterValue"></TheDataTable>
      </DiyBoxLayout>
    </div>
  </div>
</template>

<script>
import TheDataTable from "./components/TheDataTable";
import DiyTitle from "@components/DiyTitle/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import DiyList from "./components/TheSearchList";
import { getDictItemObject, getMetaItemList } from "@utils/index";
export default {
  data() {
    let _this = this;
    return {
      metadataList: [
        { key: "资产", value: "zc_card" },
        { key: "单位", value: "as_unit" },
        { key: "人员", value: "as_person" },
        { key: "应用", value: "as_market_app" },
        { key: "共享", value: "as_share_reserve" },
      ],
      filterValue: "",
      targetUser:[],
      selected:"",
    };
  },
  components: {
    TheDataTable,
    DiyBoxLayout,
    DiyTitle,
    DiyList,
  },
  created() {
    // this.filterValue = this.metadataList[0].value;
  },
  mounted() {
    this.$nextTick(async ()=>{
      this.targetUser = await getMetaItemList(this.dict.TABLE_NAME);
      this.selected = this.filterValue = this.targetUser[0].value
    })
  },
  computed: {},
  methods: {
    handleFilter(val) {
      this.filterValue = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  display: flex;

  .box {
    display: flex;
    flex-direction: column;
  }
  .main-left-tree {
    display: flex;
    flex-direction: column;
  }
  &--right {
    flex: 1;
    height: 100%;
  }
}
.right-FBL{
   @media screen and (max-width: 1280px) {
     width: 800px;
   }
}
</style>
