import request from "@/router/axios";
import qs from "qs";
/**
 * 获取用户加入和创建的租户列表
 * @param {*} data
 */
const getTenantList = (data) => {
  return request({
    url: "/dev-api/asset-system/scenes/v2/user/list",
    method: "GET",
    params: {
      phoneNumber: data.phoneNumber,
    },
  });
};

/**
 * 获取用户相关的租户列表带分页
 * @param {Number} count -标识用户与租户关系
 */
const getTenantListPages = (data) => {
  return request({
    url: "/dev-api/asset-system/scenes/query/tenant",
    method: "GET",
    params: {
      count: data.count,
      current: data.current,
      size: data.size,
      phoneNumber: data.phoneNumber,
      tenantName: data.tenantName,
    },
  });
};

/**
 * 获取当前租户详情
 * @param {*} data
 */
const getTenantInfo = (data) => {
  return request({
    url: "/dev-api/asset-system/scenes/query/ten/info",
    method: "GET",
    params: {
      id: data.tenantId,
    },
  });
};
/**
 * 获取平台监控租户数据
 * @param {*} data
 */
const getTenantInfoMonitor = (data) => {
  return request({
    url: "/dev-api/asset-system/scenes/get/tenant/data",
    method: "GET",
    params: {
      flag: data.flag,
    },
  });
};

//租户模板下载
const getTenantModel = () => {
  return request({
    url: "/dev-api/asset-minio/aliyunoss/downloadImportTemplate",
    method: "GET",
    responseType: "blob",
    params:{
      type:4
    }
  });
};

//无管理员租户模板下载
const downloadNoMananger = () => {
  return request({
    url: "/dev-api/asset-minio/aliyunoss/downloadImportTemplate",
    method: "GET",
    responseType: "blob",
    params:{
      type:8
    }
  });
};

//补充管理员模板下载
const downloadMananger = () => {
  return request({
    url: "/dev-api/asset-minio/aliyunoss/downloadImportTemplate",
    method: "GET",
    responseType: "blob",
    params:{
      type:9
    }
  });
};
/**
 * 获取导入信息带分页
 * @param {*} type -0导入的记录 1导入的数据
 */
const getTenantImportHistory = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/get/import/status",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      type: data.type,
      fileId: data.fileId,
      tableName: data.tableName
    },
  });
};

//导入租户数据
const importTenantInfo = (data) => {
  return request({
    url: "/dev-api/asset-system/async/importTenant",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    method: "POST",
    data: data,
  });
};

//导入无管理员租户数据
const importNoAdminUnitTenant = (data) => {
  return request({
    url: "/dev-api/asset-system/async/importNoAdminUnitTenant",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    method: "POST",
    data: data,
  });
};

//导入补充管理员数据
const importReplenish = (data) => {
  return request({
    url: "/dev-api/asset-system/async/importReplenishAdmin",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    method: "POST",
    data: data,
  });
};
/**
 * 租户数据导出
 * @param {*} data
 */
const getTenantInfoExport = (data) => {
  return request({
    url: "/dev-api/asset-system/scenes/export/tenant/Excel",
    method: "GET",
    responseType: "arraybuffer",
    params: {
      tenantNames: data,
    },
  });
};
/**
 * 获取当前租户详情(对应组织单位)
 * @param {*} data
 */
const getTenantInfoDetail = (data) => {
  return request({
    url: "/dev-api/asset-system/scenes/query",
    method: "GET",
    params: {
      id: data.tenantId,
    },
  });
};
/**
 * 删除租户
 * @param {String} tenantName -租户名称
 */
const deleteTenantByTenantId = (data) => {
  return request({
    url: "/dev-api/asset-system/scenes/delete/tenant",
    method: "POST",
    params: { 
      tenantCode: data.tenantCode
    },
  });
};

/*
  根据tenantCode获取租户详情
*/
const getTenantInfoDetailByCode = (data) => {
  return request({
    url: "/dev-api/asset-system/scenes/get/unit/by/code",
    method: "GET",
    params: {
      tenantCode: data.tenantCode,
    },
  });
};

/*
  根据tenantName检索租户
*/
const getTenantByName = (data) => {
  return request({
    url: "/dev-api/asset-system/scenes/get/all/tenant/v2",
    method: "GET",
    params: {
      tenantName: data.tenantName,
    },
  });
};

/**
 * 模糊查询租户列表
 * @param {String} tenantName -租户名称
 */
const searchTenantByTenantName = (data) => {
  return request({
    url: "/dev-api/asset-system/scenes/get/all/tenant",
    method: "GET",
    params: {
      tenantName: data.tenantName,
    },
  });
};

/**
 * 新增租户
 * @param {*} data -租户名称，统一社会信用代码
 */
const addTenant = (data) => {
  return request({
    url: "/dev-api/asset-system/scenes/create/tenant",
    method: "POST",
    params: {
      tenantName: data.tenantName,
      userId: data.userId,
      socialCreCode: data.socialCreCode,
    },
  });
};
/**
 * 查看集团申请记录
 * @param {*} data -租户id，条件字段
 */
const getApplyRecord = (data) => {
  return request({
    url: "/dev-api/asset-system/group/get/Application/record",
    method: "GET",
    params: {
      flag: data.flag,
      tenantId: data.tenantId,
      groupName: data.groupName,
    },
  });
};
/**
 * 租户取消申请
 * @param  {*} data -集团id
 */
