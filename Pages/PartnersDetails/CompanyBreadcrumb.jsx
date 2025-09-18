import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Text, useColorModeValue } from "@chakra-ui/react";
import { FiChevronRight } from "react-icons/fi";

const CompanyBreadcrumb = ({ t, title }) => {
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box
      mb={5}
      bg={cardBg}
      borderBottom="1px"
      borderColor="gray.200"
      shadow="sm"
      borderRadius="md"
    >
      <Box
        w="100%"
        px={{ base: 3, sm: 4, md: 6 }}
        py={{ base: 3, md: 4 }}
      >
        <Breadcrumb
          spacing={{ base: 1, sm: 2 }}
          separator={<FiChevronRight color="gray.500" size="12px" />}
          fontSize={{ base: "xs", sm: "sm" }}
          color="gray.600"
          overflowX="auto"
          whiteSpace="nowrap"
        >
          <BreadcrumbItem flexShrink={0}>
            <BreadcrumbLink
              href="/"
              _hover={{ color: "blue.400" }}
              transition="color 0.2s"
              fontSize={{ base: "xs", sm: "sm" }}
            >
              {t("second_nav.home", "Главная")}
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem flexShrink={0}>
            <BreadcrumbLink
              href="/companies"
              _hover={{ color: "blue.400" }}
              transition="color 0.2s"
              fontSize={{ base: "xs", sm: "sm" }}
              isTruncated
              maxW={{ base: "120px", sm: "200px" }}
            >
              {t("footer.companies", "Компании")}
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage flexShrink={0}>
            <BreadcrumbLink
              color="blue.400"
              fontWeight="medium"
              fontSize={{ base: "xs", sm: "sm" }}
              isTruncated
              maxW={{ base: "100px", sm: "150px" }}
            >
              <Text noOfLines={1}>
                {title}
              </Text>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>
    </Box>
  );
};

export default CompanyBreadcrumb;
