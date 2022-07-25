<template>
    <div class="search-list">
        <div class="search-list__search">
            <el-input
                    prefix-icon="el-icon-search"
                    v-model="searchInput"
                    placeholder="请输入搜索内容"
            ></el-input>
        </div>
        <div class="search-list__list">
            <template v-if="curType === 0">
                <el-tree
                        ref="tree"
                        :props="listOption1"
                        :data="listData"
                        node-key="id"
                        :default-checked-keys="selectList"
                        show-checkbox
                        check-strictly
                        default-expand-all
                        :filter-node-method="filterNode"
                        @check-change="handleCheckChange"
                >
                </el-tree>
            </template>
            <div v-else>
                <el-tree
                        ref="tree"
                        :props="listOption"
                        :data="listData"
                        node-key="id"
                        show-checkbox
                        check-strictly
                        default-expand-all
                        :filter-node-method="filterNode"
                        @check-change="handleCheckChange"
                >
                </el-tree>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                searchInput: "",
                listOption: {
                    label: "label",
                    children: "children",
                },
                listOption1: {
                    label: "label",
                    children: "children",
                },
                multipleSelection: [],
                curType: 0,
                selectTemp: [],
            };
        },
        props: {
            listData: {
                type: Array,
                default: () => [],
            },
            selectList: {
                type: Array,
                default: () => [],
            },
            title: {
                type: String,
                default: "title",
            },
            type: {
                type: Number,
                default: 0,
            },
        },
        watch: {
            searchInput(val) {
                this.$refs.tree.filter(val);
            },
            title: {
                handler(n, o) {
                    this.listOption.label = this.title;
                },
                deep: true,
            },
            type: {
                handler(n, o) {
                    this.curType = n;
                },
                deep: true,
            },
        },
        created() {
            this.listOption.label = this.title;
        },
        mounted() {
            this.selectTemp = this.selectList;
            // console.log("dda"+JSON.stringify(this.selectTemp))
        },
        methods: {
            handleCheckChange(data, checked, indeterminate) {
                this.multipleSelection = this.getCheckedNodes();
                this.$emit("handleSelection", this.multipleSelection);
            },
            getCheckedNodes() {
                return this.$refs.tree.getCheckedNodes();
            },


            filterNode(value, data) {
                if (!value) return true;
                return data.label.includes(value);
            },
        },
    };
</script>

<style lang="scss" scoped>
    ::-webkit-scrollbar {
        width: 7px;
        height: 0px;
        background: #ffffff;
    }

    ::-webkit-scrollbar-thumb {
        height: 0px;
        border-radius: 4px;
        background: #e7e7e7b7;
    }

    .search-list {
        width: 100%;
        display: flex;
        flex-direction: column;

        &__list {
            height: 250px;
            margin-top: 20px;
            overflow-y: scroll;
        }
    }
</style>
