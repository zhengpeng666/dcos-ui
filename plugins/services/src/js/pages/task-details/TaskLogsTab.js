import React from 'react';

import SystemLogActions from '../../../../../../src/js/events/SystemLogActions';

class TaskLogsTab extends React.Component {
  constructor() {
    super(...arguments);

    this.state = {
      events: []
    };
  }

  componentWillMount() {
    let subscriptionID = SystemLogActions.subscribe(this.props.task.slave_id, {
      limit: -11,
      success: this.getData.bind(this)
    });

    this.setState({subscriptionID});
  }

  componentWillUnmount() {
    SystemLogActions.unsubscribe(this.state.subscriptionID);
  }

  getData(data) {
    this.state.events.push(data.fields.MESSAGE);
  }

  render() {
    return (
      <div>
        {this.state.events}
      </div>
    );
  }
}

TaskLogsTab.propTypes = {
  task: React.PropTypes.object.isRequired
};

module.exports = TaskLogsTab;
