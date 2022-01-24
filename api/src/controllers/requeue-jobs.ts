import { NextFunction, Request, Response } from 'express';
import { getAgendaInstance } from 'src/agenda-instance';
import { ObjectId } from 'mongodb';
import { StatusType } from 'src/types';
import { buildGetJobsQuery } from 'src/utils/build-get-jobs-query';

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

export const requeueJobsByQuery = async (
  req: Request<any, any, any, ReqQuery>,
  res: Response,
  next: NextFunction
) => {
  const query = buildGetJobsQuery(req.query);
  const jobs = await getAgendaInstance()
    ._collection.aggregate([...query])
    .toArray();
  const requeuedJobs = await Promise.all(
    jobs.map(({ job }) => getAgendaInstance().now(job.name, job.data))
  );

  res.locals.requeued = requeuedJobs;

  next();
};

export const requeueJobsById = async (
  req: Request<any, any, ReqBody, any>,
  res: Response,
  next: NextFunction
) => {
  const jobs = await getAgendaInstance()
    ._collection.find({
      _id: {
        $in: req.body.ids.map((id) => new ObjectId(id)),
      },
    })
    .toArray();

  const requeuedJobs = await Promise.all(
    jobs.map((job) => getAgendaInstance().now(job.name, job.data))
  );

  res.locals.requeued = requeuedJobs;

  next();
};
