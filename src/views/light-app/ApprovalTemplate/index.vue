<template>
    <div style="width: 100%;height: 100%">
        <div class="formTemplate">
            <div class="templateHead">
                <div style="width: 70%">
                    <!--        <span style="font-size: 2rem;font-weigh:bold;color: #303133"-->
                    <!--        >业务模板列表</span>-->
                    <span style="font-size: 18px;font-weigh:800;color: #303133;font-weight: bold;"
                    >业务模板列表</span>
                </div>
                <div
                        style="text-align: right"
                >
                    <!--                 style="width: 25%;display: flex;flex-direction: row;justify-content: space-between"-->
                    <!--                <el-button type="text"-->
                    <!--                ><span style="color: #C0C4CC">删除</span></el-button-->
                    <!--                >-->
                    <!--                <el-button type="text"-->
                    <!--                ><span style="color: #C0C4CC">更换分组</span></el-button-->
                    <!--                >-->
                    <el-button
                            type="primary"
                            icon="el-icon-plus"
                            @click="goToAdd"
                            v-loading.fullscreen.lock="fullscreenLoading"
                    >新增模板
                    </el-button>
                </div>
            </div>

            <div class="templateIndex">
                <div class="templateIndex__type">
                    <div
                            v-for="item in tabItems"
                            :key="item.id"
                            style="position: relative;"
                    >
                        <div
                                class="templateIndex__type__item"
                                :class="
              item.isCur
                ? 'templateIndex__type__item--is-active'
                : 'templateIndex__type__item--is-noactive'
            "
                                @click="changeTab(item)"
                        >
                            {{ item.name }}
                        </div>
                    </div>
                </div>
                <div class="templateIndex__button">
                    <!--                <div style="line-height: 50px">-->
                    <!--                    <img src="@assets/store/type-6.png" class="c-img" alt/>-->
                    <!--                </div>-->
                    <!--                <el-button type="text" size="mini" style="font-size: 1rem"-->
                    <!--                >批量操作-->
                    <!--                </el-button-->
                    <!--                >-->
                </div>
            </div>

            <div class="templateContent">
                <div class="templateContent__line">
                    <div
                            v-for="(temp, key) in info"
                            class="templateContent__box"
                            :key="key"
                    >
                        <div class="templateContent__box__left">
                            <div
                                    style="height:50%;font-size: 1.5rem;color: #303133;display: flex;flex-direction: column;justify-content: center"
                            >
                                <div>
                                    <div style="display: inline-block;height: 100%;">

                                        <img v-if="temp.iconCls" style="height: 32px;"
                                             :src="require(`@assets/approval/${temp.iconCls}.png`)"/>
                                        <img v-else style="height: 32px;"
                                             :src="require(`@assets/approval/app-icon-1.png`)"/>
                                    </div>
                                    <div style="display: inline-block; margin-left: 10px">
                                        <el-tooltip
                                                effect="dark"
                                                :content="temp.formName"
                                                placement="top-start"
                                        >
                                            <span>{{ temp.formName | omitName(screenWidth) }}</span>
                                        </el-tooltip>

                                    </div>
                                </div>

                            </div>
                            <div
                                    style="height:50%;display: flex;flex-direction: column;justify-content: center"
                            >

                                <el-tooltip
                                        effect="dark"
                                        :content="temp.descirp"
                                        placement="top-start"
                                >
                <span>
                  {{ temp.descirp | omitDescrip }}
                </span>
                                </el-tooltip>
                            </div>
                        </div>

                        <div class="templateContent__box__right">
                            <div
                                    style="display: flex;justify-content: space-between;width: 50%;"
                            >
                                <el-button
                                        round
                                        style="font-size: 1rem;color: #154AD8; margin-right:16px;"
                                        size="mini"
                                        @click="userTemp(temp.id)"
                                >使用
                                </el-button
                                >
                                <el-popover placement="bottom" width="150" trigger="hover">
                                    <div class="diy-button" @click="goToEdit(temp.id)">编辑</div>
                                    <!--                                <div class="diy-button">重命名</div>-->
                                    <div class="diy-button" @click="showEditGroup(temp)">更换分组</div>
                                    <div v-if="temp.isPublic==1" class="diy-button" @click="setPublic(temp.id,0)">
                                        取消公共模板
                                    </div>
                                    <div v-else class="diy-button" @click="setPublic(temp.id,1)">设置公共模板</div>
                                    <div class="diy-button" @click="deleteByid(temp.id)" style="color: #F76C6F">删除</div>
                                    <div
                                            slot="reference"
                                            style="height:100%;display: flex;flex-direction: column; justify-content: center;"
                                    >
                                        <div
                                                style="height:65%;display: flex;flex-direction: column;justify-content: space-between"
                                        >
                                            <div
                                                    style="height: 3px;width: 3px;border-radius: 3px;background-color: #154AD8"
                                            ></div>
                                            <div
                                                    style="height: 3px;width: 3px;border-radius: 3px;background-color: #154AD8"
                                            ></div>
                                            <div
                                                    style="height: 3px;width: 3px;border-radius: 3px;background-color: #154AD8"
                                            ></div>
                                        </div>
                                    </div>
                                </el-popover>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <editGroup
                    v-if="showGroup.value"
                    :dialogShow="showGroup"
                    :chooseFormList="chooseFormList"
                    :isTemplate="1"
                    @closeDialog="handleCloseDialog"
                    @updataInfo="loadlistData"
            >

            </editGroup>

            <div class="footer-pagination">
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
    </div>
