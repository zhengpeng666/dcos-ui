import classNames from 'classnames';
import React from 'react';
import {Table} from 'reactjs-components';

import ConfigurationMap from '../../../../../../src/js/components/ConfigurationMap';
import ConfigurationMapHeading from '../../../../../../src/js/components/ConfigurationMapHeading';
import ConfigurationMapLabel from '../../../../../../src/js/components/ConfigurationMapLabel';
import ConfigurationMapRow from '../../../../../../src/js/components/ConfigurationMapRow';
import ConfigurationMapSection from '../../../../../../src/js/components/ConfigurationMapSection';
import ConfigurationMapValue from '../../../../../../src/js/components/ConfigurationMapValue';
import Networking from '../../../../../../src/js/constants/Networking';
import HostUtil from '../../utils/HostUtil';
import Units from '../../../../../../src/js/utils/Units';
import Util from '../../../../../../src/js/utils/Util';

const getColumnClassNameFn = (classes) => {
  return (prop, sortBy) => {
    return classNames(classes, {
      'active': prop === sortBy.prop
    });
  };
}

const getColumnHeadingFn = (defaultHeading) => {
  return (prop, order, sortBy) => {
    let caretClassNames = classNames('caret', {
      [`caret--${order}`]: order != null,
      'caret--visible': sortBy.prop === prop
    });

    return (
      <span>
        {defaultHeading || prop}
        <span className={caretClassNames} />
      </span>
    );
  }
};

const getDisplayValue = (value) => {
  // Return the emdash character.
  if (value == null || value === '') {
    return String.fromCharCode(8212);
  }

  // Display nested objects nicely if the render didn't already cover it.
  if (Util.isObject(value)) {
    return (
      <pre className="flush transparent wrap">
        {JSON.stringify(value)}
      </pre>
    );
  }

  return value;
}

const getKeyValueTableFn = (keyString = 'key', valueString = 'value', id) => {
  const columns = [
    {
      heading: getColumnHeadingFn(),
      prop: keyString,
      render: (prop, row) => {
        return <code>{row[prop]}</code>;
      },
      className: getColumnClassNameFn('configuration-map-table-label'),
      sortable: true
    },
    {
      heading: getColumnHeadingFn(),
      prop: valueString,
      className: getColumnClassNameFn('configuration-map-table-value'),
      sortable: true
    }
  ];

  return (dataMap) => {
    const data = Object.keys(dataMap).reduce((memo, dataMapKey) => {
      let value = getDisplayValue(dataMap[dataMapKey]);

      memo.push({[keyString]: dataMapKey, [valueString]: value});

      return memo;
    }, []);

    return (
      <Table key={id}
        className="table table-simple table-break-word flush-bottom"
        columns={columns}
        data={data} />
    );
  }
};

const getSecretName = (requestedSecretName) => {
  let specifiedSecret = appDefinition.secrets[requestedSecretName] || {};

  return specifiedSecret.source;
};

const renderMillisecondsFromSeconds = (prop, row) => {
  let value = row[prop];

  if (value != null) {
    value = `${value * 1000} ms`;
  }

  return getDisplayValue(value);
};

const retrieveHashValue = (segments, map) => {
  let currentValue = map[segments.shift()];

  if (segments.length > 0 && currentValue != null) {
    return retrieveHashValue(segments, currentValue);
  }

  return currentValue;
};

const shouldExcludeItem = (row, appDefinition) => {
  switch (row.key) {
    case 'gpus':
      return appDefinition.gpus === 0;
    case 'volumes':
      // Don't render volumes if it doesn't exist in the either location.
      return (
        appDefinition.volumes == null
        || appDefinition.volumes.length === 0
      ) && (
        appDefinition.container == null
        || appDefinition.container.volumes == null
      );
    default:
      return false;
  }
};

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
    "NOT-A-SECRET-AT!!!!!": "sdfasfadfasfadsfdas",
    "STILL-NOT-A-SECRET": "hahahahahahaha",
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

