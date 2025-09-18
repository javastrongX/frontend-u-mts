import { useCallback, useState, useMemo, memo, lazy, Suspense } from "react";
import {
  Box,
  Grid,
  GridItem,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  IconButton,
  Badge,
  Image,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  SimpleGrid,
  Flex,
  Card,
  CardBody,
  useColorModeValue,
  Skeleton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  useToast,
  Link,
  Icon,
  useBreakpointValue,
  Portal,
  Spinner,
} from "@chakra-ui/react";
import {
  FaShare,
  FaWhatsapp,
  FaTelegram,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEye,
  FaTruck,
  FaChevronRight,
  FaCopy,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaFlag,
} from "react-icons/fa";
import { ReportModal } from "../../components/ReportModal/ReportModal";
import { useTranslation } from "react-i18next";
import ContactBottomModal from "../HotOfferDetail/ContactBottomModal";
import { FiMessageCircle, FiPhone } from "react-icons/fi";
import { CallbackModal } from "../../components/CallbackModal";
import { useAuth } from "../Auth/logic/AuthContext";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { orderData, relatedOrders } from "./constants/mockdata";
import  CustomerInfo  from "./CustomerInfo";
import { useStats } from "../../components/PostStats";


// Valyuta malumotlari
const CURRENCIES = [
  {
    id: 'uzs',
    symbol: "so'm",
  },
  {
    id: 'usd',
    symbol: '$',
  },
  {
    id: 'eur',
    symbol: '€',
  },
  {
    id: 'rub',
    symbol: '₽',
  }
];

