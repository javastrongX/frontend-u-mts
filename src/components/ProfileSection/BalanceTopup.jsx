import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
  useBreakpointValue,
  Flex,
  IconButton
} from '@chakra-ui/react';
import { FiPlus, FiDownload, FiTrendingUp, FiActivity, FiClock, FiCreditCard, FiSmartphone, FiDollarSign, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import {transactionTypes, transactions as initialTransactions, balanceData} from "./data/tabdata"
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function BalanceTopup() {
  const { t } = useTranslation();
  const [topupAmount, setTopupAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [activeTab, setActiveTab] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  // Load transactions from localStorage on component mount
  const savedTransactions = localStorage.getItem('transactions');
  useEffect(() => {
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    } else {
      setTransactions(initialTransactions);
    }
  }, []);

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

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

  // Handle balance top-up
  const handleTopup = useCallback(() => {
    if (isTopupDisabled) return;

    const amount = parseInt(topupAmount);
    const bonus = calculateBonus(amount);
    
    // Get current date
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long'
    });
    
    const formattedTime = currentDate.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Create new transaction
    const newTransaction = {
      id: Date.now(), // Simple ID generation
      type: 'income',
      amount: `+${formatNumber(amount)} som`,
      desc: t("TabContent.balance.balance_topup", "Пополнение баланса"),
      date: formattedDate,
      time: formattedTime,
      status: 'pending',
      paymentMethod: paymentMethod,
      bonus: bonus
    };

    // Add to transactions list
    setTransactions(prev => [newTransaction, ...prev]);

    // Log transaction data to console
    // console.log('Transaction Data:', {
    //   amount: amount,
    //   bonus: bonus,
    //   paymentMethod: paymentMethod,
    //   date: formattedDate,
    //   time: formattedTime,
    //   total: amount + bonus
    // });

    // Reset form
    setTopupAmount('');
    setPaymentMethod('bank');
    
    // Switch to pending tab to show the new transaction
    setActiveTab(1);
  }, [topupAmount, paymentMethod, calculateBonus, formatNumber, isTopupDisabled, t]);

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

  // Filter transactions by type
  const getFilteredTransactions = useCallback((filterType) => {
    switch (filterType) {
      case 'all':
        return transactions;
      case 'pending':
        return transactions.filter(t => t.status === 'pending');
      case 'recharges':
        return transactions.filter(t => t.type === 'income');
      case 'payments':
        return transactions.filter(t => t.type === 'expense');
      default:
        return transactions;
    }
  }, [transactions]);

  // Get current filtered transactions
  const currentTransactions = useMemo(() => {
    const tabTypes = ['all', 'pending', 'recharges', 'payments'];
    return getFilteredTransactions(tabTypes[activeTab]);
  }, [activeTab, getFilteredTransactions]);

  // Pagination logic
  const totalPages = Math.ceil(currentTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = currentTransactions.slice(startIndex, endIndex);

  // Reset pagination when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Get latest transaction date for display
  const getLatestTransactionDate = useMemo(() => {
    if (currentTransactions.length === 0) return null;
    const latest = currentTransactions[0];
    return {
      date: latest.date,
      time: latest.time || '00:00'
    };
  }, [currentTransactions]);

  // Render transaction item
  const renderTransactionItem = useCallback((transaction, index, transactionList) => (
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
            px={3}
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
              {transaction.paymentMethod === 'bank' && t("TabContent.balance.method_card", "Способ оплаты: Банковской картой")}
              {transaction.paymentMethod === 'operator' && t("TabContent.balance.method_operator", "Способ оплаты: Оператором связи")}
              {transaction.paymentMethod === 'clickup' && t("TabContent.balance.method_clickup", "Способ оплаты: Clickup")}
              {!transaction.paymentMethod && t("TabContent.balance.method_card", "Способ оплаты: Банковской картой")}
            </Text>
            <HStack>
              {transaction.status === 'pending' && (
                <Badge colorScheme="yellow" fontSize="10px" p={1} px={2} mt={1} borderRadius={'full'}>
                  {t("TabContent.balance.pending", "Ожидает")}
                </Badge>
              )}
              {transaction.bonus && (
                <Badge colorScheme="green" fontSize="10px" p={1} px={2} mt={1} borderRadius={'full'}>
                  {t("TabContent.balance.bonus", "Бонус")}: +{formatNumber(transaction.bonus)}
                </Badge>
              )}
            </HStack>
          </VStack>
        </HStack>
        <VStack 
          align={{ base: 'start', sm: 'end' }} 
          spacing={0}
          flexShrink={0}
        >
          <Text fontSize="xs" color="gray.500">
            {transaction.date} {transaction.time && `в ${transaction.time}`}
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
      {index < transactionList.length - 1 && <Divider />}
    </Box>
  ), [t, formatNumber]);

  // Render empty state
  const renderEmptyState = useCallback((message) => (
    <Text color="gray.500" textAlign="center" py={8}>
      {message}
    </Text>
  ), []);

  // Render pagination controls
  const renderPaginationControls = useCallback(() => {
    if (totalPages <= 1) return null;

    return (
      <Flex justify="center" align="center" mt={4} gap={2}>
        <IconButton
          icon={<FiChevronLeft />}
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          isDisabled={currentPage === 1}
          size="sm"
          variant="outline"
        />
        <Text fontSize="sm" color="gray.600">
          {currentPage} / {totalPages}
        </Text>
        <IconButton
          icon={<FiChevronRight />}
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          isDisabled={currentPage === totalPages}
          size="sm"
          variant="outline"
        />
      </Flex>
    );
  }, [currentPage, totalPages]);

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
                  {t("TabContent.balance.current", "Текущий баланс")}
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
                  {t("TabContent.balance.bonuses", "Бонусы")} {formatNumber(balanceData.currentBonus)}
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
                {t("TabContent.balance.top_up", "Пополнить")}
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
                  {t("TabContent.balance.month_income", "Доходы за месяц")}
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
                  {t("TabContent.balance.total_transactions", "Всего транзакций")}
                </Text>
                <Text fontSize="sm" fontWeight="bold" color="blue.500">
                  {transactions.length}
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
                  {t("TabContent.balance.average_time", "Среднее время")}
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
                {t("TabContent.balance.enter_amount", "Введите сумму пополнения")}
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
                    {formatNumber(amount)} {t("currency.uzs", "сум")}
                  </Button>
                ))}
              </SimpleGrid>

              {/* Custom Amount Input */}
              <Box position="relative" id='topup'>
                <Input
                  placeholder={t("TabContent.balance.enter_price_min", "Введите цену (мин. 35,000 сум)")}
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
                    +{formatNumber(currentBonus)} {t("TabContent.balance.bonus", "бонус")}
                  </Badge>
                )}
              </Box>

              <Text fontSize="sm" color="gray.500">
                {t("TabContent.balance.bonus_offer", "от 200,000 сум +20% бонус")}
              </Text>

              {/* Payment Methods */}
              <VStack align="stretch" spacing={3}>
                <Text fontWeight="semibold">{t("TabContent.balance.payment_method", "Способ оплаты")}</Text>
                <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
                  <Stack spacing={3}>
                    <Radio value="bank" colorScheme="yellow">
                      <HStack>
                        <Icon as={FiCreditCard} />
                        <Text fontSize="sm">{t("TabContent.balance.by_card", "Банковской картой")}</Text>
                      </HStack>
                    </Radio>
                    <Radio value="operator" colorScheme="yellow">
                      <HStack>
                        <Icon as={FiSmartphone} />
                        <Text fontSize="sm">{t("TabContent.balance.by_operator", "Оператором связи")}</Text>
                      </HStack>
                    </Radio>
                    <Radio value="clickup" colorScheme="yellow">
                      <HStack>
                        <Icon as={FiDollarSign} />
                        <Text fontSize="sm">{t("TabContent.balance.remote_clickup", "Удаленная оплата (Clickup)")}</Text>
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
                onClick={handleTopup}
                _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
                transition="all 0.2s"
                w="full"
              >
                {isTopupDisabled 
                ? t("TabContent.balance.enter_min_amount", "Введите сумму (мин. 35,000 сум)") 
                : t("TabContent.balance.confirm_top_up", "Пополнить баланс")}
              </Button>
            </VStack>
          </CardBody>
        </Card>

        {/* Transaction History */}
        <Card boxShadow="xl" borderRadius="2xl">
          <CardBody p={cardPadding}>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between" align="center" wrap="wrap">
                <Text fontSize={fontSize} fontWeight="semibold">
                  {t("TabContent.balance.transaction_history", "История транзакций")}
                </Text>
                {getLatestTransactionDate && (
                  <Text fontSize="lg" fontWeight="bold" color="gray.600">
                    {getLatestTransactionDate.date} в {getLatestTransactionDate.time}
                  </Text>
                )}
              </HStack>
              
              <Tabs index={activeTab} onChange={setActiveTab} colorScheme="yellow">
                <TabList overflowX="auto" overflowY="hidden">
                  <Tab fontSize="sm" minW="auto" px={3}>
                    {t("TabContent.balance.all", "Все")} ({getFilteredTransactions('all').length})
                  </Tab>
                  <Tab fontSize="sm" minW="auto" px={3}>
                    {t("TabContent.balance.pending", "Ожидает")} ({getFilteredTransactions('pending').length})
                  </Tab>
                  <Tab fontSize="sm" minW="auto" px={3}>
                    {t("TabContent.balance.recharges", "Пополнения")} ({getFilteredTransactions('recharges').length})
                  </Tab>
                  <Tab fontSize="sm" minW="auto" px={3}>
                    {t("TabContent.balance.payments", "Оплата")} ({getFilteredTransactions('payments').length})
                  </Tab>
                </TabList>
                
                <TabPanels>
                  {[0, 1, 2, 3].map((tabIndex) => (
                    <TabPanel key={tabIndex} px={0}>
                      <VStack spacing={3} align="stretch">
                        {paginatedTransactions.length > 0 ? (
                          <>
                            {paginatedTransactions.map((transaction, index) => 
                              renderTransactionItem(transaction, index, paginatedTransactions)
                            )}
                            {renderPaginationControls()}
                          </>
                        ) : (
                          renderEmptyState(
                            tabIndex === 0 ? t("TabContent.balance.no_transactions", "Нет транзакций") :
                            tabIndex === 1 ? t("TabContent.balance.no_pending", "Нет ожидающих транзакций") :
                            tabIndex === 2 ? t("TabContent.balance.no_recharges", "Нет пополнений") :
                            t("TabContent.balance.no_payments", "Нет оплат")
                          )
                        )}
                      </VStack>
                    </TabPanel>
                  ))}
                </TabPanels>
              </Tabs>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}