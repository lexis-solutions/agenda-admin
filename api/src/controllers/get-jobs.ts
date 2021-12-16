import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import agenda from 'src/agenda';
import { StatusType } from 'src/types';

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

  const sortBy = req.query.sortBy || 'lastRunAt';
  const sortType = req.query.sortType === 'asc' ? 1 : -1;

  const query: any = {};
  if (req.query.name) {
    query.name = req.query.name;
  }

  if (req.query.property && req.query.value) {
    if (req.query.property.substring(req.query.property.length - 4) === '_id') {
      query[req.query.property] = new ObjectId(req.query.value);
    } else {
      query[req.query.property] = /^\d+$/.test(req.query.value)
        ? +req.query.value
        : req.query.value;
    }
  } else if (req.query.property) {
    query[req.query.property] = { $exists: true };
  }

  const statusFilter: any = {};
  if (req.query.status) {
    statusFilter[`status.${req.query.status}`] = true;
  }

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
