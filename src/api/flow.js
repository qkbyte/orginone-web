import request from "@/router/axios";

const getFlowDiagramById = (data) => {
  return request({
    url: "/dev-bmp/admin/proc_inst/diagram",
    method: "GET",
    responseType: "blob",
    params: {
      proc_inst_id: data.proc_inst_id,
    },
  });
};

const getFormInstById = (data) => {
  return request({
    url: "/dev-bmp/form_inst/v2/share_link",
    method: "POST",
    // params: {
    //     taskId: data.task_id,
    //     userId:data.userId,
    //     sectionId:"",
    //     curSectionUsers:"",
    // }
    data: data,
  });
};

const approveHTTP = (data) => {
  return request({
    url: "/dev-bmp/form_inst/v4/approval_node",
    method: "POST",
    data: data,
    // params: {
    //     approve_result: data.approve_result,
    //     form_inst_sheet: data.form_inst_sheet,
    //     form_inst_value: JSON.stringify(data.form_inst_value),
    //     form_model_id: data.form_model_id,
    //     proc_inst_id: data.proc_inst_id,
    //     task_id: data.task_id
    // }
  });
};

const readDone = (data) => {
  return request({
    url: "/dev-bmp/form_inst/v3/pending_node",
    method: "POST",
    data: data,
    // params: {
    //     editor: data.editor,
    //     form_model_id: data.form_model_id,
    //     proc_inst_id: data.proc_inst_id,
    //     task_id: data.task_id,
    // }
  });
};

const getTemplateGroup = (data) => {
  return request({
    url: "/dev-api/asset-form/category/v1/getAll",
    method: "GET",
    // data: data,
    params: data,
    // params: {
    //     editor: data.editor,
    //     form_model_id: data.form_model_id,
    //     proc_inst_id: data.proc_inst_id,
    //     task_id: data.task_id,
    // }
  });
};

const getTemplateInfoWithGroup = (data) => {
  return request({
    url: "/dev-api/asset-form/form/template/get/template/list",
    method: "GET",
    params: data,
    // params: {
    //     editor: data.editor,
    //     form_model_id: data.form_model_id,
    //     proc_inst_id: data.proc_inst_id,
    //     task_id: data.task_id,
    // }
  });
};

const getFormInfoWithGroup = (data) => {
  return request({
    url: "/dev-api/asset-form/get/form/by/category",
    method: "GET",
    params: data,
    // params: {
    //     editor: data.editor,
    //     form_model_id: data.form_model_id,
    //     proc_inst_id: data.proc_inst_id,
    //     task_id: data.task_id,
    // }
  });
};
const getFormInfoWithUserId = (data) => {
  return request({
    url: "/dev-api/asset-form/get/user/form/page",
    method: "GET",
    params: data,
    // params: {
    //     editor: data.editor,
    //     form_model_id: data.form_model_id,
    //     proc_inst_id: data.proc_inst_id,
    //     task_id: data.task_id,
    // }
  });
};

const getAuthList = (data) => {
  return request({
    url: "/dev-api/asset-user/user/get/person/tenantCode/v2",
    method: "GET",
    params: data,
    // params: {
    //     editor: data.editor,
    //     form_model_id: data.form_model_id,
    //     proc_inst_id: data.proc_inst_id,
    //     task_id: data.task_id,
    // }
  });
};

const getItemInfo = (data) => {
  return request({
    url: "/dev-api/asset-form/get/form/by/many/id",
    method: "GET",
    params: data,
    // params: {
    //     editor: data.editor,
    //     form_model_id: data.form_model_id,
    //     proc_inst_id: data.proc_inst_id,
    //     task_id: data.task_id,
    // }
  });
};

const getBriefItemInfo = (data) => {
  return request({
    url: "/dev-api/asset-form/get/form/list",
    method: "GET",
    params: data,
    // params: {
    //     editor: data.editor,
    //     form_model_id: data.form_model_id,
    //     proc_inst_id: data.proc_inst_id,
    //     task_id: data.task_id,
    // }
  });
};

const setFormFirstInfo = (data) => {
  return request({
    url: "/dev-api/asset-form/form_model/v2/save1",
    method: "POST",
    data: data,
    // params: {
    //     editor: data.editor,
    //     form_model_id: data.form_model_id,
    //     proc_inst_id: data.proc_inst_id,
    //     task_id: data.task_id,
    // }
  });
};

