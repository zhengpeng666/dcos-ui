/**
 * The possible values of ContainerState enum for Pods, according to:
 * https://github.com/mesosphere/marathon/blob/feature/pods/docs/docs/rest-api/public/api/v2/types/podStatus.raml#L36
 *
 * TODO: Note that the SPEC currently states that this is not yet well-defiend,
 *       the current values are assumed to be correct (DCOS-9852).
 */
module.exports = {
  DROPPED: 'TASK_DROPPED',
  ERROR: 'TASK_ERROR',
  FAILED: 'TASK_FAILED',
  FINISHED: 'TASK_FINISHED',
  GONE: 'TASK_GONE',
  GONE_BY_OPERATOR: 'TASK_GONE_BY_OPERATOR',
  KILLED: 'TASK_KILLED',
  KILLING: 'TASK_KILLING',
  LOST: 'TASK_LOST',
  RUNNING: 'TASK_RUNNING',
  STAGING: 'TASK_STAGING',
  UNREACHABLE: 'TASK_UNREACHABLE',
  UNKNOWN: 'TASK_UNKNOWN',
};
