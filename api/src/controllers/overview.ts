import { NextFunction, Request, Response } from 'express';
import agenda from 'src/agenda';

interface ReqQuery {
  name: string | null;
  property: string | null;
  value: any | null;
}

export const overview = async (
  req: Request<any, any, any, ReqQuery>,
  res: Response,
  next: NextFunction
) => {
  const query: any = {};
  if (req.query.name) {
    query.name = req.query.name;
  }

  if (req.query.property) {
    const value = /^\d+$/.test(req.query.value)
      ? +req.query.value
      : req.query.value;
    query[req.query.property] = value;
  }

  const data = await agenda._collection
    .aggregate([
      { $match: query },
      {
        $project: {
          running: {
            $sum: {
              $cond: [
                {
                  $and: [
                    '$lastRunAt',
                    { $gt: ['$lastRunAt', '$lastFinishedAt'] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          scheduled: {
            $sum: {
              $cond: [
                {
                  $and: ['$nextRunAt', { $gte: ['$nextRunAt', new Date()] }],
                },
                1,
                0,
              ],
            },
          },
          queued: {
            $sum: {
              $cond: [
                {
                  $and: [
                    '$nextRunAt',
                    { $gte: [new Date(), '$nextRunAt'] },
                    { $gte: ['$nextRunAt', '$lastFinishedAt'] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          completed: {
            $sum: {
              $cond: [
                {
                  $and: [
                    '$lastFinishedAt',
                    { $gt: ['$lastFinishedAt', '$failedAt'] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          failed: {
            $sum: {
              $cond: [
                {
                  $and: [
                    '$lastFinishedAt',
                    '$failedAt',
                    { $eq: ['$lastFinishedAt', '$failedAt'] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          repeating: {
            $sum: {
              $cond: [
                {
                  $and: ['$repeatInterval', { $ne: ['$repeatInterval', null] }],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $group: {
          _id: 1,
          running: { $sum: '$running' },
          scheduled: { $sum: '$scheduled' },
          completed: { $sum: '$completed' },
          failed: { $sum: '$failed' },
          queued: { $sum: '$queued' },
          repeating: { $sum: '$repeating' },
        },
      },
    ])
    .toArray();

  res.locals.data = data;
  next();
};
