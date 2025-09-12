import React, { useState } from 'react';
import {
  Box,
  Container,
  Flex,
  VStack,
  Text,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  useBreakpointValue,
  useToast,
} from '@chakra-ui/react';
import {
  FiLoader,
} from 'react-icons/fi';
import SimpleProductCard from './SimpleProductCard';
import Pagination from './UserPagination';
import ProfileCard from './ProfileCard';
import { OrderCardList } from './OrderCardList'
import FilterSection from './FilterSection';
import { useTranslation } from 'react-i18next';

// MOCK DATA based on your provided structure
const MOCK_USER = {
  id: 28099,
  name: 'Gaybullayev Jorabek Alisher ogli',
  avatar: 'https://dev.gservice-co.kz/api-assets/no_avatar.png',
  phone: '200059890',
  joinDate: '5 дней на UZMAT.uz',
  is_company: false,
  is_official: false,
};

const MOCK_ADS = [
  {
    id: 10812,
    author: {
      id: 28099,
      name: "Gaybullayev Jorabek Alisher ogli",
      avatar: "https://dev.gservice-co.kz/api-assets/no_avatar.png",
      is_company: false,
      joinDate: '5 дней на UZMAT.uz',
      is_official: false
    },
    category: {
      id: 1,
      title: "Продажа спецтехники",
      icon: "https://dev.gservice-co.kz/api-assets/category_icon/basket.svg"
    },
    title: "java FG10-15",
    sub_title: "1280 Экскаваторы-погрузчики",
    city: {
      id: 28,
      title: "Алматы",
      is_popular: true
    },
    prices: [
      {
        id: 7080,
        type: "price",
        price: 999999999,
        original_price: 999999999,
        currency: {
          id: 1,
          title: "KZT",
          in_tenge: 1,
          symbol: "₸"
        }
      }
    ],
    images: [
      {
        id: 30358,
        url: "https://dev.gservice-co.kz/storage/ad-images/24-05-2025/01JW0GKFFJJGR030WHBE3GREHR.webp"
      }
    ],
    slug: "10812-komatsu-fg10-15",
    phones: ["2131314141"],
    description: "uraaa Подача в день заказа",
    characteristics: [
      {
        characteristic: {
          id: 264,
          title: "Тип топлива"
        },
        values: {
          value: 512,
          title: "Дизель",
          measurement_unit: null
        }
      },
      {
        characteristic: {
          id: 266,
          title: "Год выпуска"
        },
        values: {
          value: 579,
          title: "2024",
          measurement_unit: "г."
        }
      }
    ],
    ad_package: null,
    rank_premium: false,
    rank_search: false,
    rank_hot_offer: false,
    stickers: [],
    status: "confirmed",
    is_favorite: false,
    statistics: {
      viewed: 38,
      write: 0,
      called: 0,
      favorite: 1,
      share: 2,
      clicked: 3,
      views: null
    },
    created_at: "2025-05-24T06:45:06.000000Z",
    likedBy: []
  }
];

