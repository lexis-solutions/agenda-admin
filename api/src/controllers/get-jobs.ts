import { NextFunction, Request, Response } from 'express';
import agenda from '../agenda';
import getJobStatus from '../utils/get-job-status';

interface ReqQuery {
  sortBy: 'lastRunAt' | 'nextRunAt';
  sortType: 'desc' | 'asc';
  page: number;
  itemsPerPage: number;
}

export const getJobs = async (
  req: Request<any, any, any, ReqQuery>,
  res: Response,
  next: NextFunction
) => {
  const jobsCount = await agenda._collection.countDocuments();
  const page = req.query.page || 1;
  const itemsPerPage = req.query.itemsPerPage || 20;
  const pagesCount = Math.ceil(jobsCount / itemsPerPage);

  const sortBy = req.query.sortBy || 'lastRunAt';
  const sortType = req.query.sortType === 'asc' ? 1 : -1;

  const jobs = await agenda.jobs(
    {},
    {
      [sortBy]: sortType,
    },
    +itemsPerPage,
    +itemsPerPage * (page - 1)
  );

  res.locals = {
    pagesCount,
    jobs,
  };

  next();
};

export const setJobsStatus = (
  req: Request<any, any, any, ReqQuery>,
  res: Response,
  next: NextFunction
) => {
  const { jobs } = res.locals;
  const jobsWithStatus = jobs.map((job: any) => {
    job.attrs.status = getJobStatus(job);
    return job;
  });

  res.locals.jobs = jobsWithStatus;

  next();
};
