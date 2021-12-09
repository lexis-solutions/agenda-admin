import 'src/config';
import agenda from 'src/agenda';

export const setup = async () => {
  await agenda.start();
  const time = new Date();

  await agenda._collection.insertMany([
    {
      name: 'completed job',
      lastRunAt: time,
      lastFinishedAt: time,
    },
    {
      name: 'failed job',
      lastFinishedAt: time,
      failedAt: time,
    },
    {
      name: 'scheduled job',
      nextRunAt: new Date(time.getTime() + 100000),
    },
    {
      name: 'queued job',
      nextRunAt: new Date(time.getTime() - 1000),
    },
    {
      name: 'running job',
      lastRunAt: new Date(time.getTime()),
    },
    {
      name: 'repeating job',
      repeatInterval: '1 minute',
    },
    {
      name: 'a job with data',
      data: {
        id: 1,
      },
    },
  ]);
};

export const teardown = async () => {
  await agenda._collection.drop();
  await agenda.stop();
};
