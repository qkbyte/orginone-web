import store from "@/store";

export default {
  update(el, binding) {
    const permission = store.state.user.roleName;
    const { value } = binding;
    if (!permission.includes("test")) {
      if (value && value instanceof Array && value.length > 0) {
        const hasPermission = value.some(role => {
          return permission.includes(role);
        });

        if (!hasPermission) {
          el.parentNode && el.parentNode.removeChild(el);
        }
      } else {
        throw new Error(`need params! Like v-has="[admin]"`);
      }
    }
  }
};
