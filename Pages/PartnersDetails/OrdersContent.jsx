import { Box, Button, Card, CardBody, Center, Collapse, Heading, IconButton, Input, InputGroup, InputLeftElement, Select, Stack, Text, VStack, Flex, HStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiFilter, FiSearch, FiTruck, FiX } from "react-icons/fi";
import { useState, useEffect } from "react";
import { ProductCardList } from "../../components/OrderList/ProductCardList";
import { Pagination } from "./Pagination"

// Mock data for orders/products (20 ta ko'p misollar uchun)
const mockOrdersData = [
  {
    id: 1,
    slug: "excavator-parts-2024",
    title: "Запчасти для экскаватора Caterpillar 320D",
    sub_title: "Оригинальные запчасти в отличном состоянии. Гарантия качества.",
    prices: [{ price: 250000, currency: { symbol: "сум" } }],
    phones: ["+998 90 123 45 67"],
    city: { title: "Ташкент" },
    author: { 
      name: "ТехСервис ООО", 
      is_company: true, 
      is_official: true,
      company_type: "ООО"
    },
    statistics: { viewed: 156 },
    created_at: "2024-12-15T10:30:00Z"
  },
  {
    id: 2,
    slug: "hydraulic-pump-komatsu",
    title: "Гидравлический насос Komatsu PC200-8",
    sub_title: "Восстановленный насос с гарантией 6 месяцев. Быстрая доставка.",
    prices: [{ price: 450000, currency: { symbol: "сум" } }],
    phones: ["+998 93 876 54 32"],
    city: { title: "Алматы" },
    author: { 
      name: "Иван Петров", 
      is_company: false, 
      is_official: false 
    },
    statistics: { viewed: 89 },
    created_at: "2024-12-10T14:20:00Z"
  },
  {
    id: 3,
    slug: "engine-parts-volvo",
    title: "Двигатель Volvo D6E для погрузчика",
    sub_title: "Капитально восстановленный двигатель. Полная диагностика проведена.",
    prices: [{ price: 0, currency: { symbol: "сум" } }], // Договорная цена
    phones: ["+998 97 555 11 22"],
    city: { title: "Шымкент" },
    author: { 
      name: "СпецТехника КЗ", 
      is_company: true, 
      is_official: true,
      company_type: "ТОО"
    },
    statistics: { viewed: 234 },
    created_at: "2024-12-08T09:15:00Z"
  },
  {
    id: 4,
    slug: "brake-pads-jcb",
    title: "Тормозные колодки JCB 3CX/4CX",
    sub_title: "Качественные тормозные колодки для экскаваторов-погрузчиков JCB.",
    prices: [{ price: 85000, currency: { symbol: "сум" } }],
    phones: ["+998 95 123 44 55"],
    city: { title: "Ташкент" },
    author: { 
      name: "Запчасти Плюс", 
      is_company: true, 
      is_official: false,
      company_type: "ИП"
    },
    statistics: { viewed: 67 },
    created_at: "2024-12-12T16:45:00Z"
  },
  {
    id: 5,
    slug: "transmission-case-ih",
    title: "Коробка передач Case IH Magnum 340",
    sub_title: "Восстановленная коробка передач для тракторов Case IH серии Magnum.",
    prices: [{ price: 1200000, currency: { symbol: "сум" } }],
    phones: ["+998 91 777 88 99"],
    city: { title: "Самарканд" },
    author: { 
      name: "АгроТехСервис", 
      is_company: true, 
      is_official: true,
      company_type: "ООО"
    },
    statistics: { viewed: 145 },
    created_at: "2024-12-05T11:20:00Z"
  },
  // Добавляем еще элементов для тестирования пагинации
  {
    id: 6,
    slug: "hydraulic-cylinder-hitachi",
    title: "Гидроцилиндр Hitachi ZX200-3",
    sub_title: "Новый гидроцилиндр рукояти для экскаваторов Hitachi.",
    prices: [{ price: 180000, currency: { symbol: "сум" } }],
    phones: ["+998 93 333 22 11"],
    city: { title: "Бухара" },
    author: { 
      name: "Анвар Каримов", 
      is_company: false, 
      is_official: false 
    },
    statistics: { viewed: 92 },
    created_at: "2024-12-07T08:30:00Z"
  },
  {
    id: 7,
    slug: "air-filter-john-deere",
    title: "Воздушный фильтр John Deere 6030",
    sub_title: "Оригинальный воздушный фильтр для тракторов John Deere серии 6030.",
    prices: [{ price: 45000, currency: { symbol: "сум" } }],
    phones: ["+998 94 555 66 77"],
    city: { title: "Наманган" },
    author: { 
      name: "Фильтры и Масла", 
      is_company: true, 
      is_official: false,
      company_type: "ИП"
    },
    statistics: { viewed: 134 },
    created_at: "2024-12-11T13:15:00Z"
  },
  {
    id: 8,
    slug: "radiator-new-holland",
    title: "Радиатор New Holland T7.245",
    sub_title: "Алюминиевый радиатор охлаждения для тракторов New Holland серии T7.",
    prices: [{ price: 320000, currency: { symbol: "сум" } }],
    phones: ["+998 90 888 99 00"],
    city: { title: "Фергана" },
    author: { 
      name: "КулингСервис", 
      is_company: true, 
      is_official: true,
      company_type: "ООО"
    },
    statistics: { viewed: 78 },
    created_at: "2024-12-09T15:40:00Z"
  },
  {
    id: 9,
    slug: "fuel-pump-massey-ferguson",
    title: "Топливный насос Massey Ferguson 8690",
    sub_title: "Высокого давления топливный насос для комбайнов Massey Ferguson.",
    prices: [{ price: 550000, currency: { symbol: "сум" } }],
    phones: ["+998 97 111 22 33"],
    city: { title: "Андижан" },
    author: { 
      name: "Дизель Мастер", 
      is_company: true, 
      is_official: false,
      company_type: "ИП"
    },
    statistics: { viewed: 167 },
    created_at: "2024-12-06T12:10:00Z"
  },
  {
    id: 10,
    slug: "starter-motor-deutz",
    title: "Стартер Deutz-Fahr Agrotron 6190",
    sub_title: "12В стартер для тракторов Deutz-Fahr серии Agrotron.",
    prices: [{ price: 125000, currency: { symbol: "сум" } }],
    phones: ["+998 95 444 55 66"],
    city: { title: "Ташкент" },
    author: { 
      name: "ЭлектроАвто", 
      is_company: true, 
      is_official: true,
      company_type: "ООО"
    },
    statistics: { viewed: 203 },
    created_at: "2024-12-13T09:25:00Z"
  },
  {
    id: 11,
    slug: "clutch-disc-fendt",
    title: "Диск сцепления Fendt 936 Vario",
    sub_title: "Усиленный диск сцепления для тракторов Fendt серии 900 Vario.",
    prices: [{ price: 95000, currency: { symbol: "сум" } }],
    phones: ["+998 91 222 33 44"],
    city: { title: "Карши" },
    author: { 
      name: "Сцепление Плюс", 
      is_company: false, 
      is_official: false 
    },
    statistics: { viewed: 115 },
    created_at: "2024-12-04T14:55:00Z"
  },
  {
    id: 12,
    slug: "alternator-claas",
    title: "Генератор Claas Lexion 770",
    sub_title: "24В генератор повышенной мощности для комбайнов Claas Lexion.",
    prices: [{ price: 210000, currency: { symbol: "сум" } }],
    phones: ["+998 93 777 88 99"],
    city: { title: "Джизак" },
    author: { 
      name: "АгроЭлектро", 
      is_company: true, 
      is_official: true,
      company_type: "ТОО"
    },
    statistics: { viewed: 89 },
    created_at: "2024-12-02T10:30:00Z"
  }
];

