import request from "@/router/axios";

const dict = {
  GROUP_APPLYING_STATUS: 101, //租户申请加入集团-申请中
  GROUP_PASS_APPLY_STATUS: 102, //租户申请加入集团-已通过
  GROUP_REJECT_APPLY_STATUS: 103, //租户申请加入集团-已拒绝
  GROUP_CANCEL_APPLYING_STATUS: 104, //租户申请加入集团-已取消
  GROUP_ALL_APPLYING_STATUS: 105, //租户申请加入集团-所有状态
  GROUP_DONE_APPLYING_STATUS: 107, //租户申请加入集团-已完成状态
};

/**
 * @method  创建集团
 * @param {*} data -传入集团名称,集团描述
 */
const createGroup = (data) => {
  return request({
    url: "/dev-api/asset-system/allgroup/create/group",
    method: "POST",
    params: {
      groupName: data.groupName,
      groupDescription: data.groupDescription,
      shape: data.shape,
      groupId: data.groupId,
      groupCode: data.groupCode,
      tenantCode: data.tenantCode,
    },
  });
};

/**
 * @method  获取集团下租户树
 * @param {*} data -传入集团名称,集团描述
 */
const getGroupTenantTree = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/tenant/group/tree",
    method: "GET",
    params: {
      groupId: data.groupId,
    },
  });
};

/**
 * 获取组织中节点除自己及自己下级外的组织树
 * @param {*} data -传入集团名称,集团描述
 */
const getUpGroupTree = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/upGroup/tree",
    method: "GET",
    params: {
      groupId: data.groupId,
      sourceGroupId: data.sourceGroupId,
    },
  });
};

/**
 * @method  修改集团信息
 * @param {*} data -传入集团名称,集团描述
 */
const modifyGroupInfo = (data) => {
  return request({
    url: "/dev-api/asset-system/allgroup/submit",
    method: "POST",
    data: data.group,
  });
};

/**
 * @method  修改集团信息及上级节点
 * @param {*} data -传入集团名称,集团描述
 */
const modifyGroupInformation = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/update/group/information",
    method: "POST",
    params: {
      groupName: data.groupName,
      parentGroupId: data.parentGroupId,
      sonGroupId: data.sonGroupId,
      tenantCode: data.tenantCode,
      groupDescription: data.groupDescription,
      socialCreditCode: data.socialCreditCode,
    },
  });
};

/**
 * @method  批量调整租户上级集团
 * @param {*} data
 */
const updateFatherTenant = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/update/father/tenant",
    method: "POST",
    params: {
      groupId: data.groupId,
      tenantIds: data.tenantIds,
    },
  });
};

/**
 * @method  获取简易集团租户树
 * @param {*} data
 */
const simpleGroupTenantTree = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/simple/tenant/group/tree",
    method: "GET",
    params: {
      groupId: data.groupId,
    },
  });
};

/**
 * @method  租户加入集团(申请和取消)
 * @param {*} flag -审核状态（101-申请中，104-取消申请）
 */
const tenantApplyGroup = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/tenant/join/group",
    method: "POST",
    data: data,
  });
};

/**
 * @method  获取租户申请加入集团历史的列表（模糊搜索）
 * @param {*} flag -审核状态（101-申请中，104-取消申请）
 */
const getTenantApplyGroup = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/get/tenant/apply/record",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      flag: dict[data.flag],
    },
  });
};

/**
 * @method  获取租户已加入和管理的集团列表（模糊搜索）
 * @param {*} data -传入current,size,unitName
 */
const getJoinAndCreateGroupList = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/joined/control/groupList",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      groupName: data.groupName,
      tenantId: data.tenantId,
      type: data.type,
    },
  });
};

/**
 * @method  获取租户管理的集团列表
 */
const getManageGroupList = (data) => {
  return request({
    url: "/dev-api/asset-system/allgroup/list/now/tenantCode",
    method: "GET",
    params: {
      type: data.type,
    },
  });
};

/**
 * @method  获取集团下性质列表
 */
const getGroupProperties = (data) => {
  return request({
    url: "/dev-api/asset-system/properties/list",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      groupId: data.groupId,
      propertiesName: data.propertiesName,
    },
  });
};

/**
 * @method  批量删除性质
 */
const removeProperties = (data) => {
  return request({
    url: "/dev-api/asset-system/propertiesdistribution/removeProperties",
    method: "POST",
    params: {
      propertiesIds: data.propertiesIds,
    },
  });
};

/**
 * @method  增加某个单位的性质
 */
const addDistributeProperties = (data) => {
  return request({
    url:
      "/dev-api/asset-system/propertiesdistribution/add/distribute/properties",
    method: "POST",
    params: {
      propertiesId: data.propertiesId,
      tenantIds: data.tenantIds,
    },
  });
};

