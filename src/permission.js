import router from "./router";
import store from "./store";
import { Loading } from "element-ui";

const whiteList = ["/login", "/404", "/register", "/forget-password",'/government-home'];
const options = {
  lock: true,
  text: "拼命加载中",
  spinner: "el-icon-loading",
};

router.beforeEach(async (to, from, next) => {
  const hasToken = localStorage.getItem("ZCY_TOKEN");
  if (hasToken) {
    if (!(to.path === "/test")) {
      store.dispatch("loading", {
        status: true,
        instance: Loading.service(options),
      });
    }
    if (
      to.path === "/login" ||
      (store.state.user.isLogin && store.state.permission.isRoute)
    ) {
      next();
    } else {
      try {
        await store.dispatch("user/login");
        let params = { phoneNumber: store.state.user.userName.accountName };
        await store.dispatch("tenant/initTenantList", params, {
          root: true,
        });

        await store.dispatch("group/initGroupList", "", { root: true });

        await store.dispatch("menu/initMenuList", "", { root: true });

        await store.dispatch("permission/initRoutes", "", { root: true });

        await store.dispatch("permission/changeRouteState", true, {
          root: true,
        });
        const menu = JSON.parse(sessionStorage.getItem("openMenu"));
        if (menu) {
          store.dispatch("menu/changeMenu", menu, { root: true });
        } else {
          store.dispatch(
            "menu/changeMenu",
            {
              id: -1,
              type: "platform",
              path: "/",
            },
            { root: true }
          );
        }
        router.addRoutes(store.state.permission.addRouters);
        next({ ...to, replace: true });
      } catch (error) {
        store.dispatch("user/logout");
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      console.log("白名单登录");
      next();
    } else {
      console.log("前往登录页");
      next("/login");
    }
  }
});

router.afterEach(() => {
  store.dispatch("loading", {
    status: false,
  });
});
