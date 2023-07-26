import { FaAngleLeft } from 'react-icons/fa';

const PaginationComponent = ({ currentPage, setCurrentPage }) => {
  const totalPages = 10;
  const maxVisibleButtons = 5;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const getPageNumbers = () => {
    const halfMaxVisibleButtons = Math.floor(maxVisibleButtons / 2);
    let startPage = currentPage - halfMaxVisibleButtons;
    let endPage = currentPage + halfMaxVisibleButtons;

    if (startPage < 1) {
      startPage = 1;
      endPage = Math.min(maxVisibleButtons, totalPages);
    }

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, totalPages - maxVisibleButtons + 1);
    }

    const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

    if (currentPage > halfMaxVisibleButtons) {
      pageNumbers.unshift('...');
    }

    if (currentPage < totalPages - halfMaxVisibleButtons) {
      pageNumbers.push('...');
    }

    return pageNumbers;
  };

  return (
    <div>
      <div className="flex justify-start mt-8">
        <button
          type="button"
          onClick={handlePreviousPage}
          className="mx-1 px-3 py-2 w-10 rounded bg-gray-300 text-gray-800 hover:bg-slate-400 active:bg-slate-500 active:text-white"
          disabled={currentPage === 1}
        >
          <FaAngleLeft />
        </button>
        {getPageNumbers().map((pageNumber, index) => (
          <button
            key={index}
            type="button"
            onClick={pageNumber === '...' ? null : () => handlePageChange(pageNumber)}
            className={`mx-1 px-3 py-2 w-10 rounded hover:bg-slate-400 active:bg-slate-500 active:text-white ${
              pageNumber === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'
            }`}
          >
            {pageNumber}
          </button>
        ))}
        <button
          type="button"
          onClick={handleNextPage}
          className="mx-1 px-3 py-2 rounded bg-gray-300 text-gray-800 hover:bg-slate-400 active:bg-slate-500 active:text-white"
          disabled={currentPage === totalPages}
        >
          <span className=" text-black-800">Next page</span>
        </button>
      </div>
    </div>
  );
};

export default PaginationComponent;
