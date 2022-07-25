<template>
  <el-dialog
    title="流程图"
    :visible.sync="dialogProcessImageVisibleInChild"
    fullscreen
  >
    <img :src="imagePath" alt="流程图" />
  </el-dialog>
</template>

<script>
export default {
  name: "ProcessImage",
  props: {
    visible: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    processDefinitionId: {
      type: String,
      default: function () {
        return "";
      },
    },
    processInstanceId: {
      type: String,
      default: function () {
        return "";
      },
    },
  },
  computed: {
    dialogProcessImageVisibleInChild: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      },
    },
  },
  data() {
    return {
      imagePath: "",
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (
        this.processInstanceId &&
        this.processInstanceId != null &&
        this.processInstanceId !== ""
      ) {
        this.imagePath =
          // `${process.env.VUE_APP_BASE_API}` +
          "/dev-api/asset-work-order/flowable/processInstanceImage?processInstanceId=" +
          this.processInstanceId +
          "&time=" +
          new Date();
      } else if (
        this.processDefinitionId &&
        this.processDefinitionId != null &&
        this.processDefinitionId !== ""
      ) {
        this.imagePath =
          // `${process.env.VUE_APP_BASE_API}` +
          "/dev-api/asset-work-order/flowable/processDefinition/image?processDefinitionId=" +
          this.processDefinitionId +
          "&time=" +
          new Date();
      }
    },
  },
};
</script>

