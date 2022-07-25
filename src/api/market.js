import request from "@/router/axios";

/**
 * @method  新增应用
 * @param {*} data -传入应用基本信息、应用菜单、应用角色
 */
const addApp = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapp/submitAll",
    method: "POST",
    data: data,
  });
};

/*
 集团取消分发给租户的应用权限
*/
const groupCancelAuth = (data) => {
  return request({
    method: "POST",
    url:
      "/dev-api/asset-market/marketappgroupdistribution/unitCancelDistribute",
    data: data,
  });
};

/*
 修改集团启用停用状态
*/
const updateGroupUseStatus = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapppurchase/updateGroupUseStatus",
    method: "POST",
    data: data,
  });
};

/*
 修改租户启用停用状态
*/
const updateTenantUseStatus = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapppurchase/updateTenantUseStatus",
    method: "POST",
    data: data,
  });
};

/*
  撤回集团权限
*/
const withdrawGroupAuthority = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapppurchase/withdrawGroupAuthority",
    method: "POST",
    data: data,
  });
};

/*
  撤回租户权限
*/
const withdrawTenantAuthority = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapppurchase/withdrawTenantAuthority",
    method: "POST",
    data: data,
  });
};

/*
 * 集团应用已分配节点id列表
 */
const distributeAppTenantList = (data) => {
  return request({
    url: "/dev-api/asset-market/marketappgroupdistributionrelation/getRelation",
    method: "GET",
    params: {
      appId: data.appId,
      groupId: data.groupId,
    },
  });
};

/**
 * 获取集团的某个应用已分配单位列表
 * @param {String} appId -被分配的集团应用Id
 * @param {String} groupId -分配的集团Id
 */
const distributeGroupAppTenantList = ({
  current,
  size,
  unitName,
  appId,
  groupId,
} = data) => {
  return request({
    url:
      "/dev-api/asset-market/marketappgroupdistribution/distributeAppTenantList",
    method: "GET",
    params: {
      current,
      size,
      unitName,
      appId,
      groupId,
    },
  });
};

//Todo 待废弃
const getAppMenuList = (data) => {
  return request({
    url: "/dev-api/asset-market/marketmenu/getMenuList",
    method: "GET",
    params: {
      tenantId: data.tenantId,
      userId: data.userId,
      platform: 1,
    },
  });
};

/**
 * @method  获取所有应用列表
 * @param {Number} saleStatus -应用状态
 */
const getAppList = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapp/list",
    method: "GET",
    params: {
      appName: data.appName,
      status: data.status,
      current: data.current,
      size: data.size,
    },
  });
};

/**
 * @method  获取所有应用列表 不分页
 * @param {Number} saleStatus -应用状态
 */
const getAppListAll = () => {
  return request({
    url: "/dev-api/asset-market/marketapp/listAll",
    method: "GET",
  });
};

/**
 * @method  平台待审核应用列表
 * @param {Number} saleStatus -应用状态
 */
const getCheckAppList = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapp/list/check",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      appName: data.appName,
      count: data.count,
    },
  });
};

/**
 * @method  获取所有上架应用列表带分页
 * @param {Number} saleStatus -应用状态
 */
const getOnSaleAppList = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapppurchase/listVO",
    method: "GET",
    params: {
      saleStatus: data.saleStatus,
      current: data.current,
      size: data.size,
      appName: data.appName,
    },
  });
};

/**
 * @method  获取所有上架集团应用列表带分页
 * @param {Number} saleStatus -应用状态
 */
const getOnSaleGroupAppList = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapppurchase/listByGroupIdVO",
    method: "GET",
    params: {
      groupId: data.groupId,
      saleStatus: data.saleStatus,
      current: data.current,
      size: data.size,
      appName: data.appName,
    },
  });
};
/**
 * @method  获取某个租户开发的应用列表带分页
 */
const getAppListByTenantId = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapp/list",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      tenantId: data.tenantId,
      appName: data.appName,
    },
  });
};

/**
 * @method  删除应用
 * @param {String} ids -应用id
 */
const deleteAppByAppId = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapp/remove",
    method: "POST",
    data: data,
  });
};

/**
 * @method  获取应用详情
 * @param {String} id -应用id
 */
const getAppInfo = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapp/getAll",
    method: "GET",
    params: {
      id: data.id,
    },
  });
};
const getAllAppInfo = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapp/getAllApp",
    method: "GET",
    params: {
      id: data.id,
    },
  });
};

