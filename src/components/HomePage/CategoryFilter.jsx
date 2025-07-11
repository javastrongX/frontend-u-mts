import {
  Box, HStack, Button, Text, Flex
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

// Mock kategoriyalar - bu ma'lumotlar backend dan kelishi kerak
const mockCategories = [
  { id: 0, title: "Barchasi" },
  { id: 1, title: "Avtomobil" },
  { id: 2, title: "Uy-ro'zg'or" },
  { id: 3, title: "Elektronika" },
  { id: 4, title: "Kiyim-kechak" },
  { id: 5, title: "Ko'chmas mulk" }
];

const CategoryFilter = ({ 
  activeCategory = 0, 
  onCategoryChange, 
  totalCount = 0
}) => {
  const { t } = useTranslation();

  return (
    <Box mb={4}>
      <Flex 
        direction={{ base: "column", sm: "row" }} 
        align={{ base: "flex-start", sm: "center" }} 
        justify="space-between"
        mb={3}
      >
        <Text fontSize="16px" fontWeight="bold">
          {t("mobile_hot_offers.categories", "Kategoriyalar")}
        </Text>
        <Text fontSize="sm" color="gray.600">
          {totalCount} {t("mobile_hot_offers.products_found", "mahsulot topildi")}
        </Text>
      </Flex>

      <HStack
        spacing={2}
        overflowX="auto"
        pb={2}
        sx={{
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {mockCategories.map((category) => (
          <Button
            key={category.id}
            size="sm"
            variant={activeCategory === category.id ? "solid" : "outline"}
            colorScheme={activeCategory === category.id ? "orange" : "gray"}
            onClick={() => onCategoryChange(category.id)}
            whiteSpace="nowrap"
            flexShrink={0}
            _hover={{
              transform: "translateY(-1px)",
              boxShadow: "md"
            }}
            transition="all 0.2s"
          >
            {category.title}
          </Button>
        ))}
      </HStack>
    </Box>
  );
};

export default CategoryFilter;