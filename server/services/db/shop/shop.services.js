import { APP_STATUS } from "../../../constants/index.js";
import Shop from "./shop.model.js";

export const addShopData = ({ shop, data }) =>
  Shop.updateOne({ shop }, { ...data, shop }, { upsert: true });

export const uninstallShop = (shop) =>
  Shop.updateOne({ shop }, { app_status: APP_STATUS.UNINSTALLED });

export const getShopData = (shop) => Shop.findOne({ shop }).lean();
