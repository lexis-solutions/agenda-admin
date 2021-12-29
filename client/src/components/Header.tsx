import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import humanInterval from 'human-interval';
import JobFilters from 'src/components/JobFilters';
import Modal from 'src/components/Modal';
import { createNewJob } from 'src/api';
import { isUndefined } from 'lodash';
import Plus from 'src/svgs/Plus';
import JobNamesAutocomplete from 'src/components/JobNamesAutocomplete';

interface FormValuesType {
  name: string;
  repeatInterval?: string;
  schedule?: string;
  data?: string;
}

const CreateJobSchema = Yup.object().shape({
  name: Yup.string().required('Job name is required!'),
  schedule: Yup.string()
    .test('valid-human-interval', 'Invalid time format!', (value) => {
      const time = humanInterval(value);
      return isUndefined(time) || !isNaN(time);
    })
    .when('repeatInterval', {
      is: (repeatInterval: string | undefined) => !repeatInterval,
      then: Yup.string().required(
        'Either a schedule or a repeat interval must be provided!'
      ),
    }),
  repeatInterval: Yup.string().test(
    'valid-human-interval',
    'Invalid time format!',
    (value) => {
      const time = humanInterval(value);
      return isUndefined(time) || !isNaN(time);
    }
  ),
  data: Yup.string().test(
    'validate-data-format',
    'Invalid JSON format!',
    (value) => {
      try {
        if (value) {
          JSON.parse(value);
        }
      } catch (e) {
        return false;
      }
      return true;
    }
  ),
});

const Header: React.FC = () => {
  const [renderModal, setRenderModal] = useState(false);

  const formik = useFormik<FormValuesType>({
    initialValues: {
      name: '',
      schedule: '',
      repeatInterval: '',
      data: 'null',
    },
    onSubmit: async (values, { resetForm }) => {
      await createNewJob(values);
      resetForm();
      window.location.href = '#!';
      setRenderModal(false);
      alert('done');
    },
    validationSchema: CreateJobSchema,
  });

  return (
    <div className="relative flex w-full">
      <JobFilters />
      <a
        href="#create-job"
        onClick={() => setRenderModal(true)}
        className="absolute top-0 right-0 m-2 btn bg-primary text-primary-content"
      >
        <Plus />
        New Job
      </a>
      {renderModal && (
        <Modal id="create-job" onClose={() => setRenderModal(false)}>
          <div className="text-xl">Create Job</div>
          <form className="flex flex-col" onSubmit={formik.handleSubmit}>
            <label className="label" htmlFor="name">
              Name
            </label>
            {formik.errors.name && formik.touched.name ? (
              <div className="text-error">{formik.errors.name}</div>
            ) : null}
            <JobNamesAutocomplete
              menuStyle={{ top: 155, left: 20 }}
              renderInput={(props) => (
                <input
                  {...props}
                  className="w-full input input-bordered"
                  id="name"
                  name="name"
                  type="text"
                />
              )}
              value={formik.values.name}
              onChange={formik.handleChange}
              onSelect={(value) => formik.setFieldValue('name', value)}
            />
            <label className="label" htmlFor="schedule">
              Schedule
            </label>
            {formik.errors.schedule && formik.touched.schedule ? (
              <div className="text-error">{formik.errors.schedule}</div>
            ) : null}
            <input
              className="input input-bordered"
              id="schedule"
              name="schedule"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.schedule}
            />
            <label className="label" htmlFor="repeatInterval">
              Repeat Interval
            </label>
            {formik.errors.repeatInterval && formik.touched.repeatInterval ? (
              <div className="text-error">{formik.errors.repeatInterval}</div>
            ) : null}
            <input
              className="input input-bordered"
              id="repeatInterval"
              name="repeatInterval"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.repeatInterval}
            />
            <label className="label" htmlFor="data">
              Data
            </label>
            {formik.errors.data && formik.touched.data ? (
              <div className="text-error">{formik.errors.data}</div>
            ) : null}
            <textarea
              className="font-mono textarea textarea-bordered"
              id="data"
              name="data"
              onChange={formik.handleChange}
              value={formik.values.data}
            />
            <div className="modal-action">
              <button className="btn btn-primary" type="submit">
                Submit
              </button>
              <a
                href="#!"
                onClick={() => setRenderModal(false)}
                className="btn"
              >
                Cancel
              </a>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Header;
