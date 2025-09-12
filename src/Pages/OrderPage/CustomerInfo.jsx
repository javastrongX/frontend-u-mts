import { Avatar, Badge, Box, Button, Card, CardBody, Flex, Heading, HStack, IconButton, Text, Tooltip, useColorModeValue, VStack } from "@chakra-ui/react";
import React, { memo, useCallback, useMemo, useState } from "react";
import { FaPhone, FaShare } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { orderData } from "./constants/mockdata";
import { useStats } from "../../components/PostStats";

const formatPhone = (phone) => {
  return `+998 ${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(
    5,
    7
  )} ${phone.slice(7, 10)}`;
};

// Memoized Customer Info Component
const CustomerInfo = memo(({ isOpen, t, handleCallbackMessage }) => {
  const [showPhone, setShowPhone] = useState(false);
  const cardBg = useColorModeValue("white", "gray.800");
  const { track } = useStats(orderData.id);

  // Memoize formatted phone
  const formattedPhone = useMemo(() => formatPhone(orderData.phone), []);

  const handleShowPhone = useCallback(() => {
    setShowPhone(true);
    track("calls")
  }, []);

  return (
    <Card bg={cardBg} shadow="lg" borderRadius="2xl" w="full" overflow="hidden">
      <Box
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        p={6}
        color="white"
      >
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="lg">{t("orderdetail.seller", "Заказчик")}</Heading>
          {orderData.author?.is_company ? (
            <Badge colorScheme="whiteAlpha" variant="solid">
              {t("orderdetail.sellerCompany", "Компания")}
            </Badge>
          ) : (
            <Badge colorScheme="whiteAlpha" variant="solid">
              {t("orderdetail.seller", "Заказчик")}
            </Badge>
          )}
        </Flex>

        <HStack spacing={4}>
          <Avatar
            size="lg"
            src={orderData.author.avatar}
            border="3px solid"
            borderColor="whiteAlpha.300"
            loading="lazy"
          />
          <Box>
            <Text
              as={"a"}
              href={
                orderData.author?.is_company
                  ? `/about-company/${orderData.author.id}`
                  : `/users/${orderData.author.id}`
              }
              fontWeight="bold"
              fontSize="lg"
            >
              {orderData.author.name}
            </Text>
            <HStack spacing={2}>
              <Text fontSize="sm" opacity={"0.9"}>
                {orderData.author.orders_count}{" "}
                {t("orderdetail.count_orders", "заказов")}
              </Text>
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
              bg: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
            }}
            _active={{ transform: "scale(0.98)" }}
            transition="all 0.2s"
            onClick={handleShowPhone}
            as={showPhone ? "a" : "button"}
            href={showPhone ? `tel:${orderData.phone}` : undefined}
          >
            {showPhone
              ? formattedPhone
              : t("orderdetail.show_phone", "Показать номер")}
          </Button>
          <Button
            leftIcon={<FiMessageCircle />}
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
              bg: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
            }}
            _active={{ transform: "scale(0.98)" }}
            transition="all 0.2s"
            onClick={handleCallbackMessage}
          >
            {t("orderdetail.callback", "Заказать обратный звонок")}
          </Button>

          <HStack spacing={3} w="full">
            <Tooltip label={t("hotOfferDetail.label_ulashish", "Поделиться")}>
              <IconButton
                icon={<FaShare />}
                color={"blue.400"}
                variant="outline"
                size="lg"
                borderRadius="xl"
                onClick={isOpen}
                flex={1}
                _hover={{
                  transform: "translateY(-1px)",
                  shadow: "md",
                  bg: "blue.50",
                }}
                transition="all 0.2s"
                aria-label="Share"
              />
            </Tooltip>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
});

CustomerInfo.displayName = "CustomerInfo";

export default CustomerInfo;