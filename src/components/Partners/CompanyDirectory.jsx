import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Flex,
  Grid,
  Text,
  Select,
  Button,
  VStack,
  HStack,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Heading,
  Avatar,
  Icon,
  Spinner,
  Center,
  useToast,
  Stack,
  Tag,
  TagLabel,
  IconButton,
  Tooltip,
  useBreakpointValue,
  Collapse,
  useDisclosure
} from '@chakra-ui/react';

import { FaSearch as Search, FaStar as Star, FaExternalLinkAlt as ExternalLink, FaFilter as Filter, FaChevronDown as ChevronDown, FaChevronUp as ChevronUp} from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import PromoBlock from './PromoBlock';

// Mock data based on your JSON structure
const mockCompanies = {
  data: [
    {
      id: 2,
      name: "TOO MAGSERVICE PARTS",
      avatar: "https://via.placeholder.com/80x80/ff8000/white?text=MAG",
      rating: 4.5,
      city: {
        id: 300,
        title: "Шымкент",
        is_popular: true
      },
      specializations: [
        { id: 17, title: "Поставщики двигателей для спецтехники" },
        { id: 18, title: "Поставщики запчастей для ходовой части" },
        { id: 19, title: "Производители и поставщики металлических конструкций" },
        { id: 22, title: "Поставщики масел и фильтров" }
      ],
      slug: "2-too-magservice-parts",
      is_official: true,
      created_at: "2025-03-05T06:28:48.000000Z"
    },
    {
      id: 11,
      name: "ТОО \"KASPI PARTS INC\"",
      avatar: "https://via.placeholder.com/80x80/0066cc/white?text=KP",
      rating: 4.2,
      city: {
        id: 300,
        title: "Шымкент",
        is_popular: true
      },
      specializations: [
        { id: 25, title: "Поставщики автозапчастей" },
        { id: 26, title: "Ремонт техники" }
      ],
      slug: "11-too-kaspi-parts-inc",
      is_official: false,
      created_at: "2025-03-28T05:21:53.000000Z"
    },
    {
      id: 12,
      name: "ТОО QazaQ-Diesel-Service",
      avatar: "https://via.placeholder.com/80x80/333333/white?text=QDS",
      rating: 4.7,
      city: {
        id: 8,
        title: "Астана",
        is_popular: true
      },
      specializations: [
        { id: 30, title: "Диагностика спецтехники" },
        { id: 31, title: "Ремонт дизельных двигателей" }
      ],
      slug: "12-too-qazaq-diesel-service",
      is_official: true,
      created_at: "2025-04-02T11:24:29.000000Z"
    },
    {
      id: 13,
      name: "TOO \"Eurasian Machinery\"",
      avatar: "https://via.placeholder.com/80x80/006633/white?text=EM",
      rating: 4.0,
      city: {
        id: 300,
        title: "Шымкент",
        is_popular: true
      },
      specializations: [
        { id: 32, title: "Поставщики строительной техники" },
        { id: 33, title: "Аренда спецтехники" }
      ],
      slug: "13-too-eurasian-machinery",
      is_official: false,
      created_at: "2025-04-10T08:15:22.000000Z"
    },
    {
      id: 14,
      name: "SANY Kazakhstan",
      avatar: "https://via.placeholder.com/80x80/cc0000/white?text=SANY",
      rating: 4.8,
      city: {
        id: 1,
        title: "Алматы",
        is_popular: true
      },
      specializations: [
        { id: 34, title: "Производитель спецтехники" },
        { id: 35, title: "Поставщики экскаваторов" },
        { id: 36, title: "Поставщики кранов" }
      ],
      slug: "14-sany-kazakhstan",
      is_official: true,
      created_at: "2025-04-15T10:30:45.000000Z"
    },
    {
      id: 15,
      name: "TOO \"BAKAS-L SERVICE\"",
      avatar: "https://via.placeholder.com/80x80/004080/white?text=BLS",
      rating: 3.9,
      city: {
        id: 1,
        title: "Алматы",
        is_popular: true
      },
      specializations: [
        { id: 37, title: "Металлоконструкции для спецтехники" },
        { id: 38, title: "Поставщики кабин и аксессуаров" }
      ],
      slug: "15-too-bakas-l-service",
      is_official: false,
      created_at: "2025-04-18T14:45:30.000000Z"
    }
  ]
};

