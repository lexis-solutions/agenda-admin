import { StatusType } from 'src/types';
import { buildJobQuery } from './build-job-query';

export const buildGetJobsQuery = (requestQuery: {
  name: string | null;
  property: string | null;
  value: string | null;
  status: StatusType | null;
  sortBy: 'lastRunAt' | 'nextRunAt';
  sortType: 'desc' | 'asc';
}) => {
  const { query, statusFilter, sortBy, sortType } = buildJobQuery(requestQuery);
  return [
    {
      $match: query,
    },
    {
      $sort: { [sortBy]: sortType },
    },
    {
      $project: {
        job: '$$ROOT',
        status: {
          running: {
            $and: ['$lastRunAt', { $gt: ['$lastRunAt', '$lastFinishedAt'] }],
          },
          scheduled: {
            $and: ['$nextRunAt', { $gte: ['$nextRunAt', new Date()] }],
          },
          queued: {
            $and: [
              '$nextRunAt',
              { $gte: [new Date(), '$nextRunAt'] },
              { $gte: ['$nextRunAt', '$lastFinishedAt'] },
            ],
          },
          completed: {
            $and: [
              '$lastFinishedAt',
              { $gt: ['$lastFinishedAt', '$failedAt'] },
            ],
          },
          failed: {
            $and: [
              '$lastFinishedAt',
              '$failedAt',
              { $eq: ['$lastFinishedAt', '$failedAt'] },
            ],
          },
          repeating: {
            $and: ['$repeatInterval', { $ne: ['$repeatInterval', null] }],
          },
        },
      },
    },
    {
      $match: statusFilter,
    },
  ];
};
