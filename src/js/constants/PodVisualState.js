const POD_VISUAL_STATE = {
  DROPPED: {
    dotClassName: 'dot inactive danger',
    textClassName: '',
    displayName: 'Dropped'
  },
  ERROR: {
    dotClassName: 'dot inactive danger',
    textClassName: 'task-status-error',
    displayName: 'Error'
  },
  FAILED: {
    dotClassName: 'dot danger',
    textClassName: 'task-status-failed',
    displayName: 'Failed'
  },
  FINISHED: {
    dotClassName: 'dot inactive',
    textClassName: '',
    displayName: 'Finished'
  },
  GONE: {
    dotClassName: 'dot inactive danger',
    textClassName: '',
    displayName: 'Gone'
  },
  HEALTHY: {
    dotClassName: 'dot healthy',
    textClassName: 'task-status-running',
    displayName: 'Running'
  },
  KILLED: {
    dotClassName: 'dot inactive',
    textClassName: '',
    displayName: 'Killed'
  },
  KILLING: {
    dotClassName: 'dot inactive',
    textClassName: '',
    displayName: 'Killing'
  },
  LOST: {
    dotClassName: 'dot inactive',
    textClassName: '',
    displayName: 'Lost'
  },
  RUNNING: {
    dotClassName: 'dot running',
    textClassName: 'task-status-running',
    displayName: 'Running'
  },
  STAGING: {
    dotClassName: 'dot',
    textClassName: 'task-status-staging',
    displayName: 'Staging'
  },
  STARTING: {
    dotClassName: 'dot',
    textClassName: 'task-status-starting',
    displayName: 'Starting'
  },
  UNHEALTHY: {
    dotClassName: 'dot unhealthy',
    textClassName: 'task-status-running',
    displayName: 'Running'
  },
  UNREACHABLE: {
    dotClassName: 'dot inactive danger',
    textClassName: '',
    displayName: 'Dropped'
  },

  NA: {
    dotClassName: 'dot inactive',
    textClassName: '',
    displayName: 'N/A'
  }
};

module.exports = POD_VISUAL_STATE;
