import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Image,
  Input,
  Select,
  Badge,
  Card,
  CardBody,
  IconButton,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Heading,
  useBreakpointValue,
  Stack,
  useDisclosure,
  Collapse
} from '@chakra-ui/react';
import {
  FiPhone,
  FiX,
  FiChevronRight,
  FiFilter,
  FiSearch,
  FiMessageCircle,
} from 'react-icons/fi';
import { CompanyInfoContent } from './CompanyInfoContent';
import { Pagination } from './Pagination';
import { ProductCard } from './ProductCard';
import { NewsContent } from './NewsContent';
import { OrdersContent } from './OrdersContent';
import { DocumentsContent } from './DocumentsContent';
import { useTranslation } from 'react-i18next';
import CompanyBreadcrumb from './CompanyBreadcrumb';
import ContactBottomModal from '../HotOfferDetail/ContactBottomModal';
import { CallbackModal } from '../../components/CallbackModal';
import { useAuth } from '../Auth/logic/AuthContext';
import { useNavigate } from 'react-router-dom';

// Mock data
const mockProducts = [
  {
    id: 1,
    title: 'Втулка в переднюю подвеску CAT 320D',
    price: '15 300 ₸',
    originalPrice: '18 000 ₸',
    location: 'г. Шымкент',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop',
    imageCount: 3,
    category: 'parts',
    isNew: true,
    discount: 15,
    views: 234,
    rating: 4.8
  },
  {
    id: 2,
    title: 'FA16211M-FA819S Фильтр воздушный двигателя',
    price: '12 240 ₸',
    location: 'г. Шымкент',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=400&fit=crop',
    imageCount: 4,
    category: 'parts',
    inStock: true,
    views: 156,
    rating: 4.9
  },
  {
    id: 3,
    title: 'Втулка в рукоять (соединение с цилиндром)',
    price: '7 650 ₸',
    location: 'г. Шымкент',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    imageCount: 3,
    category: 'parts',
    views: 89,
    rating: 4.7
  },
  {
    id: 4,
    title: 'Ремень поликлиновой Caterpillar 3306',
    price: '15 300 ₸',
    location: 'г. Шымкент',
    image: 'https://images.unsplash.com/photo-1609145395756-9825b5bf3b9e?w=400&h=400&fit=crop',
    imageCount: 1,
    category: 'parts',
    isFeatured: true,
    views: 312,
    rating: 5.0
  },
  {
    id: 5,
    title: '41155015 275-5437 NUBA Гидронасос',
    price: '76 500 ₸',
    location: 'г. Шымкент',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=400&fit=crop',
    imageCount: 3,
    category: 'parts',
    views: 445,
    rating: 4.6
  },
  {
    id: 6,
    title: 'МАСЛЯНЫЙ НАСОС JOHN DEERE 6068',
    price: '153 000 ₸',
    location: 'г. Шымкент',
    image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=400&fit=crop',
    imageCount: 4,
    category: 'parts',
    views: 567,
    rating: 4.8
  },
  {
    id: 7,
    title: 'Диски тормозные передние Komatsu PC200',
    price: '127 500 ₸',
    originalPrice: '135 000 ₸',
    location: 'г. Шымкент',
    image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=400&fit=crop',
    imageCount: 7,
    category: 'parts',
    discount: 6,
    views: 298,
    rating: 4.9
  },
  {
    id: 8,
    title: 'Е901/3000 Крышка гидробака JCB',
    price: '10 200 ₸',
    location: 'г. Шымкент',
    image: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400&h=400&fit=crop',
    imageCount: 1,
    category: 'parts',
    views: 123,
    rating: 4.5
  }
];


