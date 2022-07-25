<template>
    <div id="governmentOffice">

       <TopBanner />

        <div class="content">

             <NavLeft />

             <div class="box hexin">
                <div class="sub-title">
                    <span>核心指标</span>
                    <router-link class="btn-back" to="/government-home">&lt;&nbsp;返回</router-link>
                </div>

                 <HeXin />

                <!--<div class="hexin-list">-->
                    <!--<div class="item" v-for="item,i in hxList" :key="i">-->
                        <!--<i class="cornor" :class="i==0?'color1':i==1?'color2':'color3'">{{item.ZDRW}}</i>-->
                        <!--<router-link :to="{path:'/iframe?name=核心指标&url='+item.ZBURL}">-->
                            <!--<div class="text1">{{item.NAME}}</div>-->
                        <!--</router-link>-->
                        <!--<el-progress color="#1D96FF" :percentage="Number(item.RATE)"></el-progress>-->
                        <!--<div class="text2">{{item.COMPLETE}}</div>-->
                    <!--</div>-->
                <!--</div>-->
            </div>

            <NavRight />

        </div>

         <Footer />

    </div>
</template>
<script>
import TopBanner from "../components/TopBanner.vue";
import NavLeft from "../components/NavLeft.vue";
import NavRight from "../components/NavRight.vue";
import HeXin from "../components/HeXin.vue";
import Footer from "../components/Footer.vue";
import { getAssetsList } from '@api/assetsCard.js'
export default {
    data(){
        return {

        }
    },
    mounted(){

    },
    components:{NavLeft,NavRight,TopBanner,HeXin,Footer},
    methods:{
       getHxList(){
            let data = {
                filterobj: {PERPORTY0:""},
                formobj: "829768853859864577",
                pageobj: {curPage: 1, pageSize: 20}
             }
            getAssetsList(data).then((res) => {
                if(res.data.data && res.data.data.rows.length) {
                    this.hxList = res.data.data.rows;
//                    this.hxList.forEach((item)=>{
//                        switch (item.ZDRW){
//                            case "830072848239300608":
//                                this.$set(item,'zbType','疫情防控')
//                                break;
//                            case "830072848327380992":
//                                this.$set(item,'zbType','科技创新')
//                                break;
//                            case "830072848365129728":
//                                this.$set(item,'zbType','产业发展')
//                                break;
//                        }
//                    })

                }
            })
       }
    }
}
</script>
<style lang="less" scoped>
    @import "index.less";
</style>
<style lang="less">
    html, body, #app {
        height: auto!important;
    }

</style>
