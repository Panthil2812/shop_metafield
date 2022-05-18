import { resolve } from "path";
import express from "express";
import cookieParser from "cookie-parser";
import { Shopify, DataType } from "@shopify/shopify-api";
import "dotenv/config";
import applyAuthMiddleware from "../../middleware/auth.js";
import verifyRequest from "../../middleware/verify-request.js";
const app = express();
const router = express.Router();
app.use(express.json());
applyAuthMiddleware(app);

//create shop metafield
router.post("/create-metafield-shop", verifyRequest(app), async (req, res) => {
  const session = await Shopify.Utils.loadCurrentSession(req, res);
  const { Metafield } = await import(
    `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
  );
  const metafield = new Metafield({ session: session });
  metafield.namespace = "appmixo_dynamic";
  metafield.key = "appmixo_1";
  const req_body = JSON.stringify(req.body.value);
  console.log("panthil check create time metafield size : ", req_body.length);

  metafield.value = req_body;
  // metafield.value_type = "string";
  metafield.type = "single_line_text_field";

  const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
  const test = await client.post({
    path: "metafields",
    data: { metafield },
    type: DataType.JSON,
  });
  // console.log("Metafield :  .....", JSON.stringify(test, null, 2));
  // const test = metafield;
  res.status(200).send(test);
});

//get metafield
router.get("/get-metafield", verifyRequest(app), async (req, res) => {
  const session = await Shopify.Utils.loadCurrentSession(req, res);
  const { Metafield } = await import(
    `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
  );
  const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
  const query = { namespace: "appmixo_dynamic", owner_resource: "shop" };
  const test = await client.get({
    path: `metafields`,
    query: query,
    type: DataType.JSON,
  });
  // const test = await Metafield.all({
  //   session: session,
  //   // metafield: { namespace: "appmixo_dynamic", owner_resource: "shop" },
  //   // metafield: { owner_id: "674387490", owner_resource: "article" },
  // });
  // console.log("Metafield :  .....", JSON.stringify(test));
  res.status(200).send(test);
});
export default router;
