import request from "@/router/axios";

const getallacttodo = (data) => {
  return request({
    url: "/dev-api/blade-system/acttodo/getallacttodo",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      taskid: data.taskid,
      tenantCode: data.tenantCode,
      searchParameter: data.searchParameter,
    },
  });
};

const getallacttodobysearch = (data) => {
  return request({
    url: "/dev-api/blade-system/acttodo/getallacttodobysearch",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      taskid: data.taskid,
      tenantCode: data.tenantCode,
      todotime: data.todotime,
      todotimeStart: data.todotimeStart,
      todotimeEnd: data.todotimeEnd,
      todoSendTenantName: data.todoSendTenantName,
      todotitle: data.todotitle,
      todotype: data.todotype,
      searchParameter: data.searchParameter,
    },
  });
};

const getallhistoryacttodobysearch = (data) => {
  return request({
    url: "/dev-api/blade-system/acttodo/getallhistoryacttodobysearch",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      taskid: data.taskid,
      finishtime: data.finishtime,
      todoSendTenantName: data.todoSendTenantName,
      todotitle: data.todotitle,
      finishtimeStart: data.finishtimeStart,
      finishtimeEnd: data.finishtimeEnd,
    },
  });
};

const getallmysendacttodoBySearch = (data) => {
  return request({
    url: "/dev-api/blade-system/acttodo/getallmysendacttodoBySearch",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      taskid: data.taskid,
      finishtime: data.finishtime,
      finishtimeStart: data.finishtimeStart,
      finishtimeEnd: data.finishtimeEnd,
      todoSendTenantName: data.todoSendTenantName,
      todotitle: data.todotitle,
    },
  });
};

const getallfinishacttodo = (data) => {
  return request({
    url: "/dev-api/blade-system/acttodo/getallfinishacttodo",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      taskid: data.taskid,
      tenantCode: data.tenantCode,
      searchParameter: data.searchParameter,
    },
  });
};

const getallhistoryacttodo = (data) => {
  return request({
    url: "/dev-api/blade-system/acttodo/getallhistoryacttodo",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      taskid: data.taskid,
      tenantCode: data.tenantCode,
      searchParameter: data.searchParameter,
    },
  });
};

const getallinitiateacttodo = (data) => {
  return request({
    url: "/dev-api/blade-system/acttodo/getallmysendacttodo",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      taskid: data.taskid,
      tenantCode: data.tenantCode,
      searchParameter: data.searchParameter,
    },
  });
};
/**
 * @methods 获取待办数量
 * @param {*} data
 */
const getTodoNumber = () => {
  return request({
    url: "/dev-api/blade-system/acttodo/getallacttodonum",
    method: "GET",
  });
};

// 获取我的消息列表
const getMyMessages = (data) => {
  return request({
    url: "/dev-api/asset-message/message/receiver/list",
    method: "GET",
    params: {
      current: data.current,
      size: data.size,
      title: data.title,
      content: data.content,
    },
  });
};
// 获取我的消息(单条)
const getMyMessage = (data) => {
  return request({
    url: "/dev-api/asset-message/message/receiver/details",
    method: "GET",
    params: {
      id: data.id,
    },
  });
};
const unRead = (data) => {
  return request({
    url: "/dev-api/asset-message/message/update/unread",
    method: "post",
    data: data,
  });
};
// 获取未读消息数量
const getUnReadNumber = () => {
  return request({
    url: "/dev-api/asset-message/message/receiver/unread/number",
    method: "GET",
  });
};

// 获取流程对象详情
const getProcessDefinition = () => {
  return request({
    url: "/dev-api/asset-work-order/flowable/processDefinition/workorder",
    method: "GET",
  });
};

// 获取待办的表格配置
const getDefaultGroup = (data) => {
  return request({
    url: "/dev-api/asset-system/grouptenantrelations/getDefaultGroup",
    method: "POST",
    data: data,
  });
};

const messageDelete = (data) => {
  return request({
    url: "/dev-api/asset-message/message/delete",
    method: "POST",
    data: data,
  });
};

const getUnitActTodoNumbe = (data) => {
  return request({
    url: "/dev-api/blade-system/acttodo/getUnitActTodoNumber",
    method: "GET",
    params: {
      phoneNumber: data.phoneNumber,
    },
  });
};

const batchPass = (data) => {
  return request({
    url: "/dev-api/blade-system/acttodo/batchpass",
    method: "POST",
    data: data,
  });
};

const batchBack = (data) => {
  return request({
    url: "/dev-api/blade-system/acttodo/batchback",
    method: "POST",
    data: data,
  });
};


export {
  getallacttodo,
  getallfinishacttodo,
  getallhistoryacttodo,
  getallinitiateacttodo,
  getTodoNumber,
  getMyMessages,
  getMyMessage,
  getUnReadNumber,
  getProcessDefinition,
  getDefaultGroup,
  messageDelete,
  getallacttodobysearch,
  getallhistoryacttodobysearch,
  getallmysendacttodoBySearch,
  getUnitActTodoNumbe,
  unRead,
  batchPass,
  batchBack
};
