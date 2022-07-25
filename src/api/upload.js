import request from "@/router/axios";

const getUploadList = (data) => {
  return request({
    url: "/dev-api/asset-minio/template/listPage",
    method: "GET",
    params: {
      current:data.current,
      size:data.size,
      type: data.type,
    },
  });
};

//导入模板数据
const importUplod = (data) => {
  return request({
    url: "/dev-api/asset-minio/aliyunoss/uploadImportTemplate",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    method: "POST",
    data: data,
  });
};


export {
  getUploadList,
  importUplod
};
