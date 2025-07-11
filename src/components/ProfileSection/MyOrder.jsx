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
  Input,
  InputGroup,
  InputLeftElement,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
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
  Collapse,
  useBreakpointValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  InputRightElement,
} from "@chakra-ui/react";

import { FiShoppingCart, FiPlus, FiSearch, FiRotateCcw, FiChevronUp, FiChevronDown } from "react-icons/fi";

//     APPLICATIONS UCHUN ALOHIDA DATA,  ORDERS UCHUN ALOHIDA DATA BOLISHI KERAK
import { mockOrders } from "./data/mockorder";



import { ApplicationsTable } from "./ApplicationsTable";
import { OrdersTable } from "./OrdersTable";
import { useLocation } from "react-router-dom";

// Constants
const FILTER_OPTIONS = [
  { value: "all", label: "Hammasi" },
  { value: "active", label: "Faol" },
  { value: "cancelled", label: "Bekor qilingan" },
];

const CATEGORIES = ["Hammasi", "Logistika", "Transport", "Kuryer"];
const CITIES = ["Hammasi", "Toshkent", "Samarqand", "Buxoro", "Andijon"];
const TRANSPORT_TYPES = ["Hammasi", "Yuk mashinasi", "Avtomobil", "Mototsikl"];
const BRANDS = ["Hammasi", "Kamaz", "Chevrolet", "Honda", "Isuzu", "Daewoo"];
const MODELS = ["Hammasi", "5320", "Lacetti", "CB150", "NPR", "Nexia"];

const CANCELLATION_REASONS = [
  "Endi kerak emas",
  "Muqobil topildi",
  "Narx juda baland",
  "Vaqt cheklovi",
  "Boshqa",
];