//应用冻结接口
const getfreezeApp = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapp/freezeApp",
    method: "GET",
    params: {
      ids: data.ids,
    },
  });
};

/**
 * @method  获取租户内已订阅和被分配的应用列表带分页
 * @param {String} id -应用id
 */
const getCanUseAppIdList = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapp/listByPurchaseTenantId",
    method: "GET",
    params: {
      tenantId: data.tenantId,
      current: data.current,
      size: data.size,
      appName: data.appName,
    },
  });
};

/**
 * @method  获取已上架应用数
 */
const getOnSaleAppNum = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapp/getOnSaleAppNum",
    method: "GET",
  });
};

/**
 * @method  获取已分配用户数
 */
const getDistributeUserNum = (data) => {
  return request({
    url:
      "/dev-api/asset-market/marketapproledistributionnew/getDistributeUserNum",
    method: "GET",
  });
};

/**
 * @method  订阅应用
 * @param {String} appId -应用id
 * @param {String} tenantId -租户id
 */
const purchaseApp = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapppurchase/submit",
    method: "POST",
    data: data,
  });
};

const purchaseByGroups = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapppurchase/purchaseByGroups",
    method: "POST",
    data: data,
  });
};

/**
 * @method  订阅应用（目标用户分类）
 * @param {String} appId -应用id
 * @param {String} tenantId -租户id
 */
const AppListTarget = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapppurchase/listUnitAndPersonalVO",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      name: data.name,
    },
  });
};

/**
 * @method  单位分配应用权限
 * @param {String} appId -应用id
 * @param {String} roleIds -角色id
 * @param {String} userId -用户id
 * @param {String} jobId -岗位id
 * @param {String} agencyId -部门id
 */
const tenantDistributeApp = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapproledistributionnew/submit/v2",
    method: "POST",
    data: data,
  });
};

/**
 * @method  设置应用上架
 * @param {*} data -传入应用id
 */
const updateAppOnSale = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapp/setOnSale",
    method: "POST",
    data: data,
  });
};

/**
 * @method  设置应用下架
 * @param {*} data -传入应用id
 */
const updateAppOffSale = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapp/setOffSale",
    method: "POST",
    data: data,
  });
};

/**
 * @method  取消订阅应用
 * @param {*} data -传入应用id或租户id
 */
const unsubscribeApp = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapppurchase/unsubscribe",
    method: "POST",
    data: data,
  });
};

/**
 * @method  获取已分配用户
 * @param {*} data -传入应用的角色id
 */
const getHasDestributedUserByAppRoleId = (data) => {
  return request({
    url:
      "/dev-api/asset-market/marketapproledistributionnew/getDistributionUser",
    method: "GET",
    params: {
      roleId: data.roleId,
    },
  });
};

/**
 * @method  获取已分配部门
 * @param {*} data -传入应用的角色id
 */
const getHasDestributedAgencyByAppRoleId = (data) => {
  return request({
    url:
      "/dev-api/asset-market/marketapproledistributionnew/getDistributedAgency",
    method: "GET",
    params: {
      tenantCode: data.tenantCode,
      appId: data.appId,
      roleId: data.roleId,
    },
  });
};

/**
 * @method  获取已分配岗位
 * @param {*} data -传入应用的角色id
 */
const getHasDestributedJobByAppRoleId = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapproledistributionnew/getDistributedJob",
    method: "GET",
    params: {
      tenantCode: data.tenantCode,
      appId: data.appId,
      roleId: data.roleId,
    },
  });
};

/**
 * @method  审核应用
 * @param {Number} checkStatus -审核结果标识
 * @param {String} ids -应用id
 */
const checkApp = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapp/appCheck",
    method: "POST",
    data: data,
  });
};

/**
 * @method 获取应用申请列表（分页）
 * @param {*} data
 */
const getAppAuthApplyList = (data) => {
  return request({
    url: "/dev-api/asset-market/marketappapply/list",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      status: data.status,
    },
  });
};

/**
 * @method 修改应用申请信息
 * @param {*} data
 */
const updateApplyInfo = (data) => {
  return request({
    url: "/dev-api/asset-market/marketappapply/updateApply",
    method: "GET",
    params: {
      id: data.id,
      appName: data.appName,
      appDescription: data.appDescription,
    },
  });
};