/**
 * @method  集团审核租户申请加入集团
 * @param {*} data -集团id
 */
const checkTenantApplyGroup = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/check/apply",
    method: "POST",
    data: data,
  });
};

/**
 * @method  集团移出下属租户（叶子节点）
 * @param {*} data -集团id
 */
const groupRemoveTenantLeaf = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/remove/leaf/tenants",
    method: "POST",
    data: data,
  });
};
/**
 * @method  集团移出下属租户
 * @param {*} data -集团id
 */
const groupRemoveTenant = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/remove/tenants",
    method: "POST",
    data: data,
  });
};

/**
 * @method 租户取消申请加入集团
 * @param {*} data
 */
const cancelApplyGroup = (data) => {
  return request({
    url: "/dev-api/asset-system/group/cancel/apply",
    method: "PUT",
    params: {
      groupId: data.groupId,
      tenantName: data.tenantName,
    },
  });
};

/**
 * @method 调整集团上级复制
 * @param {*} data
 */
const updateFatherGroup = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/update/father/group",
    method: "POST",
    params: {
      sonGroupId: data.sonGroupId,
      parentGroupId: data.parentGroupId,
    },
  });
};

/**
 * @method  获取集团详情
 * @param {*} data -集团id
 */
const getGroupInfo = (data) => {
  return request({
    url: "/dev-api/asset-system/group/detail",
    method: "GET",
    params: {
      id: data.groupId,
    },
  });
};

/**
 * @method  获取集团已加入的集团列表
 * @param {*} data -
 */
const getGroupAddGroupList = (data) => {
  return request({
    url: "/dev-api/asset-system/grouprelations/get/join/group",
    method: "GET",
    params: {
      size: data.size,
      current: data.current,
      groupId: data.groupId,
    },
  });
};

/**
 * @method  集团申请加入上级集团
 * @param {*} parentGroupId -加入的集团
 * @param {*} sonGroupId -申请的集团
 */
const groupApplyGroup = (data) => {
  return request({
    url: "/dev-api/asset-system/grouprelations/join/group",
    method: "POST",
    params: {
      parentGroupId: data.parentGroupId,
      sonGroupId: data.sonGroupId,
    },
  });
};

/**
 * @method  集团申请加入集团记录列表
 * @param {*} flag -待审核状态为101，集团管理员审核通过为102，集团管理员拒绝为103. 104返回所有
 */
const getGroupApplyGroupList = (data) => {
  return request({
    url: "/dev-api/asset-system/grouprelations/get/group/apply/record",
    method: "GET",
    params: {
      groupId: data.groupId,
      current: data.current,
      size: data.size,
      flag: data.flag,
    },
  });
};

/**
 * @method  集团获取申请集团的单位的列表
 * @param {*} data
 */
const getApplyGroupList = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/list/apply/tenant",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      groupName: data.groupName,
      flag: dict[data.flag],
      groupId: data.groupId,
    },
  });
};

/**
 * @method  模糊搜索集团
 * @param {*} data -传groupName
 */
const getGroupListByFilter = (data) => {
  return request({
    url: "/dev-api/asset-system/allgroup/list",
    method: "GET",
    params: {
      groupName: data.groupName,
      type: 1,
    },
  });
};

/**
 * @method  模糊搜索集团分页
 * @param {*} data -传groupName，type 1-实集团  2-虚节点
 */
const getGroupListByFilterPage = (data) => {
  return request({
    url: "/dev-api/asset-system/allgroup/listAll",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      id: data.id,
      groupName: data.groupName,
      tenantCode: data.tenantCode,
      type: data.type,
      groupCode: data.groupCode,
      isDeleted: data.isDeleted,
    },
  });
};

/**
 * @method  获取集团下的单位列表分页
 * @param {*} data -集团id
 */
const getTenantListFromGroup = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/get/group/all/unit",
    method: "GET",
    params: {
      groupId: data.groupId,
      current: data.current,
      size: data.size,
      name: data.name,
    },
  });
};

/**
 * @method  获取集团下的单位列表分页
 * @param {*} data -集团id
 */
const getAllTenantListFromGroup = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/get/group/all/unit",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      groupId: data.groupId,
      name: data.name,
    },
  });
};

/**
 * @method  获取性质里的租户列表分页
 * @param {*} data -集团id
 */
const getPropertiesUnitList = (data) => {
  return request({
    url:
      "/dev-api/asset-system/propertiesdistribution/get/properties/unit/list",
    method: "GET",
    params: {
      propertiesId: data.propertiesId,
      current: data.current,
      size: data.size,
    },
  });
};

/**
 * @method  获取性质里的租户列表不分页
 * @param {*} data -集团id
 */
const getPropertiesUnit = (data) => {
  return request({
    url: "/dev-api/asset-system/propertiesdistribution/get/properties/unit",
    method: "GET",
    params: {
      propertiesId: data.propertiesId,
    },
  });
};

