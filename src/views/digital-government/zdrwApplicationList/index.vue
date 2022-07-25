<template>
    <div id="zdrw">

        <TopBanner />

        <div class="content">

            <NavLeft />

            <div class="box">
                <div class="sub-title">
                    <span>{{name}}</span>
                    <router-link class="btn-back" to="/government-home">&lt;&nbsp;返回</router-link>
                </div>
                <ul>
                    <li v-for="item,i in applicationList" :key="i"  v-if="item.APPLYNAME">
                        <router-link :to="{path:'/iframe?name='+item.APPLYNAME+'&url='+item.YYRKDZ}">
<!--                          <img :src="`/static/images/big-task/icon_${item.ZYLY}.png`" width="24">-->
                          {{ item.APPLYNAME }}
                        </router-link>
                    </li>
                </ul>
            </div>

            <NavRight />

        </div>

        <Footer />
    </div>
</template>
<style lang="less" scoped>
    @import "index.less";
</style>
<script>
    import TopBanner from "../components/TopBanner.vue";
    import NavLeft from "../components/NavLeft.vue";
    import NavRight from "../components/NavRight.vue";
    import Footer from "../components/Footer.vue";
    import { getAssetsList } from '@api/assetsCard.js'
    export default {
        data(){
            return {
                name:this.$route.query.name,
                applicationList:[],
                isShow:true
            }
        },
        mounted(){
            this.getData()
        },
        components:{NavLeft,NavRight,TopBanner,Footer},
        methods:{
            getData(){
                getAssetsList({ filterobj: {ZDRW0:this.$route.query.recid},formobj: "829413246875209729",pageobj: {curPage: 1, pageSize: 20,total: 0}}).then((res) => {
                    if(res.data.data && res.data.data.rows.length) {
                        this.applicationList = res.data.data.rows;
                    }
                });
            },

        }
    }
</script>