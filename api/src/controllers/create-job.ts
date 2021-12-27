import { NextFunction, Request, Response } from 'express';
import agenda from 'src/agenda';

interface RequestBodyType {
  name: string;
  repeatInterval?: string;
  schedule?: string;
  data?: Record<string, unknown>;
}

export const createNewJob = async (
  req: Request<any, any, any, RequestBodyType>,
  res: Response,
  next: NextFunction
) => {
  const { name, repeatInterval, schedule, data } = req.body;
  const job = agenda.create(name, data);

  if (schedule) {
    job.schedule(schedule);
  }

  if (repeatInterval) {
    job.repeatEvery(repeatInterval);
  }

  res.locals = await job.save();
  next();
};
