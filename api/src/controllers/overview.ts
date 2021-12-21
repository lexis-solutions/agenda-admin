import { NextFunction, Request, Response } from 'express';
import agenda from 'src/agenda';
import { buildGetJobsQuery } from 'src/utils/build-get-jobs-query';

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
  const [query, , projectStatuses] = buildGetJobsQuery({
    ...req.query,
    status: null,
    sortBy: 'lastRunAt',
    sortType: 'desc',
  });

  const data = await agenda._collection
    .aggregate([
      query,
      projectStatuses,
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
