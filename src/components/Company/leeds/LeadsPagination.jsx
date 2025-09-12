import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";

const LeadsPagination = ({
  currentPage,
  totalPages,
  totalCount,
  loading = false,
  getPaginationRange,
  isSmMobile = false,
  cardBg,
  goToFirstPage,
  goToLastPage,
  goToNextPage,
  goToPrevPage,
  startItem,
  endItem,
  goToPage,
}) => {


  if (totalPages <= 1 || loading) {
    return null;
  }

  const { t } = useTranslation();

  return (
    <Card bg={cardBg || "white"} borderRadius="2xl" shadow="xl">
      <CardBody p={6}>
        <VStack spacing={5} w="full">
          {/* Info text (faqat desktopda) */}
          {!isSmMobile && (
            <Text fontSize="sm" color="gray.600" w="full" textAlign="left">
              {startItem}-{endItem} {t("Business_mode.Leeds.showingItems", "Просмотр")}, {t("Business_mode.Leeds.totalLeads", "Всего")} {totalCount} {t("Business_mode.Leeds.leadsCount", "лидов")}
            </Text>
          )}

          {/* Unified pagination (mobile + desktop) */}
          <Flex
            justify="center"
            align="center"
            w="full"
            flexWrap="wrap"
            gap={3}
          >
            <IconButton
              aria-label="Birinchi sahifa"
              icon={<FiChevronsLeft />}
              onClick={goToFirstPage}
              isDisabled={currentPage === 1}
              bg="white"
              color="#fed500"
              rounded="full"
              border="1px solid #fed500"
              shadow="sm"
              size={{base: 'sm', custom570: 'md'}}
              _hover={{ bg: "#fed50020" }}
              _active={{ bg: "#fed50040" }}
            />
            <IconButton
              aria-label="Oldingi sahifa"
              icon={<FiChevronLeft />}
              onClick={goToPrevPage}
              isDisabled={currentPage === 1}
              bg="white"
              color="#fed500"
              rounded="full"
              border="1px solid #fed500"
              shadow="sm"
              size={{base: 'sm', custom570: 'md'}}
              _hover={{ bg: "#fed50020" }}
              _active={{ bg: "#fed50040" }}
            />

            {/* Page numbers */}
            <ButtonGroup size={{base: 'sm', custom570: 'md'}} isAttached>
              {getPaginationRange().map((page) => (
                <Button
                  key={page}
                  onClick={() => goToPage(page)}
                  rounded="full"
                  bg={currentPage === page ? "#fed500" : "white"}
                  color={currentPage === page ? "black" : "gray.600"}
                  border="1px solid"
                  borderColor={currentPage === page ? "#fed500" : "gray.200"}
                  _hover={{
                    bg: currentPage === page ? "#e5bf00" : "#fed50020",
                  }}
                  _active={{
                    bg: currentPage === page ? "#d4ac00" : "#fed50040",
                  }}
                  shadow={currentPage === page ? "md" : "sm"}
                  fontWeight="600"
                  minW={{base: '38px', custom570: '42px'}}
                >
                  {page}
                </Button>
              ))}
            </ButtonGroup>

            <IconButton
              aria-label="Keyingi sahifa"
              icon={<FiChevronRight />}
              onClick={goToNextPage}
              isDisabled={currentPage === totalPages}
              bg="white"
              color="#fed500"
              rounded="full"
              border="1px solid #fed500"
              shadow="sm"
              size={{base: 'sm', custom570: 'md'}}
              _hover={{ bg: "#fed50020" }}
              _active={{ bg: "#fed50040" }}
            />
            <IconButton
              aria-label="Oxirgi sahifa"
              icon={<FiChevronsRight />}
              onClick={goToLastPage}
              isDisabled={currentPage === totalPages}
              bg="white"
              color="#fed500"
              rounded="full"
              border="1px solid #fed500"
              shadow="sm"
              size={{base: 'sm', custom570: 'md'}}
              _hover={{ bg: "#fed50020" }}
              _active={{ bg: "#fed50040" }}
            />
          </Flex>

          {/* Jump to page input */}
          {totalPages > 10 && (
            <HStack spacing={2} justify="center">
              <Text fontSize="sm" color="gray.600">
                {t("Business_mode.Leeds.pass_page", "Перейти на страницу:")}
              </Text>
              <Input
                type="number"
                min={1}
                max={totalPages}
                w="80px"
                size="sm"
                textAlign="center"
                rounded="full"
                borderColor="gray.400"
                focusBorderColor="#fed500"
                _focus={{ borderColor: "#fed500" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const page = parseInt(e.target.value);
                    if (page >= 1 && page <= totalPages) {
                      goToPage(page);
                      e.target.value = "";
                    }
                  }
                }}
                placeholder={currentPage.toString()}
              />
              <Text fontSize="sm" color="gray.600">
                / {totalPages}
              </Text>
            </HStack>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

export default LeadsPagination;
