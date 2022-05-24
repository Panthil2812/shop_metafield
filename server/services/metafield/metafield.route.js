import express from "express";
import { Shopify, DataType } from "@shopify/shopify-api";
import "dotenv/config";
import applyAuthMiddleware from "../../middleware/auth.js";
import verifyRequest from "../../middleware/verify-request.js";
import Countries from "./countries.js";
const app = express();
const router = express.Router();
app.use(express.json());
applyAuthMiddleware(app);

//create shop default metafield
router.post("/add-default-metafield", verifyRequest(app), async (req, res) => {
  try {
    const session = await Shopify.Utils.loadCurrentSession(req, res);
    // console.log("BODY DATA : ", req.body.value);
    const info = req.body.value;
    const D_data = await Get_Metafield(session, "appmixo_default");
    let value = null;
    if (D_data.length === 0) {
      let default_Data = new Array(3).fill(null);
      default_Data[info.option] = [
        info.name,
        info.content,
        info.backgroundcolor,
      ];
      value = {
        default: default_Data,
      };
      console.log("CREATE METAFIELD ....");
    } else {
      let get_d_data = JSON.parse(D_data[0]?.value)?.default;
      get_d_data[info.option] = [info.name, info.content, info.backgroundcolor];
      value = {
        default: get_d_data,
      };
      console.log("UPDATE METAFIELD ....");
    }
    const test = await Add_Content_Metafield(
      session,
      "appmixo_default",
      JSON.stringify(value)
    );
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(200).json({ success: false });
  }
});
//create shop Country metafield
router.post("/add-country-metafield", verifyRequest(app), async (req, res) => {
  try {
    const session = await Shopify.Utils.loadCurrentSession(req, res);
    const info = req.body.value;
    const C_call_data = await Get_Metafield(session, "");
    const country_data = C_call_data.filter((e) => e.key != "appmixo_default");
    const country_metafield_length = country_data.length;
    if (country_metafield_length === 0) {
      //first value into metafield and create first metafield object
      let Country_Data = new Array(3).fill(null);
      Country_Data[info.option] = [
        info.name,
        info.content,
        info.backgroundcolor,
      ];
      const value = {
        [info.country_code]: Country_Data,
      };
      console.log("VALUE LENGTH : ", JSON.stringify(value).length);
      const add_content = await Add_Content_Metafield(
        session,
        `appmixo_${country_metafield_length}`,
        JSON.stringify(value)
      );
      // console.log("RESPONSE VALUE : ", add_content);
    } else {
      const country_content = await Find_Country_Content_In_Metafield(
        country_data,
        info.country_code
      );
      if (!country_content) {
        //create new country in metafield
        let Country_Data = new Array(3).fill(null);
        Country_Data[info.option] = [
          info.name,
          info.content,
          info.backgroundcolor,
        ];
        // console.log("CREATE NEW FILED FOR COUNTRY CONTENT ");
        const res = await Create_New_Country_Metafield(
          session,
          country_data,
          Country_Data,
          info.country_code
        );
      } else {
        // update existing country content
        const d_res = await Edit_Content_Metafield(
          session,
          country_content.key,
          country_content.content,
          info.country_code,
          info
        );
        // console.log("UPDATE COUNTRY CONTENT : ", d_res);
      }
    }
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(200).json({ success: false });
  }
});

//get all metafield object to fomatting list in array object
router.get("/get-all-shop-metafields", verifyRequest(app), async (req, res) => {
  try {
    let fData = [];
    const session = await Shopify.Utils.loadCurrentSession(req, res);
    const result = await Get_Metafield(session, "");
    // console.log("result: " + JSON.stringify(result));
    // console.log("panthil");
    result.map((e) => {
      const M_Data = JSON.parse(e.value);
      Object.keys(M_Data).map((key) => {
        M_Data[key].map((data, index) => {
          // console.log(key, data, "\n");
          if (data) {
            fData.push({
              id: (Math.random() + 1).toString(36).substring(7),
              Name: data[0],
              Country: key,
              fullCountry: key === "Default" ? "Default" : Countries[key],
              metafield_key: e.key,
              Display: index ? (index === 1 ? "Footer" : "Products") : "Header",
              Content: data[1],
              BackgroundColor: data[2],
            });
          }
        });
      });
    });

    // console.log("arr", fData);
    return res.status(200).send(
      fData.sort(function (a, b) {
        return a.fullCountry.localeCompare(b.fullCountry);
      })
    );
  } catch (error) {
    return res.status(200).send({
      success: false,
      data: error.message,
    });
  }
});

