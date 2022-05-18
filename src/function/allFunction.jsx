import { getSessionToken } from "@shopify/app-bridge-utils";
import axios from "axios";
export const addMetafieldData = async (app, info) => {
  try {
    const token = await getSessionToken(app);
    const res = await axios.get("/get-metafield", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const data = res.data.body.metafields;
    // console.log("data : ", data.length);
    if (data.length === 0) {
      //not any metafield
      // console.log("create metafield ..");
      const response = await createMetaField(app, info);
      return Promise.resolve(response);
    } else {
      // console.log("Update metafield ... ");
      const response = await updateMetaField(app, data, info);
      return Promise.resolve(response);
    }
  } catch (err) {
    return Promise.reject(err);
  }
};
export const createMetaField = async (app, info) => {
  try {
    const token = await getSessionToken(app);
    let defaultData = new Array(3).fill(null);
    let cArray = new Array(3).fill(null);
    let cJson = {};
    let c_content;
    if (info.cFlag) {
      //default
      c_content = cJson;
      defaultData[info.option] = [
        info.name,
        info.content,
        info.backgroundcolor,
      ];
    } else {
      //using country
      cArray[info.option] = [info.name, info.content, info.backgroundcolor];
      cJson[info.country_code] = cArray;
      c_content = cJson;
    }
    const reqValue = {
      country_content: c_content,
      default: defaultData,
    };

    const response = await axios.post(
      "/create-metafield-shop",
      {
        value: reqValue,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return Promise.resolve(response);
    // .then((res) => {
    //   console.log("ufibvfvud");
    //   console.log("res.................................................", res);
    // })
    // .catch((err) =>
    // {
    //   console.log(err)
    // });
  } catch (err) {
    return Promise.reject(err);
  }
};
export const updateMetaField = async (app, data, info) => {
  try {
    // console.log("UPDATEMETAFIELD FUNCTION");
    const token = await getSessionToken(app);
    let index = data.length - 1;
    let defaultData = JSON.parse(data[index].value).default;
    let cArray = new Array(3).fill(null);
    let cJson = JSON.parse(data[index].value).country_content;
    let c_content;
    // console.log("index last index of metafield : ", index);
    // console.log("Default Country data : ", typeof defaultData, defaultData);
    // console.log("Costom Country data : ", typeof cArray, cArray);

    if (info.cFlag) {
      //Country Default
      // console.log("Costom Country data : ", typeof cArray, cArray);
      c_content = cJson;
      defaultData[info.option] = [
        info.name,
        info.content,
        info.backgroundcolor,
      ];
    } else {
      // console.log("ALL Country Content : ", cJson);
      const checkCountry = cJson[info.country_code];
      if (checkCountry) {
        //already exists Country
        // console.log("before update data 0000: ", c_content);
        checkCountry[info.option] = [
          info.name,
          info.content,
          info.backgroundcolor,
        ];
        cJson[info.country_code] = checkCountry;
        // cJson[info.country_code] = cArray;
        c_content = cJson;
        // console.log("after updata data 0000: ", c_content);
      } else {
        //create country
        // console.log("before updata data 1111: ", c_content);

        cArray[info.option] = [info.name, info.content, info.backgroundcolor];
        cJson[info.country_code] = cArray;
        // cJson[backgroundcolor] = info.backgroundcolor;
        c_content = cJson;
        // console.log("after updata data 1111: ", c_content);
      }
      //costom country
    }
    const reqValue = {
      country_content: c_content,
      default: defaultData,
    };
    // console.log("ADD  DATA    BBBBB :  ", reqValue);
    const res = await axios.post(
      "/create-metafield-shop",
      {
        value: reqValue,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
};
export const deleteMetaField = async (app, info) => {
  try {
    const token = await getSessionToken(app);
    let Data = JSON.parse(await getallMetaField(app));
    if (info.Country) {
      Data.country_content[info.Country][info.Display] = null;

      const del_country = Data.country_content[info.Country];
      console.log("DEL_COUNTRY : ", del_country);
      if (
        del_country[0] === null &&
        del_country[1] === null &&
        del_country[2] === null
      ) {
        console.log(
          "ALL COUNTRY CONTENT : ",
          del_country,
          Data.country_content
        );
        const c_code = info.Country;
        delete Data.country_content[c_code];
        console.log("DELETE COUNTRY CONTENT : ", Data.country_content);
      }
    } else {
      // console.log("Default Before: ", Data.default);
      Data.default[info.Display] = null;
      // console.log("Default After: ", Data.default);
    }

    const res = await axios.post(
      "/create-metafield-shop",
      {
        value: Data,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
};
export const getallMetaField = async (app) => {
  try {
    console.log("uhfbveuy ..............................");
    const token = await getSessionToken(app);
    // console.log("panthil malavigu");
    const response = await axios.get("/get-metafield", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    // .then((res) => {
    //   const data = res;
    //   setInterval(() => {
    //     // console.log("data : ", data);
    //   }, 2000);
    // })
    // .catch((err) => {
    //   // console.log("error", err);
    // });
    return Promise.resolve(response?.data?.body?.metafields[0]?.value);
  } catch (err) {
    return Promise.reject(err);
  }
};
