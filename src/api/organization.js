import request from "@/router/axios";
/**
 * @method 单位是否认证
 * @param {*} data
 */
const tenantIsAttestation = () => {
  return request({
    url: "/dev-api/asset-system/organs/v2/is/identification",
    method: "GET",
    params: {},
  });
};
/**
 * @method
 * @param {*} none
 */
const downloadModel = () => {
  return request({
    url: "/dev-api/asset-system/group/model/down",
    method: "get",
  });
};

//组织模板下载
const getDeptModel = () => {
  return request({
    url: "/dev-api/asset-minio/aliyunoss/downloadImportTemplate",
    method: "GET",
    responseType: "blob",
    params:{
      type:5
    }
  });
};

//导入部门数据
const importDepartment = (data) => {
  return request({
    url: "/dev-api/asset-system/async/importGroupRelation",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    method: "POST",
    data: data,
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
      tableName: data.tableName,
    },
  });
};

//性质模板下载
const getOptionDeptModel = () => {
  return request({
    url: "/dev-api/asset-minio/aliyunoss/downloadImportTemplate",
    method: "GET",
    responseType: "blob",
    params:{
      type:6
    }
  });
};

//导入性质数据
const importOptionDepartment = (data) => {
  return request({
    url: "/dev-api/asset-system/async/importTenantRelation",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    method: "POST",
    data: data,
  });
};

/**
 * 获取组织单位列表
 * @param {*} unitName -单位名称
 */
const getOrgansList = (data) => {
  return request({
    url: "/dev-api/asset-system/organs/v2/listPage",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      unitName: data.unitName,
      id:data.id,
      socialCreditCode:data.socialCreditCode,
      tenantId: data.tenantId,
      isDeleted:data.isDeleted,
    },
  });
};

/**
 * 添加组织单位
 * @param {*} unitName -单位名称
 */
const AddOrgansList = (data) => {
  return request({
    url: "/dev-api/asset-system/organs/v2/submit",
    method: "POST",
    data:data
  });
};

/**
 * 删除组织单位
 * @param {*} unitName -单位名称
 */
const delOrgansList = (data) => {
  return request({
    url: "/dev-api/asset-system/organs/v2/removeByIds",
    method: "POST",
    params:{
      ids:data.ids
    }
  });
};

/**
 * @method 批量删除单位
 * @param {*} data
 */
const deletesOrgansList = (data) => {
  return request({
    url: "/dev-api/asset-system/organs/v2/nodes/" + data.ids,
    method: "DELETE",
  });
};

/**
 * @method 删除单位
 * @param {*} data
 */
const deleteOrgansList = (data) => {
  return request({
    url: "/dev-api/asset-system/organs/v2/node/" + data.id,
    method: "DELETE",
  });
};


export {deletesOrgansList, deleteOrgansList, getOrgansList,delOrgansList,tenantIsAttestation, downloadModel, getDeptModel, importDepartment, getTenantImportHistory, getOptionDeptModel,importOptionDepartment,AddOrgansList };
