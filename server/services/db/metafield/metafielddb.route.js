import db from "./metafielddb.model.js";
import express from "express";
import { Shopify, DataType } from "@shopify/shopify-api";
import "dotenv/config";
import applyAuthMiddleware from "../../../middleware/auth.js";
import verifyRequest from "../../../middleware/verify-request.js";
import path from "path";
const app = express();
const router = express.Router();
app.use(express.json());
applyAuthMiddleware(app);
const __dirname = path.resolve();
const limit = 1000;
router.get("/get_all_country_data", verifyRequest(app), async (req, res) => {
  try {
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    const result = await db.findOne(
      { shop: session.shop },
      { __v: 0, _id: 0, updatedAt: 0, date: 0, createdAt: 0 }
    );
    res.send({
      Status: "SUCCESSFULL",
      Message: "successfully all database api ",
      Data: result,
    });
  } catch (error) {
    //  console.log(error.message)
    res.send({
      Status: "ERROR",
      Message: "ERROR all database api ",
    });
  }
});
router.get("/get_call_liquid_country_data/:shop", async (req, res) => {
  try {
    const result = await db.findOne(
      { shop: req.params["shop"] },
      { __v: 0, _id: 0, updatedAt: 0, date: 0, createdAt: 0 }
    );
    const data = result.content;
    res.send({
      Status: "SUCCESSFULL",
      Message: "successfully all database api ",
      Data: result.content,
    });
  } catch (error) {
    //  console.log(error.message)
    res.send({
      Status: "ERROR",
      Message: "ERROR all database api ",
    });
  }
});
router.post("/add_data_in_db", verifyRequest(app), async (req, res) => {
  try {
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    // console.log("add session : ", session.shop);
    const info = req.body.value;
    const old = await db.findOne({ shop: session.shop }, {});
    if (old) {
      console.log("update");
      await update_data_db_function(session.shop, info);
    } else {
      console.log("create");
      await add_data_db_function(session.shop, info);
    }

    res.send({
      Status: "SUCCESSFULL",
      Message: "successfully all database api ",
      Data: info,
    });
  } catch (error) {
    //  console.log(error)
    res.send({
      Status: "ERROR",
      Message: "ERROR all database api ",
    });
  }
});

router.post("/delete_in_db", verifyRequest(app), async (req, res) => {
  try {
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    // console.log("add session : ", session.shop);
    const info = req.body.value;
    const del_res = await delete_data_db_function(
      session.shop,
      info.Country,
      info.Display
    );
    res.send({
      Status: "SUCCESSFULL",
      Message: "successfully all database api ",
      Data: del_res,
    });
  } catch (error) {
    //  console.log(error)
    res.send({
      Status: "ERROR",
      Message: "ERROR all database api ",
    });
  }
});

const add_data_db_function = async (shop, info) => {
  try {
    let Country_Data = new Array(3).fill(null);
    Country_Data[info.option] = [
      info.name,
      info.content,
      info.backgroundcolor,
      Date.now(),
    ];
    // console.log(Country_Data);
    const country_data = {
      [info.country_code]: Country_Data,
    };
    const data = {
      shop: shop,
      content: country_data,
    };
    const rest = new db(data);
    return Promise.resolve(await rest.save());
  } catch (error) {
    console.log(error.message);
    return Promise.reject(error.message);
  }
};

const update_data_db_function = async (shop, info) => {
  try {
    if (info.old_country_code && info.old_option) {
      console.log("delete and update data");
      await delete_data_db_function(
        shop,
        info.old_country_code,
        info.old_option
      );

      await edit_data_db_function(shop, info);
    } else {
      await edit_data_db_function(shop, info);
    }
  } catch (error) {
    console.log(error.message);
    return Promise.reject(error.message);
  }
};

const edit_data_db_function = async (shop, info) => {
  try {
    const old = await db.findOne({ shop: shop }, {});
    const old_data = old.content;
    const old_country_data = old_data[info.country_code];
    if (old_country_data) {
      // update
      console.log("data is exit create", old_data);
      old_country_data[info.option] = [
        info.name,
        info.content,
        info.backgroundcolor,
        Date.now(),
      ];
      old_data[info.country_code] = old_country_data;
      console.log("updated", old_data);
    } else {
      // create new country
      let Country_Data = new Array(3).fill(null);
      Country_Data[info.option] = [
        info.name,
        info.content,
        info.backgroundcolor,
        Date.now(),
      ];
      console.log("create", old_data);
      old_data[info.country_code] = Country_Data;
      console.log("updated", old_data);
      // const country_data = {
      //   [info.country_code]: Country_Data,
      // };
    }
    return Promise.resolve(
      await db.findOneAndUpdate(
        { shop: shop },
        { content: old_data, updated_date: new Date() },
        { new: true }
      )
    );
  } catch (error) {
    console.log(error.message);
    return Promise.reject(error.message);
  }
};

const delete_data_db_function = async (shop, code, option) => {
  try {
    console.log("delete old data");
    const shop_data = await await db.findOne(
      { shop: shop },
      { __v: 0, _id: 0, updatedAt: 0, date: 0, createdAt: 0 }
    );
    // console.log("rbdfj");

    console.log("shop_data.content", shop_data.content);
    // console.log("fduhuif");
    let del_option = shop_data.content;
    console.log("del_option", del_option);

    // console.log("fdbhfduy", del_option);
    console.log("option", option);
    console.log("del_option[code]", del_option[code]);
    del_option[code][option] = null;
    console.log("del_option[code] updated", del_option[code]);
    if (
      del_option[code][0] === null &&
      del_option[code][1] === null &&
      del_option[code][2] === null
    ) {
      delete del_option[code];
    }
    console.log("del_option deleted", del_option);
    const dd = await db.findOneAndUpdate(
      { shop: shop },
      { content: del_option, updated_date: new Date() },
      { new: true }
    );
    console.log("dfybgyuifdbgvesyudfigh", dd);
    return Promise.resolve(dd);
  } catch (error) {
    console.log(error.message);
    return Promise.reject(error.message);
  }
};

export default router;
