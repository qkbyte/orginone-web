<template>
    <div class="tag" @click="showFormInfo">
        <div class="tag_left ">
            <img src="@assets/issue/edit.png" height="100%" width="100%">
        </div>
        <div class="tag_right">

            <el-tooltip class="tag_right_title" effect="dark" :content="title" placement="top-start">
                <span>{{title|fitTitle}}</span>
            </el-tooltip>

            <div class="tag_right_body">
                {{describe}}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                body: "应用描述应用描述",
            };
        },
        props: {
            title: {
                type: String,
                default: ""
            },
            describe: {
                type: String,
                default: ""
            },
            formId:{
                type: String,
                default: ""
            },
            procModelId:{
                type: String,
                default: ""
            },
            createdBy:{
                type: String,
                default: ""
            }

        },
        methods: {
            showFormInfo(){
                this.$emit("emitFormInfo",this.formId,this.title,this.procModelId,this.createdBy)
            },

        },
        filters: {
            fitTitle: function (value) {
                if (value.length>8)
                    return value.substr(0,8)+"...";
                return value;
            }
        }

    }
</script>


<style lang="scss" scoped>


    .tag {
        width: 100%;
        display: flex;
        flex-direction: row;

        &_left {
            width: 30%;
            padding: 1rem;
        }

        &_right {
            width: 65%;
            padding: 1rem;

            &_title {
                font-size: 1.5rem;
                font-weight: bold;
                height: 2rem;
                white-space:nowrap;
            }

            &_body {
                margin-top: 0.5rem;
                font-size: 1rem;

            }
        }
    }
    .dpop{
        position:absolute;
        z-index:3;
        border:1px dashed #EEF;
        background:#EEE;
    }

</style>