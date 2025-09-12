import { 
  Badge,
  Box, 
  Button, 
  Card, 
  IconButton,
  Flex,
  CardBody, 
  HStack, 
  Table, 
  TableContainer, 
  Tbody, 
  Td, 
  Text, 
  Th, 
  Thead, 
  Tr, 
  VStack, 
  Divider,
  SimpleGrid,
  Stack
} from "@chakra-ui/react";
import PaginationComponent from "./profilecomponents/PaginationComponent";
import { 
  FiCalendar, 
  FiDollarSign, 
  FiEye, 
  FiMapPin, 
  FiTag, 
  FiUser 
} from "react-icons/fi";
import { FaChartLine } from "react-icons/fa";
import { useCallback, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PropTypes from 'prop-types';

// Konstantalar
const ITEMS_PER_PAGE = 5;
const STATUS_COLORS = {
  active: "blue",
  cancelled: "red",
};

// Helper funksiyalar
const getActionButtonProps = (status) => ({
  colorScheme: status === "cancelled" ? "green" : "red",
  bg: status !== "cancelled" 
    ? "linear-gradient(135deg, #ff416c, #ff4b2b)" 
    : "linear-gradient(135deg, #56ab2f, #a3e652)",
  _hover: {
    bg: status !== "cancelled" 
      ? "linear-gradient(135deg, #ff4b2b, #ff416c)" 
      : "linear-gradient(135deg, #a3e652, #56ab2f)"
  }
});

// Custom hook
const useOrdersPagination = (orders, itemsPerPage = ITEMS_PER_PAGE) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const paginationData = useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        currentOrders: [],
        totalPages: 0,
        startIndex: 0,
        endIndex: 0,
        totalItems: 0
      };
    }

    const totalItems = orders.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentOrders = orders.slice(startIndex, endIndex);
    
    return {
      currentOrders,
      totalPages,
      startIndex,
      endIndex,
      totalItems
    };
  }, [orders, currentPage, itemsPerPage]);
  
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);
  
  return {
    ...paginationData,
    currentPage,
    handlePageChange
  };
};

