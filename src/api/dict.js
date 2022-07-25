import request from "@/router/axios";

/**
 * @method  根据字典名称查询字典条目
 */
const getDict = (data) => {
  return request({
    url: "/dev-api/blade-system/dict/getallitembydict",
    method: "GET",
    params: {
      filtertext: data.filtertext,
    },
  });
};

/**
 * @method  获取字典列表
 */
const getDictList = (data) => {
  return request({
    url: "/dev-api/blade-system/dict/getalldict",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      tenantCode: data.tenantCode,
    },
  });
};

/**
 * @method  根据字典名称查询字典
 */
const filterbydict = (data) => {
  return request({
    url: "/dev-api/blade-system/dict/filterbydict",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      filtertext: data.filtertext,
    },
  });
};

/**
 * @method  根据字典id查询字典条目
 */
const getDictItem = (data) => {
  return request({
    url: "/dev-api/blade-system/dict/getitembydict",
    method: "GET",
    params: {
      parentid: data.parentid,
      version: data.version,
    },
  });
};

/**
 * @method  获取字典所有版本号
 */
const getDictAllVersion = (data) => {
  return request({
    url: "/dev-api/blade-system/dict/getdictallversion",
    method: "GET",
    params: {
      parentid: data.parentid,
    },
  });
};

/**
 * @method  获取字典最大版本号
 */
const getDictMax = (data) => {
  return request({
    url: "/dev-api/blade-system/dict/getdictmax",
    method: "GET",
    params: {
      parentid: data.parentid,
    },
  });
};

/**
 * @method  发布新版字典
 */
const addNewVersion = (data) => {
  return request({
    url: "/dev-api/blade-system/dict/addnewversion",
    method: "GET",
    params: {
      parentid: data.parentid,
      currversion: data.currversion,
    },
  });
};

/**
 * @method
 */
const actVersion = (data) => {
  return request({
    url: "/dev-api/blade-system/dict/actversion",
    method: "GET",
    params: {
      parentid: data.parentid,
      currversion: data.currversion,
    },
  });
};

/**
 * @method
 */
const getDictByKey = (data) => {
  return request({
    url: "/dev-api/blade-system/dict/list",
    method: "GET",
    params: {
      filtertext: data.filtertext,
    },
  });
};

/**
 * @method 删除字典版本
 */
const delVersion = (data) => {
  return request({
    url: "/dev-api/blade-system/dict/delversion",
    method: "GET",
    params: {
      parentid: data.parentid,
      currversion: data.currversion,
    },
  });
};

/**
 * @method  删除字典条目
 */
const delDictItem = (data) => {
  return request({
    url: "/dev-api/blade-system/dict/remove",
    method: "POST",
    params: {
      ids: data.ids,
    },
  });
};

/**
 * @method  删除字典
 */
const delDict = (data) => {
  return request({
    url: "/dev-api/blade-system/dict/removedict",
    method: "POST",
    params: {
      id: data.id,
    },
  });
};

/**
 * @method  新增/修改字典
 */
const submit = (data) => {
  return request({
    url: "/dev-api/blade-system/dict/submit",
    method: "POST",
    data: {
      id: data.id,
      currversion: data.currversion,
      parentId: data.parentId,
      version: data.version,
      dictparentId: data.dictparentId,
      dictKey: data.dictKey,
      code: data.code,
      dictValue: data.dictValue,
      sort: data.sort,
      remark: data.remark,
    },
  });
};

// 获取字典树
const getDictTree = (data) => {
  return request({
    url: "/dev-api/blade-system/dict/dictionary",
    method: "GET",
    params: {
      code: data.code
    },
  });
};

export {
  getDictList,
  filterbydict,
  getDictItem,
  getDictAllVersion,
  getDictMax,
  addNewVersion,
  actVersion,
  getDictByKey,
  delVersion,
  delDictItem,
  delDict,
  submit,
  getDict,
  getDictTree
};
