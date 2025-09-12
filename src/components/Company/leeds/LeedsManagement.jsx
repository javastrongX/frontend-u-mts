import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Select,
  Flex,
  Text,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Card,
  CardBody,
  Heading,
  HStack,
  VStack,
  Tooltip,
  SimpleGrid,
  Badge,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiPhone,
  FiUser,
  FiEdit3,
  FiEye,
  FiSearch,
  FiCalendar,
  FiMessageCircle,
  FiCheckCircle,
  FiClock,
  FiX,
  FiRefreshCw,
  FiGlobe,
} from "react-icons/fi";
import { SiInstatus } from "react-icons/si";
import { MdAdsClick } from "react-icons/md";
import { LeedsCard } from "./LeedsCard";
import { LeadEditForm } from "./LeadEditForm";
import LeadsPagination from "./LeadsPagination";
import LeadFIlter from "./LeadFIlter";
import { useTranslation } from "react-i18next";

// Mock data with Uzbek phone numbers - bu real APIdan keladigan data bo'ladi
const mockLeads = [
  {
    id: 1,
    phoneNumber: "+998 (90) 123-45-67",
    name: "Alisher Karimov",
    comment: "Yangi mahsulot haqida ma'lumot olmoqchi",
    status: "completed",
    date: "2024-08-20 14:30",
  },
  {
    id: 2,
    phoneNumber: "+998 (91) 234-56-78",
    name: "Nodira Abdullayeva",
    comment: "Narx bo'yicha savol",
    status: "cancelled",
    date: "2024-08-20 13:15",
  },
  {
    id: 3,
    phoneNumber: "+998 (93) 345-67-89",
    name: "Bobur Umarov",
    comment: "Xizmat ko'rsatish haqida",
    status: "waiting",
    date: "2024-08-20 12:45",
  },
  {
    id: 4,
    phoneNumber: "+998 (94) 456-78-90",
    name: "Zilola Tosheva",
    comment: "Demo so'ramoqchi",
    status: "completed",
    date: "2024-08-20 11:20",
  },
  {
    id: 5,
    phoneNumber: "+998 (95) 567-89-01",
    name: "Anvar Karimov",
    comment: "Mahsulot haqida batafsil ma'lumot kerak",
    status: "waiting",
    date: "2024-08-20 10:15",
  },
  {
    id: 6,
    phoneNumber: "+998 (97) 678-90-12",
    name: "Gulnora Rashidova",
    comment: "Chegirma bor mi?",
    status: "completed",
    date: "2024-08-20 09:30",
  },
  {
    id: 7,
    phoneNumber: "+998 (98) 789-01-23",
    name: "Sardor Nazarov",
    comment: "O'rnatish xizmati kerakmi?",
    status: "cancelled",
    date: "2024-08-20 08:45",
  },
  {
    id: 8,
    phoneNumber: "+998 (99) 890-12-34",
    name: "Mavluda Ismoilova",
    comment: "Yetkazib berish narxi qancha?",
    status: "waiting",
    date: "2024-08-20 07:20",
  },
];

const sourceColors = {
  Website: "purple",
  Telegram: "blue",
  Facebook: "cyan",
  Instagram: "pink",
  WhatsApp: "green",
};

// Custom hook for responsive breakpoints
const useCustomBreakpoints = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1450
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    isLargeScreen: windowWidth >= 1450,
    isMobileCard: windowWidth < 1050,
    isMobile: windowWidth < 768 && windowWidth < 1050,
    isSmMobile: windowWidth < 570 && windowWidth < 768,
  };
};

