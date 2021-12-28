import { NextFunction, Request, Response } from 'express';
import agenda from 'src/agenda';
import { ObjectId } from 'mongodb';
import { buildGetJobsQuery } from 'src/utils/build-get-jobs-query';
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

interface ReqBody {
  ids: string[];
}

export const deleteJobsByQuery = async (
  req: Request<any, any, any, ReqQuery>,
  res: Response,
  next: NextFunction
) => {
  const query = buildGetJobsQuery(req.query);
  const jobs = await agenda._collection.aggregate([...query]).toArray();
  const deletedJobs = await agenda.cancel({
    _id: {
      $in: jobs.map((job) => new ObjectId(job._id)),
    },
  });

  res.locals.deleted = deletedJobs;

  next();
};

export const deleteJobsById = async (
  req: Request<any, any, ReqBody, any>,
  res: Response,
  next: NextFunction
) => {
  const deletedJobs = await agenda.cancel({
    _id: {
      $in: req.body.ids.map((id) => new ObjectId(id)),
    },
  });

  res.locals.deleted = deletedJobs;

  next();
};
