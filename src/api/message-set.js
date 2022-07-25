import request from "@/router/axios";

/**
 * @method 获取人员列表
 * @param {*} data
 */
const getUserList = (data) => {
  return request({
    url: "/dev-api/asset-system/person/get/all/person/in/tenant/v2",
    method: "GET",
    params: {
      tenantCode: data.tenantCode,
      isActivate: data.isActivate,
      fuzzyVal: data.fuzzyVal,
      current: data.current,
      size: data.size,
    },
  });
};

/**
 * @method 获取被分配部门或岗位用户分页
 * @param {*} data
 */
const getUserListByDeptIdOrPosId = (data) => {
  return request({
    url: "/dev-api/asset-system/person/search/user/info",
    method: "GET",
    params: {
      tenantCode: data.tenantCode,
      jobId: data.jobId,
      deptId: data.deptId,
      current: data.current,
      size: data.size,
      realName: data.realName,
    },
  });
};

/**
 * @method 获取被分配部门或岗位用户分页V2
 * @param {*} data
 */
const getUserListByDeptIdOrPosIdV2 = (data) => {
  return request({
    url: "/dev-api/asset-system/person/search/user/info/v2",
    method: "GET",
    params: {
      tenantCode: data.tenantCode,
      jobId: data.jobId,
      deptId: data.deptId,
      current: data.current,
      size: data.size,
      fuzzyVal: data.fuzzyVal,
    },
  });
};

/**
 * @method 批量给用户修改岗位
 * @param {*} data
 */
const addJobsToUsers = (data) => {
  return request({
    url: "/dev-api/asset-system/jobs/v1/addJobsToUsers",
    method: "POST",
    params: {
      jobIds: data.jobIds,
      userIds: data.userIds,
    },
  });
};

/**
 * @method 获取被分配部门或岗位用户
 * @param {*} data
 */
const getHasSelectUserList = (data) => {
  return request({
    url: "/dev-api/asset-system/person/search/user/allinfo/v2",
    method: "GET",
    params: {
      tenantCode: data.tenantCode,
      deptId: data.deptId,
      jobId: data.jobId,
    },
  });
};

/**
 * @method 获取租户下人员列表不分页
 * @param {*} data
 */
const getTenantPersonAll = (data) => {
  return request({
    url: "/dev-api/asset-system/person/get/tenant/into/persons",
    method: "GET",
    params: {
      tenantCode: data.tenantCode,
    },
  });
};

const getAllUserByTenantId = (data) => {
  return request({
    url: "/dev-api/asset-user/user/get/user/tenantCode",
    method: "GET",
    params: {
      tenantCode: data.tenantCode,
    },
  });
};

const getUserInfoById = (data) => {
  return request({
    url: "/dev-api/asset-system/person/get/user/info",
    method: "GET",
    params: {
      id: data.id,
    },
  });
};

const getCheckPersonListByTenantCode = (data) => {
  return request({
    url: "/dev-api/asset-system/person/tenant/person",
    method: "GET",
    params: {
      tenantCode: data.tenantCode,
      count: data.count,
      current: data.current,
      size: data.size,
    },
  });
};

const getCheckUserListByTenantCode = (data) => {
  return request({
    url: "/dev-api/asset-system/person/tenant/person",
    method: "GET",
    params: {
      tenantCode: data.tenantCode,
      count: data.count,
      current: data.current,
      size: data.size,
    },
  });
};

const getCheckUsersListByTenantCode = (data) => {
  return request({
    url: "/dev-api/asset-user/user/tenant/user",
    method: "GET",
    params: {
      tenantCode: data.tenantCode,
      count: data.count,
      current: data.current,
      size: data.size,
      realName: data.realName,
    },
  });
};

/*
 * 获取在线用户数
 */
const getOnlineUserNum = () => {
  return request({
    url: "/dev-api/asset-user/user/get/online/user/count",
    method: "GET",
  });
};

