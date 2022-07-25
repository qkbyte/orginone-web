import request from "@/router/axios";

const getallaudit = (query) => {//获取全部审批
    return request({
      url: "/dev-api/blade-system/audit/getallaudit",
      method: "GET",
      params: {
        current:query.currentPage,
        size:query.pageSize,
        state:query.state? query.state :"",
        applyingName:query.applyingName?query.applyingName:""
      },
    });
  };
  const success = (data) => {//审批成功
    return request({
      url: "/dev-api/blade-system/audit/success",
      method: "POST",  
      data: data
    });
  };
  const fail = (data) => {//审批失败
    return request({
      url: "/dev-api/blade-system/audit/fail",
      method: "POST",
      data: data
    });
  };
  export{
    getallaudit,success,fail,
  }