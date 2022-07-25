import request from "@/router/axios";

/**
 * @method  通过账号密码登录系统
 * @param {*} data -传入账号、密码
 */
const loginByUsername = (data) => {
  return request({
    url: "/dev-api/blade-auth/token",
    method: "POST",
    params: {
      account: data.account,
      password: data.password,
      tenantCode: "",
    },
  });
};

/**
 * @method  根据token获取用户信息
 */
const getUserInfoByToken = () => {
  return request({
    url: "/dev-api/asset-system/person/get/user/info",
    method: "GET",
  });
};

const getSimplePwd = (data) => {
  return request({
    url: "/dev-api/blade-auth/token/getSimplePwd",
    method: "POST",
    data:data
  });
};


export { loginByUsername, getUserInfoByToken,getSimplePwd };
