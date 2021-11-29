import { range } from 'lodash';
import { useCallback } from 'react';

interface PropType {
  page: number;
  pagesCount: number;
  setPage: (page: number) => void;
}

const PaginationButtons: React.FC<PropType> = ({
  page,
  pagesCount,
  setPage,
}) => {
  const handlePrevPage = useCallback(
    () => page > 1 && setPage(page - 1),
    [page, setPage]
  );

  const handleNextPage = useCallback(
    () => page < pagesCount && setPage(page + 1),
    [page, pagesCount, setPage]
  );

  const setCustomPage = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= pagesCount) {
        setPage(newPage);
      }
    },
    [pagesCount, setPage]
  );

  const setPageFromUserInput = useCallback(() => {
    const pg = prompt('Enter the page number: ');
    const newPage = parseInt(pg!);
    setCustomPage(newPage);
  }, [setCustomPage]);

  const renderPaginationButtons = useCallback(() => {
    if (pagesCount <= 10) {
      return range(1, pagesCount + 1).map((pg) => (
        <button
          key={pg}
          className="btn btn-outline"
          onClick={() => setCustomPage(pg)}
          disabled={page === pg}
        >
          {pg}
        </button>
      ));
    }

    const leftHiddenPages = page - 2 > 2;
    const rightHiddenPages = page + 2 < pagesCount;

    const start = Math.max(2, page - 2);
    const end = Math.min(pagesCount - 1, page + 2);

    return (
      <>
        <button
          key={1}
          className="btn btn-outline"
          onClick={() => setCustomPage(1)}
          disabled={page === 1}
        >
          {1}
        </button>
        {leftHiddenPages && (
          <button className="btn btn-outline" onClick={setPageFromUserInput}>
            ...
          </button>
        )}
        {range(start, end + 1).map((pg) => (
          <button
            key={pg}
            className="btn btn-outline"
            onClick={() => setCustomPage(pg)}
            disabled={page === pg}
          >
            {pg}
          </button>
        ))}
        {rightHiddenPages && (
          <button className="btn btn-outline" onClick={setPageFromUserInput}>
            ...
          </button>
        )}
        <button
          key={pagesCount}
          className="btn btn-outline"
          onClick={() => setCustomPage(pagesCount)}
          disabled={page === pagesCount}
        >
          {pagesCount}
        </button>
      </>
    );
  }, [page, pagesCount, setCustomPage, setPageFromUserInput]);

  return (
    <div className="btn-group">
      <button
        className="btn btn-outline"
        onClick={handlePrevPage}
        disabled={page <= 1}
      >
        ‹
      </button>
      {renderPaginationButtons()}
      <button
        className="btn btn-outline"
        onClick={handleNextPage}
        disabled={page >= pagesCount}
      >
        ›
      </button>
    </div>
  );
};

export default PaginationButtons;
