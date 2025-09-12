import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  HStack,
  Heading,
  Card,
  CardBody,
  Badge,
  SimpleGrid,
  useColorModeValue,
  Link,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Image,
  Icon,
} from '@chakra-ui/react';
import {
  FiUser,
  FiDollarSign,
  FiPhone,
  FiEye,
  FiMapPin,
  FiClock,
  FiArrowRight
} from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const Dashboard = () => {
  const location = useLocation();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [visiblePhones, setVisiblePhones] = useState(new Set());

  // Kompaniya royhatdan o'tganda keladigan malumotlar - Navigatsiyadan togridan togri state orqali keladi
  const { companyData, activityData, registrationSuccess, skipped } = location.state || {}

  
  const [orders] = useState([
    {
      id: 1,
      title: 'Песок в биг бегах с Байсерке в Алматы',
      price: '50 000 ₸',
      location: 'г. Алматы',
      author: 'Еликбаев Мади',
      date: '17 Июль 03:41',
      views: 18,
      status: 'Договорная',
      phone: '941234567'
    },
    {
      id: 2,
      title: 'Водитель на гусеничный экскаватор с опытом работы гидромолотом',
      price: 'Договорная',
      location: 'г. Тараз',
      author: 'Жанчур',
      date: '15 Июль 21:17',
      views: 34,
      status: 'Договорная',
      phone: '941234567'
    },
    {
      id: 3,
      title: 'Самосвал перевозка 25 тн,40тн,50тн',
      price: 'Договорная',
      location: 'г. Шу',
      author: 'Ербол',
      date: '15 Июль 18:54',
      views: 22,
      status: 'Договорная',
      phone: '941234567'
    },
    {
      id: 4,
      title: 'Келісім',
      price: 'Договорная',
      location: 'г. Актобе',
      author: 'Aibek',
      date: '14 Июль 10:09',
      views: 54,
      status: 'Договорная',
      phone: '941234567'
    },
    {
      id: 5,
      title: 'Гусеничный экскаватор аренда',
      price: 'Договорная',
      location: 'г. Караганда',
      author: 'Ерлан',
      date: '12 Июль 22:49',
      views: 19,
      status: 'Договорная',
      phone: '941234567'
    }
  ]);

  const [leads] = useState([
    {
      id: 1,
      phone: '+7 (877) 878-78-87',
      name: 'ukes',
      status: 'waiting',
      date: '19 Июль 10:45'
    },
    {
      id: 2,
      phone: '+7 (877) 878-78-87',
      name: 'ukes',
      status: 'cancelled',
      date: '19 Июль 10:45'
    },
    {
      id: 3,
      phone: '+7 (877) 878-78-87',
      name: 'ukes',
      status: 'cancelled',
      date: '19 Июль 10:45'
    },
    {
      id: 4,
      phone: '+7 (877) 878-78-87',
      name: 'ukes',
      status: 'cancelled',
      date: '19 Июль 10:45'
    },
    {
      id: 5,
      phone: '+7 (877) 878-78-87',
      name: 'ukes',
      status: 'cancelled',
      date: '19 Июль 10:45'
    },
    {
      id: 6,
      phone: '+7 (877) 878-78-87',
      name: 'ukes',
      status: 'cancelled',
      date: '19 Июль 10:45'
    },
    {
      id: 7,
      phone: '+7 (877) 878-78-87',
      name: 'ukes',
      status: 'cancelled',
      date: '19 Июль 10:45'
    },
    {
      id: 8,
      phone: '+7 (877) 878-78-87',
      name: 'ukes',
      status: 'cancelled',
      date: '19 Июль 10:45'
    },
    {
      id: 9,
      phone: '+7 (877) 878-78-87',
      name: 'ukes',
      status: 'cancelled',
      date: '19 Июль 10:45'
    },
    {
      id: 10,
      phone: '+7 (877) 878-78-87',
      name: 'ukes',
      status: 'cancelled',
      date: '19 Июль 10:45'
    },
    {
      id: 11,
      phone: '+7 (877) 878-78-87',
      name: 'ukes',
      status: 'cancelled',
      date: '19 Июль 10:45'
    },
    {
      id: 12,
      phone: '+7 (877) 878-78-87',
      name: 'ukes',
      status: 'cancelled',
      date: '19 Июль 10:45'
    },
    {
      id: 13,
      phone: '+7 (877) 878-78-87',
      name: 'ukes',
      status: 'cancelled',
      date: '19 Июль 10:45'
    },
    {
      id: 14,
      phone: '+7 (877) 878-78-87',
      name: 'ukes',
      status: 'cancelled',
      date: '19 Июль 10:45'
    },
    {
      id: 15,
      phone: '+7 (877) 878-78-87',
      name: 'ukes',
      status: 'cancelled',
      date: '19 Июль 10:45'
    }

  ]);


  const showPhoneNumber = (orderId) => {
    setVisiblePhones(prev => new Set(prev).add(orderId));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting':
        return '#fed500';
      case 'completed':
        return 'green.500';
      case 'cancelled':
        return 'red.500';
      default:
        return '#fed500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'waiting':
        return t("Business_mode.dashboard.waiting", 'В ожидании');
      case 'completed':
        return t("Business_mode.dashboard.complated", "Выполнено");
      case 'cancelled':
        return t("Business_mode.dashboard.cancelled", "Отменено");
      default:
        return t("Business_mode.dashboard.waiting", 'В ожидании');
    }
  };

  return (
    <Box bg={bgColor} minH="100vh" p={2}>
      <Box maxW="100vw">
        {/* Header */}
        <Flex mb={8} align="flex-start" flexDir={'column'}>
          <Heading fontSize={'20px'} color={textColor} mb={1} fontWeight={'semibold'} >
            {t("footer.home", "Главная")}
          </Heading>
          <Flex w={"100%"} gap={5} minH={'100%'} flexDir={{base: 'column', custom570: 'row'}}>
            <Box 
              bg={cardBg} 
              boxShadow={'lg'} 
              borderRadius={'xl'} 
              display={'flex'} 
              w={'100%'} 
              alignItems={'center'} 
              justifyContent={'space-between'}
              p={4}
              h={'150px'}
            >
              <Box display="flex" alignItems="flex-start" gap={2} flexDir={'column'}>
                <Box  display="flex" alignItems="center" gap={2} flexDir={'row'}>
                  <Image src='/company.png' boxSize={'70px'}  alt="Company Logo" />
                  <Box>
                    <Text color={mutedColor} fontSize="md" fontWeight={'semibold'}>oluytrewq</Text>
                    <Text color={mutedColor} fontSize="sm">ID: 157</Text>
                  </Box>
                </Box>
              </Box>
              <Icon
                as={FiArrowRight} 
                boxSize={{base: 6, md: 7}} 
                color={'blue.400'} 
                cursor={'pointer'}
                _hover={{ color: 'blue.300' }}
                onClick={() => navigate('/company-settings')}
              />
            </Box>
            {/* Balance Card */}
            <Card h={'150px'} w={'100%'} bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody>
                <VStack align={'flex-start'} justifyContent={'space-between'} h={'100%'} spacing={1}>
                  <Box>
                    <Text fontSize={{base: "18px", custom570: "20px"}} fontWeight={'semibold'}>{t("ProfileMobile.balance", "Баланс")}</Text>
                    <HStack align={'center'} mt={{base: 2, custom570: 1}}>
                      <Text fontSize={{base: "17px", custom570: "20px"}} fontWeight={'semibold'} color={textColor}>0</Text>
                      <Badge 
                        ml={2} 
                        color={'p.black'} 
                        textTransform={'none'} 
                        borderRadius={'full'} 
                        px={3}
                        fontWeight={'normal'}
                        fontSize={{base: "sm", custom570: "17px"}}
                        >0 {t("TabContent.balance.bonus", "бонус")}</Badge>
                    </HStack>
                  </Box>
                  <Button
                    bg="#fed500"
                    color="black"
                    _hover={{ bg: '#e6c200' }}
                    size={{base: "sm", custom570: "md"}}
                    w="full"
                    leftIcon={<FiDollarSign />}
                    onClick={() => navigate('/profile/balance')}
                  >
                    {t("user_links.balance", "Пополнить баланс")}
                  </Button>
                </VStack>
              </CardBody>
            </Card>

          </Flex>
        </Flex>

        <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={6}>
          {/* Left Column */}
          <VStack spacing={6} gridColumn={{ base: '1', lg: '1 / 2' }}>
            {/* Orders Section */}
            <Card w="full" bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody p={4}>
                <Flex justify="space-between" align="center" mb={4}>
                  <Heading size="md" color={textColor}>{t("Business_mode.dashboard.new_orders", "Новые заявки")}</Heading>
                  <Link href='/applications?category_id=0' color="#fed500" fontSize="sm" fontWeight="medium">
                    {t("Business_mode.dashboard.view_allOrder", "Показать все заявки")} <FiArrowRight style={{ display: 'inline', marginLeft: 4 }} />
                  </Link>
                </Flex>
                
                <VStack spacing={4} align="stretch">
                  {orders.slice(0, 5).map((order) => (
                    <Box
                      key={order.id}
                      p={4}
                      bg={useColorModeValue('gray.50', 'gray.700')}
                      borderRadius="lg"
                      borderLeft="4px"
                      borderLeftColor="#fed500"
                      transition="all 0.2s"
                      _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                    >
                      <Flex justify="space-between" align="start" mb={2}>
                        <Link
                          color="#fed500"
                          fontWeight="semibold"
                          fontSize="sm"
                          _hover={{ textDecor: 'none', opacity: 0.8 }}
                        >
                          {order.title}
                        </Link>
                        <HStack spacing={2} whiteSpace={'nowrap'} ml={1}>
                          {visiblePhones.has(order.id) ? (
                            <Text color="blue.500" as={'a'} href={`tel:+998${order.phone}`} fontSize={{base: "xs", custom570: "sm"}} fontWeight="medium">
                              +998{order.phone}
                            </Text>
                          ) : (
                            <Text 
                              color="blue.500" 
                              fontSize={{base: "xs", custom570: "sm"}}
                              cursor="pointer"
                              _hover={{ textDecoration: 'underline' }}
                              onClick={() => showPhoneNumber(order.id)}
                            >
                              {t("orderdetail.show_phone", "Показать номер")}
                            </Text>
                          )}
                        </HStack>
                      </Flex>
                      
                      <Text fontWeight="bold" color={textColor} mb={2}>
                        {order.price}
                      </Text>
                      
                      <Flex justify="space-between" align="center" fontSize="xs" flexWrap={'wrap'} color={mutedColor}>
                        <HStack spacing={4} whiteSpace={'nowrap'}>
                          <HStack spacing={1}>
                            <FiMapPin />
                            <Text>{order.location}</Text>
                          </HStack>
                          <HStack spacing={1}>
                            <FiUser />
                            <Text>{order.author}</Text>
                          </HStack>
                          <HStack spacing={1}>
                            <FiClock />
                            <Text>{order.date}</Text>
                          </HStack>
                        </HStack>
                        <HStack spacing={1}>
                          <FiEye />
                          <Text>{order.views}</Text>
                        </HStack>
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </VStack>

          {/* Right Column */}
          <VStack spacing={6}>

            {/* Leads Section */}
            <Card w="full" bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody>
                <Flex justify="space-between" align="center" mb={4}>
                  <Heading size="md" color={textColor}>{t("Business_mode.dashboard.lead", "Лиды")}</Heading>
                  <Link href='/leads' color="#fed500" fontSize="sm" fontWeight="medium">
                    {t("Business_mode.dashboard.view_allLead", "Показать все лиды")} <FiArrowRight style={{ display: 'inline', marginLeft: 4 }} />
                  </Link>
                </Flex>

                <TableContainer>
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th fontSize="xs" color={mutedColor}>№</Th>
                        <Th fontSize="xs" color={mutedColor}>{t("auth_register.phone", "Номер телефона")}</Th>
                        <Th fontSize="xs" color={mutedColor}>{t("Business_mode.dashboard.name", "Имя")}</Th>
                        <Th fontSize="xs" color={mutedColor}>{t("Business_mode.dashboard.status", "Статус")}</Th>
                        <Th fontSize="xs" color={mutedColor}>{t("Business_mode.dashboard.date", "Дата, время")}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {leads.slice(0, 15).map((lead, index) => (
                        <Tr key={lead.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                          <Td fontSize="sm">{index + 1}</Td>
                          <Td fontSize="sm">
                            <HStack spacing={1}>
                              <FiPhone size={12} />
                              <Text>{lead.phone}</Text>
                            </HStack>
                          </Td>
                          <Td fontSize="sm">{lead.name}</Td>
                          <Td>
                            <Badge 
                              pointerEvents={'none'}
                              bg={getStatusColor(lead.status)} 
                              color={['completed', 'cancelled'].includes(lead.status) ? "white" : "black"} 
                              fontSize="xs"
                              px={2}
                              py={1}
                              borderRadius="md"
                            >
                              {getStatusText(lead.status)}
                            </Badge>
                          </Td>
                          <Td fontSize="xs" color={mutedColor}>{lead.date}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>
          </VStack>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default Dashboard;