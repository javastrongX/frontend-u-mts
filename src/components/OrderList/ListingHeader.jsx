import { Box, Collapse, Text, Flex, HStack, IconButton, Input, useBreakpointValue, useDisclosure, VStack } from "@chakra-ui/react";
import { useFilters } from "../Ads_component/hooks/useFilters";
import { useCallback, useState } from "react";
import { AiOutlineFilter, AiOutlineMenu, AiOutlineReload } from "react-icons/ai";
import TabNavigation from "../Ads_component/TabNavigation";
import FilterSection from "../Ads_component/FilterSection";
import { CiGrid41 } from "react-icons/ci";
import ActionButtons from "../Ads_component/ActionButtons";
import { useTranslation } from "react-i18next";

// Header Component
export const ListingHeader = ({ totalCount, viewMode, setViewMode, onRefresh, isLoading, activeTab, setActiveTab, setActivePage }) => {
  const isMobile = useBreakpointValue({ base: true, custom900: false });
  const { isOpen, onToggle } = useDisclosure();
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const { t } = useTranslation();

  const tabLabels = [
    t("filter_block.all" ,"Все"),
    t("filter_block.sell_special_tech", "Продажа спецтехники"), 
    t("filter_block.rent", "Аренда спецтехники"),
    t("filter_block.spare_parts", "Запчасти"),
    t("filter_block.repair", "Ремонт"),
    t("filter_block.drivers", "Водители"),
  ];

  // Custom hook for filters
  const { selectedFilters, currentFilters, toggleFilter, resetFilters } = useFilters(
    tabLabels, 
    activeTab
  );

  // Tab change handler - setActivePage'ni ishlatish
  const handleTabChange = useCallback((newTab) => {
    if (setActivePage) {
      setActivePage(newTab); // Bu URL ni ham yangilaydi
    } else if (setActiveTab) {
      setActiveTab(newTab); // Fallback
    }
  }, [setActivePage, setActiveTab]);

  const formatInputNumber = (value) => {
    if (!value) return '';

    // Faqat raqamlarni qoldirish
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';

    // Raqamga aylantirish
    let number = parseInt(numbers, 10);
    if (isNaN(number)) return '';

    // Min-max cheklovlar
    if (number < 0) number = 0;
    if (number > 999_999_999) number = 999_999_999;

    // Formatlash (UZ style: probel bilan ajratilgan)
    return number.toLocaleString('uz-UZ');
  };

  const inputStyles = {
    w: "100%",
    bg: "white",
    border: "1px",
    borderColor: "gray.200",
    borderRadius: "lg",
    size: "sm",
    _focus: {
      borderColor: "yellow.400",
      boxShadow: "0 0 0 1px var(--chakra-colors-yellow-400)"
    }
  };

  const handleResetAll = useCallback(() => {
    const additionalReset = () => {
      setPriceFrom("");
      setPriceTo("");
    };
    resetFilters(additionalReset);
  }, [resetFilters]);

  return (
    <Box bg="white" p={4} borderRadius="lg" boxShadow="sm" mb={4}>
      <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
        <VStack align="flex-start" spacing={1}>
          <Text fontSize="lg" fontWeight="semibold" color="gray.800">
            {t("listingheader.list_of_announcements", "Список заказов")}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {t("adsfilterblock.total", "Всего")} {totalCount} {t("adsfilterblock.results", "результатов")}
          </Text>
        </VStack>
        
        <HStack spacing={2}>
          {/* Refresh button */}
          <IconButton
            aria-label={t("adsfilterblock.refresh", "Обновить")}
            icon={<AiOutlineReload />}
            fontSize={'20px'}
            variant="outline"
            colorScheme="gray"
            onClick={onRefresh}
            isLoading={isLoading}
            _hover={{ bg: 'gray.50' }}
          />
          
          {/* Filter button (placeholder) */}
          <IconButton
            aria-label="Filter"
            icon={<AiOutlineFilter />}
            fontSize={'20px'}
            variant="outline"
            colorScheme="gray"
            onClick={onToggle}
            _hover={{ bg: 'gray.50' }}
          />

          {/* View mode toggles */}
          <HStack spacing={1} bg="gray.100" p={1} borderRadius="md" display={isMobile ? 'none' : 'flex'}>
            <IconButton
              aria-label={t("listingheader.view_list", "В виде списка")}
              icon={<AiOutlineMenu />}
              fontSize={'20px'}
              variant={viewMode === 'list' ? 'solid' : 'ghost'}
              onClick={() => setViewMode('list')}
              _hover={{ 
                bg: viewMode === 'list' ? 'orange.50' : 'gray.200' 
              }}
            />
            <IconButton
              aria-label={t("listingheader.view_grid", "В виде сетки")}
              icon={<CiGrid41 />}
              fontSize={'20px'}
              variant={viewMode === 'grid' ? 'solid' : 'ghost'}
              onClick={() => setViewMode('grid')}
              _hover={{ 
                bg: viewMode === 'grid' ? 'orange.50' : 'gray.200' 
              }}
            />
          </HStack>
        </HStack>
      </Flex>

      {/* Filter section */}
      <Collapse in={isOpen} animateOpacity> 
        <Box display={'flex'} flexDir={'column'}>
          <Box 
            display="flex"
            justifyContent="space-between"
            maxW="100%" 
            p={2}
            flexDir={{base: "column", custom900: 'row'}}
            mt={5} 
            bg="gray.50" 
            borderRadius="2xl" 
            boxShadow="sm"
          >
            <Box display="flex" flexDir={'column'} gap={3} justifyContent="space-between">
              {/* Tabs - handleTabChange ishlatish */}
              <TabNavigation 
                tabLabels={tabLabels}
                activeTab={activeTab}
                onTabChange={handleTabChange} // Bu yerda URL ni yangilaydigan funksiya
              />

              {/* Filters */}
              <VStack align="stretch" spacing={4}>
                {currentFilters?.cities && (
                  <FilterSection
                    title={t("adsfilterblock.category_label_city", "Город")}
                    category="cities"
                    currentFilters={currentFilters}
                    selectedFilters={selectedFilters}
                    onToggle={toggleFilter}
                  />
                )}
                
                {/* Тип — only for certain tabs and if types exist */}
                {currentFilters?.types && (
                  <FilterSection
                    title={t("adsfilterblock.category_label_type", "Тип")}
                    category="types"
                    currentFilters={currentFilters}
                    selectedFilters={selectedFilters}
                    onToggle={toggleFilter}
                  />
                )}
                
                {/* Профессия — only for tab 4 and if profession exists */}
                {currentFilters?.profession && (
                  <FilterSection
                    title={t("adsfilterblock.category_label_profession", "Профессия")}
                    category="profession"
                    currentFilters={currentFilters}
                    selectedFilters={selectedFilters}
                    onToggle={toggleFilter}
                  />
                )}
                
                {/* Марка — for all tabs except 4, and if brands exist */}
                {currentFilters?.brands && (
                  <FilterSection
                    title={t("adsfilterblock.category_label_brand", "Марка")}
                    category="brands"
                    currentFilters={currentFilters}
                    selectedFilters={selectedFilters}
                    onToggle={toggleFilter}
                  />
                )}
              </VStack>
            </Box>
            <Box mt={2} display={'flex'} justifyContent={'center'} flexDir={'column'}>
              <Text color="gray.700" mb={2} fontSize="sm">{t("adsfilterblock.category_label_price", "Цена")}</Text>
              <Box display={'flex'}  w={'70%'} gap={2} flexDir={{ base: 'row', custom900: 'column' }}>
                <Input
                  type='text'
                  inputMode='numeric'
                  placeholder={t("adsfilterblock.from", "от")}
                  value={priceFrom}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\s/g, '');
                    setPriceFrom(formatInputNumber(raw));
                  }}
                  {...inputStyles}
                />
                <Input
                  type='text'
                  inputMode='numeric'
                  placeholder={t("adsfilterblock.to", "до")}
                  value={priceTo}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\s/g, '');
                    setPriceTo(formatInputNumber(raw));
                  }}
                  {...inputStyles}
                />
              </Box>
            </Box>
          </Box>
          <ActionButtons onReset={handleResetAll} totalAds={totalCount} />
        </Box>
        
      </Collapse> 
    </Box>
  );
};