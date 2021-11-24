import express from 'express';
import { getJobs, setJobsStatus } from 'src/controllers/get-jobs';

const router = express.Router();

router.route('/jobs').get(getJobs, setJobsStatus);

export default router;
