import { NextFunction, Request, Response } from 'express';
import agenda from 'src/agenda';
import { ObjectId } from 'mongodb';

interface ReqBody {
  ids: string[];
}

export const deleteJobs = async (
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