</template>

<script>
    import {getTemplateGroup, getTemplateInfoWithGroup, deleteTemplateById, post2} from "@api/flow";
    import {mapGetters, mapState} from "vuex";
    import editGroup from "../components/editGroup"
    import DiyTitle from "@components/DiyTitle/index";

    export default {
        name: "index",
        data() {
            return {
                tabItems: [],
                fullscreenLoading: false,
                page: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页
                    pageSize: 10, // 每页条数
                    pageSizes: [10, 20, 50, 70, 100], // 分页数量列表
                    layout: "total, prev, pager, next, sizes",
                },
                groupId: "",
                info: [],
                showGroup: {
                    key: "group",
                    value: false,
                },
                chooseFormList: [],
                screenWidth: '',
                timer: false,
            };
        },
        computed: {
            ...mapGetters("tenant", ["curTenantCode"]),
        },
        components: {
            editGroup,
            DiyTitle,
        },
        mounted() {
            this.getGroup();
            this.screenWidth = document.body.clientWidth;
            const that = this;
            window.onresize = () => {
                return (() => {
                    window.screenWidth = document.body.clientWidth;
                    that.screenWidth = window.screenWidth
                })()
            }
        },
        watch: {
            screenWidth(val) {
                if (!this.timer) {
                    this.screenWidth = val;
                    this.timer = true;
                    let that = this;
                    setTimeout(function () {
                        that.timer = false;
                    })
                }
            }
        },
        filters: {
            omitDescrip(info) {
                if (info.length > 15) return info.substring(0, 15) + "...";
                return info;
            },
            omitName(info, screenWidth) {
                let temp = info + '';

                if (screenWidth > 1900 && temp.length > 5) return temp.substring(0, 5) + "...";
                else if (screenWidth < 1200 && temp.length > 2) return temp.substring(0, 3) + "...";
                else if (temp.length > 6) return temp.substring(0, 6) + "...";
                return info;
            },
        },
        methods: {
            getGroup() {
                let params = {
                    tenantCode: this.curTenantCode
                };
                getTemplateGroup(params).then((res) => {
                    this.tabItems = [];
                    let temp = {
                        id: "",
                        name: "全部",
                        isCur: true,
                    };
                    this.getInfo();
                    this.tabItems.push(temp);
                    this.tabItems.push({
                        id: "0",
                        name: "公共模板",
                        isCur: false,
                    });
                    res.data.data.forEach((item, index) => {
                        let temp = {
                            id: item.id,
                            name: item.name,
                            isCur: false,
                        };
                        this.tabItems.push(temp);
                    });
                });
            },
            loadlistData() {
                this.getInfo();
                this.handleCloseDialog();
            },
            handleCloseDialog() {
                this.showGroup.value = false;
            },
            showEditGroup(info) {
                this.chooseFormList = [];
                this.chooseFormList.push(info);
                this.showGroup.value = true;
            },
            deleteByid(id) {
                let params = {
                    ids: id
                };
                deleteTemplateById(params).then(res => {
                    if (res.data.code == 200)
                        this.getInfo();
                })
            },
            userTemp(templateId) {
                this.$router.push({
                    name: "approvalDesign",
                    params: {templateId: templateId},
                });
            },
            setPublic(id, flag) {
                let params = {
                    id: id,
                    flag: flag,
                    roleId: this.$store.state.user.roleId
                };

                post2("/dev-api/asset-form/form/template/set/public/template", params).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success("设置成功");
                        this.getInfo();
                    } else {
                        this.$message.error("设置失败，请检查权限")
                    }
                }).catch(() => {
                    this.$message.error("设置失败，请检查权限")
                });
            },

            getInfo() {
                let params = {
                    tenantCode: this.curTenantCode,
                    categoryId: this.groupId,
                    current: this.page.currentPage,
                    size: this.page.pageSize,
                    created_by: ''
                };
                this.fullscreenLoading = true;

                getTemplateInfoWithGroup(params).then((res) => {
                    this.fullscreenLoading = false;
                    this.info = [];
                    let data = res.data.data.records;
                    data.forEach((item, index) => {
                        let temp = {
                            formName: item.name,
                            id: item.id,
                            descirp: item.description,
                            categoryName: item.categoryName,
                            categoryId: item.categoryId,
                            isPublic: item.isPublic,
                        };
                        this.info.push(temp);
                    });

                    this.page.currentPage = res.data.data.current;
                    this.page.total = res.data.data.total;
                });
            },
            goToAdd() {
                this.$router.push({name: "templateDesign"});
            },
            goToEdit(templateId) {
                this.$router.push({
                    name: "templateDesign",
                    params: {templateId: templateId},
                });
            },
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.page.currentPage = 1;
                this.getInfo();
            },
            handleCurrentChange(val) {
                this.page.currentPage = val;
                this.getInfo();
            },
            changeTab: function (obj) {
                this.groupId = obj.id;
                this.getInfo();

                this.tabItems.forEach(function (item) {
                    if (item.id == obj.id) {
                        item.isCur = true;
                    } else {
                        item.isCur = false;
                    }
                });
            },
        },
    };
