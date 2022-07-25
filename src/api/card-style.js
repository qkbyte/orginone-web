import request from "@/router/axios";

const getcardstyle = (data) => {
  return request({
    url: "/dev-api/asset-card/cardstyle/getcardstyle",
    method: "GET",
  });
};

const deletecardstyleByRecid = (data) => {
  return request({
    url: "/dev-api/asset-card/cardstyle/cardstyle/" + data.recid,
    method: "DELETE",
  });
};

const addcardstyle = (data) => {
  return request({
    url: "/dev-api/asset-card/cardstyle/addcardstyle",
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

const updatecardstyle = (data) => {
  return request({
    url: "/dev-api/asset-card/cardstyle/cardstyle/" + data.recid,
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

export { getcardstyle, deletecardstyleByRecid, addcardstyle, updatecardstyle };
