import { NextFunction, Request, Response } from 'express';
import agenda from 'src/agenda';
import { StatusType } from 'src/types';
import { buildJobQuery } from 'src/utils/build-job-query';

interface ReqQuery {
  sortBy: 'lastRunAt' | 'nextRunAt';
  sortType: 'desc' | 'asc';
  page: number;
  itemsPerPage: number;
  status: StatusType | null;
  name: string | null;
  property: string | null;
  value: any | null;
}

export const getJobs = async (
  req: Request<any, any, any, ReqQuery>,
  res: Response,
  next: NextFunction
) => {
  const page = req.query.page || 1;
  const itemsPerPage = +req.query.itemsPerPage || 20;
  const { query, statusFilter, sortBy, sortType } = buildJobQuery(req.query);

  const data = await agenda._collection
    .aggregate([
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
      {
        $facet: {
          pages: [
            { $count: 'itemsCount' },
            {
              $project: {
                pagesCount: {
                  $ceil: { $divide: ['$itemsCount', itemsPerPage] },
                },
              },
            },
          ],
          jobs: [
            { $skip: itemsPerPage * (page - 1) },
            { $limit: itemsPerPage },
          ],
        },
      },
    ])
    .toArray();

  res.locals = data;

  next();
};
