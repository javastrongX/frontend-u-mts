import { Box, Text, Flex } from '@chakra-ui/react';
import FilterButtons from './FilterButtons';
import MoreButton from './MoreButton';
import { useTranslation } from 'react-i18next';

const FilterSection = ({ 
  title, 
  category, 
  currentFilters, 
  selectedFilters, 
  onToggle 
}) => {
  const filterData = currentFilters?.[category];
  const { t } = useTranslation();
  if (!filterData) {
    console.warn(`Filter data for category "${category}" is undefined.`);
    return null;
  }

  return (
    <Box>
      <Text fontWeight="medium" fontSize="sm" color="gray.700" mb={2} mt={2}>
        {title}
      </Text>
      <Flex wrap="wrap" gap={2}>
        <FilterButtons
          visibleItems={filterData.visible}
          selectedList={selectedFilters?.[category] || []}
          category={category}
          onToggle={onToggle}
        />
        <MoreButton
          items={filterData}
          category={category}
          label={t("adsfilterblock.more", "ещё")}
          selectedFilters={selectedFilters}
          onToggle={onToggle}
        />
      </Flex>
    </Box>
  );
};

export default FilterSection;
