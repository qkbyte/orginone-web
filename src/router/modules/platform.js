import BridgeLayout from "@layout/BridgeLayout/index";

const platformRouter = [
  {
    path: "menu",
    name: "menu",
    meta: {
      title: "菜单管理",
      roles: ["1", "278", "279"],
    },
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/platform/menu/index"),
  },
  {
    path: "unit-message",
    name: "unit-message",
    meta: {
      title: "单位管理",
      roles: ["1", "267", "278", "279"],
      iconShow: true,
      seachName: "请输入单位名称",
    },
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/platform/unit/index"),
  },
  {
    path: "platform-user",
    name: "platform-user",
    meta: {
      title: "用户管理",
      roles: ["1", "267", "278", "279"],
      iconShow: true,
      searchName: "请输入用户姓名",
    },
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/platform/user/index"),
  },
  {
    path: "person-manage",
    name: "platform-user",
    meta: {
      title: "人员管理",
      roles: ["1", "267", "278", "279"],
      iconShow: true,
      seachName: "请输入人员姓名",
    },
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/platform/person/index"),
  },
  {
    path: "role",
    name: "role",
    meta: {
      title: "角色管理",
      roles: ["1", "278", "279"],
    },
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/platform/role/index"),
  },
  {
    path: "dictionary",
    meta: {
      title: "字典管理",
    },
    component: BridgeLayout,
    children: [
      {
        path: "",
        name: "dictionary",
        component: () =>
          import(/* webpackChunkName: "views" */ "@views/platform/dictionary/index"),
      },
      {
        path: "dictionary-maintenance",
        name: "dictionary-maintenance",
        meta: {
          title: "字典维护",
        },
        component: () =>
          import(/* webpackChunkName: "views" */ "@views/platform/dictionary/components/Department"),
      },
    ],
  },
  {
    path: "itops",
    component: BridgeLayout,
    meta: {
      title: "数据运维管理",
      roles: ["1", "278", "279"],
    },
    children: [
      {
        path: "",
        name: "itops",
        meta: {},
        component: () =>
          import(/* webpackChunkName: "views" */ "@views/platform/itops/index"),
      },
      {
        path: "detailindex",
        name: "itops-detail-view",
        meta: {
          title: "运维修复查看",
        },
        component: () =>
          import(/* webpackChunkName: "views" */ "@views/platform/itops/detailindex"),
      },
    ],
  },
  {
    path: "configApproval",
    name: "configApproval",
    meta: {
      title: "配置审批",
    },
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/platform/configApproval/index"),
  },
  {
    path: "metadata",
    name: "metadata",
    meta: {
      title: "元数据管理",
    },
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/platform/metadatas/index"),
  },
  {
    path: "message-set",
    meta: {
      title: "消息配置",
    },
    component: BridgeLayout,
    children: [
      {
        path: "",
        name: "message-set",
        component: () =>
          import(/* webpackChunkName: "views" */ "@views/platform/message-set/index"),
      },
      {
        path: "message-history",
        name: "message-history",
        meta: {
          title: "短信历史记录",
        },
        component: () =>
          import(/* webpackChunkName: "views" */ "@views/platform/message-set/components/TheSMSHistoryTable"),
      },
    ],
  },
  {
    path: "tenant-group",
    name: "tenant-group",
    meta: {
      title: "租户组管理",
      roles: ["1", "278", "279"],
    },
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/platform/tenant-group/index"),
  },
  {
    path: "tenant",
    component: BridgeLayout,
    meta: {
      roles: ["1", "267", "278", "279"],
      iconShow: true,
      seachName: "请输入租户名称",
      title: "租户管理",
    },
    children: [
      {
        path: "",
        name: "tenant",
        meta: {},
        component: () =>
          import(/* webpackChunkName: "views" */ "@views/platform/tenant/index"),
      },
      {
        path: "tenant-import",
        name: "tenant-import",
        meta: {
          title: "租户导入",
        },
        component: () =>
          import(/* webpackChunkName: "views" */ "@views/platform/tenant/components/TenantImport"),
      },
    ],
  },
  {
    path: "app/check",
    meta: {
      title: "应用中心",
    },
    component: BridgeLayout,
    children: [
      {
        path: "",
        name: "app-check-manage",
        component: () =>
          import(/* webpackChunkName: "views" */ "@views/platform/app/app-manage/index"),
      },
      {
        path: "app-check",
        meta: {
          title: "应用审核",
        },
        component: BridgeLayout,
        children: [
          {
            path: "",
            name: "app-check",
            component: () =>
              import(/* webpackChunkName: "views" */ "@views/platform/app/app-check/index"),
          },
          {
            path: "view",
            name: "app-check-view",
            meta: {
              title: "应用查看",
            },
            component: () =>
              import(/* webpackChunkName: "views" */ "@views/unit/app/app-dev/appView"),
          },
        ],
      },
    ],
  },
  {
    path: "app/redeploy",
    meta: {
      title: "版本管理",
    },
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/platform/app/app-redeploy/index"),
  },
  {
    path: "group-list",
    name: "group-list",
    meta: {
      title: "集团管理",
      roles: ["1", "267", "278", "279"],
      iconShow: true,
      seachName: "请输入集团名称",
    },
    component: () =>
      import(/* webpackChunkName: "views" */ "@views/platform/group/index"),
  },
  {
    path: "monitor",
    name: "monitor",
    meta: {
      title: "平台监控",
      roles: ["1", "278", "279"],
    },
    component: () => import("@views/platform/monitor/index"),
  },
  {
    path: "upload",
    name: "upload",
    meta: {
      title: "导入模板",
    },
    component: () => import("@views/platform/upload/index"),
  },
  {
    path: "workorder-set",
    component: BridgeLayout,
    meta: {
      title: "工单配置",
    },
    children: [
      {
        path: "",
        name: "workorder-set",
        meta: {},
        component: () => import("@views/platform/workorder-set/index"),
      },
      {
        path: "/form",
        name: "workorder-form",
        meta: {
          title: "表单管理",
        },
        component: () => import("@views/platform/workorder-set/form/index"),
      },
      {
        path: "/workorder-form-edit",
        hidden: true,
        name: "workorder-form-edit",
        component: () => import("@/views/platform/workorder-set/form/edit"),
        meta: { title: "修改表单" },
      },
      {
        path: "/workorder-model",
        hidden: true,
        name: "workorder-model",
        component: () => import("@/views/platform/workorder-set/model/index"),
        meta: { title: "模型管理" },
      },
      {
        path: "/workorder-flowableModelEdit",
        hidden: true,
        name: "workorder-flowableModelEdit",
        component: () => import("@/views/platform/workorder-set/model/edit"),
        meta: { title: "流程设计" },
      },
      {
        path: "/workorder-processDefinition",
        hidden: true,
        name: "workorder-processDefinition",
        component: () =>
          import("@/views/platform/workorder-set/processDefinition/index"),
        meta: { title: "流程定义" },
      },
      {
        path: "/workorder-processInstance",
        hidden: true,
        name: "workorder-processInstance",
        component: () =>
          import("@/views/platform/workorder-set/processInstance"),
        meta: { title: "流程实例" },
      },
      {
        path: "/workorder-task",
        hidden: true,
        name: "workorder-task",
        component: () => import("@/views/platform/workorder-set/task"),
        meta: { title: "任务管理" },
      },
    ],
  },
  {
    path: "workorder-launch",
    component: BridgeLayout,
    meta: {
      title: "提交工单",
    },
    children: [
      {
        path: "",
        name: "workorder-launch",
        meta: {},
        component: () => import("@views/workorder-launch/index"),
      },
      {
        path: "/myProcess",
        name: "workorder-myProcess",
        meta: {
          title: "我的汇总",
        },
        component: () => import("@views/platform/workorder-set/myProcess"),
      },
      {
        path: "/myProcessQuery",
        name: "workorder-myProcessQuery",
        meta: {
          title: "我的流程",
        },
        component: () => import("@views/platform/workorder-set/myProcessQuery"),
      },
      {
        path: "/startMyProcess",
        name: "workorder-startMyProcess",
        meta: {
          title: "发起流程",
        },
        component: () => import("@views/platform/workorder-set/startMyProcess"),
      },
      {
        path: "/taskTodo",
        name: "workorder-taskTodo",
        meta: {
          title: "我的待办",
        },
        component: () => import("@views/platform/workorder-set/taskTodo"),
      },
      {
        path: "/taskDone",
        name: "workorder-taskDone",
        meta: {
          title: "我的已办",
        },
        component: () => import("@views/platform/workorder-set/taskDone"),
      },
    ],
  },
  {
    path: "division",
    name: "division",
    meta: {
      title: "区划管理",
    },
    component: () => import("@views/platform/division/index"),
  },
  {
    path: "/applicationMarket",
    meta: {
      // title: "应用市场",
      title:"软件共享仓库",
    },
    component: BridgeLayout,
    children: [
      {
        path: "",
        name: "applicationMarket",
        meta: {
          iconShow: true,
        },
        component: () =>
          import(/* webpackChunkName: "views" */ "@views/applicationMarket/index"),
      },
      {
        path: "app-dev",
        meta: {
          title: "开发者中心",
        },
        component: BridgeLayout,
        children: [
          {
            path: "",
            name: "app-dev",
            meta: {},
            component: () =>
              import(/* webpackChunkName: "views" */ "@views/unit/app/app-dev/index"),
          },
          {
            path: "upload",
            name: "app-upload",
            meta: {
              title: "应用新增",
            },
            component: () =>
              import(/* webpackChunkName: "views" */ "@views/unit/app/app-dev/upload"),
          },
          {
            path: "register",
            name: "app-register",
            meta: {
              title: "应用注册",
            },
            component: () =>
              import(/* webpackChunkName: "views" */ "@views/unit/app/app-dev/register"),
          },
          {
            path: "icon",
            name: "app-icon",
            meta: {
              title: "图标库",
            },
            component: () =>
              import(/* webpackChunkName: "views" */ "@views/unit/app/app-dev/icon"),
          },
          {
            path: "deploy",
            name: "app-deploy",
            meta: {
              title: "应用部署",
            },
            component: () =>
              import(/* webpackChunkName: "views" */ "@views/unit/app/app-dev/deploy"),
          },
          {
            path: "release",
            name: "app-release",
            meta: {
              title: "应用发布",
            },
            component: () =>
              import(/* webpackChunkName: "views" */ "@views/unit/app/app-dev/release"),
          },
          {
            path: "view",
            name: "app-view",
            meta: {
              title: "应用查看",
            },
            component: () =>
              import(/* webpackChunkName: "views" */ "@views/unit/app/app-dev/view"),
          },
          {
            path: "edit",
            name: "app-edit",
            meta: {
              title: "应用编辑",
            },
            component: () =>
              import(/* webpackChunkName: "views" */ "@views/unit/app/app-dev/edit"),
          },
          {
            path: "rerelease",
            name: "app-rerelease",
            meta: {
              title: "重新发布",
            },
            component: () =>
              import(/* webpackChunkName: "views" */ "@views/unit/app/app-rerelease/index"),
          },
        ],
      },
      {
        path: "applicationMarket-view",
        name: "applicationMarket-view",
        meta: {
          title: "应用查看",
        },
        component: () =>
          import(/* webpackChunkName: "views" */ "@views/applicationMarket/jobView/index"),
      },
      {
        path: "applicationMarket-unitView",
        name: "applicationMarket-unitView",
        meta: {
          title: "应用查看",
        },
        component: () =>
          import(/* webpackChunkName: "views" */ "@views/applicationMarket/unitView/index"),
      },
      {
        path: "job-app-center",
        name: "job-app-center",
        meta: {
          title: "集团应用市场",
        },
        component: () =>
          import(/* webpackChunkName: "views" */ "@views/applicationMarket/appCenter/index"),
      },
      {
        path: "unit-app-center",
        name: "unit-app-center",
        meta: {
          title: "单位应用市场",
        },
        component: () =>
          import(/* webpackChunkName: "views" */ "@views/applicationMarket/appCenter/index"),
      },
    ],
  },
];
export default platformRouter;
