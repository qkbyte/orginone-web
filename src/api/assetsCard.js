import request from "@/router/axios";
/**
 * @method  获取首页卡片信息
 * @param {*} 
 */
const getAssetsCard = (data) => {
  return request({
    url: '/asset-search-service/MongoDB/getAssetGroup',
    method: "POST",
    data: {
      assetCode: data.assetCode,
      orgId: data.orgId
    },
  });
};

const getAssetsList = (data) => {
  return request({
    url: '/platform/ListManage/queryList',
    method: "POST",
    data: data,
  });
};
const getTwoColumn = (data) => {
  return request({
    url: '/platform/ListManage/queryList',
    method: "POST",
    data: data,
  });
};

const getPurchaseAppGroupList = (data) => {
    return request({
        url: '/dev-api/asset-market/marketapppurchase/purchaseAppGroupList',
        method: "GET",
        data: data,
    });
};
  
  export { getAssetsCard ,getAssetsList ,getPurchaseAppGroupList, getTwoColumn};
