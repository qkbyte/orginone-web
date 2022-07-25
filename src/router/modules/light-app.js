import Layout from "@layout/BaseLayout/index";
import BridgeLayout from "@layout/BridgeLayout/index";

const lightAppRouter = {
    path: "/light-app",
    component: Layout,
    redirect: "/index",
    children: [
        {
            path: "flow",
            name: "flow",
            meta: {
                title: "流程设计",
            },
            component: () =>
                import(/* webpackChunkName: "views" */ "@views/light-app/flow"),
        },
        {
            path: "demo_application",
            name: "apply_demo_pro",
            meta: {
                title: "申请列表demo",
            },
            component: () =>
                import(/* webpackChunkName: "views" */ "@views/light-app/applicationDemo/applicationInstance/index"),
        },
        {
            path: "demo_pro",
            name: "demo_pro",
            meta: {
                title: "数据提供demo",
            },
            component: () =>
                import(/* webpackChunkName: "views" */ "@views/light-app/applicationDemo/pro"),
        },
        {
            path: "demo_form",
            name: "demo_form",
            meta: {
                title: "表单显示demo",
            },
            component: () =>
                import(/* webpackChunkName: "views" */ "@views/light-app/applicationDemo/form"),
        },
        {
            path: "flow_index",
            name: "flow_index",
            meta: {
                title: "流程设计index",
            },
            component: () =>
                import(/* webpackChunkName: "views" */ "@views/light-app/flow_datagrid/index"),
        },
        {
            path: "form_index",
            name: "form_index",
            meta: {
                title: "表单设计index",
            },
            component: () =>
                import(/* webpackChunkName: "views" */ "@views/light-app/form_datagrid/index"),
        },
        {
            path: "message",
            name: "light_message",
            meta: {
                title: "轻应用消息",
            },
            component: () =>
                import(/* webpackChunkName: "views" */ "@views/light-app/Message/index"),
        },
        // {
        //     path: "issue_form",
        //     name: "issue_form",
        //     meta: {
        //         title: "发布表单",
        //     },
        //     component: () =>
        //         import(/* webpackChunkName: "views" */ "@views/light-app/issue_form/index"),
        // },
        // {
        //     path: "approvalTemplate",
        //     name: "approvalTemplate",
        //     meta: {
        //         title: "业务模板",
        //     },
        //     component: () =>
        //         import(/* webpackChunkName: "views" */ "@views/light-app/ApprovalTemplate/index"),
        // },
        // {
        //     path: "template",
        //     name: "template",
        //     redirect: "/light-app/approvalTemplate",
        //     meta: {
        //         title: "业务模板",
        //     },
        //     component: BridgeLayout,
        //     children: [
        //         {
        //             path: "templateDesign",
        //             name: "templateDesign",
        //             meta: {
        //                 title: "业务模板设计",
        //             },
        //             component: () =>
        //                 import(/* webpackChunkName: "views" */ "@views/light-app/ApprovalTemplate/TemplateDesign/index"),
        //         },
        //         {
        //             path: "templateItem",
        //             name: "templateItem",
        //             meta: {
        //                 title: "审批业务详细",
        //             },
        //             component: () =>
        //                 import(/* webpackChunkName: "views" */ "@views/light-app/ApprovalItem/index"),
        //         },
        //     ],
        // },
        //
        // {
        //     path: "approvalIssue",
        //     name: "approvalIssue",
        //     meta: {
        //         title: "审批业务发起",
        //     },
        //     component: () =>
        //         import(/* webpackChunkName: "views" */ "@views/light-app/ApprovalIssue/index"),
        // },
        // {
        //     path: "approvalList",
        //     name: "approvalList",
        //     meta: {
        //         title: "审批业务列表",
        //     },
        //     component: () =>
        //         import(/* webpackChunkName: "views" */ "@views/light-app/ApprovalList/index"),
        // },
        // {
        //     path: "approval",
        //     name: "approval",
        //     redirect: "/light-app/approvalList",
        //     meta: {
        //         title: "审批业务列表",
        //     },
        //     component: BridgeLayout,
        //     children: [
        //         {
        //             path: "approvalDesign",
        //             name: "approvalDesign",
        //             meta: {
        //                 title: "业务流程设计",
        //             },
        //             component: () =>
        //                 import(/* webpackChunkName: "views" */ "@views/light-app/ApprovalDesign/index"),
        //         },
        //         {
        //             path: "approvalItem",
        //             name: "approvalItem",
        //             meta: {
        //                 title: "审批业务详细",
        //             },
        //             component: () =>
        //                 import(/* webpackChunkName: "views" */ "@views/light-app/ApprovalItem/index"),
        //         },
        //         // {
        //         //   path: "bridgeItem",
        //         //   redirect: "/app/index/approval/approvalItem",
        //         //   name: "bridgeItem",
        //         //   meta: {
        //         //     title: "自建审批-详细",
        //         //   },
        //         //   component:BridgeLayout,
        //         //   children: [
        //         //     {
        //         //       path: "approvalIssue",
        //         //       name: "approvalIssue",
        //         //       meta: {
        //         //         title: "自建审批-发起",
        //         //       },
        //         //       component: () =>
        //         //         import(/* webpackChunkName: "views" */ "@views/light-app/ApprovalIssue/index"),
        //         //     },
        //         //   ],
        //         // },
        //     ],
        // },
        // {
        //     path: "write_form",
        //     name: "write_form",
        //     meta: {
        //         title: "审批内容",
        //     },
        //     component: () =>
        //         import(/* webpackChunkName: "views" */ "@views/light-app/write_form/index"),
        // },
        // {
        //     path: "light_history",
        //     name: "light_history",
        //     meta: {
        //         title: "历史审批",
        //     },
        //     component: () =>
        //         import(/* webpackChunkName: "views" */ "@views/light-app/ApprovalHistory/index"),
        // },
        {
            path: "index",
            name: "index",
            redirect: "/approvalUserList/index",
            meta: {
                title: "发起审批",
                breadcrumb: false,
            },
            component: BridgeLayout,
            children: [{
                path: "issue_form",
                name: "issue_form",
                meta: {
                    title: "发布表单",
                },
                component: () =>
                    import(/* webpackChunkName: "views" */ "@views/light-app/issue_form/index"),
            },
                {
                    path: "approvalTemplate",
                    name: "approvalTemplate",
                    meta: {
                        title: "业务模板",
                    },
                    component: () =>
                        import(/* webpackChunkName: "views" */ "@views/light-app/ApprovalTemplate/index"),
                },
                {
                    path: "template",
                    name: "template",
                    redirect: "/light-app/index/approvalTemplate",
                    meta: {
                        title: "业务模板",
                    },
                    component: BridgeLayout,
                    children: [
                        {
                            path: "templateDesign",
                            name: "templateDesign",
                            meta: {
                                title: "业务模板设计",
                            },
                            component: () =>
                                import(/* webpackChunkName: "views" */ "@views/light-app/ApprovalTemplate/TemplateDesign/index"),
                        },
                        {
                            path: "templateItem",
                            name: "templateItem",
                            meta: {
                                title: "审批业务详细",
                            },
                            component: () =>
                                import(/* webpackChunkName: "views" */ "@views/light-app/ApprovalItem/index"),
                        },
                    ],
                },

                {
                    path: "approvalIssue",
                    name: "approvalIssue",
                    meta: {
                        title: "审批业务发起",
                    },
                    component: () =>
                        import(/* webpackChunkName: "views" */ "@views/light-app/ApprovalIssue/index"),
                },
                {
                    path: "approvalList",
                    name: "approvalList",
                    meta: {
                        title: "审批业务列表",
                    },
                    component: () =>
                        import(/* webpackChunkName: "views" */ "@views/light-app/ApprovalList/index"),
                },
                {
                    path: "approvalComplete",
                    name: "approvalComplete",
                    meta: {
                        title: "历史详情",
                    },
                    component: () =>
                        import(/* webpackChunkName: "views" */ "@views/light-app/ApprovalComplete/index"),
                },
                {
                    path: "approval",
                    name: "approval",
                    redirect: "/light-app/index/approvalList",
                    meta: {
                        title: "审批业务列表",
                    },
                    component: BridgeLayout,
                    children: [
                        {
                            path: "approvalDesign",
                            name: "approvalDesign",
                            meta: {
                                title: "业务流程设计",
                            },
                            component: () =>
                                import(/* webpackChunkName: "views" */ "@views/light-app/ApprovalDesign/index"),
                        },
                        {
                            path: "approvalItem",
                            name: "approvalItem",
                            meta: {
                                title: "审批业务详细",
                            },
                            component: () =>
                                import(/* webpackChunkName: "views" */ "@views/light-app/ApprovalItem/index"),
                        },
                        // {
                        //   path: "bridgeItem",
                        //   redirect: "/app/index/approval/approvalItem",
                        //   name: "bridgeItem",
                        //   meta: {
                        //     title: "自建审批-详细",
                        //   },
                        //   component:BridgeLayout,
                        //   children: [
                        //     {
                        //       path: "approvalIssue",
                        //       name: "approvalIssue",
                        //       meta: {
                        //         title: "自建审批-发起",
                        //       },
                        //       component: () =>
                        //         import(/* webpackChunkName: "views" */ "@views/light-app/ApprovalIssue/index"),
                        //     },
                        //   ],
                        // },
                    ],
                },
                {
                    path: "write_form",
                    name: "write_form",
                    meta: {
                        title: "审批内容",
                    },
                    component: () =>
                        import(/* webpackChunkName: "views" */ "@views/light-app/write_form/index"),
                },
                {
                    path: "light_history",
                    name: "light_history",
                    meta: {
                        title: "历史审批",
                    },
                    component: () =>
                        import(/* webpackChunkName: "views" */ "@views/light-app/ApprovalHistory/index"),
                },
            ]
        },
        {
            path: "form",
            name: "form",
            meta: {
                title: "表单设计",
            },
            component: () =>
                import(/* webpackChunkName: "views" */ "@views/light-app/form"),
        },


    ],
};
export default lightAppRouter;
