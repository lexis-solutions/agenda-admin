import { NextFunction, Request, Response } from 'express';
import { getAgendaInstance } from 'src/agenda-instance';
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

export const getJobs = async (
  req: Request<any, any, any, ReqQuery>,
  res: Response,
  next: NextFunction
) => {
  const page = req.query.page || 1;
  const itemsPerPage = +req.query.itemsPerPage || 20;
  const query = buildGetJobsQuery(req.query);

  const data = await getAgendaInstance()
    ._collection.aggregate([
      ...query,
      {
        $facet: {
          pages: [
            { $count: 'itemsCount' },
            {
              $project: {
                pagesCount: {
                  $ceil: { $divide: ['$itemsCount', itemsPerPage] },
                },
                itemsCount: '$itemsCount',
              },
            },
          ],
          jobs: [
            { $skip: itemsPerPage * (page - 1) },
            { $limit: itemsPerPage },
          ],
        },
      },
    ])
    .toArray();

  res.locals = data;

  next();
};
