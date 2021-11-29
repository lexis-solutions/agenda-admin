import express from 'express';
import { getJobs } from 'src/controllers/get-jobs';

const router = express.Router();

router.route('/jobs').get(getJobs);

export default router;
