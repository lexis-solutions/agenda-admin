import { NextFunction, Request, Response } from 'express';
import agenda from 'src/agenda';
import { AUTOCOMPLETE_ITEMS } from 'src/constants';

interface ReqQuery {
  autocomplete: string;
}

export const autocomplete = async (
  req: Request<any, any, any, ReqQuery>,
  res: Response,
  next: NextFunction
) => {
  const autocomplete = new RegExp(`.*${req.query.autocomplete}.*`, 'i');

  const data = await agenda._collection
    .aggregate([
      {
        $match: { name: { $regex: autocomplete } },
      },
      {
        $group: {
          _id: '$name',
          name: { $first: '$name' },
        },
      },
      {
        $limit: AUTOCOMPLETE_ITEMS,
      },
    ])
    .toArray();

  res.locals.data = data;

  next();
};
