import request from "@/router/axios";
import da from "element-ui/src/locale/lang/da";

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

const showMessageList = (currentPage, pageSize, data) => {
  return request({
    url: `/dev-bmp/form_inst/v2/show?page=${currentPage}&size=${pageSize}`,
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

const categoryAdd = (data) => {
  return request({
    url: "/dev-api/asset-form/category/v1/submit",
    method: "POST",
    data: data,
  });
};

const categoryEdit = (data) => {
  return request({
    url: "/dev-api/asset-form/category/v1/submit",
    method: "POST",
    data: data,
  });
};

const getCategoryNameByCategoryId = (data) => {
  return request({
    url: "/dev-api/asset-form/category/v1/detail",
    method: "GET",
    params: data,
  });
};

const deleteCategoryNameByCategoryId = (data) => {
  return request({
    url: "/dev-api/asset-form/category/v1/remove/by/ids",
    method: "POST",
    params: data,
  });
};

const deleteFromByCategoryId = (data) => {
  return request({
    url: "/dev-api/asset-form/publish/form",
    method: "POST",
    params: {
      flag: data.flag,
      formModelIds: data.formModelIds,
    },
  });
};

const changeCategoryByForm = (data) => {
  return request({
    url: "/dev-api/asset-form/update/form/category",
    method: "POST",
    params: data,
  });
};

export {
  showMessageList,
  categoryAdd,
  categoryEdit,
  getCategoryNameByCategoryId,
  deleteCategoryNameByCategoryId,
  deleteFromByCategoryId,
  changeCategoryByForm,
};
