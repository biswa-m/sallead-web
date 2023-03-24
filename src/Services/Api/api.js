import CryptoJS from "crypto-js";
import axios from "axios";
import config from "../../Config";

const encrypt = (x) => {
  let str = JSON.stringify(x);
  return CryptoJS.AES.encrypt(str, config.encryptionSecret).toString();
};

const encryptPayload = (obj) => {
  let res = {};
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const x = obj[key];
      res[key] = encrypt(x);
    }
  }
  return res;
};

const decrypt = (x) => {
  const str = CryptoJS.AES.decrypt(x, config.encryptionSecret).toString(
    CryptoJS.enc.Utf8
  );
  return JSON.parse(str);
};

const api = {
  request: ({ uri, params, body, headers: headerProps, method = "GET" }) => {
    let headers = {
      "x-encryption": "encrypt",
      appname: config.appname,
      ...(headerProps || {}),
    };
    return axios
      .request({
        method,
        url: config.apiUrl + uri,
        headers,
        data:
          headers?.["x-encryption"] === "encrypt" ? encryptPayload(body) : body,
        params,
      })
      .then((x) =>
        headers?.["x-encryption"] === "encrypt" && x.data?.data
          ? decrypt(x.data.data)
          : x.data
      )
      .catch((e) => {
        console.log(e);
        throw new Error(e?.response?.data?.message || "Something Went Wrong");
      });
  },
};

export default api;
