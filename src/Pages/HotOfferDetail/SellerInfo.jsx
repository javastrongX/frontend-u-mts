import { Avatar, Badge, Button, Card, CardBody, Flex, Stack, Text, useBreakpointValue, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FaUser } from "react-icons/fa";

// Seller Info Component - Responsive
export const SellerInfo = ({ author, createdAt }) => {
  const avatarSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const { t } = useTranslation();
  return (
    <Card borderRadius="xl" boxShadow="lg">
      <CardBody p={{ base: 4, md: 6 }}>
        <VStack align="start" spacing={4}>
          <Stack 
            direction={{ base: 'column', sm: 'row' }} 
            align={{ base: 'center', sm: 'start' }}
            spacing={4}
            w="full"
          >
            <Avatar 
              src={author?.avatar} 
              name={author?.name}
              size={avatarSize}
            />
            <VStack align={{ base: 'center', sm: 'start' }} spacing={1} flex={1}>
              <Text 
                fontWeight="bold" 
                fontSize={{ base: 'md', md: 'lg' }}
                textAlign={{ base: 'center', sm: 'left' }}
              >
                {author?.name}
              </Text>
              <Flex 
                wrap="wrap" 
                gap={2} 
                justify={{ base: 'center', sm: 'flex-start' }}
              >
                {author?.is_company && (
                  <Badge colorScheme="blue" borderRadius={'full'} px={2}  fontSize={{ base: 'xs', md: 'sm' }}>
                    {t("hotOfferDetail.company", "Компания")}
                  </Badge>
                )}
                {author?.is_official && (
                  <Badge colorScheme="green" borderRadius={'full'} px={2}  fontSize={{ base: 'xs', md: 'sm' }}>
                    {t("partners.official", "Официальный")}
                  </Badge>
                )}
              </Flex>
            </VStack>
          </Stack>

          <Button
            leftIcon={<FaUser />}
            color={'blue.400'}
            variant="outline"
            w="full"
            borderRadius="xl"
            size={{ base: 'sm', md: 'md' }}
            _hover={{ transform: "translateY(-2px)" }}
            transition="all 0.2s"
          >
            {t("hotOfferDetail.authors_order", "Все объявления автора")}
          </Button>

          <Text 
            fontSize={{ base: 'xs', md: 'sm' }} 
            color="gray.600"
            textAlign={{ base: 'center', sm: 'left' }}
            w="full"
          >
            {t("hotOfferDetail.platform", "Время входа на платформу:")} {new Date(createdAt).toLocaleDateString('ru-RU')}
          </Text>
        </VStack>
      </CardBody>
    </Card>
  );
};
