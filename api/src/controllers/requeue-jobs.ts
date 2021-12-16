import { NextFunction, Request, Response } from 'express';
import agenda from 'src/agenda';
import { ObjectId } from 'mongodb';

interface ReqBody {
  ids: string[];
}

export const requeueJobs = async (
  req: Request<any, any, ReqBody, any>,
  res: Response,
  next: NextFunction
) => {
  const jobs = await agenda._collection
    .find({
      _id: {
        $in: req.body.ids.map((id) => new ObjectId(id)),
      },
    })
    .toArray();

  const requeuedJobs = await Promise.all(
    jobs.map((job) => agenda.now(job.name, job.data))
  );

  res.locals.requeued = requeuedJobs;

  next();
};
