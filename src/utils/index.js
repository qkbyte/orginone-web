import { isArray, isObject, forOwn, omit } from "lodash";
import { getDict } from "@api/dict";
import store from '@/store'
import { getAction } from "@/api/workordermanage";

const serialize = (data) => {
  let list = [];
  Object.keys(data).forEach((ele) => {
    list.push(`${ele}=${data[ele]}`);
  });
  return list.join("&");
};

// 将时间戳转日期格式的过滤器
const dateFormat = (dataStr) => {
  var time = new Date(dataStr);

  function timeAdd0(str) {
    if (str < 10) {
      str = "0" + str;
    }
    return str;
  }

  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return (
    y +
    "-" +
    timeAdd0(m) +
    "-" +
    timeAdd0(d) +
    " " +
    timeAdd0(h) +
    ":" +
    timeAdd0(mm) +
    ":" +
    timeAdd0(s)
  );
};

//数组去重
const dubRemove = (arr) => {
  let res = [];
  let repeat = [];
  for (let i = 0; i < arr.length; i++) {
    let name = arr[i].name;
    if (!repeat[name]) {
      res.push(arr[i]);
      repeat[name] = 1;
    }
  }
  return res;
};

/**
 * @method 删除对象数组中对象的属性为空
 * @param {*} input 需要处理的数组
 * @param {*} props 需要删除的属性
 */
const omitDeepLodash = function(input, props) {
  let p = props;
  function omitDeepOnOwnProps(obj) {
    if (!isArray(obj) && !isObject(obj)) {
      return obj;
    }

    if (isArray(obj)) {
      return omitDeepLodash(obj, p);
    }

    const o = {};
    forOwn(obj, (value, key) => {
      o[key] = omitDeepLodash(value, p);
    });

    if (isArray(o[p]) && o[p].length === 0) {
      return omit(o, p);
    } else {
      return o;
    }
  }

  if (arguments.length > 2) {
    p = Array.prototype.slice.call(arguments).slice(1);
  }

  if (typeof input === "undefined") {
    return {};
  }

  if (isArray(input)) {
    return input.map(omitDeepOnOwnProps);
  }

  return omitDeepOnOwnProps(input);
};

/**
 * @method 根据字典名获取字典条目列表
 * @param {*} dict 字典名
 */
const getDictItemList = async (dict) => {
  let dictItem = [];
  let params = {
    filtertext: dict,
  };
  await getDict(params).then((res) => {
    let list = res.data;
    if(list.length !== 0){
      dictItem = list.map((o) => {
        return { value: o.dictKey, label: o.dictValue};;
      });
    }
  });
  return dictItem;
};

/**
 * @method 根据字典名获取元数据选项列表
 * @param {*} dict 字典名
 */
const getMetaItemList = async (dict) => {
  let dictItem = [];
  let params = {
    filtertext: dict,
  };
  await getDict(params).then((res) => {
    let list = res.data;
    if(list.length !== 0){
      dictItem = list.map((o) => {
        return { value: o.dictValue, label: o.remark };
      });
    }
  });
  return dictItem;
};

/**
 * @method 根据字典名获取字典条目,以键值对返回
 * @param {*} dict 字典名
 */
const getDictItemObject = async (dict) => {
  let dictItem = {};
  let params = {
    filtertext: dict,
  };
  await getDict(params).then((res) => {
    let list = res.data;
    if(list.length !== 0){
      list.map((o) => {
        dictItem[o.dictKey] = o.dictValue;
      });
    }
  });
  return dictItem;
};

/**
 * @method 根据长度生产随机字符串
 * @param {number} len = 32 长度
 */
const randomString = (len) => {
  len = len || 32
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  const maxPos = $chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

const formatDictText = (dicts, values) => {
  if (!(Array.isArray(dicts) && dicts.length > 0)) {
      return values;
  }
  if (!values) {
      return ""
  }
  let valueArr = values.split(",")
  let contentArr = []
  dicts.forEach(dict => {
      for (let i = 0; i < valueArr.length; i++) {
          if (valueArr[i] === dict.value) {
              contentArr.push(dict.content)
              break;
          }
      }
  })
  return contentArr.toString()
}

export function getDicts(codeTypeIds) {
  let dicts = store.getters['user/dicts']
  console.log('dicts', JSON.stringify(dicts))
  let result = {}
  if (dicts && JSON.stringify(dicts) !== "{}") {
      let codeTypeIdArr = codeTypeIds.split(',')
      let every = codeTypeIdArr.every(codeTypeId => {
          if (dicts[codeTypeId] && dicts[codeTypeId].length > 0) {
              result[codeTypeId] = dicts[codeTypeId]
              return true
          }
          return false
      })
      if (every) {
          return new Promise(function (resolve) {
              resolve({data: result})
          })
      }
      console.log('111')
  }
  return getAction("/dev-api/asset-work-order/sys/codeInfo/getSysCodeInfos", {codeTypeIds}).then((res) => {
      store.dispatch('user/addDicts', res.data.data)
      return new Promise(function (resolve) {
          resolve(res.data)
      })
  })
}

export {
  serialize,
  dateFormat,
  dubRemove,
  omitDeepLodash,
  getDictItemList,
  getMetaItemList,
  getDictItemObject,
  randomString,
  formatDictText
}