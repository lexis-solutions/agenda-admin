import express from 'express';
import { autocomplete } from 'src/controllers/autocomplete';
import { getJobs } from 'src/controllers/get-jobs';
import { overview } from 'src/controllers/overview';
import { deleteJobsById, deleteJobsByQuery } from 'src/controllers/delete-jobs';
import {
  requeueJobsById,
  requeueJobsByQuery,
} from 'src/controllers/requeue-jobs';

const router = express.Router();

router.route('/jobs').get(getJobs);
router.route('/autocomplete').get(autocomplete);
router.route('/overview').get(overview);
router.route('/delete/id').delete(deleteJobsById);
router.route('/requeue/id').post(requeueJobsById);
router.route('/delete/query').delete(deleteJobsByQuery);
router.route('/requeue/query').post(requeueJobsByQuery);

export default router;
