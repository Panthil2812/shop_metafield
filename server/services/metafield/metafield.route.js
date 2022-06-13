import express from "express";
import { Shopify, DataType } from "@shopify/shopify-api";
import "dotenv/config";
import applyAuthMiddleware from "../../middleware/auth.js";
import verifyRequest from "../../middleware/verify-request.js";
import Countries from "./countries.js";
import path from "path";
const app = express();
const router = express.Router();
app.use(express.json());
applyAuthMiddleware(app);
const __dirname = path.resolve();
const limit = 1000;
//create shop default metafield
router.post("/add-default-metafield", verifyRequest(app), async (req, res) => {
  try {
    console.log("add-default-metafield  calling .......");
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    const info = req.body.value;
    const D_data = await Get_Metafield(session, "appmixo_default");
    let value = null;
    if (D_data.length === 0) {
      let default_Data = new Array(3).fill(null);
      default_Data[info.option] = [
        info.name,
        info.content,
        info.backgroundcolor,
        Date.now(),
      ];
      value = {
        default: default_Data,
      };
    } else {
      let get_d_data = JSON.parse(D_data[0]?.value)?.default;
      get_d_data[info.option] = [
        info.name,
        info.content,
        info.backgroundcolor,
        Date.now(),
      ];
      value = {
        default: get_d_data,
      };
    }
    const test = await Add_Content_Metafield(
      session,
      "appmixo_default",
      JSON.stringify(value)
    );

    console.log("add-default-metafield  successfully .......");
    res.status(200).json({ success: true, data: test });
  } catch (error) {
    console.log("add-default-metafield  error .......", error.message);
    return res.status(500).json({ success: false, data: error.message });
  }
});

//create shop Country metafield
router.post("/add-country-metafield", verifyRequest(app), async (req, res) => {
  try {
    console.log("add-country-metafield calling .......");
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    const info = req.body.value;
    const country_data = await Get_Metafield(session, "");
    const country_metafield_length = country_data.length;
    if (country_metafield_length === 0) {
      //first value into metafield and create first metafield object
      let Country_Data = new Array(3).fill(null);
      Country_Data[info.option] = [
        info.name,
        info.content,
        info.backgroundcolor,
        Date.now(),
      ];
      const value = {
        [info.country_code]: Country_Data,
      };
      // console.log("VALUE LENGTH : ", JSON.stringify(value).length);
      const add_content = await Add_Content_Metafield(
        session,
        `appmixo_${country_metafield_length}`,
        JSON.stringify(value)
      );
      // console.log("RESPONSE VALUE : ", add_content);
    } else {
      if (info.old_country_code == "" && info.old_option == "") {
        //create new country in metafield
        let Country_Data = new Array(3).fill(null);
        Country_Data[info.option] = [
          info.name,
          info.content,
          info.backgroundcolor,
          Date.now(),
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

        const d_res = await Edit_Content_Metafield(session, info);
        // console.log("UPDATE COUNTRY CONTENT : ", d_res);
      }
    }
    console.log("add-country-metafield successfully .......");

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("add-country-metafield  error .......", error.message);
    return res.status(500).json({ success: false, data: error.message });
  }
});

// html content call from privacypolicy api
router.get("/privacypolicy", async (req, res) => {
  try {
    console.log("privacypolicy calling .......");
    return res.status(200).sendFile("./src/assets/privacypolicy.html", {
      root: __dirname,
    });
  } catch (error) {
    console.log("privacypolicy error .......", error.message);
    return res.status(500).json({ success: false, data: error.message });
  }
});

//get all metafield object to fomatting list in array object
router.get("/get-all-shop-metafields", verifyRequest(app), async (req, res) => {
  try {
    console.log("get-all-shop-metafields calling .......");

    let fData = [];
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
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
              timestamp: data[3],
            });
          }
        });
      });
    });
    console.log("get-all-shop-metafields successfully ........");

    // console.log("arr", fData);
    return res.status(200).send(
      fData.sort(function (a, b) {
        return b.timestamp - a.timestamp;
      })
    );
  } catch (error) {
    console.log("get-all-shop-metafields error .......", error.message);
    return res.status(500).json({ success: false, data: error.message });
  }
});

