import request from "@/router/axios";

/**
 * @method 新增菜单
 * @param {*} data -传入菜单实体
 */
const addMenu = (data) => {
  return request({
    url: "/dev-api/asset-system/v1/menus/submit",
    method: "POST",
    data: data,
  });
};

/**
 * @method  删除菜单，支持多选
 * @param {*} data -传入菜单id
 */
const deleteMenuByMenuId = (data) => {
  return request({
    url: "/dev-api/asset-system/v1/menus/remove",
    method: "DELETE",
    params: {
      menuIds: data.menuIds,
    },
  });
};

/**
 * @method  获取系统菜单列表
 * @param {*} data
 */
const getMenuList = (data) => {
  return request({
    url: "/dev-api/asset-system/v1/menus/list",
    method: "GET",
    params: {
      name: data.name,
    },
  });
};

/**
 * @method  获取所有菜单列表
 * @param {*} data
 */
const getMenuTree = () => {
  return request({
    url: "/dev-api/asset-system/v1/menus/tree",
    method: "GET",
  });
};

/**
 * @method  获取角色被分配菜单ID列表
 * @param {*} data
 */
const getMenuTreeByRoleId = (data) => {
  return request({
    url: "/dev-api/asset-system/v1/menus/role-tree-keys",
    method: "GET",
    params: { roleIds: data.roleIds },
  });
};

export {
  getMenuList,
  getMenuTree,
  getMenuTreeByRoleId,
  addMenu,
  deleteMenuByMenuId,
};
