<template>
     <aside class="right">
         <div class="right-inner" v-show="isShow">
             <div class="nav-level1">重大任务</div>
             <div class="right-content-scroll">
               <ul>
                 <!-- <li v-for="item,i in bigTaskList" :key="i"> -->
                   <!--<router-link :to="{path:'/iframe?name='+item.ZDRW+'&url='+item.YYRKDZ}">-->
                   <!--<img :src="`/static/images/big-task/icon_${item.ZDRW}.png`" width="24">{{ item.ZDRW }}-->
                   <!--</router-link>-->
                   <!-- <router-link :to="`/zdrwApplicationList?name=${item.NAME}&recid=${item.RECID}`">
                     <img :src="`/static/images/big-task/icon_${item.NAME}.png`" width="24">{{ item.NAME }}
                   </router-link> -->
                   <li v-for="item,ind in filterList" :key="ind">
                    <a v-if="item.list.length>0"  class="nav-level2" @click="nav3IsShowClick(item)">
                      <img :src="`/static/images/big-task/icon_${item.navLevel2Name}.png`" width="30">{{item.navLevel2Name}}
                      <i class="arrow" :class="item.navLevel3Show?'up':'down'"></i>
                    </a>
                    <router-link v-if="item.list.length==0" class="nav-level2" :to="`/zdrwApplicationList?name=${item.navLevel2Name}&recid=${item.RECID}`">
                      <img :src="`/static/images/big-task/icon_${item.navLevel2Name}.png`" width="30">{{item.navLevel2Name}}
                    </router-link>
                    <div v-show="item.navLevel3Show">
                      <div class="nav-level3" v-for="it in item.list" :key="it.RECID">
                        <router-link :to="`/zdrwApplicationList?name=${it.navLevel3Name}&recid=${it.RECID}`">
                          {{ it.navLevel3Name }}
                        </router-link>
                      </div>
                    </div>
                 </li>
               </ul>
             </div>
         </div>
        <span class="arrow-right" :class="{open:isShow?true:false}" @click="isShow = !isShow"></span>
    </aside>
</template>
<style lang="less" scoped>
    @import "less/navright.less";
</style>
<script>
import { getAssetsList } from '@api/assetsCard.js'
export default {
  data(){
    return {
        bigTaskList:[],
        isShow:true,
        filterList: []
    }
  },
  mounted(){
    this.getBigTaskList()
  },
    methods:{
        nav3IsShowClick(item){
            item.navLevel3Show = !item.navLevel3Show
        },
        getBigTaskList(){
           getAssetsList({ filterobj: {YYFL0: '829307884281008128'},formobj: "831091091481563140",pageobj: {curPage: 1, pageSize: 20,total: 0}}).then((res) => {
              //  console.log(res,'重大任务res')
               if(res.data.data && res.data.data.rows.length) {
                    this.bigTaskList = res.data.data.rows;
                    //父节点
                    this.bigTaskList.forEach((item)=> {
                      let navLevel3List = [];
                      if (item.PARENTID == '') {
                        //子节点
                        this.bigTaskList.forEach((itemch) => {
                          if (itemch.PARENTID == item.RECID) {
                            navLevel3List.push({navLevel3Name: itemch.NAME,RECID:itemch.RECID});
                          }
                        });
                        this.filterList.push({
                          navLevel3Show: true,
                          navLevel2Name: item.NAME,
                          RECID:item.RECID,
                          list: navLevel3List
                        })
                      }
                    });
                }
            });
        },

    }
}
</script>
