import { Button, Flex, HStack, IconButton, Text } from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";


// Enhanced Pagination Component
export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 3;
    const halfVisible = Math.floor(maxVisible / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const visiblePages = getVisiblePages();
  if (totalPages <= 1) return null;

  return (
    <Flex justify="center" py={8} mb={4}>
      <HStack
        spacing={2} 
        bg="white" 
        p={4} 
        borderRadius="2xl" 
        boxShadow="lg"
        border="1px"
        borderColor="gray.100"
      >
        <IconButton
          icon={<FiChevronsLeft />}
          onClick={() => onPageChange(1)}
          isDisabled={currentPage === 1}
          variant="ghost"
          aria-label="First page"
          borderRadius="lg"
          _hover={{ bg: 'blue.50' }}
        />
        
        <IconButton
          icon={<FiChevronLeft />}
          onClick={() => onPageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
          variant="ghost"
          aria-label="Previous page"
          borderRadius="lg"
          _hover={{ bg: 'blue.50' }}
        />

        {visiblePages[0] > 1 && (
          <>
            <Button
              onClick={() => onPageChange(1)}
              variant="ghost"
              size="sm"
              borderRadius="lg"
              _hover={{ bg: 'blue.50' }}
            >
              1
            </Button>
            {visiblePages[0] > 2 && (
              <Text color="gray.400" px={2}>...</Text>
            )}
          </>
        )}

        {visiblePages.map((pageNum) => (
          <Button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            colorScheme={currentPage === pageNum ? "blue" : "gray"}
            variant={currentPage === pageNum ? "solid" : "ghost"}
            size="sm"
            borderRadius="lg"
            bg={currentPage === pageNum ? "blue.400" : "transparent"}
            _hover={{ 
              bg: currentPage === pageNum ? "blue.400" : "blue.50" 
            }}
          >
            {pageNum}
          </Button>
        ))}

        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <Text color="gray.400" px={2}>...</Text>
            )}
            <Button
              onClick={() => onPageChange(totalPages)}
              variant="ghost"
              size="sm"
              borderRadius="lg"
              _hover={{ bg: 'blue.50' }}
            >
              {totalPages}
            </Button>
          </>
        )}

        <IconButton
          icon={<FiChevronRight />}
          onClick={() => onPageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
          variant="ghost"
          aria-label="Next page"
          borderRadius="lg"
          _hover={{ bg: 'blue.50' }}
        />
        
        <IconButton
          icon={<FiChevronsRight />}
          onClick={() => onPageChange(totalPages)}
          isDisabled={currentPage === totalPages}
          variant="ghost"
          aria-label="Last page"
          borderRadius="lg"
          _hover={{ bg: 'blue.50' }}
        />
      </HStack>
    </Flex>
  );
};