// Tab Content Components
export const OrdersContent = ({ onToggleFilter, isfilterbtn, filters, setFilters, clearFilters }) => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageOrders, setCurrentPageOrders] = useState([]);
  const itemsPerPage = 10;

  // API интеграция (пока в комментарии)
  useEffect(() => {
    // const fetchOrders = async () => {
    //   try {
    //     setIsLoading(true);
    //     const response = await fetch('/api/user/orders', {
    //       headers: {
    //         'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //         'Content-Type': 'application/json'
    //       }
    //     });
    //     const data = await response.json();
    //     if (data.success) {
    //       setOrders(data.orders);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching orders:', error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchOrders();

    // Mock data uchun
    setTimeout(() => {
      setOrders(mockOrdersData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = orders;

    // Search filter - поиск по названию и описанию
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      filtered = filtered.filter(order => 
        order.title.toLowerCase().includes(searchTerm) ||
        order.sub_title?.toLowerCase().includes(searchTerm) ||
        order.author?.name.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter - категория по ключевым словам в названии
    if (filters.category) {
      filtered = filtered.filter(order => {
        const title = order.title.toLowerCase();
        const subTitle = order.sub_title?.toLowerCase() || '';
        
        switch (filters.category) {
          case 'parts':
            return title.includes('запчаст') || title.includes('колодки') || 
                   title.includes('фильтр') || subTitle.includes('запчаст');
          case 'engines':
            return title.includes('двигатель') || title.includes('мотор') || 
                   title.includes('генератор') || title.includes('стартер');
          case 'hydraulics':
            return title.includes('гидравл') || title.includes('насос') || 
                   title.includes('гидроцилиндр') || subTitle.includes('гидравл');
          default:
            return true;
        }
      });
    }

    // City filter - фильтр по городу
    if (filters.city) {
      filtered = filtered.filter(order => {
        const cityTitle = order.city?.title.toLowerCase() || '';
        const filterCity = filters.city.toLowerCase();
        return cityTitle.includes(filterCity);
      });
    }

    // Price filter - фильтр по цене (игнорируем договорные цены = 0)
    if (filters.priceFrom) {
      const priceFrom = parseInt(filters.priceFrom);
      filtered = filtered.filter(order => {
        const price = order.prices?.[0]?.price || 0;
        return price === 0 || price >= priceFrom; // Договорные цены показываем всегда
      });
    }

    if (filters.priceTo) {
      const priceTo = parseInt(filters.priceTo);
      filtered = filtered.filter(order => {
        const price = order.prices?.[0]?.price || 0;
        return price === 0 || price <= priceTo; // Договорные цены показываем всегда
      });
    }

    setFilteredOrders(filtered);
  }, [orders, filters]);

  // Phone click handler
  const handlePhoneClick = (phone, product) => {
    if (phone) {
      window.open(`tel:${phone}`, '_self');
    }
  };

  // Pagination logic
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setCurrentPageOrders(filteredOrders.slice(startIndex, endIndex));
  }, [filteredOrders, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.search, filters.category, filters.city, filters.priceFrom, filters.priceTo]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Date formatter
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return ( 
    <Box>
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
        cursor="pointer"
        _hover={{ bg: 'gray.50' }}
        transition="background 0.2s"
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
          _hover={{
            bg: 'gray.50',
          }}
          borderRadius="xl"
        />
      </Box>

      <Collapse in={isfilterbtn} animateOpacity>
        <Card mb={6} borderRadius="2xl" border="1px" borderColor="gray.100" boxShadow="lg">
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

      <Heading size="lg" mb={6} color="gray.800">
        {t("orders.active_orders", "Активные заказы")}
      </Heading>

      {/* Products List */}
      {isLoading ? (
        <VStack spacing={4}>
          {[1, 2, 3].map((i) => (
            <ProductCardList 
              key={i}
              isLoading={true}
            />
          ))}
        </VStack>
      ) : filteredOrders.length > 0 ? (
        <>
          <VStack spacing={4} align="stretch">
            {currentPageOrders.map((product) => (
              <ProductCardList
                key={product.id}
                product={product}
                onPhoneClick={handlePhoneClick}
                formatDate={formatDate}
              />
            ))}
          </VStack>
          
          {/* Pagination */}
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        // Empty state
        <Card borderRadius="2xl" border="1px" borderColor="gray.100">
          <CardBody p={8}>
            <Center flexDirection="column" py={8}>
              <Box
                w={16}
                h={16}
                bg="blue.50"
                borderRadius="2xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={4}
              >
                <FiTruck size="32" color="#4299e1" />
              </Box>
              <Text color="gray.500" fontSize="lg" textAlign="center">
                {filters.search || filters.category || filters.city || filters.priceFrom || filters.priceTo
                  ? t("orders.no_filtered_results", "По вашему запросу ничего не найдено")
                  : t("orders.no_active_orders", "У вас пока нет активных заказов")
                }
              </Text>
              <Text color="gray.400" fontSize="sm" textAlign="center" mt={2}>
                {filters.search || filters.category || filters.city || filters.priceFrom || filters.priceTo
                  ? t("orders.try_different_filters", "Попробуйте изменить параметры поиска")
                  : t("orders.orders_will_appear", "Ваши заказы будут отображаться здесь")
                }
              </Text>
            </Center>
          </CardBody>
        </Card>
      )}
    </Box>
  );
};