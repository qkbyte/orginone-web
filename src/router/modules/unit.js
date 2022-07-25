import BridgeLayout from "@layout/BridgeLayout/index";

const unitRouter = {
  path: "unit",
  name: "unit",
  meta: {
    title: "单位管理",
    breadcrumb: false,
  },
  component: BridgeLayout,
  children: [
    {
      path: "index/department",
      meta: {
        title: "部门岗位",
      },
      component: BridgeLayout,
      children: [
        {
          path: "",
          name: "department",
          meta: {
            iconShow: true,
          },
          component: () =>
            import(/* webpackChunkName: "views" */ "@views/unit/department/index"),
        },
        {
          path: "dept-manage",
          redirect: "/unit/index/bridge/dept-manage",
          meta: {
            title: "部门管理",
          },
          component: BridgeLayout,
          children: [
            {
              path: "",
              name: "dept-manage",
              meta: {},
              component: () =>
                import(/* webpackChunkName: "views" */ "@views/unit/department/components/department/Department"),
            },
            {
              path: "department-import",
              name: "department-import",
              meta: {
                title: "部门人员导入",
              },
              component: () =>
                import(/* webpackChunkName: "views" */ "@views/unit/department/components/department/DeptImport"),
            },
          ],
        },
        {
          path: "post-manage",
          meta: {
            title: "岗位管理",
          },
          component: BridgeLayout,
          children: [
            {
              path: "",
              name: "post-manage",
              component: () =>
                import(/* webpackChunkName: "views" */ "@views/unit/department/components/position/Position"),
            },
            {
              path: "position-import",
              name: "position-import",
              meta: {
                title: "岗位导入",
              },
              component: () =>
                import(/* webpackChunkName: "views" */ "@views/unit/department/components/position/PostImport"),
            },
            {
              path: "groupposition-import",
              name: "groupposition-import",
              meta: {
                title: "集团岗位导入",
              },
              component: () =>
                import(/* webpackChunkName: "views" */ "@views/unit/department/components/position/GroupPostImport"),
            },
          ],
        },
      ],
    },

    {
      path: "index/user",
      meta: {
        title: "人员管理",
      },
      component: BridgeLayout,
      children: [
        {
          path: "",
          name: "user",
          meta: {},
          component: () =>
            import(/* webpackChunkName: "views" */ "@views/unit/person/index"),
        },
        {
          path: "user-check",
          name: "user-check",
          meta: {
            title: "人员审核",
          },
          component: () =>
            import(/* webpackChunkName: "views" */ "@views/unit/person/person-check/index"),
        },
        {
          path: "person-import",
          name: "person-import",
          meta: {
            title: "人员导入",
          },
          component: () =>
            import(/* webpackChunkName: "views" */ "@views/unit/person/components/PersonImport"),
        },
        {
          path: "phone-import",
          name: "phone-import",
          meta: {
            title: "补充手机号",
          },
          component: () =>
            import(/* webpackChunkName: "views" */ "@views/unit/person/components/TelSuppleImport"),
        },
      ],
    },

    {
      path: "index/info",
      meta: {
        title: "单位信息",
      },
      component: BridgeLayout,
      children: [
        {
          path: "",
          name: "unit-info",
          meta: {},
          component: () =>
            import(/* webpackChunkName: "views" */ "@views/unit/unit-info/index"),
        },
        {
          path: "tenant-apply-group",
          name: "tenant-apply-group",
          meta: {
            title: "查看申请集团记录",
          },
          component: () =>
            import(/* webpackChunkName: "views" */ "@views/unit/unit-info/group-apply/index"),
        },
      ],
    },
    {
      path: "index/depart-person",
      meta: {
        title: "部门人员",
      },
      component: BridgeLayout,
      children: [
        {
          path: "",
          name: "depart-person",
          meta: {},
          component: () =>
            import(/* webpackChunkName: "views" */ "@views/unit/jobs/index"),
        },
        {
          path: "department-manage",
          meta: {
            title: "部门维护",
          },
          component: BridgeLayout,
          children: [
            {
              path: "",
              name: "department-manage",
              meta: {},
              component: () =>
                import(/* webpackChunkName: "views" */ "@views/unit/jobs/components/department/Department"),
            },
            {
              path: "departPerson-import",
              name: "departPerson-import",
              meta: {
                title: "部门人员导入",
              },
              component: () =>
                import(/* webpackChunkName: "views" */ "@views/unit/jobs/components/department/DeptImport"),
            },
          ],
        },
        {
          path: "department-person-announce",
          name: "department-person-announce",
          meta: {
            title: "发布公告",
          },
          component: () =>
            import(/* webpackChunkName: "views" */ "@views/unit/jobs/components/department/TheAnnounceIndex"),
        },
        {
          path: "department-person-import",
          name: "department-person-import",
          meta: {
            title: "人员导入",
          },
          component: () =>
            import(/* webpackChunkName: "views" */ "@views/unit/jobs/components/department/PersonImport"),
        },
        {
          path: "department-tel-import",
          name: "department-tel-import",
          meta: {
            title: "补充手机号",
          },
          component: () =>
            import(/* webpackChunkName: "views" */ "@views/unit/jobs/components/department/TelSuppleImport"),
        },
        {
          path: "department-person-audit",
          name: "department-person-audit",
          meta: {
            title: "人员审核",
          },
          component: () =>
            import(/* webpackChunkName: "views" */ "@views/unit/jobs/jobs-check/index"),
        },
        {
          path: "department-main-unit",
          name: "department-main-unit",
          meta: {
            title: "主单位导入",
          },
          component: () =>
            import(/* webpackChunkName: "views" */ "@views/unit/jobs/components/department/MainUnitImport"),
        },
      ],
    },
  ],
};
export default unitRouter;
