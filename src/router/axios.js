import axios from "axios";
import { serialize } from "@utils/index";
import store from "@/store";
import { Message } from "element-ui";

axios.defaults.timeout = 60 * 1000;
//返回其他状态吗
axios.defaults.validateStatus = function(status) {
  return status >= 200 && status <= 500; // 默认的
};
//跨域请求，允许保存cookie
axios.defaults.withCredentials = true;
//HTTPrequest拦截
axios.interceptors.request.use(
  (config) => {
    const meta = config.meta || {};
    //配置headers
    if(config.url.indexOf('/jgd-service') === -1 && config.url.indexOf('/platform') === -1) {
      config.headers["Authorization"] = "Basic c3dvcmQ6c3dvcmRfc2VjcmV0";
      config.headers["blade-auth"] = store.state.user.token;
    }else {
      config.headers["tenant"] = 'jgd'
      config.headers["blade-auth"] = store.state.user.token;
    }
    
    //headers中配置serialize为true开启序列化
    if (config.method === "post" && meta.isSerialize === true) {
      config.data = serialize(config.data);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
//HTTPresponse拦截
axios.interceptors.response.use(
  (res) => {
    const status = res.data.code || 200;
    let message = (res.data && res.data.msg) || "未知错误";
    if (res.status === 401 || status === 401) {
      store.dispatch("user/logout");
      Message({
        message: '登录过期，请重新登录',
        type: "error",
      });
    } else if (status !== 200) {
      switch (status) {
        case 502:
          message = "请求数过多，请稍后再试";
          break;
        case 503:
          message = "服务器异常，请稍后再试";
          break;
      }
      Message({
        message: message,
        type: "error",
      });
      store.dispatch("loading", {
        status: false,
      });
      return Promise.reject(new Error(message));
    }
    return res;
  },
  (error) => {
    let msg = "未知错误";
    if (error.message.includes("timeout")) {
      msg = "请求超时，请稍后再试";
    } else if (error.message.includes("503")) {
      msg = "服务器异常，请稍后再试";
    } else if (error.message.includes("502")) {
      msg = "服务器异常，请稍后再试";
    }
    Message({
      message: msg,
      type: "error",
    });
    store.dispatch("loading", {
      status: false,
    });
    return Promise.reject(new Error(error));
  }
);

export default axios;
