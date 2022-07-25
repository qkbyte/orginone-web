<template>
    <div class="ViewChart">
        <!-- 指标 -->
        <div class="chart_target" v-if="chartType == '101'">
            <span class="target_count">{{ chartDataObj.数据 }}</span>
            <div class="target_text2">{{ chartDataObj.标签 }}</div>
        </div>
        <!-- 表格 -->
        <div class="chart_table" v-if="chartType == '102' || chartType == '105'">
            <el-table
            border
            size="mini"
            :data="[chartDataObj]"
            height="100%"
            >
            <el-table-column
                prop="标签"
                label="标签"
                min-width="80">
            </el-table-column>
            <el-table-column
                prop="数据"
                label="数据"
                min-width="80">
            </el-table-column>
            </el-table>
        </div>
        <!-- 环形图 -->
        <div class="chart_annular" v-if="chartType == '103'">
            <el-progress
            type="circle"
            :percentage="75"
            stroke-linecap="square"
            :stroke-width="10"
            :width="70"
            ></el-progress>
        </div>
        <!-- 饼图 -->
        <div class="chart_pie" v-if="chartType == '104'">
            <div id="pieChart" style="width: 100%;height: 100%;"></div>
        </div>
        <!-- 列表 -->
        <div class="chart_list" v-if="chartType == '105'">

        </div>
        <!-- 曲线图 -->
        <div class="chart_curve" v-if="chartType == '106'">
            <div id="curveChart" style="width: 100%;height: 100%;"></div>
        </div>
        <!-- 柱状图 -->
        <div class="chart_columnar" v-if="chartType == '107'">
            <div id="columnarChart" style="width: 100%;height: 100%;"></div>
        </div>
        <!-- 进度条 -->
        <div class="chart_speed" v-if="chartType == '108'">
            <el-progress :text-inside="true" :stroke-width="26" :percentage="70"></el-progress>
        </div>
    </div>
</template>
<script>
export default {
    name: 'ViewChart',
    props: {
        chartData: {
            type: String,
            default: () => {
                return ''
            }
        },
        titleData: {
            type: String,
            default: () => {
                return ''
            }
        },
        chartType: {
            type: String,
            default: () => {
                return ''
            }
        }
    },
    data() {
        return{
            chartDataObj: {},
            chartDataArr: []
        }
    },
    created() {
        this.chartDataObj = JSON.parse(this.chartData)
    },
    mounted() {
        this.chartPie(this.chartDataObj)
        this.chartCurve()
        this.chartColumnar()
    },
    methods:{
        chartPie(chartdata) {
            var myChart = this.$echarts.init(document.getElementById("pieChart"));
            let option;
            option = {
                title: {
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    show: false
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '50%',
                        data: [
                            {value: parseFloat(chartdata.数据), name: chartdata.标签},
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            myChart.setOption(option);
            window.addEventListener("resize", function() {
                myChart.resize();
            });
        },
        chartCurve() {
            var myChart = this.$echarts.init(document.getElementById("curveChart"));
            let option;
            option = {
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: [150, 230, 224, 218, 135, 147, 260],
                    type: 'line'
                }]
            };
            myChart.setOption(option);
            window.addEventListener("resize", function() {
                myChart.resize();
            });
        },
        chartColumnar() {
            var myChart = this.$echarts.init(document.getElementById("columnarChart"));
            let option;
            option = {
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: [120, 200, 150, 80, 70, 110, 130],
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    }
                }]
            };
            myChart.setOption(option);
            window.addEventListener("resize", function() {
                myChart.resize();
            });
        }
    }
}
</script>
<style lang="less" scoped>
.ViewChart{
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .chart_target{
        flex: 1;
        height: 80%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .target_count{
            font-size: 24px;
            font-weight: bold;
            color: #1d96ff;
            font-family: DinAlternate;
        }
    }
    .chart_table,.chart_pie,.chart_annular,.chart_curve,.chart_columnar,.chart_speed{
        height: 100%;
        flex: 1;
    }
}
</style>