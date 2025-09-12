import { useState, useCallback, useEffect } from "react";
import { 
  Box, 
  Button, 
  Collapse, 
  VStack, 
  IconButton,
  Text,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Icon,
  Flex
} from "@chakra-ui/react";
import { FaFilter, FaChevronLeft } from "react-icons/fa6";

// Components
import TabNavigation from './TabNavigation';
import FilterSection from './FilterSection';
import PriceYearInputs from './PriceYearInputs';
import ConditionRadio from './ConditionRadio';
import ActionButtons from './ActionButtons';
import SearchWithPopup from "./SearchwithPopup";
import ActiveTabsPage from "./ActiveTabsPage";

// Constants and hooks
import { sampleData } from './constants/filterData';
import { useFilters } from './hooks/useFilters';
import { useNavigate, useLocation } from "react-router-dom";
import { AiOutlineFilter, AiOutlineReload } from "react-icons/ai";
import { useTranslation } from "react-i18next";



// Mobile Filter Modal Component
const MobileFilterModal = ({
  isOpen, 
  onClose, 
  tabLabels, 
  activeTab, 
  setActiveTab,
  sampleData, 
  search, 
  setSearch,
  currentFilters, 
  selectedFilters, 
  toggleFilter,
  priceFrom, 
  setPriceFrom, 
  priceTo, 
  setPriceTo,
  yearFrom, 
  setYearFrom, 
  yearTo, 
  setYearTo,
  radioValue, 
  setRadioValue,
  handleResetAll, 
  totalProducts,
  t
}) => (
  <Modal isOpen={isOpen} onClose={onClose} size="full">
    <ModalOverlay />
    <ModalContent 
      bg="black.90" 
      sx={{
        backdropFilter: "blur(2px)", 
        backdropBlur: "2px", 
        WebkitBackdropFilter: "blur(2px)"
      }}
    >
      <ModalHeader p={0}>
        <HStack 
          justify="space-between" 
          align="center" 
          p={4} 
          borderBottom="1px" 
          borderColor="gray.200"
        >
          <IconButton
            icon={<FaChevronLeft />}
            onClick={onClose}
            variant="ghost"
            size="lg"
            aria-label="Back"
          />
          <Text fontSize="lg" fontWeight="600">
            {t('adsfilterblock.filter', "Filter")}
          </Text>
          <Box w="40px" /> {/* Spacer for centering */}
        </HStack>
      </ModalHeader>
      
      <ModalBody p={4}>
        <VStack spacing={6} align="stretch">
          {/* Tabs */}
          <TabNavigation 
            tabLabels={tabLabels}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          
          {/* Search */}
          <SearchWithPopup 
            data={sampleData} 
            search={search} 
            setSearch={setSearch} 
          />

          <VStack align="stretch" spacing={4}>
            {/* Город — always show if cities exist */}
            {currentFilters?.cities && (
              <FilterSection
                title={t("adsfilterblock.category_label_city", "Город")}
                category="cities"
                currentFilters={currentFilters}
                selectedFilters={selectedFilters}
                onToggle={toggleFilter}
              />
            )}

            {/* Тип — only for tabs 0, 1, 2, 3, 5 and if types exist */}
            {[0, 1, 2, 3, 5].includes(activeTab) && currentFilters?.types && (
              <FilterSection
                title={t("adsfilterblock.category_label_type", "Тип")}
                category="types"
                currentFilters={currentFilters}
                selectedFilters={selectedFilters}
                onToggle={toggleFilter}
              />
            )}

            {/* Профессия — only for tab 4 and if profession exists */}
            {activeTab === 4 && currentFilters?.profession && (
              <FilterSection
                title={t("adsfilterblock.category_label_profession", "Профессия")}
                category="profession"
                currentFilters={currentFilters}
                selectedFilters={selectedFilters}
                onToggle={toggleFilter}
              />
            )}

            {/* Марка — for all tabs except 4, and if brands exist */}
            {activeTab !== 4 && currentFilters?.brands && (
              <FilterSection
                title={t("adsfilterblock.category_label_brand", "Марка")}
                category="brands"
                currentFilters={currentFilters}
                selectedFilters={selectedFilters}
                onToggle={toggleFilter}
              />
            )}
          </VStack>

          {/* Price and Year Inputs */}
          <PriceYearInputs
            priceFrom={priceFrom}
            setPriceFrom={setPriceFrom}
            priceTo={priceTo}
            setPriceTo={setPriceTo}
            yearFrom={yearFrom}
            setYearFrom={setYearFrom}
            yearTo={yearTo}
            setYearTo={setYearTo}
            activeTab={activeTab}
          />
          
          {/* Condition Radio - faqat tab 1 va 3 uchun */}
          {[1, 3].includes(activeTab) && (
            <ConditionRadio value={radioValue} setValue={setRadioValue} />
          )}

          {/* Action Buttons */}
          <Box pt={4} pb={8}>
            <ActionButtons onReset={handleResetAll} totalAds={totalProducts} />
          </Box>
        </VStack>
      </ModalBody>
    </ModalContent>
  </Modal>
);

