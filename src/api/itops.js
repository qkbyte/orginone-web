import request from "@/router/axios";

/**
 * @method  全局扫描并自动修复
 */
const allitops = (data) => {
  return request({
    url: "/dev-api/blade-system/itops/allitops",
    method: "POST"
  });
};

/**
 * @method  全局扫描并需要手工修复的（以租户为单元的）
 */
const alltenantitops = (data) => {
  return request({
    url: "/dev-api/blade-system/itops/alltenantitops",
    method: "POST"
  });
};

/**
 * @method  全局扫描并需要手工修复的（以用户为单元的）
 */
const alluseritops = (data) => {
  return request({
    url: "/dev-api/blade-system/itops/alluseritops",
    method: "POST"
  });
};

/**
 * @method  获取需要修复的租户列表
 */
const getalltenantitops = (data) => {
  return request({
    url: "/dev-api/blade-system/itops/getalltenantitops",
    method: "GET"
  });
};

/**
 * @method  获取需要修复的用户列表
 */
const getalluseritops = (data) => {
  return request({
    url: "/dev-api/blade-system/itops/getalluseritops",
    method: "GET"
  });
};

/**
 * @method  修复一个单位中有多少超级管理员的
 */
const modifysupermanager = (data) => {
  return request({
    url: "/dev-api/blade-system/itops/modifysupermanager",
    method: "POST",
    params: {
      tenant_code: data.tenantcode,
      user_id: data.userid,
      itopsdetailid:data.itopsdetailid,
    },
  });
};

/**
 * @method  删除租户
 */
const deletetenant = (data) => {
  return request({
    url: "/dev-api/blade-system/itops/deletetenant",
    method: "POST",
    params: {
      tenant_code: data.tenantcode,
      itopsdetailid:data.itopsdetailid,
    },
  });
};

/**
 * @method 租户人员数据导入
 */
const importTenantPersonUser = (data) => {
  return request({
    url: "/dev-api/blade-system/itops/import/tenantuser",
    headers: {
        "Content-Type": "multipart/form-data",
      },
    method: "POST",
    params: data,
  });
};

/**
 * @method 修复一个用户中有多个密码的
 */
const modifyuser = (data) => {
  return request({
    url: "/dev-api/blade-system/itops/modifyuser",
    method: "POST",
    params: {
      tenant_code: data.tenantcode,
      phone_number:data.phonenumber,
      itopsdetailid:data.itopsdetailid,
    },
  });
};

/**
 * @method 修复用户和人员表中手机号不一致的
 */
const modifyuserphone = (data) => {
  return request({
    url: "/dev-api/blade-system/itops/modifyuserphone",
    method: "POST",
    params: {
      user_id: data.userid,
      phone_number: data.phonenumber,
      itopsdetailid:data.itopsdetailid,
    },
  });
};

/**
 * @method  修复用户和人员表中名字不一致的
 */
const modifyusername = (data) => {
  return request({
    url: "/dev-api/blade-system/itops/modifyusername",
    method: "POST",
    params: {
      user_id: data.userid,
      user_name: data.username,
      itopsdetailid:data.itopsdetailid,
    },
  });
};

/**
 * @method  得到所有扫描表
 */
const getallitops = (data) => {
  return request({
    url: "/dev-api/blade-system/itops/getallitops",
    method: "GET",   
  });
};

/**
 * @method  根据扫描表得到所有修复记录
 */
const getallitopsdetail = (data) => {
  return request({
    url: "/dev-api/blade-system/itops/getallitopsdetail",
    method: "GET",
    params: {
      itopsid: data.itopsid,
      ifmodify:data.ifmodify
    },
  });
};
  /**
 * @method  得到多个超级管理员
 */
const getmultisupermanager = (data) => {
  return request({
    url: "/dev-api/blade-system/itops/getmultisupermanager",
    method: "GET",
    params: {
      tenant_code: data.tenant_code,
    },
  });
};
 /**
 * @method  得到租户具体信息
 */
const gettenant = (data) => {
  return request({
    url: "/dev-api/blade-system/itops/gettenant",
    method: "GET",
    params: {
      tenant_code: data.tenant_code,
    },
  });
};

 /**
 * @method  得到多个租户（根据phone_number)
 */
const getmultitenant = (data) => {
  return request({
    url: "/dev-api/blade-system/itops/getmultitenant",
    method: "GET",
    params: {
      phone_number: data.phone_number,
    },
  });
};

 /**
 * @method  得到多个手机号（根据userid)
 */
const getmultiphone = (data) => {
  return request({
    url: "/dev-api/blade-system/itops/getmultiphone",
    method: "GET",
    params: {
      userid: data.userid,
    },
  });
};

 /**
 * @method  得到多个用户名（根据userid)
 */
const getmultiusername = (data) => {
  return request({
    url: "/dev-api/blade-system/itops/getmultiusername",
    method: "GET",
    params: {
      userid: data.userid,
    },
  });
};


export {
  allitops,
  alltenantitops,
  alluseritops,
  getalltenantitops,
  getalluseritops,
  modifysupermanager,
  deletetenant,
  importTenantPersonUser,
  modifyuser,
  modifyuserphone,
  modifyusername,
  getallitops,
  getallitopsdetail,
  getmultisupermanager,
  gettenant,
  getmultitenant,
  getmultiphone,
  getmultiusername
};
