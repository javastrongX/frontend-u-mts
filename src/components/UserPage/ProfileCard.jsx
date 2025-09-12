import { Avatar, Box, Button, Flex, Icon, Text, useBreakpointValue, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiPhone, FiShare2 } from "react-icons/fi";

const maskPhone = (phone, show) =>
  show ? `+998 ${phone}` : phone.replace(/(\d{2})\d{3}\d{2}\d{2}/, "+998 $1 XXX-XX-XX");

function ProfileCard({ user, onShare, showPhone, setShowPhone }) {
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const { t } = useTranslation();
  return (
    !isMobile ? (
      <Box
        bg="white"
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="lg"
        p={7}
        textAlign="center"
        minW={0}
        position="sticky"
        top={{ base: 0, md: 6 }}
        boxShadow="lg"
      >
        <VStack spacing={4}>
          <Avatar
            size="2xl"
            name={user.name}
            src={user.avatar}
            bg={'#f4f4f4'}
            color={'gray.800'}
          />
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="bold"
            color="gray.800"
            isTruncated
          >
            {user.name}
          </Text>
          <Text fontSize="sm" color="gray.500">{user.joinDate}</Text>
          <Flex align="center" gap={1} flexDir={'column'}>
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} gap={3}>
              <FiPhone color="green.500" />
              <Text
                fontWeight="semibold"
                color="gray.800"
                fontSize={{ base: "md", md: "lg" }}
                letterSpacing="wider"
                onClick={() => setShowPhone(v => !v)}
                cursor="pointer"
                _hover={{ textDecoration: "underline", color: "blue.400" }}
              >
                {maskPhone(user.phone, showPhone)}{" "}
              </Text>
            </Box>
              <Button onClick={() => setShowPhone(v => !v)} variant="link" size="sm" color="blue.400" fontWeight="bold" ml={1} px={2}>
                {showPhone ? t("ProfileMobile.hide", "Скрыть") : t("ProfileMobile.show", "Показать номер")}
              </Button>
          </Flex>
          <Button
            mt={1}
            leftIcon={<FiShare2 />}
            variant="solid"
            size="sm"
            fontWeight="bold"
            borderRadius="md"
            bg={'orange.50'}
            border={'2px solid transparent'}
            _hover={{borderColor: "#fed500", bg: 'orange.100'}}
            px={6}
            onClick={onShare}
          >
            {t('UserPage.share', "Поделиться")}
          </Button>
        </VStack>
      </Box>
    ) : (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="lg"
      p={4}
      minW={0}
      position="sticky"
      boxShadow="sm"
    >
      <Flex align="center" justify="space-between">
        <VStack align="flex-start" spacing={1}>
          <Text
            fontSize={{ base: "18x", md: "20px" }}
            fontWeight="bold"
            color="gray.800"
            whiteSpace={'wrap'}
          >
            {user.name}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {user.joinDate}
          </Text>
        </VStack>
        <Text
          variant="outline"
          fontSize={'sm'}
          fontWeight="bold"
          display={'flex'}
          alignItems={'center'}
          whiteSpace={'nowrap'}
          borderRadius="full"
          color={'gray.500'}
          onClick={onShare}
          cursor={'pointer'}
          _hover={{ color: 'blue.500' }}
        >
         <Icon as={FiShare2} mr={2} />  {t('UserPage.share', "Поделиться")}
        </Text>
      </Flex>
    </Box>
    )
  );
}

export default ProfileCard;