const AdsFilterBlock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // URL dan active tab ni olish
  const getActiveTabFromUrl = () => {
    const urlParams = new URLSearchParams(location.search);
    return parseInt(urlParams.get('category_id')) || 0;
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromUrl());
  const [search, setSearch] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [radioValue, setRadioValue] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const { t } = useTranslation();
  
  const tabLabels = [
    t("filter_block.all" ,"Все"),
    t("filter_block.sell_special_tech", "Продажа спецтехники"), 
    t("filter_block.rent", "Аренда спецтехники"),
    t("filter_block.spare_parts", "Запчасти"),
    t("filter_block.repair", "Ремонт"),
    t("filter_block.drivers", "Водители"),
  ];  

  // Mobile filter modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Custom hook for filters
  const { selectedFilters, currentFilters, toggleFilter, resetFilters } = useFilters(
    tabLabels, 
    activeTab
  );

  // URL dan active tab ni handle qilish
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const categoryFromUrl = parseInt(urlParams.get('category_id')) || 0;
    setActiveTab(categoryFromUrl);
  }, [location.search]);

  // Browser back/forward button uchun
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const categoryFromUrl = parseInt(urlParams.get('category_id')) || 0;
      setActiveTab(categoryFromUrl);
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Active tab o'zgarganda URL ni yangilash
  const handleTabChange = useCallback((newTab) => {
    setActiveTab(newTab);
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('category_id', newTab.toString());
    navigate(`${location.pathname}?${urlParams.toString()}`, { replace: true });
  }, [navigate, location]);

  // Reset all form data
  const handleResetAll = useCallback(() => {
    const additionalReset = () => {
      setSearch("");
      setPriceFrom("");
      setPriceTo("");
      setYearFrom("");
      setYearTo("");
      setRadioValue("");
    };
    resetFilters(additionalReset);
  }, [resetFilters]);

  // Refresh function - barcha ma'lumotlarni qayta yuklash
  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    try {
      // Refresh key ni o'zgartirish orqali ActiveTabsPage ni qayta render qilish
      setRefreshKey(prev => prev + 1);
      
      // Form ma'lumotlarini reset qilish (ixtiyoriy)
      // handleResetAll();
      
      // Qo'shimcha API calllar yoki ma'lumotlarni yangilash
      // await refreshData();
      
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      {/* Desktop Version */}
      <Box 
        display={{ base: "none", custom900: "block" }} 
        maxW="100%" 
        p={4} 
        mt={5} 
        bg="white" 
        borderRadius="lg" 
        boxShadow="sm"
      >
        {/* Header Section */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={3} mb={4}>
          <VStack align="flex-start" spacing={1}>
            <Text fontSize="lg" fontWeight="semibold" color="gray.800">
              {t('adsfilterblock.list_of_announcements', "Список объявлений")}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {t("adsfilterblock.total", "Всего")} {totalProducts} {t("adsfilterblock.results", "результатов")}
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
              onClick={handleRefresh}
              isLoading={isLoading}
              _hover={{ bg: 'gray.50' }}
            />
            
            {/* Filter button */}
            <IconButton
              aria-label="Filter"
              icon={<AiOutlineFilter />}
              fontSize={'20px'}
              variant="outline"
              colorScheme="gray"
              onClick={() => setShowAdvanced(prev => !prev)}
              _hover={{ bg: 'gray.50' }}
            />
          </HStack>
        </Flex>

        {/* Filter section */}
        <Collapse in={showAdvanced} animateOpacity> 
          <Box 
            display="flex"
            justifyContent="space-between"
            maxW="100%" 
            p={4} 
            bg="gray.50" 
            borderRadius="2xl" 
            boxShadow="sm"
            mb={4}
          >
            {/* Left Section - Tabs and Filters */}
            <Box w="70%">
              {/* Tabs */}
              <TabNavigation 
                tabLabels={tabLabels}
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
              
              {/* Search */}
              <Box mb={4} mt={4}>
                <SearchWithPopup 
                  data={sampleData} 
                  search={search} 
                  setSearch={setSearch} 
                />
              </Box>

              {/* Filters */}
              <VStack align="stretch" spacing={4}>
                {/* Город — always show if cities exist */}
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
                {[0, 1, 2, 3, 5].includes(activeTab) && currentFilters?.types && (
                  <FilterSection
                    title={t("adsfilterblock.category_label_type", "Тип")}
                    category="types"
                    currentFilters={currentFilters}
                    selectedFilters={selectedFilters}
                    onToggle={toggleFilter}
                  />
                )}
                
                {/* Профессия — only for tab 4 and if profession exists */}
                {activeTab === 4 && currentFilters?.profession && (
                  <FilterSection
                    title={t("adsfilterblock.category_label_profession", "Профессия")}
                    category="profession"
                    currentFilters={currentFilters}
                    selectedFilters={selectedFilters}
                    onToggle={toggleFilter}
                  />
                )}
                
                {/* Марка — for all tabs except 4, and if brands exist */}
                {activeTab !== 4 && currentFilters?.brands && (
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

            {/* Right Section - Price, Year, Condition */}
            <Box w="30%" maxW="400px">
              <PriceYearInputs
                priceFrom={priceFrom}
                setPriceFrom={setPriceFrom}
                priceTo={priceTo}
                setPriceTo={setPriceTo}
                yearFrom={yearFrom}
                setYearFrom={setYearFrom}
                yearTo={yearTo}
                setYearTo={setYearTo}
                activeTab={activeTab}
              />
              
              {/* Condition Radio - faqat tab 1 va 3 uchun */}
              {[1, 3].includes(activeTab) && (
                <Box w="100%" mt={4}>
                  <ConditionRadio value={radioValue} setValue={setRadioValue} />
                </Box>
              )}
            </Box>
          </Box>

          {/* Action Buttons */}
          <ActionButtons onReset={handleResetAll} totalAds={totalProducts} />

        </Collapse>
      </Box>

      {/* Mobile Filter Button */}
      <Box 
        display={{ base: "flex", custom900: "none" }} 
        justifyContent="space-between"
        alignItems="center"
        mt={5}
        mb={4}
        w="100%"
        bg="black.0"
      >
        <Icon 
          onClick={() => navigate(-1)} 
          as={FaChevronLeft} 
          boxSize={6} 
          color="orange.150" 
        />
        <Button
          leftIcon={<FaFilter />}
          size="md"
          onClick={onOpen}
        >
          {t("adsfilterblock.filter" ,"Filter")}
        </Button>
      </Box>

      {/* Mobile Filter Modal */}
      <MobileFilterModal
        isOpen={isOpen}
        onClose={onClose}
        tabLabels={tabLabels}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        sampleData={sampleData}
        search={search}
        setSearch={setSearch}
        currentFilters={currentFilters}
        selectedFilters={selectedFilters}
        toggleFilter={toggleFilter}
        priceFrom={priceFrom}
        setPriceFrom={setPriceFrom}
        priceTo={priceTo}
        setPriceTo={setPriceTo}
        yearFrom={yearFrom}
        setYearFrom={setYearFrom}
        yearTo={yearTo}
        setYearTo={setYearTo}
        radioValue={radioValue}
        setRadioValue={setRadioValue}
        handleResetAll={handleResetAll}
        totalProducts={totalProducts}
        t={t}
      />

      {/* Active Tabs Page */}
      <Box flexDir="column" maxW="75rem">
        <ActiveTabsPage
          key={refreshKey}
          activeTab={activeTab}
          totalProducts={totalProducts}
          setTotalProducts={setTotalProducts}
          refreshKey={refreshKey}
        />
      </Box>
    </>
  );
};

export default AdsFilterBlock;