const sectionDisplayConfig = [
  {
    values: [
      {
        heading: 'General',
        headingLevel: 1,
      },
      {
        key: 'id',
        label: 'Service ID',
        transformValue: (value) => {
          return value.split('/').pop();
        }
      },
      {
        key: 'instances',
        label: 'Instances'
      },
      {
        key: 'location',
        label: 'Location',
        transformValue: () => {
          let idSegments = retrieveHashValue(['id'], appDefinition).split('/');

          idSegments.pop();

          return `${idSegments.join('/')}/`;
        }
      },
      {
        key: 'container-runtime', // Figure out how to find this
        label: 'Container Runtime'
      },
      {
        key: 'cpus',
        label: 'CPU'
      },
      {
        key: 'mem',
        label: 'Memory',
        transformValue: (value) => {
          if (value == null) {
            return getDisplayValue(value);
          }

          return Units.formatResource('mem', value);
        },
      },
      {
        key: 'disk',
        label: 'Disk',
        transformValue: (value) => {
          if (value == null) {
            return getDisplayValue(value);
          }

          return Units.formatResource('disk', value);
        },
      },
      {
        key: 'gpus',
        label: 'GPU'
      },
      {
        key: 'container.docker.image',
        label: 'Container Image'
      },
      {
        key: 'container.docker.image', // Figure out how to find this
        label: 'Container ID'
      },
      {
        key: 'container.docker.privileged',
        label: 'Extended Runtime Priv.',
        transformValue: (value) => {
          // Cast boolean as a string.
          return String(value);
        }
      },
      {
        key: 'container.docker.forcePullImage',
        label: 'Force Pull on Launch',
        transformValue: (value) => {
          // Cast boolean as a string.
          return String(value);
        }
      },
      {
        key: 'cmd',
        label: 'Command',
        type: 'pre'
      },
      {
        key: 'artifacts', // Figure out how to find this
        label: 'Artifacts'
      }
    ]
  },
  {
    values: [
      {
        heading: 'Network',
        headingLevel: 1,
      },
      {
        label: 'Network Type',
        transformValue: () => {
          // TODO: Figure out how to determine this value.
          return '🍾 network type';
        }
      },
      {
        label: 'Load Balancer Type',
        transformValue: () => {
          // TODO: Figure out how to determine this value.
          return '🍾 load balancer type';
        }
      },
      {
        label: 'Ext. Load Balancer',
        transformValue: () => {
          // TODO: Figure out how to determine this value.
          return '🍾 ext. load balancer';
        }
      },
      {
        heading: 'Service Endpoints',
        headingLevel: 2,
      },
      {
        key: 'portDefinitions',
        render: (portDefinitions) => {
          const keys = {
            name: 'name',
            port: 'port',
            protocol: 'protocol'
          };

          if ((portDefinitions == null || portDefinitions.length === 0)) {
            let containerPortMappings = retrieveHashValue(
              ['container', 'docker', 'portMappings']
            );

            if (containerPortMappings != null
              && containerPortMappings.length !== 0) {
              portDefinitions = containerPortMappings;
              keys.port = 'containerPort';
            }
          }

          const columns = [
            {
              heading: getColumnHeadingFn('Name'),
              prop: keys.name,
              render: (prop, row) => {
                return getDisplayValue(row[prop]);
              },
              className: getColumnClassNameFn(),
              sortable: true
            },
            {
              heading: getColumnHeadingFn('Protocol'),
              prop: keys.protocol,
              className: getColumnClassNameFn(),
              render: (prop, row) => {
                return getDisplayValue(row[prop]).split(',').join(', ');
              },
              sortable: true
            },
            {
              heading: getColumnHeadingFn('Port'),
              prop: keys.port,
              className: getColumnClassNameFn(),
              render: (prop, row) => {
                // TODO: Figure out how to determine static or dynamic port.
                return getDisplayValue(row[prop]);
              },
              sortable: true
            },
            {
              heading: getColumnHeadingFn('Load Balanced Address'),
              prop: '',
              className: getColumnClassNameFn(),
              render: (prop, row) => {
                // TODO: Only render this when necessary, figure out when necessary.
                let hostname = HostUtil.stringToHostname(appDefinition.id);
                let port = row[keys.port];

                return `${hostname}${Networking.L4LB_ADDRESS}:${port}`;
              },
              sortable: true
            }
          ];

          return (
            <Table key="service-endpoints"
              className="table table-simple table-break-word flush-bottom"
              columns={columns}
              data={portDefinitions} />
          );
        }
      }
    ]
  },
  {
    values: [
      {
        heading: 'Storage',
        headingLevel: 1,
      },
      {
        key: 'container.volumes',
        render: (volumes) => {
          if (volumes == null) {
            return null;
          }

          const columns = [
            {
              heading: getColumnHeadingFn('Volume'),
              prop: 'volume',
              render: (prop, row) => {
                let name = '';

                if (row.name != null) {
                  name = ` (${row.name})`;
                }

                return `${row.type.join(' ')}${name}`;
              },
              className: getColumnClassNameFn(),
              sortable: true
            },
            {
              heading: getColumnHeadingFn('Size'),
              prop: 'size',
              render: (prop, row) => {
                let value = row[prop];

                if (value == null) {
                  return getDisplayValue(value);
                }

                return Units.formatResource('disk', value);
              },
              className: getColumnClassNameFn(),
              sortable: true
            },
            {
              heading: getColumnHeadingFn('Mode'),
              prop: 'mode',
              className: getColumnClassNameFn(),
              sortable: true
            },
            {
              heading: getColumnHeadingFn('Container Mount Path'),
              prop: 'containerPath',
              className: getColumnClassNameFn(),
              sortable: true
            }
          ];

          let shouldDisplayHostPath = false;

          const volumesData = volumes.map((appVolume) => {
            // We don't want to mutate the appVolume value.
            let volume = {
              name: null,
              size: null,
              type: []
            };

            volume.containerPath = appVolume.containerPath;
            volume.mode = appVolume.mode;

            if (appVolume.persistent != null) {
              volume.size = appVolume.persistent.size;
              volume.type.push('Persistent', 'Local');
            } else {
              volume.type.push('External');
            }

            if (appVolume.external != null) {
              volume.name = appVolume.external.name;
            }

            if (appVolume.hostPath != null) {
              // Set this flag to true so that we render the hostPath column.
              shouldDisplayHostPath = true;
            }

            volume.hostPath = getDisplayValue(appVolume.hostPath);

            return volume;
          });

          if (shouldDisplayHostPath) {
            columns.push({
              heading: getColumnHeadingFn('Host Path'),
              prop: 'hostPath',
              className: getColumnClassNameFn(),
              sortable: true
            });
          }

          return (
            <Table key="service-volumes"
              className="table table-simple table-break-word flush-bottom"
              columns={columns}
              data={volumesData} />
          );
        }
      }
    ]
  },
  {
    values: [
      {
        heading: 'Environment Variables',
        headingLevel: 1,
      },
      {
        key: 'env',
        render: (envData) => {
          const columns = [
            {
              heading: getColumnHeadingFn('Key'),
              prop: 'key',
              render: (prop, row) => {
                return <code>{row[prop]}</code>;
              },
              className: getColumnClassNameFn('configuration-map-table-label'),
              sortable: true
            },
            {
              heading: getColumnHeadingFn('Value'),
              prop: 'value',
              render: (prop, row) => {
                let value = row[prop];

                if (value.secret != null) {
                  return <code>{getSecretName(value.secret)}</code>;
                }

                return getDisplayValue(value);
              },
              className: getColumnClassNameFn('configuration-map-table-value'),
              sortable: true
            }
          ];

          const data = Object.keys(envData).map((envKey) => {
            return {key: envKey, value: envData[envKey]};
          });

          return (
            <Table key="secrets-table"
              className="table table-simple table-break-word flush-bottom"
              columns={columns}
              data={data} />
          );
        }
      }
    ]
  },
  {
    values: [
      {
        heading: 'Labels',
        headingLevel: 1,
      },
      {
        key: 'labels',
        render: getKeyValueTableFn('label', 'value', 'app-labels')
      }
    ]
  },
  {
    values: [
      {
        heading: 'Secrets',
        headingLevel: 1,
      },
      {
        key: 'secrets',
        render: (secretsData) => {
          const columns = [
            {
              heading: getColumnHeadingFn(),
              prop: 'secret',
              render: (prop, row) => {
                return <code>{row[prop]}</code>;
              },
              className: getColumnClassNameFn('configuration-map-table-label'),
              sortable: true
            },
            {
              heading: getColumnHeadingFn(),
              prop: 'secretName',
              render: (prop, row) => {
                return <code>{getDisplayValue(row[prop])}</code>;
              },
              className: getColumnClassNameFn('configuration-map-table-value'),
              sortable: true
            }
          ];

          const data = Object.keys(secretsData).map((secretKey) => {
            return {
              secret: secretKey,
              secretName: secretsData[secretKey].source
            }
          });

          return (
            <Table key="secrets-table"
              className="table table-simple table-break-word flush-bottom"
              columns={columns}
              data={data} />
          );
        }
      }
    ]
  },
  {
    values: [
      {
        heading: 'Health Checks',
        headingLevel: 1
      },
      {
        heading: 'Service Endpoint Health Checks',
        headingLevel: 2
      },
      {
        key: 'healthChecks',
        render: (healthChecks) => {
          let serviceEndpointHealthChecks = healthChecks.filter((healthCheck) => {
            return healthCheck.protocol === 'HTTP'
              || healthCheck.protocol === 'TCP';
          });

          const columns = [
            {
              heading: getColumnHeadingFn('Protocol'),
              prop: 'protocol',
              render: (prop, row) => {
                return getDisplayValue(row[prop]);
              },
              className: getColumnClassNameFn(),
              sortable: true
            },
            {
              heading: getColumnHeadingFn('Path'),
              prop: 'path',
              className: getColumnClassNameFn(),
              render: (prop, row) => {
                return getDisplayValue(row[prop]);
              },
              sortable: true
            },
            {
              heading: getColumnHeadingFn('Grace Period'),
              prop: 'gracePeriodSeconds',
              className: getColumnClassNameFn(),
              render: renderMillisecondsFromSeconds,
              sortable: true
            },
            {
              heading: getColumnHeadingFn('Interval'),
              prop: 'intervalSeconds',
              className: getColumnClassNameFn(),
              render: renderMillisecondsFromSeconds,
              sortable: true
            },
            {
              heading: getColumnHeadingFn('Timeout'),
              prop: 'timeoutSeconds',
              className: getColumnClassNameFn(),
              render: renderMillisecondsFromSeconds,
              sortable: true
            },
            {
              heading: getColumnHeadingFn('Max Failures'),
              prop: 'maxConsecutiveFailures',
              className: getColumnClassNameFn(),
              sortable: true
            }
          ];

          return (
            <Table key="service-endpoint-health-checks"
              className="table table-simple table-break-word flush-bottom"
              columns={columns}
              data={serviceEndpointHealthChecks} />
          );
        }
      },
      {
        heading: 'Command Health Checks',
        headingLevel: 2
      },
      {
        key: 'healthChecks',
        render: (healthChecks) => {
          let commandHealthChecks = healthChecks.filter((healthCheck) => {
            return healthCheck.protocol === 'COMMAND';
          });

          const columns = [
            {
              heading: getColumnHeadingFn('Command'),
              prop: 'command',
              render: (prop, row) => {
                let command = row[prop] || {};

                return (
                  <pre className="flush transparent wrap">
                    {getDisplayValue(command.value)}
                  </pre>
                );
              },
              className: getColumnClassNameFn(),
              sortable: true
            },
            {
              heading: getColumnHeadingFn('Grace Period'),
              prop: 'gracePeriodSeconds',
              className: getColumnClassNameFn(),
              render: renderMillisecondsFromSeconds,
              sortable: true
            },
            {
              heading: getColumnHeadingFn('Interval'),
              prop: 'intervalSeconds',
              className: getColumnClassNameFn(),
              render: renderMillisecondsFromSeconds,
              sortable: true
            },
            {
              heading: getColumnHeadingFn('Timeout'),
              prop: 'timeoutSeconds',
              className: getColumnClassNameFn(),
              render: renderMillisecondsFromSeconds,
              sortable: true
            },
            {
              heading: getColumnHeadingFn('Max Failures'),
              prop: 'maxConsecutiveFailures',
              className: getColumnClassNameFn(),
              sortable: true
            }
          ];

          return (
            <Table key="command-health-checks"
              className="table table-simple table-break-word flush-bottom"
              columns={columns}
              data={commandHealthChecks} />
          );
        }
      }
    ]
  }
];

const NewCreateServiceReview = (props) => {
  let configurationMapSections = sectionDisplayConfig.map((section, sectionIndex) => {
    let configurationMapRows = section.values.reduce((memo, row, rowIndex) => {
      if (shouldExcludeItem(row, appDefinition)) {
        return memo;
      }

      let reactKey = `${sectionIndex}.${rowIndex}`;
      let value = null;

      if (row.key != null) {
        value = retrieveHashValue(row.key.split('.'), appDefinition);
      }

      if (row.transformValue != null) {
        value = row.transformValue(value);
      }

      if (row.render != null) {
        memo.push(row.render(value));
      } else if (row.heading != null) {
        memo.push(
          <ConfigurationMapHeading key={reactKey} level={row.headingLevel}>
            {row.heading}
          </ConfigurationMapHeading>
        );
      } else {
        let displayValue = null;

        if (row.type === 'pre') {
          displayValue = <pre className="flush transparent wrap">{value}</pre>;
        } else {
          displayValue = getDisplayValue(value);
        }

        memo.push(
          <ConfigurationMapRow key={reactKey}>
            <ConfigurationMapLabel>
              {row.label}
            </ConfigurationMapLabel>
            <ConfigurationMapValue>
              {displayValue}
            </ConfigurationMapValue>
          </ConfigurationMapRow>
        );
      }

      return memo;
    }, []);

    if (configurationMapRows.length === 0) {
      return null;
    }

    return (
      <ConfigurationMapSection key={sectionIndex}>
        {configurationMapRows}
      </ConfigurationMapSection>
    );
  });

  return (
    <div className="flex-item-grow-1">
      <div className="container">
        <ConfigurationMap>
          {configurationMapSections}
        </ConfigurationMap>
      </div>
    </div>
  );
}

module.exports = NewCreateServiceReview;
