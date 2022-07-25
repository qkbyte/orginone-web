import request from "@/router/axios";

const getAllFields = (data) => {
  return request({
    url: "/dev-api/blade-system/metadata/field",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      mtcode: data.mtcode,
    },
  });
};

const getAllFieldsByFilter = (data) => {
  return request({
    url: "/dev-api/blade-system/metadata/filterbyfield",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      mtcode: data.mtcode,
      filtertext: data.filtertext,
    },
  });
};

const getFieldByRecid = (data) => {
  return request({
    url: "/dev-api/blade-system/metadata/field/" + data.id,
    method: "GET",
  });
};

const getCurVersion = (data) => {
  return request({
    url: "/dev-api/blade-system/metadata/getcurrversion",
    method: "GET",
    params: {
      mtcode: data.mtcode,
    },
  });
};

const updateVersion = (data) => {
  return request({
    url: "/dev-api/blade-system/metadata/" + data.mtcode,
    method: "GET",
  });
};

const deleteFieldByRecid = (data) => {
  return request({
    url: "/dev-api/blade-system/metadata/field/" + data.id,
    method: "DELETE",
  });
};

const deleteBatchField = (data) => {
  return request({
    url: "/dev-api/blade-system/metadata/field",
    method: "DELETE",
    params: {
      recids: data.recids,
    },
  });
};

const addField = (data) => {
  return request({
    url: "/dev-api/blade-system/metadata/field",
    method: "POST",
    data: {
      title: data.title,
      datatype: data.datatype,
      length: data.length,
      precision_: data.precision_,
      dict_identfy: data.dict_identfy,
      name: data.name,
      mt_code: data.mt_code,
      mastertable: data.mastertable,
      t_order: data.t_order,
    },
  });
};

const updateField = (data) => {
  return request({
    url: "/dev-api/blade-system/metadata/field/" + data.id,
    method: "PUT",
    data: {
      id: data.id,
      title: data.title,
      datatype: data.datatype,
      length: data.length,
      precision_: data.precision_,
      dict_identfy: data.dict_identfy,
      name: data.name,
      mt_code: data.mt_code,
      mastertable: data.mastertable,
      t_order: data.t_order,
    },
  });
};

export {
  getAllFields,
  getAllFieldsByFilter,
  getFieldByRecid,
  getCurVersion,
  updateVersion,
  deleteFieldByRecid,
  deleteBatchField,
  addField,
  updateField,
};
