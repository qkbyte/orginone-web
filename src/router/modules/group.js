import BridgeLayout from "@layout/BridgeLayout/index";

const groupRouter = {
  path: "group/index",
  name: "group",
  meta: {
    title: "集团管理",
    breadcrumb: false,
  },
  component: BridgeLayout,
  children: [
    {
      path: "group-member",
      meta: {
        title: "成员管理",
      },
      component: BridgeLayout,
      children: [
        {
          path: "",
          name: "group-member",
          meta: {},
          children: [],
          component: () =>
            import(/* webpackChunkName: "views" */ "@views/group/group-member/index"),
        },
        {
          path: "group-member-announce",
          name: "group-member-announce",
          meta: {
            title: "发布公告",
          },
          component: () =>
            import(/* webpackChunkName: "views" */ "@views/group/group-member/TheAnnounceIndex"),
        },
        {
          path: "check-apply",
          name: "check-apply",
          meta: {
            title: "查看申请列表",
          },
          component: () =>
            import(/* webpackChunkName: "views" */ "@views/group/group-member/check-apply/index"),
        },
        {
          path: "group-import",
          name: "group-import",
          meta: {
            title: "集团单位导入",
          },
          children: [],
          component: () =>
            import(/* webpackChunkName: "views" */ "@views/group/group-member/check-apply/TheDeptImport"),
        },
      ],
    },
    {
      path: "organization",
      meta: {
        title: "组织管理",
      },
      component: BridgeLayout,
      children: [
        {
          path: "",
          name: "organization",
          meta: {},
          children: [],
          component: () =>
            import(/* webpackChunkName: "views" */ "@views/group/organization/index"),
        },
        {
          path: "organization-department",
          meta: {
            title: "组织维护",
          },
          component: BridgeLayout,
          children: [
            {
              path: "",
              name: "organization-department",
              meta: {},
              component: () =>
                import(/* webpackChunkName: "views" */ "@views/group/organization/components/department/Department"),
            },
            {
              path: "organization-import",
              name: "organization-import",
              meta: {
                title: "集团关系导入",
              },
              children: [],
              component: () =>
                import(/* webpackChunkName: "views" */ "@views/group/organization/components/department/TheDeptImport"),
            },
          ],
        },
        {
          path: "organization-position",
          meta: {
            title: "性质维护",
          },
          component: BridgeLayout,
          children: [
            {
              path: "",
              name: "organization-position",
              component: () =>
                import(/* webpackChunkName: "views" */ "@views/group/organization/components/position/Position"),
            },
            {
              path: "organization-import",
              name: "organization-import",
              meta: {
                title: "集团关系导入",
              },
              children: [],
              component: () =>
                import(/* webpackChunkName: "views" */ "@views/group/organization/components/department/TheDeptImport"),
            },
          ],
        },
      ],
    },
    {
      path: "group-info",
      meta: {
        title: "集团信息",
      },
      component: BridgeLayout,
      children: [
        {
          path: "",
          name: "group-info",
          meta: {},
          children: [],
          component: () =>
            import(/* webpackChunkName: "views" */ "@views/group/group-info/index"),
        },
        {
          path: "group-apply-group",
          name: "group-apply-group",
          meta: {
            title: "上级集团申请记录",
          },
          component: () =>
            import(/* webpackChunkName: "views" */ "@views/group/group-info/group-apply/index"),
        },
      ],
    },
  ],
};
export default groupRouter;
