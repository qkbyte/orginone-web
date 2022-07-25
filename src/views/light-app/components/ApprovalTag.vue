<template>
    <div class="approvalTag" @click="showApprovalInfo">
        <div class="top">
            <div style="display: flex;align-items: center">
                <div class="topImg">
                    <img style="width: 100%;height: 100%;" src="@assets/store/app-icon-1.png"/>
                </div>
                <div class="top__title">{{this.info.formName}}</div>
            </div>

            <div style="width: 5%;cursor:default;" @click.stop="showNothing">
                <el-popover
                        placement="bottom"
                        width="150"
                        trigger="hover"
                >
                    <div class="diy-button" @click="showApprovalInfo">查看</div>
                    <div class="diy-button" @click="showApprovalList">权限分配</div>
                    <div class="diy-button" @click="showApprovalList">编辑分组</div>
                    <div class="diy-button" @click="showApprovalList" style="color: #F76C6F">停用</div>
                    <div slot="reference"
                         style="height:100%;width: 100%;display: flex;flex-direction: row; justify-content: center;align-items: center;">
                        <div style="height:65%;display: flex;flex-direction: column;justify-content: space-between">
                            <div style="height: 3px;width: 3px;border-radius: 3px;background-color: #154AD8"></div>
                            <div style="height: 3px;width: 3px;border-radius: 3px;background-color: #154AD8"></div>
                            <div style="height: 3px;width: 3px;border-radius: 3px;background-color: #154AD8"></div>
                        </div>
                    </div>
                </el-popover>

            </div>

        </div>
        <div class="medium">
            {{this.info.description}}
        </div>
        <div class="end">
            <div>
                分组：{{this.info.group}}
            </div>
            <div>
                可发起人：部分成员
            </div>
            <div>
                创建人：彭桂英
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "ApprovalTag",
        data() {
            return {};
        },
        props: {
            info: {
                type: Object,
                default: function () {
                    return {
                        formName: '请假审批',
                        description:"此处为模板介绍此处为模板介为",
                        group:"财务",

                    }
                }
            }
        },


        methods: {
            showApprovalInfo() {
                this.$router.push({name: "approvalItem",params:{formId:this.info.id}})
            },
            showNothing(){

            },
            showApprovalList(){
                this.$router.push({name: "approvalList"})
            }
        }
    }
</script>

<style lang="scss" scoped>
    .approvalTag {
        width: 32%;
        height: 145px;
        padding: 20px 20px 16px;
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border: 1px solid rgba(235, 238, 245, 1);
        border-radius: 4px;
        cursor: pointer;

        &:hover {
            box-shadow: 0px 3px 12px rgba(0, 0, 0, 0.05);
        }

        .top {
            display: flex;
            justify-content: space-between;
            width: 100%;
            height: 30%;

            .topImg {
                width: 18px;
            }

            &__title {
                max-width: 200px;
                font-size: 1.2rem;
                font-weight: 400;
                color: rgba(48, 49, 51, 1);
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                margin-left: 5px;

            }
        }

        .medium {
            color: #606266;
            font-size: 1.1rem;
        }

        .end {
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #909399;
        }
    }


</style>