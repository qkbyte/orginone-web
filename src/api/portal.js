import request from "@/router/axios";

const getUserPortal = (data) => {
  return request({
    url: '/dev-api/asset-market/portal/getUserPortal',
    method: 'GET',
    params: data,
  }).then(res => {
    return res.data
  })
}
const getCommonUseApp = (data) => {
  return request({
    url: '/dev-api/asset-market/portal/getCommonUseApp',
    method: 'GET',
    params: data,
  }).then(res => {
    return res.data
  })
}
const getTenantPortal = data => {
  return request({
    url: '/dev-api/asset-market/portal/getRemainApp',
      method: 'GET',
      params: data,
  }).then(res => {
    return res.data
  })
}
// 没用到
const subPortal = data => {
  return request({
    url: '/dev-api/asset-market/portal/saveOrUpdateAllPortal',
    method: 'POST',
    data: data.portals,
    params:{
      userId: data.userId,
      tenantId: data.tenantId
    }
  }).then(res => {
    return res.data
  })
}

const getMarketappcomponentList = data => {
  return request({
    url: "/dev-api/asset-market/marketappcomponent/list",
    method: "GET",
    params: {
      current: data.current,
      name:data.name,
      size: data.size,
    },
  });
}


const marketappcomponentSubmit = data => {
  return request({
    url: "/dev-api/asset-market/marketappcomponent/submit",
    method: "POST",
    data:data
  });
}

const marketappcomponentRemove = data => {
  return request({
    url: "/dev-api/asset-market/marketappcomponent/remove",
    method: "POST",
    data:data
  });
}

const getComponentListByAppId = data => {
  return request({
    url: "/dev-api/asset-market/marketappcomponent/getComponentListByAppId",
    method: "GET",
    params: {
      current: data.current,
      marketAppComponent: data.marketAppComponent,
      size: data.size,
      appId: data.appId
    },
  });
}

const marketappcomponenttemplateSubmit = data => {
  return request({
    url: "/dev-api/asset-market/marketappcomponenttemplate/submit",
    method: "POST",
    data:data
  });
}

// 根据用户id获取模板id列表
const getTemplateIdListByUserId = data => {
  return request({
    url: "/dev-api/asset-market/marketappusertemplate/getTemplateIdListByUserId",
    method: "GET",
    params: {
      userId:data.userId
    },
  });
}

// 获取管理员模板列表
const getMarketappcomponenttemplateList = data => {
  return request({
    url: "/dev-api/asset-market/marketappcomponenttemplate/list",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      name: data.name,
      status: data.status,
    },
  });
}

// 获取用户模板列表
const getMarketappcomponenttemplateGetUserTemplate = data => {
  return request({
    url: "/dev-api/asset-market/marketappcomponenttemplate/getUserTemplate",
    method: "GET",
    params: {
      current: data.current,
      name:data.name,
      size: data.size,
    },
  });
}

const marketappusertemplateSubmit = data => {
  return request({
    url: "/dev-api/asset-market/marketappusertemplate/submit",
    method: "POST",
    data:data
  });
}

const marketappcomponenttemplateRemove = data => {
  return request({
    url: "/dev-api/asset-market/marketappcomponenttemplate/remove",
    method: "POST",
    data:data
  });
}

const marketappcomponenttemplateSetDefault = data => {
  return request({
    url: "/dev-api/asset-market/marketappcomponenttemplate/setDefault",
    method: "GET",
    params:{
      id:data.id
    }
  });
}

const marketapproledistributionnewGetAppIdByUserId = data => {
  return request({
    url: "/dev-api/asset-market/marketapproledistributionnew/getAppIdByUserId",
    method: "GET",
    params:{
      userId:data.userId
    }
  });
}

// 根据用户id获取正在使用的模板id
const getTemplateIdByUserIdInUse = data => {
  return request({
    url: "/dev-api/asset-market/marketappusertemplate/getTemplateIdByUserIdInUse",
    method: "GET",
    params:{
      userId:data.userId
    }
  });
}

const setDefaultTemplate = data => {
  return request({
    url: "/dev-api/asset-market/marketappusertemplate/setDefaultTemplate",
    method: "POST",
    data:data
  });
}

const getDefaultTemplate = data => {
  return request({
    url: "/dev-api/asset-market/marketappusertemplate/getDefaultTemplate",
    method: "GET",
    params:{
      userId:data.userId,
    }
  });
}

const appComponentGroupByUser = data => {
  return request({
    url: "/dev-api/asset-market/marketappcomponent/appComponentGroupByUser",
    method: "POST",
    params:{
      tenantCode:data.tenantCode,
      appName:data.appName,
      componentName:data.componentName
    }
  });
}



export {
  appComponentGroupByUser,
  getUserPortal,
  getCommonUseApp,
  getTenantPortal,
  subPortal,
  getMarketappcomponentList,
  marketappcomponentSubmit,
  marketappcomponentRemove,
  getComponentListByAppId,
  marketappcomponenttemplateSubmit,
  getTemplateIdListByUserId,
  getMarketappcomponenttemplateList,
  marketappusertemplateSubmit,
  marketappcomponenttemplateRemove,
  marketappcomponenttemplateSetDefault,
  marketapproledistributionnewGetAppIdByUserId,
  getTemplateIdByUserIdInUse,
  setDefaultTemplate,
  getDefaultTemplate,
  getMarketappcomponenttemplateGetUserTemplate
}
