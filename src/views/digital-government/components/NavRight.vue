<template>
    <aside class="right">
        <div class="right-inner" v-show="isShow">
            <div class="nav-level1">主要领域</div>
            <div class="right-content-scroll">
                <ul>
                  <li v-for="item,i in filterList" :key="i">
                    <a v-if="item.list.length>0"  class="nav-level2" @click="nav3IsShowClick(item)">
                      <img :src="`/static/images/big-task/icon_${item.navLevel2Name}.png`" width="30">{{item.navLevel2Name}}
                      <i class="arrow" :class="item.navLevel3Show?'up':'down'"></i>
                    </a>
                    <router-link v-if="item.list.length==0" class="nav-level2" :to="`/zylyApplicationList?name=${item.navLevel2Name}&recid=${item.RECID}`">
                      <img :src="`/static/images/big-task/icon_${item.navLevel2Name}.png`" width="30">{{item.navLevel2Name}}
                    </router-link>
                    <div v-show="item.navLevel3Show">
                      <div class="nav-level3" v-for="it,ind in item.list":key="ind">
                        <router-link :to="`/zylyApplicationList?name=${it.navLevel3Name}&recid=${it.RECID}`">
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
<script>
import { getAssetsList } from '@api/assetsCard.js'
export default {
    data(){
        return {
            mainAreasList:[],
            filterList:[],
            isShow:true
        }
    },
    mounted(){
        this.getMainAreasList();
    },
    methods:{
        nav3IsShowClick(item){
            item.navLevel3Show = !item.navLevel3Show
        },
        getMainAreasList(){
            getAssetsList({ filterobj: {YYLYID0: '829307884281008128'},formobj: "831091136121540608",pageobj: {curPage: 1, pageSize: 20}}).then((res) => {
                console.log(res,'主要领域res')
                if(res.data.data && res.data.data.rows.length) {
                    this.mainAreasList = res.data.data.rows;

                    //父节点
                    this.mainAreasList.forEach((item)=> {
                      let navLevel3List = [];
                      if (item.PARENTID == '') {
                        //子节点
                        this.mainAreasList.forEach((itemch) => {
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

                  console.log(this.filterList,'this.filterList==')
                }
            });
        },
    }
}
</script>
<style lang="less" scoped>
    @import "less/navright.less";
</style>
