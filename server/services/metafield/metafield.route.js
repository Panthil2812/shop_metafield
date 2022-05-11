import { resolve } from "path";
import express from "express";
import cookieParser from "cookie-parser";
import { Shopify, ApiVersion, DataType } from "@shopify/shopify-api";
import "dotenv/config";
import applyAuthMiddleware from "../../middleware/auth.js";
import verifyRequest from "../../middleware/verify-request.js";
const app = express();
const router = express.Router();
app.use(express.json());
applyAuthMiddleware(app);

//create shop metafield
router.post("/create-metafield-shop", verifyRequest(app), async (req, res) => {
  // res.status(200).send(req);
  console.log(req.body);
  const session = await Shopify.Utils.loadCurrentSession(req, res);
  // console.log(session, "session");
  const { Metafield } = await import(
    `@shopify/shopify-api/dist/rest-resources/2022-04/index.js`
  );
  const metafield = new Metafield({ session: session });
  metafield.namespace = "appmixo_dynamic";
  metafield.key = "appmixo";
  metafield.value = JSON.stringify({
    store_name: "panthil",
    country_content: {
      IN: ["Header", "Footer", "products"],
      AF: ["Header", "Footer", "products"],
      UK: ["Header", "Footer", "products"],
      CN: ["Header", "Footer", "products"],
      US: ["Header", "Footer", "products"],
    },
    default: ["Header", "Footer", "products"],
  });

  metafield.type = "json";
  const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
  const test = await client.post({
    path: "metafields",
    data: { metafield },
    type: DataType.JSON,
  });
  console.log("Metafield :  .....", JSON.stringify(test, null, 2));
  res.status(200).send(test);
});

export default router;