// Applications Page Component
export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Hammasi");
  const [selectedCity, setSelectedCity] = useState("Hammasi");
  const [selectedTransport, setSelectedTransport] = useState("Hammasi");
  const [selectedBrand, setSelectedBrand] = useState("Hammasi");
  const [selectedModel, setSelectedModel] = useState("Hammasi");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancellationComment, setCancellationComment] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const location = useLocation();
  const path_ads = location.pathname === "/profile/ads";

  // Breakpoint values
  const forCollapse = useBreakpointValue({
    base: true,
    custom900: false
  }, {
    fallback: 'base',
    ssr: false
  });

  const {
    isOpen: isActionModalOpen,
    onOpen: onActionModalOpen,
    onClose: onActionModalClose,
  } = useDisclosure();
  const toast = useToast();

  // Get current filter value based on active tab
  const getCurrentFilter = useCallback(() => {
    return FILTER_OPTIONS[activeTab]?.value || "all";
  }, [activeTab]);

  // Memoized filtered orders
  const filteredOrders = useMemo(() => {
    const currentFilter = getCurrentFilter();
    return orders.filter((order) => {
      const matchesTab =
        currentFilter === "all" || order.status === currentFilter;
      const matchesSearch =
        order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "Hammasi" || order.category === selectedCategory;
      const matchesCity =
        selectedCity === "Hammasi" || order.city === selectedCity;
      const matchesTransport =
        selectedTransport === "Hammasi" ||
        order.transportType === selectedTransport;
      const matchesBrand =
        selectedBrand === "Hammasi" || order.brand === selectedBrand;
      const matchesModel =
        selectedModel === "Hammasi" || order.model === selectedModel;

      // Price filtering
      const orderPrice = parseInt(order.price.replace(/[^\d]/g, ""));
      const priceFromNum = parseInt(priceFrom.replace(/[,\s]/g, '')) || 0;
      const priceToNum = parseInt(priceTo.replace(/[,\s]/g, '')) || Infinity;

      const matchesPrice =
        orderPrice >= priceFromNum && orderPrice <= priceToNum;

      return (
        matchesTab &&
        matchesSearch &&
        matchesCategory &&
        matchesCity &&
        matchesTransport &&
        matchesBrand &&
        matchesModel &&
        matchesPrice
      );
    });
  }, [
    orders,
    getCurrentFilter,
    searchTerm,
    selectedCategory,
    selectedCity,
    selectedTransport,
    selectedBrand,
    selectedModel,
    priceFrom,
    priceTo,
  ]);

  const handleTabChange = useCallback((index) => {
    setActiveTab(index);
  }, []);

  const openActionModal = useCallback(
    (action, order) => {
      setSelectedOrder(order);
      setActionType(action);
      setCancellationReason("");
      setCancellationComment("");
      onActionModalOpen();
    },
    [onActionModalOpen]
  );

  const handleConfirmAction = useCallback(() => {
    if (!selectedOrder) return;

    const updatedOrders = [...orders];
    const orderIndex = updatedOrders.findIndex(
      (o) => o.id === selectedOrder.id
    );

    if (actionType === "restore") {
      updatedOrders[orderIndex] = { ...selectedOrder, status: "active" };
      toast({
        title: "Ariza tiklandi",
        description: `"${selectedOrder.title}" arizasi muvaffaqiyatli tiklandi.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else if (actionType === "cancel") {
      if (!cancellationReason) {
        toast({
          title: "Xatolik",
          description: "Iltimos, bekor qilish sababini tanlang.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      updatedOrders[orderIndex] = { ...selectedOrder, status: "cancelled" };
      toast({
        title: "Ariza bekor qilindi",
        description: `"${selectedOrder.title}" arizasi bekor qilindi.`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } else if (actionType === "delete") {
      // Delete order from list
      const filteredOrders = updatedOrders.filter(o => o.id !== selectedOrder.id);
      setOrders(filteredOrders);
      toast({
        title: "Ariza o'chirildi",
        description: `"${selectedOrder.title}" arizasi o'chirildi.`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      onActionModalClose();
      return;
    } else if (actionType === "advertise") {
      toast({
        title: "Reklama funksiyasi",
        description: "Reklama funksiyasi hozircha ishlab chiqilmoqda.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } else if (actionType === "edit") {
      toast({
        title: "Tahrirlash funksiyasi",
        description: "Tahrirlash funksiyasi hozircha ishlab chiqilmoqda.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } else if (actionType === "copy") {
      toast({
        title: "Nusxalash funksiyasi",
        description: "Nusxalash funksiyasi hozircha ishlab chiqilmoqda.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }

    setOrders(updatedOrders);
    onActionModalClose();
  }, [
    selectedOrder,
    orders,
    actionType,
    cancellationReason,
    toast,
    onActionModalClose,
  ]);

  const formatInputNumber = (value) => {
    if (!value) return '';

    const cleaned = value.replace(/[, ]+/g, '');
    const number = parseInt(cleaned, 10);

    if (isNaN(number)) return '';
    if (number < 0) return '0';
    if (number > 999999999) return '999999999';

    return number.toLocaleString('uz-UZ');
  }

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("Hammasi");
    setSelectedCity("Hammasi");
    setSelectedTransport("Hammasi");
    setSelectedBrand("Hammasi");
    setSelectedModel("Hammasi");
    setPriceFrom("");
    setPriceTo("");
  }, []);

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
              <Text>Mening arizalarim</Text>
            </HStack>
          </Heading>
          <Text color="gray.500">Arizalaringizni boshqaring va kuzating</Text>
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
                  {/* Filters */}
                  <Card borderRadius="xl" shadow="sm" overflow={'visible'}>
                    <CardBody p={{base: 2, custom570: 4}} py={{base: 6, custom570: 4}}>
                      <VStack spacing={4}>
                        {/* Search */}
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FiSearch color="gray.500" />
                          </InputLeftElement>
                          <Input
                            placeholder="Sarlavha yoki kategoriya bo'yicha qidiring..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            borderRadius="xl"
                            bg="gray.50"
                            border="1px"
                            borderColor={'gray.300'}
                          />
                        </InputGroup>
                        
                        {forCollapse && (
                          <HStack justify="end" w="100%">
                            <Button
                              onClick={() => setFiltersOpen(!filtersOpen)}
                              size="sm"
                              variant="ghost"
                              borderRadius="xl"
                              rightIcon={filtersOpen ? <FiChevronUp /> : <FiChevronDown />}
                              color="gray.600"
                            >
                              {filtersOpen ? "Qo'shimcha filtrlarni yopish" : "Qo'shimcha filtrlar"}
                            </Button>
                          </HStack>
                        )}

                        <Collapse in={forCollapse ? filtersOpen : true} animateOpacity style={{ width: "100%", overflow: "visible" }}>
                          {/* Advanced Filters */}
                          <SimpleGrid
                            columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
                            spacing={4}
                            w="100%"
                          >
                            {/* Category */}
                            <FormControl>
                              <FormLabel fontSize="sm" color="gray.600" fontWeight="medium">
                                Kategoriya
                              </FormLabel>
                              <Menu>
                                <MenuButton
                                  as={Button}
                                  rightIcon={<FiChevronDown />}
                                  borderRadius="xl"
                                  bg="white"
                                  border="1px solid"
                                  borderColor="gray.200"
                                  textAlign="left"
                                  w="full"
                                  h="12"
                                  px={4}
                                  fontWeight="normal"
                                  color={selectedCategory ? "gray.900" : "gray.500"}
                                  _hover={{ 
                                    bg: 'gray.50',
                                    borderColor: 'blue.300',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                  }}
                                  _active={{ 
                                    bg: 'gray.100',
                                    transform: 'translateY(0)'
                                  }}
                                  _focus={{
                                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                                    borderColor: 'blue.400'
                                  }}
                                  transition="all 0.2s ease"
                                >
                                  <Text isTruncated>{selectedCategory || "Kategoriya tanlang"}</Text>
                                </MenuButton>
                                <MenuList
                                  borderRadius="xl"
                                  border="1px solid"
                                  borderColor="gray.200"
                                  boxShadow="0 10px 40px rgba(0,0,0,0.1)"
                                  py={2}
                                  maxH="250px"
                                  overflowY="auto"
                                >
                                  {CATEGORIES.map((cat) => (
                                    <MenuItem 
                                      key={cat} 
                                      onClick={() => setSelectedCategory(cat)}
                                      borderRadius="lg"
                                      my={1}
                                      _hover={{ bg: 'orange.50', color: 'white' }}
                                      _focus={{ bg: 'orange.50', color: 'white' }}
                                    >
                                      {cat}
                                    </MenuItem>
                                  ))}
                                </MenuList>
                              </Menu>
                            </FormControl>

                            {/* City */}
                            <FormControl>
                              <FormLabel fontSize="sm" color="gray.600" fontWeight="medium">
                                Shahar
                              </FormLabel>
                              <Menu>
                                <MenuButton
                                  as={Button}
                                  rightIcon={<FiChevronDown />}
                                  borderRadius="xl"
                                  bg="white"
                                  border="1px solid"
                                  borderColor="gray.200"
                                  textAlign="left"
                                  w="full"
                                  h="12"
                                  px={4}
                                  fontWeight="normal"
                                  color={selectedCity ? "gray.900" : "gray.500"}
                                  _hover={{ 
                                    bg: 'gray.50',
                                    borderColor: 'blue.300',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                  }}
                                  _active={{ 
                                    bg: 'gray.100',
                                    transform: 'translateY(0)'
                                  }}
                                  _focus={{
                                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                                    borderColor: 'blue.400'
                                  }}
                                  transition="all 0.2s ease"
                                >
                                  <Text isTruncated>{selectedCity || "Shahar tanlang"}</Text>
                                </MenuButton>
                                <MenuList
                                  borderRadius="xl"
                                  border="1px solid"
                                  borderColor="gray.200"
                                  boxShadow="0 10px 40px rgba(0,0,0,0.1)"
                                  py={2}
                                  maxH="250px"
                                  overflowY="auto"
                                >
                                  {CITIES.map((city) => (
                                    <MenuItem 
                                      key={city} 
                                      onClick={() => setSelectedCity(city)}
                                      borderRadius="lg"
                                      my={1}
                                      _hover={{ bg: 'orange.50', color: 'white' }}
                                      _focus={{ bg: 'orange.50', color: 'white' }}
                                    >
                                      {city}
                                    </MenuItem>
                                  ))}
                                </MenuList>
                              </Menu>
                            </FormControl>

                            {/* Transport Type */}
                            <FormControl>
                              <FormLabel fontSize="sm" color="gray.600" fontWeight="medium">
                                Transport turi
                              </FormLabel>
                              <Menu>
                                <MenuButton
                                  as={Button}
                                  rightIcon={<FiChevronDown />}
                                  borderRadius="xl"
                                  bg="white"
                                  border="1px solid"
                                  borderColor="gray.200"
                                  textAlign="left"
                                  w="full"
                                  h="12"
                                  px={4}
                                  fontWeight="normal"
                                  color={selectedTransport ? "gray.900" : "gray.500"}
                                  _hover={{ 
                                    bg: 'gray.50',
                                    borderColor: 'blue.300',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                  }}
                                  _active={{ 
                                    bg: 'gray.100',
                                    transform: 'translateY(0)'
                                  }}
                                  _focus={{
                                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                                    borderColor: 'blue.400'
                                  }}
                                  transition="all 0.2s ease"
                                >
                                  <Text isTruncated>{selectedTransport || "Transport turi tanlang"}</Text>
                                </MenuButton>
                                <MenuList
                                  borderRadius="xl"
                                  border="1px solid"
                                  borderColor="gray.200"
                                  boxShadow="0 10px 40px rgba(0,0,0,0.1)"
                                  py={2}
                                  maxH="250px"
                                  overflowY="auto"
                                >
                                  {TRANSPORT_TYPES.map((type) => (
                                    <MenuItem 
                                      key={type} 
                                      onClick={() => setSelectedTransport(type)}
                                      borderRadius="lg"
                                      my={1}
                                      _hover={{ bg: 'orange.50', color: 'white' }}
                                      _focus={{ bg: 'orange.50', color: 'white' }}
                                    >
                                      {type}
                                    </MenuItem>
                                  ))}
                                </MenuList>
                              </Menu>
                            </FormControl>

                            {/* Brand */}
                            <FormControl>
                              <FormLabel fontSize="sm" color="gray.600" fontWeight="medium">
                                Marka
                              </FormLabel>
                              <Menu>
                                <MenuButton
                                  as={Button}
                                  rightIcon={<FiChevronDown />}
                                  borderRadius="xl"
                                  bg="white"
                                  border="1px solid"
                                  borderColor="gray.200"
                                  textAlign="left"
                                  w="full"
                                  h="12"
                                  px={4}
                                  fontWeight="normal"
                                  color={selectedBrand ? "gray.900" : "gray.500"}
                                  _hover={{ 
                                    bg: 'gray.50',
                                    borderColor: 'blue.300',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                  }}
                                  _active={{ 
                                    bg: 'gray.100',
                                    transform: 'translateY(0)'
                                  }}
                                  _focus={{
                                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                                    borderColor: 'blue.400'
                                  }}
                                  transition="all 0.2s ease"
                                >
                                  <Text isTruncated>{selectedBrand || "Marka tanlang"}</Text>
                                </MenuButton>
                                <MenuList
                                  borderRadius="xl"
                                  border="1px solid"
                                  borderColor="gray.200"
                                  boxShadow="0 10px 40px rgba(0,0,0,0.1)"
                                  py={2}
                                  maxH="250px"
                                  overflowY="auto"
                                >
                                  {BRANDS.map((brand) => (
                                    <MenuItem 
                                      key={brand} 
                                      onClick={() => setSelectedBrand(brand)}
                                      borderRadius="lg"
                                      my={1}
                                      _hover={{ bg: 'orange.50', color: 'white' }}
                                      _focus={{ bg: 'orange.50', color: 'white' }}
                                    >
                                      {brand}
                                    </MenuItem>
                                  ))}
                                </MenuList>
                              </Menu>
                            </FormControl>

                            {/* Model */}
                            <FormControl>
                              <FormLabel fontSize="sm" color="gray.600" fontWeight="medium">
                                Model
                              </FormLabel>
                              <Menu>
                                <MenuButton
                                  as={Button}
                                  rightIcon={<FiChevronDown />}
                                  borderRadius="xl"
                                  bg="white"
                                  border="1px solid"
                                  borderColor="gray.200"
                                  textAlign="left"
                                  w="full"
                                  h="12"
                                  px={4}
                                  fontWeight="normal"
                                  color={selectedModel ? "gray.900" : "gray.500"}
                                  _hover={{ 
                                    bg: 'gray.50',
                                    borderColor: 'blue.300',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                  }}
                                  _active={{ 
                                    bg: 'gray.100',
                                    transform: 'translateY(0)'
                                  }}
                                  _focus={{
                                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                                    borderColor: 'blue.400'
                                  }}
                                  transition="all 0.2s ease"
                                >
                                  <Text isTruncated>{selectedModel || "Model tanlang"}</Text>
                                </MenuButton>
                                <MenuList
                                  borderRadius="xl"
                                  border="1px solid"
                                  borderColor="gray.200"
                                  boxShadow="0 10px 40px rgba(0,0,0,0.1)"
                                  py={2}
                                  maxH="250px"
                                  overflowY="auto"
                                >
                                  {MODELS.map((model) => (
                                    <MenuItem 
                                      key={model} 
                                      onClick={() => setSelectedModel(model)}
                                      borderRadius="lg"
                                      my={1}
                                      _hover={{ bg: 'orange.50', color: 'white' }}
                                      _focus={{ bg: 'orange.50', color: 'white' }}
                                    >
                                      {model}
                                    </MenuItem>
                                  ))}
                                </MenuList>
                              </Menu>
                            </FormControl>

                            {/* Price From */}
                            <FormControl>
                              <FormLabel fontSize="sm" color="gray.600" fontWeight="medium">
                                Narx dan
                              </FormLabel>
                              <InputGroup>
                                <Input
                                  type="text"
                                  placeholder="0"
                                  value={priceFrom}
                                  onChange={(e) => {
                                    const raw = e.target.value.replace(/\s/g, '');
                                    setPriceFrom(formatInputNumber(raw));  
                                  }}
                                  borderRadius="xl"
                                  bg="white"
                                  border="1px solid"
                                  borderColor="gray.200"
                                  h="12"
                                  _hover={{ 
                                    borderColor: 'blue.300',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                  }}
                                  _focus={{
                                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                                    borderColor: 'blue.400',
                                    transform: 'translateY(-1px)'
                                  }}
                                  transition="all 0.2s ease"
                                />
                                <InputRightElement h="12" pr={3} pointerEvents="none">
                                  <Text fontSize="sm" color="gray.500">so'm</Text>
                                </InputRightElement>
                              </InputGroup>
                            </FormControl>

                            {/* Price To */}
                            <FormControl>
                              <FormLabel fontSize="sm" color="gray.600" fontWeight="medium">
                                Narx gacha
                              </FormLabel>
                              <InputGroup>
                                <Input
                                  type="text"
                                  placeholder="999,999,999"
                                  value={priceTo}
                                  onChange={(e) => {
                                    const raw = e.target.value.replace(/\s/g, '');
                                    setPriceTo(formatInputNumber(raw));  
                                  }}
                                  borderRadius="xl"
                                  bg="white"
                                  border="1px solid"
                                  borderColor="gray.200"
                                  h="12"
                                  _hover={{ 
                                    borderColor: 'blue.300',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                  }}
                                  _focus={{
                                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                                    borderColor: 'blue.400',
                                    transform: 'translateY(-1px)'
                                  }}
                                  transition="all 0.2s ease"
                                />
                                <InputRightElement h="12" pr={3} pointerEvents="none">
                                  <Text fontSize="sm" color="gray.500">so'm</Text>
                                </InputRightElement>
                              </InputGroup>
                            </FormControl>
                          </SimpleGrid>

                          <HStack w="100%" justify="end" mt={6}>
                            <Button
                              leftIcon={<FiRotateCcw />}
                              variant="ghost"
                              size="md"
                              onClick={clearFilters}
                              borderRadius="xl"
                              color="gray.600"
                              px={6}
                              _hover={{ 
                                bg: 'gray.100',
                                color: 'gray.700',
                                transform: 'translateY(-1px)'
                              }}
                              _active={{ transform: 'translateY(0)' }}
                              transition="all 0.2s ease"
                            >
                              Filtrlarni tozalash
                            </Button>
                          </HStack>
                        </Collapse>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Applications Table */}
                  {filteredOrders.length > 0 ? (
                    <>
                      {path_ads ? (
                        <ApplicationsTable orders={filteredOrders} onAction={openActionModal} />
                      ) : (
                        <OrdersTable orders={filteredOrders} onAction={openActionModal} />
                      )}
                    </>
                  ) : (
                    <Card borderRadius="xl" shadow="sm">
                      <CardBody p={12} textAlign="center">
                        <VStack spacing={4}>
                          <FiShoppingCart size="48" color="gray.400" />
                          <Text
                            fontSize="lg"
                            fontWeight="medium"
                            color="gray.500"
                          >
                            Arizalar topilmadi
                          </Text>
                          <Text color="gray.400">
                            Qidiruv parametrlarini o'zgartiring yoki yangi
                            buyurtma yarating
                          </Text>
                          <Button
                            colorScheme="blue"
                            leftIcon={<FiPlus />}
                            borderRadius="xl"
                          >
                            Buyurtma yaratish
                          </Button>
                        </VStack>
                      </CardBody>
                    </Card>
                  )}
                </VStack>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </VStack>

      {/* Action Modal */}
      <Modal isOpen={isActionModalOpen} onClose={onActionModalClose} size={'sm'}>
        <ModalOverlay />
        <ModalContent borderRadius="xl" m={3} w="full">
          <ModalHeader>
            {actionType === "restore"
              ? "Buyurtmani tiklash"
              : "Buyurtmani bekor qilish"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {actionType === "restore" ? (
              <VStack spacing={4} align="start">
                <Text>Buyurtmani qayta tiklashni xohlaysizmi?</Text>
                <Text fontSize="sm" color="gray.600">
                  Bu buyurtma faol holatga qaytariladi va yangi javoblar qabul
                  qila boshlaydi.
                </Text>
              </VStack>
            ) : (
              <VStack spacing={4} align="start">
                <Text>Bekor qilish sababini tanlang:</Text>
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
                  <FormLabel>Комментарий</FormLabel>
                  <Textarea
                    value={cancellationComment}
                    onChange={(e) => setCancellationComment(e.target.value)}
                    placeholder="Дополнительная информация..."
                  />
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onActionModalClose} pointerEvents="auto">
              Отмена
            </Button>
            <Button
              colorScheme={actionType === "restore" ? "green" : "red"}
              onClick={handleConfirmAction}
              pointerEvents="auto"
            >
              {actionType === "restore" ? "Восстановить" : "Отменить заказ"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}