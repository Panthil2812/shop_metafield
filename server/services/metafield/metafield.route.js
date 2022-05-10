import { resolve } from "path";
import express from "express";
import cookieParser from "cookie-parser";
import { Shopify, ApiVersion } from "@shopify/shopify-api";
import "dotenv/config";
import applyAuthMiddleware from "../../middleware/auth.js";
import verifyRequest from "../../middleware/verify-request.js";
const app = express();
const router = express.Router();
app.use(express.json());
applyAuthMiddleware(app);

// import { Metafield } from "@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js";

router.post("/create-metafield-shop", verifyRequest(app), async (req, res) => {
  const { Metafield } = await import(
    `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
  );
  const test_session = await Shopify.Utils.loadCurrentSession(
    request,
    response
  );
  console.log("panthil api calling .......................................");
  const metafield = new Metafield({ session: test_session });
  metafield.namespace = "inventory";
  metafield.key = "warehouse";
  metafield.value = 25;
  metafield.type = "number_integer";
  console.log("metafield data : ...........................................");
  await metafield.save({});
  res.status(200).send(metafield);
});
export const createMetafield = async (session) => {
  const { Metafield } = await import(
    `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
  );
  //   const test_session = await Shopify.Utils.loadCurrentSession(
  //     request,
  //     response
  //   );
  console.log("panthil api calling .......................................");
  const metafield = new Metafield({ session: session });
  metafield.namespace = "inventory";
  metafield.key = "paNTHIL";
  metafield.value = 25;
  metafield.type = "number_integer";
  console.log("metafield data : ...........................................");
  //   console.log("fvuiegberuifbgvuif : ", metafield);
  //   console.log("fvuiegberuifbgvuif : ", metafield);
  const fvuib = await metafield.save({});
  console.log("fvuiegberuifbgvuif : ", metafield);
  return fvuib;
};
export default router;