/**
 * @method  获取集团下的单位列表不分页
 * @param {*} data -集团id
 */
const getTenantListUnderGroup = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/get/below/unit/list",
    method: "GET",
    params: {
      groupId: data.groupId,
    },
  });
};

/**
 * @method  获取集团的直接下级单位列表
 * @param {*} data -集团id
 */
const getTenantListBelowGroup = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/get/below/unit",
    method: "GET",
    params: {
      groupId: data.groupId,
      current: data.current,
      size: data.size,
      name: data.name,
    },
  });
};

/**
 * @method  分配租户到某个集团内
 * @param {*} data -集团id
 */
const distributeTenantToGroup = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/tenants/join/group",
    method: "POST",
    data: data,
  });
};

/**
 * @method  获取集团树
 * @param {*} data -集团id
 */
const getGroupTree = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/group/tree",
    method: "GET",
    params: {
      groupId: data.groupId,
      sourceGroupId: data.sourceGroupId,
    },
  });
};

/**
 * @method  获取平台监控集团数据
 * @param {*} data
 */
const getGroupInfoMonitor = (data) => {
  return request({
    url: "/dev-api/asset-system/group/get/group/data",
    method: "GET",
    params: {
      flag: data.flag,
    },
  });
};

/**
 * @method  编辑集团树关系
 * @param {*} data -集团id
 */
const updateGroupTree = (data) => {
  return request({
    url: "/dev-api/asset-system/group/build/relation",
    method: "POST",
    params: {
      groupId: data.groupId,
      sId: data.sId,
      tId: data.tId,
    },
  });
};
/**
 * @method 租户退出集团
 * @param {*} data -集团id
 */
const tenantQuit = (data) => {
  return request({
    url: "/dev-api/asset-system/group/export/group",
    method: "POST",
    params: {
      groupId: data.groupId,
    },
  });
};

/**
 * @method 下载导入模板
 *
 */
const downloadImportModules = () => {
  return request({
    url: "/dev-api/asset-system/group/model/down",
    method: "GET",
    responseType: "blob",
  });
};
/**
 * @method 集团移除租户
 * @param {*} data -租户Id 集团Id
 */
const removeTenantFromGroup = (data) => {
  return request({
    url: "/dev-api/asset-system/group/remove/tenant",
    method: "POST",
    params: {
      groupId: data.groupId,
      tenantId: data.tenantId,
    },
  });
};
/**
 * @method 组织管理表导出
 * @param {*} data -集团id
 */
const exportExcel = (data) => {
  return request({
    url: "/dev-api/asset-system/group/exportExcel",
    method: "GET",
    params: {
      groupId: data.groupId,
    },
    responseType: "blob",
  });
};
/**
 * @method 集团创建性质并进行分配
 * @param {*} data -集团id
 */
const groupCreateProperty = (data) => {
  return request({
    url:
      "/dev-api/asset-system/propertiesdistribution/create/distribute/properties",
    method: "POST",
    params: {
      groupId: data.groupId,
      propertiesName: data.propertiesName,
      tenantIds: data.tenantIds,
    },
  });
};
/**
 * @method 获取集团内所有叶子节点中性质未分配列表
 * @param {*} data -集团id
 */
const groupGetNoProperty = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/get/no/properties/tenant",
    method: "GET",
    params: {
      groupId: data.groupId,
    },
  });
};
/**
 * @method 修改某个租户的性质
 * @param {*} data -集团id
 */
const distributedTenantProperties = (data) => {
  return request({
    url:
      "/dev-api/asset-system/propertiesdistribution/update/distributed/properties",
    method: "POST",
    params: {
      groupId: data.groupId,
      propertiesId: data.propertiesId,
      tenantId: data.tenantId,
    },
  });
};
/**
 * @method 将租户从性质移出
 * @param {*} data -集团id
 */
const removeDistributedProperties = (data) => {
  return request({
    url:
      "/dev-api/asset-system/propertiesdistribution/remove/distributed/properties",
    method: "POST",
    params: {
      propertiesId: data.propertiesId,
      tenantIds: data.tenantId,
    },
  });
};
/**
 * @method 给性质分配租户
 * @param {*} data -租户id
 */
const distributeProperties = (data) => {
  return request({
    url: "/dev-api/asset-system/propertiesdistribution/distribute/properties",
    method: "POST",
    params: {
      propertiesId: data.propertiesId,
      propertiesName: data.propertiesName,
      tenantIds: data.tenantIds,
    },
  });
};

/**
 * @method 修改性质
 * @param {*} data -租户id
 */
const updateDistributeProperties = (data) => {
  return request({
    url: "/dev-api/asset-system/properties/submit",
    method: "POST",
    data: data,
  });
};

