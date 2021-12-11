import 'src/config';
import agenda from 'src/agenda';

export const setup = async () => {
  const time = new Date();

  await agenda._collection.insertMany([
    {
      name: 'completed job',
      lastRunAt: time,
      lastFinishedAt: time,
      data: {
        id: 1,
        type: 'completed',
      },
    },
    {
      name: 'failed job',
      lastFinishedAt: time,
      failedAt: time,
      failCount: 1,
      data: {
        id: 2,
        type: 'failed',
      },
    },
    {
      name: 'scheduled job',
      nextRunAt: new Date(time.getTime() + 100000),
      data: {
        id: 3,
        type: 'scheduled',
      },
    },
    {
      name: 'queued job',
      nextRunAt: new Date(time.getTime() - 1000),
      data: {
        id: 4,
        type: 'queued',
      },
    },
    {
      name: 'running job',
      lastRunAt: new Date(time.getTime()),
      data: {
        id: 5,
        type: 'running',
      },
    },
    {
      name: 'repeating job',
      repeatInterval: '1 minute',
      data: {
        id: 6,
        type: 'repeating',
      },
    },
  ]);
};

export const teardown = async () => {
  await agenda._collection.deleteMany({});
};
