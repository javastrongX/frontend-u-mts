import { useState } from 'react';
import {
  Box,
  Container,
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
  Avatar,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  SimpleGrid,
  Flex,
  Card,
  CardBody,
  useColorModeValue,
  Tooltip,
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
  Icon
} from '@chakra-ui/react';
import {
  FaPhone,
  FaHeart,
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
  FaFlag
} from 'react-icons/fa';
import { ReportModal } from '../../components/ReportModal/ReportModal';
import { useTranslation } from 'react-i18next';


// Mock data
const orderData = {
  id: 605,
  title: "40тонна селитра",
  description: "Талдыкорған до Косагаш (Жансугуров)\nГруз 40 Т селитра апаруға\n2 машина керек",
  author: {
    id: 28124,
    name: "Қапез Ерсін",
    avatar: "https://dev.gservice-co.kz/api-assets/no_avatar.png",
    is_company: false,
    rating: 4.8,
    orders_count: 23
  },
  category: {
    id: 8,
    title: "Арендовать спецтехнику"
  },
  city: {
    id: 258,
    title: "Талдыкорган"
  },
  transport_type: {
    id: 151,
    title: "Бортовые грузовики"
  },
  phone: "998947144403",
  images: [
    {
      id: 34037,
      url: "https://dev.gservice-co.kz/storage/application-images/05-06-2025/01JWY5WHKE22KC9AVV3MEGY2ZC.webp"
    }
  ],
  statistics: {
    viewed: 10
  },
  created_at: "2025-06-04T19:15:18.000000Z",
  status: "confirmed"
};

const relatedOrders = [
  { id: 1, title: "Бортовые грузовики IVECO", location: "г. Алматы", type: "Договорная", image: "https://via.placeholder.com/60x45" },
  { id: 2, title: "Бортовые грузовики ГАЗ", location: "г. Астана", type: "Договорная", image: "https://via.placeholder.com/60x45" },
  { id: 3, title: "Бортовые грузовики ГАЗ", location: "г. Усть-Каменогорск", type: "Договорная", image: "https://via.placeholder.com/60x45" },
  { id: 4, title: "Бортовые грузовики УРАЛ", location: "г. Актау", type: "Договорная", image: "https://via.placeholder.com/60x45" },
  { id: 5, title: "Бортовые грузовики ГАЗ", location: "г. Караганда", type: "Договорная", image: "https://via.placeholder.com/60x45" },
  { id: 6, title: "Бортовые грузовики КАМАЗ", location: "г. Астана", type: "Договорная", image: "https://via.placeholder.com/60x45" },
  { id: 7, title: "Бортовые грузовики MERCEDES", location: "г. Астана", type: "Договорная", image: "https://via.placeholder.com/60x45" }
];


// Breadcrumb Component
const BreadcrumbNav = ({ t, title = "Бортовые грузовики" }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  
  return (
    <Box
      mt={3}
      bg={cardBg}
      borderBottom="1px"
      borderColor="gray.200"
      shadow="sm"
      borderRadius="md"
    >
      <Box
        w="100%"
        px={{ base: 3, sm: 4, md: 6 }}
        py={{ base: 3, md: 4 }}
      >
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
              <Text noOfLines={1}>
                {title}
              </Text>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>
    </Box>
  );
};

