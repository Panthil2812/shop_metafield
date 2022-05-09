import Session from "./session.model.js";

export const getAll = () => Session.find({});

export const createOrUpdateSession = ({ shop, data }) =>
  Session.updateOne({ shop }, { ...data, shop }, { upsert: true });

export const removeSession = (shop) => Session.findOneAndRemove({ shop });