/**
 * @method 获取应用授权key和secret
 * @param {*} data
 */
const getAppKey = (data) => {
  return request({
    url: "/dev-api/asset-market/marketappapply/getApplyDetail",
    method: "GET",
    params: {
      id: data.id,
    },
  });
};

/**
 * @method 获取集团已购应用带分页
 * @param {*} data
 */
const getGroupAppList = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapp/listByPurchaseGroupId",
    method: "GET",
    params: {
      groupId: data.groupId,
      current: data.current,
      size: data.size,
      appName: data.appName,
    },
  });
};

/**
 * @method 订阅集团应用
 * @param {*} data
 */
const purchaseGroupApp = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapppurchase/submit",
    method: "POST",
    data: {
      tenantId: data.tenantId,
      groupId: data.groupId,
      appId: data.appId,
    },
  });
};

/**
 * @method 集团分配应用给租户
 * @param {*} data
 */
const distributionGroupApp = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/groupAppDistribute",
    method: "POST",
    data: data,
  });
};

/**
 * @method 退订集团应用
 * @param {*} data
 */
const unsubscribeGroupApp = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapppurchase/unitunsubscribe",
    method: "POST",
    data: data,
  });
};

/**
 * @method 注册应用
 * @param {*} data
 */
const registerApp = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapp/submitFirst",
    method: "POST",
    data: data,
  });
};

/**
 * @method 部署应用
 * @param {*} data
 */
const deployApp = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapp/submitSecond",
    method: "POST",
    data: data,
  });
};

/**
 * @method 发布应用
 * @param {*} data
 */
const releaseApp = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapp/submitThird",
    method: "POST",
    data: data,
  });
};

/**
 * @method 获取已购买当前应用的集团列表
 * @param {*} data -appId
 */
const appPurchaseGroupList = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapppurchase/purchaseAppGroupList",
    method: "GET",
    params: {
      appId: data.appId,
      current: data.current,
      size: data.size,
    },
  });
};

/**
 * @method 获取已购买当前应用的单位列表
 * @param {*} data -appId
 */
const appPurchaseTenantList = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapppurchase/purchaseAppTenantList",
    method: "GET",
    params: {
      appId: data.appId,
      current: data.current,
      size: data.size,
    },
  });
};

/**
 * @method 获取租户图标分页信息
 * @param {*} data -appId
 */
const getTenanticonListPage = (data) => {
  return request({
    url: "/dev-api/asset-system/tenanticon/listPage",
    method: "GET",
    params: {
      tenantIcon: data.tenantIcon,
      current: data.current,
      size: data.size,
    },
  });
};

/**
 * @method 获取租户图标信息 （不分页）
 * @param {*} data -appId
 */
const getTenanticonList = (data) => {
  return request({
    url: "/dev-api/asset-system/tenanticon/list",
    method: "GET",
    params: {
      tenantIcon: data.tenantIcon,
    },
  });
};

/**
 * @method 图标上传或修改
 * @param {*} data
 */
const tenanticonSubmit = (data) => {
  return request({
    url: "/dev-api/asset-system/tenanticon/submitIcons",
    method: "POST",
    params: {
      urls: data.urls,
      tenantCode: data.tenantCode,
    },
  });
};

/**
 * @method 图标删除
 * @param {*} data
 */
const tenanticonRemove = (data) => {
  return request({
    url: "/dev-api/asset-system/tenanticon/remove",
    method: "POST",
    params: {
      ids: data.ids,
    },
  });
};

/**
 * @method  获取应用已分配的人员列表
 * @param {*} appId -传入应用id
 */
const getDistributedPersonListByAppId = (data) => {
  return request({
    url:
      "/dev-api/asset-market/marketapproledistributionnew/getDistributedPersonListByAppId",
    method: "GET",
    params: {
      appId: data.appId,
      roleId: data.roleId,
    },
  });
};

/**
 * @method  获取应用已分配的所有人员列表
 * @param {*} appId -传入应用id
 */
const getAppDistributedRole = (data) => {
  return request({
    url:
      "/dev-api/asset-market/marketapproledistributionnew/getAppDistributedRole",
    method: "GET",
    params: {
      appId: data.appId,
      tenantCode: data.tenantCode,
    },
  });
};

