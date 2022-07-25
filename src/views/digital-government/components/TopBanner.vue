<template>
     <div class="top-box">
        <!-- <div class="top">
                <TheTopBarSelect class="top-select"></TheTopBarSelect>
                <div class="top-right">
                    <span class="today-date">2021年3月31日 星期三</span>
                <TheCenterSelect></TheCenterSelect>
                <span class="icon-config"><img src="./img/icon_设置备份.png"></span>
                </div>
        </div> -->

        <div class="logo2"><img src="./img/logo2.png" width="200"></div>
        <div class="search">
            <div class="input-wrap">
                <div class="select-box">
                    <!--<span class="select-text">全部</span>-->
                    <el-select v-model="value" placeholder="请选择" size="40" popper-class="select-unit">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <!--<span class="select-arrow"><img src="./img/downarrow-o.png"></span>-->
                </div>
                <input type="text" placeholder="请输入内容搜索"/>
            </div>
            <div class="btn-search">搜索</div>
        </div>

    </div>
</template>
<script>
// import TheTopBarSelect from "@components/DiyTopBar/TheTopBarSelect.vue";
// import TheCenterSelect from "@components/DiyTopBar/TheCenterSelect.vue";
import { getPurchaseAppGroupList } from '@api/assetsCard.js'
export default {
    data(){
        return {
            options: [
                {
                    value: '选项0',
                    label: '全部'
                },
                {
                    value: '选项1',
                    label: '浙江元翼科技有限公司'
                }, {
                    value: '选项2',
                    label: '1029测试单位00112'
                }
            ],
            value: ''
        }
    },
    mounted(){
        //this.getData()
    },
    methods:{
        getData(){
            let data = {
                appId: 1379639071488319490,
                current: 1,
                size: 30
            }
            getPurchaseAppGroupList(data).then((res) => {consoe.log(res,'res topbanner')
                if(res.data.data && res.data.data.rows.length) {
                    let res = res.data.data.rows;
                    this.options = res.map((item,i)=>{
                        return {
                            value:i,
                            label:item.unitName
                        }
                    })
                }
            })
        }
    }
}
</script>
<style>
    /*uielement select样式覆盖*/
    .top-box .el-input__inner{
        background: none!important;
        border:0;
        color:#fff;
        padding: 0;
        font-size: 16px;
    }
    .top-box .el-input__inner::-webkit-input-placeholder{
        color: #FFFFFF!important;
        font-size: 16px;
    }
    .top-box .el-select .el-input .el-select__caret{
        color:#fff;
    }
</style>
<style lang="less" scoped>
.top-box{
    height: 267px;
    background: url(./img/banner.png) no-repeat top center;
    background-size:100% 267px;
    .top{
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff;

        .top-right{
            .today-date{
                display:inline-block;
                font-weight: 400;
                color: #434343;
                line-height: 25px;
                padding-right: 15px;
                margin-right: 15px;
                font-size: 18px;
                border: 1px solid rgba(255,255,255,.5);
            }
            .icon-config{
                padding-left: 40px;
                padding-right: 20px;
            }
        }
    }
    .logo2{
        text-align: center;
        padding-top:27px;
    }
    .search{
        display: flex;
        margin:25px auto 0;
        width: 671px;
        height: 54px;
        background: rgba(255, 255, 255, 0.39);
        border-radius: 4px;
        .input-wrap{
            position: relative;
            flex:1;
            display: flex;
            align-items: center;
            .select-box{
                display: flex;
                align-items: center;
                width: 90px;
                margin-left: 25px;
                padding-right: 8px;
                margin-right: 18px;
                border-right:1px solid #fff;
                .select-text{
                    color: #FFFFFF;
                    font-size: 16px;
                }
            }
            input[type=text]{
                flex:1;
                border: 0;
                background: none;
                line-height: 1;
                margin-top: 3px;
                color:#fff;
                &::-webkit-input-placeholder{
                    font-weight: 400;
                    font-size: 18px;
                    color:rgba(255,255,255,.69);
                }

            }
        }
        .btn-search{
            width: 136px;
            height: 54px;
            line-height: 54px;
            text-align: center;
            font-size: 18px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #FFFFFF;
            background: #1D96FF;
            border-radius: 0px 4px 4px 0;
            cursor: pointer;

        }
    }
}
</style>