const updateUserPhoneNumber = (data) => {
  console.log(data);
  return request({
    url: "/dev-api/asset-user/user/update",
    method: "PUT",
    data,
  });
};
const updateUserInfo = (data) => {
  return request({
    url: "/dev-api/asset-system/person/update",
    method: "PUT",
    data: {
      id: data.id,
      realName: data.realName,
      gender: data.gender,
      roleId: data.roleId,
      userEmail: data.userEmail,
      userAddress: data.userAddress,
    },
  });
};

const updateUserInfoByAdmin = (data) => {
  return request({
    url: "/dev-api/asset-system/person/update/user",
    method: "PUT",
    params: {
      id: data.id,
      realName: data.realName,
      //  roleIds: data.roleId,
      idCard: data.idCard,
    },
  });
};

/*
  修改用户信息（全部可修改接口）
*/
const updateUserInfoAll = (data) => {
  return request({
    url: "/dev-api/asset-system/person/update/v1",
    method: "PUT",
    data: data,
  });
};

const addUser = (data) => {
  return request({
    url: "/dev-api/asset-user/user/add/user/v2",
    method: "POST",
    params: {
      realName: data.realName,
      phoneNumber: data.phoneNumber,
      idCard: data.idCard,
      roleIds: data.roleIds,
      tenantCode: data.tenantCode,
    },
  });
};

const updatePassword = (data) => {
  return request({
    url: "/dev-api/asset-user/user/update/password",
    method: "POST",
    params: {
      newPassword: data.newPass,
      newPassword1: data.checkPass,
      oldPassword: data.pass,
      userId: data.userId,
    },
  });
};

const resetPassword = (data) => {
  return request({
    url: "/dev-api/asset-user/user/reset-password",
    method: "POST",
    params: {
      userIds: data.userIds,
    },
  });
};

const deleteUsersById = (data) => {
  return request({
    url: "/dev-api/asset-user/user/remove",
    method: "DELETE",
    params: {
      ids: data.ids,
    },
  });
};

const removeUsers = (data) => {
  return request({
    url: "/dev-api/asset-user/user/delete/userInfo",
    method: "DELETE",
    params: {
      userIds: data.userIds,
      tenantCode: data.tenantCode,
    },
  });
};

/*
 * 人员移除单位
 */
const tenantRemoveUser = (data) => {
  return request({
    url: "/dev-api/asset-system/person/remove/user",
    method: "POST",
    params: {
      personIds: data.ids,
    },
  });
};

const removeUsersById = (data) => {
  return request({
    url: "/dev-api/asset-user/user/user/quit/tenant",
    method: "POST",
    params: {
      tenantCode: data.tenantCode,
      phoneNumber: data.phoneNumber,
    },
  });
};

/**
 * @method 新用户注册
 * @param {*} data(phoneNumber,pwd,realName)
 */
const regUser = (data) => {
  return request({
    url: "/dev-api/asset-user/token/user/v1/user/reReg",
    method: "POST",
    params: {
      phoneNumber: data.phoneNumber,
      pwd: data.password,
      realName: data.realName,
    },
  });
};

const resetPasswordByPhone = (data) => {
  return request({
    url: "/dev-api/asset-user/token/user/update/pwd",
    method: "PUT",
    params: {
      phoneNumber: data.phoneNumber,
      pwd: data.pwd,
    },
  });
};

const checkExistIdcard = (data) => {
  return request({
    url: "/dev-api/asset-system/token/registration/retrieve/idCard",
    method: "GET",
    params: {
      idCard: data,
    },
  });
};

const checkExistMobile = (data) => {
  return request({
    url: "/dev-api/asset-user/token/user/retrieve/user",
    method: "GET",
    params: {
      phoneNumber: data,
    },
  });
};

const getUserInfo = (data) => {
  return request({
    url: "/dev-api/asset-user/user/v1/get/test/user",
    method: "GET",
    params: {
      phoneNumber: data,
    },
  });
};