// Pagination component
const MAX_VISIBLE_PAGES = 5;
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    const pages = [];
    const halfVisible = Math.floor(MAX_VISIBLE_PAGES / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);
    
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
    <Center py={8} mb={4}>
      <HStack spacing={2}>
        <Button
          onClick={() => onPageChange(1)}
          isDisabled={currentPage === 1}
          size="md"
          variant="ghost"
          color="orange.50"
          _hover={{ bg: 'yellow.50' }}
        >
          «
        </Button>
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
          size="md"
          variant="ghost"
          color="orange.50"
          _hover={{ bg: 'yellow.50' }}
        >
          ‹
        </Button>
        
        {visiblePages[0] > 1 && (
          <>
            <Button
              onClick={() => onPageChange(1)}
              size="md"
              variant="ghost"
              color="orange.50"
              _hover={{ bg: 'yellow.50' }}
            >
              1
            </Button>
            {visiblePages[0] > 2 && (
              <Text color="gray.500" px={2}>...</Text>
            )}
          </>
        )}
        
        {visiblePages.map((pageNum) => (
          <Button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            size="md"
            bg={currentPage === pageNum ? "orange.50" : "transparent"}
            color={currentPage === pageNum ? "black" : "inherit"}
            _hover={{ 
              bg: currentPage === pageNum ? "#e6c200" : "orange.50" 
            }}
            _active={{ 
              bg: currentPage === pageNum ? "#d4b800" : "yellow.100" 
            }}
          >
            {pageNum}
          </Button>
        ))}
        
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <Text color="gray.500" px={2}>...</Text>
            )}
            <Button
              onClick={() => onPageChange(totalPages)}
              size="md"
              variant="ghost"
              color="orange.50"
              _hover={{ bg: 'yellow.50' }}
            >
              {totalPages}
            </Button>
          </>
        )}
        
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
          size="md"
          variant="ghost"
          color="orange.50"
          _hover={{ bg: 'yellow.50' }}
        >
          ›
        </Button>
        <Button
          onClick={() => onPageChange(totalPages)}
          isDisabled={currentPage === totalPages}
          size="md"
          variant="ghost"
          color="orange.50"
          _hover={{ bg: 'yellow.50' }}
        >
          »
        </Button>
      </HStack>
    </Center>
  );
};

