import cx from 'classnames';
import XCircle from 'src/svgs/Backspace';

interface PropsType {
  showButton: boolean;
  onClear: () => any;
  inputProps: React.HTMLProps<HTMLInputElement>;
  className?: string;
}

const InputField: React.FC<PropsType> = ({
  showButton,
  onClear,
  inputProps,
  className,
}) => (
  <div className="relative">
    <input {...inputProps} className={cx('input input-bordered', className)} />
    <button
      onClick={onClear}
      className={cx('absolute right-0 m-2 btn-sm btn', {
        hidden: !showButton,
      })}
    >
      <XCircle />
    </button>
  </div>
);

export default InputField;
