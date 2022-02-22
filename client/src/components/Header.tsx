import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import cx from 'classnames';

import JobFilters from 'src/components/JobFilters';
import JobNamesAutocomplete from 'src/components/JobNamesAutocomplete';
import Modal from 'src/components/Modal';
import Plus from 'src/svgs/Plus';
import { createNewJob } from 'src/api';

interface FormValuesType {
  name: string;
  repeatInterval?: string;
  schedule?: string;
  data?: string;
}

const createJobSchema = Yup.object().shape({
  name: Yup.string().required('Job name is required!'),
  schedule: Yup.string().when('repeatInterval', {
    is: (repeatInterval: string | undefined) => !repeatInterval,
    then: Yup.string().required(
      'Either a schedule or a repeat interval must be provided!'
    ),
  }),
  repeatInterval: Yup.string(),
  data: Yup.string().test(
    'validate-data-format',
    'Invalid JSON format!',
    (value) => {
      if (!value) {
        return false;
      }

      try {
        JSON.parse(value);
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

  const formik = useFormik<FormValuesType>({
    initialValues: {
      name: '',
      schedule: '',
      repeatInterval: '',
      data: '{}',
    },
    onSubmit: async (values) => {
      await createNewJob(values);
      setRenderAlert(true);
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
          className="mt-4 btn btn-primary text-primary-content"
        >
          <Plus />
          <span className="ml-2">New Job</span>
        </a>
      </div>
      {renderModal && (
        <Modal
          id="create-job"
          title="Create job"
          onClose={() => {
            setRenderModal(false);
            setRenderAlert(false);
          }}
        >
          <form className="flex flex-col" onSubmit={formik.handleSubmit}>
            <label className="label" htmlFor="name">
              Name
            </label>
            <JobNamesAutocomplete
              menuStyle={{
                top: 155,
                left: 20,
                maxWidth: 350,
                maxHeight: 400,
              }}
              renderInput={(props) => (
                <input
                  {...props}
                  className={cx('w-full input input-bordered', {
                    'border-red-500': formik.errors.name && formik.touched.name,
                  })}
                  id="name"
                  name="name"
                  type="text"
                />
              )}
              value={formik.values.name}
              onChange={formik.handleChange}
              onSelect={(value) => formik.setFieldValue('name', value)}
            />

            <div className="mt-2 text-xs text-error">
              {formik.errors.name && formik.touched.name
                ? formik.errors.name
                : ''}
            </div>
            <label className="label" htmlFor="schedule">
              <div className="flex flex-row items-center">Schedule</div>
            </label>
            <input
              className={cx('input input-bordered', {
                'border-red-500':
                  formik.errors.schedule && formik.touched.schedule,
              })}
              id="schedule"
              name="schedule"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.schedule}
            />
            {formik.errors.schedule && formik.touched.schedule ? (
              <div className="mt-2 text-xs text-error">
                {formik.errors.schedule}
              </div>
            ) : null}
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
            <input
              className={cx('input input-bordered', {
                'border-red-500':
                  formik.errors.repeatInterval && formik.touched.repeatInterval,
              })}
              id="repeatInterval"
              name="repeatInterval"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.repeatInterval}
            />
            {formik.errors.repeatInterval && formik.touched.repeatInterval ? (
              <div className="mt-2 text-xs text-error">
                {formik.errors.repeatInterval}
              </div>
            ) : null}
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
            <textarea
              className={cx('font-mono textarea textarea-bordered', {
                'border-red-500': formik.errors.data && formik.touched.data,
              })}
              id="data"
              name="data"
              onChange={formik.handleChange}
              value={formik.values.data}
            />
            {formik.errors.data && formik.touched.data ? (
              <div className="mt-2 text-xs text-error">
                {formik.errors.data}
              </div>
            ) : null}
            {renderAlert && (
              <div className="sticky left-0 right-0 mt-4 -mb-2 alert alert-success">
                <label>Job successfully created!</label>
              </div>
            )}
            <div className="modal-action">
              <button className="btn btn-primary" type="submit">
                Submit
              </button>
              <a
                href="#!"
                onClick={() => {
                  setRenderModal(false);
                  setRenderAlert(false);
                }}
                className="btn"
              >
                Close
              </a>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Header;