// Enhanced Company Card Component
function CompanyCard({ company, onView, t }) {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const shadowColor = useColorModeValue('lg', 'dark-lg');
  
  const handleCardClick = () => {
    onView(company.id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box
      bg={cardBg}
      as='a'
      href={`about-company/${company.slug}`}
      border="1px"
      borderColor={borderColor}
      borderRadius="xl"
      boxShadow={shadowColor}
      p={6}
      _hover={{ transform: 'scale(1.03)', transition: 'transform 0.2s' }}
      cursor="pointer"
      onClick={handleCardClick}
      position="relative"
    >
      <Flex align="center" mb={4}>
        <Avatar src={company.avatar} size="md" mr={4} />
        <VStack align="start" spacing={1} flex="1">
          <Heading size="sm" fontWeight="semibold" lineHeight="1.2">
            {company.name}
          </Heading>
          <HStack>
            <Icon as={Star} color="yellow.400" boxSize={4} />
            <Text fontSize="sm" color="gray.600">
              {company.rating} {t("partners.rating", "Рейтинг")}
            </Text>
          </HStack>
        </VStack>
        <Tooltip label={t("partners.detail", "Подробнее")} placement="right">
          <IconButton
            aria-label={t("partners.view_company", "Просмотр компании")}
            icon={<ExternalLink />}
            size="sm"
            colorScheme="orange"
            onClick={(e) => {
              e.stopPropagation();
              onView(company.id);
            }}
          />
        </Tooltip>
      </Flex>

      <Stack direction="row" wrap="wrap" gap={2} mb={3}>
        {company.specializations.slice(0, 3).map((spec) => (
          <Tag size="sm" key={spec.id} borderRadius="full" colorScheme="gray">
            <TagLabel>{spec.title}</TagLabel>
          </Tag>
        ))}
        {company.specializations.length > 3 && (
          <Tag
            size="sm"
            borderRadius="full"
            colorScheme="gray"
            bg="gray.200"
            fontWeight={'600'}
            color="gray.700"
          >
            <TagLabel>+{company.specializations.length - 3}</TagLabel>
          </Tag>
        )}
      </Stack>

      <Flex justify="space-between" flexDir={{base: 'column', md: 'row'}} align="left" gap={2}>
        <Text fontSize="xs" color="gray.500">
          {t("adsfilterblock.category_label_city", "Город")}: {company.city.title}
        </Text>
        <Text fontSize="xs" color="gray.500">
          {t("partners.date_of_release", "Дата регистрации:")} {formatDate(company.created_at)}
        </Text>
      </Flex>

      {company.is_official && (
        <Badge
          position="absolute"
          top={3}
          right={3}
          bg="linear-gradient(135deg, #ff6b6b 0%, #ffa53b 100%)"
          variant="solid"
          fontSize="10px"
          zIndex={1}
          borderRadius={'full'}
          color="white"
        >
          {t("partners.official", "Официальный")}
        </Badge>
      )}
    </Box>
  );
}

// Empty State Component
function EmptyState({ t }) {
  return (
    <Center py={16}>
      <VStack spacing={4}>
        <Icon as={Search} boxSize={12} color="gray.400" />
        <Heading size="md" color="gray.500">
          {t("partners.no_data", "Ничего не найдено")}
        </Heading>
        <Text color="gray.400" textAlign="center" maxW="300px">
          {t("partners.no_data_msg", "Попробуйте изменить параметры поиска или сбросить фильтры")}
        </Text>
      </VStack>
    </Center>
  );
}

// Main Directory Component
const CompanyDirectory = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    city: '',
    specialization: '',
    isOfficial: '',
    search: ''
  });

  const { t } = useTranslation();

  const { isOpen: isFiltersOpen, onToggle: onFiltersToggle } = useDisclosure({ defaultIsOpen: false });

  const itemsPerPage = 3;
  const toast = useToast();
  
  const sidebarBg = useColorModeValue('white', 'gray.800');
  const isMobile = useBreakpointValue({ base: true, lg: false });

  // Unique values for filters
  const cities = [...new Set(mockCompanies.data.map(c => c.city.title))];
  const specializations = [
    ...new Set(
      mockCompanies.data.flatMap(c => 
        c.specializations.map(s => s.title)
      )
    )
  ].slice(0, 10); // Limit for demo

  useEffect(() => {
    loadCompanies();
  }, [currentPage, filters]);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filtered = mockCompanies.data;
      
      // Apply filters
      if (filters.city) {
        filtered = filtered.filter(c => c.city.title === filters.city);
      }
      
      if (filters.specialization) {
        filtered = filtered.filter(c => 
          c.specializations.some(s => s.title.includes(filters.specialization))
        );
      }
      
      if (filters.isOfficial) {
        filtered = filtered.filter(c => 
          filters.isOfficial === 'true' ? c.is_official : !c.is_official
        );
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(c =>
          c.name.toLowerCase().includes(searchLower) ||
          c.specializations.some(s => s.title.toLowerCase().includes(searchLower))
        );
      }

      setFilteredCompanies(filtered);
      setTotalPages(Math.ceil(filtered.length / itemsPerPage));
      
      // Paginate
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setCompanies(filtered.slice(startIndex, endIndex));
      
    } catch (error) {
      toast({
        title: t("partners.error_download", 'Ошибка загрузки'),
        description: t("partners.error_download_desc", 'Не удалось загрузить список компаний'),
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({
      city: '',
      specialization: '',
      isOfficial: '',
      search: ''
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompanyView = async () => {
    try {
      toast({
        title: t("partners.opening_profile", 'Открытие профиля'),
        description: t("partners.opens_profile", 'Открывается профиль компании...'),
        status: 'loading',
        duration: 2000,
        isClosable: true
      });
    } catch (error) {
      console.error('Error incrementing view:', error);
    }
  };

  const FilterContent = () => (
    <VStack spacing={6} align="stretch">
      <Box>
        <Text fontWeight="semibold" mb={3} fontSize="sm">
          {t("partners.search_by_name", "Поиск по названию")}
        </Text>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Search size={16} color="#A0AEC0" />
          </InputLeftElement>
          <Input
            placeholder={t("partners.type_name", "Введите название...")}
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            size="md"
          />
        </InputGroup>
      </Box>

      <Box>
        <Text fontWeight="semibold" mb={3} fontSize="sm">
          {t("adsfilterblock.category_label_city", "Город")}
        </Text>
        <Select 
          placeholder={t("partners.all_city", "Все города")}
          value={filters.city}
          onChange={(e) => handleFilterChange('city', e.target.value)}
          size="md"
          focusBorderColor="orange.50"
        >
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </Select>
      </Box>

      <Box>
        <Text fontWeight="semibold" mb={3} fontSize="sm">
          {t("partners.specilization", "Специализация")}
        </Text>
        <Select 
          placeholder={t("partners.all_specilization", "Все специализации")}
          value={filters.specialization}
          onChange={(e) => handleFilterChange('specialization', e.target.value)}
          size="md"
          focusBorderColor="orange.50"
        >
          {specializations.map(spec => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </Select>
      </Box>

      <Box>
        <Text fontWeight="semibold" mb={3} fontSize="sm">
          {t("partners.type_of_company", "Тип компании")}
        </Text>
        <Select 
          placeholder={t("partners.all_type", "Все типы")}
          value={filters.isOfficial}
          onChange={(e) => handleFilterChange('isOfficial', e.target.value)}
          size="md"
          focusBorderColor="orange.50"
        >
          <option value="true">{t("partners.official", "Официальные")}</option>
          <option value="false">{t("partners.no_offical", "Неофициальный")}</option>
        </Select>
      </Box>

      <HStack spacing={3}>
        <Button 
          variant="outline"
          colorScheme="gray"
          size="md"
          onClick={handleReset}
          fontWeight={500}
          flex={1}
        >
          {t("partners.reset", "Очистить")}
        </Button>
        <Button 
          bg="orange.50"
          color="black"
          size="md"
          fontWeight={500}
          onClick={loadCompanies}
          flex={1}
          _hover={{ bg: '#e6c200' }}
          _active={{ bg: '#d4b800' }}
        >
          {t("partners.search", "Найти")}
        </Button>
      </HStack>
    </VStack>
  );

  return (
    <Box minH="100vh" mt={7} pb={{ base: "60px", lg: "20px" }}>
      <Flex gap={8} direction={{ base: 'column', lg: 'row' }}>
        {/* Filters Sidebar */}
        <Box display={'flex'} flexDirection={'column'} gap={5}>
          <Box 
            w={{ base: '100%', lg: '300px' }} 
            bg={sidebarBg} 
            borderRadius="xl" 
            h="fit-content"
            boxShadow="md"
            border="1px"
            borderColor={useColorModeValue('gray.200', 'gray.600')}
            position={{ base: 'relative', lg: 'sticky' }}
            top={{ base: 'auto', lg: '2rem' }}
            zIndex={10}
          >
            {/* Mobile Filter Toggle */}
            {isMobile && (
              <Button
                onClick={onFiltersToggle}
                w="100%"
                justifyContent="space-between"
                bg="orange.50"
                color="black"
                _hover={{ bg: '#e6c200' }}
                borderRadius="xl"
                p={4}
                mb={isFiltersOpen ? 4 : 0}
                rightIcon={isFiltersOpen ? <ChevronUp /> : <ChevronDown />}
                leftIcon={<Filter />}
              >
                {t("partners.filter_search", "Фильтры поиска")}
              </Button>
            )}

            {/* Desktop Filter Header */}
            {!isMobile && (
              <Box p={6} pb={0}>
                <Heading size="md" color="p.black">
                {t("partners.filter_search", "Фильтры поиска")}
                </Heading>
              </Box>
            )}

            {/* Filter Content */}
            {!isMobile ? (
              <Box p={6}>
                <FilterContent />
              </Box>
            ) : (
              <Collapse in={isFiltersOpen} animateOpacity>
                <Box p={6}>
                  <FilterContent />
                </Box>
              </Collapse>
            )}
          </Box>

          <PromoBlock />
        </Box>

        {/* Main Content */}
        <Box flex="1" minH={{ base: "calc(100vh - 200px)", lg: "auto" }}>
          <Container maxW="container.xl" p={0}>
            <Flex justify="space-between" align="center" mb={5}>
              <Heading as="h1" size="lg" color="p.black">
                {t("partners.list_of_company", "Каталог компаний")}
              </Heading>
              {loading ? (
                <Spinner size="md" color="orange.50" />
              ) : (
                <Text color="gray.600">
                  {t("partners.all_company", "Всего компаний:")} {filteredCompanies.length}
                </Text>
              )}
            </Flex>

            {loading ? (
              <Center py={10}>
                <Spinner size="xl" color="orange.50" />
              </Center>
            ) : companies.length === 0 ? (
              <EmptyState t={t} />
            ) : (
              <>
                <Grid 
                  templateColumns={{ 
                    base: '1fr', 
                    md: 'repeat(auto-fit, minmax(320px, 1fr))',
                    lg: 'repeat(auto-fit, minmax(350px, 1fr))'
                  }} 
                  gap={6}
                  mb={8}
                >
                  {companies.map((company) => (
                    <CompanyCard key={company.id} company={company} onView={handleCompanyView} t={t} />
                  ))}
                </Grid>

                {/* Pagination - always show if there's more than 1 page */}
                {totalPages > 1 && (
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={handlePageChange} 
                  />
                )}
              </>
            )}
          </Container>
        </Box>
      </Flex>
    </Box>
  );
};

export default CompanyDirectory;