interface PaginationProps {
  totalElements: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  totalElements,
  pageSize,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalElements / pageSize);

  if (totalPages < 1) return null;

  const pageNumbers = Array.from({ length: totalPages }).map((_, i) => i);

  return (
    <div className="flex justify-center mt-8">
      <div className="join">
        <button
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
          className="join-item btn"
        >
          Previous
        </button>

        {pageNumbers.map(i => (
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`join-item btn ${currentPage - 1 === i ? 'btn-active bg-blue-500 text-white' : ''}`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage + 1 >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="join-item btn"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
