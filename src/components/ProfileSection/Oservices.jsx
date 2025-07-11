import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
  Badge,
  Icon,
  Flex,
  Container,
  useColorModeValue,
  Divider,
  Link,
  useBreakpointValue,
  Spacer,
  SimpleGrid,
  Stack
} from '@chakra-ui/react';
import {
  FiFileText,
  FiShield,
  FiUsers,
  FiPhone,
  FiMail,
  FiClock,
  FiInfo,
  FiMapPin,
  FiGlobe
} from 'react-icons/fi';


const documents = [
    {
      id: 1,
      title: "Политика конфиденциальности и обработки персональных данных",
      category: "privacy",
      lastUpdated: "2024-01-15",
      content: `Политика конфиденциальности и обработки персональных данных при использовании сайтов и мобильных приложений ТОО «T-Service Co» (далее – Политика) определяет порядок и устанавливает требования по обеспечению безопасности Ваших персональных данных (далее — Данные) и также какие данные получает, как использует и обменивается ими с другими лицами.

Полным и безоговорочным принятием Пользователем настоящей Политики считается совершение действий, направленных на использование Интернет-ресурсов, в том числе поиск, просмотр или подача объявлений, регистрация на интернет-ресурсе, оставление комментариев, направление сообщений через форму связи и другие действия по использованию функциональности Интернет-ресурсов.

Что Компания считает Данными

Для Компании цели, принципы и правовые основы деятельности, связанные со сбором, обработкой и защитой Данных, имеют важное значение и являются приоритетом. Поэтому, Компания считает «персональными» те Данные, которые связаны с Вами, а именно:

Пользователем сайтов www.tservice.uz и мобильных приложений gservice.kz (далее – Интернет-ресурсы) и/или предоставленные Вами, включая данные о третьих лицах для оказания Услуг.

Какие данные о Вас получает Компания

Компания получает или собирает информацию для предоставления информационных услуг по размещению, обработке и переработке данных пользователя через личный кабинет на интернет-ресурсах и приложениях tservice.uz, а также услуг и сервисов партнеров Компании (далее — Услуги), включая использование интернет-ресурсов и доступ к ним.

Информация, предоставляемая Вами: Данные необходимы Компании для защиты безопасности Пользователей, безопасного предоставления Услуг и надлежащего их оказания, выполнения обязательств перед Пользователями.

Пользовательские данные – это ФИО, номер мобильного телефона, дата и/или год рождения, адрес электронной почты, документ о государственной регистрации юридического лица, талон/свидетельство на осуществление предпринимательской деятельности.

Цели обработки персональных данных:

1. Регистрация и авторизация пользователей
2. Предоставление информационных услуг
3. Обработка заявок и запросов
4. Техническая поддержка пользователей
5. Улучшение качества сервисов
6. Обеспечение безопасности платформы

Компания обязуется обеспечить конфиденциальность и безопасность персональных данных в соответствии с требованиями действующего законодательства Республики Узбекистан.

Сроки хранения персональных данных определяются целями их обработки и требованиями законодательства. По истечении указанных сроков персональные данные подлежат уничтожению.

Пользователь имеет право на доступ к своим персональным данным, их изменение, блокирование или уничтожение путем обращения к администрации сайта.`
    },
    {
      id: 2,
      title: "Лицензионное соглашение",
      category: "license",
      lastUpdated: "2024-02-01",
      content: `Настоящее Лицензионное соглашение (далее - "Соглашение") является юридически обязывающим документом между Вами и ТОО "T-Service Co" (далее - "Компания") относительно использования программного обеспечения, веб-сайтов и мобильных приложений.

1. ПРЕДМЕТ СОГЛАШЕНИЯ

Компания предоставляет Вам ограниченную, неисключительную, непередаваемую лицензию на использование наших сервисов в соответствии с условиями данного Соглашения.

Лицензия включает в себя право использования:
- Веб-платформы tservice.uz
- Мобильных приложений для iOS и Android
- API интерфейсов для интеграции
- Сопутствующей документации

2. ПРАВА И ОБЯЗАННОСТИ ПОЛЬЗОВАТЕЛЯ

Вы имеете право:
- Использовать сервисы в личных или коммерческих целях в рамках функциональности платформы
- Получать техническую поддержку в соответствии с выбранным тарифным планом
- Получать обновления программного обеспечения и новые функции
- Экспортировать свои данные в стандартных форматах

Вы обязуетесь:
- Соблюдать все применимые законы и правила Республики Узбекистан
- НЕ использовать сервисы для незаконных целей или мошеннических действий
- НЕ нарушать права третьих лиц
- Обеспечивать безопасность своих учетных данных
- НЕ передавать доступ к аккаунту третьим лицам без согласования

3. ОГРАНИЧЕНИЯ ИСПОЛЬЗОВАНИЯ

Вам запрещается:
- Копировать, модифицировать или распространять исходный код программного обеспечения
- Осуществлять обратную разработку (reverse engineering)
- Удалять уведомления об авторских правах и торговых марках
- Использовать автоматизированные средства сбора данных без разрешения
- Создавать производные работы на основе нашего ПО

4. ИНТЕЛЛЕКТУАЛЬНАЯ СОБСТВЕННОСТЬ

Все права на программное обеспечение, торговые марки, дизайн интерфейса и контент принадлежат Компании или ее лицензиарам. Данная лицензия не передает права собственности на программное обеспечение.

5. КОНФИДЕНЦИАЛЬНОСТЬ

Использование сервисов регулируется нашей Политикой конфиденциальности, которая является неотъемлемой частью данного соглашения.

6. ОТВЕТСТВЕННОСТЬ И ГАРАНТИИ

Компания предоставляет сервисы "как есть" и не гарантирует их безошибочную работу 24/7. Компания не несет ответственности за косвенные убытки, упущенную выгоду или потерю данных, возникшие в результате использования сервисов.

7. СРОК ДЕЙСТВИЯ И РАСТОРЖЕНИЕ

Соглашение действует до его расторжения любой из сторон. Компания вправе расторгнуть соглашение при нарушении пользователем его условий.`
    },
    {
      id: 3,
      title: "Пользовательское соглашение",
      category: "user_agreement",
      lastUpdated: "2024-01-20",
      content: `ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ

Настоящее Пользовательское соглашение (далее - "Соглашение") регулирует отношения между ТОО "T-Service Co" (далее - "Компания") и пользователями (далее - "Пользователь") сайта tservice.uz и мобильных приложений.

1. ОБЩИЕ ПОЛОЖЕНИЯ

1.1. Данное Соглашение является публичной офертой в соответствии со статьей 392 Гражданского кодекса Республики Узбекистан.

1.2. Использование сайта означает полное и безоговорочное согласие с условиями настоящего Соглашения.

1.3. Компания вправе изменять условия Соглашения без предварительного уведомления. Новые условия вступают в силу с момента их размещения на сайте.

1.4. Продолжение использования сервиса после внесения изменений означает согласие с новыми условиями.

2. ПРЕДМЕТ СОГЛАШЕНИЯ

2.1. Компания предоставляет Пользователю доступ к информационным сервисам для размещения и поиска объявлений о специальной технике, оборудовании и сопутствующих услугах.

2.2. Сервисы предоставляются на условиях "как есть" (as is) без каких-либо гарантий.

2.3. Компания оставляет за собой право изменять функциональность сервиса без предварительного уведомления.

3. РЕГИСТРАЦИЯ И УЧЕТНЫЕ ЗАПИСИ

3.1. Для полного доступа к функциям сайта необходима регистрация.

3.2. При регистрации Пользователь обязуется предоставить достоверную и полную информацию.

3.3. Пользователь несет ответственность за сохранность своих учетных данных.

3.4. Запрещается создание нескольких аккаунтов одним лицом без согласования с администрацией.

4. ПРАВА И ОБЯЗАННОСТИ ПОЛЬЗОВАТЕЛЯ

4.1. Пользователь имеет право:
- Размещать объявления в соответствии с правилами сайта и действующим законодательством
- Использовать поисковые и фильтрующие функции сайта
- Обращаться в службу технической поддержки
- Редактировать и удалять свои объявления
- Получать уведомления о статусе своих объявлений

4.2. Пользователь обязуется:
- Предоставлять достоверную информацию в объявлениях
- Соблюдать законодательство Республики Узбекистан
- Не нарушать права третьих лиц
- Не размещать запрещенную законом информацию
- Не использовать сервис для мошеннических действий
- Уважительно относиться к другим пользователям

4.3. Пользователю запрещается:
- Размещать объявления о продаже запрещенных товаров
- Использовать нецензурную лексику и оскорбительные выражения
- Размещать контент, нарушающий авторские права
- Создавать спам или рассылать нежелательные сообщения
- Пытаться получить несанкционированный доступ к системе

5. ПРАВА И ОБЯЗАННОСТИ КОМПАНИИ

5.1. Компания имеет право:
- Модерировать размещаемый контент в соответствии с внутренними правилами
- Блокировать или удалять аккаунты нарушителей
- Изменять функциональность сервиса для его улучшения
- Приостанавливать работу сервиса для технического обслуживания
- Устанавливать ограничения на количество объявлений

5.2. Компания обязуется:
- Обеспечивать работоспособность сервиса в рамках технических возможностей
- Защищать персональные данные пользователей в соответствии с Политикой конфиденциальности
- Предоставлять техническую поддержку пользователям
- Информировать об изменениях в работе сервиса

6. ОТВЕТСТВЕННОСТЬ СТОРОН

6.1. Пользователь несет полную ответственность за размещаемую информацию и ее соответствие действующему законодательству.

6.2. Компания не несет ответственности за:
- Действия третьих лиц на платформе
- Качество товаров и услуг, предлагаемых пользователями
- Финансовые потери, возникшие в результате сделок между пользователями
- Временную недоступность сервиса по техническим причинам

6.3. Общая ответственность Компании ограничена суммой, эквивалентной стоимости платных услуг, оплаченных пользователем.

7. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ

7.1. Споры между сторонами разрешаются путем переговоров, а при невозможности достижения соглашения - в соответствии с законодательством Республики Узбекистан.

7.2. При признании отдельных положений Соглашения недействительными, остальные положения сохраняют свою силу.

7.3. Соглашение составлено на узбекском и русском языках. При расхождении в толковании приоритет имеет узбекская версия.`
    }
  ];

  const tabData = [
    {
      label: "Политика конфиденциальности",
      shortLabel: "Конфиденциальность",
      icon: FiShield,
      category: "privacy",
      color: "green"
    },
    {
      label: "Лицензионное соглашение",
      shortLabel: "Лицензия",
      icon: FiFileText,
      category: "license",
      color: "blue"
    },
    {
      label: "Пользовательское соглашение",
      shortLabel: "Пользователь",
      icon: FiUsers,
      category: "user_agreement",
      color: "purple"
    },
    {
      label: "Контакты",
      shortLabel: "Контакты",
      icon: FiPhone,
      category: "contacts",
      color: "orange"
    }
  ];

