import { useState, useEffect } from 'react';

export const usePagination = (initialPage = 1, limit = 10) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updatePagination = (total) => {
    setTotalItems(total);
    setTotalPages(Math.ceil(total / limit));
  };

  const getOffset = () => (currentPage - 1) * limit;

  return {
    currentPage,
    totalPages,
    totalItems,
    handlePageChange,
    updatePagination,
    getOffset,
    limit
  };
};