const tenantCancelApply = (data) => {
  return request({
    url: "/dev-api/asset-system/group/cancel/apply",
    method: "PUT",
    params: {
      groupId: data.groupId,
    },
  });
};
/**
 * 修改租户信息
 * @param {*} data -form表单
 */
const tanentInfoUpdate = (data) => {
  return request({
    url: "/dev-api/asset-system/scenes/update",
    method: "PUT",
    data: data,
  });
};

/**
 * 修改单位信息
 * @param {*} data
 */
const unitUpdate = (data) => {
  return request({
    url: "/dev-api/asset-system/scenes/update/unit/info",
    method: "POST",
    data:data
  });
};
/**
 * 获取租户列表
 * @param {*} data -size,current
 */
const getAllTenantList = (data) => {
  return request({
    url: "/dev-api/asset-system/scenes/listPage",
    method: "GET",
    params: {
      size: data.size,
      current: data.current,
      tenantName:data.tenantName,
      tenantCode: data.tenantCode,
      id: data.id,
      isDeleted: data.isDeleted
    },
  });
};
/**
 * 添加租户
 * @param {*} data -size,current
 */
const addTenantList = (data) => {
  return request({
    url: "/dev-api/asset-system/scenes/submit",
    method: "POST",
    data: data,
  });
};
/**
 * 获取租户列表
 * @param {*} data -size,current
 */
const delTenantList = (data) => {
  return request({
    url: "/dev-api/asset-system/scenes/removeByIds",
    method: "POST",
    params: {
      ids:data.ids
    },
  });
};
/**
 * 单位增长趋势图
 */
const getTenantIncreaceInfo = () => {
  return request({
    url: "/dev-api/asset-system/scenes/get/tenant/uping",
    method: "GET",
  });
};

/**
 * 单位超管权限转移
 */
const tenantAuthTransfer = (data) => {
  return request({
    url: "/dev-api/asset-system/scenes/transfer/authority",
    method: "PUT",
    params: {
      userId: data.userId,
    },
  });
};

/**
 * 用户取消申请单位
 */
const cancelApplyTenant = (data) => {
  console.log('data1239821903829103',data);
  return request({
    url: "/dev-api/asset-user/user/withdraw/application",
    method: "POST",
    data:data
  });
};

/**
 * 修改租户信息
 */
const updateUnitInfo = (data) => {
  return request({
    url: "/dev-api/asset-system/scenes/update/unit/info",
    method: "POST",
    params:{
      tenantId: data.tenantId,
      name: data.name,
      socialCreditCode: data.socialCreditCode,
      province: data.province,
      city: data.city,
      streetAddress: data.streetAddress,
      logo: data.logo,
      corporateRepresentative: data.corporateRepresentative,
      unitCode: data.unitCode,
      linkPhone: data.linkPhone,
    }
  });
};

/**
 * 修改租户信息
 */
const updatePersonInform = (data) => {
  return request({
    url: "/dev-api/asset-user/user/update/user/info",
    method: "POST",
    params: {
      name: data.name,
      phoneNumber: data.phoneNumber,
      userId: data.userId
    },
  });
};

/**
 * 补充手机号
 */
const supplePhoneNumber = (data) => {
  return request({
    url: "/dev-api/asset-system/person/replenish/phoneNumber",
    method: "POST",
    params: {
      phoneNumber: data.phoneNumber,
      personId: data.id,
    },
  });
};

const getAdministrativeTree = () => {
  return request({
    url: "/dev-api/asset-system/administrative/tree",
    method: "GET",
  });
};

const getAdministrativeTreeV2 = () => {
  return request({
    url: "/dev-api/asset-system/administrative/treeV2",
    method: "GET",
  });
};

const updateTheme = (data) => {
  return request({
    url: "/dev-api/asset-system/scenes/updateTheme",
    method: "POST",
    data:data
  });
};

const administraListAll = (data) => {
  return request({
    url: "/dev-api/asset-system/administrative/listAll",
    method: "GET",
    params: {
      size: data.size,
      current: data.current,
    },
  });
};

const administraSubmit = (data) => {
  return request({
    url: "/dev-api/asset-system/administrative/submit",
    method: "POST",
    data:data
    // params: {
    //   allName:data.allName,
    //   code:data.code,
    //   name:data.name,
    //   pid:data.pid
    // },
  });
};

const administraRemoveByIds = (data) => {
  return request({
    url: "/dev-api/asset-system/administrative/removeByIds",
    method: "POST",
    data:data
  });
};

export {
  addTenant,
  getTenantList,
  getAllTenantList,
  getTenantListPages,
  getTenantInfo,
  deleteTenantByTenantId,
  searchTenantByTenantName,
  getApplyRecord,
  tenantCancelApply,
  getTenantInfoDetail,
  tanentInfoUpdate,
  unitUpdate,
  getTenantInfoDetailByCode,
  getTenantInfoMonitor,
  getTenantIncreaceInfo,
  getTenantInfoExport,
  importTenantInfo,
  getTenantModel,
  getTenantByName,
  tenantAuthTransfer,
  cancelApplyTenant,
  getTenantImportHistory,
  updateUnitInfo,
  updatePersonInform,
  supplePhoneNumber,
  delTenantList,
  addTenantList,
  getAdministrativeTree,
  downloadNoMananger,
  downloadMananger,
  importNoAdminUnitTenant,
  importReplenish,
  updateTheme,
  administraListAll,
  administraRemoveByIds,
  getAdministrativeTreeV2,
  administraSubmit,
};
