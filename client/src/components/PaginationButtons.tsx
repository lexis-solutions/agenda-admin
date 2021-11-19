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

  return (
    <div className="btn-group">
      <button
        className="btn btn-outline btn-wide"
        onClick={handlePrevPage}
        disabled={page <= 1}
      >
        Previous Page
      </button>
      <button
        className="btn btn-outline btn-wide"
        onClick={handleNextPage}
        disabled={page >= pagesCount}
      >
        Next Page
      </button>
    </div>
  );
};

export default PaginationButtons;
