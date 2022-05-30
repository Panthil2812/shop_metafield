import { APP_STATUS } from "../../../constants/index.js";
import Shop from "./shop.model.js";

export const addShopData = async ({ shop, data }) =>
  await Shop.updateOne({ shop }, { ...data, shop }, { upsert: true });

export const uninstallShop = async (shop) => {
  await Shop.updateOne({ shop }, { app_status: APP_STATUS.UNINSTALLED });
};
export const getShopData = (shop) => Shop.findOne({ shop }).lean();
