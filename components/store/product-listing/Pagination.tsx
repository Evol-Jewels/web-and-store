'use client';

import { useState } from 'react';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  onPageChange?: (page: number) => void;
}

export function Pagination({
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      onPageChange?.(page);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-12 md:mt-16 mb-8 md:mb-12">
      {/* Previous button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 md:px-4 py-2 font-sans text-sm rounded transition-colors ${
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-evol-dark-grey hover:bg-gray-100'
        }`}
      >
        Previous
      </button>

      {/* Page numbers */}
      <div className="flex gap-1">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 md:px-4 py-2 font-sans text-sm rounded transition-colors ${
              currentPage === page
                ? 'bg-evolRed text-white'
                : 'text-evol-dark-grey hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 md:px-4 py-2 font-sans text-sm rounded transition-colors ${
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-evol-dark-grey hover:bg-gray-100'
        }`}
      >
        Next
      </button>
    </div>
  );
}
