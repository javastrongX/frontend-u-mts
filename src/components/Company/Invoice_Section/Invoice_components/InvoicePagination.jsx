import { Button, Card, CardBody, Flex, HStack, IconButton, Select, Text } from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";




// Pagination component
export const Pagination = React.memo(({
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage, 
  onItemsPerPageChange,
  totalItems 
}) => {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          size="sm"
          variant={i === currentPage ? "solid" : "outline"}
          bg={i === currentPage ? "#fed500" : "white"}
          color={i === currentPage ? "black" : "gray.700"}
          borderColor={i === currentPage ? "#fed500" : "gray.300"}
          _hover={{
            bg: i === currentPage ? "#e6c200" : "gray.50"
          }}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Button>
      );
    }

    return pages;
  };

  return (
    <Card mt={6} bg="white">
      <CardBody>
        <Flex 
          direction={{ base: "column", md: "row" }} 
          justify="space-between" 
          align="center" 
          gap={4}
        >
          <HStack spacing={2}>
            <Text fontSize="sm" color="gray.600">
              {t("Business_mode.invoice_section.page", "На странице::")}
            </Text>
            <Select 
              size="sm" 
              width="70px" 
              value={itemsPerPage} 
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </Select>
            <Text fontSize="sm" color="gray.600">
              {t("Business_mode.invoice_section.totalRequisites_1", "Всего:")} {totalItems} {t("Business_mode.invoice_section.items", "шт.")}
            </Text>
          </HStack>

          <HStack spacing={2}>
            <IconButton
              aria-label="Oldingi sahifa"
              icon={<FiChevronLeft />}
              size="sm"
              variant="outline"
              borderColor="gray.300"
              isDisabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            />
            
            {renderPageNumbers()}
            
            <IconButton
              aria-label="Keyingi sahifa"
              icon={<FiChevronRight />}
              size="sm"
              variant="outline"
              borderColor="gray.300"
              isDisabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            />
          </HStack>

          <Text fontSize="sm" color="gray.600">
            {((currentPage - 1) * itemsPerPage) + 1}-
            {Math.min(currentPage * itemsPerPage, totalItems)} / {totalItems}
          </Text>
        </Flex>
      </CardBody>
    </Card>
  );
});

Pagination.displayName = "Pagination";