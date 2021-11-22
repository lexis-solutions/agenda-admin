export default (job: any) => {
  const { lastFinishedAt, nextRunAt, lastRunAt, repeatInterval, failedAt } =
    job.attrs;
  return {
    repeating: !!repeatInterval,
    scheduled: nextRunAt && new Date(nextRunAt) > new Date(),
    queued:
      new Date() > new Date(nextRunAt) &&
      new Date(nextRunAt) > new Date(lastFinishedAt),
    completed:
      (lastFinishedAt && !failedAt) ||
      new Date(lastFinishedAt) > new Date(failedAt),
    failed: new Date(lastFinishedAt) === new Date(failedAt),
    running: new Date(lastRunAt) > new Date(lastFinishedAt),
  };
};