//delete country in metafield value
router.post(
  "/del-country-content-metafield",
  verifyRequest(app),
  async (req, res) => {
    try {
      console.log("del-country-content-metafield calling .......");

      const session = await Shopify.Utils.loadCurrentSession(req, res, false);
      const info = req.body.value;
      const delete_res = await Delete_country_content_metafield(session, info);
      console.log("del-country-content-metafield successfully .......");

      return res.status(200).send(delete_res);
    } catch (error) {
      console.log("del-country-content-metafield error .......", error.message);
      return res.status(500).json({ success: false, data: error.message });
    }
  }
);
const Delete_country_content_metafield = async (session, info) => {
  try {
    const C_call_data = await Get_Metafield(session, info.metafield_key);
    const country_content = JSON.parse(C_call_data[0].value);
    country_content[info.Country][info.Display] = null;
    const del_country = country_content[info.Country];
    // console.log("DEL_COUNTRY : ", del_country);
    if (
      del_country[0] === null &&
      del_country[1] === null &&
      del_country[2] === null
    ) {
      delete country_content[info.Country];
    }
    // console.log("final country", country_content);
    const saved_country = await Add_Content_Metafield(
      session,
      info.metafield_key,
      JSON.stringify(country_content)
    );
    return Promise.resolve(saved_country);
  } catch (error) {
    return Promise.reject(error);
  }
};
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
    // console.log("ERROR ADD_CONTENT_METAFILED : ", error.message);
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
    // console.log("ERROR FIND_COUNTRY_CONTENT_IN_METAFIELD : ", error.message);
    return Promise.reject(error);
  }
};
// Delete the country from the metafield
const Edit_Content_Metafield = async (session, info) => {
  try {
    const Get_One_Metafield = await Get_Metafield(session, "");
    const old_data = await Find_Country_Content_In_Metafield(
      Get_One_Metafield,
      info.old_country_code
    );
    const d_data = {
      metafield_key: old_data.key,
      Display: info.old_option,
      Country: info.old_country_code,
    };
    const update_content = await Delete_country_content_metafield(
      session,
      d_data
    );
    const country_data = await Get_Metafield(session, "");
    let Country_Data = new Array(3).fill(null);
    Country_Data[info.option] = [
      info.name,
      info.content,
      info.backgroundcolor,
      Date.now(),
    ];
    // console.log("CREATE NEW FILED FOR COUNTRY CONTENT ");
    const res = await Create_New_Country_Metafield(
      session,
      country_data,
      Country_Data,
      info.country_code
    );
    return Promise.resolve(res);
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
      if (m_len < limit) {
        //add content in this metafield
        const country_content = JSON.parse(c_data[i].value);
        country_content[c_code] = info;
        // console.log("PROCESSED RUNING STATE FOR INSERT VALUE IN METAFIELD ....");
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
      // console.log("CREATE NEW METAFIELD");
      res = await Add_Content_Metafield(
        session,
        `appmixo_${c_data.length}`,
        JSON.stringify({ [c_code]: info })
      );
    }
    return Promise.resolve(res);
  } catch (error) {
    // console.log("ERROR", error);
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

//exter function for all test metafields
router.post("/all_delete_metafields", verifyRequest(app), async (req, res) => {
  try {
    console.log("all_delete_metafields calling .......");

    const session = await Shopify.Utils.loadCurrentSession(req, res, false);

    // console.log("method panthil:", ddd);
    const fff = await all_delete_metafields(session);
    console.log("all_delete_metafields successfully .......");

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log("all_delete_metafields error .......", error.message);
    return res.status(500).json({ success: false, data: error.message });
  }
});

// create multiple metafields calling one api
router.post(
  "/multiple_create_metafields",
  verifyRequest(app),
  async (req, res) => {
    try {
      console.log("multiple_create_metafields calling .......");

      const session = await Shopify.Utils.loadCurrentSession(req, res, false);
      for (let i = 0; i < 1000; i++) {
        const test = await Add_Metafield(
          session,
          (Math.random() + i * 100).toString(36).substring(7)
        );
        // console.log("loop ", i);
      }

      console.log("multiple_create_metafields successfully .......");
      res.status(200).json({ success: true });
    } catch (error) {
      console.log("multiple_create_metafields error .......", error.message);
      return res.status(500).json({ success: false, data: error.message });
    }
  }
);

// delete all metafields from store
const all_delete_metafields = async (session) => {
  try {
    const { Metafield } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );
    const id = await get_any_one_matefield(session);
    for (let i = 0; i < id.length; i++) {
      await Metafield.delete({
        session: session,
        id: id[i],
      });
      // console.log("loop ", i);
    }
    const ddd = await get_any_one_matefield(session);
    if (ddd) {
      return all_delete_metafields(session);
    } else {
      return Promise.resolve(1);
    }
  } catch (error) {}
};

// add metafield any type
const Add_Metafield = async (session, key) => {
  try {
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    const test = await client.post({
      path: "metafields",
      data: {
        metafield: {
          namespace: (Math.random() + key.length * 100)
            .toString(36)
            .substring(7),
          key,
          value: 25,
          type: "number_integer",
        },
      },
      type: DataType.JSON,
    });
    return Promise.resolve(test?.body?.metafield);
  } catch (error) {
    // console.log("ERROR ADD_CONTENT_METAFILED : ", error.message);
    return Promise.reject(error);
  }
};

// get first 50 metafield data from all metafields
const get_any_one_matefield = async (session) => {
  try {
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);

    const test = await client.get({
      path: `metafields`,
      type: DataType.JSON,
    });
    const id = await test.body.metafields.map((e) => {
      return e.id;
    });
    // console.log("method :", id);
    return Promise.resolve(id);
  } catch (error) {
    return Promise.reject(error);
  }
};

export default router;