const LeadsManagement = () => {
  const [leads, setLeads] = useState([]);
  const [totalCount, setTotalCount] = useState(0); // API'dan keladigan umumiy lidlar soni
  const [phoneFilter, setPhoneFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { t } = useTranslation();

  const statusConfig = {
    completed: {
      label: t("Business_mode.dashboard.complated", "Выполнено"),
      color: "green",
      textColor: "#fff",
      bg: "linear-gradient(135deg, #56ab2f, #a3e652)",
      icon: FiCheckCircle,
    },
    waiting: {
      label: t("Business_mode.dashboard.waiting", "В ожидании"),
      color: "orange",
      textColor: "#000",
      bg: "linear-gradient(135deg, #ffff00, #ffa600)",
      icon: FiClock,
    },
    cancelled: {
      label: t("Business_mode.dashboard.cancelled", "Отменено"),
      color: "red",
      textColor: "#fff",
      bg: "linear-gradient(135deg, #ff4b2b, #ff416c)",
      icon: FiX,
    },
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Hozircha 5 ta, keyin o'zgartirish mumkin
  const totalPagesNum = useMemo(
    () => Math.ceil(totalCount / itemsPerPage),
    [totalCount, itemsPerPage]
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { isLargeScreen, isMobileCard, isMobile, isSmMobile } = useCustomBreakpoints();

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // API dan lidlarni yuklash funksiyasi
  const loadLeads = async (page = 1, filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      // API chaqiruvi - real API'da shu formatda bo'lishi kerak:
      /*
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // agar auth kerak bo'lsa
        },
        body: JSON.stringify({
          page,
          limit: perPage,
          filters: {
            phone: filters.phone || phoneFilter,
            status: filters.status || statusFilter === 'all' ? null : statusFilter,
            // boshqa filterlar ham qo'shishingiz mumkin
            search: filters.search || '',
            dateFrom: filters.dateFrom || null,
            dateTo: filters.dateTo || null,
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('Server xatoligi');
      }
      
      const data = await response.json();
      
      // API response format bo'lishi kerak:
      setLeads(data.data);
      setTotalCount(data.total);
      setCurrentPage(data.page);
      // setItemsPerPage(data.limit); // agar server tomondan o'zgartirilsa
      */

      // Hozircha mock data bilan simulation qilish
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Client-side pagination (faqat development uchun)
      const filteredMockLeads = mockLeads.filter((lead) => {
        const phoneMatch =
          lead.phoneNumber
            .toLowerCase()
            .includes((filters.phone || phoneFilter).toLowerCase()) ||
          lead.name
            .toLowerCase()
            .includes((filters.phone || phoneFilter).toLowerCase());
        const statusMatch =
          (filters.status || statusFilter) === "all" ||
          lead.status === (filters.status || statusFilter);
        return phoneMatch && statusMatch;
      });

      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedLeads = filteredMockLeads.slice(startIndex, endIndex);

      // Mock API response format:
      setLeads(paginatedLeads);
      setTotalCount(filteredMockLeads.length);
    } catch (err) {
      setError(t("Business_mode.Leeds.leadLoadError", "Ошибка при загрузке лидов"));
      console.error("Error loading leads:", err);
    } finally {
      setLoading(false);
    }
  };

  // Component yuklanganda va filter o'zgarganida API chaqirish
  useEffect(() => {
    loadLeads(currentPage);
  }, [currentPage]);

  // Filter o'zgarganida birinchi sahifaga o'tish
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      loadLeads(1);
    }
  }, [phoneFilter, statusFilter]);

  useEffect(() => {
    // Agar sahifalar soni o'zgarganda hozirgi sahifa mavjud bo'lmasa, oxirgi sahifaga o'tish
    const newTotalPages = Math.ceil(totalCount / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    } else {
      loadLeads(
        currentPage,
        { phone: phoneFilter, status: statusFilter },
        itemsPerPage
      );
    }
  }, [itemsPerPage]);

  // Pagination calculations
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  // Status o'zgartirish funksiyasi
  const handleStatusChange = async (leadId, newStatus) => {
    try {
      // API chaqiruvi - real API'da:
      /*
      const response = await fetch(`/api/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error('Status o\'zgartirishda xatolik');
      }
      
      // Agar status muvaffaqiyatli o'zgartirilsa:
      // Optimistic update - darhol UI'ni yangilash
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      );
      */

      // Mock update
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      );

      toast({
        title: t("Business_mode.Leeds.statusChanged", "Статус изменен"),
        description: t("Business_mode.Leeds.leadStatusChanged", "Lead holati ${statusConfig[newStatus].label} ga o'zgartirildi"),
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: t("Business_mode.Leeds.error", "Ошибка"),
        description: t("Business_mode.Leeds.statusChangeError", "Statusni o'zgartirishda xatolik yuz berdi"),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Lead ma'lumotlarini yangilash funksiyasi
  const handleUpdateLead = async (updatedLead) => {
    try {
      // API chaqiruvi - real API'da:
      /*
      const response = await fetch(`/api/leads/${updatedLead.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedLead)
      });
      
      if (!response.ok) {
        throw new Error('Ma\'lumot yangilashda xatolik');
      }
      
      const result = await response.json();
      
      // Optimistic update
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead.id === updatedLead.id ? result.data : lead
        )
      );
      */

      // Mock update
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === updatedLead.id ? updatedLead : lead
        )
      );

      toast({
        title: t("Business_mode.Leeds.dataUpdated", "Данные лида успешно обновлены"),
        description: t("Business_mode.Leeds.leadDataUpdated", "Данные лида успешно обновлены"),
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      closeModal();
    } catch (error) {
      toast({
        title: t("Business_mode.Leeds.error", "Ошибка"),
        description: t("Business_mode.Leeds.dataUpdateError", "Ma'lumotni yangilashda xatolik yuz berdi"),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const openModal = (lead) => {
    setSelectedLead(lead);
    onOpen();
  };

  const closeModal = () => {
    setSelectedLead(null);
    onClose();
  };

  const handleRefresh = () => {
    loadLeads(
      currentPage,
      { phone: phoneFilter, status: statusFilter },
      itemsPerPage
    );
  };

  // Pagination handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPrevPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  // Pagination range calculator
  const getPaginationRange = () => {
    const range = [];
    const showPages = 5; // Ko'rsatiladigan sahifalar soni

    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  if (error) {
    return (
      <Box maxW={"full"} py={8}>
        <Alert status="error" borderRadius="xl" p={6}>
          <AlertIcon />
          <Box>
            <AlertTitle>{t("Business_mode.Leeds.error", "Ошибка")}!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Box>
        </Alert>
        <Button
          mt={4}
          onClick={handleRefresh}
          leftIcon={<FiRefreshCw />}
          bg="#fed500"
          color="black"
          _hover={{ bg: "#e5bf00" }}
        >
          {t("Business_mode.Leeds.retry", "Повторить")}
        </Button>
      </Box>
    );
  }

  return (
    <Box minH="100vh" px={3}>
      <Box maxW={"full"} pb={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign={isMobile ? "center" : "left"}>
            <Heading
              fontSize={isMobile ? "22px" : "28px"}
              color="gray.800"
              mb={3}
              bgGradient="linear(to-r, gray.800, #fed500)"
              bgClip="text"
            >
              {t("Business_mode.Leeds.leadsManagement", "Управление лидами")}
            </Heading>
            <Text color="gray.600" fontSize={isMobile ? "sm" : "lg"}>
              {t("Business_mode.Leeds.leadsManagementDescription", "Просматривайте и управляйте всеми лидами")}
            </Text>
          </Box>

          {/* Stats Cards - Only for larger screens */}
          {isLargeScreen && (
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} mb={4}>
              {Object.entries(statusConfig).map(([key, config]) => {
                // Real API'da bu ma'lumotlar alohida endpoint'dan kelishi kerak
                // GET /api/leads/stats
                const count = mockLeads.filter(
                  (lead) => lead.status === key
                ).length;
                const StatusIcon = config.icon;

                return (
                  <Card key={key} bg={cardBg} borderRadius="xl" shadow="md">
                    <CardBody p={4}>
                      <HStack justify="space-between">
                        <VStack align="start" spacing={1}>
                          <Text fontSize="sm" color="gray.600">
                            {config.label}
                          </Text>
                          <Text
                            fontSize="2xl"
                            fontWeight="bold"
                            color={`${config.color}.500`}
                          >
                            {count}
                          </Text>
                        </VStack>
                        <Box p={3} bg={`${config.color}.100`} borderRadius="lg">
                          <StatusIcon
                            size={24}
                            color={`var(--chakra-colors-${config.color}-500)`}
                          />
                        </Box>
                      </HStack>
                    </CardBody>
                  </Card>
                );
              })}
            </SimpleGrid>
          )}

          {/* Filters */}
          <LeadFIlter
            cardBg={cardBg}
            handleRefresh={handleRefresh}
            loading={loading}
            isMobile={isMobile}
            phoneFilter={phoneFilter}
            setPhoneFilter={setPhoneFilter}
            setStatusFilter={setStatusFilter}
            statusFilter={statusFilter}
            statusConfig={statusConfig}
          />

          {/* Results count and pagination info */}
          <Flex
            justify="space-between"
            align="center"
            px={2}
            flexWrap="wrap"
            gap={4}
          >
            <Text color="gray.600" fontSize="lg" fontWeight="500">
              {t("Business_mode.Leeds.totalLeads", "Всего")}{" "}
              <Text as="span" color="#fed500" fontWeight="bold">
                {totalCount}
              </Text>{" "}
              {t("Business_mode.Leeds.leadsCount", "лидов")},
              <Text as="span" color="gray.500" ml={2}>
                {startItem}-{endItem} {t("Business_mode.Leeds.leadsCount", "лидов")} {t("Business_mode.Leeds.showingItems", "показано")}
              </Text>
            </Text>

            {loading && (
              <HStack spacing={2}>
                <Box
                  w={3}
                  h={3}
                  bg="#fed500"
                  borderRadius="full"
                  animation="pulse 2s infinite"
                />
                <Text fontSize="sm" color="#fed500" fontWeight="600">
                  {t("Business_mode.Leeds.loading", "Загрузка...")}
                </Text>
              </HStack>
            )}

            {/* Items per page selector */}
            <HStack spacing={2}>
              <Text fontSize="sm" color="gray.600">
                {t("Business_mode.Leeds.onPage", "На странице:")}
              </Text>
              <Select
                size="sm"
                w="80px"
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                disabled={totalPagesNum <= 1}
                focusBorderColor="#fed500"
                _focus={{
                  borderColor: "#fed500",
                }}
                borderRadius={"md"}
              >
                <option value={1}>1</option>
                {totalPagesNum >= 2 && <option value={2}>2</option>}
                {totalPagesNum >= 5 && <option value={5}>5</option>}
                {totalPagesNum >= 10 && <option value={10}>10</option>}
                {totalPagesNum >= 20 && <option value={20}>20</option>}
                {totalPagesNum >= 30 && <option value={30}>30</option>}
                {totalPagesNum >= 40 && <option value={40}>40</option>}
                {totalPagesNum >= 50 && <option value={50}>50</option>}
              </Select>
            </HStack>
          </Flex>

          {/* Loading skeleton */}
          {loading && (
            <VStack spacing={4}>
              {[...Array(itemsPerPage)].map((_, i) => (
                <Skeleton key={i} height="120px" borderRadius="xl" />
              ))}
            </VStack>
          )}

          {/* Table for large screens (≥1450px) */}
          {isLargeScreen && !loading && (
            <Card
              bg={cardBg}
              borderRadius="xl"
              shadow="lg"
              overflow="hidden"
              border={"1px solid"}
              borderColor={"#cdcdcd"}
            >
              <Box overflowX="auto">
                <Table variant="simple" size="lg">
                  <Thead bg="#fffcf5">
                    <Tr borderBottom={"2px solid #cdcdcd"}>
                      <Th
                        color="gray.600"
                        fontSize="sm"
                        fontWeight="700"
                        py={4}
                      >
                        №
                      </Th>
                      <Th color="gray.600" fontSize="sm" fontWeight="700">
                        <HStack spacing={2}>
                          <FiPhone size={16} />
                          <Text fontSize={"sm"}>{t("Business_mode.Leeds.phone", "Телефон")}</Text>
                        </HStack>
                      </Th>
                      <Th color="gray.600" fontSize="sm" fontWeight="700">
                        <HStack spacing={2}>
                          <FiUser size={16} />
                          <Text>{t("Business_mode.Leeds.name", "Имя")}</Text>
                        </HStack>
                      </Th>
                      <Th color="gray.600" fontSize="sm" fontWeight="700">
                        <HStack spacing={2}>
                          <FiMessageCircle size={16} />
                          <Text>{t("Business_mode.Leeds.note", "Примечание")}</Text>
                        </HStack>
                      </Th>
                      <Th color="gray.600" fontSize="sm" fontWeight="700">
                        <HStack spacing={2}>
                          <Box as={SiInstatus} />
                          <Text>{t("Business_mode.Leeds.status", "Статус")}</Text>
                        </HStack>
                      </Th>
                      <Th color="gray.600" fontSize="sm" fontWeight="700">
                        <HStack spacing={2}>
                          <FiCalendar size={16} />
                          <Text>{t("Business_mode.Leeds.date", "Дата")}</Text>
                        </HStack>
                      </Th>
                      <Th color="gray.600" fontSize="sm" fontWeight="700">
                        <HStack spacing={2}>
                          <MdAdsClick size={16} />
                          <Text>{t("Business_mode.Leeds.actions", "Действия")}</Text>
                        </HStack>
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {leads.map((lead, index) => {
                      const sourceColor = sourceColors[lead.source] || "gray";
                      const globalIndex =
                        (currentPage - 1) * itemsPerPage + index + 1;

                      return (
                        <Tr
                          key={lead.id}
                          _hover={{ bg: "gray.50" }}
                          borderBottom="2px solid"
                          borderColor="#cdcdcd"
                        >
                          <Td
                            fontWeight="600"
                            color="gray.700"
                            fontSize="sm"
                            py={4}
                            cursor={"pointer"}
                            onClick={() => openModal(lead)}
                          >
                            #{String(globalIndex).padStart(3, "0")}
                          </Td>
                          <Td
                            cursor={"pointer"}
                            onClick={() => openModal(lead)}
                          >
                            <Text
                              fontFamily="mono"
                              fontWeight="600"
                              color="blue.500"
                              fontSize="sm"
                              whiteSpace={"nowrap"}
                            >
                              {lead.phoneNumber}
                            </Text>
                          </Td>
                          <Td
                            cursor={"pointer"}
                            onClick={() => openModal(lead)}
                          >
                            <Text
                              fontWeight="600"
                              color="gray.800"
                              fontSize="sm"
                            >
                              {lead.name}
                            </Text>
                          </Td>
                          <Td
                            maxW="200px"
                            minW={"200px"}
                            cursor={"pointer"}
                            onClick={() => openModal(lead)}
                          >
                            {lead.comment.length > 30 ? (
                              <Tooltip
                                hasArrow
                                label={lead.comment}
                                placement="top"
                                shouldWrapChildren
                                bg={"#ffffff25"}
                                backdropFilter={"blur(6px)"}
                                border="1px solid"
                                borderColor="gray.400"
                                borderRadius="lg"
                                px={3}
                                py={2}
                                fontSize="sm"
                                fontWeight="500"
                                color="gray.700"
                                sx={{
                                  "--popper-arrow-bg": "white",
                                }}
                              >
                                <Text
                                  color="gray.600"
                                  noOfLines={2}
                                  fontSize="sm"
                                >
                                  {lead.comment}
                                </Text>
                              </Tooltip>
                            ) : (
                              <Text
                                color="gray.600"
                                noOfLines={2}
                                fontSize="sm"
                                cursor={"pointer"}
                                onClick={() => openModal(lead)}
                              >
                                {lead.comment}
                              </Text>
                            )}
                          </Td>
                          <Td>
                            <Select
                              size="sm"
                              value={lead.status}
                              onChange={(e) =>
                                handleStatusChange(lead.id, e.target.value)
                              }
                              focusBorderColor="#fed500"
                              maxW="140px"
                              minW={"120px"}
                              fontSize="sm"
                              borderRadius="lg"
                            >
                              {Object.entries(statusConfig).map(
                                ([key, config]) => (
                                  <option key={key} value={key}>
                                    {config.label}
                                  </option>
                                )
                              )}
                            </Select>
                          </Td>
                          <Td
                            textAlign="center"
                            cursor={"pointer"}
                            onClick={() => openModal(lead)}
                          >
                            <Text
                              fontSize="sm"
                              color="gray.600"
                              fontWeight="500"
                            >
                              {lead.date}
                            </Text>
                          </Td>
                          <Td textAlign="center">
                            <Tooltip
                              label={t("Business_mode.Leeds.viewEdit", "Просмотр и редактирование")}
                              placement="top"
                              hasArrow
                              borderRadius="lg"
                            >
                              <IconButton
                                aria-label="Ko'rish"
                                icon={<FiEye />}
                                size="sm"
                                bg="linear-gradient(135deg, #ffff00, #ffa600)"
                                color="black"
                                _hover={{ bg: "#e5bf00" }}
                                onClick={() => openModal(lead)}
                                borderRadius="lg"
                              />
                            </Tooltip>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </Box>
            </Card>
          )}

          {/* Cards view for medium and mobile screens (<1450px) */}
          {!isLargeScreen && !loading && (
            <SimpleGrid
              columns={isMobileCard ? 1 : 2}
              spacing={isMobileCard ? 4 : 6}
            >
              <LeedsCard
                filteredLeads={leads}
                statusConfig={statusConfig}
                cardBg={cardBg}
                sourceColors={sourceColors}
                borderColor={borderColor}
                handleStatusChange={handleStatusChange}
                openModal={openModal}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
              />
            </SimpleGrid>
          )}

          {/* Pagination */}
          <LeadsPagination
            currentPage={currentPage}
            totalPages={totalPagesNum}
            totalCount={totalCount}
            loading={loading}
            getPaginationRange={getPaginationRange}
            isSmMobile={isSmMobile}
            cardBg={cardBg}
            goToFirstPage={goToFirstPage}
            goToLastPage={goToLastPage}
            goToNextPage={goToNextPage}
            goToPrevPage={goToPrevPage}
            startItem={startItem}
            endItem={endItem}
            goToPage={goToPage}
          />

          {/* Empty state */}
          {leads.length === 0 && !loading && (
            <Card bg={cardBg} borderRadius="xl" shadow="lg">
              <CardBody p={12} textAlign="center">
                <VStack spacing={4}>
                  <Box p={4} bg="gray.100" borderRadius="full">
                    <FiSearch size={32} color="gray.400" />
                  </Box>
                  <Text color="gray.500" fontSize="xl" fontWeight="600">
                    {t("Business_mode.Leeds.noLeadsFound", "Лиды не найдены")}
                  </Text>
                  <Text color="gray.400" fontSize="md">
                    {t("Business_mode.Leeds.tryAdjustingFilters", "Измените фильтры и попробуйте снова")}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          )}
        </VStack>
      </Box>

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        size={isMobile ? "full" : "lg"}
        motionPreset={isMobile ? "slideInBottom" : "scale"}
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent
          mx={isMobile ? 0 : 10}
          my={isMobile ? 0 : 10}
          borderRadius={isMobile ? "none" : "xl"}
        >
          <ModalHeader borderBottom="1px solid" borderColor="gray.200">
            <HStack spacing={3}>
              <Box p={2} bg="#fed500" borderRadius="lg">
                <FiEdit3 size={18} color="black" />
              </Box>
              <Text fontSize="lg" fontWeight="700">
                {t("Business_mode.Leeds.leadDetails", "Данные лида")}
              </Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedLead && (
              <LeadEditForm
                lead={selectedLead}
                onUpdate={handleUpdateLead}
                onCancel={closeModal}
                isMobile={isMobile}
                statusConfig={statusConfig}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default LeadsManagement;
