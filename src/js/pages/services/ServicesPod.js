import React from 'react';
import PodDetail from '../../components/PodDetail';

import PodStatus from '../../structs/PodStatus';

const METHODS_TO_BIND = [
];

class ServicesPod extends React.Component {

  constructor() {
    super(...arguments);

    this.displayName = 'ServicesPod';

    this.state = {
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });

  }

  getContents(pod) {
    return (
        <PodDetail pod={pod} />
      );
  }

  render() {
    let {id} = this.props.params;

    // TODO: Populate pod struct
    let podStruct = new PodStatus({
      id: unescape(id),
      instances: [
        {
          instanceID: 'instance-1',
          agent: 'agent-id',
          resources: {
            ram: 1,
            cpu: 1,
            disk: 1,
            gpu: 0
          },
          containers: [
            {
              name: 'instance-1-task-1',
              taskID: 'instance-1-task-1-id',
              state: 'RUNNING',
              lastTerminalState: 0,
              restartCount: 0,
              resources: {
                ram: 0.5,
                cpu: 0.5,
                disk: 0.5,
                gpu: 0
              }
            },
            {
              name: 'instance-1-task-2',
              taskID: 'instance-1-task-2-id',
              state: 'RUNNING',
              lastTerminalState: 0,
              restartCount: 0,
              resources: {
                ram: 0.5,
                cpu: 0.5,
                disk: 0.5,
                gpu: 0
              }
            }
          ]
        },
        {
          instanceID: 'instance-2',
          agent: 'agent-id',
          resources: {
            ram: 1,
            cpu: 1,
            disk: 1,
            gpu: 0
          },
          containers: [
            {
              name: 'instance-2-task-1',
              taskID: 'instance-2-task-1-id',
              state: 'RUNNING',
              lastTerminalState: 0,
              restartCount: 0,
              resources: {
                ram: 0.5,
                cpu: 0.5,
                disk: 0.5,
                gpu: 0
              }
            },
            {
              name: 'instance-2-task-2',
              taskID: 'instance-2-task-2-id',
              state: 'RUNNING',
              lastTerminalState: 0,
              restartCount: 0,
              resources: {
                ram: 0.5,
                cpu: 0.5,
                disk: 0.5,
                gpu: 0
              }
            }
          ]
        }
      ]
    });

    window.pod = podStruct;

    return (
      <div>
        {this.getContents(podStruct)}
      </div>
    );
  }

};

module.exports = ServicesPod;
