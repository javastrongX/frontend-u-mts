import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Card,
  CardBody,
  Text,
  Button,
  Input,
  SimpleGrid,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Radio,
  RadioGroup,
  Stack,
  Divider,
  Icon,
  useBreakpointValue
} from '@chakra-ui/react';
import { FiPlus, FiDownload, FiTrendingUp, FiActivity, FiClock, FiCreditCard, FiSmartphone, FiDollarSign } from 'react-icons/fi';

import {transactionTypes, transactions, balanceData} from "./data/tabdata"
import { useNavigate } from 'react-router-dom';


export default function BalanceTopup() {
  const [topupAmount, setTopupAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [activeTab, setActiveTab] = useState(0);

  const navigate = useNavigate();

  // Responsive breakpoints
  const statsColumns = useBreakpointValue({ base: 1, sm: 2, md: 3 });
  const cardSpacing = useBreakpointValue({ base: 4, md: 6 });
  const cardPadding = useBreakpointValue({ base: 4, md: 6 });
  const fontSize = useBreakpointValue({ base: '18px', md: '25px' });
  const balanceFontSize = useBreakpointValue({ base: '22px', md: '30px' });
  const buttonSize = useBreakpointValue({ base: 'md', md: 'lg' });

  const predefinedAmounts = [35000, 70000, 200000, 1000000];

  const calculateBonus = useCallback((amount) => {
    if (amount > 200000){
        return Math.floor(amount / 5);
    }
    return Math.floor(amount / 10);
  }, []);

  const handleAmountChange = useCallback((value) => {
    // Only allow numeric input
    const numericValue = value.replace(/[^0-9]/g, '');
    setTopupAmount(numericValue);
  }, []);

  const formatInputValue = useCallback((value) => {
    if (!value) return '';
    // Format number with spaces as thousand separators
    return parseInt(value).toLocaleString('ru-RU').replace(/,/g, ' ');
  }, []);

  const currentBonus = useMemo(() => {
    return topupAmount ? calculateBonus(parseInt(topupAmount) || 0) : 0;
  }, [topupAmount, calculateBonus]);

  const isTopupDisabled = !topupAmount || parseInt(topupAmount) < 35000;

  const formatNumber = useCallback((number) => {
    return number.toLocaleString('ru-RU');
  }, []);

  // Scroll to topup section with autofocus
  const scrollToTopup = useCallback(() => {
    const topupElement = document.getElementById('topup');
    if (topupElement) {
      topupElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      // Focus on the input after scrolling
      setTimeout(() => {
        const inputElement = topupElement.querySelector('input');
        if (inputElement) {
          inputElement.focus();
        }
      }, 500); // Delay to ensure smooth scroll completes
    }
  }, []);


  return (
    <Box 
      maxW="100%" 
      mx="auto" 
      p={{ base: 3, md: 4 }} 
      bg="gray.50"
      py={{base: '100px', custom570: 0}} 
      minH="100vh"
    >
      <VStack spacing={cardSpacing} align="stretch">
        {/* Balance Card */}
        <Card 
          boxShadow="2xl" 
          borderRadius="2xl" 
          bgGradient="linear(135deg, yellow.400, orange.400)"
        >
          <CardBody p={cardPadding}>
            <Box 
              display="flex" 
              flexDirection={{ base: "column", md: "row" }} 
              alignItems={{ md: "center" }} 
              justifyContent="space-between"
              color="white"
              gap={cardSpacing}
            >
              <VStack align="start" spacing={2}>
                <Text fontSize={fontSize} fontWeight={{ base: "medium", md: "bold" }}>
                  Текущий баланс
                </Text>
                <Text fontSize={balanceFontSize} fontWeight="bold">
                  {formatNumber(balanceData.currentBalance)} {balanceData.currency}
                </Text>
                <Badge 
                  colorScheme="whiteAlpha" 
                  fontSize="sm" 
                  px={3} 
                  py={1} 
                  borderRadius="xl" 
                  bg="whiteAlpha.300"
                  color="white"
                  transition="all 0.2s ease-in-out"
                  _hover={{ bg: "whiteAlpha.400" }}
                  cursor="default"
                >
                  Бонусы: {formatNumber(balanceData.currentBonus)}
                </Badge>
              </VStack>

              <Button 
                colorScheme="whiteAlpha" 
                leftIcon={<FiPlus />} 
                borderRadius="xl"
                onClick={scrollToTopup}
                size={buttonSize}
                w={{ base: 'full', md: '200px' }}
                mt={{ base: 4, md: 0 }}
              >
                Пополнить
              </Button>
            </Box>
          </CardBody>
        </Card>


        {/* Stats Cards */}
        <SimpleGrid columns={statsColumns} spacing={3}>
          <Card borderRadius="xl" boxShadow="lg">
            <CardBody p={4} textAlign="center">
              <VStack spacing={2}>
                <Box w={'45px'} h={"45px"} display={'flex'} justifyContent={'center'} alignItems={'center'} p={2} bg="green.100" borderRadius="full">
                  <Icon as={FiTrendingUp} color="green.500" boxSize={4} />
                </Box>
                <Text fontSize="xs" fontWeight="semibold">
                  Доходы за месяц
                </Text>
                <Text fontSize="sm" fontWeight="bold" color="green.500">
                  +{formatNumber(balanceData.monthlyIncome)} {balanceData.currency}
                </Text>
              </VStack>
            </CardBody>
          </Card>
          
          <Card borderRadius="xl" boxShadow="lg">
            <CardBody p={4} textAlign="center">
              <VStack spacing={2}>
                <Box w={'45px'} h={"45px"} display={'flex'} justifyContent={'center'} alignItems={'center'} p={2} bg="blue.100" borderRadius="full">
                  <Icon as={FiActivity} color="blue.500" boxSize={4} />
                </Box>
                <Text fontSize="xs" fontWeight="semibold">
                  Всего транзакций
                </Text>
                <Text fontSize="sm" fontWeight="bold" color="blue.500">
                  {balanceData.totalTransactions}
                </Text>
              </VStack>
            </CardBody>
          </Card>
          
          <Card borderRadius="xl" boxShadow="lg">
            <CardBody p={4} textAlign="center">
              <VStack spacing={2}>
                <Box w={'45px'} h={"45px"} display={'flex'} justifyContent={'center'} alignItems={'center'} p={2} bg="purple.100" borderRadius="full">
                  <Icon as={FiClock} color="purple.500" boxSize={4} />
                </Box>
                <Text fontSize="xs" fontWeight="semibold">
                  Среднее время
                </Text>
                <Text fontSize="sm" fontWeight="bold" color="purple.500">
                  {balanceData.averageTime}
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Top-up Section */}
        <Card boxShadow="xl" borderRadius="2xl">
          <CardBody p={cardPadding}>
            <VStack spacing={6} align="stretch">
              <Text fontSize={fontSize} fontWeight="semibold">
                Введите сумму пополнения
              </Text>
              
              {/* Predefined Amounts */}
              <SimpleGrid columns={{base: 2, sm: 3, custom680: 4 }} spacing={3}>
                {predefinedAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={topupAmount === amount.toString() ? "solid" : "outline"}
                    colorScheme={topupAmount === amount.toString() ? "yellow" : "gray"}
                    borderRadius="xl"
                    fontSize={{base: 'xs', custom380: 'sm', sm: '16px'}}
                    onClick={() => handleAmountChange(amount.toString())}
                    w="full"
                  >
                    {formatNumber(amount)} som
                  </Button>
                ))}
              </SimpleGrid>

              {/* Custom Amount Input */}
              <Box position="relative" id='topup'>
                <Input
                  placeholder="Введите цену (мин. 35,000 som)"
                  value={formatInputValue(topupAmount)}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  size={buttonSize}
                  borderRadius="xl"
                  focusBorderColor="yellow.400"
                  bg="gray.50"
                  border="2px"
                  borderColor="gray.200"
                  _focus={{ bg: "white" }}
                  pr={currentBonus > 0 ? "100px" : "16px"}
                />
                {currentBonus > 0 && (
                  <Badge
                    position="absolute"
                    right={3}
                    top="50%"
                    transform="translateY(-50%)"
                    bg={'orange.50'}
                    color={'p.black'}
                    borderRadius="lg"
                    px={2}
                    py={1}
                    fontSize="xs"
                  >
                    +{formatNumber(currentBonus)} бонус
                  </Badge>
                )}
              </Box>

              <Text fontSize="sm" color="gray.500">
                от 200,000 som +20% бонус
              </Text>

              {/* Payment Methods */}
              <VStack align="stretch" spacing={3}>
                <Text fontWeight="semibold">Способ оплаты</Text>
                <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
                  <Stack spacing={3}>
                    <Radio value="bank" colorScheme="yellow">
                      <HStack>
                        <Icon as={FiCreditCard} />
                        <Text fontSize="sm">Банковской картой</Text>
                      </HStack>
                    </Radio>
                    <Radio value="operator" colorScheme="yellow">
                      <HStack>
                        <Icon as={FiSmartphone} />
                        <Text fontSize="sm">Оператором связи</Text>
                      </HStack>
                    </Radio>
                    <Radio value="clickup" colorScheme="yellow">
                      <HStack>
                        <Icon as={FiDollarSign} />
                        <Text fontSize="sm">Удаленная оплата (Clickup)</Text>
                      </HStack>
                    </Radio>
                  </Stack>
                </RadioGroup>
              </VStack>

              <Button
                colorScheme="yellow"
                size={buttonSize}
                borderRadius="xl"
                isDisabled={isTopupDisabled}
                _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
                transition="all 0.2s"
                w="full"
              >
                {isTopupDisabled ? 'Введите сумму (мин. 35,000 som' : 'Пополнить баланс'}
              </Button>
            </VStack>
          </CardBody>
        </Card>

        {/* Transaction History */}
        <Card boxShadow="xl" borderRadius="2xl">
          <CardBody p={cardPadding}>
            <VStack spacing={4} align="stretch">
              <Text fontSize={fontSize} fontWeight="semibold">
                История транзакций
              </Text>
              
              <Tabs index={activeTab} onChange={setActiveTab} colorScheme="yellow">
                <TabList overflowX="auto" overflowY="hidden">
                  <Tab fontSize="sm" minW="auto" px={3}>Все</Tab>
                  <Tab fontSize="sm" minW="auto" px={3}>Ожидает</Tab>
                  <Tab fontSize="sm" minW="auto" px={3}>Пополнения</Tab>
                  <Tab fontSize="sm" minW="auto" px={3}>Оплата</Tab>
                </TabList>
                
                <TabPanels>
                  <TabPanel px={0}>
                    <VStack spacing={3} align="stretch">
                      {transactions.map((transaction, index) => (
                        <Box key={transaction.id}>
                          <Stack 
                            direction={{ base: 'column', sm: 'row' }}
                            justify="space-between" 
                            py={3}
                            spacing={3}
                          >
                            <HStack>
                              <Box 
                                p={2} 
                                bg={transaction.type === 'income' ? 'green.100' : 'red.100'} 
                                borderRadius="lg"
                                flexShrink={0}
                              >
                                <Icon
                                  as={transaction.type === 'income' ? FiTrendingUp : FiDownload}
                                  color={transaction.type === 'income' ? 'green.500' : 'red.500'}
                                  boxSize={4}
                                />
                              </Box>
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="medium" fontSize="sm">
                                  {transaction.desc}
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                  Способ оплаты: Банковской картой
                                </Text>
                              </VStack>
                            </HStack>
                            <VStack 
                              align={{ base: 'start', sm: 'end' }} 
                              spacing={0}
                              flexShrink={0}
                            >
                              <Text fontSize="xs" color="gray.500">
                                {transaction.date}
                              </Text>
                              <Text 
                                fontWeight="bold" 
                                color={`${transactionTypes[transaction.type]}.500`}
                                fontSize="sm"
                              >
                                {transaction.amount}
                              </Text>
                            </VStack>
                          </Stack>
                          {index < transactions.length - 1 && <Divider />}
                        </Box>
                      ))}
                    </VStack>
                  </TabPanel>
                  <TabPanel px={0}>
                    <Text color="gray.500" textAlign="center" py={8}>
                      Нет ожидающих транзакций
                    </Text>
                  </TabPanel>
                  <TabPanel px={0}>
                    <Text color="gray.500" textAlign="center" py={8}>
                      Нет пополнений
                    </Text>
                  </TabPanel>
                  <TabPanel px={0}>
                    <Text color="gray.500" textAlign="center" py={8}>
                      Нет оплат
                    </Text>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}