const applyTenantByUserId = (data) => {
  return request({
    url: "/dev-api/asset-user/user/add/tenant",
    method: "POST",
    params: {
      tenantCode: data.tenantCode,
    },
  });
};

const checkUser = (data) => {
  return request({
    url: "/dev-api/asset-user/user/v1/reView/user",
    method: "PUT",
    params: {
      isPass: data.isPass,
      tenantCode: data.tenantCode,
      userIds: data.userIds,
    },
  });
};

const exportExcel = (data) => {
  return request({
    url: "/dev-api/asset-system/person/exportExcel",
    method: "GET",
    responseType: "blob",
    params: {
      userIds: data.ids,
    },
  });
};
const exportDownload = (data) => {
  return request({
    url: "/dev-api/asset-system/person/model/down",
    method: "GET",
    responseType: "blob",
  });
};

/**
 * @method 从岗位里删除用户
 * @param {*} data
 */
const deleteUserFromPositionOrDepartment = (data) => {
  return request({
    url: "/dev-api/asset-system/inner/agency/delete/job/dept/users",
    method: "DELETE",
    params: {
      jobId: data.jobId,
      deptId: data.deptId,
      userIds: data.userIds,
    },
  });
};

/**
 * @method 获取平台监控用户数据（最近15天）
 * @param {*} data
 */
const getUserInfoMonitor = () => {
  return request({
    url: "/dev-api/asset-system/person/get/user/data2",
    method: "GET",
  });
};

/**
 * @method 获取所有注册用户数量
 */
const getAllUserNum = () => {
  return request({
    url: "/dev-api/asset-user/user/get/all/user",
    method: "GET",
  });
};

/**
 * @method 删除用户信息
 */
const delUserInfo = (data) => {
  return request({
    url: "/dev-api/asset-system/person/remove",
    method: "POST",
    params: {
      ids: data.ids,
    },
  });
};

/**
 * @method 重置密码
 */
const resetUserPassword = (data) => {
  return request({
    url: "/dev-api/asset-user/user/resetPassword",
    method: "POST",
    params: {
      phoneNumber: data.phoneNumber,
    },
  });
};

/**
 * @method 增加用户信息
 */
const addUserList = (data) => {
  return request({
    url: "/dev-api/asset-system/person/submit",
    method: "POST",
    data: data,
  });
};

/**
 * @method 用户数据导出
 * @param {*} data
 */
const getPersonInfoExport = (data) => {
  return request({
    url: "/dev-api/asset-system/person/exportExcel",
    method: "GET",
    responseType: "arraybuffer",
    params: {
      personIds: data,
    },
  });
};

//人员模板下载
const getPersonModel = () => {
  return request({
    url: "/dev-api/asset-system/person/model/down/person/user",
    method: "GET",
    responseType: "blob",
  });
};

//补充手机模板下载
const getTelSuppleModel = () => {
  return request({
    url: "/dev-api/asset-system/person/model/down/replenish/phoneNumber",
    method: "GET",
    responseType: "blob",
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
      tableName: data.tableName,
    },
  });
};

//导入人员数据
const importPerson = (data) => {
  return request({
    url: "/dev-api/asset-system/person/import/tenant/person/user",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    method: "POST",
    data: data,
  });
};

//导入补充手机号数据
const importTelSupple = (data) => {
  return request({
    url: "/dev-api/asset-system/person/import/replenish/phone/number",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    method: "POST",
    data: data,
  });
};

//激活用户
const activeUser = (data) => {
  return request({
    url: "/dev-api/asset-system/person/activate/user",
    method: "POST",
    params: {
      phones: data.phones,
    },
  });
};

//停用用户
const disableActiveUser = (data) => {
  return request({
    url: "/dev-api/asset-system/person/ban/user",
    method: "POST",
    params: {
      phones: data.phones,
    },
  });
};

//修改用户信息
const updateRealName = (data) => {
  return request({
    url: "/dev-api/asset-system/person/update/user/realName",
    method: "POST",
    params: {
      userId: data.userId,
      realName: data.realName,
    },
  });
};

