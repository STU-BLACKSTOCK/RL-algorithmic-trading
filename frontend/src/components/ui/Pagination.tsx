import { IconChevronLeft, IconChevronRight } from "../icons";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  const pages: number[] = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const endPage = Math.min(totalPages, startPage + maxVisible - 1);
  startPage = Math.max(1, endPage - maxVisible + 1);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (totalItems === 0) return null;

  return (
    <div className="pagination">
      <span className="pagination__info">
        Showing {start}–{end} of {totalItems}
      </span>
      <div className="pagination__controls">
        <button
          className="pagination__btn"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <IconChevronLeft size={16} />
        </button>
        {pages.map((page) => (
          <button
            key={page}
            className={`pagination__btn ${page === currentPage ? "pagination__btn--active" : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="pagination__btn"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <IconChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
