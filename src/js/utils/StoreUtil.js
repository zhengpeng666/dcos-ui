import StringUtil from "./StringUtil";

const StoreUtil = {
  getChangeFunctionName(storeID, event) {
    let storeName = StringUtil.capitalize(storeID);
    let eventName = StringUtil.capitalize(event);

    return `on${storeName}Store${eventName}`;
  }
};

export default StoreUtil;
