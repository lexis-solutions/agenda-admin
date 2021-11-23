import express from 'express';
import { getJobs, setJobsStatus } from '../controllers/get-jobs';

const router = express.Router();

router.route('/jobs').get(getJobs, setJobsStatus);

export default router;
