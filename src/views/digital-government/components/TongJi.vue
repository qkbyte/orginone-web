<template>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="JCFS" label="集成方式" width="180"></el-table-column>
        <el-table-column prop="ZD1" label="个数" width="180"></el-table-column>
    </el-table>
</template>
<script>
    export default{
        data(){
            return {
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }]
            }
        },
        methods:{

        }
    }
</script>