import React from 'react';

import FullScreenModal from '../../../../../../src/js/components/modals/FullScreenModal';
import FullScreenModalHeader from '../../../../../../src/js/components/modals/FullScreenModalHeader';
import FullScreenModalHeaderActions from '../../../../../../src/js/components/modals/FullScreenModalHeaderActions';
import FullScreenModalHeaderTitle from '../../../../../../src/js/components/modals/FullScreenModalHeaderTitle';
import NewCreateServiceModalServicePicker from './NewCreateServiceModalServicePicker';
import NewCreateServiceModalForm from './NewCreateServiceModalForm';
import ServiceConfigDisplay from '../ServiceConfigDisplay';
import ToggleButton from '../../../../../../src/js/components/ToggleButton';
import Util from '../../../../../../src/js/utils/Util';

const METHODS_TO_BIND = ['handleJSONToggle', 'handleServiceSelection'];

class NewServiceFormModal extends React.Component {
  constructor() {
    super(...arguments);

    this.state = {
      isJSONModeActive: false,
      servicePickerActive: true,
      serviceFormActive: false
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  handleJSONToggle() {
    this.setState({isJSONModeActive: !this.state.isJSONModeActive});
  }

  handleServiceSelection() {
    this.setState({
      reviewConfigActive: false,
      servicePickerActive: false,
      serviceFormActive: true
    });
  }

  getHeader() {
    return (
      <FullScreenModalHeader>
        <FullScreenModalHeaderActions actions={this.getSecondaryActions()}
          type="secondary" />
        <FullScreenModalHeaderTitle>
          Run a Service
        </FullScreenModalHeaderTitle>
        <FullScreenModalHeaderActions actions={this.getPrimaryActions()}
          type="primary" />
      </FullScreenModalHeader>
    );
  }

  getModalContent() {
    if (this.state.servicePickerActive) {
      return (
        <NewCreateServiceModalServicePicker
          onServiceSelect={this.handleServiceSelection} />
      );
    }

    if (this.state.reviewConfigActive) {
      // TODO: Pass in the actual app definition.
      const appDefinition = {
        "id": "/foo/bar/baz/arangodb3",
        "cmd": "sleep 100;",
        "args": [
          "framework",
          "--framework_name=arangodb3",
          "--master=zk://master.mesos:2181/mesos",
          "--zk=zk://master.mesos:2181/arangodb3",
          "--user=",
          "--principal=arangodb3",
          "--role=arangodb3",
          "--mode=cluster",
          "--async_replication=false",
          "--minimal_resources_agent=mem(*):2048;cpus(*):0.25;disk(*):2048",
          "--minimal_resources_dbserver=mem(*):4096;cpus(*):1;disk(*):4096",
          "--minimal_resources_secondary=mem(*):4096;cpus(*):1;disk(*):4096",
          "--minimal_resources_coordinator=mem(*):4096;cpus(*):1;disk(*):1024",
          "--nr_agents=3",
          "--nr_dbservers=2",
          "--nr_coordinators=2",
          "--failover_timeout=604800",
          "--secondaries_with_dbservers=false",
          "--coordinators_with_dbservers=false",
          "--arangodb_image=arangodb/arangodb-mesos:3.0",
          "--arangodb_privileged_image=false",
          "--arangodb_force_pull_image=true"
        ],
        "user": null,
        "env": {
          "ARANGODB_WEBUI_HOST": "",
          "ARANGODB_WEBUI_PORT": "0",
          "MESOS_AUTHENTICATE": "false",
          "ARANGODB_SECRET": "",
          "SECRET-2-KEY": {
            "secret": "secret1"
          },
          "I-AM-NOT-A-SECRET": "foo",
          "I-AM-NOT-A-SECRET-EITHER": "bar",
          "SECRET-1-KEY": {
            "secret": "secret0"
          },
          "SECRET-WHATEVER-KEY": {
            "secret": "secret2"
          }
        },
        "instances": 1,
        "cpus": 0.25,
        "mem": 512,
        "disk": 0,
        "gpus": 0,
        "executor": null,
        "constraints": null,
        "fetch": null,
        "storeUrls": null,
        "backoffSeconds": 1,
        "backoffFactor": 1.15,
        "maxLaunchDelaySeconds": 3600,
        "container": {
          "docker": {
            "image": "docker.io/arangodb/arangodb-mesos-framework:3.0-build5",
            "forcePullImage": true,
            "privileged": false,
            "network": "HOST"
          },
          "volumes": [
            {
              "containerPath": "my-docker-container-path",
              "hostPath": "my-host-path",
              "mode": "RO"
            },
            {
              "containerPath": "my-external-container-path",
              "external": {
                "name": "my-external-volume-name",
                "provider": "dvdi",
                "options": {
                  "dvdi/driver": "rexray"
                }
              },
              "mode": "RW"
            },
            {
              "containerPath": "my-local-container-path",
              "persistent": {
                "size": 100
              },
              "mode": "RW"
            }
          ]
        },
        "healthChecks": [
          {
            "protocol": "HTTP",
            "path": "some-path",
            "gracePeriodSeconds": 324523,
            "intervalSeconds": 52324,
            "timeoutSeconds": 3425345,
            "maxConsecutiveFailures": 34534,
            "portIndex": 435235,
            "ignoreHttp1xx": true
          },
          {
            "protocol": "COMMAND",
            "command": {
              "value": "my-command"
            },
            "gracePeriodSeconds": 245,
            "intervalSeconds": 3245,
            "timeoutSeconds": 34534,
            "maxConsecutiveFailures": 345,
            "portIndex": -23245
          },
          {
            "protocol": "TCP",
            "gracePeriodSeconds": 3421,
            "intervalSeconds": 2134,
            "timeoutSeconds": 239,
            "maxConsecutiveFailures": 234,
            "portIndex": 234123
          }
        ],
        "readinessChecks": null,
        "dependencies": null,
        "upgradeStrategy": {
          "minimumHealthCapacity": 1,
          "maximumOverCapacity": 1
        },
        "labels": {
          "DCOS_PACKAGE_RELEASE": "4",
          "DCOS_SERVICE_SCHEME": "http",
          "DCOS_PACKAGE_SOURCE": "https://universe.mesosphere.com/repo",
          "DCOS_PACKAGE_COMMAND": "eyJwaXAiOlsiaHR0cHM6Ly9naXRodWIuY29tL2FyYW5nb2RiL2FyYW5nb2RiMy1kY29zL2FyY2hpdmUvMS4wLjAudGFyLmd6Il19",
          "DCOS_PACKAGE_METADATA": "eyJwYWNrYWdpbmdWZXJzaW9uIjoiMy4wIiwibmFtZSI6ImFyYW5nb2RiMyIsInZlcnNpb24iOiIxLjAuNCIsIm1haW50YWluZXIiOiJpbmZvQGFyYW5nb2RiLmNvbSIsImRlc2NyaXB0aW9uIjoiQSBkaXN0cmlidXRlZCBmcmVlIGFuZCBvcGVuLXNvdXJjZSBkYXRhYmFzZSB3aXRoIGEgZmxleGlibGUgZGF0YSBtb2RlbCBmb3IgZG9jdW1lbnRzLCBncmFwaHMsIGFuZCBrZXktdmFsdWVzLiBCdWlsZCBoaWdoIHBlcmZvcm1hbmNlIGFwcGxpY2F0aW9ucyB1c2luZyBhIGNvbnZlbmllbnQgU1FMLWxpa2UgcXVlcnkgbGFuZ3VhZ2Ugb3IgSmF2YVNjcmlwdCBleHRlbnNpb25zLiIsInRhZ3MiOlsiYXJhbmdvZGIiLCJOb1NRTCIsImRhdGFiYXNlIl0sInNlbGVjdGVkIjp0cnVlLCJzY20iOiJodHRwczovL2dpdGh1Yi5jb20vYXJhbmdvZGIvYXJhbmdvZGIzLWRjb3MuZ2l0IiwiZnJhbWV3b3JrIjp0cnVlLCJwcmVJbnN0YWxsTm90ZXMiOiJUaGUgZGVmYXVsdCBjb25maWd1cmF0aW9uIHJlcXVpcmVzIGF0IGxlYXN0IDMgbm9kZXMgaGF2aW5nIDQuNzUgQ1BVLCAyMkdCIG9mIG1lbW9yeSBhbmQgMjBHQiBvZiBwZXJzaXN0ZW50IGRpc2sgc3RvcmFnZSBpbiB0b3RhbC4iLCJwb3N0SW5zdGFsbE5vdGVzIjoiVGhlIEFyYW5nb0RCIERDT1MgU2VydmljZSBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgaW5zdGFsbGVkIVxuXG5cdERvY3VtZW50YXRpb246IGh0dHBzOi8vZ2l0aHViLmNvbS9hcmFuZ29kYi9hcmFuZ29kYjMtZGNvc1xuXHRJc3N1ZXM6IGh0dHBzOi8vZ2l0aHViLmNvbS9hcmFuZ29kYi9hcmFuZ29kYjMtZGNvcy9pc3N1ZXMiLCJwb3N0VW5pbnN0YWxsTm90ZXMiOiJUaGUgQXJhbmdvREIgRENPUyBTZXJ2aWNlIGhhcyBiZWVuIHVuaW5zdGFsbGVkIGFuZCB3aWxsIG5vIGxvbmdlciBydW4uXG5QbGVhc2UgZm9sbG93IHRoZSBpbnN0cnVjdGlvbnMgYXQgaHR0cHM6Ly9naXRodWIuY29tL2FyYW5nb2RiL2FyYW5nb2RiMy1kY29zIHRvIGNsZWFuIHVwIGFueSBwZXJzaXN0ZWQgc3RhdGUuIiwibGljZW5zZXMiOlt7Im5hbWUiOiJBcGFjaGUgTGljZW5zZSBWZXJzaW9uIDIuMCIsInVybCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9hcmFuZ29kYi9hcmFuZ29kYi1kY29zL21hc3Rlci9MSUNFTlNFIn1dLCJpbWFnZXMiOnsiaWNvbi1zbWFsbCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9hcmFuZ29kYi9hcmFuZ29kYjMtZGNvcy9tYXN0ZXIvaWNvbnMvYXJhbmdvZGJfc21hbGwucG5nIiwiaWNvbi1tZWRpdW0iOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vYXJhbmdvZGIvYXJhbmdvZGIzLWRjb3MvbWFzdGVyL2ljb25zL2FyYW5nb2RiX21lZGl1bS5wbmciLCJpY29uLWxhcmdlIjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2FyYW5nb2RiL2FyYW5nb2RiMy1kY29zL21hc3Rlci9pY29ucy9hcmFuZ29kYl9sYXJnZS5wbmcifX0=",
          "DCOS_PACKAGE_REGISTRY_VERSION": "3.0",
          "DCOS_SERVICE_NAME": "arangodb3",
          "DCOS_PACKAGE_FRAMEWORK_NAME": "arangodb3",
          "DCOS_SERVICE_PORT_INDEX": "0",
          "DCOS_PACKAGE_VERSION": "1.0.4",
          "DCOS_PACKAGE_NAME": "arangodb3",
          "DCOS_PACKAGE_IS_FRAMEWORK": "true"
        },
        "acceptedResourceRoles": null,
        "residency": null,
        "secrets": {
          "secret0": {
            "source": "secret-1"
          },
          "secret1": {
            "source": "secret-2"
          },
          "secret2": {
            "source": "secret-3"
          }
        },
        "taskKillGracePeriodSeconds": null,
        "portDefinitions": [
          {
            "protocol": "tcp",
            "port": 10001,
            "name": "proxy"
          },
          {
            "protocol": "tcp,udp",
            "port": 10002,
            "name": "framework"
          },
          {
            "protocol": "tcp",
            "port": 10003,
            "name": "mesos"
          }
        ],
        "requirePorts": false
      };

      return (
        <ServiceConfigDisplay appDefinition={appDefinition} />
      );
    }

    return (
      <NewCreateServiceModalForm
        isJSONModeActive={this.state.isJSONModeActive} />
    );
  }

  getPrimaryActions() {
    if (this.state.servicePickerActive) {
      return null;
    }

    return [
      {
        node: (
          <ToggleButton
            className="flush"
            checkboxClassName="toggle-button"
            checked={this.state.isJSONModeActive}
            onChange={this.handleJSONToggle}
            key="json-editor">
            JSON Editor
          </ToggleButton>
        )
      },
      {
        className: 'button-primary flush-vertical',
        clickHandler: () => this.setState({reviewConfigActive: true}),
        label: 'Review & Run'
      }
    ];
  }

  getSecondaryActions() {
    if (this.state.servicePickerActive) {
      return [
        {
          className: 'button-stroke',
          clickHandler: () => this.props.onClose(),
          label: 'Cancel'
        }
      ];
    }

    return [
      {
        className: 'button-stroke',
        clickHandler: () => {
          this.setState({servicePickerActive: true, serviceFormActive: false});
        },
        label: 'Back'
      }
    ];
  }

  render() {
    let {props} = this;

    return (
      <FullScreenModal
        header={this.getHeader()}
        title="Run a Service"
        {...Util.omit(props, Object.keys(NewServiceFormModal.propTypes))}>
        {this.getModalContent()}
      </FullScreenModal>
    );
  }
}

NewServiceFormModal.propTypes = {
  children: React.PropTypes.node
};

module.exports = NewServiceFormModal;
