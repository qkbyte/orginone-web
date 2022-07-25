import BridgeLayout from "@layout/BridgeLayout/index";

const systemRouter = [
  {
    path: "",
    name: "home",
    meta: {
      isShow: false,
      title: "首页",
    },
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/system/home/index"),
  },
  {
    path: "acttodo",
    name: "acttodo",
    meta: {
      title: "待办中心",
    },
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/system/acttodo/index"),
  },
  {
    path: "my-app",
    name: "my-app",
    meta: {
      title: "我的应用",
    },
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/system/my-app/index"),
  },
  {
    path: "user-center",
    meta: {
      title: "用户中心",
    },
    component: BridgeLayout,
    children: [
      {
        path: "",
        name: "user-center",
        meta: {},
        component: () =>
          import(/* webpackChunkName: "views" */ "@views/system/user-center/index"),
      },
      {
        path: "check-apply",
        name: "person-check-apply",
        meta: {
          title: "查看申请单位记录",
        },
        component: () =>
          import(/* webpackChunkName: "views" */ "@views/system/user-center/checkApply"),
      },
    ],
  },
];
export default systemRouter;