const Oservices = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  // Responsive values
  const tabOrientation = useBreakpointValue({ base: 'horizontal', lg: 'vertical' });
  const sidebarWidth = useBreakpointValue({ base: '100%', xl: '320px' });
  const contentHeight = useBreakpointValue({ base: '500px', xl: '600px' });
  const cardPadding = useBreakpointValue({ base: 4, xl: 6 });
  const contentPadding = useBreakpointValue({ base: 4, md: 6 });
  const isMobile = useBreakpointValue({ base: true, xl: false });

  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const primaryColor = '#FFC107'; // Yellow color
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('yellow.50', 'yellow.900');

  const ContactsContent = () => (
    <VStack spacing={6} align="stretch">
      <Box>
        <Text fontSize="2xl" fontWeight="bold" color={textColor} mb={4}>
          Контактная информация
        </Text>
        <Text color="gray.500" mb={6}>
          Мир спецтехники - ваш надежный партнер
        </Text>
        <Divider />
      </Box>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Card bg={cardBg} shadow="sm" borderRadius="lg" border="1px solid" borderColor={borderColor}>
          <CardBody p={4}>
            <HStack spacing={3} mb={2}>
              <Icon as={FiMail} color={primaryColor} fontSize="lg" />
              <Text fontWeight="semibold" color={textColor}>Email</Text>
            </HStack>
            <Link 
              href="mailto:info@tservice.uz" 
              color="blue.500" 
              _hover={{ color: "blue.600" }}
              fontSize="sm"
            >
              info@tservice.uz
            </Link>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} shadow="sm" borderRadius="lg" border="1px solid" borderColor={borderColor}>
          <CardBody p={4}>
            <HStack spacing={3} mb={2}>
              <Icon as={FiPhone} color={primaryColor} fontSize="lg" />
              <Text fontWeight="semibold" color={textColor}>Телефон</Text>
            </HStack>
            <Text color={textColor} fontSize="sm">+998 71 123-45-67</Text>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} shadow="sm" borderRadius="lg" border="1px solid" borderColor={borderColor}>
          <CardBody p={4}>
            <HStack spacing={3} mb={2}>
              <Icon as={FiGlobe} color={primaryColor} fontSize="lg" />
              <Text fontWeight="semibold" color={textColor}>Веб-сайт</Text>
            </HStack>
            <Link 
              href="https://tservice.uz" 
              isExternal 
              color="blue.500" 
              _hover={{ color: "blue.600" }}
              fontSize="sm"
            >
              www.tservice.uz
            </Link>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} shadow="sm" borderRadius="lg" border="1px solid" borderColor={borderColor}>
          <CardBody p={4}>
            <HStack spacing={3} mb={2}>
              <Icon as={FiMapPin} color={primaryColor} fontSize="lg" />
              <Text fontWeight="semibold" color={textColor}>Адрес</Text>
            </HStack>
            <Text color={textColor} fontSize="sm">
              г. Ташкент, Узбекистан
            </Text>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Card bg={cardBg} shadow="sm" borderRadius="lg" border="1px solid" borderColor={borderColor}>
        <CardBody p={6}>
          <VStack spacing={4} align="stretch">
            <HStack spacing={3}>
              <Icon as={FiInfo} color={primaryColor} fontSize="lg" />
              <Text fontWeight="semibold" color={textColor}>О компании</Text>
            </HStack>
            <Text color={textColor} fontSize="sm" lineHeight="1.6">
              ТОО "T-Service Co" - ведущая платформа по продаже и аренде специальной техники в Узбекистане. 
              Мы предоставляем удобный сервис для размещения объявлений о спецтехнике, оборудовании и 
              сопутствующих услугах. Наша цель - сделать рынок спецтехники более доступным и прозрачным 
              для всех участников.
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );

  const getFilteredDocuments = (category) => {
    return documents.filter(doc => doc.category === category);
  };

  // Scrollbar styles
    const scrollbarStyles = {
    '&::-webkit-scrollbar': {
        width: '10px',
    },
    '&::-webkit-scrollbar-track': {
        background: useColorModeValue('#f1f1f1', '#2d3748'),
        borderRadius: '10px', 
    },
    '&::-webkit-scrollbar-thumb': {
        background: '#fed500',
        borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: '#ffd000',
    },
    // Firefox uchun
    scrollbarWidth: 'auto',
    scrollbarColor: '#fed500 ' + useColorModeValue('#f1f1f1', '#2d3748'),
    };

  return (
    <Box minH={{base: "100vh", custom570: "80vh"}}  py={{base: "80px", custom570: 0}}  bg={bgColor}>
      <Container maxW={"100%"} p={3}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <Card 
            bg={cardBg} 
            shadow="lg" 
            borderRadius="xl"
            border="1px solid"
            borderColor={borderColor}
            display={{base: "none", custom570: "block"}}
          >
            <CardBody p={cardPadding}>
              <Stack 
                direction={"row"} 
                spacing={4} 
                align={"center"}
              >
                <Box
                  bg={primaryColor}
                  p={3}
                  borderRadius="lg"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                >
                  <Icon as={FiFileText} fontSize="20px" color="black" />
                </Box>
                <Box flex={1} w={"100%"}>
                  <Text fontSize={{ base: '16px', md: '20px' }} fontWeight="bold" color={textColor}>
                    TService.uz
                  </Text>
                  <Text color="gray.500" fontSize="sm" lineHeight={"1.2"}>
                    Мир спецтехники - правовая информация
                  </Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>

          {/* Main Content */}
          <Tabs 
            orientation={tabOrientation}
            variant="enclosed" 
            index={activeTab}
            onChange={setActiveTab}
            size="lg"
          >
            <Stack 
              direction={{ base: 'column', xl: 'row' }} 
              spacing={6} 
              align="stretch"
            >
              {/* Sidebar - Tabs */}
              <Box width={sidebarWidth} flexShrink={0}>
                <TabList
                  bg={cardBg}
                  borderRadius="xl"
                  p={2}
                  border="1px solid"
                  borderColor={borderColor}
                  shadow="lg"
                  flexDirection={{ base: 'row', xl: 'column' }}
                  overflowX={{ base: 'auto', lg: 'visible' }}
                  overflowY="visible"
                  sx={{
                    ...scrollbarStyles,
                    '& .chakra-tabs__tab': {
                      flex: { base: 'none', lg: 'initial' },
                    }
                  }}
                >
                  {tabData.map((tab, index) => (
                    <Tab
                      key={index}
                      _selected={{
                        bg: primaryColor,
                        color: "black",
                        fontWeight: "bold",
                        transform: "translateY(-2px)",
                        shadow: "md"
                      }}
                      _hover={isMobile ? {} : {
                        bg: hoverBg,
                        transform: "translateY(-1px)",
                        shadow: "sm"
                      }}
                      borderRadius="lg"
                      mb={{ base: 0, xl: 2 }}
                      mr={{ base: 2, xl: 0 }}
                      p={4}
                      w={{ base: 'auto', xl: 'full' }}
                      minW={{ base: '140px', lg: '160px' , xl: 'auto' }}
                      maxW={{ base: '220px', xl: 'none' }}
                      justifyContent="flex-start"
                      transition="all 0.2s"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      flexShrink={0}
                    >
                      <HStack spacing={2} w="full" overflow="hidden">
                        <Icon as={tab.icon} fontSize="lg" flexShrink={0} />
                        <Text 
                          fontSize="sm" 
                          textAlign="left"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                          flex={1}
                        >
                          {isMobile ? tab.shortLabel : tab.label}
                        </Text>
                      </HStack>
                    </Tab>
                  ))}
                </TabList>
              </Box>

              {/* Content Area */}
              <Box flex={1} minW={0}>
                <TabPanels>
                  {tabData.map((tab, index) => (
                    <TabPanel key={index} p={0}>
                      {tab.category === 'contacts' ? (
                        <Card 
                          bg={cardBg} 
                          shadow="lg" 
                          borderRadius="xl"
                          border="1px solid"
                          borderColor={borderColor}
                        >
                          <CardBody p={contentPadding}>
                            <ContactsContent />
                          </CardBody>
                        </Card>
                      ) : (
                        <Card 
                          bg={cardBg} 
                          shadow="lg" 
                          borderRadius="xl" 
                          h={contentHeight}
                          border="1px solid"
                          overflowY={'auto'}
                          borderColor={borderColor}
                          overflowX={'hidden'}
                          whiteSpace={'wrap'}
                          sx={scrollbarStyles}
                        >
                          <CardBody p={0}>
                            <VStack spacing={0} h="full">
                              {/* Panel Header */}
                              <Box 
                                w="full" 
                                p={contentPadding} 
                                borderBottom="1px solid" 
                                borderColor={borderColor}
                                bg={useColorModeValue('gray.50', 'gray.750')}
                                borderTopRadius="xl"
                              >
                                <Stack 
                                  direction={{ base: 'column', sm: 'row' }}
                                  justify="space-between" 
                                  align={{ base: 'start', sm: 'center' }}
                                  spacing={3}
                                >
                                  <HStack spacing={3}>
                                    <Icon as={tab.icon} color={`${tab.color}.500`} fontSize="xl" />
                                    <Text 
                                      fontSize={{ base: 'md', lg: 'lg' }} 
                                      fontWeight="bold" 
                                      color={textColor}
                                      noOfLines={2}
                                    >
                                      {tab.label}
                                    </Text>
                                  </HStack>
                                  <Badge colorScheme={tab.color} variant="subtle" flexShrink={0}>
                                    <HStack spacing={1}>
                                      <Icon as={FiClock} fontSize="xs" />
                                      <Text fontSize="xs">
                                        {getFilteredDocuments(tab.category)[0]?.lastUpdated}
                                      </Text>
                                    </HStack>
                                  </Badge>
                                </Stack>
                              </Box>

                              {/* Scrollable Content */}
                              <Box
                                flex={1}
                                w="full"
                                p={contentPadding}
                              >
                                <VStack spacing={6} align="stretch">
                                  {getFilteredDocuments(tab.category).map((doc) => (
                                    <Box key={doc.id}>
                                      <Text
                                        fontSize={{ base: 'lg', lg: 'xl' }}
                                        fontWeight="bold"
                                        color={textColor}
                                        mb={4}
                                        lineHeight="1.4"
                                      >
                                        {doc.title}
                                      </Text>
                                      <Box
                                        color={textColor}
                                        lineHeight="1.7"
                                        fontSize={{ base: 'sm', md: 'sm' }}
                                        sx={{
                                          '& p': {
                                            mb: 4
                                          }
                                        }}
                                      >
                                        {doc.content.split('\n\n').map((paragraph, pIndex) => (
                                          <Text key={pIndex} mb={4}>
                                            {paragraph}
                                          </Text>
                                        ))}
                                      </Box>
                                    </Box>
                                  ))}
                                </VStack>
                              </Box>
                            </VStack>
                          </CardBody>
                        </Card>
                      )}
                    </TabPanel>
                  ))}
                </TabPanels>
              </Box>
            </Stack>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
};

export default Oservices;