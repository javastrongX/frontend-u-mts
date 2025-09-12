import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Heading
} from '@chakra-ui/react';
import { FiEye } from 'react-icons/fi';
import OrderCard from './OrderCard';
import { useTranslation } from 'react-i18next';

const DateSection = ({ date, orders }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedOrders = showAll ? orders : orders.slice(0, 3);
  const { t } = useTranslation();
  return (
    <Box mb="8">
      <HStack mb="4" spacing="4" flexWrap="wrap">
        <Heading size="md" color="gray.700">
          {date}
        </Heading>
        <Badge 
          colorScheme="blue" 
          borderRadius="full" 
          px="3" 
          py="1"
          fontSize="xs"
        >
          {t("DateSection.fresh_top_ads", "Свежие ТОП объявления")}
        </Badge>
      </HStack>
      
      <Text fontSize="sm" color="gray.500" mb="4">
        {t("DateSection.interesting_ads", "Эти объявления могут быть вам интересны")}
      </Text>
      
      <VStack spacing="4" align="stretch">
        {displayedOrders.map((order, index) => (
          <OrderCard key={order.id} order={order} index={index} />
        ))}
      </VStack>
      
      {orders.length > 3 && (
        <Button
          mt="4"
          colorScheme="yellow"
          variant="solid"
          borderRadius="xl"
          size="lg"
          w="full"
          leftIcon={<FiEye />}
          onClick={() => setShowAll(!showAll)}
          transition="all 0.3s ease"
          _hover={{
            transform: 'scale(1.02)',
            boxShadow: 'lg'
          }}
        >
          {showAll ? t("rightsidebar.hide", "Скрыть") : t("DateSection.show_more", "Показать больше")}
        </Button>
      )}
    </Box>
  );
};

export default DateSection;