// Utility functions - memoized
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("ru", { month: "long" });
  const time = date.toLocaleTimeString("ru", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${day} ${month} ${time}`;
};


// Memoized Breadcrumb Component
const BreadcrumbNav = memo(({ t, title = "Бортовые грузовики" }) => {
  const cardBg = useColorModeValue("white", "gray.800");

  return (
    <Box
      mt={3}
      bg={cardBg}
      borderBottom="1px"
      borderColor="gray.200"
      shadow="sm"
      borderRadius="md"
    >
      <Box w="100%" px={{ base: 3, sm: 4, md: 6 }} py={{ base: 3, md: 4 }}>
        <Breadcrumb
          spacing={{ base: 1, sm: 2 }}
          separator={<FaChevronRight color="gray.500" size="12px" />}
          fontSize={{ base: "xs", sm: "sm" }}
          color="gray.600"
          overflowX="auto"
          whiteSpace="nowrap"
        >
          <BreadcrumbItem flexShrink={0}>
            <BreadcrumbLink
              href="/"
              _hover={{ color: "blue.400" }}
              transition="color 0.2s"
              fontSize={{ base: "xs", sm: "sm" }}
            >
              {t("second_nav.home", "Главная")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem flexShrink={0}>
            <BreadcrumbLink
              href="/orders"
              _hover={{ color: "blue.400" }}
              transition="color 0.2s"
              fontSize={{ base: "xs", sm: "sm" }}
              isTruncated
              maxW={{ base: "120px", sm: "200px" }}
            >
              {t("second_nav.announcement", "Заказы")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage flexShrink={0}>
            <BreadcrumbLink
              color="blue.400"
              fontWeight="medium"
              fontSize={{ base: "xs", sm: "sm" }}
              isTruncated
              maxW={{ base: "100px", sm: "150px" }}
            >
              <Text noOfLines={1}>{title}</Text>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>
    </Box>
  );
});

BreadcrumbNav.displayName = "BreadcrumbNav";

// Memoized Share Modal Component
const ShareModal = memo(({ isOpen, onClose, t }) => {
  const toast = useToast();

  // Memoize current URL to prevent recalculation
  const currentUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  }, []);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast({
        title: t("hotOfferDetail.share_msg", "Ссылка скопирована!"),
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      onClose();
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }, [currentUrl, toast, onClose, t]);

  // Memoize share options to prevent recreation
  const shareOptions = useMemo(
    () => [
      {
        name: "WhatsApp",
        icon: FaWhatsapp,
        color: "green.500",
        url: `https://wa.me/?text=${encodeURIComponent(currentUrl)}`,
      },
      {
        name: "Telegram",
        icon: FaTelegram,
        color: "blue.400",
        url: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}`,
      },
      {
        name: "Facebook",
        icon: FaFacebook,
        color: "blue.400",
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          currentUrl
        )}`,
      },
      {
        name: "Twitter",
        icon: FaTwitter,
        color: "blue.400",
        url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          currentUrl
        )}`,
      },
      {
        name: "LinkedIn",
        icon: FaLinkedin,
        color: "blue.700",
        url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          currentUrl
        )}`,
      },
      {
        name: "Email",
        icon: FaEnvelope,
        color: "gray.600",
        url: `mailto:?body=${encodeURIComponent(currentUrl)}`,
      },
    ],
    [currentUrl]
  );

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent borderRadius="2xl" mx={4}>
        <ModalHeader pb={2}>
          <HStack spacing={3}>
            <Box p={2} bg="blue.50" borderRadius="lg">
              <FaShare color="#4299E1" />
            </Box>
            <Text>{t("orderdetail.share_order", "Поделиться заказом")}</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Box w="full" p={4} bg="gray.50" borderRadius="xl">
              <Text fontSize="sm" color="gray.600" mb={2}>
                {t("orderdetail.link_order", "Ссылка на заказ:")}
              </Text>
              <HStack>
                <Input
                  value={currentUrl}
                  isReadOnly
                  bg="white"
                  size="sm"
                  borderRadius="lg"
                />
                <IconButton
                  icon={<FaCopy />}
                  onClick={copyToClipboard}
                  color="blue.400"
                  _hover={{ bg: "blue.50" }}
                  bg="transparent"
                  size="sm"
                  borderRadius="lg"
                  aria-label="Copy link"
                />
              </HStack>
            </Box>

            <Box w="full">
              <Text fontSize="sm" color="gray.600" mb={3}>
                {t("orderdetail.directly_share", "Поделиться через:")}
              </Text>
              <SimpleGrid columns={{ base: 2, custom400: 3 }} spacing={3}>
                {shareOptions.map((option) => (
                  <Button
                    key={option.name}
                    as={Link}
                    href={option.url}
                    target="_blank"
                    leftIcon={<Icon as={option.icon} />}
                    variant="outline"
                    size="sm"
                    borderRadius="xl"
                    _hover={{
                      bg: `${option.color.split(".")[0]}.50`,
                      borderColor: option.color,
                    }}
                    color={option.color}
                    borderColor="gray.200"
                  >
                    {option.name}
                  </Button>
                ))}
              </SimpleGrid>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={onClose}
            colorScheme="blue"
            color={"blue.400"}
            variant="ghost"
            borderRadius="xl"
          >
            {t("orderdetail.cancel", "Закрыть")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

ShareModal.displayName = "ShareModal";

// Memoized Order Header Component
const OrderHeader = memo(({ onShare, onReport, t }) => {
  return (
    <Flex
      justify="space-between"
      align="flex-start"
      mb={6}
      flexWrap="wrap"
      gap={3}
    >
      <HStack spacing={3} flexWrap="wrap">
        <Badge
          colorScheme="orange"
          px={4}
          py={2}
          borderRadius="full"
          fontSize="sm"
          fontWeight="medium"
          textTransform="none"
        >
          {t("orderdetail.order", "Заказ")}
        </Badge>
        <Badge
          colorScheme="green"
          px={4}
          py={2}
          borderRadius="full"
          fontSize="sm"
          fontWeight="medium"
          textTransform="none"
        >
          {t("orderdetail.verifyed", "Подтвержден")}
        </Badge>
      </HStack>
      <HStack spacing={2}>
        <Badge
          colorScheme="blue"
          px={2}
          py={1}
          borderRadius="full"
          fontSize="sm"
          variant="subtle"
        >
          <HStack spacing={2}>
            <FaEye size="12px" />
            <Text fontSize={"xs"}>
              {orderData.statistics.viewed}{" "}
              {t("orderdetail.seen", "просмотров")}
            </Text>
          </HStack>
        </Badge>
        <IconButton
          icon={<FaShare />}
          colorScheme="blue"
          variant="ghost"
          color={"blue.400"}
          borderRadius="full"
          onClick={onShare}
          aria-label="Share order"
        />
      </HStack>
    </Flex>
  );
});

OrderHeader.displayName = "OrderHeader";

// Memoized Order Details Component
const OrderDetails = memo(({ t }) => {
  // Memoize formatted date
  const formattedDate = useMemo(() => formatDate(orderData.created_at), []);

  // Memoize details array
  const details = useMemo(
    () => [
      {
        label: t("adsfilterblock.category_label_city", "Город"),
        value: orderData.city.title,
        icon: FaMapMarkerAlt,
      },
      {
        label: t("orderdetail.label_date", "Дата создания"),
        value: formattedDate,
        icon: FaCalendarAlt,
      },
      {
        label: t("orderdetail.label_category", "Категория"),
        value: orderData.category.title,
        icon: FaTruck,
      },
      {
        label: t("orderdetail.label_type", "Тип транспорта"),
        value: orderData.transport_type.title,
        icon: FaTruck,
      },
    ],
    [t, formattedDate]
  );

  return (
    <Box mb={8}>
      <Heading size="md" mb={6} color="gray.700">
        {t("orderdetail.detail_order", "Детали заказа")}
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {details.map((detail, index) => (
          <Card
            key={`${detail.label}-${index}`}
            variant="outline"
            borderRadius="xl"
            _hover={{ shadow: "md" }}
            transition="all 0.2s"
          >
            <CardBody p={4}>
              <HStack spacing={3}>
                <Box p={2} bg="blue.50" borderRadius="lg">
                  <Icon as={detail.icon} color="blue.400" />
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    {detail.label}
                  </Text>
                  <Text fontWeight="medium" color="gray.700">
                    {detail.value}
                  </Text>
                </Box>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
});

OrderDetails.displayName = "OrderDetails";


// Memoized Related Orders Component
const RelatedOrders = memo(({ t }) => {
  const cardBg = useColorModeValue("white", "gray.800");

  // Limit related orders to first 5 and memoize
  const limitedRelatedOrders = useMemo(() => relatedOrders.slice(0, 5), []);

  return (
    <Card bg={cardBg} shadow="lg" borderRadius="2xl" w="full">
      <CardBody p={6}>
        <Heading size="md" mb={6} color="p.black">
          {t("orderdetail.similar_ads", "Подходящие объявления")}
        </Heading>
        <VStack spacing={4} align="stretch">
          {limitedRelatedOrders.map((order, idx) => (
            <Box key={order.id}>
              <HStack
                spacing={4}
                p={3}
                borderRadius="xl"
                _hover={{ bg: "gray.50", cursor: "pointer" }}
                transition="all 0.2s"
              >
                <Suspense
                  fallback={
                    <Skeleton width="60px" height="45px" borderRadius="lg" />
                  }
                >
                  <Image
                    src={order.image}
                    // alt={order.title}
                    w="60px"
                    h="45px"
                    objectFit="cover"
                    borderRadius="lg"
                    fallback={
                      <Box
                        w="60px"
                        h="45px"
                        bg="blue.50"
                        borderRadius="lg"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <FaTruck color="#4299E1" size="20px" />
                      </Box>
                    }
                  />
                </Suspense>
                <Box flex={1}>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                    mb={1}
                    noOfLines={1}
                  >
                    {order.title}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {order.location}
                  </Text>
                </Box>
                <Text fontSize="xs" color="blue.400" fontWeight="medium">
                  {order.price}
                </Text>
              </HStack>
              {idx < 4 && <Divider mt={4} opacity={0.3} />}
            </Box>
          ))}
        </VStack>
        <Button
          variant="ghost"
          size="sm"
          color="blue.400"
          rightIcon={<FaChevronRight />}
          mt={6}
          w="full"
          justifyContent="space-between"
          _hover={{ bg: "blue.50" }}
          borderRadius="xl"
          as={"a"}
          href="/applications?category_id=0"
        >
          {t("orderdetail.all_orders", "Все объявления")}
        </Button>
      </CardBody>
    </Card>
  );
});

RelatedOrders.displayName = "RelatedOrders";


// Main Component
const OrderDetailsPage = () => {
  // Stats
  const { stats, track } = useStats(orderData.id);

  const {
    isOpen: isShareOpen,
    onOpen: onShareOpen,
    onClose: onShareClose,
  } = useDisclosure();
  const {
    isOpen: isReportOpen,
    onOpen: onReportOpen,
    onClose: onReportClose,
  } = useDisclosure();
  const { isAuthenticated } = useAuth();

  const { t } = useTranslation();

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [type, setType] = useState("phone");
  const isMobile = useBreakpointValue({ base: true, md: false });
  const {
    isOpen: isCallbackOpen,
    onClose: onCallbackClose,
    onOpen: onCallbackOpen,
  } = useDisclosure();

  // Memoize formatted date
  const formattedDate = useMemo(() => formatDate(orderData.created_at), []);

  // Phone call function
  const handleCallPhone = useCallback(() => {
    setType("phone");
    onOpen();
    track("calls");
  }, [onOpen, track]);

  // Message function
  const handleSendMessage = useCallback(() => {
    setType("message");
    onOpen();
    track("messages");
  }, [onOpen, track]);

  const handleCallbackMessage = useCallback(() => {
    if (!isAuthenticated) {
      navigate("/auth/login", { replace: true });
      return;
    }
    onCallbackOpen();
  }, [onCallbackOpen, isAuthenticated]);

  // Handle callback submission
  const handleCallbackSubmit = useCallback(async (data) => {
    console.log("Leeds ga yuboradigan api joyi", data);
  }, []);

  const currencyId = orderData?.prices?.[0]?.currency;

  const currency = CURRENCIES.find(c => c.id === currencyId) || {
    symbol: 'so\'m',
  };
  return (
    <Box
      bg={{ base: bgColor, custom900: "white" }}
      minH="100%"
      py={{ base: "80px", md: 0 }}
    >
      <BreadcrumbNav t={t} />

      <Box maxW="75rem" py={8}>
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          {/* Main Content */}
          <GridItem>
            <Card bg={cardBg} shadow="xl" borderRadius="2xl" overflow="hidden">
              <CardBody p={{ base: 6, md: 8 }}>
                <OrderHeader
                  onShare={onShareOpen}
                  onReport={onReportOpen}
                  t={t}
                />

                {/* Date and Title */}
                <VStack align="start" spacing={3} mb={8}>
                  <Text fontSize="sm" color="gray.500">
                    {formattedDate}
                  </Text>
                  <Heading
                    size={{ base: "lg", md: "xl" }}
                    color="blue.400"
                    lineHeight="1.2"
                    bgGradient="linear(to-r, blue.500, purple.500)"
                    bgClip="text"
                  >
                    {orderData.title}
                  </Heading>
                </VStack>

                <OrderDetails t={t} />

                <Box mb={8}>
                  <Heading size="md" mb={6} color="gray.700">
                    Narx
                  </Heading>
                  <SimpleGrid columns={1} spacing={4}>
                    <Card
                      border={"1px solid"}
                      borderColor={"green.400"}
                      variant="outline"
                      borderRadius="xl"
                      _hover={{ shadow: "md" }}
                      transition="all 0.2s"
                    >
                      <CardBody p={4}>
                        <HStack spacing={3}>
                          <Box p={2} bg="blue.50" borderRadius="lg">
                            <Icon as={FaMoneyBill1Wave} color="green.400" />
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="gray.500">
                              Taklif qilandigan narx
                            </Text>
                            <Text fontWeight="medium" color="gray.700">
                              {orderData?.prices?.[0]?.price} {currency.symbol}
                            </Text>
                          </Box>
                        </HStack>
                      </CardBody>
                    </Card>
                  </SimpleGrid>
                </Box>

                {/* Description */}
                <Box mb={8}>
                  <Heading size="md" mb={4} color="gray.700">
                    {t("partsmarketplace.company_info.inform", "Описание")}
                  </Heading>
                  <Box
                    p={6}
                    bg="gray.50"
                    borderRadius="xl"
                    borderLeft="4px solid"
                    borderLeftColor="blue.1"
                  >
                    <Text
                      color="gray.700"
                      lineHeight="1.7"
                      whiteSpace="pre-line"
                    >
                      {orderData.description}
                    </Text>
                  </Box>
                </Box>

                {/* Attached Documents */}
                <Box
                  display={"flex"}
                  flexDir={"column"}
                  gap={8}
                  alignItems={"flex-start"}
                >
                  <Heading size="md" mb={4} color="gray.700">
                    {t("orderdetail.attached_doc", "Приложенные документы")}
                  </Heading>
                  <Card
                    variant="outline"
                    w={"100%"}
                    borderRadius="xl"
                    p={6}
                    borderStyle="dashed"
                    borderWidth="2px"
                  >
                    <Suspense
                      fallback={
                        <Skeleton
                          width="150px"
                          height="110px"
                          borderRadius="xl"
                        />
                      }
                    >
                      <Image
                        src={orderData.images[0].url}
                        alt="Attached document"
                        maxW="150px"
                        maxH="110px"
                        objectFit="cover"
                        borderRadius="xl"
                        shadow="md"
                        transition="transform 0.2s"
                        _hover={{ transform: "scale(1.05)" }}
                        loading="lazy"
                        fallback={
                          <Skeleton
                            width="150px"
                            height="110px"
                            borderRadius="xl"
                          />
                        }
                      />
                    </Suspense>
                  </Card>
                  <Button
                    leftIcon={<FaFlag />}
                    variant="ghost"
                    size="sm"
                    color="red.500"
                    onClick={onReportOpen}
                    _hover={{ bg: "red.50" }}
                    borderRadius="xl"
                  >
                    {t("report.title", "Пожаловаться")}
                  </Button>
                </Box>
              </CardBody>
            </Card>
          </GridItem>

          {/* Sidebar */}
          <GridItem>
            <VStack spacing={6}>
              <CustomerInfo
                isOpen={onShareOpen}
                t={t}
                handleCallbackMessage={handleCallbackMessage}
              />
              <RelatedOrders t={t} />
            </VStack>
          </GridItem>
        </Grid>
      </Box>

      {/* Bottom Modal - Only render on mobile */}
      {isMobile && (
        <Portal>
          <Box
            position="fixed"
            bottom={0}
            left={0}
            right={0}
            bg="transparent"
            p={4}
            zIndex={1000}
          >
            <HStack flexDirection={"row-reverse"} spacing={3} w="full">
              <Button
                leftIcon={<FiPhone />}
                variant="solid"
                flex={1}
                bg={"blue.400"}
                _hover={{ bg: "blue.300" }}
                border={"2px solid transparent"}
                _active={{
                  borderColor: "blue.400",
                  color: "blue.400",
                  bg: "white",
                }}
                color={"white"}
                fontSize={{ base: "sm", sm: "md" }}
                h="50px"
                fontWeight="semibold"
                onClick={handleCallPhone}
              >
                {t("contactBottomModal.call", "Позвонить")}
              </Button>
              <Button
                leftIcon={<FiMessageCircle />}
                variant="solid"
                flex={1}
                bg={"orange.100"}
                color={"orange.800"}
                h="50px"
                fontWeight="semibold"
                onClick={
                  orderData.author?.is_company
                    ? handleCallbackMessage
                    : handleSendMessage
                }
                fontSize={{ base: "sm", sm: "md" }}
              >
                {t("contactBottomModal.write", "Написать")}
              </Button>
            </HStack>
          </Box>
        </Portal>
      )}

      {/* Modals - Lazy load when needed */}
      <Suspense fallback={<Spinner />}>
        <ShareModal isOpen={isShareOpen} onClose={onShareClose} t={t} />
        {isReportOpen && (
          <ReportModal isOpen={isReportOpen} onClose={onReportClose} />
        )}
        {isOpen && (
          <ContactBottomModal
            isOpen={isOpen}
            onClose={onClose}
            type={type}
            text={`+998${orderData.phone}`}
          />
        )}
        {isCallbackOpen && (
          <CallbackModal
            isOpen={isCallbackOpen}
            onClose={onCallbackClose}
            onSubmit={handleCallbackSubmit}
          />
        )}
      </Suspense>
    </Box>
  );
};

// Add display name for debugging
OrderDetailsPage.displayName = "OrderDetailsPage";

export default memo(OrderDetailsPage);
