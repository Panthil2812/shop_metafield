import { uninstallShop } from "../../services/db/shop/shop.services.js";

export const appUninstallWebhookHandler = async (topic, shop, body) => {
  // console.log("hello");
  await uninstallShop(shop);
};
