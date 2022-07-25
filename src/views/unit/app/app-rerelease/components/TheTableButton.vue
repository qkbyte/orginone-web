<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" @click="handleEdit(0, row)">编辑</div>
      <div class="diy-button" @click="handleView(0, row)">预览</div>
    </template>
    
  </DiyButton>
</template>

<script>
import DiyButton from "@components/DiyButton/index";
import { marketappcomponentSubmit } from "@api/portal";
export default {
  data() {
    return {};
  },
  computed: {},
  components: { DiyButton },
  created() {
    console.log('load', this.$parent);
  },
  props: ["row", "index"],
  methods: {
    /**通过人员 */
    handlePass(index, row) {
      if (row.status === -1) {
        // 启用
        let params = {
          id: row.id,
          status: 1,
        };
        try {
          marketappcomponentSubmit(params).then((res) => {
            if (res.data.code == 200) {
              this.$emit('handlePass')
            }
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        // 停用
        let params = {
          id: row.id,
          status: -1,
        };
        try {
          marketappcomponentSubmit(params).then((res) => {
            if (res.data.code == 200) {
              this.$emit('handlePass')
            }
          });
        } catch (error) {
          console.log(error);
        }
      }
    },
    handleEdit(index, row) {
      this.$emit("handleEdit", row);
    },
    handleView(index, row) {
      // 预览
      this.$emit('handleView', row)
    },
  },
};
</script>

<style lang="scss" scoped></style>