// 获取单位下所有人员的信息
const getSearchPersonList = (data) => {
  return request({
    url: "/dev-api/asset-system/person/searchPersonList",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      tenantCode: data.tenantCode,
      name: data.fuzzyVal,
    },
  });
};

// 权限转移
const updateTransferPerson = (data) => {
  return request({
    url: "/dev-api/asset-user/user/authority/transfer",
    method: "POST",
    params: {
      userId: data.userId,
    },
  });
};

/**
 * @method 获取人员信息
 */
const getAllPersonInfo = (data) => {
  return request({
    url: "/dev-api/asset-system/person/listPage",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      phoneNumber: data.phoneNumber,
      id: data.id,
      realName: data.realName,
      tenantCode: data.tenantCode,
      isDeleted: data.isDeleted,
    },
  });
};

/**
 * @method 添加人员信息
 */
const AddEditPersonInfo = (data) => {
  return request({
    url: "/dev-api/asset-system/person/submit",
    method: "POST",
    data: data,
  });
};

/**
 * @method 删除人员信息
 */
const removePersonInfo = (data) => {
  return request({
    url: "/dev-api/asset-system/person/remove",
    method: "POST",
    params: {
      ids: data.ids,
    },
  });
};

// 获取平台所有用户信息
const getAllUserInfo = (data) => {
  return request({
    url: "/dev-api/asset-user/user/listPage",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      userName: data.userName,
    },
  });
};

// 发布消息
const createMessage = (data) => {
  return request({
    url: "/dev-api/asset-message/message/publish",
    method: "POST",
    data,
  });
};

// 修改消息
const updateMessage = (data) => {
  return request({
    url: "/dev-api/asset-message/message/update",
    method: "POST",
    data,
  });
};

// 删除消息
const deleteMessage = (data) => {
  return request({
    url: "/dev-api/asset-message/message/delete",
    method: "POST",
    data,
  });
};

// 消息列表
const getMessages = (data) => {
  return request({
    url: "/dev-api/asset-message/message/list",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      title: data.title,
      content: data.content,
    },
  });
};

// 消息详情
const getMessage = (data) => {
  return request({
    url: "/dev-api/asset-message/message/details",
    method: "GET",
    params: {
      id: data.id,
    },
  });
};

export {
  getUserList,
  getUserListByDeptIdOrPosId,
  getUserListByDeptIdOrPosIdV2,
  getHasSelectUserList,
  getAllUserByTenantId,
  getCheckUserListByTenantCode,
  getCheckPersonListByTenantCode,
  deleteUserFromPositionOrDepartment,
  getUserInfoById,
  updateUserInfo,
  updateUserInfoByAdmin,
  addUser,
  resetPassword,
  getUserInfo,
  deleteUsersById,
  removeUsers,
  regUser,
  resetPasswordByPhone,
  checkExistIdcard,
  checkExistMobile,
  updateUserPhoneNumber,
  applyTenantByUserId,
  checkUser,
  exportExcel,
  exportDownload,
  updateUserInfoAll,
  getCheckUsersListByTenantCode,
  addJobsToUsers,
  getUserInfoMonitor,
  removeUsersById,
  getAllUserNum,
  getOnlineUserNum,
  getTenantPersonAll,
  tenantRemoveUser,
  getPersonInfoExport,
  getPersonModel,
  importPerson,
  getTenantImportHistory,
  activeUser,
  updatePassword,
  updateRealName,
  getTelSuppleModel,
  importTelSupple,
  disableActiveUser,
  getSearchPersonList,
  updateTransferPerson,
  getAllPersonInfo,
  AddEditPersonInfo,
  removePersonInfo,
  delUserInfo,
  addUserList,
  resetUserPassword,
  getAllUserInfo,
  createMessage,
  updateMessage,
  deleteMessage,
  getMessages,
  getMessage,
};
