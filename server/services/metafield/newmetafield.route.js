import express from "express";
import { Shopify, DataType } from "@shopify/shopify-api";
import "dotenv/config";
import applyAuthMiddleware from "../../middleware/auth.js";
import verifyRequest from "../../middleware/verify-request.js";
import Countries from "./countries.js";
import path from "path";
import { type } from "os";
const app = express();
const router = express.Router();
app.use(express.json());
applyAuthMiddleware(app);
const __dirname = path.resolve();
const limit = 1000;
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
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    const client = new Shopify.Clients.Graphql(
      session.shop,
      session.accessToken
    );
    // const response = await client.query({
    //   data: `mutation CreateAppOwnedMetafield {
    //     metafieldsSet(metafields: [
    //       {
    //         namespace: "appmixo_dynamic",
    //         key: "appmixo_0",
    //         type: "single_line_text_field",
    //         value: "panthil",
    //         ownerId: "gid://shopify/AppInstallation/375306911920"
    //       }

    //     ]) {
    //       metafields {
    //         id
    //         namespace
    //         key
    //       }
    //       userErrors {
    //         field
    //         message
    //       }
    //     }
    //   }`,
    // });
    // const response = await client.query({
    //   data: `{
    //     currentAppInstallation {
    //       metafields(first: 100) {
    //         nodes {
    //           id
    //           key
    //           namespace
    //           ownerType
    //           value
    //           type

    //         }
    //       }
    //     }
    //   }`,
    // });

    let fData = [];
    const result = await Get_Metafield(session, "");
    console.log("result", result);

    result.map((e) => {
      const M_Data = JSON.parse(
        e.value
          .replaceAll("'", '"')
          .replaceAll('style="', "style='")
          .replaceAll(';">', ";'>")
      );
      Object.keys(M_Data).map((key) => {
        M_Data[key].map((data, index) => {
          console.log(key, data, "\n");
          if (data) {
            fData.push({
              id: (Math.random() + 1).toString(36).substring(7),
              Name: data[0],
              Country: key,
              fullCountry: key === "Default" ? "Default" : Countries[key],
              metafield_key: e.key,
              Display: index
                ? index === 1
                  ? "Footer"
                  : "Products page"
                : "Header",
              Content: data[1],
              BackgroundColor: data[2],
              timestamp: data[3],
            });
          }
        });
      });
    });
    console.log("get-all-shop-metafields successfully ........");

    console.log("arr", fData);
    // return res.status(200).json({
    //   success: true,
    //   data: result,
    // });
    return res.status(200).json({
      success: true,
      data: fData.sort(function (a, b) {
        return b.timestamp - a.timestamp;
      }),
    });
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
      console.log(0);
      const info = req.body.value;
      console.log(0);
      const delete_res = await Delete_country_content_metafield(session, info);
      console.log(0);
      console.log("del-country-content-metafield successfully .......");

      return res.status(200).send(delete_res);
    } catch (error) {
      console.log("del-country-content-metafield error .......", error);
      return res.status(500).json({ success: false, data: error.message });
    }
  }
);
//create shop Country metafield
router.post("/add-country-metafield", verifyRequest(app), async (req, res) => {
  try {
    console.log("add-country-metafield calling .......");
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    //console.log("add session : ", session);
    const info = req.body.value;
    const country_data = await Get_Metafield(session, "");
    console.log(
      "country_data ___ length  : ",
      typeof country_data,
      country_data?.length
    );
    const country_metafield_length = country_data?.length;
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
      console.log("else condition calling");
      const country_content = await Find_Country_Content_In_Metafield(
        country_data,
        info.country_code
      );
      console.log("ffffffffffffffffffffffffff");
      if (info.old_country_code === "" && !country_content) {
        //create new country in metafield
        if (info.old_country_code != info.country_code) {
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
        }
      } else {
        if (info.old_option === "" && info.old_country_code === "") {
          const dd = await Already_Create_Content_Metafield(
            session,
            country_content,
            info
          );
        } else {
          if (info.old_country_code === info.country_code) {
            const dd = await Already_Create_Content_Metafield(
              session,
              country_content,
              info
            );
          } else if (info.old_country_code !== info.country_code) {
            console.log(
              "both country_code not same",
              info.old_country_code,
              info.old_option
            );
            const old_country_content = await Find_Country_Content_In_Metafield(
              country_data,
              info.old_country_code
            );
            const C_call_data = await Get_Metafield(
              session,
              old_country_content.key
            );
            const del_country_content = JSON.parse(
              C_call_data[0].value
                .replaceAll("'", '"')
                .replaceAll('style="', "style='")
                .replaceAll(';">', ";'>")
            );
            del_country_content[info.old_country_code][info.old_option] = null;
            const del_country = del_country_content[info.old_country_code];
            console.log("DEL_COUNTRY : ", del_country);
            if (
              del_country[0] === null &&
              del_country[1] === null &&
              del_country[2] === null
            ) {
              delete del_country_content[info.Country];
            }
            console.log("final country", country_content);
            const saved_country = await Add_Content_Metafield(
              session,
              old_country_content.key,
              JSON.stringify(del_country_content)
            );
            console.log("fuisdvniu");
            const dd = await Already_Create_Content_Metafield(
              session,
              country_content,
              info
            );
          }
        }
      }
    }
    console.log("add-country-metafield successfully .......");

    res.status(200).json({ success: true, data: "1" });
  } catch (error) {
    console.log("add-country-metafield  error .......", error.message);
    return res.status(500).json({ success: false, data: error.message });
  }
});
// already create country edit in metafields
const Already_Create_Content_Metafield = async (session, c_data, info) => {
  if (c_data) {
    const C_call_data = await Get_Metafield(session, c_data.key);
    const country_content = JSON.parse(
      C_call_data[0].value
        .replaceAll("'", '"')
        .replaceAll('style="', "style='")
        .replaceAll(';">', ";'>")
    );
    let temp = country_content[info.country_code];
    console.log("temp Before :", temp);
    if (info.old_option !== "" && info.old_option !== info.option) {
      console.log("option change detected");
      temp[info.old_option] = null;
    }
    temp[info.option] = [
      info.name,
      info.content,
      info.backgroundcolor,
      Date.now(),
    ];
    delete country_content[info.country_code];
    const saved_country = await Add_Content_Metafield(
      session,
      c_data.key,
      JSON.stringify(country_content)
    );
    const country_data = await Get_Metafield(session, "");
    // console.log("CREATE NEW FILED FOR COUNTRY CONTENT ");
    const res = await Create_New_Country_Metafield(
      session,
      country_data,
      temp,
      info.country_code
    );
  } else {
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
  }
};

