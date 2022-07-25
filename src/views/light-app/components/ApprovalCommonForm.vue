<template>
    <div class="commonForm">
        <div class="commonForm__title">
             <span style="font-size: 18px;font-weigh:800;color: #303133;font-weight: bold;">常用功能</span>
        </div>

        <div class="commonForm__list">
            <template v-for="item in list" >
                <div :key="item.id" class="commonForm__list__item" @click="goToItem(item.id)">
                    <img v-if="item.iconCls" style="height: 40px;width:40px"
                          :src="require(`@assets/approval/${item.iconCls}.png`)"/>
                    <img v-else style="height: 40px;width:40px"
                         :src="require(`@assets/approval/app-icon-1.png`)"/>
                    <div style="font-size:12px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(144,147,153,1);line-height:17px;margin-top: 4px">

                        <el-tooltip
                                effect="dark"
                                :content="item.formName"
                                placement="top-start"
                        >
                        <span>
                          {{ item.formName | omitName }}
                        </span>
                        </el-tooltip>
                    </div>

                </div>
            </template>

        </div>
    </div>
</template>

<script>
    import {post2} from "@api/flow";
    import {mapGetters} from "vuex";
    export default {
        name: "ApprovalCommonForm",
        data(){
            return{
                list:[]
            }
        },
        filters: {

            omitName(info) {
                let temp = info + '';

                if (temp.length > 6)   return temp.substring(0, 6) + "...";
                return info;
            },
        },
        created() {
            this.getInfo();
        },
        computed: {
            ...mapGetters("tenant", ["curTenantCode"]),
        },
        methods:{
            goToItem(id){
              this.$emit('goToItem',id);
            },
            getInfo(){
                let params = {
                    tenantCode:this.curTenantCode,
                    flag: 1
                };
                post2('/dev-api/asset-form/get/all/used',params).then(res=>{
                    this.list=res.data.data;
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .commonForm{
        overflow: auto;
        width: 100px;
        height: calc(100vh - 20px);
        /*height: 1032px;*/
        padding: 20px 0;
        margin-left: 4px;
        background: #fff;
        &__title{
            width: 100%;
            text-align: center;
        }
        &__list{
            width: 100%;
            text-align: center;
            margin-top: 10px;
            &__item{
                margin-top: 10px;
                cursor: pointer;
            }
        }
    }
</style>