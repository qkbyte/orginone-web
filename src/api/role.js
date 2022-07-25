import request from "@/router/axios";

/**
 * @method  获取角色列表
 * @param {*} data -传入租户编码，不传则为所有角色
 */
const getAllRoleList = () => {
  return request({
    url: "/dev-api/asset-system/roles/v1/get/all/rolesList",
    method: "GET",
  });
};

/**
 * @method  获取所有角色列表带分页、模糊查询
 * @param {*} data -传入列表信息
 */
const getRoleListById = (data) => {
  return request({
    url: "/dev-api/asset-system/roles/v1/list",
    method: "GET",
    params: {
      current: data.current,
      roleAlias: data.roleAlias,
      roleName: data.roleName,
      size: data.size,
    },
  });
};

const getRoleListByTenantId = (data) => {
  return request({
    url: "/dev-api/asset-system/roles/v1/get/all/rolesList",
    method: "GET",
    params: {
      tenantCode: data.tenantCode,
    },
  });
};

/**
 * @method  切换单位
 * @param {*} data -传入切换单位对应的租户编码
 * @returns -获取新的token和角色id
 */
const getRoleIdByTenantId = (data) => {
  return request({
    url: "/dev-api/blade-auth/switch-tenant",
    method: "POST",
    params: {
      account: data.account,
      tenantCode: data.tenantCode,
    },
  });
};

/**
 * @method  删除角色
 * @param {*} data -传入角色id
 */
const deleteRolesByRoleId = (data) => {
  return request({
    url: "/dev-api/asset-system/roles/v1/remove",
    method: "DELETE",
    params: {
      ids: data.ids,
    },
  });
};

/**
 * @method  新增角色
 * @param {*} data -传入角色实体
 */
const addRole = (data) => {
  return request({
    url: "/dev-api/asset-system/roles/v1/save",
    method: "POST",
    data: data,
  });
};

/**
 * @method  更新角色信息
 * @param {*} data -传入角色实体
 */
const updateRole = (data) => {
  return request({
    url: "/dev-api/asset-system/roles/v1/update",
    method: "PUT",
    data: data,
  });
};

/**
 * @method  更新角色被分配的菜单
 * @param {*} data -传入角色id和菜单id列表
 */
const updateRoleAuthByRoleId = (data) => {
  return request({
    url: "/dev-api/asset-system/roles/v1/authorization",
    method: "POST",
    params: {
      menuIds: data.menuIds,
      roleId: data.roleId,
    },
  });
};

/**
 * @method  给用户分配角色（会有分配多个问题）
 * @param {*} data -传入角色id和菜单id列表
 */
const addRolesToUsers = (data) => {
  return request({
    url: "/dev-api/asset-system/roles/v1/addRolesToUsers",
    method: "POST",
    params: {
      roleIds: data.roleIds,
      userIds: data.userIds,
    },
  });
};

/**
 * @method  给用户修改角色
 * @param {*} data -传入角色id和菜单id列表
 */
const updateRolesToUsers = (data) => {
  return request({
    url: "/dev-api/asset-system/roles/v1/updateRolesToUsers",
    method: "POST",
    params: {
      roleIds: data.roleId,
      userIds: data.userId,
    },
  });
};

const getUserRole = (data) => {
  return request({
    url: "/dev-api/asset-system/roles/v1/getRoleIdList",
    method: "GET",
    params: {
      userId: data.id,
      current:data.current,
      size: data.size,
    },
  });
};


const deleteRolesToUsers = (data) => {
  return request({
    url: "/dev-api/asset-system/roles/v1/deleteRolesToUsers",
    method: "DELETE",
    params: {
      userIds: data.id,
      roleIds: data.roleId,
    },
  });
};

export {
  getAllRoleList,
  getRoleListById,
  getRoleListByTenantId,
  getRoleIdByTenantId,
  addRole,
  updateRole,
  updateRoleAuthByRoleId,
  deleteRolesByRoleId,
  addRolesToUsers,
  updateRolesToUsers,
  getUserRole,
  deleteRolesToUsers
};
