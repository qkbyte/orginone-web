import request from "@/router/axios";

const getDepartmentList = (data) => {
  return request({
    url: "/dev-api/asset-system/inner/agency/list/v2",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      tenantCode: data.tenantCode,
      fuzzyVal: data.fuzzyVal,
    },
  });
};

const getDepartmentTree = (data) => {
  return request({
    url: "/dev-api/asset-system/inner/agency/inner/tree",
    method: "GET",
    params: {
      tenantCode: data.tenantCode,
    },
  });
};

/**
 * @method 获取部门树不包含当前部门节点及其子节点
 * @param {*} data
 */
const getParentDepartmentTree = (data) => {
  return request({
    url: "/dev-api/asset-system/inner/agency/get/all/pNode",
    method: "GET",
    params: {
      deptId: data.deptId,
    },
  });
};

const addUsersToAgency = (data) => {
  return request({
    url: "/dev-api/asset-system/inner/agency/addUsersToAgency",
    method: "POST",
    params: {
      agencyId: data.agencyId,
      userIds: data.userIds,
      oldagencyId: data.oldagencyId,
    },
  });
};

const addDepartment = (data) => {
  return request({
    url: "/dev-api/asset-system/inner/agency/add/inner/user",
    method: "POST",
    params: {
      tenantCode: data.tenantCode,
      agencyName: data.agencyName,
      agencyCode: data.agencyCode,
      userIds: data.userIds,
      parentId: data.parentId,
    },
  });
};

const exportExcel = (data) => {
  return request({
    url: "/dev-api/asset-system/inner/agency/export/innerAgency",
    method: "GET",
    responseType: "blob",
    params: {
      ids: data.ids,
    },
  });
};
const exportDownload = (data) => {
  return request({
    url: "/dev-api/asset-system/inner/agency/innerAgency/model",
    method: "GET",
    responseType: "blob",
  });
};

//删除部门，支持批量
const deleteDepartment = (data) => {
  return request({
    url: "/dev-api/asset-system/inner/agency/delete/nodes",
    method: "DELETE",
    params: {
      ids: data.ids,
    },
  });
};

/**
 * @method 更新部门信息包括人员分配
 * @param {*} data
 */
const updateDepartment = (data) => {
  console.log("data", data);
  return request({
    url: "/dev-api/asset-system/inner/agency/update/inner/user",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      // "Content-Type": "charset=utf-8",
    },
    data:data
  });
};

//部门人员模板下载
const getDeptModel = () => {
  return request({
    url: "/dev-api/asset-minio/aliyunoss/downloadImportTemplate",
    method: "GET",
    responseType: "blob",
    params: {
      type: 2,
    },
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

//导入部门数据
const importDepartment = (data) => {
  return request({
    url: "/dev-api/asset-system/async/importDept",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    method: "POST",
    data: data,
  });
};

//变换部门
const changeDepartment = (data) => {
  return request({
    url: "/dev-api/asset-system/inner/agency/distribute/dept/persons",
    method: "POST",
    data:data
  });
};

//查询部门信息
const searchDeptPerson = (data) => {
  return request({
    url: "/dev-api/asset-system/person/search/dept/person",
    method: "GET",
    params: {
      name: data.name,
    },
  });
};

//添加人员
const addPerson = (data) => {
  return request({
    url: "/dev-api/asset-system/person/addPerson",
    method: "POST",
    data: data
  });
};

//  获取部门编码
const getDeptCode = (data) => {
  return request({
    url: "/dev-api/asset-system/inner/agency/getDeptCode",
    method: "GET",
    params:{
      tenantCode:data.tenantCode
    }
  });
};

//  查询部门树
const searchDeptTree = (data) => {
  return request({
    url: "/dev-api/asset-system/inner/agency/searchDeptTree",
    method: "GET",
    params:{
      name:data.name
    }
  });
};


// 部门维护导出
const exportdepartmentData = (data) => {
  return request({
    url: "/dev-api/asset-system/inner/agency/exportInnerAgencyData",
    method: "POST",
    responseType: "blob",
    params: {
      tenantCode: data.tenantCode,
    },
    data: data.list,
  });
};


export {
  getDepartmentList,
  getDepartmentTree,
  getParentDepartmentTree,
  addDepartment,
  addUsersToAgency,
  exportExcel,
  exportDownload,
  deleteDepartment,
  updateDepartment,
  importDepartment,
  getDeptModel,
  getTenantImportHistory,
  changeDepartment,
  searchDeptPerson,
  addPerson,
  getDeptCode,
  searchDeptTree,
  exportdepartmentData,
};
