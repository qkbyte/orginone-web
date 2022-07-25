import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

/* Modules */
import unitRouter from "./modules/unit";
import unitAppRouter from "./modules/unit-app";
import groupRouter from "./modules/group";
import groupAppRouter from "./modules/group-app";
import systemRouter from "./modules/system";
import platformRouter from "./modules/platform";

/* Layout */
import Layout from "@layout/BaseLayout/index";
import BridgeLayout from "@layout/BridgeLayout/index";
//router升级问题
// const originalPush = VueRouter.prototype.push;
// VueRouter.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch((err) => err);
// };

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRouter = [
  {
    path: "/login",
    name: "login",
    component: () => import("@views/system/login/index"),
  },
  {
    path: "/government-home",
    name: "government-home",
    component: () => import("@views/digital-government/home/index"),
  },
  {
    path: "/myOffice",
    name: "myOffice",
    component: () => import("@views/digital-government/officeList/index"),
  },
  {
    path: "/myTask",
    name: "myTask",
    component: () => import("@views/digital-government/taskList/index"),
  },
  {
    path: "/fxqxt",
    name: "fxqxt",
    component: () => import("@views/digital-government/fxqxtList/index"),
  },
  {
    path: "/hxList",
    name: "hxList",
    component: () => import("@views/digital-government/hxList/index"),
  },
  {
    path: "/iframe",
    name: "iframe",
    component: () => import("@views/digital-government/iframe/index"),
  },
  {
    path: "/zdrwApplicationList", //重大任务应用列表
    name: "zdrwApplicationList",
    component: () =>
      import("@views/digital-government/zdrwApplicationList/index"),
  },
  {
    path: "/zylyApplicationList", //主要领域应用列表
    name: "zylyApplicationList",
    component: () =>
      import("@views/digital-government/zylyApplicationList/index"),
  },
  {
    path: "/404",
    component: () => import("@views/system/error-page/404"),
  },
  {
    path: "/401",
    component: () => import("@views/system/error-page/401"),
  },
  {
    path: "/oldHome",
    component: () => import("@views/system/home/oldIndex"),
  },
  {
    path: "/messageComponent",
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/templateComponent/TheMessageComponent"),
  },
  {
    path: "/userInform",
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/templateComponent/TheUserInform"),
  },
  {
    path: "/invitation",
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/templateComponent/TheInvitation"),
  },
  {
    path: "/indexcard",
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/templateComponent/TheIndexCard"),
  },
  {
    path: "/usualapp",
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/templateComponent/TheUsualApp"),
  },
  {
    path: "/indexasset",
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/templateComponent/TheIndexAsset"),
  },
  {
    path: "/indexvisit",
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/templateComponent/TheIndexVisit"),
  },
  {
    path: "/banner",
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/templateComponent/TheWelcome"),
  },
  {
    path: "/bannerjg",
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/templateComponent/TheWelcomejg"),
  },
  {
    path: "/announcement",
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/templateComponent/TheAnnouncements"),
  },
  {
    path: "/taskwaring",
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/templateComponent/TheTaskWaring"),
  },
  {
    path: "/newMessage",
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/templateComponent/TheNewMessage"),
  },
  {
    path: "/cockpitbtn",
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/templateComponent/TheCockpitBtn"),
  },
  {
    path: "/taskbtn",
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/templateComponent/TheTaskBtn"),
  },
  {
    path: "/analybtn",
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/templateComponent/TheAnalyBtn"),
  },
  {
    path: "/scenarios",
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/templateComponent/TheScenarios"),
  },
  {
    path: "/showplate",
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/templateComponent/TheShowPlateBtn"),
  },
  {
    path: "/lineChar",
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/templateComponent/TheLineChar"),
  },
  {
    path: "/xzComponent",
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/templateComponent/TheXzComponent"),
  }
];

/**
 * dynamicRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const dynamicRouter = [
  {
    path: "/",
    component: Layout,
    children: [
      ...systemRouter,
      ...platformRouter,
      unitRouter,
      unitAppRouter,
      groupRouter,
      groupAppRouter,
      {
        path: "online",
        name: "app-test",
        meta: { isShow: false },
        component: () =>
          import(/* webpackChunkName: "views" */ "@views/open-app/index"),
      },
      {
        path: "card/card-style",
        name: "card-style",
        meta: {
          title: "卡片样式管理",
        },
        component: () =>
          import(/* webpackChunkName: "views" */ "@views/card/card-style/index"),
      },
      {
        path: "card/card-module",
        name: "card-module",
        meta: {
          title: "卡片维度管理",
        },
        component: () =>
          import(/* webpackChunkName: "views" */ "@views/card/card-module/index"),
      },
      {
        path: "home/homeComponent",
        name: "home/homeComponent",
        meta: {
          isShow: false,
          title: "自定义配置",
        },
        component: () =>
          import(/* webpackChunkName: "views" */ "@views/portal/homeComponent"),
      },
      {
        path: "home/homePortal",
        name: "home/homePortal",
        meta: {
          isShow: false,
          title: "首页配置",
        },
        component: () =>
          import(/* webpackChunkName: "views" */ "@views/portal/homeIndex"),
      },
      {
        path: "home/portal",
        meta: {
          isShow: false,
          title: "首页配置",
        },
        component: BridgeLayout,
        children: [
          {
            path: "",
            name: "home/portal",
            meta: {},
            component: () =>
              import(/* webpackChunkName: "views" */ "@views/portal/index"),
          },
          {
            path: "",
            name: "home/homePortal",
            meta: {},
            component: () =>
              import(/* webpackChunkName: "views" */ "@views/portal/homeIndex"),
          },
          {
            path: "portalMement",
            name: "portalMement",
            meta: {
              title: "组件管理",
            },
            component: () =>
              import(/* webpackChunkName: "views" */ "@views/portal/components/Portalment"),
          },
        ],
      },
      {
        path: "home/TemplateMement",
        name: "home/TemplateMement",
        meta: {
          title: "模板管理",
        },
        component: () =>
          import(/* webpackChunkName: "views" */ "@views/portal/components/Template"),
      },
      {
        path: "message/approval",
        name: "message-approval",
        meta: {
          title: "审核单据",
        },
        component: () =>
          import(/* webpackChunkName: "views" */ "@views/message/approval"),
      },
      {
        path: "message/flow",
        name: "message-flow",
        meta: {
          title: "审批流程",
        },
        component: () =>
          import(/* webpackChunkName: "views" */ "@views/message/flow"),
      },
    ],
  },
  { path: "*", redirect: "/404", hidden: true },
];

const routes = [...constantRouter];

const createRouter = () =>
  new VueRouter({
    mode: "hash",
    base: process.env.BASE_URL,
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      } else {
        return { x: 0, y: 0 };
      }
    },
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}

export default router;
