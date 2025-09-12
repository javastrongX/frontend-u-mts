import React from 'react';
import {
  Box,
  Button,
  HStack,
  Text,
  Flex,
  useColorModeValue,
  IconButton,
} from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Custom Pagination Button
const PaginationButton = ({ children, isActive, onClick, ...props }) => {
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const buttonHoverBg = useColorModeValue('blue.50', 'blue.900');
  const activeButtonBg = useColorModeValue('yellow.500', 'yellow.400');
  const activeButtonColor = useColorModeValue('white', 'gray.900');

  return (
    <Button
      size="sm"
      onClick={onClick}
      borderRadius="md"
      minW="8"
      px={3}
      variant={isActive ? 'solid' : 'ghost'}
      bg={isActive ? activeButtonBg : 'transparent'}
      color={isActive ? activeButtonColor : textColor}
      fontWeight={isActive ? 'bold' : 'medium'}
      boxShadow={isActive ? 'md' : 'none'}
      _hover={{
        bg: isActive ? activeButtonBg : buttonHoverBg,
        transform: 'scale(1.05)',
      }}
      _active={{ transform: 'scale(0.98)' }}
      transition="all 0.2s ease"
      {...props}
    >
      {children}
    </Button>
  );
};

const PaginationComponent = React.memo(
  ({
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    onPageChange,
  }) => {
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const buttonHoverBg = useColorModeValue('blue.50', 'blue.900');

    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;
      let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let endPage = Math.min(totalPages, startPage + maxVisible - 1);

      // Adjust startPage if endPage - startPage + 1 < maxVisible
      if (endPage - startPage + 1 < maxVisible) {
        startPage = Math.max(1, endPage - maxVisible + 1);
      }

      // Show first page and ellipsis if startPage > 1
      if (startPage > 1) {
        pages.push(
          <PaginationButton key={1} onClick={() => onPageChange(1)}>
            1
          </PaginationButton>
        );
        if (startPage > 2) {
          pages.push(
            <Text key="ellipsis1" fontSize="sm" color={textColor} px={2}>
              ...
            </Text>
          );
        }
      }

      // Main page numbers
      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <PaginationButton
            key={i}
            isActive={currentPage === i}
            onClick={() => onPageChange(i)}
          >
            {i}
          </PaginationButton>
        );
      }

      // Show last page and ellipsis if endPage < totalPages
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push(
            <Text key="ellipsis2" fontSize="sm" color={textColor} px={2}>
              ...
            </Text>
          );
        }
        pages.push(
          <PaginationButton key={totalPages} onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </PaginationButton>
        );
      }

      return pages;
    };

    return (
      <Box py={6} px={4}>
        <Flex
          justify="space-between"
          align="center"
          wrap="wrap"
          gap={4}
          direction={{ base: 'column', md: 'row' }}
        >
          <HStack spacing={1}>
            {/* Previous Button */}
            <IconButton
              size="sm"
              variant="ghost"
              icon={<FiChevronLeft />}
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              isDisabled={currentPage === 1}
              borderRadius="md"
              _hover={{
                bg: buttonHoverBg,
                transform: currentPage === 1 ? 'none' : 'scale(1.05)',
              }}
              _active={{ transform: 'scale(0.98)' }}
              _disabled={{
                opacity: 0.4,
                cursor: 'not-allowed',
                _hover: { transform: 'none' },
              }}
              mx={2}
              transition="all 0.2s"
            />
            {/* Page Numbers */}
            <HStack spacing={1}>{renderPageNumbers()}</HStack>

            {/* Next Button */}
            <IconButton
              size="sm"
              variant="ghost"
              icon={<FiChevronRight />}
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              isDisabled={currentPage === totalPages}
              borderRadius="md"
              px={3}
              _hover={{
                bg: buttonHoverBg,
                transform: currentPage === totalPages ? 'none' : 'scale(1.05)',
              }}
              _active={{ transform: 'scale(0.98)' }}
              _disabled={{
                opacity: 0.4,
                cursor: 'not-allowed',
                _hover: { transform: 'none' },
              }}
              mx={2}
              transition="all 0.2s"
            />
          </HStack>
        </Flex>
      </Box>
    );
  }
);

PaginationComponent.displayName = 'PaginationComponent';

export default PaginationComponent;