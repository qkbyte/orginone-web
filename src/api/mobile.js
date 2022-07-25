import request from "@/router/axios";

const sendVerifyMobile = (data) => {
  return request({
    url: "/dev-mobile/synergy/verify/verify-issued/mobile/" + data.mobile,
    method: "GET",
    headers: { auth: "979e0241de5c4c4fb307666679178230" },
  });
};

const verifyMobile = (data) => {
  return request({
    url: "/dev-mobile/synergy/verify/SMS-verification",
    method: "POST",
    headers: { auth: "979e0241de5c4c4fb307666679178230" },
    data: {
      mobile: data.mobile,
      captcha: data.captcha,
    },
  });
};

const sendCheckCode = (data) => {
  return request({
    url: "/dev-api/asset-message/sms/token/sendCheckCode",
    method: "GET",
    params: {
      phoneNumber: data.phoneNumber,
      digit:data.digit,
    },
  });
};
export { sendVerifyMobile, verifyMobile,sendCheckCode };
