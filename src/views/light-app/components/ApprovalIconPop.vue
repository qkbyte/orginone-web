<template>
    <el-popover

            width="267"
            trigger="hover"
            height="139"
    >


        <div style="margin-top: 1rem">
            <!--            <div style="font-size: 1.2rem">可选图标列表</div>-->

            <div style="margin-top: 1rem">
                <!--                <div-->
                <!--                        v-for="(item, key) in list"-->
                <!--                        :key="key"-->
                <!--                        style="display: inline-block;margin-left: 10px;width: 30%;margin-top: 1rem"-->
                <!--                >-->

                <!--                    <el-button @click="chooseIcon(item)">-->
                <!--                        <img-->
                <!--                                style="width: 34px;height: 34px;"-->
                <!--                                :src="require(`@assets/approval/${item}.png`)"-->
                <!--                        />-->
                <!--                    </el-button>-->


                <!--                </div>-->

                <div style="cursor: pointer;padding: 8px;display: inline-block;" @click="showInconAdd">
                    <img
                            style="width: 24px;height: 24px;"
                            :src="require(`@assets/approval/others/app_user-add.png`)"
                    />
                </div>
                <template v-for="(item,index) in list">
                    <div v-if="choosed==item" @click="chooseIcon(item)" :key="index"
                         style="cursor: pointer;padding: 8px 0px 8px 8px;display: inline-block;">
                        <img
                                style="width: 24px;height: 24px;"
                                :src="require(`@assets/approval/${item}.png`)"
                        />
                        <img
                                v-if="choosed==item"
                                style="width: 8px;height: 8px;position: relative;left: -8px;top: 8px;"
                                :src="require(`@assets/approval/others/app_confirm.png`)"
                        />


                    </div>
                    <div v-else @click="chooseIcon(item)" :key="index"
                         style="cursor: pointer;padding: 8px;display: inline-block;">
                        <img
                                style="width: 24px;height: 24px;"
                                :src="require(`@assets/approval/${item}.png`)"
                        />
                        <img
                                v-if="choosed==item"
                                style="width: 8px;height: 8px;position: relative;left: -8px;top: 8px;"
                                :src="require(`@assets/approval/others/app_confirm.png`)"
                        />


                    </div>

                </template>


            </div>

            <div style="text-align: center;">
                <template v-for="(index) in iconList.length">
                    <div :key="index" style="cursor: pointer;padding: 8px;display: inline-block;"
                         @click="changeShow(index)">
                        <img
                                v-if="index==page"
                                style="width: 5px;height: 5px;"
                                :src="require(`@assets/approval/others/app_doit.png`)"
                        />
                        <img
                                v-else
                                style="width: 5px;height: 5px;"
                                :src="require(`@assets/approval/others/app_doit1.png`)"
                        />
                    </div>

                </template>

            </div>
        </div>




        <div slot="reference">
            <slot name="refContent">

            </slot>
        </div>
    </el-popover>
</template>

<script>
    import ApprovalIconPopAdd from "./ApprovalIconPopAdd";

    export default {
        name: "ApprovalIconPop",
        props: {
            choosed: {
                type: String,
                default: () => []
            },
        },
        data: function () {
            return {
                // list: ["app-icon-1",
                //     "app-icon-2",
                //     "app-icon-3",
                //     "star_1",
                //     "star_2",
                //     "registration-1",
                //     "registration-2",
                //     "registration-3",
                //     "write-off-1",
                //     "assets-1",
                //     "assets-2",
                //     "assets-3",
                //     "assets-4",
                //     "assets-5",
                //     "assets-6",
                //     "assets-7",
                //     "assets-8",
                //     "assets-9",
                //     "type-1",
                //     "type-2",
                //     "type-3",
                //     "type-4",
                //     "type-5",
                //     "type-6",
                //     "home-1",
                //     "home-2",
                //     "home-3",
                //     "home-4",
                //     "resource-1",
                //     "resource-2",
                //     "resource-3",
                //     "resource-4",
                //     "resource-5",
                //     "resource-6",
                //     "resource-7",
                //     "resource-8",
                //     "resource-9",
                //     "resource-10",
                //     "resource-11",
                //     "resource-12",
                //     "resource-13",
                //     "resource-14",
                //     "resource-15",
                // ],


                list: [
                    "app-icon-1",
                    "app-icon-2",
                    "app-icon-3",
                    "resource-1",
                    "resource-2",
                    "resource-3",
                    "resource-4",
                    "resource-5",
                    "resource-6",
                    "resource-7",
                    "resource-8",
                    "resource-9",
                    "resource-10",
                    "resource-11",
                    "resource-12",
                    "resource-13",
                    "resource-14",
                ],

                //17
                iconList: [
                    [
                        "app-icon-1",
                        "app-icon-2",
                        "app-icon-3",
                        "resource-1",
                        "resource-2",
                        "resource-3",
                        "resource-4",
                        "resource-5",
                        "resource-6",
                        "resource-7",
                        "resource-8",
                        "resource-9",
                        "resource-10",
                        "resource-11",
                        "resource-12",
                        "resource-13",
                        "resource-14",

                    ],
                    [
                        "resource-15",
                    ]
                ],
                // page: {
                //     total: 47, // 总条数
                //     currentPage: 1, // 当前页
                //     pageSize: 10, // 每页条数
                //     pageSizes: [10, 20, 50, 70, 100], // 分页数量列表
                //     layout: " prev, pager, next"
                // },
                page: 1,
                dialogVisible: {value: false},
            };
        },
        methods: {
            chooseIcon(icon) {
                this.choosed = icon;
                this.$emit("setIcon", icon);
            },


            showInconAdd(){
                // console.log("dasda");

                this.$emit("setIconAdd");
            },

            // handleSizeChange(val) {
            //     this.page.pageSize = val;
            //     this.page.currentPage = 1;
            // },
            // handleCurrentChange(val) {
            //     this.page.currentPage = val;
            //     this.list=this.iconList[val-1];
            //
            // },
            changeShow(index) {
                console.log(index);
                this.list = this.iconList[index - 1];
                this.page = index;
                console.log(index);
            }
        },
        components: {
            ApprovalIconPopAdd
        },
    }


</script>

<style scoped>

</style>