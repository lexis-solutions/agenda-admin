import express from 'express';
import { autocomplete } from 'src/controllers/autocomplete';
import { getJobs } from 'src/controllers/get-jobs';

const router = express.Router();

router.route('/jobs').get(getJobs);
router.route('/autocomplete').get(autocomplete);

export default router;