//应用重新发布审核
const checkRedeploy = (data) => {
  return request({
    url: "/dev-api/asset-market/redeploy/checkRedeploy",
    method: "POST",
    data: data,
  });
};

// 是否可以删除角色
const isDeleteRole = (data) => {
  return request({
    url: "/dev-api/asset-market/redeploy/isDeleteRole",
    method: "GET",
    params: {
      roleName: data.roleName,
      appId: data.appId,
    },
  });
};

// 是否添加角色
const isAddRole = (data) => {
  return request({
    url: "/dev-api/asset-market/redeploy/isAddRole",
    method: "GET",
    params: {
      roleName: data.roleName,
      appId: data.appId,
    },
  });
};

//重新部署应用
const appRedeploy = (data) => {
  return request({
    url: "/dev-api/asset-market/redeploy/redeploy",
    method: "POST",
    data: data,
  });
};

// 是否已分配应用
const isDistributed = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapproledistributionnew/isDistributed",
    method: "GET",
    params: {
      appId: data.appId,
    },
  });
};

// 获取已分发应用
const distributionGetConfig = (data) => {
  return request({
    url: "/dev-api/asset-market/groupappdistributiondata/getConfig",
    method: "GET",
    params: {
      appId: data.appId,
      groupId: data.groupId,
    },
  });
};

// 获取进度条id
const groupAppDistribute = (data) => {
  return request({
    url: "/dev-api/asset-system/async/groupAppDistribute",
    method: "POST",
    data: data.list,
    params: {
      groupId: data.groupId,
      appId: data.appId,
    },
  });
};

// 新增通知公告
const marketappnoticeSubmit = (data) => {
  return request({
    url: "/dev-api/asset-market/marketappnotice/submit",
    method: "POST",
    data: data,
  });
};
// 获取公告列表
const marketappnoticeList = (data) => {
  return request({
    url: "/dev-api/asset-market/marketappnotice/list",
    method: "GET",
    params: {
      groupOrUnit: data.groupOrUnit,
      current: data.current,
      noticeTitle: data.noticeTitle,
      size: data.size,
    },
  });
};

// 发布公告
const marketappnoticeReleaseNote = (data) => {
  return request({
    url: "/dev-api/asset-market/marketappnotice/releaseNote",
    method: "GET",
    params: {
      id: data.id,
    },
  });
};
// 下架公告
const marketappnoticeCancel = (data) => {
  return request({
    url: "/dev-api/asset-market/marketappnotice/cancelReleaseNote",
    method: "GET",
    params: {
      id: data.id,
    },
  });
};

// 删除公告
const marketappnoticeRemove = (data) => {
  return request({
    url: "/dev-api/asset-market/marketappnotice/remove",
    method: "POST",
    data: data,
  });
};

// 获取预警列表
const marketappalertList = (data) => {
  return request({
    url: "/dev-api/asset-market/marketappalert/list",
    method: "GET",
    params: {
      alertTitle: data.alertTitle,
      current: data.current,
      size: data.size,
    },
  });
};
// 新增预警
const marketappalertSubmit = (data) => {
  return request({
    url: "/dev-api/asset-market/marketappalert/submit",
    method: "POST",
    data: data,
  });
};
// 删除预警
const marketappalertRemove = (data) => {
  return request({
    url: "/dev-api/asset-market/marketappalert/remove",
    method: "POST",
    data: data.ids,
  });
};

// 设为已读
const marketappalertCheckAlert = (data) => {
  return request({
    url: "/dev-api/asset-market/marketappalert/checkAlert",
    method: "GET",
    params: {
      id: data.id,
    },
  });
};
// 获取我的通知
const marketappnoticeMyAlertList = (data) => {
  console.log("data", data);
  return request({
    url: "/dev-api/asset-market/marketappnotice/myNoticeList",
    method: "POST",
    data: data,
  });
};

// 获取我的预警
const marketappalertMyAlertList = (data) => {
  console.log("data", data);
  return request({
    url: "/dev-api/asset-market/marketappalert/myAlertList",
    method: "POST",
    params: {
      current: data.current,
      size: data.size,
    },
    data: data.jsonObject,
  });
};

const getMenuList = (data) => {
  return request({
    url: "/dev-api/asset-market/marketmenu/getMenuList",
    method: "GET",
    params: {
      userId: data.userId,
      tenantId: data.tenantCode,
      platform: 1,
    },
  });
};

