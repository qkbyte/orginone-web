<template>
    <el-dialog
            center
            top="8vh"
            width="400px"
            class="diy-dialog"
            :visible.sync="dialogShow.value"
            :close-on-click-modal="false"
    >
        <div style="margin-top: 1rem">
            <span style="color: #909399">当前图标:</span>

            <div v-if="value != ''" style="display: inline-block;margin-left: 1rem">
                <img
                        style="width: 34px;height: 34px;"
                        :src="require(`@assets/approval/${value}.png`)"
                />
            </div>
        </div>

        <div style="margin-top: 1rem">
            <div style="font-size: 1.2rem">可选图标列表</div>

            <div style="margin-top: 1rem">
                <div
                        v-for="(item, key) in list"
                        :key="key"
                        style="display: inline-block;margin-left: 10px;width: 30%;margin-top: 1rem"
                >
                    <el-button @click="chooseIcon(item)">
                        <img
                                style="width: 34px;height: 34px;"
                                :src="require(`@assets/approval/${item}.png`)"
                        />
                    </el-button>
                </div>
            </div>

            <div style="margin-top: 2rem">
                <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        v-bind="page"
                        :pager-count="5"
                        style="text-align:right;margin-top:10px;"
                ></el-pagination>

            </div>
        </div>

        <span slot="footer" class="diy-dialog-footer">
      <el-button @click="chooseIcon('')">设置为空</el-button>
    </span>
    </el-dialog>
</template>

<script>
    export default {
        name: "ApprovalIcon",
        props: {
            dialogShow: {
                type: Object,
                default: () => {
                },
            },
            value: {
                type: Array,
                default: () => [],
            },
        },
        data() {
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
                    "star_1",
                    "star_2",
                    "registration-1",
                    "registration-2",
                    "registration-3",
                    "write-off-1",
                ],


                iconList: [
                    ["app-icon-1",
                        "app-icon-2",
                        "app-icon-3",
                        "star_1",
                        "star_2",
                        "registration-1",
                        "registration-2",
                        "registration-3",
                        "write-off-1",],
                    ["assets-1",
                        "assets-2",
                        "assets-3",
                        "assets-4",
                        "assets-5",
                        "assets-6",
                        "assets-7",
                        "assets-8",
                        "assets-9",],
                    [ "type-1",
                        "type-2",
                        "type-3",
                        "type-4",
                        "type-5",
                        "type-6",
                        "home-1",
                        "home-2",
                        "home-3",
                    ],
                    [
                        "home-4",
                        "resource-1",
                        "resource-2",
                        "resource-3",
                        "resource-4",
                        "resource-5",
                        "resource-6",
                        "resource-7",
                        "resource-8",
                    ],[
                        "resource-9",
                            "resource-10",
                            "resource-11",
                            "resource-12",
                            "resource-13",
                            "resource-14",
                            "resource-15",
                    ]
                ],
                page: {
                    total: 47, // 总条数
                    currentPage: 1, // 当前页
                    pageSize: 10, // 每页条数
                    // pageSizes: [10, 20, 50, 70, 100], // 分页数量列表
                    layout: " prev, pager, next"
                },
            };
        },
        methods: {
            chooseIcon(icon) {
                this.$emit("setIcon", icon);
            },
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.page.currentPage = 1;
            },
            handleCurrentChange(val) {
                this.page.currentPage = val;
                this.list=this.iconList[val-1];

            },
        },
    };
</script>

<style scoped></style>
