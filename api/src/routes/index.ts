import express from 'express';
import { autocomplete } from 'src/controllers/autocomplete';
import { getJobs } from 'src/controllers/get-jobs';
import { overview } from 'src/controllers/overview';

const router = express.Router();

router.route('/jobs').get(getJobs);
router.route('/autocomplete').get(autocomplete);
router.route('/overview').get(overview);

export default router;
