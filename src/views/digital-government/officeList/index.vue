<template>
    <div id="governmentOffice">

       <TopBanner />

        <div class="content">

             <NavLeft />

            <div class="box myoffice">
                <div class="sub-title">
                  我的办公
                  <router-link class="btn-back" to="/government-home">&lt;&nbsp;返回</router-link>
                </div>

                <MyOffice />

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
import MyOffice from "../components/MyOffice.vue";
import Footer from "../components/Footer.vue";
import { getAssetsList } from '@api/assetsCard.js'
export default {
    data(){
        return {
            officeList:[],
        }
    },
    mounted(){

    },
    components:{NavLeft,NavRight,TopBanner,MyOffice,Footer},
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
    #governmentOffice{
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