const setTempFirstInfo = (data) => {
  return request({
    url: "/dev-api/asset-form/create/form/by/template/create",
    method: "POST",
    data: data,
    // params: {
    //     editor: data.editor,
    //     form_model_id: data.form_model_id,
    //     proc_inst_id: data.proc_inst_id,
    //     task_id: data.task_id,
    // }
  });
};

const editFormFirstInfo = (data) => {
  return request({
    url: "/dev-api/asset-form/form_model/v2/save1",
    method: "POST",
    data: data,
    // params: {
    //     editor: data.editor,
    //     form_model_id: data.form_model_id,
    //     proc_inst_id: data.proc_inst_id,
    //     task_id: data.task_id,
    // }
  });
};

const editTempFirstInfo = (data) => {
  return request({
    url: "/dev-api/asset-form/create/form/by/template/update",
    method: "POST",
    data: data,
    // params: {
    //     editor: data.editor,
    //     form_model_id: data.form_model_id,
    //     proc_inst_id: data.proc_inst_id,
    //     task_id: data.task_id,
    // }
  });
};

const editFormInfo2 = (data) => {
  return request({
    url: "/dev-api/asset-form/form_model/v2/save2",
    method: "POST",
    data: data,
    // params: {
    //     editor: data.editor,
    //     form_model_id: data.form_model_id,
    //     proc_inst_id: data.proc_inst_id,
    //     task_id: data.task_id,
    // }
  });
};

const editTempInfo2 = (data) => {
  return request({
    url: "/dev-api/asset-form/create/form/by/template22",
    method: "POST",
    data: data,
    // params: {
    //     editor: data.editor,
    //     form_model_id: data.form_model_id,
    //     proc_inst_id: data.proc_inst_id,
    //     task_id: data.task_id,
    // }
  });
};

const getInstanceInfo = (data) => {
  return request({
    url: "/dev-api/asset-bpm/proc_inst/insts",
    method: "GET",
    params: data,
    // params: {
    //     editor: data.editor,
    //     form_model_id: data.form_model_id,
    //     proc_inst_id: data.proc_inst_id,
    //     task_id: data.task_id,
    // }
  });
};
const getFormOrTemplateInfo = (data) => {
  return request({
    url: "/dev-api/asset-form/get/form/by/many/id",
    method: "GET",
    params: data,
    // params: {
    //     editor: data.editor,
    //     form_model_id: data.form_model_id,
    //     proc_inst_id: data.proc_inst_id,
    //     task_id: data.task_id,
    // }
  });
};

const getFormAuthList = (data) => {
  return request({
    url: "/dev-api/asset-system/person/get/all/cons/person/v2",
    method: "POST",
    data: data,
  });
};

const setFormAuthList = (data) => {
  return request({
    url: "/dev-api/asset-form/update/form/auth",
    method: "POST",
    data: data,
  });
};

const deleteTemplateById = (data) => {
  return request({
    url: "/dev-api/asset-form/form/template/v1/remove",
    method: "DELETE",
    params: data,
  });
};

const get = (url, data) => {
  return request({
    url: url,
    method: "GET",
    params: data,
  });
};

const post = (url, data) => {
  return request({
    url: url,
    method: "POST",
    data: data,
  });
};

const deleteHelper = (url, data) => {
  return request({
    url: url,
    method: "DELETE",
    params: data,
  });
};

const post2 = (url, data) => {
  return request({
    url: url,
    method: "POST",
    params: data,
  });
};

export {
  getFlowDiagramById,
  getFormInstById,
  approveHTTP,
  readDone,
  getTemplateGroup,
  getTemplateInfoWithGroup,
  getFormInfoWithGroup,
  editTempFirstInfo,
  getFormInfoWithUserId,
  getAuthList,
  getItemInfo,
  getBriefItemInfo,
  setFormFirstInfo,
  setTempFirstInfo,
  editFormFirstInfo,
  editFormInfo2,
  editTempInfo2,
  getInstanceInfo,
  getFormOrTemplateInfo,
  getFormAuthList,
  setFormAuthList,
  get,
  post,
  post2,
  deleteTemplateById,
  deleteHelper,
};
