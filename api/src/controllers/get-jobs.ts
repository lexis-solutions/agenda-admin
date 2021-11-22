import { NextFunction, Request, Response } from 'express';
import agenda from '../agenda';

interface ReqQuery {
  sortBy: 'lastRunAt' | 'nextRunAt';
  sortType: 'desc' | 'asc';
  page: number;
}

interface Status {
  repeating: boolean;
  scheduled: boolean;
  queued: boolean;
  completed: boolean;
  failed: boolean;
  running: boolean;
}

const getJobs = async (
  req: Request<any, any, any, ReqQuery>,
  res: Response,
  next: NextFunction
) => {
  const itemsPerPage = process.env.ITEMS_PER_PAGE
    ? parseInt(process.env.ITEMS_PER_PAGE)
    : 20;
  const jobsCount = await agenda._collection.countDocuments();
  const pagesCount = Math.ceil(jobsCount / itemsPerPage);
  const page = req.query.page || 1;

  const sortBy = req.query.sortBy || 'lastRunAt';
  const sortType = req.query.sortType === 'asc' ? 1 : -1;

  const jobs = await agenda.jobs(
    {},
    {
      [sortBy]: sortType,
    },
    itemsPerPage,
    (page - 1) * itemsPerPage
  );

  res.locals = {
    pagesCount,
    jobs,
  };

  next();
};

const setJobsStatus = (
  req: Request<any, any, any, ReqQuery>,
  res: Response,
  next: NextFunction
) => {
  const { jobs } = res.locals;
  const jobsWithStatus = jobs.map((job: any) => {
    const { lastFinishedAt, nextRunAt, lastRunAt, repeatInterval, failedAt } =
      job.attrs;
    const status: Status = {
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

    job.attrs.status = status;
    return job;
  });

  res.locals.jobs = jobsWithStatus;

  next();
};

export default [getJobs, setJobsStatus];
