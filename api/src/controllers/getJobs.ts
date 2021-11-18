import { Request, Response } from 'express';
import agenda from '../agenda';

interface ReqQuery {
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

  const jobs = await agenda.jobs(
    {},
    {},
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
