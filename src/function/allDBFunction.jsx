import { getSessionToken } from "@shopify/app-bridge-utils";
import axios from "axios";

// ----------------------------------------------------------------
// Add data in databae
export const Add_DB_Country = async (app, info) => {
  try {
    const token = await getSessionToken(app);
    console.log("ADD CONTENT IN DATABASE ....");
    const response = await axios.post(
      "/db/add_data_in_db",
      { value: info },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    console.log("ADDED CONTENT IN DATABASE ....");
    // console.log("ADDED CONTENT : ", response);
    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Add data in databae
export const Delete_DB_Country = async (app, info) => {
  try {
    const token = await getSessionToken(app);
    console.log("DELETE CONTENT IN DATABASE ....");
    const response = await axios.post(
      "/db/delete_in_db",
      { value: info },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    console.log("DELETED CONTENT IN DATABASE ....");
    // console.log("ADDED CONTENT : ", response);
    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Get data in database
export const Get_DB_Country = async (app, info) => {
  try {
    const token = await getSessionToken(app);
    console.log("GET CONTENT IN DATABASE ....");
    const response = await axios.get("/db/get_all_country_data", {
      headers: {
        Authorization: "Bearer " + token,
        "ngrok-skip-browser-warning": false,
      },
    });
    console.log("GETED CONTENT IN DATABASE ....");
    // console.log("ADDED CONTENT : ", response);
    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
};
