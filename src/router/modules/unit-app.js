import BridgeLayout from "@layout/BridgeLayout/index";

const unitAppRouter = {
  path: "unit-app/index/app-assign",
  meta: {
    title: "应用中心",
    help: "管理单位内应用，支持获取应用、分配应用",
  },
  component: BridgeLayout,
  children: [
    {
      path: "",
      name: "app-assign",
      meta: {},
      component: () =>
        import(/* webpackChunkName: "views" */ "@views/unit/app/app-assign/index"),
    },
    {
      path: "view",
      name: "app-manage-view",
      meta: {
        title: "应用查看",
      },
      component: () =>
        import(/* webpackChunkName: "views" */ "@views/unit/app/app-view/index"),
    },
    {
      path: "app-center",
      meta: {
        // title: "应用市场",
        title:"软件共享仓库",
      },
      component: BridgeLayout,
      children: [
        {
          path: "",
          name: "app-center",
          meta: {},
          component: () =>
            import(/* webpackChunkName: "views" */ "@views/unit/app/app-center/index"),
        },
        // {
        //   path: "appCenter-dev",
        //   meta: {
        //     title: "开发者中心",
        //   },
        //   component: BridgeLayout,
        //   children: [
        //     {
        //       path: "",
        //       name: "appCenter-dev",
        //       meta: {},
        //       component: () =>
        //         import(/* webpackChunkName: "views" */ "@views/unit/app/app-dev/index"),
        //     },
        //     {
        //       path: "upload",
        //       name: "app-upload",
        //       meta: {
        //         title: "应用新增",
        //       },
        //       component: () =>
        //         import(/* webpackChunkName: "views" */ "@views/unit/app/app-dev/upload"),
        //     },
        //     {
        //       path: "register",
        //       name: "app-register",
        //       meta: {
        //         title: "应用注册",
        //       },
        //       component: () =>
        //         import(/* webpackChunkName: "views" */ "@views/unit/app/app-dev/register"),
        //     },
        //     {
        //       path: "icon",
        //       name: "app-icon",
        //       meta: {
        //         title: "图标库",
        //       },
        //       component: () =>
        //         import(/* webpackChunkName: "views" */ "@views/unit/app/app-dev/icon"),
        //     },
        //     {
        //       path: "deploy",
        //       name: "app-deploy",
        //       meta: {
        //         title: "应用部署",
        //       },
        //       component: () =>
        //         import(/* webpackChunkName: "views" */ "@views/unit/app/app-dev/deploy"),
        //     },
        //     {
        //       path: "release",
        //       name: "app-release",
        //       meta: {
        //         title: "应用发布",
        //       },
        //       component: () =>
        //         import(/* webpackChunkName: "views" */ "@views/unit/app/app-dev/release"),
        //     },
        //     {
        //       path: "view",
        //       name: "app-view",
        //       meta: {
        //         title: "应用查看",
        //       },
        //       component: () =>
        //         import(/* webpackChunkName: "views" */ "@views/unit/app/app-dev/view"),
        //     },
        //     {
        //       path: "edit",
        //       name: "app-edit",
        //       meta: {
        //         title: "应用编辑",
        //       },
        //       component: () =>
        //         import(/* webpackChunkName: "views" */ "@views/unit/app/app-dev/edit"),
        //     },
        //     {
        //       path: "rerelease",
        //       name: "app-rerelease",
        //       meta: {
        //         title: "重新发布",
        //       },
        //       component: () =>
        //         import(/* webpackChunkName: "views" */ "@views/unit/app/app-rerelease/index"),
        //     },
        //   ],
        // },
      ],
    },
    {
      path: "workorder-launch-flow",
      name: "workorder-launch-flow",
      meta: { title: "发起工单" },
      component: () =>
        import(/* webpackChunkName: "workorder-launch-flow" */ "@/views/workorder-launch/launchFlow"),
    },
  ],
};
export default unitAppRouter;