/**
 * @method 集团解散
 * @param {*} data -集团id
 */
const disbandGroup = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/disband/group",
    method: "POST",
    data: data,
  });
};

/**
 * @method  获取组织列表
 */
const getOrgansList = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/group/list",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      groupId: data.groupId,
    },
  });
};

//删除组织，支持批量
const deletesDepartment = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/disband/all/group",
    method: "POST",
    data: data,
  });
};

/**
 * @method  获取集团信息
 */
const getGroupData = (data) => {
  return request({
    url: "/dev-api/asset-system/allgroup/get/group/by/id",
    method: "GET",
    params: {
      groupId: data.groupId,
    },
  });
};

/**
 * @method  获取集团信息
 */
const getAllgroup = (data) => {
  return request({
    url: "/dev-api/asset-system/allgroup/getSimpleGroupById",
    method: "GET",
    params: {
      groupId: data.groupId,
    },
  });
};

/**
 * @method  获取集团id下级结点
 */
const getBelowLayer = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/get/below/layer",
    method: "GET",
    params: {
      groupId: data.groupId,
      sourceGroupId: data.sourceGroupId,
    },
  });
};

/**
 * @method  获取组织模块下级结点
 */
const getLayerGroup = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/get/layer/group",
    method: "GET",
    params: {
      groupId: data.groupId,
      sourceGroupId: data.sourceGroupId,
    },
  });
};

/**
 * @method  获取组织懒加载树
 */
const getBelowGroup = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/get/below/group",
    method: "GET",
    params: {
      groupId: data.groupId,
    },
  });
};

/**
 * @method  查询组织懒加载树
 */
const searchGroupUnit = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/search/group/unit",
    method: "GET",
    params: {
      sourceGroupId: data.sourceGroupId,
      name: data.name,
    },
  });
};

const delGroupList = (data) => {
  return request({
    url: "/dev-api/asset-system/allgroup/removeByIds",
    method: "POST",
    data: data,
  });
};

const realGroupMerge = (data) => {
  return request({
    url: "/dev-api/asset-system/async/realGroupMerge",
    method: "POST",
    params: {
      sourceGroupId: data.sourceGroupId,
      parentGroupId: data.parentGroupId,
      sonGroupId: data.sonGroupId,
    },
  });
};

const sortLazyTree = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/sortLazyTree",
    method: "POST",
    params: {
      sourceGroupId: data.sourceGroupId,
      beforeId: data.beforeId,
      afterId: data.afterId,
      orderStatus: data.orderStatus,
    },
  });
};

/**
 * @method 组织人员表导出
 */
const exportGroupUnitData = (data) => {
  return request({
    url: "/dev-api/asset-system/async/exportGroupUnitData",
    method: "POST",
    params: {
      groupId: data.groupId,
    },
    data: data.unitIdList,
    responseType: "blob",
  });
};

const hideUnitInGroup = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/hideUnitInGroup",
    method: "GET",
    params: {
      sourceGroupId: data.sourceGroupId,
      tenantId: data.tenantId,
      type: data.type,
    },
  });
};

export {
  createGroup,
  tenantApplyGroup,
  getTenantApplyGroup,
  getJoinAndCreateGroupList,
  groupApplyGroup,
  getManageGroupList,
  checkTenantApplyGroup,
  cancelApplyGroup,
  getGroupInfo,
  getGroupAddGroupList,
  getGroupApplyGroupList,
  getApplyGroupList,
  getTenantListFromGroup,
  getGroupListByFilter,
  getGroupTree,
  updateGroupTree,
  disbandGroup,
  tenantQuit,
  downloadImportModules,
  removeTenantFromGroup,
  exportExcel,
  getGroupInfoMonitor,
  getTenantListBelowGroup,
  distributeTenantToGroup,
  getTenantListUnderGroup,
  groupCreateProperty,
  groupGetNoProperty,
  getGroupProperties,
  getAllTenantListFromGroup,
  getPropertiesUnitList,
  getGroupListByFilterPage,
  distributedTenantProperties,
  removeDistributedProperties,
  distributeProperties,
  getPropertiesUnit,
  addDistributeProperties,
  removeProperties,
  getGroupTenantTree,
  modifyGroupInfo,
  groupRemoveTenant,
  groupRemoveTenantLeaf,
  updateFatherGroup,
  updateFatherTenant,
  simpleGroupTenantTree,
  modifyGroupInformation,
  getUpGroupTree,
  getOrgansList,
  deletesDepartment,
  updateDistributeProperties,
  getGroupData,
  getBelowLayer,
  getBelowGroup,
  getLayerGroup,
  searchGroupUnit,
  delGroupList,
  realGroupMerge,
  sortLazyTree,
  getAllgroup,
  exportGroupUnitData,
  hideUnitInGroup,
};