// Mock data for companies
const mockCompanies = {
  data: [
    {
      id: 2,
      name: "TOO MAGSERVICE PARTS",
      avatar: "https://via.placeholder.com/80x80/ff8000/white?text=MAG",
      rating: 4.5,
      phones: [
          "200059890"
      ],
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
      phones: [
          "200059890"
      ],
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
      phones: [
          "200059890"
      ],
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
      phones: [
          "200059890"
      ],
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
      phones: [
          "200059890"
      ],
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
      phones: [
          "200059890"
      ],
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

// Main Component
const PartsMarketplace = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    city: '',
    priceFrom: '',
    priceTo: '',
    search: ''
  });

  const { isOpen: isOpenContactBtn, onOpen: onOpenBtn, onClose: onCloseBtn } = useDisclosure();
  const { isOpen: isCallbackOpen, onClose: onCallbackClose, onOpen: onCallbackOpen } = useDisclosure();

  const [ type, setType ] = useState('phone');

  const itemsPerPage = 10;
  const { isOpen: isfilterbtn, onToggle: onToggleFilter } = useDisclosure();
  // Xavfsiz totalPages hisoblash
  const totalPages = Math.ceil((products.length || 0) / itemsPerPage);
  

  const gridColumns = useBreakpointValue({ 
    base: 1, 
    sm: 2, 
    md: 3,
    lg: 4
  });

  // Simulate API loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      // mockProducts mavjudligini tekshirish
      if (mockProducts && Array.isArray(mockProducts)) {
        // ID larni noyob qilish
        const uniqueProducts = mockProducts.map((product, index) => ({
          ...product,
          id: product.id || `product-${index + 1}`, // Agar ID yo'q bo'lsa, yaratish
          uniqueKey: `${product.id || index}-${Date.now()}` // Qo'shimcha noyob key
        }));
        
        // Takrorlanuvchi ID larni tekshirish va tuzatish
        const seenIds = new Set();
        const correctedProducts = uniqueProducts.map((product, index) => {
          let finalId = product.id;
          let counter = 1;
          
          // Agar ID takrorlangan bo'lsa, yangi ID yaratish
          while (seenIds.has(finalId)) {
            finalId = `${product.id}-${counter}`;
            counter++;
          }
          
          seenIds.add(finalId);
          
          return {
            ...product,
            id: finalId,
            uniqueKey: `product-${finalId}-${index}`
          };
        });
        
        setProducts(correctedProducts);
      } else {
        // Agar mockProducts mavjud bo'lmasa, bo'sh massiv
        setProducts([]);
      }
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [currentPage, filters]);

  const clearFilters = () => {
    setFilters({
      category: '',
      city: '',
      priceFrom: '',
      priceTo: '',
      search: ''
    });
  };

  // Xavfsiz pagination uchun current page tekshirish
  const safePagination = Math.max(1, Math.min(currentPage, totalPages || 1));

  // Phone call function
  const handleCallPhone = () => {
    setType('phone');
    onOpenBtn();
  };

  // Message function
  const handleSendMessage = () => {
    if (!isAuthenticated) {
      navigate('/auth/login', { replace: true })
      return
    }
    onCallbackOpen();
  };

  return (
    <Box minH="100%">
      <Box maxW="100%" py={5}>
        {/* Modern Header */}
        <Box mb={10}>
          {/*  Breadcrumb Component */}
          <CompanyBreadcrumb t={t} title={mockCompanies.data[0].name} />

          {/* Company Header */}
          <Flex 
            direction={{ base: 'column', custom900: 'row' }} 
            align={'center'}
            justify="space-between"
            gap={6}
            mb={8}
          >
            <Flex flexDir={{base: "column", custom400: "row"}} align="center" gap={6}>
                <Image
                  src="https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400&h=400&fit=crop"
                  alt="Company Logo"
                  borderRadius="lg"
                  w={{base: "320px", custom400: '150px'}}
                  flexShrink={0}
                  boxShadow="lg"
                />
              <Box>
                <Heading size="xl" color="gray.800" fontWeight="black">
                  {mockCompanies.data[0].name}    {/* // title */}
                </Heading>
                <Text color="gray.600" fontSize="lg" mt={1}>
                  Двигатели и запчасти для спецтехники  {/* description */}
                </Text>
                <Stack display={'flex'} flexDir={{base: "column", custom570: 'row'}} mt={3} spacing={4}>
                  <Badge textAlign={'center'} colorScheme="green" px={3} py={1} borderRadius="full">
                    Проверенный поставщик      {/* // verified */}
                  </Badge>
                </Stack>
              </Box>
            </Flex>
            
            <Stack display={'flex'} flexDir={{base: "row", custom900: 'column'}} spacing={3} align="stretch" minW="200px">
              <Button
                colorScheme="blue"
                size="md"
                leftIcon={<FiPhone />}
                borderRadius="xl"
                border={"1px"}
                borderColor={"blue.400"}
                bg="blue.400"
                _hover={{ bg: 'blue.1', color: "blue.400", transform: 'translateY(-2px)' }}
                transition="all 0.3s"
                boxShadow="lg"
                onClick={handleCallPhone}
              >
                {t("productcard.show_phone", "Связаться")}
              </Button>
              <Button
                variant="outline"
                size="md"
                leftIcon={<FiMessageCircle />}
                borderRadius="xl"
                borderColor="gray.300"
                color={'blue.400'}
                _hover={{ 
                  bg: 'blue.50',
                  borderColor: 'blue.400', 
                  color: 'blue.400',
                  transform: 'translateY(-2px)'
                }}
                transition="all 0.3s"
                onClick={handleSendMessage}
              >
                {t("partsmarketplace.message", "Написать")}
              </Button>
            </Stack>
          </Flex>
        </Box>

        {/* Navigation Tabs */}
          <Tabs variant="enclosed" colorScheme="blue" mb={8}>
            <TabList 
              border="none" 
              bg="white" 
              borderRadius="2xl" 
              p={2}
              boxShadow="lg"
              overflowX="auto"
              css={{
                '&::-webkit-scrollbar': {
            display: 'none',
                },
              }}
            >
              <Tab 
                borderRadius="xl" 
                fontWeight="semibold"
                _selected={{ 
                  bg: 'blue.400', 
                  color: 'white',
                  boxShadow: 'md',
                  _hover: {
                    boxShadow: "sm",
                    bg: 'blue.50',
                    color: 'p.black'
                  }
                }}
                _hover={{ bg: 'blue.50' }}
                transition="all 0.3s"
                minW="fit-content"
              >
                {t("partsmarketplace.goods", "Товары")} ({products.length || 0})
              </Tab>
              <Tab 
                borderRadius="xl" 
                fontWeight="semibold"
                _selected={{ 
                  bg: 'blue.400', 
                  color: 'white',
                  boxShadow: 'md',
                  _hover: {
                    boxShadow: "sm",
                    bg: 'blue.50',
                    color: 'p.black'
                  }
                }}
                _hover={{ bg: 'blue.50' }}
                transition="all 0.3s"
                minW="fit-content"
              >
                {t("side_nav.orders", "Заказы")}
              </Tab>
              <Tab 
                borderRadius="xl" 
                fontWeight="semibold"
                _selected={{ 
                  bg: 'blue.400', 
                  color: 'white',
                  boxShadow: 'md',
                  _hover: {
                    boxShadow: "sm",
                    bg: 'blue.50',
                    color: 'p.black'
                  }
                }}
                _hover={{ bg: 'blue.50' }}
                transition="all 0.3s"
                minW="fit-content"
              >
                {t("partsmarketplace.about_company", "О компании")}
              </Tab>
              <Tab 
                borderRadius="xl" 
                fontWeight="semibold"
                _selected={{ 
                  bg: 'blue.400', 
                  color: 'white',
                  boxShadow: 'md',
                  _hover: {
                    boxShadow: "sm",
                    bg: 'blue.50',
                    color: 'p.black'
                  }
                }}
                _hover={{ bg: 'blue.50' }}
                transition="all 0.3s"
                minW="fit-content"
              >
                {t("categories.news", "Новости")}
              </Tab>
              <Tab 
                borderRadius="xl" 
                fontWeight="semibold"
                _selected={{ 
                  bg: 'blue.400', 
                  color: 'white',
                  boxShadow: 'md',
                  _hover: {
                    boxShadow: "sm",
                    bg: 'blue.50',
                    color: 'p.black'
                  }
                }}
                _hover={{ bg: 'blue.50' }}
                transition="all 0.3s"
                minW="fit-content"
              >
                {t("footer.document", "Документы")}
              </Tab>
            </TabList>

            <TabPanels>
              {/* Products Tab */}
            <TabPanel px={0} py={6}>
              {/* Filters */}
                  <Box 
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    spacing={2} 
                    bg="white" 
                    p={3} 
                    borderRadius="2xl" 
                    boxShadow="lg"
                    border="1px"
                    borderColor="gray.100"
                    px={8}
                    mb={3}
                    onClick={onToggleFilter}
                  >
                    <Text
                      color={'p.black'}
                      fontSize={'18px'}
                      fontWeight={'normal'}
                    >
                      {t("adsfilterblock.filter", "Фильтры")}
                    </Text>
                    <IconButton
                      icon={<FiFilter />}
                      color={'p.black'}
                      bg={'white'}
                      border={'1px'}
                      borderColor={'gray.300'}
                      _hover={
                        {
                          bg: 'gray.50',
                        }
                      }
                      borderRadius="xl"
                    />
                  </Box>

                  <Collapse in={isfilterbtn} animateOpacity>
                    <Card mb={10} borderRadius="2xl" border="1px" borderColor="gray.100" boxShadow="lg">
                      <CardBody p={6}>
                        <Stack spacing={4}>
                          {/* Search and Price Range */}
                          <Stack 
                            direction={{ base: 'column', md: 'row' }} 
                            spacing={4}
                            width="full"
                          >
                            {/* Search Input */}
                            <InputGroup flex={1}>
                              <InputLeftElement pointerEvents="none">
                                <FiSearch color="gray.400" />
                              </InputLeftElement>
                              <Input
                                placeholder={t("partsmarketplace.search_placeholder", "Поиск по товарам...")}
                                value={filters.search}
                                onChange={(e) => setFilters({...filters, search: e.target.value})}
                                borderColor="gray.200"
                                borderRadius="xl"
                                _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px #4299e1' }}
                                bg="white"
                              />
                            </InputGroup>

                            {/* Price Range Inputs */}
                            <Stack direction="row" spacing={2} minW={{ base: 'full', md: '250px' }}>
                              <Input
                                placeholder={t("partsmarketplace.price_placeholder_from", "Цена от")}
                                type="number"
                                value={filters.priceFrom}
                                onChange={(e) => setFilters({...filters, priceFrom: e.target.value})}
                                borderColor="gray.200"
                                borderRadius="xl"
                                _focus={{ borderColor: 'blue.400' }}
                                bg="white"
                              />
                              <Input
                                placeholder={t("partsmarketplace.price_placeholder_to", "до")}
                                type="number"
                                value={filters.priceTo}
                                onChange={(e) => setFilters({...filters, priceTo: e.target.value})}
                                borderColor="gray.200"
                                borderRadius="xl"
                                _focus={{ borderColor: 'blue.400' }}
                                bg="white"
                              />
                            </Stack>
                          </Stack>

                          {/* Category, City and Clear Filters */}
                          <Stack 
                            direction={{ base: 'column', md: 'row' }} 
                            spacing={4}
                            align="stretch"
                          >
                            <Select
                              placeholder={t("partsmarketplace.category", "Категория")}
                              value={filters.category}
                              onChange={(e) => setFilters({...filters, category: e.target.value})}
                              borderColor="gray.200"
                              borderRadius="xl"
                              _focus={{ borderColor: 'blue.400' }}
                              bg="white"
                              flex={1}
                            >
                              <option value="parts">{t("partsmarketplace.spare_parts", "Запчасти")}</option>
                              <option value="engines">{t("partsmarketplace.dvigatel", "Двигатели")}</option>
                              <option value="hydraulics">{t("partsmarketplace.gidravlika", "Гидравлика")}</option>
                            </Select>
                            
                            <Select
                              placeholder={t("adsfilterblock.category_label_city", "Город")}
                              value={filters.city}
                              onChange={(e) => setFilters({...filters, city: e.target.value})}
                              borderColor="gray.200"
                              borderRadius="xl"
                              _focus={{ borderColor: 'blue.400' }}
                              bg="white"
                              flex={1}
                            >
                              <option value="shymkent">Шымкент</option>
                              <option value="almaty">Алматы</option>
                              <option value="astana">Астана</option>
                            </Select>
                            
                            <Button
                              leftIcon={<FiX />}
                              onClick={clearFilters}
                              variant="ghost"
                              color={'blue.400'}
                              borderRadius="xl"
                              _hover={{ bg: 'gray.100' }}
                              minW={{ base: 'full', md: '120px' }}
                            >
                              {t("partners.reset", "Очистить")}
                            </Button>
                          </Stack>
                        </Stack>
                      </CardBody>
                    </Card>
                  </Collapse>
              {/* Products Grid */}
              <SimpleGrid columns={gridColumns} spacing={6} mb={8}>
                {isLoading
                  ? Array.from({ length: itemsPerPage }, (_, i) => (
                      <ProductCard key={`loading-skeleton-${i}`} isLoading={true} />
                    ))
                  : products && products.length > 0 
                    ? products.map((product, index) => (
                        <ProductCard 
                          key={product.uniqueKey || `product-${product.id || index}`} 
                          product={product} 
                        />
                      ))
                    : (
                        <Box gridColumn="1 / -1" textAlign="center" py={8}>
                          <Text color="gray.500" fontSize="lg">
                            {t("orderlist.no_data", "Товары не найдены")}
                          </Text>
                        </Box>
                      )
                }
              </SimpleGrid>

              {/* Pagination - faqat mahsulotlar mavjud bo'lganda ko'rsatish */}
              {!isLoading && products.length > 0 && totalPages > 1 && (
                <Pagination
                  currentPage={safePagination}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </TabPanel>

            {/* Other Tabs */}
            <TabPanel px={0} py={6}>
              <OrdersContent onToggleFilter={onToggleFilter} isfilterbtn={isfilterbtn} filters={filters} setFilters={setFilters} clearFilters={clearFilters} />
            </TabPanel>
            
            <TabPanel px={0} py={6}>
              <CompanyInfoContent />
            </TabPanel>
            
            <TabPanel px={0} py={6}>
              <NewsContent />
            </TabPanel>
            
            <TabPanel px={0} py={6}>
              <DocumentsContent />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <ContactBottomModal isOpen={isOpenContactBtn} onClose={onCloseBtn} type={type} text={`+998${mockCompanies.data[0].phones[0]}`}/>
      <CallbackModal isOpen={isCallbackOpen} onClose={onCallbackClose} onSubmit={async (data) => {
        // ============================= Kod shu yerda boladi                         ====================================================================
        console.log("Leeds ga yuboradigan api joyi", data)
        
        }} />
    </Box>
  );
};

export default PartsMarketplace;