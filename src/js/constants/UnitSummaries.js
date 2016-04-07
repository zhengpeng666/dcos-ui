import Config from '../config/Config';

const UnitSummaries = {
  'dcos-marathon.service': {
    summary: 'The DC/OS Marathon instance starts and monitors DC/OS applications and services.',
    documentation_url: `${Config.documentationURI}/administration/dcosarchitecture/components/`
  },
  'dcos-mesos-dns.service': {
    summary: 'Mesos DNS provides service discovery within the cluster.',
    documentation_url: `${Config.documentationURI}/administration/dcosarchitecture/components/`
  },
  'dcos-mesos-master.service': {
    summary: 'The Mesos master process orchestrates agent tasks.',
    documentation_url: `${Config.documentationURI}/getting-started/installing/installing-enterprise-edition/troubleshooting/#scrollNav-2`
  },
  'dcos-signal.service': {
    summary: 'Sends a periodic ping back to Mesosphere with high-level cluster information to help improve DC/OS, and provides advanced monitoring of cluster issues.',
    documentation_url: `${Config.documentationURI}/`
  },
  'dcos-gen-resolvconf.timer': {
    summary: 'Sets the dcos-gen-resolvconf.service to be run once a minute.',
    documentation_url: `${Config.documentationURI}/getting-started/installing/installing-enterprise-edition/troubleshooting/#scrollNav-2`
  },
  'dcos-exhibitor.service': {
    summary: 'Manages DC/OS in-cluster Zookeeper, used by Mesos as well as DC/OS Marathon.',
    documentation_url: `${Config.documentationURI}/getting-started/overview/`
  },
  'dcos-history-service.service': {
    summary: 'Caches recent cluster history in-memory so that the DC/OS web interface can show recent data',
    documentation_url: `${Config.documentationURI}/`
  },
  'dcos-logrotate.service': {
    summary: 'Logrotate allows for the automatic rotation compression, removal, and mailing of log files.',
    documentation_url: 'https://github.com/logrotate/logrotate/blob/master/README.md'
  },
  'dcos-link-env.service': {
    summary: 'Makes vendored DC/OS binaries, such as the mesos-master, mesos-slave, available at the command line when SSHing to a host.',
    documentation_url: `${Config.documentationURI}/`
  },
  'dcos-download.service': {
    summary: 'Downloads and extracts the DC/OS bootstrap tarball into /opt/mesosphere on your nodes.',
    documentation_url: `${Config.documentationURI}/`
  },
  'dcos-logrotate.timer': {
    summary: 'Rotates the Mesos master and agent log files to prevent filling the disk.',
    documentation_url: `${Config.documentationURI}/`
  },
  'dcos-signal.timer': {
    summary: 'Sets the dcos-signal.service interval at once an hour.',
    documentation_url: `${Config.documentationURI}/`
  },
  'dcos-gunicorn-bouncer.service': {
    summary: 'Processes login requests from users, as well as checking if an authorization token is valid.',
    documentation_url: `${Config.documentationURI}/installing-enterprise-edition-1-6/security-and-authentication/`
  },
  'dcos-adminrouter-reload.service': {
    summary: 'Restart the Admin Router Nginx server so that it picks up new DNS resolutions, for example master.mesos, leader.mesos.',
    documentation_url: `${Config.documentationURI}/`
  },
  'dcos-nginx-reload.timer': {
    summary: 'Sets the dcos-adminrouter-reload.service interval at once an hour.',
    documentation_url: `${Config.documentationURI}/`
  },
  'dcos-setup.service': {
    summary: 'Specializes the DC/OS bootstrap tarball for the particular cluster, as well as its cluster role.',
    documentation_url: `${Config.documentationURI}/`
  },
  'dcos-mesos-slave.service': {
    summary: 'Runs a Mesos agent on the node.',
    documentation_url: `${Config.documentationURI}/`
  },
  'dcos-keepalived.service': {
    summary: 'Runs keepalived to make a VRRP load balancer that can be used to access the masters.',
    documentation_url: `${Config.documentationURI}/`
  },
  'dcos-adminrouter.service': {
    summary: 'Runs the DC/OS web interface, as well as a reverse proxy so that administrative interfaces of DC/OS Services can be accessed from outside the cluster.',
    documentation_url: `${Config.documentationURI}/`
  },
  'dcos-gen-resolvconf.service': {
    summary: 'Periodically writes /etc/resolv.conf so that only currently active Mesos masters with working Mesos DNS are in it.',
    documentation_url: `${Config.documentationURI}/getting-started/installing/installing-enterprise-edition/troubleshooting/#scrollNav-6`
  },
  'dcos-mesos-slave-public': {
    summary: 'Runs a publicly accessible Mesos agent on the node.',
    documentation_url: `${Config.documentationURI}/administration/dcosarchitecture/security/#scrollNav-3`
  }
};

module.exports = UnitSummaries;
