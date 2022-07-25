import BridgeLayout from "@layout/BridgeLayout/index";

const groupAppRouter = {
  path: "group-app/index",
  meta: {
    title: "应用中心",
  },
  component: BridgeLayout,
  children: [
    {
      path: "",
      name: "group-app-assign",
      meta: {},
      component: () =>
        import(/* webpackChunkName: "views" */ "@views/group/app/app-assign/index"),
    },
    {
      path: "view",
      name: "group-app-manage-view",
      meta: {
        title: "应用查看",
      },
      component: () =>
        import(/* webpackChunkName: "views" */ "@views/group/app/app-view/index"),
    },
    {
      path: "app-center",
      name: "group-app-center",
      meta: {
        // title: "应用市场",
        title:'软件共享仓库'
      },
      component: () =>
        import(/* webpackChunkName: "views" */ "@views/group/app/app-center/index"),
    },
  ],
};
export default groupAppRouter;
