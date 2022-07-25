import request from "@/router/axios";

const getcardmodule = (data) => {
  return request({
    url: "/dev-api/asset-card/cardmodule/getcardmodule",
    method: "GET",
  });
};

const deleteCardModuleByRecid = (data) => {
  return request({
    url: "/dev-api/asset-card/cardmodule/cardmodule/" + data.recid,
    method: "DELETE",
  });
};

const addCardModule = (data) => {
  return request({
    url: "/dev-api/asset-card/cardmodule/addcardmodule",
    method: "POST",
    data: {
      // id:data.id,
      name: data.name,
      type: data.type,
      remarks: data.remarks,
      parentid: data.parentid,
      state: data.state,
      t_order: data.t_order,
    },
  });
};

const updateCardModule = (data) => {
  return request({
    url: "/dev-api/asset-card/cardmodule/cardmodule/" + data.recid,
    method: "PUT",
    data: {
      recid: data.recid,
      name: data.name,
      type: data.type,
      remarks: data.remarks,
      parentid: data.parentid,
      state: data.state,
      t_order: data.t_order,
    },
  });
};

export {
  getcardmodule,
  deleteCardModuleByRecid,
  addCardModule,
  updateCardModule,
};
