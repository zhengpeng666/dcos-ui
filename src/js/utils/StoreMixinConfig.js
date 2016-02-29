import {StoreMixin} from 'mesosphere-shared-reactjs';
import StoreConfig from '../constants/StoreConfig';

StoreMixin.store_configure(StoreConfig);

function addConfig(storeID, config) {
  StoreConfig[storeID] = config;
  StoreMixin.store_configure(StoreConfig);
}

module.exports = {
  addConfig
};

