export const mixin = {
  data() {
    return {
      CURRENT_ENV: "",
    };
  },
  created() {
    // 设置当前环境
    this.CURRENT_ENV = process.env.VUE_APP_ENV;
  },
  methods: {
    /**
     * @method 关闭对话框
     * @param {String} key 对话框标识
     */
    handleCloseDialog(key) {
      this.dialogShow.map((el) => {
        if (el.key === key) {
          el.value = false;
        }
      });
    },
  },
};
