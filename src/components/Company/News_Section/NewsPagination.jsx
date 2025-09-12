import { Button, HStack, IconButton, Select, Text, useBreakpointValue, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";




// Pagination Component
export const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, onItemsPerPageChange }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { t } = useTranslation();
  const getVisiblePages = () => {
    const delta = isMobile ? 1 : 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <VStack spacing={4} align="center">
      <HStack spacing={2} flexWrap="wrap" justify="center">
        {/* First page */}
        <IconButton
          icon={<FiChevronsLeft />}
          size="sm"
          isDisabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          variant="ghost"
        />
        
        {/* Previous page */}
        <IconButton
          icon={<FiChevronLeft />}
          size="sm"
          isDisabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          variant="ghost"
        />

        {/* Page numbers */}
        {getVisiblePages().map((page, index) => (
          <Button
            key={index}
            size="sm"
            variant={page === currentPage ? "solid" : "ghost"}
            bg={page === currentPage ? "#fed500" : "transparent"}
            color={page === currentPage ? "black" : "gray.600"}
            _hover={{
              bg: page === currentPage ? "#e6c200" : "gray.100"
            }}
            isDisabled={page === '...'}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            minW="40px"
          >
            {page}
          </Button>
        ))}

        {/* Next page */}
        <IconButton
          icon={<FiChevronRight />}
          size="sm"
          isDisabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          variant="ghost"
        />

        {/* Last page */}
        <IconButton
          icon={<FiChevronsRight />}
          size="sm"
          isDisabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          variant="ghost"
        />
      </HStack>

      {/* Items per page selector */}
      <HStack spacing={2} fontSize="sm">
        <Text color="gray.600">{t("Business_mode.News_Section.show", "Показать:")}</Text>
        <Select
          size="sm"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          w="auto"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </Select>
        <Text color="gray.600">{t("Business_mode.News_Section.items", "элементов")}</Text>
      </HStack>
    </VStack>
  );
};