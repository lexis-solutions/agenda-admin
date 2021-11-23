import arrowUp from 'src/svgs/chevron-up.svg';
import arrowDown from 'src/svgs/chevron-down.svg';

type SortType = 'lastRunAt' | 'nextRunAt';

interface PropsType {
  title: string;
  column: SortType;
  currentColumn: SortType;
  setCurrentColumn: (column: SortType) => void;
  sortDesc: boolean;
  setSortDesc: (sordDesc: boolean) => void;
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
    className="flex flex-row items-center justify-between cursor-pointer"
    onClick={() => {
      if (column === currentColumn) {
        setSortDesc(!sortDesc);
      } else {
        setCurrentColumn(column);
      }
    }}
  >
    <div>{title}</div>
    {column === currentColumn && (
      <img src={sortDesc ? arrowDown : arrowUp} width={20} />
    )}
  </div>
);

export default SortableColumnButton;