</script>

<style lang="scss" scoped>
    .formTemplate {
        margin-top: 8px;
        width: 100%;
        padding: 2%;
        background: #fff;
        margin-bottom: 1rem;
        height: auto;

        .templateHead {
            width: 100%;
            margin-top: 0.5rem;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }

        .templateIndex {
            width: 100%;
            margin-top: 0.5rem;
            height: 50px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            &__type {
                display: flex;
                flex-direction: row;
                /*justify-content: space-between;*/
                color: #606266;
                width: 80%;
                /*margin-left: 20px;*/
                overflow: auto;

                &__item {
                    height: 50px;
                    line-height: 50px;
                    text-align: center;
                    border-radius: 4px 4px 0px 0px;
                    cursor: pointer;
                    margin-left: 20px;
                    position: relative;


                    &--is-active {
                        font-size: 1.2rem;
                        font-weight: bold;
                        color: #303133;
                    }

                    &--is-active:after {
                        content: " ";
                        width: 1.5rem;
                        height: 0.2rem;
                        background: #154ad8;
                        position: absolute;
                        bottom: 0.3rem;
                        left: 50%;
                        transform: translateX(-50%); //居中处理
                    }

                    &--is-noactive {
                        color: #606266;
                    }
                }
            }

            &__button {
                display: flex;
                flex-direction: row;
                justify-content: flex-end;
                color: #154ad8;
                width: 75%;
            }
        }

        .templateContent {
            width: 100%;
            padding: 3%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            &__box {
                width: 20%;
                min-width: 330px;
                height: 8rem;
                padding: 1%;
                margin: 1%;
                display: inline-block;
                border: 1px solid #ebeef5;

                &__left {
                    width: 65%;
                    height: 100%;
                    display: inline-block;
                }

                &__right {
                    width: 35%;
                    height: 100%;
                    display: inline-block;
                }
            }
        }
    }

    .c-img {
        max-width: 1rem;
        max-height: 1rem;
        margin-bottom: 3px;
        margin-right: 4px;
    }

    .diy-button {
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        &:hover {
            background: rgba(235, 238, 245, 1);
            border-radius: 4px;
        }
    }
</style>
