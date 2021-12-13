import express from 'express';
import { autocomplete } from 'src/controllers/autocomplete';
import { deleteJobs } from 'src/controllers/delete-jobs';
import { getJobs } from 'src/controllers/get-jobs';
import { overview } from 'src/controllers/overview';

const router = express.Router();

router.route('/jobs').get(getJobs);
router.route('/autocomplete').get(autocomplete);
router.route('/overview').get(overview);
router.route('/delete').delete(deleteJobs);

export default router;
