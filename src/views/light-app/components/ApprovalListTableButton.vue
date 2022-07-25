<template>
    <DiyButton>
        <template v-slot:opt>
            <div v-if="row.status!=1" class="diy-button" @click="handleView">编辑</div>
            <div class="diy-button" @click="handleStartOrStop">
                <div v-if="row.status===1">
                    停用
                </div>
                <div v-else>
                    启用
                </div>

            </div>
            <div v-if="row.status!=1" class="diy-button" @click="handleEdit">编辑分组</div>
            <div v-if="row.status!=1" class="diy-button" @click="handleDelete" style="color: #F76C6F">删除</div>
        </template>
    </DiyButton>
</template>

<script>
    import DiyButton from "./DiyButton/index";


    export default {
        data() {
            return {};
        },

        components: { DiyButton },
        created() {},
        props: {
            theId: {
                type: String,
                default: () => {
                },
            },
            row: {
                type: Object,
                default: () => {
                },
            },
        },
        methods: {
            /**查看 */
            handleView() {
                this.$router.push({name: "approvalDesign",params:{formId: this.theId}})
            },

            /**启用或停用 */
            handleStartOrStop() {
                this.$emit("handleChangeStatus");
            },
            //编辑分组
            handleEdit() {
                this.$emit("handleGroupByButton");
            },
            /**删除 */
            handleDelete() {
                this.$emit("handleDelteFormByButton");
            },

        },
    };
</script>

<style lang="scss" scoped>
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
