import React from 'react';
import { Box, HStack, Image, Text, VStack, useColorModeValue, Link } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const ServiceCategoriesGrid = () => {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  const { t } = useTranslation();

  const services = [
    {
      id: 1,
      title: t("side_nav.sell_special_tech", "Продажа спецтехники"),
      img: './CategoryIcons/excavator.png',
      imgSize: {base: "180px", custom570: "200px", custom680: "220px", md: "240px"},
      imgHeight: {base: "140px", custom570: "160px", custom680: "180px", md: "200px"},
      fontSize: { base: "14px", sm: "16px", md: "18px" },
      link: '/ads?category_id=1',
      special: true
    },
    {
      id: 2,
      title: t("side_nav.rentgrid", "Аренда спецтехники"),
      img: './CategoryIcons/rental.png',
      imgSize: { base: "40px", sm: "40px", md: "60px" },
      fontSize: { base: "12px", sm: "12px", md: "14px" },
      link: '/ads?category_id=2'
    },
    {
      id: 3,
      title: t("side_nav.orders", "Заказы"),
      img: './CategoryIcons/application.png',
      imgSize: { base: "40px", sm: "50px", md: "60px" },
      fontSize: { base: "12px", sm: "13px", md: "14px" },
      link: '/applications'
    },
    {
      id: 4,
      title: t("side_nav.spare_parts", "Запчасти"),
      img: './CategoryIcons/sparepart.png',
      imgSize: "50px",
      fontSize: { base: "11px", sm: "12px", md: "14px" },
      link: '/ads?category_id=3'
    },
    {
      id: 5,
      title: t("side_nav.repair", "Ремонт"),
      img: './CategoryIcons/repair.png',
      imgSize: "50px",
      fontSize: { base: "11px", sm: "12px", md: "14px" },
      link: '/ads?category_id=4'
    },
    {
      id: 6,
      title: t("side_nav.drivers", "Водители"),
      img: './CategoryIcons/driver.png',
      imgSize: "50px",
      fontSize: { base: "11px", sm: "12px", md: "14px" },
      link: '/ads?category_id=5'
    }
  ];

  const ServiceCard = ({ service }) => (
    <Link href={service.link} _hover={{ textDecoration: 'none' }}>
      <Box
        bg="linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)"
        borderRadius={{ base: "lg", md: "xl" }}
        p={3}
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        position="relative"
        transition="all 0.3s"
        _hover={{
          transform: 'translateY(-4px)',
          boxShadow: 'lg',
          bg: "linear-gradient(135deg, #e9ecef 0%, #f8f9fa 100%)"
        }}
        boxShadow="md"
        border="1px solid"
        borderColor={borderColor}
        h="100%"
      >
        {service.special ? (
          <Box display="flex" w="100%" h="100%" position="relative">
            <Box position="absolute" top={0} left={0} zIndex={1}>
              <Text fontSize={service.fontSize} fontWeight="medium" color={textColor} lineHeight="short">
                {service.title}
              </Text>
            </Box>
            <Box position="absolute" bottom={-6} right={0} zIndex={2}>
              <Image
                src={service.img}
                w={service.imgSize}
                h={service.imgHeight}
                objectFit="contain"
                alt={service.title}
                ml={5}
              />
            </Box>
          </Box>
        ) : service.id === 2 || service.id === 3 ? (
          <HStack spacing={2} px={3} w="100%" h="100%" justify="center" align="center">
            <Text fontSize={service.fontSize} textAlign={'center'} fontWeight="medium" color={textColor} lineHeight="short">
              {service.title}
            </Text>
            <Image src={service.img} w={service.imgSize} h={service.imgSize} objectFit="contain" alt={service.title} />
          </HStack>
        ) : (
          <Box
            display="flex"
            flexDirection={{ base: "column", sm: "row" }}
            alignItems="center"
            justifyContent="center"
            w="100%"
            h="100%"
            textAlign="center"
            gap={{ base: 1, sm: 2 }}
          >
            <Text
              fontSize={service.fontSize}
              fontWeight="medium"
              color={textColor}
              lineHeight="short"
              order={{ base: 2, sm: 1 }}
              flex={{ base: "none", sm: 1 }}
            >
              {service.title}
            </Text>
            <Image
              src={service.img}
              w={service.imgSize}
              h={service.imgSize}
              objectFit="contain"
              alt={service.title}
              order={{ base: 1, sm: 2 }}
            />
          </Box>
        )}
      </Box>
    </Link>
  );

  return (
    <Box mb="40px">
      <VStack spacing={{ base: 2, sm: 3 }} w="100%">
        <HStack spacing={{ base: 2, sm: 3 }} w="100%" align="stretch">
          <Box flex="2" minH={{ base: "120px", sm: "150px", md: "180px" }}>
            <ServiceCard service={services[0]} />
          </Box>
          <VStack flex="1" spacing={{ base: 2, sm: 3 }} h="100%">
            <Box flex="1" w="100%">
              <ServiceCard service={services[1]} />
            </Box>
            <Box flex="1" w="100%">
              <ServiceCard service={services[2]} />
            </Box>
          </VStack>
        </HStack>
        <HStack spacing={{ base: 2, sm: 3 }} w="100%">
          {services.slice(3).map(service => (
            <Box key={service.id} flex="1">
              <ServiceCard service={service} />
            </Box>
          ))}
        </HStack>
      </VStack>
    </Box>
  );
};

export default ServiceCategoriesGrid;