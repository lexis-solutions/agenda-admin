import { Request, Response } from 'express';
import agenda from '../agenda';

interface ReqQuery {
  sortBy: 'lastRunAt' | 'nextRunAt';
  sortType: 'desc' | 'asc';
  page: number;
}

const getJobs = async (
  req: Request<any, any, any, ReqQuery>,
  res: Response
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
  res.json({
    pagesCount,
    page,
    jobs,
  });
};

export default getJobs;