// Share Modal Component
const ShareModal = ({ isOpen, onClose, t }) => {
  const toast = useToast();
  const currentUrl = window.location.href;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    toast({
      title: t("hotOfferDetail.share_msg", "Ссылка скопирована!"),
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    onClose();
  };

  const shareOptions = [
    { name: "WhatsApp", icon: FaWhatsapp, color: "green.500", url: `https://wa.me/?text=${encodeURIComponent(currentUrl)}` },
    { name: "Telegram", icon: FaTelegram, color: "blue.400", url: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}` },
    { name: "Facebook", icon: FaFacebook, color: "blue.400", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}` },
    { name: "Twitter", icon: FaTwitter, color: "blue.400", url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}` },
    { name: "LinkedIn", icon: FaLinkedin, color: "blue.700", url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}` },
    { name: "Email", icon: FaEnvelope, color: "gray.600", url: `mailto:?body=${encodeURIComponent(currentUrl)}` }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent borderRadius="2xl" mx={4}>
        <ModalHeader pb={2}>
          <HStack spacing={3}>
            <Box p={2} bg="blue.50" borderRadius="lg">
              <FaShare  color="#4299E1" />
            </Box>
            <Text>{t("orderdetail.share_order", "Поделиться заказом")}</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Box w="full" p={4} bg="gray.50" borderRadius="xl">
              <Text fontSize="sm" color="gray.600" mb={2}>{t("orderdetail.link_order", "Ссылка на заказ:")}</Text>
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
                  color={"blue.400"}
                  _hover={{ bg: "blue.50" }}
                  bg={"black.0"}
                  size="sm"
                  borderRadius="lg"
                />
              </HStack>
            </Box>
            
            <Box w="full">
              <Text fontSize="sm" color="gray.600" mb={3}>{t("orderdetail.directly_share", "Поделиться через:")}</Text>
              <SimpleGrid columns={{base: 2, custom400: 3}} spacing={3}>
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
                    _hover={{ bg: `${option.color.split('.')[0]}.50`, borderColor: option.color }}
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
          <Button onClick={onClose} colorScheme='blue' color={'blue.400'} variant="ghost" borderRadius="xl">
            {t("orderdetail.cancel", "Закрыть")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};


// Order Header Component
const OrderHeader = ({ onShare, onReport, t }) => {
  return (
    <Flex justify="space-between" align="flex-start" mb={6} flexWrap="wrap" gap={3}>
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
            <Text fontSize={'xs'}>{orderData.statistics.viewed} {t("orderdetail.seen", "просмотров")}</Text>
          </HStack>
        </Badge>
        <IconButton
          icon={<FaShare />}
          colorScheme='blue'
          variant="ghost"
          color={'blue.400'}
          borderRadius="full"
          onClick={onShare}
        />
      </HStack>
    </Flex>
  );
};

// Order Details Component
const OrderDetails = ({ t }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('ru', { month: 'long' });
    const time = date.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
    return `${day} ${month} ${time}`;
  };

  const details = [
    { label: t("adsfilterblock.category_label_city", "Город"), value: orderData.city.title, icon: FaMapMarkerAlt },
    { label: t("orderdetail.label_date", "Дата создания"), value: formatDate(orderData.created_at), icon: FaCalendarAlt },
    { label: t("orderdetail.label_category", "Категория"), value: orderData.category.title, icon: FaTruck },
    { label: t("orderdetail.label_type", "Тип транспорта"), value: orderData.transport_type.title, icon: FaTruck }
  ];

  return (
    <Box mb={8}>
      <Heading size="md" mb={6} color="gray.700">{t("orderdetail.detail_order", "Детали заказа")}</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {details.map((detail, index) => (
          <Card key={index} variant="outline" borderRadius="xl" _hover={{ shadow: "md" }} transition="all 0.2s">
            <CardBody p={4}>
              <HStack spacing={3}>
                <Box p={2} bg="blue.50" borderRadius="lg">
                  <Icon as={detail.icon} color="blue.400" />
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500">{detail.label}</Text>
                  <Text fontWeight="medium" color="gray.700">{detail.value}</Text>
                </Box>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};

// Customer Info Component
const CustomerInfo = ({ isOpen, t }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const cardBg = useColorModeValue('white', 'gray.800');

  const formatPhone = (phone) => {
    return `+998 ${phone.slice(3, 5)} ${phone.slice(5, 8)} ${phone.slice(8, 10)} ${phone.slice(10)}`;
  };

  return (
    <Card bg={cardBg} shadow="lg" borderRadius="2xl" w="full" overflow="hidden">
      <Box bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" p={6} color="white">
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="lg">{t("orderdetail.agreed", "Договорная")}</Heading>
          <Badge colorScheme="whiteAlpha" variant="solid">{t("orderdetail.seller", "Заказчик")}</Badge>
        </Flex>
        
        <HStack spacing={4}>
          <Avatar 
            size="lg" 
            src={orderData.author.avatar}
            name={orderData.author.name}
            border="3px solid"
            borderColor="whiteAlpha.300"
          />
          <Box>
            <Text fontWeight="bold" fontSize="lg">{orderData.author.name}</Text>
            <HStack spacing={2}>
              <Text fontSize="sm" opacity={0.9}>★ {orderData.author.rating}</Text>
              <Text fontSize="sm" opacity={0.7}>•</Text>
              <Text fontSize="sm" opacity={"0.9"}>{orderData.author.orders_count} {t("orderdetail.count_orders", "заказов")}</Text>
            </HStack>
          </Box>
        </HStack>
      </Box>

      <CardBody p={6}>
        <VStack spacing={4}>
          <Button
            leftIcon={<FaPhone />}
            colorScheme="blue"
            size="lg"
            w="full"
            borderRadius="xl"
            fontSize="md"
            py={6}
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            _hover={{ 
              transform: "translateY(-2px)", 
              shadow: "xl",
              bg: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)"
            }}
            _active={{ transform: "scale(0.98)" }}
            transition="all 0.2s"
            onClick={() => setShowPhone(true)}
          >
            {showPhone ? formatPhone(orderData.phone) : t("orderdetail.show_phone", "Показать номер")}
          </Button>

          <HStack spacing={3} w="full">
            <Tooltip label={isLiked ? t("hotOfferDetail.remove_favourite", "Убрать из избранного") : t("hotOfferDetail.add_favourite", "Добавить в избранное")}>
              <IconButton
                icon={<FaHeart />}
                colorScheme={isLiked ? "red" : "gray"}
                variant={isLiked ? "solid" : "outline"}
                size="lg"
                borderRadius="xl"
                flex={1}
                onClick={() => setIsLiked(!isLiked)}
                _hover={{ 
                  transform: "translateY(-1px)",
                  shadow: "md" 
                }}
                transition="all 0.2s"
              />
            </Tooltip>
            <Tooltip label={t("hotOfferDetail.label_ulashish", "Поделиться")}>
              <IconButton
                icon={<FaShare />}
                color={'blue.400'}
                variant="outline"
                size="lg"
                borderRadius="xl"
                onClick={isOpen}
                flex={1}
                _hover={{ 
                  transform: "translateY(-1px)",
                  shadow: "md",
                  bg: "blue.50" 
                }}
                transition="all 0.2s"
              />
            </Tooltip>
          </HStack>

          <SimpleGrid columns={3} spacing={3} w="full">
            {[
              { icon: FaWhatsapp, label: "WhatsApp", color: "green" },
              { icon: FaTelegram, label: "Telegram", color: "blue" },
              { icon: FaEnvelope, label: "Email", color: "black" }
            ].map((social) => (
              <Button
                key={social.label}
                leftIcon={<Icon as={social.icon} />}
                colorScheme={social.color}
                color={social.color === "blue" ? "blue.400" : social.color}
                variant="outline"
                size="sm"
                fontSize="xs"
                borderRadius="lg"
                _hover={{ 
                  bg: `${social.color}.50`,
                  transform: "translateY(-1px)" 
                }}
                transition="all 0.2s"
              >
                {social.label}
              </Button>
            ))}
          </SimpleGrid>
        </VStack>
      </CardBody>
    </Card>
  );
};

// Related Orders Component
const RelatedOrders = ({t}) => {
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Card bg={cardBg} shadow="lg" borderRadius="2xl" w="full">
      <CardBody p={6}>
        <Heading size="md" mb={6} color="p.black">{t("orderdetail.similar_ads", "Подходящие объявления")}</Heading>
        <VStack spacing={4} align="stretch">
          {relatedOrders.slice(0, 5).map((order, idx) => (
            <Box key={order.id}>
              <HStack spacing={4} p={3} borderRadius="xl" _hover={{ bg: "gray.50", cursor: "pointer" }} transition="all 0.2s">
                <Image
                  src={order.image}
                  alt={order.title}
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
                <Box flex={1}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1} noOfLines={1}>
                    {order.title}
                  </Text>
                  <Text fontSize="xs" color="gray.500">{order.location}</Text>
                </Box>
                <Text fontSize="xs" color="blue.400" fontWeight="medium">{order.type}</Text>
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
        >
          {t("orderdetail.all_orders", "Все объявления")}
        </Button>
      </CardBody>
    </Card>
  );
};

// Main Component
const OrderDetailsPage = () => {
  const { isOpen: isShareOpen, onOpen: onShareOpen, onClose: onShareClose } = useDisclosure();
  const { isOpen: isReportOpen, onOpen: onReportOpen, onClose: onReportClose } = useDisclosure();
  
  const { t } = useTranslation();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('ru', { month: 'long' });
    const time = date.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
    return `${day} ${month} ${time}`;
  };

  return (
    <Box bg={{base: bgColor, custom900: "white"}} minH="100%" mb={{base: 12, custom900: 0}}>
      <BreadcrumbNav t = { t } />

      <Box maxW="75rem" py={8}>
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          {/* Main Content */}
          <GridItem>
            <Card bg={cardBg} shadow="xl" borderRadius="2xl" overflow="hidden">
              <CardBody p={{ base: 6, md: 8 }}>
                <OrderHeader onShare={onShareOpen} onReport={onReportOpen} t={ t } />

                {/* Date and Title */}
                <VStack align="start" spacing={3} mb={8}>
                  <Text fontSize="sm" color="gray.500">
                    {formatDate(orderData.created_at)}
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

                <OrderDetails t={ t } />

                {/* Description */}
                <Box mb={8}>
                  <Heading size="md" mb={4} color="gray.700">{t("partsmarketplace.company_info.inform", "Описание")}</Heading>
                  <Box p={6} bg="gray.50" borderRadius="xl" borderLeft="4px solid" borderLeftColor="blue.1">
                    <Text color="gray.700" lineHeight="1.7" whiteSpace="pre-line">
                      {orderData.description}
                    </Text>
                  </Box>
                </Box>

                {/* Attached Documents */}
                <Box display={'flex'} flexDir={'column'} gap={8} alignItems={'flex-start'}>
                  <Heading size="md" mb={4} color="gray.700">{t("orderdetail.attached_doc", "Приложенные документы")}</Heading>
                  <Card variant="outline" w={'100%'} borderRadius="xl" p={6} borderStyle="dashed" borderWidth="2px">
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
                        fallback={<Skeleton width="150px" height="110px" borderRadius="xl" />}
                      />
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
                    {t("report.title","Пожаловаться")}
                  </Button>
                </Box>
              </CardBody>
            </Card>
          </GridItem>

          {/* Sidebar */}
          <GridItem>
            <VStack spacing={6}>
              <CustomerInfo isOpen={onShareOpen} t={t} />
              <RelatedOrders t={t} />
            </VStack>
          </GridItem>
        </Grid>
      </Box>

      {/* Modals */}
      <ShareModal isOpen={isShareOpen} onClose={onShareClose} t={ t } />
      <ReportModal isOpen={isReportOpen} onClose={onReportClose} />
    </Box>
  );
};

export default OrderDetailsPage;