<template>
    <div id="governmentOffice">

       <TopBanner />

        <div class="content">

             <NavLeft />

            <!--<div class="box mytask">-->
                <!--<div class="sub-title">-->
                    <!--<span>我的任务</span>-->
                    <!--<router-link class="btn-back" to="/government-home">&lt;&nbsp;返回</router-link>-->
                <!--</div>-->
                <!--<div class="mytask-list">-->
                    <!--<div class="item" v-for="item,i in taskList">-->
                        <!--<router-link :to="{path:'/iframe?name=我的任务&url='+item.LINK}">-->
                            <!--<div class="titlebox">-->
                                <!--<div>-->
                                    <!--<img v-if="i==0" src="./img/icon-疫情防控.png" width="28">-->
                                    <!--<img v-else-if="i==1" src="./img/icon-乡村振兴.png" width="28">-->
                                    <!--<img v-else-if="i==2" src="./img/icon-营商环境.png" width="28">-->
                                    <!--<img v-else src="./img/icon-营商环境.png" width="28">-->
                                <!--</div>-->
                                <!--<div class="text1">{{item.ZDRW}}</div>-->
                            <!--</div>-->
                        <!--</router-link>-->
                        <!--<div>-->
                            <!--<div><span class="count">{{item.ONESUMMARY.split(' ')[0]}}</span><small>{{item.ONESUMMARY.split(' ')[1]}}</small></div>-->
                            <!--<div class="text2">{{item.TOPICNAME}}</div>-->
                        <!--</div>-->
                        <!--<div v-if="item.ZDRW!='营商环境市场活力'">-->
                            <!--<div><span class="count">{{item.TWOSUMMARY}}</span></div>-->
                            <!--<div class="text2">{{item.TWONAME}}</div>-->
                        <!--</div>-->
                        <!--<div v-else>-->
                            <!--<el-progress type="circle" :percentage="75" stroke-linecap="square" :stroke-width="10" :width="70"></el-progress>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->

            <div class="box">
                <div class="sub-title">
                    <span>我的任务</span>
                    <router-link class="btn-back" to="/government-home">&lt;&nbsp;返回</router-link>
                </div>

                <MyTask />

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
import MyTask from "../components/MyTask.vue";
import Footer from "../components/Footer.vue";
import { getAssetsList } from '@api/assetsCard.js'
export default {
    data(){
        return {

        }
    },
    mounted(){

    },
    components:{NavLeft,NavRight,TopBanner,MyTask,Footer},
    methods:{

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
