const UnitSummaries = {
  dcos-marathon.service: {
    summary: "The DCOS Marathon instance starts and monitors DCOS applications and services.",
    documentation_url: "https://docs.mesosphere.com/administration/dcosarchitecture/components/"
  },
  dcos-mesos-dns.service: {
    summary: "Mesos DNS provides service discovery within the cluster.",
    documentation_url: "https://docs.mesosphere.com/administration/dcosarchitecture/components/"
  },
  dcos-mesos-master.service: {
    summary: "The mesos-master process orchestrates agent tasks.",
    documentation_url: "https://docs.mesosphere.com/getting-started/installing/installing-enterprise-edition/troubleshooting/#scrollNav-2"
  },
  dcos-signal.service: {
    summary: "Sends a periodic ping back to Mesosphere with high-level cluster information to help improve DCOS, and provides advanced monitoring of cluster issues.",
    documentation_url: "https://docs.mesosphere.com/"
  },
  dcos-gen-resolvconf.timer: {
    summary: "Periodically updates the systemd-resolved for Mesos DNS.",
    documentation_url: "https://docs.mesosphere.com/getting-started/installing/installing-enterprise-edition/troubleshooting/#scrollNav-2"
  },
  dcos-exhibitor.service: {
    summary: "The Exhibitor supervisor for Zookeeper.",
    documentation_url: "https://docs.mesosphere.com/getting-started/overview/"
  },
  dcos-history-service.service: {
    summary: "Enables the DCOS web interface to display cluster usage statistics.",
    documentation_url: "https://docs.mesosphere.com/"
  },
  dcos-logrotate.service: {
    summary: "Logrotate allows for the automatic rotation compression, removal, and mailing of log files.",
    documentation_url: "https://github.com/logrotate/logrotate/blob/master/README.md"
  },
  dcos-link-env.service: {
    summary: "Makes vendored DCOS binaries, such as the mesos-master, mesos-slave, available at the command line when SSHing to a host.",
    documentation_url: "https://docs.mesosphere.com/"
  },
  dcos-download.service: {
    summary: "Downloads and extracts the DCOS bootstrap tarball into /opt/mesosphere on your bootstrap node.",
    documentation_url: "https://docs.mesosphere.com/"
  },
  dcos-logrotate.timer: {
    summary:"Sets the logrotate interval at 2 minutes.",
    documentation_url: "https://docs.mesosphere.com/"
  },
  dcos-signal.timer: {
    summary: "Sets the dcos-signal.service interval at once per hour.",
    documentation_url: "https://docs.mesosphere.com/"
  },
  dcos-gunicorn-bouncer.service: {
    summary: "DCOS access control service.",
    documentation_url: "https://docs.mesosphere.com/installing-enterprise-edition-1-6/security-and-authentication/"
  },
  dcos-adminrouter-reload.service: {
    summary: "Restart the Admin router Nginx server so that it picks up new DNS resolutions, for example master.mesos, leader.mesos.",
    documentation_url: "https://docs.mesosphere.com/"
  },
  dcos-nginx-reload.timer:
    summary: "Sets the dcos-adminrouter-reload.service interval at once per hour.",
    documentation_url: "https://docs.mesosphere.com/"
  },
  dcos-setup.service: {
    summary:"Specializes the DCOS bootstrap tarball for the particular cluster, as well as its cluster role."
    documentation_url: "https://docs.mesosphere.com/"
  },
  dcos-mesos-slave.service: {
    summary:"The mesos-slave process."
    documentation_url: "https://docs.mesosphere.com/"
  },
  dcos-keepalived.service: {
    summary:"Runs keepalived to make a VRRP load balancer that can be used to access the masters."
    documentation_url: "https://docs.mesosphere.com/"
  },
  dcos-nginx.service: {
    summary:"A high performance web server and a reverse proxy server."
    documentation_url: "https://docs.mesosphere.com/"
  },
  dcos-gen-resolvconf.service: {
    summary:"This is a service that helps the agent nodes locate the master nodes."
    documentation_url: "https://docs.mesosphere.com/getting-started/installing/installing-enterprise-edition/troubleshooting/#scrollNav-6"
};

module.exports = UnitSummaries;
