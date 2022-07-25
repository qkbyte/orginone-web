<template>
    <div>
        <el-input
                placeholder="申请人"
                v-model="proposer"
                :disabled="true">
        </el-input>
        <el-input
                placeholder="申请类型"
                v-model="applicationType"
                :disabled="true">
        </el-input>
        <el-input
                placeholder="申请来源"
                v-model="applicationSource"
                :disabled="true">
        </el-input>
        <el-input
                placeholder="申请数据"
                v-model="applicationData"
                :disabled="true">
        </el-input>
        <el-input
                placeholder="申请路由"
                v-model="applicationRoute"
                :disabled="true">
        </el-input>
        <el-button @click="goToDemoForm">跳转到表单demo</el-button>
    </div>
</template>

<script>
    export default {
       data(){
           return{
               //申请人
               proposer:'pzk',
               //申请类型
               applicationType:'test',
               //申请来源
               applicationSource:'demo',
               //申请数据
               applicationData:'46515',
               //申请路由
               applicationRoute:'/light-app/demo_pro',
           }
       },
        methods:{
           goToDemoForm(){
               this.$router.push({
                   path: "/light-app/demo_form",
                   query:{
                       //申请人
                       proposer:this.proposer,
                       //申请类型
                       applicationType:this.applicationType,
                       //申请来源
                       applicationSource:this.applicationSource,
                       //申请数据
                       applicationData:this.applicationData,
                       //申请路由
                       applicationRoute:this.applicationRoute,
                   }
               });
           }
        }
    }
</script>

<style scoped>

</style>