/*eslint-disable no-unused-vars*/

// Include modules that aren't statically imported elsewhere
import SidebarActions from '../events/SidebarActions';

// Modules to paths
module.exports = {
  events: {
    SidebarActions: 'SidebarActions'
  },
  structs: {
    List: 'List',
    Item: 'Item'
  },
  utils: {
    StringUtil: 'StringUtil',
    RequestUtil: 'RequestUtil',
    DOMUtils: 'DOMUtils',
    ResourceTableUtil: 'ResourceTableUtil',
    TableUtil: 'TableUtil',
    LocalStorageUtil: 'LocalStorageUtil',
    Util: 'Util',
    StoreMixinConfig: 'StoreMixinConfig'
  },
  mixins: {
    PluginGetSetMixin: 'PluginGetSetMixin',
    InternalStorageMixin: 'InternalStorageMixin',
    TabsMixin: 'TabsMixin',
    TooltipMixin: 'TooltipMixin'
  },
  components: {
    SidePanelContents: 'SidePanelContents',
    RequestErrorMsg: 'RequestErrorMsg',
    IconInfo: 'icons/IconInfo',
    MesosphereLogo: 'icons/MesosphereLogo',
    FormModal: 'FormModal',
    FilterHeadline: 'FilterHeadline',
    FilterInputText: 'FilterInputText',
    ActionsModal: 'modals/ActionsModal',
    ClusterHeader: 'ClusterHeader',
    AlertPanel: 'AlertPanel',
    DCOSLogo: 'DCOSLogo',
    ClusterName: 'ClusterName'
  },
  config: {
    Config: 'Config'
  }
};