const getRedeployAppList = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapp/getRedeployAppList",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      flag: data.flag,
      appName: data.appName,
    },
  });
};

const deleteApp = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapp/deleteApp",
    method: "GET",
    params: {
      appId: data.appId,
    },
  });
};

const cancelApply = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapp/cancelApply",
    method: "POST",
    data: data,
  });
};

const SMSList = (data) => {
  return request({
    url: "/dev-api/asset-message/sms/listPage",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
    },
  });
};

const SMSSubmit = (data) => {
  return request({
    url: "/dev-api/asset-message/sms/submit",
    method: "POST",
    data: data,
  });
};

const SMSRemove = (data) => {
  return request({
    url: "/dev-api/asset-message/sms/remove",
    method: "POST",
    data: data,
  });
};

const SMSRecordList = (data) => {
  return request({
    url: "/dev-api/asset-message/smsrecord/listPage",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
    },
  });
};

const SMSRecordSubmit = (data) => {
  return request({
    url: "/dev-api/asset-message/smsrecord/submit",
    method: "POST",
    data: data,
  });
};

const SMSRecordRemove = (data) => {
  return request({
    url: "/dev-api/asset-message/smsrecord/remove",
    method: "POST",
    data: data,
  });
};

const marketappList = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapp/list",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      appName: data.name,
      saleStatus: data.saleStatus,
    },
  });
};

const getAppPurchaseConfig = (data) => {
  return request({
    url: "/dev-api/asset-market/marketapppurchase/getAppPurchaseConfig",
    method: "GET",
    params: {
      appId: data.appId,
    },
  });
};

const sortUserMenu = (data) => {
  return request({
    url: "/dev-api/asset-market/marketmenuusersort/sortUserMenu",
    method: "POST",
    data: data,
  });
};

const sortUserMenuByUnit = (data) => {
  return request({
    url: "/dev-api/asset-market/marketmenuusersort/sortUserMenuByUnit",
    method: "POST",
    data: data,
  });
};
export {
  addApp,
  registerApp,
  deployApp,
  releaseApp,
  checkApp,
  getAppList,
  getAppListAll,
  getAppMenuList,
  getCheckAppList,
  getGroupAppList,
  deleteAppByAppId,
  getAppInfo,
  getOnSaleAppList,
  getOnSaleGroupAppList,
  getAppListByTenantId,
  distributionGroupApp,
  getHasDestributedUserByAppRoleId,
  getHasDestributedAgencyByAppRoleId,
  getHasDestributedJobByAppRoleId,
  getCanUseAppIdList,
  getAppAuthApplyList,
  updateApplyInfo,
  getAppKey,
  purchaseApp,
  purchaseGroupApp,
  tenantDistributeApp,
  updateAppOnSale,
  updateAppOffSale,
  unsubscribeApp,
  unsubscribeGroupApp,
  appPurchaseGroupList,
  appPurchaseTenantList,
  getOnSaleAppNum,
  getDistributeUserNum,
  groupCancelAuth,
  updateGroupUseStatus,
  updateTenantUseStatus,
  distributeAppTenantList,
  distributeGroupAppTenantList,
  withdrawGroupAuthority,
  withdrawTenantAuthority,
  AppListTarget,
  getTenanticonListPage,
  tenanticonSubmit,
  tenanticonRemove,
  getTenanticonList,
  getDistributedPersonListByAppId,
  getAllAppInfo,
  checkRedeploy,
  isDeleteRole,
  appRedeploy,
  isAddRole,
  isDistributed,
  distributionGetConfig,
  getAppDistributedRole,
  groupAppDistribute,
  marketappnoticeSubmit,
  marketappnoticeList,
  marketappnoticeReleaseNote,
  marketappnoticeCancel,
  marketappnoticeRemove,
  marketappalertList,
  marketappalertSubmit,
  marketappalertRemove,
  marketappalertCheckAlert,
  marketappnoticeMyAlertList,
  marketappalertMyAlertList,
  getMenuList,
  getRedeployAppList,
  deleteApp,
  cancelApply,
  SMSList,
  SMSSubmit,
  SMSRemove,
  SMSRecordList,
  SMSRecordSubmit,
  SMSRecordRemove,
  getfreezeApp,
  marketappList,
  getAppPurchaseConfig,
  sortUserMenu,
  sortUserMenuByUnit,
  purchaseByGroups,
};
