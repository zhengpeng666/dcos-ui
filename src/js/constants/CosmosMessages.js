const CosmosMessages = {
  PackageAlreadyInstalled: {
    header: 'Name Already Exists',
    getMessage: function (packageName) {
      return `You have an instance of ${packageName} running using the same name. Please change the name and try again.`;
    }
  },
  default: {
    header: 'Unable to Install',
    getMessage: function () {
      return 'Please check your system and configuration. Then try again.';
    }
  }
};

module.exports = CosmosMessages;
