import {
  Center, HStack, Button, Text
} from "@chakra-ui/react";

const MAX_VISIBLE_PAGES = 5;

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  // Ko'rinadigan sahifa raqamlarini hisoblash
  const getVisiblePages = () => {
    const pages = [];
    const halfVisible = Math.floor(MAX_VISIBLE_PAGES / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);
    
    // Agar oxirgi sahifalar ko'rsatilsa, boshlanish sahifasini orqaga siljitish
    if (endPage - startPage + 1 < MAX_VISIBLE_PAGES) {
      startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) return null;

  return (
    <Center py={4} mb={{base: 20, custom900: 4}}>
      <HStack spacing={2}>
        {/* Birinchi sahifaga o'tish */}
        <Button 
          onClick={() => onPageChange(1)} 
          isDisabled={currentPage === 1} 
          size="md" 
          variant="ghost"
        >
          «
        </Button>
        
        {/* Oldingi sahifaga o'tish */}
        <Button 
          onClick={() => onPageChange(currentPage - 1)} 
          isDisabled={currentPage === 1} 
          size="md" 
          variant="ghost"
        >
          ‹
        </Button>

        {/* Boshida ... ko'rsatish */}
        {visiblePages[0] > 1 && (
          <>
            <Button
              onClick={() => onPageChange(1)}
              size="md"
              variant="ghost"
            >
              1
            </Button>
            {visiblePages[0] > 2 && (
              <Text color="gray.500" px={2}>...</Text>
            )}
          </>
        )}

        {/* Ko'rinadigan sahifa raqamlari */}
        {visiblePages.map((pageNum) => (
          <Button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            size="md"
            bg={currentPage === pageNum ? "yellow.400" : "transparent"}
            color={currentPage === pageNum ? "black" : "inherit"}
            _hover={{ bg: currentPage === pageNum ? "yellow.300" : "yellow.100" }}
            _active={{ bg: currentPage === pageNum ? "yellow.5" : "yellow.200" }}
          >
            {pageNum}
          </Button>
        ))}

        {/* Oxirida ... ko'rsatish */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <Text color="gray.500" px={2}>...</Text>
            )}
            <Button
              onClick={() => onPageChange(totalPages)}
              size="md"
              variant="ghost"
            >
              {totalPages}
            </Button>
          </>
        )}

        {/* Keyingi sahifaga o'tish */}
        <Button 
          onClick={() => onPageChange(currentPage + 1)} 
          isDisabled={currentPage === totalPages} 
          size="md" 
          variant="ghost"
        >
          ›
        </Button>
        
        {/* Oxirgi sahifaga o'tish */}
        <Button 
          onClick={() => onPageChange(totalPages)} 
          isDisabled={currentPage === totalPages} 
          size="sm" 
          variant="ghost"
        >
          »
        </Button>
      </HStack>
    </Center>
  );
};

export default Pagination;