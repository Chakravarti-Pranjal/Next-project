
import React from "react";
import "./pagintaion.css"; // Add your CSS here

// Custom Pagination Component
const CustomPagination = ({
  rowsPerPage,
  rowCount,
  onChangePage,
  currentPage,
}) => {
  const totalPages = Math.ceil(rowCount / rowsPerPage);
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onChangePage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 0 && i <= totalPages) {
        pages.push(i);
      }
    }
    return pages;
  };

  return (
    <div className="pagination-container">
      {/* Left arrow */}
      <button
        className="circle-button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>

      {/* Page numbers */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          className={`circle-button ${page === currentPage ? "active" : ""}`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* Right arrow */}
      <button
        className="circle-button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
};

// const data = Array.from({ length: 50 }, (_, i) => ({
//   id: i + 1,
//   name: `Name ${i + 1}`,
//   email: `email${i + 1}@example.com`,
// }));

export default CustomPagination;