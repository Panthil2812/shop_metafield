import { uninstallShop } from "../../services/db/shop/shop.services.js";
import { SessionService } from "../../services/session/index.js";

export const appUninstallWebhookHandler = async (topic, shop, body) => {
  await uninstallShop(shop);
  await SessionService.removeSession(shop);
};
