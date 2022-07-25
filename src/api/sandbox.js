import request from "@/router/axios";

/**
 * @method  通过应用id获取当前租户在应用内可获取的集团id
 * @param {*} data -传入账号、密码
 */
const getGroupIdByAppId = (data) => {
  return request({
    url: "/dev-api/asset-market/marketappgroupdistribution/getGroupIdList",
    method: "GET",
    params: {
      appId: data.appId,
    },
  });
};

export { getGroupIdByAppId };
