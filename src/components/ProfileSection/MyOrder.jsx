import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Card,
  CardBody,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";

import { FiShoppingCart, FiPlus } from "react-icons/fi";
import { mockOrders } from "./data/mockorder";
import { ApplicationsTable } from "./ApplicationsTable";
import { OrdersTable } from "./OrdersTable";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import OrdersFilter from "./OrdersFilter";


const ApplicationsPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const toast = useToast();
  
  // Constants
  const FILTER_OPTIONS = [
    { value: "all", label: t("tabs.all", "Все") },
    { value: "active", label: t("tabs.active", "Активные") },  
    { value: "cancelled", label: t("tabs.canceled", "Отмененные") },
  ];

  const CANCELLATION_REASONS = [
    t("cancellation_reason.orderChangeNeeded", "Нужно изменить заказ"),
    t("cancellation_reason.orderCompleted", "Заказ выполнен"), 
    t("cancellation_reason.noContact", "Не вышел на связь"),
    t("cancellation_reason.noResponses", "Не было откликов"),
    t("cancellation_reason.resolvedIndependently", "Решил вопрос самостоятельно"),
    t("cancellation_reason.helpedElsewhere", "Помогли на другом сервисе"),
    t("cancellation_reason.changedMind", "Передумал"),
    t("cancellation_reason.other", "Другое"),
  ];

  // State management
  const [activeTab, setActiveTab] = useState(0);
  const [orders, setOrders] = useState(mockOrders);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTransport, setSelectedTransport] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  
  // Modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancellationComment, setCancellationComment] = useState("");
  
  const {
    isOpen: isActionModalOpen,
    onOpen: onActionModalOpen,
    onClose: onActionModalClose,
  } = useDisclosure();

  const path_ads = location.pathname === "/profile/ads";

  // Memoized current filter value
  const currentFilter = useMemo(() => {
    return FILTER_OPTIONS[activeTab]?.value || "all";
  }, [activeTab]);

  // Optimized filtered orders with reduced dependencies
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Tab filter
      const matchesTab = currentFilter === "all" || order.status === currentFilter;
      
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        order.title.toLowerCase().includes(searchLower) ||
        order.category.toLowerCase().includes(searchLower);
      
      // Category filter
      const matchesCategory = !selectedCategory || order.category === selectedCategory;
      
      // City filter  
      const matchesCity = !selectedCity || order.city === selectedCity;
      
      // Transport filter
      const matchesTransport = !selectedTransport || order.transportType === selectedTransport;
      
      // Brand filter
      const matchesBrand = !selectedBrand || order.brand === selectedBrand;
      
      // Model filter
      const matchesModel = !selectedModel || order.model === selectedModel;

      // Price filter - optimized parsing
      let matchesPrice = true;
      if (priceFrom || priceTo) {
        const orderPrice = parseInt(order.price.replace(/\D/g, "")) || 0;
        const priceFromNum = priceFrom ? parseInt(priceFrom.replace(/\D/g, "")) : 0;
        const priceToNum = priceTo ? parseInt(priceTo.replace(/\D/g, "")) : Infinity;
        matchesPrice = orderPrice >= priceFromNum && orderPrice <= priceToNum;
      }

      return matchesTab && matchesSearch && matchesCategory && 
             matchesCity && matchesTransport && matchesBrand && 
             matchesModel && matchesPrice;
    });
  }, [
    orders, 
    currentFilter, 
    searchTerm,
    selectedCategory,
    selectedCity, 
    selectedTransport,
    selectedBrand,
    selectedModel,
    priceFrom,
    priceTo
  ]);

  // Optimized callbacks with useCallback
  const handleTabChange = useCallback((index) => {
    setActiveTab(index);
  }, []);

  const openActionModal = useCallback((action, order) => {
    setSelectedOrder(order);
    setActionType(action);
    setCancellationReason("");
    setCancellationComment("");
    onActionModalOpen();
  }, [onActionModalOpen]);

  const handleConfirmAction = useCallback(() => {
    if (!selectedOrder) return;

    if (actionType === "cancel" && !cancellationReason) {
      toast({
        title: t("orderlist.error", "Произошла ошибка!"),
        description: t("MyOrder.orders.selectCancelReason", "Пожалуйста, выберите причину отмены."),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setOrders(prevOrders => {
      if (actionType === "delete") {
        return prevOrders.filter(o => o.id !== selectedOrder.id);
      }
      
      return prevOrders.map(order => {
        if (order.id === selectedOrder.id) {
          return {
            ...order,
            status: actionType === "restore" ? "active" : "cancelled"
          };
        }
        return order;
      });
    });

    // Toast notifications
    const toastMessages = {
      restore: {
        title: t("MyOrder.orders.restored", "Заявка восстановлена"),
        description: `"${selectedOrder.title}" ${t("MyOrder.orders.restoredMessage", "заявка успешно восстановлена.")}`,
        status: "success"
      },
      cancel: {
        title: t("MyOrder.orders.cancelledMessages", "Заявка отменена"), 
        description: `"${selectedOrder.title}" ${t("MyOrder.orders.cancelledMessage", "заявка отменена.")}`,
        status: "info"
      },
      delete: {
        title: t("MyOrder.orders.deleted", "Заявка удалена"),
        description: `"${selectedOrder.title}" ${t("MyOrder.orders.deletedMessage", "заявка удалена.")}`,
        status: "warning"
      }
    };

    const message = toastMessages[actionType];
    if (message) {
      toast({
        ...message,
        duration: 3000,
        isClosable: true,
      });
    }

    onActionModalClose();
  }, [selectedOrder, actionType, cancellationReason, toast, onActionModalClose, t]);

  // Filter handlers - memoized to prevent re-renders
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedCity("");
    setSelectedTransport("");
    setSelectedBrand("");
    setSelectedModel("");
    setPriceFrom("");
    setPriceTo("");
  }, []);

  // Memoized empty state component
  const EmptyState = useMemo(() => (
    <Card borderRadius="xl" shadow="sm">
      <CardBody p={12} textAlign="center">
        <VStack spacing={4}>
          <FiShoppingCart size="48" color="gray.400" />
          <Text fontSize="lg" fontWeight="medium" color="gray.500">
            {t("MyOrder.orders.notFound", "Заявки не найдены")}
          </Text>
          <Text color="gray.400">
            {t("MyOrder.orders.changeSearch", "Измените параметры поиска или создайте новый заказ")}
          </Text>
          <Button
            colorScheme="blue"
            leftIcon={<FiPlus />}
            borderRadius="xl"
            as="a"
            href={path_ads ? "/create-ads" : "/applications/create"}
          >
            {t("MyOrder.orders.createOrder", "Создать заказ")}
          </Button>
        </VStack>
      </CardBody>
    </Card>
  ), [t, path_ads]);

  return (
    <Box maxW="100%" p={{base: 3, md: 6}} py={{ base: "100px", custom570: 0 }}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <VStack
          align="start"
          spacing={1}
          display={{ base: "none", custom570: "flex" }}
        >
          <Heading size="xl">
            <HStack>
              <FiShoppingCart />
              <Text>{t("MyOrder.orders.myOrders", "Мои заказы")}</Text>
            </HStack>
          </Heading>
          <Text color="gray.500">
            {t("MyOrder.orders.subtitle", "Управляйте и отслеживайте свои заказы")}
          </Text>
        </VStack>

        {/* Tabs */}
        <Tabs
          index={activeTab}
          onChange={handleTabChange}
          variant="soft-rounded"
          colorScheme="yellow"
        >
          <TabList
            bg="white"
            p={2}
            borderRadius="xl"
            border="1px"
            borderColor="gray.200"
          >
            {FILTER_OPTIONS.map((filter) => (
              <Tab key={filter.value}>{filter.label}</Tab>
            ))}
          </TabList>

          <TabPanels>
            {FILTER_OPTIONS.map((filter) => (
              <TabPanel key={filter.value} p={0}>
                <VStack spacing={6} align="stretch">
                  {/* Filter Component */}
                  <OrdersFilter
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    selectedCity={selectedCity}
                    onCityChange={setSelectedCity}
                    selectedTransport={selectedTransport}
                    onTransportChange={setSelectedTransport}
                    selectedBrand={selectedBrand}
                    onBrandChange={setSelectedBrand}
                    selectedModel={selectedModel}
                    onModelChange={setSelectedModel}
                    priceFrom={priceFrom}
                    onPriceFromChange={setPriceFrom}
                    priceTo={priceTo}
                    onPriceToChange={setPriceTo}
                    onClearFilters={handleClearFilters}
                  />

                  {/* Results */}
                  {filteredOrders.length > 0 ? (
                    path_ads ? (
                      <ApplicationsTable orders={filteredOrders} onAction={openActionModal} />
                    ) : (
                      <OrdersTable orders={filteredOrders} onAction={openActionModal} />
                    )
                  ) : (
                    EmptyState
                  )}
                </VStack>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </VStack>

      {/* Action Modal */}
      <Modal isOpen={isActionModalOpen} onClose={onActionModalClose} size="md">
        <ModalOverlay />
        <ModalContent borderRadius="xl" m={3} w="full">
          <ModalHeader>
            {actionType === "restore"
              ? t("MyOrder.orders.restoreOrder", "Восстановить заказ")
              : t("MyOrder.cancelReason.title", "Причина отмены")}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {actionType === "restore" ? (
              <VStack spacing={4} align="start">
                <Text>
                  {t("MyOrder.orders.confirmRestore", "Вы уверены, что хотите восстановить заказ?")}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {t("MyOrder.orders.restoreInfo", "Заказ будет возвращён в активное состояние и начнёт принимать новые отклики.")}
                </Text>
              </VStack>
            ) : (
              <VStack spacing={4} align="start">
                <RadioGroup
                  value={cancellationReason}
                  onChange={setCancellationReason}
                >
                  <Stack>
                    {CANCELLATION_REASONS.map((reason) => (
                      <Radio key={reason} value={reason}>
                        {reason}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
                <FormControl>
                  <FormLabel>
                    {t("MyOrder.cancelReason.explainWhy", "Укажи что помешало вам закончить подачу объявления")}
                  </FormLabel>
                  <Textarea
                    value={cancellationComment}
                    maxH="350px"
                    onChange={(e) => setCancellationComment(e.target.value)}
                    placeholder={t("MyOrder.orders.moreInfo", "Дополнительная информация...")}
                  />
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onActionModalClose}>
              {t("MyOrder.orders.cancel", "Отмена")}
            </Button>
            <Button
              colorScheme={actionType === "restore" ? "green" : "red"}
              onClick={handleConfirmAction}
            >
              {actionType === "restore" 
                ? t("MyOrder.orders.restore", "Восстановить") 
                : t("MyOrder.orders.cancelOrder", "Отменить заказ")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ApplicationsPage;