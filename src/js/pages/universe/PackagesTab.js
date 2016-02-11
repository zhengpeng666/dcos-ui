import mixin from 'reactjs-mixin';
import {Modal} from 'reactjs-components';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {StoreMixin} from 'mesosphere-shared-reactjs';

import AdvancedConfigModal from '../../components/AdvancedConfigModal';
import CosmosPackagesStore from '../../stores/CosmosPackagesStore';
import MultipleForm from '../../components/MultipleForm';
import Panel from '../../components/Panel';
import UniversePackagesList from '../../structs/UniversePackagesList';

// TODO (mlunoe): Remove the following mock data!
let packages = new UniversePackagesList({items: [
  {
      'currentVersion': '1.5.0',
      'description': 'A clust-wide init system and control system for services in cgroups or Docker containers.',
      'framework': true,
      'packageName': 'Marathon',
      'resources': {
        'images': {
          'icon-small': 'https://downloads.mesosphere.com/marathon/assets/icon-service-marathon-small.png',
          'icon-medium': 'https://downloads.mesosphere.com/marathon/assets/icon-service-marathon-medium.png',
          'icon-large': 'https://downloads.mesosphere.com/marathon/assets/icon-service-marathon-large.png'
        }
      },
      'tags': [
          'marathon',
          'dcos',
          'init',
          'framework'
      ],
      'versions': {
          '1.5.0': '0'
      }
  },
  {
      'currentVersion': '0.2.1',
      'description': 'A distributed free and open-source database with a flexible data model for documents, graphs, and key-values. Build high performance applications using a convenient SQL-like query language or JavaScript extensions.',
      'framework': true,
      'packageName': 'arangodb',
      'resources': {
        'images': {
          'icon-small': 'https://downloads.mesosphere.com/marathon/assets/icon-service-marathon-small.png',
          'icon-medium': 'https://downloads.mesosphere.com/marathon/assets/icon-service-marathon-medium.png',
          'icon-large': 'https://downloads.mesosphere.com/marathon/assets/icon-service-marathon-large.png'
        }
      },
      'tags': [
          'arangodb',
          'NoSQL',
          'database',
          'framework'
      ],
      'versions': {
          '0.2.1': '0'
      }
  },
  {
      'currentVersion': '0.2.0-1',
      'description': 'Apache Cassandra running on Apache Mesos',
      'framework': true,
      'packageName': 'cassandra',
      'tags': [
          'data',
          'database',
          'nosql'
      ],
      'versions': {
          '0.2.0-1': '0'
      }
  },
  {
      'currentVersion': '2.4.0',
      'description': 'A fault tolerant job scheduler for Mesos which handles dependencies and ISO8601based schedules.',
      'framework': true,
      'packageName': 'chronos',
      'tags': [
          'cron',
          'analytics',
          'batch'
      ],
      'versions': {
          '2.4.0': '0'
      }
  },
  {
      'currentVersion': '0.1.7',
      'description': 'Hadoop Distributed File System (HDFS), Highly Available',
      'framework': true,
      'packageName': 'hdfs',
      'tags': [
          'filesystem',
          'hadoop',
          'analytics'
      ],
      'versions': {
          '0.1.7': '0'
      }
  }
]});
>>>>>>> Create advanced config modal

const METHODS_TO_BIND = [
  'handleAdvancedModalClose',
  'handleAdvancedModalOpen',
  'handleInstallModalClose'
];

class PackagesTab extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      advancedModalOpen: false,
      installModalPackage: false
    };

    this.store_listeners = [
      {name: 'cosmosPackages', events: ['availableError', 'availableSuccess']}
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    super.componentDidMount(...arguments);
    // Get all packages
    CosmosPackagesStore.fetchAvailablePackages();
  }

  handleDetailOpen(cosmosPackage, event) {
    event.stopPropagation();
    // Handle open detail view
  }

  handleAdvancedModalClose() {
    this.setState({advancedModalOpen: false});
  }

  handleAdvancedModalOpen() {
    this.setState({advancedModalOpen: true});
  }

  handleInstallModalClose() {
    this.setState({installModalPackage: null});
  }

  handleInstallModalOpen(cosmosPackage, event) {
    event.stopPropagation();
    this.setState({installModalPackage: cosmosPackage});
  }

  getFooter(cosmosPackage) {
    return (
      <button
        className="button button-success"
        onClick={this.handleInstallModalOpen.bind(this, cosmosPackage)}>
        Install Package
      </button>
    );
  }

  getHeading(cosmosPackage) {
    return (
      <div className="icon icon-jumbo icon-image-container icon-app-container">
        <img src={cosmosPackage.getIcons()['icon-large']} />
      </div>
    );
  }

  getPackages() {
    return CosmosPackagesStore.get('availablePackages').getItems()
      .map((cosmosPackage, index) => {
        return (
          <div
            className="grid-item column-small-6 column-medium-4 column-large-3"
            key={index}>
            <Panel
              className="panel clickable"
              contentClass="panel-content horizontal-center short"
              footer={this.getFooter(cosmosPackage)}
              footerClass="panel-footer horizontal-center panel-footer-no-top-border short"
              heading={this.getHeading(cosmosPackage)}
              headingClass="panel-heading horizontal-center"
              onClick={this.handleDetailOpen.bind(this, cosmosPackage)}>
              <div className="h2 inverse flush-top short-bottom">
                {cosmosPackage.get('packageName')}
              </div>
              <p className="inverse flush-bottom">
                {cosmosPackage.get('currentVersion')}
              </p>
            </Panel>
          </div>
        );
      }
    );
  }

  render() {
    let {advancedModalOpen} = this.state;

    return (
      <div className="grid row">
        <button
          className="button button-success"
          onClick={this.handleButtonClick}>
          Open Advanced Configuration
        </button><br/>
        <AdvancedConfigModal
          open={this.state.advancedModalOpen}
          onClose={this.handleAdvancedModalClose}/>
        {this.getPackages()}
      </div>
    );
  }
}

module.exports = PackagesTab;
