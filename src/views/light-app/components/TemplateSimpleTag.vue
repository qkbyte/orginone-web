<template>
    <div class="simpleTag" @click="goToDesign(info.id)">

        <div class="simpleImg">
            <img style="width: 34px;height: 34px;" src="@assets/store/app-icon-1.png"/>
        </div>
        <div class="simpleBody">
            <div style="font-weight: bold;font-size: 1.2rem">{{info.formName}}</div>
            <div style="margin-top: 5px;">{{info.descirp}}</div>
        </div>


    </div>
</template>

<script>
    export default {
        name: "TemplateSimpleTag",
        methods:{
            goToDesign(){
                this.$emit("goToDesign");
            }
        },
        props:{
            info:{
                type: Object,
                default: () => {
                    return{
                        formName:"模板名称",
                        descirp:"模板描述模板描述"
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.simpleTag{
    width: 100%;
    height: 78px;
    padding: 20px 20px 16px;
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    border: 1px solid rgba(235, 238, 245, 1);
    border-radius: 4px;
    cursor: pointer;
    background-color: #F5F6FC;
    .simpleImg{
        width: 20%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .simpleBody{
        width: 60%;
    }
}
</style>