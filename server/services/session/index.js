import { DBSessionServices } from "../db/index.js";

const loadSessions = async () => {
  const sessions = await DBSessionServices.getAll();
  sessions.forEach(
    ({ shop, scopes }) => (global.ACTIVE_SHOPIFY_SHOPS[shop] = scopes)
  );
};

const createSession = async (shop, scopes) => {
  await DBSessionServices.createOrUpdateSession({
    shop,
    data: { shop, scopes },
  });
  global.ACTIVE_SHOPIFY_SHOPS[shop] = scopes;
};

const removeSession = async (shop) => {
  await DBSessionServices.removeSession(shop);
  delete global.ACTIVE_SHOPIFY_SHOPS[shop];
};

export const SessionService = {
  loadSessions,
  createSession,
  removeSession,
};
