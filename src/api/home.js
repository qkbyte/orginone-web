import request from "@/router/axios";

const addPortal = (data) => {
  return request({
    url: "/dev-api/blade-system/home/addportal",
    method: "POST",
    params: {
      portal_name: data.portal_name,
      portal_type: data.portal_type,
      portal_remark: data.portal_remark,
    },
  });
};

const updatePortal = (data) => {
  return request({
    url: "/dev-api/blade-system/home/updateportal",
    method: "POST",
    params: {
      recid: data.recid,
      portal_name: data.portal_name,
      portal_type: data.portal_type,
      portal_remark: data.portal_remark,
    },
  });
};

const deletePortalByRecid = (data) => {
  return request({
    url: "/dev-api/blade-system/home/portal/" + data.recid,
    method: "DELETE",
  });
};

const relPortalByroleid = (data) => {
  return request({
    url:
      "/dev-api/blade-system/home/relPortalByroleid/" +
      data.recid +
      "/" +
      data.roleid,
    method: "POST",
  });
};

const relPortalByuserid = (data) => {
  return request({
    url:
      "/dev-api/blade-system/home/relPortalByuserid/" +
      data.recid +
      "/" +
      data.userid,
    method: "POST",
  });
};

const getallcontain = (data) => {
  return request({
    url: "/dev-api/blade-system/home/getallcontain",
    method: "GET",
    params: {
      portalid: data.portalid,
      filtertext: data.filtertext,
    },
  });
};

const updateContain = (data) => {
  return request({
    url: "/dev-api/blade-system/home/updateContain",
    method: "POST",
    data: { data },
  });
};

const addContain = (data) => {
  return request({
    url: "/dev-api/blade-system/home/addContain",
    method: "POST",
    data: { data },
  });
};

const deleteContainByRecid = (data) => {
  return request({
    url: "/dev-api/blade-system/home/PublicContain/" + data.recid,
    method: "DELETE",
  });
};
const deleteContain = (data) => {
  return request({
    url: "/dev-api/blade-system/home/Contain/" + data.recid,
    method: "DELETE",
  });
};

const getallcontainbyuserid = (data) => {
  return request({
    url: "/dev-api/blade-system/home/getallcontainbyuserid",
    method: "GET",
    data: {
      userid: data.userid,
      filtertext: data.filtertext,
    },
  });
};

const updatePublicContain = (data) => {
  return request({
    url: "/dev-api/blade-system/home/updatePublicContain",
    method: "POST",
    data: {
      recid: data.recid,
      portal_id: data.portal_id,
      contain_name: data.contain_name,
      width: data.width,
      height: data.height,
      contain_link: data.contain_link,
      relate_width: data.relate_width,
      relate_height: data.relate_height,
      contain_type: data.contain_type,
    },
  });
};

const addPublicContain = (data) => {
  return request({
    url: "/dev-api/blade-system/home/addPublicContain",
    method: "POST",
    data: {
      portal_id: data.portal_id,
      contain_name: data.contain_name,
      width: data.width,
      height: data.height,
      contain_link: data.contain_link,
      relate_width: data.relate_width,
      relate_height: data.relate_height,
      contain_type: data.contain_type,
    },
  });
};

const deletePublicContainByRecid = (data) => {
  return request({
    url: "/dev-api/blade-system/home/PublicContain/" + data.recid,
    method: "DELETE",
  });
};

const getallportal = (data) => {
  return request({
    url: "/dev-api/blade-system/home/getallportal",
    method: "GET",
    params: {
      filtertext: data.filtertext,
    },
  });
};

const getpubliccontainbyfilter = (data) => {
  return request({
    url: "/dev-api/blade-system/home/getpubliccontainbyfilter",
    method: "GET",
    params: {
      filtertext: data.filtertext,
    },
  });
};

const getTemplateIdByLoginInUse = (data) => {
  return request({
    url: "/dev-api/asset-market/marketappusertemplate/getTemplateIdByLoginInUse",
    method: "GET",
  });
};

const getMarketappcomponentList = (data) => {
  return request({
    url: "/dev-api/asset-market/marketappcomponent/list",
    method: "GET",
    params:{
      current: data.current,
      marketAppComponent:data.marketAppComponent,
      size:data.size
    }
  });
};

const setGroupTenantDefaultTemplate = (data) => {
  return request({
    url: "/dev-api/asset-market/marketappusertemplate/setGroupTenantDefaultTemplate",
    method: "POST",
    data:data
  });
};

export {
  addPortal,
  updatePortal,
  deletePortalByRecid,
  relPortalByroleid,
  relPortalByuserid,
  getallcontain,
  updateContain,
  addContain,
  deleteContainByRecid,
  getallcontainbyuserid,
  updatePublicContain,
  addPublicContain,
  deletePublicContainByRecid,
  getallportal,
  deleteContain,
  getpubliccontainbyfilter,
  getTemplateIdByLoginInUse,
  getMarketappcomponentList,
  setGroupTenantDefaultTemplate
};
