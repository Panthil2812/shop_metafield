import { getSessionToken } from "@shopify/app-bridge-utils";
import axios from "axios";

// ---------------- ADD DEFAULT CONTENT -----------------
export const Add_Default_Metafield = async (app, info) => {
  try {
    const token = await getSessionToken(app);
    console.log("ADD CONTENT IN DEFAULT METAFIELD ....");
    const response = await axios.post(
      "/add-default-metafield",
      { value: info },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    console.log("ADDED CONTENT IN DEFAULT METAFIELD ....");
    // console.log("ADDED CONTENT : ", response);
    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
};

// ---------------- ADD  CONTENT -----------------
export const Add_Content_Metafield = async (app, info) => {
  try {
    const token = await getSessionToken(app);
    console.log("ADD CONTENT IN COUNTRY METAFIELD ....");
    const response = await axios.post(
      "/add-country-metafield",
      { value: info },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    console.log("ADDED CONTENT IN COUNTRY METAFIELD ....");
    // console.log("ADDED CONTENT : ", response);
    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
};

// ---------------- ADD COUNTRY CONTENT -----------------
export const Get_All_Shop_Metafields = async (app, info) => {
  try {
    const token = await getSessionToken(app);
    console.log("GET ALL SHOP METAFIELDS ....");
    const value = await axios.get("/get-all-shop-metafields", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return Promise.resolve(value?.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const Del_Country_Metafield = async (app, info) => {
  try {
    const token = await getSessionToken(app);
    console.log("DELETE COUNTRY CONTENT METAFIELDS ....");
    const value = await axios.post(
      "/del-country-content-metafield",
      { value: info },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return Promise.resolve(value);
  } catch (error) {
    return Promise.reject(error);
  }
};
