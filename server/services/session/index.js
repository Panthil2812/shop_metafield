import {
  createOrUpdateSession,
  getSession,
  removeSession,
} from "../db/session/session.services.js";

class CustomSessionStorage {
  storeCallback = async (session) => {
    try {
      console.log("11111111111111111111111111111");
      return !!(await createOrUpdateSession(session));
    } catch (err) {
      throw new Error(err);
    }
  };

  loadCallback = async (id) => {
    try {
      console.log("2222222222222222222222222222222222222", id);
      const data = await getSession(id);

      if (data) {
        return JSON.parse(data.sessionData);
      } else {
        return undefined;
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  deleteCallback = async (id) => {
    try {
      console.log("33333333333333333333333333333333333333");
      return !!(await removeSession(id));
    } catch (err) {
      throw new Error(err);
    }
  };
}

export default CustomSessionStorage;