//delete country in metafield value
router.post(
  "/del-country-content-metafield",
  verifyRequest(app),
  async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(req, res);
      const info = req.body.value;
      const C_call_data = await Get_Metafield(session, info.metafield_key);
      const country_content = JSON.parse(C_call_data[0].value);
      country_content[info.Country][info.Display] = null;
      const del_country = country_content[info.Country];
      console.log("DEL_COUNTRY : ", del_country);
      if (
        del_country[0] === null &&
        del_country[1] === null &&
        del_country[2] === null
      ) {
        delete country_content[info.Country];
      }
      console.log("final country", country_content);
      const saved_country = await Add_Content_Metafield(
        session,
        info.metafield_key,
        JSON.stringify(country_content)
      );
      return res.status(200).send("panthil");
    } catch (error) {
      return res.status(200).send({
        success: false,
        data: error.message,
      });
    }
  }
);
// Default contetn add in metafield_default
const Default_Content_Metafield = async (session, value) => {
  try {
    const { Metafield } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );
    const metafield = new Metafield({ session: session });
    metafield.namespace = "appmixo_dynamic";
    metafield.key = "appmixo_default";
    metafield.value = value;
    metafield.type = "json";
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    const test = await client.post({
      path: "metafields",
      data: { metafield },
      type: DataType.JSON,
    });
    return Promise.resolve(test?.body?.metafield);
  } catch (error) {
    return Promise.reject(error);
  }
};
//Content add in metafield using key/value
const Add_Content_Metafield = async (session, key, value) => {
  try {
    const { Metafield } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );
    const metafield = new Metafield({ session: session });
    metafield.namespace = "appmixo_dynamic";
    metafield.key = key;
    metafield.value = value;
    metafield.type = "json";
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    const test = await client.post({
      path: "metafields",
      data: { metafield },
      type: DataType.JSON,
    });
    return Promise.resolve(test?.body?.metafield);
  } catch (error) {
    console.log("ERROR ADD_CONTENT_METAFILED : ", error.message);
    return Promise.reject(error);
  }
};
// find country in shop metafield list and return country content
const Find_Country_Content_In_Metafield = async (c_data, c_code) => {
  try {
    const country_metafield = c_data.filter((data) => {
      const dd = JSON.parse(data.value);
      return dd[c_code];
    })[0];
    if (country_metafield) {
      const meta_key = country_metafield.key;
      const content = JSON.parse(country_metafield?.value)[c_code];
      return Promise.resolve({ key: meta_key, content: content });
    } else {
      return Promise.resolve(0);
    }
  } catch (error) {
    console.log("ERROR FIND_COUNTRY_CONTENT_IN_METAFIELD : ", error.message);
    return Promise.reject(error);
  }
};
// Delete the country from the metafield
const Edit_Content_Metafield = async (session, key, old_data, c_code, info) => {
  try {
    const Get_One_Metafield = await Get_Metafield(session, "");
    const country_data = Get_One_Metafield.filter(
      (e) => e.key === key && e.key != "appmixo_default"
    );

    const value = JSON.parse(country_data[0].value);
    delete value[c_code];
    const res = await Add_Content_Metafield(
      session,
      key,
      JSON.stringify(value)
    );
    old_data[info.option] = [info.name, info.content, info.backgroundcolor];
    console.log("update content metadata : ", old_data);
    if (key === "appmixo_default") {
      Get_One_Metafield = Get_One_Metafield.filter(
        (e) => e.key != "appmixo_default"
      );
    }

    const update_content = await Create_New_Country_Metafield(
      session,
      Get_One_Metafield,
      old_data,
      c_code
    );
    return Promise.resolve(update_content);
  } catch (error) {
    return Promise.reject(error.message);
  }
};
// create new country enter in metafield
const Create_New_Country_Metafield = async (session, c_data, info, c_code) => {
  try {
    let status = 0;
    let res = null;
    for (let i in c_data) {
      const m_len = c_data[i]?.value?.length + JSON.stringify(info)?.length;
      // console.log("Metafield ", c_code[i].key, "  length : ", m_len);
      if (m_len < 1000) {
        //add contetn in this metafield
        const country_content = JSON.parse(c_data[i].value);
        country_content[c_code] = info;
        console.log(
          "PROCESSED RUNING STATE FOR INSERT VALUE IN METAFIELD ...."
        );
        res = await Add_Content_Metafield(
          session,
          c_data[i].key,
          JSON.stringify(country_content)
        );
        status = 1;
        break;
      }
    }
    if (!status) {
      console.log("CREATE NEW METAFIELD");
      res = await Add_Content_Metafield(
        session,
        `appmixo_${c_data.length}`,
        JSON.stringify({ [c_code]: info })
      );
    }
    return Promise.resolve(res);
  } catch (error) {
    console.log("ERROR", error);
    return Promise.reject(error);
  }
};
// Get Shop Metafield using key name
const Get_Metafield = async (session, key) => {
  try {
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    const query = {
      namespace: "appmixo_dynamic",
      key: key,
      owner_resource: "shop",
    };
    const test = await client.get({
      path: `metafields`,
      query: query,
      type: DataType.JSON,
    });
    // res.status(200).send(test);
    return Promise.resolve(test?.body?.metafields);
  } catch (error) {
    return Promise.reject(error);
  }
};
export default router;
