import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Text, 
  Avatar, 
  VStack, 
  HStack, 
  Badge,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
  Divider
} from '@chakra-ui/react';

const Coming = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    // Navigate orqali kelgan ma'lumotlarni olish
    if (location.state) {
      const { companyData, activityData, registrationSuccess, skipped } = location.state;
      
      if (registrationSuccess && companyData) {
        setCompanyData(companyData);
        setActivityData(activityData);
        setSkipped(skipped || false);
        console.log('Kelgan kompaniya ma\'lumotlari:', companyData);
        console.log('Activities:', activityData);
        console.log('Skipped:', skipped);
      } else {
        // Agar ma'lumotlar yo'q bo'lsa, oldingi sahifaga qaytarish
        navigate('/auth/registration-performer');
      }
    } else {
      // Agar state yo'q bo'lsa, oldingi sahifaga qaytarish
      navigate('/auth/registration-performer');
    }
  }, [location, navigate]);

  if (!companyData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Text>Yuklanyapti...</Text>
      </Box>
    );
  }

  // Activity ma'lumotlarini render qilish funksiyasi
  const renderActivitySection = (title, items, colorScheme = "blue") => {
    if (!items || items.length === 0) return null;

    return (
      <VStack align="start" spacing={3} w="full">
        <Text fontSize="md" fontWeight="semibold" color="gray.700">
          {title} ({items.length})
        </Text>
        <Wrap spacing={2}>
          {items.map((item, index) => (
            <WrapItem key={index}>
              <Tag size="md" colorScheme={colorScheme} borderRadius="full">
                <TagLabel fontSize="sm">{item}</TagLabel>
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
      </VStack>
    );
  };

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <VStack spacing={6} maxW="lg" mx="auto" px={6}>
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          Kompaniya ma'lumotlari
        </Text>

        {/* Kompaniya ma'lumotlarini ko'rsatish */}
        <Box bg="white" p={6} borderRadius="md" shadow="sm" w="full">
          <HStack spacing={4} mb={4}>
            <Avatar
              size="lg"
              src={companyData.logoPreview || companyData.formData?.logoPreview}
              name={companyData.companyName}
            />
            <VStack align="start" spacing={1}>
              <Text fontSize="lg" fontWeight="semibold">
                {companyData.companyName}
              </Text>
              <Text fontSize="sm" color="gray.600">
                БИН: {companyData.bin}
              </Text>
              <HStack>
                <Badge colorScheme="blue">{companyData.country}</Badge>
                <Badge colorScheme="green">{companyData.city}</Badge>
              </HStack>
            </VStack>
          </HStack>
          
          {companyData.description && (
            <Text fontSize="sm" color="gray.700" mt={2}>
              {companyData.description}
            </Text>
          )}
          
          <Text fontSize="xs" color="gray.500" mt={2}>
            Ro'yxatdan o'tgan: {new Date(companyData.timestamp).toLocaleString('uz-UZ')}
          </Text>
        </Box>

        {/* Faoliyat ma'lumotlarini ko'rsatish */}
        <Box bg="white" p={6} borderRadius="md" shadow="sm" w="full">
          <HStack justify="space-between" align="center" mb={4}>
            <Text fontSize="lg" fontWeight="semibold">
              Faoliyat ma'lumotlari
            </Text>
            {skipped && (
              <Badge colorScheme="orange" px={2} py={1}>
                O'tkazib yuborilgan
              </Badge>
            )}
          </HStack>

          {activityData && !skipped ? (
            <VStack spacing={6} align="stretch">
              {/* Buyurtma sozlamalari */}
              {renderActivitySection(
                "Buyurtma sozlamalari", 
                activityData.orderSettings, 
                "blue"
              )}

              {/* Texnika turlari */}
              {renderActivitySection(
                "Texnika turlari", 
                activityData.techTypes, 
                "green"
              )}

              {/* Ishlagan brendlar */}
              {renderActivitySection(
                "Ishlagan brendlar", 
                activityData.workingBrands, 
                "purple"
              )}

              {/* Umumiy statistika */}
              <Divider />
              <Box bg="gray.50" p={4} borderRadius="md">
                <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
                  Umumiy statistika:
                </Text>
                <HStack spacing={4} wrap="wrap">
                  <Text fontSize="sm" color="gray.600">
                    Buyurtma sozlamalari: 
                    <Badge ml={1} colorScheme="blue">
                      {activityData.orderSettings?.length || 0}
                    </Badge>
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Texnika turlari: 
                    <Badge ml={1} colorScheme="green">
                      {activityData.techTypes?.length || 0}
                    </Badge>
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Brendlar: 
                    <Badge ml={1} colorScheme="purple">
                      {activityData.workingBrands?.length || 0}
                    </Badge>
                  </Text>
                </HStack>
              </Box>
            </VStack>
          ) : (
            <VStack spacing={4} align="center" py={8}>
              <Text fontSize="md" color="gray.500" textAlign="center">
                {skipped 
                  ? "Faoliyat ma'lumotlari o'tkazib yuborilgan"
                  : "Faoliyat ma'lumotlari mavjud emas"
                }
              </Text>
              {skipped && (
                <Text fontSize="sm" color="gray.400" textAlign="center">
                  Keyinchalik profil sozlamalaridan to'ldirishingiz mumkin
                </Text>
              )}
            </VStack>
          )}
        </Box>

        {/* Debug ma'lumotlari (development uchun) */}
        {process.env.NODE_ENV === 'development' && (
          <Box bg="yellow.50" p={4} borderRadius="md" w="full" border="1px solid" borderColor="yellow.200">
            <Text fontSize="sm" fontWeight="semibold" color="yellow.800" mb={2}>
              Debug Ma'lumotlari:
            </Text>
            <Text fontSize="xs" color="yellow.700" as="pre" whiteSpace="pre-wrap">
              {JSON.stringify({ companyData, activityData, skipped }, null, 2)}
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default Coming;