<template>
    <div id="governmentHome">

       <TopBanner />

        <div class="content">
            <div class="left" style="width: 220px;">
                <NavLeft ref="asideLeft" />
            </div>
            <div class="middle">
                <!--我的任务-->
                    <div class="middle-top">
                        <div class="box mytask">
                        <div class="sub-title">
                            <span>我的任务<i><img class="ml8" src="./img/icon_设置.png"></i></span>
                            <router-link to="/myTask" class="more">更多&nbsp;<img src="./img/more.png"></router-link>
                        </div>

                        <MyTask ref="myTask" cls="home"/>

                    </div>

                    <!--我的办公-->
                    <div class="box myoffice">
                        <div class="sub-title">
                            我的办公
                            <router-link to="/myOffice" class="more">更多<img src="./img/more.png"></router-link>
                        </div>

                        <MyOffice/>

                    </div>
                </div>
                <div class="middle-bottom">
                    <!--风险气象台-->
                    <div class="box fxqxt">
                        <div class="sub-title">
                            风险气象台
                            <router-link class="more" to="/fxqxt">更多<img src="./img/more.png"></router-link>
                        </div>

                        <Fxqxt/>

                    </div>

                    <!--核心指标-->
                    <div class="box hexin">
                        <div class="sub-title">
                            <span>核心指标<img class="ml8" src="./img/icon_设置.png"></span>
                            <router-link class="more" to="/hxList">更多<img src="./img/more.png"></router-link>
                        </div>

                        <HeXin />

                    </div>
                </div>

                

            </div>
            <div class="right" style="width: 220px;">
                <NavRight ref="asideRight"/>
            </div>
        </div>

        <Footer />

    </div>
</template>

<script>
import TopBanner from "../components/TopBanner.vue";
import NavLeft from "../components/NavLeft.vue";
import NavRight from "../components/NavRight.vue";
import MyTask from "../components/MyTask.vue";
import MyOffice from "../components/MyOffice.vue";
import Fxqxt from "../components/Fxqxt.vue";
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
    components:{NavLeft,NavRight,TopBanner,MyTask,MyOffice,Fxqxt,HeXin,Footer},
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
    .box .mytask-list.home{
        .item{
            width: 100%;
        }
    }
    #governmentHome{
       /*elementUi样式覆盖*/
      .el-tabs--border-card{
          border: 0;
          box-shadow: none;
          margin:0;
      }
        .el-tabs--border-card > .el-tabs__header{
            border: 0;
            background: none;
        }
        .fxqxt .el-tabs--border-card > .el-tabs__header .el-tabs__item{
            margin-right: 12px;
        }
        .el-tabs--border-card > .el-tabs__header .el-tabs__item{
            background: #E6F3FF;
            font-size:16px;
            font-weight: 400;
            color: #333333;
            margin-right: 16px;
            padding:0 15px;
            height: 40px;
            line-height: 40px;
            text-align: center;
        }
        .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active{
            background: linear-gradient(90deg, #3EC7FF 0%, #1D96FF 100%);
            border-radius: 2px;
            color:#fff;
        }
        .el-tabs--border-card > .el-tabs__content{
            padding:9px 0 0;
        }
    }
</style>
