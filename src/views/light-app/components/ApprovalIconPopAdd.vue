<template>
    <el-dialog

            :visible.sync="dialogShow.value"
            width="517px"
            center
            top="8vh"
            class="diy-dialog"
            :close-on-click-modal="false"
    >
        <div slot="title" style="text-align: left;">
            <span class="PopAdd-title">
            编辑自定义图标
             </span>
        </div>


        <div class="PopAddChoose">
            <div
                    v-for="item in tabItems"
                    :key="item.id"
                    style="position: relative; margin-right:20px;"
            >
                <div
                        class="PopAddChoose__item"
                        :class="
                      item.isCur
                        ? 'PopAddChoose__item--is-active'
                        : 'PopAddChoose__item--is-noactive'
                    "
                        @click="changeTab(item)"
                >
                    {{ item.name }}
                </div>
            </div>
        </div>

        <div class="PopAddBody">
            <!--            <el-upload-->
            <!--                    class="upload-demo"-->
            <!--                    ref="upload"-->
            <!--                    action="https://jsonplaceholder.typicode.com/posts/"-->
            <!--                    :on-preview="handlePreview"-->
            <!--                    :on-remove="handleRemove"-->
            <!--                    :file-list="fileList"-->
            <!--                    :auto-upload="false"-->
            <!--                    list-type="picture-card"-->
            <!--            >-->
            <!--                <i class="el-icon-plus"></i>-->

            <!--                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
            <!--            </el-upload>-->

            <!--            <div class="iconUpContent">-->
            <!--                <div style="display: flex;align-items: center;height: 100%">-->
            <!--                    <div style="text-align: center;width: 100%">-->
            <!--                        <img src="../../../assets/approval/others/app_icon_add_null.png" height="13" width="12"/>-->
            <!--                    </div>-->

            <!--                </div>-->
            <!--            </div>-->

            <!--:with-credentials="true"-->


            <!--
            聂富强:
            asset-form/icon/add   上传表单icon

            聂富强:
            asset-form/icon/get/icon  获取表单icon

            聂富强:
            asset-form/icon/delete   删除表单icon

            -->


            <el-upload
                    drag
                    action="http://platform.assetcloud.org.cn/dev-api/asset-form/upload/images"
                    multiple
                    ref="upload"
                    :file-list="fileList"
                    :headers="header"
                    :show-file-list="false"
                    :on-progress="handleAdd"
                    :on-success="handleSucces"
                    :auto-upload="false"
                    :on-change="handleChange"
                    class="file-wrapper"
            >

                <div  :class="fileList.length==0?'iconUpContent--null':'iconUpContent--noNull'">
                    <div v-if="fileList.length==0" style="text-align: center;width: 100%">
                        <img src="../../../assets/approval/others/app_icon_add_null.png" height="13" width="12"/>
                        将文件拖到此处，或<span style="color: #154AD8;cursor: pointer;">点击上传</span>
                    </div>
                    <div v-else style="text-align: left">
                        <template v-for="(item,index) in fileList">
                            <div style="cursor: pointer;padding: 8px;display: inline-block;" @click.stop="removeItem(item)">
                                <img v-if="item.status!='success'" :src="urlList[index].url"
                                     style="height: 40px;width: 40px"/>
                                <img v-else :src="item.response.data" style="height: 40px;width: 40px"/>
                                <img
                                        v-if="item.status=='success'"
                                        style="width: 8px;height: 8px;position: relative;left: -8px;top: 16px;"
                                        :src="require(`@assets/approval/others/app_confirm.png`)"
                                />
                            </div>


                        </template>
                    </div>
                </div>


                <div style="text-align: left; height:28px; line-height:28px;" slot="tip">图标规范：文件格式为jpg、png</div>
            </el-upload>


            <div style="text-align: right">
                <el-button v-if="fileList.length==0" @click="submitUpload"
                           style="background-color:#154AD8;color: white;">完成
                </el-button>
                <el-button v-else @click="submitUpload" style="background-color:#154AD8;color: white;">上传</el-button>
                <!--                <el-button  size="small" @click="submitUpload" style="background-color:#154AD8;color: white ">上传</el-button>-->
            </div>

        </div>


    </el-dialog>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "ApprovalIconPopAdd",
        props: {
            dialogShow: {
                type: Object,
                default: () => {
                }
            },
        },
        data() {
            return {
                tabItems: [
                    {
                        id: "1",
                        name: "上传图标",
                        isCur: true,
                    },
                    {
                        id: "2",
                        name: "管理图标",
                        isCur: false,
                    }
                ],
                fileList: [],
                header: {},
                urlList:[],
                // fileList: [
                //     {
                //         name: 'food.jpeg',
                //         url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                //     },
                //     {
                //         name: 'food2.jpeg',
                //         url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                //     },
                //
                // ]
            }
        },
        computed: {
            ...mapState("user", ["token"]),
        },
        mounted() {
            this.header = {
                "blade-auth": this.token
            }
        },
        methods: {
            changeTab: function (obj) {

                this.tabItems.forEach((item, index) => {
                    if (item.id == obj.id) {
                        item.isCur = true;

                    } else {
                        item.isCur = false;
                    }
                });
            },
            removeItem(item){
                if (item.status=='success'){
                    this.$message.error("已上传的图标无法在此取消");
                    return;
                }
                let tempList=[];
                this.$refs.upload.fileList.forEach(temp=>{
                    if (item!=temp)
                        tempList.push(temp)
                })
                this.$refs.upload.fileList=tempList;
                this.fileList=tempList;
                this.readAsUrl();
            },
            submitUpload() {
                // console.log(this.fileList);
                this.$refs.upload.submit();

            },
            handleAdd(event, file, fileList) {
                console.log(event)
                console.log(file)
                console.log(fileList)
            },
            handleSucces(response, file, fileList) {
                // console.log(response);
                // console.log(file);
                // console.log(fileList);
                this.fileList=fileList;
                this.readAsUrl();
            },
            handleChange(file, fileList) {
                console.log(file);
                console.log(fileList);
                this.fileList = fileList;
                this.readAsUrl();

            },
            readAsUrl(){
                let res=[];
                this.fileList.map((item)=>{
                    let reader = new window.FileReader();
                    reader.readAsDataURL(item.raw);
                    reader.onloadend = () => {
                        res.push({
                            url: reader.result
                        });
                    };
                })
                this.urlList=res;
                console.log(this.urlList)
            },

            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .PopAdd-title {
        width: 140px;
        height: 28px;
        font-size: 20px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(48, 49, 51, 1);
        line-height: 28px;
    }

    .PopAddChoose {
        display: flex;
        flex-direction: row;
        /*justify-content: space-between;*/
        color: #606266;
        width: 80%;
        font-size: 16px;
        /*margin-left: 20px;*/
        overflow: auto;
        margin-bottom: 10px;

        &__item {
            height: 50px;
            line-height: 50px;
            text-align: center;
            border-radius: 4px 4px 0px 0px;
            cursor: pointer;
            // margin-right: 20px;

            &--is-active {
                // font-size: 1.2rem;
                font-size: 16px;
                font-weight: bold;
                color: #303133;
            }

            &--is-active:after {
                content: " ";
                width: 100%;
                height: 0.12rem;
                background: #154ad8;
                position: absolute;
                bottom: 0.5rem;
                left: 50%;
                transform: translateX(-50%); //居中处理
            }

            &--is-noactive {
                color: #606266;
            }
        }
    }

    .PopAddBody {
        width: 100%;

        text-align: center;
    }

    .iconUpContent--null {
        background-color: #EBEEF5;
        overflow: auto;
        display: flex;
        align-items: center;
        height: 100%;
        /*background-color: #EBEEF5;*/
    }

    .iconUpContent--noNull {
        background-color: #ffffff;
        overflow: auto;
        /*display: flex;*/
        /*align-items: center;*/
        /*height: 100%;*/
        /*background-color: #EBEEF5;*/
    }

    .PopAddBody::v-deep .el-upload-dragger {
        width: 100%;
        height: 172px;
    }

    /*.PopAddBody::v-deep .el-upload-list{*/
    /*    display: none;*/
    /*}*/
    .PopAddBody::v-deep .el-upload {
        width: 100%;
    }
    
    .diy-dialog::v-deep .el-dialog__body {
        padding: 10px 20px 20px;
    }
</style>