// Desktop Table komponenti
const DesktopOrdersTable = ({ orders, onViewClick, onOrderAction, onStatisticsClick, t }) => {
  const ORDER_STATUSES = useMemo(() => ({
    active: t("MyOrder.orders.active", "Faol"),
    cancelled: t("MyOrder.orders.cancelled", "Bekor qilingan"),
  }), [t]);

  const handleRowKeyDown = useCallback((e, orderSlug) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onViewClick(orderSlug);
    }
  }, [onViewClick]);

  return (
    <Card 
      borderRadius="2xl" 
      shadow="lg"
      overflow="hidden"
      display={{ base: "none", lg: "block" }}
    >
      <CardBody p={0}>
        <TableContainer>
          <Table variant="simple" size="md">
            <Thead bg="gray.50">
              <Tr>
                <Th py={6} px={6}>
                  <HStack>
                    <FiUser />
                    <Text>{t("listing.name", "Наименование")}</Text>
                  </HStack>
                </Th>
                <Th py={6}>
                  <HStack>
                    <FiTag />
                    <Text>{t("listing.category", "Категория")}</Text>
                  </HStack>
                </Th>
                <Th py={6}>
                  <HStack>
                    <FiDollarSign />
                    <Text>{t("listing.price", "Цена")}</Text>
                  </HStack>
                </Th>
                <Th py={6}>
                  <HStack>
                    <FiMapPin />
                    <Text>{t("listing.city", "Город")}</Text>
                  </HStack>
                </Th>
                <Th py={6}>
                  <HStack>
                    <FiCalendar />
                    <Text>{t("listing.date", "Дата")}</Text>
                  </HStack>
                </Th>
                <Th textAlign="center" py={6}>{t("listing.actions", "Действия")}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders.map((order) => (
                <Tr 
                  key={order.id} 
                  _hover={{ bg: "gray.50" }}
                  tabIndex={0}
                  onKeyDown={(e) => handleRowKeyDown(e, order.slug)}
                  cursor="pointer"
                >
                  <Td py={6} px={6}>
                    <VStack align="start" spacing={1}>
                      <Text 
                        fontWeight="bold" 
                        fontSize="md" 
                        color={'blue.400'} 
                        _hover={{textDecor: "underline"}} 
                        cursor={'pointer'} 
                        onClick={() => onViewClick(order.slug)}
                      >
                        {order.title}
                      </Text>
                      <Badge
                        colorScheme={STATUS_COLORS[order.status]}
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontSize="xs"
                      >
                        {ORDER_STATUSES[order.status]}
                      </Badge>
                    </VStack>
                  </Td>
                  <Td py={6}>
                    <Text bg={'gray.50'} borderRadius="md" px={2} py={1} fontWeight="medium">
                      {order.category}
                    </Text>
                  </Td>
                  <Td py={6}>
                    <Text 
                      bg={'green.50'} 
                      px={2} 
                      py={1} 
                      textAlign={'center'} 
                      borderRadius="md" 
                      fontWeight="bold" 
                      color="green.500"
                    >
                      {order.price}
                    </Text>
                  </Td>
                  <Td py={6}>
                    <HStack>
                      <Box p={2} bg="blue.50" borderRadius="md">
                        <FiMapPin color="#3182CE" />
                      </Box>
                      <Text>{order.city}</Text>
                    </HStack>
                  </Td>
                  <Td py={6}>
                    <Text>{order.date}</Text>
                    <Text fontSize="xs" color="gray.500">
                      {order.time || "10:29"}
                    </Text>
                  </Td>
                  <Td textAlign="center" py={6}>
                    <HStack spacing={2} justify="center">
                      <Button
                        size="sm"
                        {...getActionButtonProps(order.status)}
                        onClick={() => onOrderAction(order.status === "cancelled" ? "restore" : "cancel", order)}
                      >
                        {order.status === "cancelled" 
                          ? t("MyOrder.orders.restore", "Восстановить") 
                          : t("MyOrder.orders.cancel", "Отменить")
                        }
                      </Button>
                      {order.status !== 'cancelled' && (
                        <IconButton 
                          bgGradient={"linear(135deg, yellow.400, orange.400)"} 
                          size={'sm'} 
                          aria-label={t("listing.statistics", "Статистика")}
                          title={t("listing.statistics", "Статистика")}
                          icon={<FaChartLine />} 
                          onClick={() => onStatisticsClick(order.id)}
                        />
                      )}
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
};

// Mobile Cards komponenti
const MobileOrdersCards = ({ orders, onViewClick, onOrderAction, onStatisticsClick, t }) => {
  const ORDER_STATUSES = useMemo(() => ({
    active: t("MyOrder.orders.active", "Faol"),
    cancelled: t("MyOrder.orders.cancelled", "Bekor qilingan"),
  }), [t]);

  return (
    <VStack spacing={4} display={{ base: "flex", lg: "none" }}>
      {orders.map((order) => (
        <Card key={order.id} w="100%" borderRadius="2xl" shadow="lg">
          <CardBody p={6}>
            <VStack align="stretch" spacing={4}>
              <Flex justify="space-between" align="start">
                <HStack spacing={4} flex="1">
                  <VStack align="start" spacing={1} flex="1">
                    <Text fontWeight="bold" fontSize="md">
                      {order.title}
                    </Text>
                    <Badge
                      colorScheme={STATUS_COLORS[order.status]}
                      borderRadius="full"
                      px={3}
                      py={1}
                      fontSize="xs"
                    >
                      {ORDER_STATUSES[order.status]}
                    </Badge>
                  </VStack>
                </HStack>
                {order.status !== 'cancelled' && (
                  <IconButton  
                    size={'sm'} 
                    bgGradient={"linear(135deg, yellow.400, orange.400)"} 
                    aria-label={t("listing.statistics", "Статистика")}
                    title={t("listing.statistics", "Статистика")}
                    icon={<FaChartLine />} 
                    onClick={() => onStatisticsClick(order.id)}
                  />
                )}
              </Flex>

              <Divider />

              <SimpleGrid columns={2} spacing={4}>
                <VStack align="start" spacing={2}>
                  <HStack>
                    <FiTag />
                    <Text color="gray.500" fontSize="sm">
                      {t("listing.category", "Категория")}
                    </Text>
                  </HStack>
                  <Text fontWeight="semibold">{order.category}</Text>
                </VStack>
                
                <VStack align="start" spacing={2}>
                  <HStack>
                    <FiDollarSign />
                    <Text color="gray.500" fontSize="sm">
                      {t("listing.price", "Цена")}
                    </Text>
                  </HStack>
                  <Text fontWeight="bold" color="green.500">{order.price}</Text>
                </VStack>
                
                <VStack align="start" spacing={2}>
                  <HStack>
                    <FiMapPin />
                    <Text color="gray.500" fontSize="sm">
                      {t("listing.city", "Город")}
                    </Text>
                  </HStack>
                  <Text fontWeight="semibold">{order.city}</Text>
                </VStack>
                
                <VStack align="start" spacing={2}>
                  <HStack>
                    <FiCalendar />
                    <Text color="gray.500" fontSize="sm">
                      {t("listing.date", "Дата")}
                    </Text>
                  </HStack>
                  <Text fontWeight="semibold">{order.date}</Text>
                </VStack>
              </SimpleGrid>

              {order.description && (
                <Box bg="gray.50" p={4} borderRadius="xl">
                  <Text color="gray.500" fontSize="sm" mb={2}>
                    {t("listing.description", "Описание")}
                  </Text>
                  <Text fontSize="sm">{order.description}</Text>
                </Box>
              )}

              <Stack direction={{ base: "row", sm: "row" }} spacing={3}>
                <Button
                  {...getActionButtonProps(order.status)}
                  onClick={() => onOrderAction(order.status === "cancelled" ? "restore" : "cancel", order)}
                  flex="1"
                >
                  {order.status === "cancelled" 
                    ? t("MyOrder.orders.restore", "Восстановить") 
                    : t("MyOrder.orders.cancel", "Отменить")
                  }
                </Button>
                <Button
                  variant="outline"
                  leftIcon={<FiEye />}
                  colorScheme="black"
                  flex="1"
                  onClick={() => onViewClick(order.slug)}
                >
                  {t("listing.view", "Просмотр")}
                </Button>
              </Stack>
            </VStack>
          </CardBody>
        </Card>
      ))}
    </VStack>
  );
};

// Asosiy OrdersTable komponenti
export const OrdersTable = ({ orders = [], onAction }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Custom hook dan foydalanish
  const {
    currentOrders,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    currentPage,
    handlePageChange
  } = useOrdersPagination(orders);

  // Optimizatsiya qilingan callback funksiyalar
  const handleViewClick = useCallback((orderSlug, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    navigate(`/order-details/product/${orderSlug}`);
  }, [navigate]);

  const handleOrderAction = useCallback((action, order) => {
    if (onAction) {
      onAction(action, order);
    }
  }, [onAction]);

  const handleStatisticsClick = useCallback((orderId) => {
    navigate(`/profile/my-applications/statistic/${orderId}`);
  }, [navigate]);

  // Bo'sh holatni tekshirish
  if (!orders || orders.length === 0) {
    return (
      <Card borderRadius="2xl" shadow="lg">
        <CardBody p={8}>
          <VStack spacing={4}>
            <Text textAlign="center" color="gray.500" fontSize="lg">
              {t("MyOrder.orders.empty", "Buyurtmalar topilmadi")}
            </Text>
            <Text textAlign="center" color="gray.400" fontSize="sm">
              {t("MyOrder.orders.emptyDescription", "Hozircha hech qanday buyurtma yo'q")}
            </Text>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  return (
    <Box>
      {/* Desktop Table */}
      <DesktopOrdersTable
        orders={currentOrders}
        onViewClick={handleViewClick}
        onOrderAction={handleOrderAction}
        onStatisticsClick={handleStatisticsClick}
        t={t}
      />

      {/* Mobile Cards */}
      <MobileOrdersCards
        orders={currentOrders}
        onViewClick={handleViewClick}
        onOrderAction={handleOrderAction}
        onStatisticsClick={handleStatisticsClick}
        t={t}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Box mt={6}>
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={totalItems}
            onPageChange={handlePageChange}
          />
        </Box>
      )}
    </Box>
  );
};

// PropTypes
OrdersTable.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['active', 'cancelled']).isRequired,
    category: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string,
    description: PropTypes.string
  })),
  onAction: PropTypes.func.isRequired
};

OrdersTable.defaultProps = {
  orders: []
};