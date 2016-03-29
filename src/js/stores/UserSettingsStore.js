import {Store} from 'mesosphere-shared-reactjs';

import LocalStorageUtil from '../utils/LocalStorageUtil';

const LOCAL_STORAGE_KEY = 'dcosUserSettings';
const SAVED_STATE_KEY = 'savedStates';

function getLocalStorageObject() {
  let localStorageObject = LocalStorageUtil.get(LOCAL_STORAGE_KEY);
  try {
    return JSON.parse(localStorageObject);
  } catch (e) {
    return null;
  }
}

const UserSettingsStore = Store.createStore({
  storeID: 'userSettings',

  setSavedState: function (key, value) {
    let localStorageObject = getLocalStorageObject();

    if (localStorageObject == null) {
      localStorageObject = {[SAVED_STATE_KEY]: {}};
    }

    if (localStorageObject[SAVED_STATE_KEY] == null) {
      localStorageObject[SAVED_STATE_KEY] = {};
    }

    localStorageObject[SAVED_STATE_KEY][key] = value;
    LocalStorageUtil.set(LOCAL_STORAGE_KEY, JSON.stringify(localStorageObject));
  },

  getSavedState: function (key) {
    let localStorageObject = getLocalStorageObject();
    if (localStorageObject == null) {
      return null;
    }

    if (localStorageObject[SAVED_STATE_KEY]) {
      return localStorageObject[SAVED_STATE_KEY][key];
    }

    return null;
  }
});

module.exports = UserSettingsStore;
