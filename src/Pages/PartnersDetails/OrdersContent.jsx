import { Box, Button, Card, CardBody, Center, Collapse, Heading, IconButton, Input, InputGroup, InputLeftElement, Select, Stack, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiFilter, FiSearch, FiTruck, FiX } from "react-icons/fi";



// Tab Content Components
export const OrdersContent = ({ onToggleFilter, isfilterbtn, filters, setFilters, clearFilters }) => {
  const { t } = useTranslation();
  return ( 
    <Box>
      {/* Filters */}
      <Box 
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        spacing={2} 
        bg="white" 
        p={3} 
        borderRadius="2xl" 
        boxShadow="lg"
        border="1px"
        borderColor="gray.100"
        px={8}
        mb={3}
        onClick={onToggleFilter}
      >
        <Text
          color={'p.black'}
          fontSize={'18px'}
          fontWeight={'normal'}
        >
          {t("adsfilterblock.filter", "Фильтры")}
        </Text>
        <IconButton
          icon={<FiFilter />}
          color={'p.black'}
          bg={'white'}
          border={'1px'}
          borderColor={'gray.300'}
          _hover={
            {
              bg: 'gray.50',
            }
          }
          borderRadius="xl"
        />
      </Box>

      <Collapse in={isfilterbtn} animateOpacity>
        <Card mb={10} borderRadius="2xl" border="1px" borderColor="gray.100" boxShadow="lg">
          <CardBody p={6}>
            <Stack spacing={4}>
              {/* Search and Price Range */}
              <Stack 
                direction={{ base: 'column', md: 'row' }} 
                spacing={4}
                width="full"
              >
                {/* Search Input */}
                <InputGroup flex={1}>
                  <InputLeftElement pointerEvents="none">
                    <FiSearch color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder={t("partsmarketplace.search_placeholder", "Поиск по товарам...")}
                    value={filters.search}
                    onChange={(e) => setFilters({filters, search: e.target.value})}
                    borderColor="gray.200"
                    borderRadius="xl"
                    _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px #4299e1' }}
                    bg="white"
                  />
                </InputGroup>

                {/* Price Range Inputs */}
                <Stack direction="row" spacing={2} minW={{ base: 'full', md: '250px' }}>
                  <Input
                    placeholder={t("partsmarketplace.price_placeholder_from", "Цена от")}
                    type="number"
                    value={filters.priceFrom}
                    onChange={(e) => setFilters({filters, priceFrom: e.target.value})}
                    borderColor="gray.200"
                    borderRadius="xl"
                    _focus={{ borderColor: 'blue.400' }}
                    bg="white"
                  />
                  <Input
                    placeholder={t("partsmarketplace.price_placeholder_to", "до")}
                    type="number"
                    value={filters.priceTo}
                    onChange={(e) => setFilters({filters, priceTo: e.target.value})}
                    borderColor="gray.200"
                    borderRadius="xl"
                    _focus={{ borderColor: 'blue.400' }}
                    bg="white"
                  />
                </Stack>
              </Stack>

              {/* Category, City and Clear Filters */}
              <Stack 
                direction={{ base: 'column', md: 'row' }} 
                spacing={4}
                align="stretch"
              >
                <Select
                  placeholder={t("partsmarketplace.category", "Категория")}
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  borderColor="gray.200"
                  borderRadius="xl"
                  _focus={{ borderColor: 'blue.400' }}
                  bg="white"
                  flex={1}
                >
                  <option value="parts">{t("partsmarketplace.spare_parts", "Запчасти")}</option>
                  <option value="engines">{t("partsmarketplace.dvigatel", "Двигатели")}</option>
                  <option value="hydraulics">{t("partsmarketplace.gidravlika", "Гидравлика")}</option>
                </Select>
                
                <Select
                  placeholder={t("adsfilterblock.category_label_city", "Город")}
                  value={filters.city}
                  onChange={(e) => setFilters({filters, city: e.target.value})}
                  borderColor="gray.200"
                  borderRadius="xl"
                  _focus={{ borderColor: 'blue.400' }}
                  bg="white"
                  flex={1}
                >
                  <option value="shymkent">Шымкент</option>
                  <option value="almaty">Алматы</option>
                  <option value="astana">Астана</option>
                </Select>
                
                <Button
                  leftIcon={<FiX />}
                  onClick={clearFilters}
                  variant="ghost"
                  color={'blue.400'}
                  borderRadius="xl"
                  _hover={{ bg: 'gray.100' }}
                  minW={{ base: 'full', md: '120px' }}
                >
                  {t("partners.reset", "Очистить")}
                </Button>
              </Stack>
            </Stack>
          </CardBody>
        </Card>
      </Collapse>
      <Heading size="lg" mb={6} color="gray.800">Активные заказы</Heading>
      <Card borderRadius="2xl" border="1px" borderColor="gray.100">
        <CardBody p={8}>
          <Center flexDirection="column" py={8}>
            <Box
              w={16}
              h={16}
              bg="blue.50"
              borderRadius="2xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={4}
            >
              <FiTruck size="32" color="#4299e1" />
            </Box>
            <Text color="gray.500" fontSize="lg" textAlign="center">
              У вас пока нет активных заказов
            </Text>
            <Text color="gray.400" fontSize="sm" textAlign="center" mt={2}>
              Ваши заказы будут отображаться здесь
            </Text>
          </Center>
        </CardBody>
      </Card>
    </Box>
)};