// MOCK ORDERS DATA for the Заказы tab
const MOCK_ORDERS = [
  {
    id: 12452,
    author: {
      id: 28079,
      name: "Юра юркевичич",
      avatar: "https://dev.gservice-co.kz/api-assets/no_avatar.png",
      is_company: false,
      is_official: false
    },
    is_premium: true,
    category: {
      id: 2,
      title: "Аренда спецтехники",
      icon: "https://dev.gservice-co.kz/api-assets/category_icon/rent.svg"
    },
    title: "22222222222222222222 222222222222222222 222222222222222222222 22222222222222222222222222 222222222222222222222222 222222222222222222222 22222222222222222 Нужен водитель на вахту на автокран Урал 3 х мостовый",
    sub_title: "u hdweugfwefgygwefuywgu27 22222222222222222222222 2222222222222222222222 2222222222222222222 2333333333333333333333333 4444444444444444 5555555555555555",
    city: {
      id: 8,
      title: "Батькен",
      is_popular: true
    },
    prices: [
      {
        id: 8729,
        type: "negotiable",
        price: 100000,
        original_price: 0,
        currency: {
          id: 1,
          title: "KZT",
          in_tenge: 1,
          symbol: "₸"
        }
      }
    ],
    images: [],
    slug: "12452-ekskavatory-pogruzciki",
    phones: ["+7 707"],
    description: "Договорная",
    statistics: {
      viewed: 13,
      write: 0,
      called: 0,
      favorite: 0,
      share: 0,
      clicked: 2
    },
    created_at: "2025-05-31T01:50:00.000000Z"
  },
  {
    id: 12453,
    author: {
      id: 28080,
      name: "Александр Петров",
      avatar: "https://dev.gservice-co.kz/api-assets/no_avatar.png",
      is_company: true,
      is_official: true
    },
    is_premium: false,
    category: {
      id: 1,
      title: "Продажа спецтехники",
      icon: "https://dev.gservice-co.kz/api-assets/category_icon/basket.svg"
    },
    title: "Требуется экскаватор-погрузчик для строительных работ",
    sub_title: "Срочно нужен экскаватор-погрузчик в аренду на 2 недели",
    city: {
      id: 28,
      title: "Алматы",
      is_popular: true
    },
    prices: [
      {
        id: 8730,
        type: "price",
        price: 150000,
        original_price: 150000,
        currency: {
          id: 1,
          title: "KZT",
          in_tenge: 1,
          symbol: "₸"
        }
      }
    ],
    images: [],
    slug: "12453-trebuyetsya-ekskavator",
    phones: ["+7 701 234 56 78"],
    description: "Требуется для строительства коттеджа",
    statistics: {
      viewed: 25,
      write: 2,
      called: 1,
      favorite: 3,
      share: 1,
      clicked: 5
    },
    created_at: "2025-05-30T14:30:00.000000Z"
  }
];

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentOrderPage, setCurrentOrderPage] = useState(1);
  const [showPhone, setShowPhone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const toast = useToast();
  const { t } = useTranslation();

  const [filters, setFilters] = useState({
    category: '',
    city: '',
    priceFrom: '',
    priceTo: ''
  });

  const [orderFilters, setOrderFilters] = useState({
    category: '',
    city: '',
    priceFrom: '',
    priceTo: ''
  });

  const isMobile = useBreakpointValue({ base: true, lg: false });

  // Filter and paginate ads
  const filteredAds = MOCK_ADS.filter(ad => {
    let match = true;
    if (filters.category) match = match && ad.category.title === filters.category;
    if (filters.city) match = match && ad.city.title.includes(filters.city);
    if (Number(filters.priceFrom) && ad.prices.length > 0)
      match = match && ad.prices[0].price >= Number(filters.priceFrom);
    if (Number(filters.priceTo) && ad.prices.length > 0)
      match = match && ad.prices[0].price <= Number(filters.priceTo);
    return match;
  });

  // Filter and paginate orders
  const filteredOrders = MOCK_ORDERS.filter(order => {
    let match = true;
    if (orderFilters.category) match = match && order.category.title === orderFilters.category;
    if (orderFilters.city) match = match && order.city.title.includes(orderFilters.city);
    if (Number(orderFilters.priceFrom) && order.prices.length > 0)
      match = match && order.prices[0].price >= Number(orderFilters.priceFrom);
    if (Number(orderFilters.priceTo) && order.prices.length > 0)
      match = match && order.prices[0].price <= Number(orderFilters.priceTo);
    return match;
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredAds.length / itemsPerPage);
  const totalOrderPages = Math.ceil(filteredOrders.length / itemsPerPage);
  
  const shownAds = filteredAds.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const shownOrders = filteredOrders.slice(
    (currentOrderPage - 1) * itemsPerPage,
    currentOrderPage * itemsPerPage
  );

  // Share function
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: t('UserPage.linkCopied', "Ссылка скопирована!"),
        status: 'success',
        duration: 1700,
        isClosable: true,
      });
    } catch {
      toast({
        title: t('UserPage.linkCopyFailed', "Не удалось скопировать ссылку."),
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Clear filters for ads
  const clearFilters = () => {
    setFilters({
      category: '',
      city: '',
      priceFrom: '',
      priceTo: ''
    });
    setCurrentPage(1);
  };

  // Clear filters for orders
  const clearOrderFilters = () => {
    setOrderFilters({
      category: '',
      city: '',
      priceFrom: '',
      priceTo: ''
    });
    setCurrentOrderPage(1);
  };

  // Search function for ads
  const handleSearch = () => {
    setIsLoading(true);
    setCurrentPage(1);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: t('UserPage.searchCompleted', "Поиск выполнен"),
        description: t('UserPage.adsFound', "Найдено") + ` ${filteredAds.length} ` + t('UserPage.adsFound2', "объявлений"),
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    }, 1000);
  };

  // Search function for orders
  const handleOrderSearch = () => {
    setIsOrdersLoading(true);
    setCurrentOrderPage(1);
    // Simulate API call
    setTimeout(() => {
      setIsOrdersLoading(false);
      toast({
        title: t('UserPage.searchCompleted', "Поиск выполнен"),
        description: t('UserPage.ordersFound', "Найдено") + ` ${filteredOrders.length} ` + t('UserPage.ordersFound2', "заказов"),
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    }, 1000);
  };

  return (
    <Box minH="100vh" py={{ base: '100px', custom900: 7 }}>
      <Container maxW={'100%'} p={0}>
        <Flex
          direction={'row'}
          gap={8}
          align="flex-start"
        >
          {/* LEFT: Content */}
          <Box flex={1} minW={0} w={'100%'}>
            {isMobile && (
              <Box mb={4}>
                <ProfileCard
                  user={MOCK_USER}
                  onShare={handleShare}
                  showPhone={showPhone}
                  setShowPhone={setShowPhone}
                />
              </Box>
            )}
            <Tabs
              index={activeTab}
              onChange={setActiveTab}
              variant="unstyled"
              isFitted
            >
              <TabList
                shadow="sm"
                bg="white"
                borderTopRadius="lg"
                borderLeftWidth={"1px"}
                borderRightWidth={"1px"}
                borderTopWidth={"1px"}
                borderColor="gray.200"
                fontWeight="bold"
              >
                <Tab
                  flex={1}
                  fontSize={{ base: "sm", md: "md" }}
                  borderBottom={'2px solid transparent'}
                  h={'60px'}
                  _selected={{ bg: "#f4f4f4", fontWeight: "semibold", borderColor: "#fed500" }}
                  transition="all 0.2s"
                >
                  {t('UserPage.ads', "Объявления")} ({filteredAds.length})
                </Tab>
                <Tab
                  flex={1}
                  fontSize={{ base: "sm", md: "md" }}
                  borderBottom={'2px solid transparent'}
                  ml={2}
                  h={'60px'}
                  _selected={{ bg: "#f4f4f4", fontWeight: "semibold", borderColor: "#fed500" }}
                  transition="all 0.2s"
                >
                  {t('UserPage.orders', "Заказы")} ({filteredOrders.length})
                </Tab>
              </TabList>
              <TabPanels>

                {/* Объявления */}
                <TabPanel p={0}>
                  <FilterSection
                    filters={filters}
                    onChange={(field, value) => {
                      setFilters(prev => ({ ...prev, [field]: value }));
                      setCurrentPage(1);
                    }}
                    onClear={clearFilters}
                    onSearch={handleSearch}
                  />
                  <VStack spacing={0} align="stretch" w="100%">
                    {isLoading ? (
                      <Flex h="200px" align="center" justify="center" color="gray.400">
                        <FiLoader size={22} className="animate-spin" />
                        <Text ml={3}>{t('UserPage.loadingOrders', "Загрузка...")}</Text>
                      </Flex>
                    ) : shownAds.length > 0 ? (
                      shownAds.map(ad => <SimpleProductCard key={ad.id} product={ad} />)
                    ) : (
                      <Flex h="200px" align="center" justify="center" color="gray.400" flexDirection="column">
                        <Text fontSize="lg" fontWeight="medium">{t('UserPage.noAdsFound', "Нет объявлений по заданным фильтрам")}</Text>
                        <Text fontSize="sm" mt={2}>{t('UserPage.tryChangingFilters', "Попробуйте изменить параметры поиска")}</Text>
                      </Flex>
                    )}
                  </VStack>
                  {totalPages > 1 && !isLoading && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(page) => setCurrentPage(page)}
                    />
                  )}
                </TabPanel>

                {/* Заказы */}
                <TabPanel p={0}>
                  <FilterSection
                    filters={orderFilters}
                    onChange={(field, value) => {
                      setOrderFilters(prev => ({ ...prev, [field]: value }));
                      setCurrentOrderPage(1);
                    }}
                    onClear={clearOrderFilters}
                    onSearch={handleOrderSearch}
                  />
                  <VStack spacing={3} align="stretch" w="100%">
                    {isOrdersLoading ? (
                      <Flex h="200px" align="center" justify="center" color="gray.400">
                        <FiLoader size={22} className="animate-spin" />
                        <Text ml={3}>{t('UserPage.loadingOrders', "Загрузка заказов...")}</Text>
                      </Flex>
                    ) : shownOrders.length > 0 ? (
                      shownOrders.map(order => (
                        <OrderCardList key={order.id} product={order} />
                      ))
                    ) : (
                      <Box
                        bg="white"
                        borderBottomRadius="lg"
                        borderBottomWidth="1px"
                        borderLeftWidth="1px"
                        borderRightWidth="1px"
                        borderColor="gray.200"
                        p={{ base: 6, md: 10 }}
                        minH="200px"
                        boxShadow="sm"
                      >
                        <VStack spacing={5} w="full">
                          <Text fontSize={{ base: "md", md: "lg" }} color="gray.500" fontWeight="medium">
                            {t('UserPage.noOrdersFound', "Заказы не найдены")}
                          </Text>
                          <Text fontSize="sm" color="gray.400" textAlign="center">
                            {t('UserPage.tryChangingOrCreateNew', "Попробуйте изменить параметры поиска или создайте новый заказ")}
                          </Text>
                          <Button 
                            bg={'orange.50'}
                            color={'black'}
                            fontSize={{ base: "sm", md: "md" }}
                            _hover={{ bg: "orange.50" }}
                            variant="solid" 
                            fontWeight="bold" 
                            px={7}
                            as={"a"}
                            href='/applications/create'
                          >
                            {t('UserPage.createOrder', "Создать заказ")}
                          </Button>
                        </VStack>
                      </Box>
                    )}
                  </VStack>
                  {totalOrderPages > 1 && !isOrdersLoading && (
                    <Pagination
                      currentPage={currentOrderPage}
                      totalPages={totalOrderPages}
                      onPageChange={(page) => setCurrentOrderPage(page)}
                    />
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>

          {/* RIGHT: User card (desktop only, sticky) */}
          {!isMobile && (
            <Box w="360px" maxW="100vw" flexShrink={0} position="relative" top="0">
              <ProfileCard
                user={MOCK_USER}
                onShare={handleShare}
                showPhone={showPhone}
                setShowPhone={setShowPhone}
              />
            </Box>
          )}
        </Flex>
      </Container>
    </Box>
  );
}