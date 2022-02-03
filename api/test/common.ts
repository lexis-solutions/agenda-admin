import { getAgendaInstance } from 'src/agenda-instance';
import { ObjectId } from 'mongodb';

export const setup = async () => {
  const time = new Date();

  await getAgendaInstance()._collection.insertMany([
    {
      _id: new ObjectId('61bb7cd3a056e9d1c01faf5a'),
      name: 'completed job',
      lastRunAt: time,
      lastFinishedAt: time,
      data: {
        id: 1,
        type: 'completed',
      },
    },
    {
      _id: new ObjectId('61bb7cdd6b89688ff46dcce4'),
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
      _id: new ObjectId('61bb7ce958ff4fe777a71ad7'),
      name: 'scheduled job',
      nextRunAt: new Date(time.getTime() + 100000),
      data: {
        id: 3,
        type: 'scheduled',
      },
    },
    {
      _id: new ObjectId('61bb7cf5d72f1c00c545925b'),
      name: 'queued job',
      nextRunAt: new Date(time.getTime() - 1000),
      data: {
        id: 4,
        type: 'queued',
      },
    },
    {
      _id: new ObjectId('61bb7cff9c6a6704a75f97e1'),
      name: 'running job',
      lastRunAt: new Date(time.getTime()),
      data: {
        id: 5,
        type: 'running',
      },
    },
    {
      _id: new ObjectId('61bb7d08389838fe3bd7a5b5'),
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
  await getAgendaInstance()._collection.deleteMany({});
};
