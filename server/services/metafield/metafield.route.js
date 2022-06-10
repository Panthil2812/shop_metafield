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



router.get("/privacypolicy", async (req, res) => {
  try {
    // console.log("arr", fData);
    return res
      .status(200)
      .send(
        `<div id="root"><div class="App"><div class="privacy-policy-container" style="width: 90%; max-width: 1170px; margin: 0px auto; background: rgb(255, 255, 255); box-shadow: rgba(0, 0, 0, 0.2) 0px 6px 60px; padding: 20px; border-top: 5px solid rgb(34, 34, 34); line-height: 25px; text-align: left;"><h1 style="margin: 0px 0px 10px; font-weight: 700; font-size: 28px; letter-spacing: 0.5px;">Privacy Policy</h1><p>Country wise Dynamic Content App is owned And operated By AppMixo™ Lab LLP, which provides the SERVICE.</p><p>This page is used to inform application visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service, the Country wise Dynamic Content App.</p><p>If you choose to use our Service, then you agree to the collection and use of information in relation with this policy. The Personal Information that we collect are used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.</p><p>We understand that you value your privacy, and we want to help make your experience with our Services satisfying and safe. This Privacy Policy may be updated from time to time. For example, we may update this Privacy Policy to reflect changes to our information collection and use practices.</p><hr style="margin: 40px 0px;"><h2 style="margin: 0px 0px 10px; font-weight: 700; font-size: 28px; letter-spacing: 0.5px;"> Information Collection and Use</h2><p>For a better experience while using our Service, collection and use of information in this Policy, we refer to our collection and use of “Personal Information.” “Personal Information,” as used in this Policy, is personally identifiable information, which is information that directly identifies an individual, such as first and last name, mailing address, email address, IP addresses, demographics, passwords or other online contact information, or telephone number. We collect Personal Information, as well as non-personally identifiable information.  The information that we collect will be used to contact or identify you.</p><hr style="margin: 40px 0px;"><h2 style="margin: 0px 0px 10px; font-weight: 700; font-size: 28px; letter-spacing: 0.5px;"> Log Data</h2><p>We want to inform you that whenever you visit our Service, we collect information that your browser sends to us that is called Log Data. This Log Data may include information such as your computer’s Internet Protocol ("IP") address, browser version, pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other statistics.</p><hr style="margin: 40px 0px;"><h2 style="margin: 0px 0px 10px; font-weight: 700; font-size: 28px; letter-spacing: 0.5px;"> Service Providers</h2><p>We may employ third-party companies and individuals due to the following reasons:</p><ul style="list-style: disc; padding-left: 21px;"><li>To facilitate our Service;</li><li>To provide the Service on our behalf;</li><li>To perform Service-related services; or</li><li>To assist us in analyzing how our Service is used.</li></ul><p>We want to inform our Service users that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.</p><hr style="margin: 40px 0px;"><h2 style="margin: 0px 0px 10px; font-weight: 700; font-size: 28px; letter-spacing: 0.5px;"> Security</h2><p>We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.</p><hr style="margin: 40px 0px;"><h2 style="margin: 0px 0px 10px; font-weight: 700; font-size: 28px; letter-spacing: 0.5px;"> Links to Other Sites</h2><p>Our Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over, and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p><p>Children’s Privacy</p><p>Our Services do not address anyone under the age of 13. We do not knowingly collect personal identifiable information from children under 13. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do necessary actions.</p><hr style="margin: 40px 0px;"><h2 style="margin: 0px 0px 10px; font-weight: 700; font-size: 28px; letter-spacing: 0.5px;"> Changes to This Privacy Policy</h2><p>We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately, after they are posted on this page.</p><hr style="margin: 40px 0px;"><h2 style="margin: 0px 0px 10px; font-weight: 700; font-size: 28px; letter-spacing: 0.5px;"> Contact Us</h2><p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.</p></div></div></div>`
      );
  } catch (error) {
    return res.status(200).send({
      success: false,
      data: error.message,
    });
  }
});

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
