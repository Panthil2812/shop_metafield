import { uninstallShop } from "../../services/db/shop/shop.services.js";
import { SessionService } from "../../services/session/index.js";

export const appUninstallWebhookHandler = async (topic, shop, body) => {
  // console.log("hello");
  await uninstallShop(shop);

  await SessionService.removeSession(shop);
};
