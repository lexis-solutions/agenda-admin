import { SortType } from 'src/types';
import ChevronDown from 'src/svgs/ChevronDown';
import cx from 'classnames';

interface PropsType {
  title: string;
  column: SortType;
  currentColumn: SortType;
  setCurrentColumn: (column: SortType) => void;
  sortDesc: boolean;
  setSortDesc: (sortDesc: boolean) => void;
}

const SortableColumnButton: React.FC<PropsType> = ({
  title,
  column,
  currentColumn,
  setCurrentColumn,
  sortDesc,
  setSortDesc,
}) => (
  <div
    className="flex justify-between mr-3 -ml-3 btn btn-ghost btn-sm"
    onClick={() => {
      if (column === currentColumn) {
        setSortDesc(!sortDesc);
      } else {
        setCurrentColumn(column);
      }
    }}
  >
    <div className="text-xs font-bold text-left">{title}</div>
    {column === currentColumn && (
      <ChevronDown
        className={cx('transform transition-transform duration-200', {
          'rotate-180': !sortDesc,
        })}
      />
    )}
  </div>
);

export default SortableColumnButton;
