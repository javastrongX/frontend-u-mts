import { Box, Card, CardBody, FormControl, FormLabel, Grid, GridItem, Heading, HStack, IconButton, Input, Select, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { FiFilter, FiRefreshCw, FiSearch } from "react-icons/fi";

const LeadFIlter = ({
    cardBg,
    handleRefresh,
    loading,
    isMobile,
    phoneFilter,
    setPhoneFilter,
    setStatusFilter,
    statusFilter,
    statusConfig,
    
}) => {
  const { t } = useTranslation();
  return (
    <Card bg={cardBg} borderRadius="xl" shadow="lg">
      <CardBody p={6}>
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between" align="center">
            <HStack spacing={3}>
              <Box
                p={2}
                bg="linear-gradient(135deg, #ffff00, #ffa600)"
                borderRadius="lg"
              >
                <FiFilter size={18} color="black" />
              </Box>
              <Heading size="md" color="gray.700">
                {t("Business_mode.Leeds.filtr.filters", "Фильтры")}
              </Heading>
            </HStack>

            <IconButton
              aria-label="Yangilash"
              icon={<FiRefreshCw />}
              size="md"
              variant="ghost"
              colorScheme="yellow"
              onClick={handleRefresh}
              isLoading={loading}
              borderRadius="lg"
            />
          </HStack>

          <Grid
            templateColumns={isMobile ? "1fr" : "1fr auto"}
            gap={6}
            alignItems="end"
          >
            <GridItem>
              <FormControl>
                <FormLabel fontSize="sm" color="gray.600" fontWeight="600">
                  <HStack spacing={2}>
                    <FiSearch size={16} color="#fed500" />
                    <Text>{t("Business_mode.Leeds.filtr.search", "Поиск (телефон или имя)")}</Text>
                  </HStack>
                </FormLabel>
                <Input
                  placeholder={t("Business_mode.Leeds.filtr.searchPlaceholder", "Введите номер телефона или имя...")}
                  value={phoneFilter}
                  onChange={(e) => setPhoneFilter(e.target.value)}
                  focusBorderColor="#fed500"
                  size="lg"
                  borderRadius="xl"
                  bg="gray.50"
                  _hover={{ bg: "white" }}
                  _focus={{ bg: "white" }}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl maxW={isMobile ? "full" : "200px"}>
                <FormLabel fontSize="sm" color="gray.600" fontWeight="600">
                  {t("Business_mode.Leeds.filtr.status", "Статус")}
                </FormLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  focusBorderColor="#fed500"
                  size="lg"
                  borderRadius="xl"
                  bg="gray.50"
                  _hover={{ bg: "white" }}
                  _focus={{ bg: "white" }}
                >
                  <option value="all">{t("Business_mode.Leeds.filtr.all", "Все")}</option>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
          </Grid>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default LeadFIlter;
