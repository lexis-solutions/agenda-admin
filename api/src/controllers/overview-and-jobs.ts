import { NextFunction, Request, Response } from 'express';
import { StatusType } from 'src/types';
import { getJobs } from './get-jobs';
import { overview } from './overview';

interface ReqQuery {
  sortBy: 'lastRunAt' | 'nextRunAt';
  sortType: 'desc' | 'asc';
  page: number;
  status: StatusType | null;
  name: string | null;
  property: string | null;
  value: any | null;
}

export const overviewAndJobs = async (
  req: Request<any, any, ReqQuery, any>,
  res: Response,
  next: NextFunction
) => {
  const overviewPromise = overview(req, res);
  const jobsPromise = getJobs(req, res);

  Promise.all([overviewPromise, jobsPromise]).then((values) => {
    res.locals = values;
    next();
  });
};
