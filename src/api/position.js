import request from "@/router/axios";

//新增岗位
const addPosition = (data) => {
  return request({
    url: "/dev-api/asset-system/jobs/v1/add/job/user",
    method: "POST",
    params: {
      deptId: data.deptId,
      jobName: data.jobName,
      userIds: data.userIds,
    },
  });
};

//更新岗位信息
const updatePosition = (data) => {
  return request({
    url: "/dev-api/asset-system/jobs/v1/update/job/user",
    method: "POST",
    params: {
      sort: data.sort,
      deptId: data.deptId,
      jobId: data.jobId,
      jobName: data.jobName,
      userIds: data.userIds,
    },
  });
};

//删除岗位
const deletePosition = (data) => {
  return request({
    url: "/dev-api/asset-system/jobs/v1/remove",
    method: "DELETE",
    params: {
      ids: data.ids,
      tenantCode: data.tenantCode,
    },
  });
};
//获取岗位列表
const getPositionList = (data) => {
  return request({
    url: "/dev-api/asset-system/jobs/v1/list/job",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      tenantCode: data.tenantCode,
    },
  });
};

//获取岗位列表，带分页
const getPositionListPage = (data) => {
  return request({
    url: "/dev-api/asset-system/jobs/v1/list/v2",
    method: "GET",
    params: {
      tenantCode: data.tenantCode,
      current: data.current,
      size: data.size,
    },
  });
};

//岗位模板下载
const getPostModel = () => {
  return request({
    url: "/dev-api/asset-minio/aliyunoss/downloadImportTemplate",
    method: "GET",
    responseType: "blob",
    params: {
      type: 3,
    },
  });
};

//集团岗位模板下载
const getGroupPostModel = () => {
  return request({
    url: "/dev-api/asset-minio/aliyunoss/downloadImportTemplate",
    method: "GET",
    responseType: "blob",
    params: {
      type: 7,
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

//导入岗位数据
const importPosition = (data) => {
  return request({
    url: "/dev-api/asset-system/async/importJob",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    method: "POST",
    data: data,
  });
};

//导入集团岗位数据
const importGroupPosition = (data) => {
  return request({
    url: "/dev-api/asset-system/jobs/v1/import/groupjob",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    method: "POST",
    data: data,
  });
};

// 岗位信息搜索
const getSearchJobList = (data) => {
  return request({
    url: "/dev-api/asset-system/jobs/v1/searchJobList",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      name: data.name,
      tenantCode: data.tenantCode,
    },
  });
};

/**
 * 获取当前用户所在的岗位
 * @param {*} type -0导入的记录 1导入的数据
 */
const selectJobsByUserId = (data) => {
  return request({
    url: "/dev-api/asset-system/jobs/v1/selectJobsByUserId",
    method: "GET",
    params: {
      userId: data.userId,
    },
  });
};

export {
  addPosition,
  getPositionList,
  updatePosition,
  deletePosition,
  getPositionListPage,
  getPostModel,
  getGroupPostModel,
  importPosition,
  importGroupPosition,
  getTenantImportHistory,
  getSearchJobList,
  selectJobsByUserId,
};
