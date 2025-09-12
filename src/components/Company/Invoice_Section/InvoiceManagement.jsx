import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useDisclosure,
  Icon,
  Flex,
  useToast,
  InputGroup,
  InputLeftAddon,
  Grid,
  Card,
  CardBody,
  Skeleton,
  SkeletonText,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiPlus,
  FiFileText,
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin
} from "react-icons/fi";
import { LuBuilding2 as FiBuilding } from "react-icons/lu";

import { useNavigate } from "react-router-dom";
import { Pagination } from "./Invoice_components/InvoicePagination";
import { InvoiceCard } from "./Invoice_components/IncoiceCard";
import { useTranslation } from "react-i18next";

// Mock data - 15ta invoice yaratamiz pagination ko'rish uchun
const generateMockInvoices = () => {
  const invoices = [];
  for (let i = 1; i <= 15; i++) {
    invoices.push({
      id: i,
      type: i % 2 === 0 ? "legal" : "individual",
      companyName: i % 2 === 0 ? `Tech Company ${i}` : `Foydalanuvchi ${i}`,
      tin: `${123456789 + i}`,
      address: `Tashkent, ${i}-tumani`,
      email: `user${i}@example.com`,
      phone: `+99890123456${i % 10}`,
      contact: `Kontakt ${i}`,
      postalAddress: `Tashkent 10000${i}`,
      status: "active",
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    });
  }
  return invoices;
};

const mockInvoices = generateMockInvoices();

// API Service - haqiqiy API integratsiyasi uchun
// const apiService = {
//   // API Base URL
//   baseURL: 'https://your-api-domain.com/api/v1',
  
//   // GET - Barcha invoicelarni olish
//   // Response format:
//   // {
//   //   success: true,
//   //   data: {
//   //     invoices: [
//   //       {
//   //         id: number,
//   //         type: "individual" | "legal",
//   //         companyName: string,
//   //         tin: string,
//   //         address: string,
//   //         email: string,
//   //         phone: string,
//   //         contact: string,
//   //         postalAddress: string,
//   //         status: "active" | "inactive",
//   //         createdAt: string (ISO date)
//   //       }
//   //     ],
//   //     pagination: {
//   //       currentPage: number,
//   //       totalPages: number,
//   //       totalItems: number,
//   //       itemsPerPage: number
//   //     }
//   //   },
//   //   message: string
//   // }
//   async getInvoices(page = 1, limit = 10, filters = {}) {
//     try {
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: limit.toString(),
//         ...filters
//       });
      
//       const response = await fetch(`${this.baseURL}/invoices?${params}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching invoices:', error);
//       throw error;
//     }
//   },

//   // POST - Yangi invoice yaratish
//   // Request body format:
//   // {
//   //   type: "individual" | "legal",
//   //   companyName: string,
//   //   tin: string,
//   //   address: string,
//   //   email: string,
//   //   phone?: string,
//   //   contact?: string,
//   //   postalAddress?: string
//   // }
//   async createInvoice(invoiceData) {
//     try {
//       const response = await fetch(`${this.baseURL}/invoices`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify(invoiceData)
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('Error creating invoice:', error);
//       throw error;
//     }
//   },

//   // PUT - Invoice yangilash
//   async updateInvoice(id, invoiceData) {
//     try {
//       const response = await fetch(`${this.baseURL}/invoices/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify(invoiceData)
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('Error updating invoice:', error);
//       throw error;
//     }
//   },

//   // DELETE - Invoice o'chirish
//   async deleteInvoice(id) {
//     try {
//       const response = await fetch(`${this.baseURL}/invoices/${id}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('Error deleting invoice:', error);
//       throw error;
//     }
//   }
// };



// Reusable form field component

