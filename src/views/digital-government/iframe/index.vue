<template>
    <div id="governmentHome">
       
       <TopBanner />

        <div class="content">
           <NavLeft />

            <div class="middle">
              <div class="sub-title">
                <span>{{name}}</span>
                <router-link class="btn-back" to="/government-home">&lt;&nbsp;返回</router-link>
              </div>
              <div class="iframe-wrap">
                <iframe :src="url" frameborder="no" width="100%" height="100%"></iframe>
              </div>
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
import Footer from "../components/Footer.vue";
// import { getAssetsList } from '@api/assetsCard.js'
export default {
    data(){
        return {
          url:this.$route.query.url,
          name:this.$route.query.name
        }
    },
    mounted(){

    },
    components:{NavLeft,NavRight,TopBanner,Footer},
    methods:{

    }
}
</script>
<style lang="less" scoped>
.content{
  display: flex;
  align-items: flex-start;
  margin-top: 15px;
  .middle{
    flex:1;
    margin: 0 20px;
    .sub-title{
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size:18px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      background: #DAEBFC;
      border-radius: 2px 2px 0px 0px;
      color: #1D96FF;
      padding: 20px;
      .btn-back{
        font-size: 14px;
        font-weight: 400;
        color: #1D96FF;
        font-family: PingFangSC-Regular, PingFang SC;
      }
    }
    .iframe-wrap{
      width: 100%;
      height: 898px;
    }
  }
}
</style>
<style lang="less">
html, body, #app {
  height: auto!important;
}
</style>