// delete country using option and update in metafields
const Delete_country_content_metafield = async (session, info) => {
  try {
    const C_call_data = await Get_Metafield(session, info.metafield_key);
    console.log("ccccc", C_call_data);

    const country_content = JSON.parse(
      C_call_data[0].value
        .replaceAll("'", '"')
        .replaceAll('style="', "style='")
        .replaceAll(';">', ";'>")
    );
    console.log("fduib", country_content);
    country_content ? (country_content[info.Country][info.Display] = null) : "";
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
    return Promise.resolve(saved_country);
  } catch (error) {
    return Promise.reject(error);
  }
};

//Content add in metafield using key/value
const Add_Content_Metafield = async (session, key, value) => {
  try {
    const client = new Shopify.Clients.Graphql(
      session.shop,
      session.accessToken
    );
    const Get_id = await Get_App_Installation_Id(session);
    const Create_metafield = await client.query({
      data: `mutation CreateAppOwnedMetafield {
        metafieldsSet(metafields: [
          {
            namespace: "appmixo_dynamic",
            key: "${key}",
            type: "single_line_text_field",
            value: "${value.replaceAll('"', "'")}",
            ownerId: "${Get_id}"
          }
        ]) {
          metafields {
            id
            namespace
            key
          }
          userErrors {
            field
            message
          }
        }
      } `,
    });
    console.log(
      "Create_metafield?.body?.data : ",
      JSON.stringify(Create_metafield?.body)
    );
    return Promise.resolve(Create_metafield?.body?.data);
  } catch (error) {
    console.log("error create metyafield  : ", error);
    return Promise.reject(error);
  }
};
// find country in shop metafield list and return country content
const Find_Country_Content_In_Metafield = async (c_data, c_code) => {
  try {
    const country_metafield = c_data.filter((data) => {
      const dd = JSON.parse(
        data.value
          .replaceAll("'", '"')
          .replaceAll('style="', "style='")
          .replaceAll(';">', ";'>")
      );
      return dd[c_code];
    })[0];
    if (country_metafield) {
      const meta_key = country_metafield.key;
      const content = JSON.parse(
        country_metafield?.value
          .replaceAll("'", '"')
          .replaceAll('style="', "style='")
          .replaceAll(';">', ";'>")
      )[c_code];
      return Promise.resolve({ key: meta_key, content: content });
    } else {
      return Promise.resolve(0);
    }
  } catch (error) {
    // console.log("ERROR FIND_COUNTRY_CONTENT_IN_METAFIELD : ", error.message);
    return Promise.reject(error);
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
        const country_content = JSON.parse(
          c_data[i].value
            .replaceAll("'", '"')
            .replaceAll('style="', "style='")
            .replaceAll(';">', ";'>")
        );
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
const Get_App_Installation_Id = async (session) => {
  try {
    const client = new Shopify.Clients.Graphql(
      session.shop,
      session.accessToken
    );
    const Get_id = await client.query({
      data: `{
      app{
        id
        installation
        {
          id
        }
      }
    }`,
    });
    return Promise.resolve(Get_id?.body?.data?.app?.installation?.id);
  } catch (error) {
    return Promise.reject(error);
  }
};
// Get Shop Metafield using key name
const Get_Metafield = async (session, key) => {
  try {
    const client = new Shopify.Clients.Graphql(
      session.shop,
      session.accessToken
    );
    const Get_response = await client.query({
      data: `{
        app {
          installation {
            metafields(first: 100,namespace:"appmixo_dynamic") {
              nodes {
                namespace
                key
                value
              }
            }
          }
        }
      }`,
    });

    const ddd = Get_response?.body?.data?.app?.installation?.metafields?.nodes;
    return Promise.resolve(ddd);
  } catch (error) {
    return Promise.reject(error);
  }
};

export default router;