const FormField = React.memo(
  ({
    label,
    placeholder,
    value,
    onChange,
    type = "text",
    leftAddon,
    icon,
    isRequired = false,
    pattern,
    maxLength
  }) => (
    <FormControl isRequired={isRequired}>
      <FormLabel fontWeight="medium" color="gray.700">
        {icon && <Icon as={icon} mr={2} />}
        {label}
      </FormLabel>
      <InputGroup>
        {leftAddon && <InputLeftAddon>{leftAddon}</InputLeftAddon>}
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          borderRadius="md"
          pattern={pattern}
          maxLength={maxLength}
          borderColor="gray.200"
          _focus={{
            borderColor: "#fed500",
            boxShadow: "0 0 0 1px #fed500",
          }}
          _hover={{
            borderColor: "gray.300",
          }}
        />
      </InputGroup>
    </FormControl>
  )
);

FormField.displayName = "FormField";

// Loading skeleton component
const InvoiceSkeleton = React.memo(() => (
  <Card>
    <CardBody>
      <Skeleton height="20px" mb={4} />
      <SkeletonText noOfLines={3} spacing={4} />
    </CardBody>
  </Card>
));

InvoiceSkeleton.displayName = "InvoiceSkeleton";


// Main component
const InvoiceManagement = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [invoices, setInvoices] = useState(mockInvoices);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [editingInvoice, setEditingInvoice] = useState(null);
  
  const { t } = useTranslation();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const toast = useToast();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    companyName: "",
    tin: "",
    address: "",
    email: "",
    phone: "",
    contact: "",
    postalAddress: "",
  });

  const bg = useColorModeValue("#fff", "#0a1221");
  const cardBg = useColorModeValue("white", "gray.800");

  // Memoized form reset
  const resetForm = useCallback(() => {
    setFormData({
      companyName: "",
      tin: "",
      address: "",
      email: "",
      phone: "",
      contact: "",
      postalAddress: "",
    });
    setEditingInvoice(null);
  }, []);

  // Handle form input changes
  const handleInputChange = useCallback(
    (field) => (e) => {
      let value = e.target.value;
      
      // INN va STIR uchun faqat raqamlar
      if (field === 'tin') {
        value = value.replace(/\D/g, ''); 
      }
      
      // Telefon raqam uchun faqat raqamlar
      if (field === 'phone') {
        value = value.replace(/\D/g, '');
      }
      
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  // Pagination calculations
  const paginationData = useMemo(() => {
    const filteredInvoices = invoices.filter((invoice) => invoice.status === "active");
    const totalItems = filteredInvoices.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentInvoices = filteredInvoices.slice(startIndex, endIndex);

    return {
      filteredInvoices,
      totalItems,
      totalPages,
      currentInvoices
    };
  }, [invoices, currentPage, itemsPerPage]);

  // Handle pagination
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleItemsPerPageChange = useCallback((newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    setLoading(true);

    try {
      // Simulate API call - haqiqiy ishlatish uchun apiService.createInvoice yoki updateInvoice ishlatiladi
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Haqiqiy API ishlatish uchun:
      // if (editingInvoice) {
      //   await apiService.updateInvoice(editingInvoice.id, {
      //     ...formData,
      //     type: activeTab === 0 ? "individual" : "legal"
      //   });
      // } else {
      //   await apiService.createInvoice({
      //     ...formData,
      //     type: activeTab === 0 ? "individual" : "legal"
      //   });
      // }

      const invoiceData = {
        ...formData,
        type: activeTab === 0 ? "individual" : "legal",
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
        id: editingInvoice ? editingInvoice.id : Date.now(),
      };

      if (editingInvoice) {
        setInvoices((prev) =>
          prev.map((invoice) =>
            invoice.id === editingInvoice.id ? invoiceData : invoice
          )
        );
        toast({
          title: t("Business_mode.invoice_section.updatedSuccessfully", "Успешно обновлено"),
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        setInvoices((prev) => [...prev, invoiceData]);
        toast({
          title: t("Business_mode.invoice_section.createdSuccessfully", "Успешно создано"),
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      resetForm();
      onClose();
    } catch (error) {
      toast({
        title: t("Business_mode.invoice_section.errorOccurred", "Ошибка"),
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [formData, activeTab, editingInvoice, resetForm, onClose, toast]);

  // Handle edit
  const handleEdit = useCallback(
    (invoice) => {
      setEditingInvoice(invoice);
      setFormData({
        companyName: invoice.companyName,
        tin: invoice.tin,
        address: invoice.address,
        email: invoice.email,
        phone: invoice.phone,
        contact: invoice.contact,
        postalAddress: invoice.postalAddress,
      });
      setActiveTab(invoice.type === "individual" ? 0 : 1);
      onOpen();
    },
    [onOpen]
  );

  // Handle delete
  const handleDelete = useCallback(
    async (id) => {
      try {
        // Simulate API call - haqiqiy ishlatish uchun:
        // await apiService.deleteInvoice(id);
        
        setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
        
        // Agar joriy sahifada hech qanday element qolmasa, oldingi sahifaga o'tish
        const remainingItems = paginationData.totalItems - 1;
        const maxPages = Math.ceil(remainingItems / itemsPerPage);
        if (currentPage > maxPages && maxPages > 0) {
          setCurrentPage(maxPages);
        }
        
        toast({
          title: t("Business_mode.invoice_section.deletedSuccessfully", "Успешно удалено"),
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: t("Business_mode.invoice_section.deleteError", "Ошибка при удалении"),
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [toast, currentPage, itemsPerPage, paginationData.totalItems]
  );

  // Handle modal open for new invoice
  const handleNewInvoice = useCallback(() => {
    resetForm();
    onOpen();
  }, [resetForm, onOpen]);

  // Form validation
  const isFormValid = useMemo(() => {
    const requiredFields = ["companyName", "tin", "address", "email"];
    return requiredFields.every((field) => formData[field].trim() !== "");
  }, [formData]);

  const FloatingButton = ({ handleCreate }) => {
    return (
      <Box
        position="fixed"
        bottom={"90px"}
        right="20px"
        zIndex="tooltip"
        display={{ base: isOpen ? "none" : "flex", sm: "none" }}
      >
        <IconButton
          _focus={{
            transform: "rotate(180deg)",
          }}
          icon={<FiPlus color="#fff" size={34} />}
          colorScheme="yellow"
          bg={"#fed500"}
          borderRadius="50%"
          onClick={handleCreate}
          minH={"60px"}
          minW={"60px"}
        />
      </Box>
    );
  };

  return (
    <Box minH="100vh" bg={bg} borderRadius={"lg"} shadow={"md"} mb={"40px"}>
      <FloatingButton handleCreate={handleNewInvoice} />
      <Container maxW={"full"} py={5}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={{base: 6, md: 10}}>
          <HStack>
            <IconButton
              aria-label="Orqaga"
              icon={<FiArrowLeft />}
              variant="ghost"
              size="lg"
              onClick={() => navigate(-1)}
            />
            <VStack align="start" spacing={0}>
              <Heading fontSize={"22px"} color="gray.800">
                {t("Business_mode.invoice_section.requisites", "Реквизиты")}
              </Heading>
              <Text fontSize="sm" color="gray.600">
                {t("Business_mode.invoice_section.totalRequisites_1", "Всего:")} {paginationData.totalItems} {t("Business_mode.invoice_section.totalRequisites_2", "активных реквизитов")}
              </Text>
            </VStack>
          </HStack>
          <Button
            leftIcon={<FiPlus />}
            bg="#fed500"
            color="black"
            display={{ base: "none", sm: "flex" }}
            _hover={{ bg: "#e6c200" }}
            _active={{ bg: "#ccad00" }}
            fontWeight="bold"
            px={6}
            onClick={handleNewInvoice}
          >
            {t("Business_mode.invoice_section.createNew", "Создать новый")}
          </Button>
        </Flex>

        {/* Empty state or invoices grid */}
        {paginationData.totalItems === 0 ? (
          <Card bg={cardBg} py={16}>
            <CardBody textAlign="center">
              <Icon as={FiFileText} boxSize={16} color="#fed500" mb={4} />
              <Heading size="md" mb={2} color="gray.600">
                {t("Business_mode.invoice_section.noInvoices", "У вас пока нет счетов")}
              </Heading>
              <Text color="gray.500" mb={6}>
                {t("Business_mode.invoice_section.noInvoicesDescription", "Чтобы добавить счет-фактуру, используйте кнопку \"Создать новый\" выше. После этого вы сможете добавить новый счет-фактуру.")}
              </Text>
              <Button
                leftIcon={<FiPlus />}
                bg="#fed500"
                color="black"
                _hover={{ bg: "#e6c200" }}
                onClick={handleNewInvoice}
              >
                {t("Business_mode.invoice_section.createInvoice", "Создать счет-фактуру")}
              </Button>
            </CardBody>
          </Card>
        ) : (
          <>
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                custom900: "1fr",
                custom1130: "repeat(2, 1fr)",
              }}
              gap={6}
            >
              {paginationData.currentInvoices.map((invoice) => (
                <InvoiceCard
                  key={invoice.id}
                  invoice={invoice}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </Grid>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={paginationData.totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              totalItems={paginationData.totalItems}
            />
          </>
        )}

        {/* Create/Edit Modal */}
        <Modal
          isOpen={isOpen}
          onClose={() => {
            onClose();
            resetForm();
          }}
          scrollBehavior="inside"
        >
          <ModalOverlay />
          <ModalContent mx={3} maxW={'800px'}>
            <ModalHeader>
              {editingInvoice
                ? t("Business_mode.invoice_section.editRequisites", "Редактировать реквизиты")
                : t("Business_mode.invoice_section.createNewAccount", "Создать новый счет")}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={6}>
                {/* Entity type tabs */}
                <Tabs
                  index={activeTab}
                  onChange={setActiveTab}
                  variant="enclosed"
                  w="full"
                >
                  <TabList>
                    <Tab
                      flex={1}
                      _selected={{
                        bg: "#fed500",
                        color: "black",
                        fontWeight: "bold",
                      }}
                      fontSize={'md'}
                    >
                      <Icon as={FiUser} mr={2} />
                      {t("Business_mode.invoice_section.individual", "Физическое лицо")}
                    </Tab>
                    <Tab
                      flex={1}
                      _selected={{
                        bg: "#fed500",
                        color: "black",
                        fontWeight: "bold",
                      }}
                      fontSize={'md'}
                    >
                      <Icon as={FiBuilding} mr={2} />
                      {t("Business_mode.invoice_section.legalEntity", "Юридическое лицо")}
                    </Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel px={0}>
                      <VStack spacing={4}>
                        <Grid
                          templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                          gap={4}
                          w="full"
                        >
                          <FormField
                            label={t("Business_mode.invoice_section.companyName", "Название компании")}
                            placeholder={t("Business_mode.invoice_section.companyNamePlaceholder", "Введите название компании")}
                            value={formData.companyName}
                            onChange={handleInputChange("companyName")}
                            icon={FiUser}
                            isRequired
                          />
                          <FormField
                            label={t("Business_mode.invoice_section.inn", "ИНН")}
                            placeholder={t("Business_mode.invoice_section.enterInn", "Введите ИНН")}
                            value={formData.tin}
                            onChange={handleInputChange("tin")}
                            isRequired
                            pattern="[0-9]*"
                            maxLength="9"
                          />
                        </Grid>

                        <Grid
                          templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                          gap={4}
                          w="full"
                        >
                          <FormField
                            label={t("Business_mode.invoice_section.legalAddress", "Юридический адрес")}
                            placeholder={t("Business_mode.invoice_section.enterAddress", "Введите юридический адрес")}
                            value={formData.address}
                            onChange={handleInputChange("address")}
                            icon={FiMapPin}
                            isRequired
                          />
                          <FormField
                            label={t("Business_mode.invoice_section.email", "Email")}
                            placeholder={t("Business_mode.invoice_section.enterEmail", "Введите email")}
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange("email")}
                            icon={FiMail}
                            isRequired
                          />
                        </Grid>

                        <Grid
                          templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                          gap={4}
                          w="full"
                        >
                          <FormField
                            label={t("Business_mode.invoice_section.phoneNumber", "Номер телефона")}
                            placeholder={t("Business_mode.invoice_section.enterPhoneNumber", "Введите номер телефона")}
                            value={formData.phone}
                            onChange={handleInputChange("phone")}
                            leftAddon="+998"
                            icon={FiPhone}
                            pattern="[0-9]*"
                            maxLength="9"
                          />
                          <FormField
                            label={t("Business_mode.invoice_section.contactPerson", "Контактный человек")}
                            placeholder={t("Business_mode.invoice_section.enterFullName", "Введите Ф.И.О.")}
                            value={formData.contact}
                            onChange={handleInputChange("contact")}
                            icon={FiUser}
                          />
                        </Grid>

                        <FormField
                          label={t("Business_mode.invoice_section.postalAddress", "Почтовый адрес")}
                          placeholder={t("Business_mode.invoice_section.enterPostalAddress", "Введите почтовый адрес")}
                          value={formData.postalAddress}
                          onChange={handleInputChange("postalAddress")}
                          icon={FiMapPin}
                        />
                      </VStack>
                    </TabPanel>

                    <TabPanel px={0}>
                      <VStack spacing={4}>
                        <Grid
                          templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                          gap={4}
                          w="full"
                        >
                          <FormField
                            label={t("Business_mode.invoice_section.companyName", "Название компании")}
                            placeholder={t("Business_mode.invoice_section.enterName", "Введите название компании")}
                            value={formData.companyName}
                            onChange={handleInputChange("companyName")}
                            icon={FiBuilding}
                            isRequired
                          />
                          <FormField
                            label={t("Business_mode.invoice_section.stir", "СТИР")}
                            placeholder={t("Business_mode.invoice_section.enterStir", "Введите СТИР")}
                            value={formData.tin}
                            onChange={handleInputChange("tin")}
                            isRequired
                            pattern="[0-9]*"
                            maxLength="9"
                          />
                        </Grid>

                        <Grid
                          templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                          gap={4}
                          w="full"
                        >
                          <FormField
                            label={t("Business_mode.invoice_section.legalAddress", "Юридический адрес")}
                            placeholder={t("Business_mode.invoice_section.enterAddress", "Введите юридический адрес")}
                            value={formData.address}
                            onChange={handleInputChange("address")}
                            icon={FiMapPin}
                            isRequired
                          />
                          <FormField
                            label={t("Business_mode.invoice_section.email", "Email")}
                            placeholder={t("Business_mode.invoice_section.enterEmail", "Введите email")}
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange("email")}
                            icon={FiMail}
                            isRequired
                          />
                        </Grid>

                        <Grid
                          templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                          gap={4}
                          w="full"
                        >
                          <FormField
                            label={t("Business_mode.invoice_section.phoneNumber", "Номер телефона")}
                            placeholder={t("Business_mode.invoice_section.enterPhoneNumber", "Введите номер телефона")}
                            value={formData.phone}
                            onChange={handleInputChange("phone")}
                            leftAddon="+998"
                            icon={FiPhone}
                            pattern="[0-9]*"
                            maxLength="9"
                          />
                          <FormField
                            label={t("Business_mode.invoice_section.contactPerson", "Контактный человек")}
                            placeholder={t("Business_mode.invoice_section.enterFullName", "Введите Ф.И.О.")}
                            value={formData.contact}
                            onChange={handleInputChange("contact")}
                            icon={FiUser}
                          />
                        </Grid>

                        <FormField
                          label={t("Business_mode.invoice_section.postalAddress", "Почтовый адрес")}
                          placeholder={t("Business_mode.invoice_section.postalAddress", "Введите почтовый адрес")}
                          value={formData.postalAddress}
                          onChange={handleInputChange("postalAddress")}
                          icon={FiMapPin}
                        />
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>

                {/* Submit button */}
                <Button
                  bg="#fed500"
                  color="black"
                  _hover={{ bg: "#e6c200" }}
                  _active={{ bg: "#ccad00" }}
                  size="lg"
                  w="full"
                  fontWeight="bold"
                  isLoading={loading}
                  loadingText={
                    editingInvoice ? t("Business_mode.invoice_section.updating", "Обновляется...") : t("Business_mode.invoice_section.saving", "Сохраняется...")
                  }
                  onClick={handleSubmit}
                  isDisabled={!isFormValid}
                >
                  {editingInvoice ? t("Business_mode.invoice_section.update", "Обновить") : t("Business_mode.invoice_section.save", "Сохранить")}
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default InvoiceManagement;