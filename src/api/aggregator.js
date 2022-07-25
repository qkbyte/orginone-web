import request from "@/router/axios";

/**
 * @method  获取当前用户在当前租户下的菜单
 * @param {*} data -传入账号、密码
 */
const getMenu = (data) => {
  return request({
    url: "/dev-api/asset-system/v1/menus/allRoutes",
    method: "GET",
    params: {
      roleIds: data.roleIds,
      platform: 1,
    },
  });
};

export { getMenu };
