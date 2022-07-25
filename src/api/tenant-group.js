import request from "@/router/axios";

const getTenantGroup = () => {
  return request({
    url: "/dev-api/asset-system/scenes/get/scene/allAttr",
    method: "GET",
    params: {},
  });
};

const getTenantGroupList = (data) => {
  return request({
    url: "/dev-api/asset-system/tenant/attr/list",
    method: "GET",
    params: {
      current: data.current,
      attrName: data.attrName,
      size: data.size,
    },
  });
};

const addTenantGroup = (data) => {
  return request({
    url: "/dev-api/asset-system/tenant/attr/submit",
    method: "POST",
    data: {
      attrName: data.attrName,
      attrRemark: data.attrRemark,
      id: data.id,
      isDeleted: data.isDeleted,
      parentId: data.parentId,
    },
  });
};

const deleteTenantGroupById = (data) => {
  return request({
    url: "/dev-api/asset-system/tenant/attr/remove",
    method: "DELETE",
    params: {
      id: data.id,
    },
  });
};

const getTenantRole = (data) => {
  return request({
    url: "/dev-api/asset-system/roles/v1/v1/list-by-attr",
    method: "GET",
    params: {
      attrId: data.attrId,
    },
  });
};

const updateTenantRole = (data) => {
  return request({
    url: "/dev-api/asset-system/tenant/attr/role/alloc",
    method: "POST",
    params: {
      attrId: data.attrId,
      roleIds: data.roleIds,
    },
  });
};

export {
  getTenantGroup,
  getTenantRole,
  addTenantGroup,
  deleteTenantGroupById,
  getTenantGroupList,
  updateTenantRole,
};
