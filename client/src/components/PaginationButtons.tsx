import { range } from 'lodash';

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
  const handlePrevPage = () => page > 1 && setPage(page - 1);
  const handleNextPage = () => page < pagesCount && setPage(page + 1);

  const setCustomPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagesCount) {
      setPage(newPage);
    }
  };

  const setPageFromUserInput = () => {
    const pg = prompt('Enter the page number: ');
    const newPage = parseInt(pg!);
    setCustomPage(newPage);
  };

  const renderPageButton = (newPage: number) => (
    <button
      key={newPage}
      className="btn btn-outline"
      onClick={() => setCustomPage(newPage)}
      disabled={page === newPage}
    >
      {newPage}
    </button>
  );

  const renderHiddenPagesButton = () => (
    <button className="btn btn-outline" onClick={setPageFromUserInput}>
      ...
    </button>
  );


  const renderPaginationButtons = () => {
    if (pagesCount <= 10) {
      return range(1, pagesCount + 1).map((pg) => renderPageButton(pg));
    }

    const leftHiddenPages = page - 2 > 2;
    const rightHiddenPages = page + 2 < pagesCount;

    const start = Math.max(2, page - 2);
    const end = Math.min(pagesCount - 1, page + 2);

    return (
      <>
        {renderPageButton(1)}
        {leftHiddenPages && renderHiddenPagesButton()}
        {range(start, end + 1).map((pg) => renderPageButton(pg))}
        {rightHiddenPages && renderHiddenPagesButton()}
        {renderPageButton(pagesCount)}
      </>
    );
  };

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
