import express from 'express';
import getJobs from '../controllers/get-jobs';

const router = express.Router();

router.route('/jobs').get(...getJobs);

export default router;
