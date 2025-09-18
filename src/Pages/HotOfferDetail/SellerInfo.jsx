import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  Flex,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FaUser } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { CallbackModal } from "../../components/CallbackModal";
import { useCallback } from "react";
import { MdBusiness } from "react-icons/md";

// Seller Info Component - Responsive
export const SellerInfo = ({ author, createdAt }) => {
  const avatarSize = useBreakpointValue({ base: "md", md: "lg" });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    isOpen: isCallbackOpen,
    onClose: onCallbackClose,
    onOpen: onCallbackOpen,
  } = useDisclosure();
  
  const handleCallbackMessage = useCallback(() => {
    onCallbackOpen();
  }, [onCallbackOpen]);

  // Callback submission handler
  const handleCallbackSubmit = useCallback(async (data) => {
    console.log("Leeds ga yuboradigan api joyi", data);
  }, []);


  return (
    <>
      <Card borderRadius="xl" boxShadow="lg">
        <CardBody p={{ base: 4, md: 6 }}>
          <VStack align="start" spacing={4}>
            <Stack
              direction={{ base: "column", sm: "row" }}
              align={{ base: "center", sm: "start" }}
              spacing={4}
              w="full"
            >
              {author?.is_company ? (
                // Kompaniya avatar
                <Avatar
                  icon={<MdBusiness size={30} />}
                  src={author?.avatar || undefined}
                  size={avatarSize}
                />
              ) : (
                <Avatar
                  src={author?.avatar || undefined}
                  size={avatarSize}
                />
              )}


              <VStack
                align={{ base: "center", sm: "start" }}
                spacing={1}
                flex={1}
              >
                <Text
                  fontWeight="bold"
                  fontSize={{ base: "md", md: "lg" }}
                  textAlign={{ base: "center", sm: "left" }}
                  onClick={() => navigate( author?.is_company ? `/about-company/${author?.id}` : `/users/${author?.id}`)}
                  cursor={"pointer"}
                >
                  {author?.name}
                </Text>
                <Flex
                  wrap="wrap"
                  gap={2}
                  justify={{ base: "center", sm: "flex-start" }}
                >
                  {author?.is_company && (
                    <Badge
                      colorScheme="blue"
                      borderRadius={"full"}
                      textTransform={"none"}
                      px={2}
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      {t("hotOfferDetail.company", "Компания")}
                    </Badge>
                  )}
                  {author?.is_official && (
                    <Badge
                      colorScheme="green"
                      borderRadius={"full"}
                      px={2}
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      {t("partners.official", "Официальный")}
                    </Badge>
                  )}
                </Flex>
              </VStack>
            </Stack>
            <HStack w={"100%"} flexDir={author?.is_company ? "column" : "row"}>
              <Button
                leftIcon={<FaUser />}
                color={"blue.400"}
                variant="outline"
                w="full"
                borderRadius="xl"
                size={{ base: "sm", md: "md" }}
                _hover={{ transform: "translateY(-2px)" }}
                transition="all 0.2s"
                onClick={() => navigate(author?.is_company ? `/about-company/${author?.id}` : `/users/${author?.id}`)}
              >
                {t("hotOfferDetail.authors_order", "Все объявления автора")}
              </Button>
              {author?.is_company && (
                <Button
                  leftIcon={<FaRegMessage />}
                  color={"blue.400"}
                  variant="outline"
                  w="full"
                  borderRadius="xl"
                  size={{ base: "sm", md: "md" }}
                  _hover={{ transform: "translateY(-2px)" }}
                  transition="all 0.2s"
                  onClick={handleCallbackMessage}
                >
                  Заказать обратный звонок
                </Button>
              )}
            </HStack>
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              color="gray.600"
              textAlign={{ base: "center", sm: "left" }}
              w="full"
            >
              {t("hotOfferDetail.platform", "Время входа на платформу:")}{" "}
              {new Date(createdAt).toLocaleDateString("ru-RU")}
            </Text>
          </VStack>
        </CardBody>
      </Card>
      <CallbackModal
        isOpen={isCallbackOpen}
        onClose={onCallbackClose}
        onSubmit={handleCallbackSubmit}
      />
    </>
  );
};
