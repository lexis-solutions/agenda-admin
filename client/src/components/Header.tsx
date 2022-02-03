import * as Yup from 'yup';

import JobFilters from 'src/components/JobFilters';
import JobNamesAutocomplete from 'src/components/JobNamesAutocomplete';
import Modal from 'src/components/Modal';
import Plus from 'src/svgs/Plus';
import { createNewJob } from 'src/api';
import humanInterval from 'human-interval';
import { isUndefined } from 'lodash';
import { useFormik } from 'formik';
import { useState } from 'react';

interface FormValuesType {
  name: string;
  repeatInterval?: string;
  schedule?: string;
  data?: string;
}

const cronRegex = new RegExp(
  /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/
);

const createJobSchema = Yup.object().shape({
  name: Yup.string().required('Job name is required!'),
  schedule: Yup.string()
    .test('valid-human-interval', 'Invalid time format', (value) => {
      const time = humanInterval(value);
      return !isNaN(Number(value)) || isUndefined(time) || !isNaN(time);
    })
    .when('repeatInterval', {
      is: (repeatInterval: string | undefined) => !repeatInterval,
      then: Yup.string().required(
        'Either a schedule or a repeat interval must be provided!'
      ),
    }),
  repeatInterval: Yup.string().test(
    'valid-human-interval',
    'Invalid time format',
    (value) => {
      if (isUndefined(value)) {
        return true;
      }

      const time = humanInterval(value);
      return (
        !isNaN(Number(value)) ||
        cronRegex.test(value) ||
        isUndefined(time) ||
        !isNaN(time)
      );
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
  const [renderAlert, setRenderAlert] = useState(false);

  const showAlert = () => {
    setRenderAlert(true);
    setTimeout(() => setRenderAlert(false), 5000);
  };

  const formik = useFormik<FormValuesType>({
    initialValues: {
      name: '',
      schedule: '',
      repeatInterval: '',
      data: 'null',
    },
    onSubmit: async (values) => {
      await createNewJob(values);
      showAlert();
    },
    validationSchema: createJobSchema,
  });

  return (
    <div className="relative flex flex-col w-full">
      <JobFilters />
      <div className="flex justify-end w-full">
        <a
          href="#create-job"
          onClick={() => setRenderModal(true)}
          className="mt-4 btn bg-primary text-primary-content"
        >
          <Plus />
          <span className="ml-2">New Job</span>
        </a>
      </div>
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
              <div className="flex flex-row items-center">Schedule</div>
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
            <span className="my-2 text-xs text-base-content">
              Number or{' '}
              <a
                className="link"
                href="https://www.npmjs.com/package/human-interval"
                target="_blank"
                rel="noreferrer"
              >
                human-readable interval
              </a>
            </span>
            <label className="label" htmlFor="repeatInterval">
              <div className="flex flex-row items-center">Repeat Interval</div>
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
            <span className="my-2 text-xs text-base-content">
              Number,{' '}
              <a
                className="link"
                href="https://www.npmjs.com/package/human-interval"
                target="_blank"
                rel="noreferrer"
              >
                human-readable interval,
              </a>{' '}
              or{' '}
              <a
                className="link"
                href="https://crontab.guru/"
                target="_blank"
                rel="noreferrer"
              >
                cron expression
              </a>
            </span>
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
            {renderAlert && (
              <div className="sticky left-0 right-0 m-2 alert alert-success">
                <label>Job successfully created!</label>
              </div>
            )}
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
