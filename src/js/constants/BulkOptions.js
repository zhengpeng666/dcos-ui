const BulkOptions = {
  user: {
    add: {
      dropdownOption: 'Add to Group',
      title: 'Add to Group',
      actionPhrase: 'will be added to the selected group'
    },
    remove: {
      dropdownOption: 'Remove from Group',
      title: 'Remove from Group',
      actionPhrase: 'will be deleted from the selected group'
    },
    delete: {
      dropdownOption: 'Delete',
      title: 'Are you sure?',
      actionPhrase: 'will be deleted'
    }
  },
  group: {
    add: {
      dropdownOption: 'Add User',
      title: 'Add User',
      actionPhrase: 'will be added to the selected groups'
    },
    remove: {
      dropdownOption: 'Remove User',
      title: 'Remove User',
      actionPhrase: 'will be deleted from the selected groups'
    },
    delete: {
      dropdownOption: 'Delete',
      title: 'Are you sure?',
      actionPhrase: 'will be deleted'
    }
  }
};

export default BulkOptions;
