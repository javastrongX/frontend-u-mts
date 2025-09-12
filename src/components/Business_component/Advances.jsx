import {
  Box,
  Button,
  Grid,
  Heading,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import {  FiHeart } from "react-icons/fi";
import { LuPackageSearch } from "react-icons/lu";
import { MdOutlineSettings } from "react-icons/md";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { FaStore } from "react-icons/fa6";
import { VscFlame } from "react-icons/vsc";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";


const Advances = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const features = [
    {
      icon: LuPackageSearch,
      title: t("business.card1_title", "Управление товарами"),
      description:
        t("business.advance_card1", "Загрузка и обновление каталогов товаров в несколько кликов.\nВозможность архивировать товары или поднимать их в топ для увеличения видимости.\nМассовая конвертация цен с помощью встроенного конвертера валют — упрощает работу с международными клиентами.")
    },
    { 
      icon: MdOutlineSettings,
      title: t("business.card2_title", "Эффективная работа с клиентами"),
      description:
        t("business.advance_card2", "Получение и обработка заказов напрямую через платформу.\nУведомления о новых запросах, чтобы вы всегда оставались в курсе интереса клиентов.")
    },
    {
      icon: HiOutlineUserGroup,
      title: t("business.card3_title", "Работа с персоналом"),
      description:
        t("business.advance_card3", "Добавляйте сотрудников с разграничением прав доступа для управления объявлениями и статистикой.\nЗагрузка сертификатов компании для повышения доверия со стороны клиентов.")
    },
    {
      icon: FaStore,
      title: t("business.card4_title", "Анализ и статистика"),
      description:
        t("business.advance_card4", "Полная статистика по объявлениям: количество просмотров, звонков и сообщений.\nОтчёты, которые помогут оценить эффективность ваших объявлений и настроить стратегию продаж.")
    },
    {
      icon: VscFlame,
      title: t("business.card5_title", "Горячие лиды"),
      description:
        t("business.advance_card5", "Теперь вы можете получать горячие лиды через форму обратного звонка в объявлениях. Контактные данные клиента сохраняются в системе, что помогает бизнес-партнерам быстро реагировать и повышать шансы на сделку. Присоединяйтесь к платформе для успешного привлечения клиентов и роста продаж!")
    },
    {
      icon: FiHeart,
      title: t("business.card6_title", "Рассылка по избранным"),
      description:
        t("business.advance_card6", "Предлагайте скидки покупателям, которые добавили ваши объявления в «Избранное», не более двух раз в месяц. Это поможет вам поддерживать интерес к вашим товарам и стимулировать повторные покупки, а также укрепит связь с потенциальными клиентами.")
    },
  ];

  return (
    <Box py={{ base: 10, custom900: 20 }} px={6} maxW="75rem" mx="auto">
      <Heading as="h2" textAlign="center" fontSize={{base: "24px", custom900: "38px"}} fontWeight={'600'} mb={{base: 8, custom900: 12}}>
        {t("business.advance_title", "Преимущества Uzmat Business")}
      </Heading>

      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        gap={8}
        mb={12}
      >
        {features.map((feature, index) => (
          <Box
            key={index}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="xl"
            p={6}
            cursor={"pointer"}
            boxShadow={'sm'}
            transition={'0.2s all'}
            _hover={{ boxShadow: "md", transform: "scale(0.99)" }}
          >
            <VStack align="start" spacing={4}>
              <Box bg="orange.250" p={2} borderRadius="xl" display={'flex'} alignItems="center" justifyContent="center">
                <Icon as={feature.icon} boxSize={{base: 10, custom900: 12}} color="black" />
              </Box>
              <Text fontWeight="600" fontSize={{base: "20px",custom900: "28px"}}>
                {feature.title}
              </Text>
              <Text fontSize={{ base: "16px", custom900: "sm" }} color="gray.700">
                {feature.description.split("\n").map((line, idx) => (
                  <span key={idx}>
                    {line}
                    <br />
                  </span>
                ))}
              </Text>
            </VStack>
          </Box>
        ))}
      </Grid>

      <Box textAlign="center">
        <Button
          size={{base: "md", custom900: "lg"}}
          onClick={() => navigate('/auth/registration-performer')}
          w={{ base: "100%", custom900: "auto" }}
          bg="orange.50"
          color="p.black"
          _hover={{ bg: "orange.150" }}
          _active={{
            transform: "translateY(1px)",
            boxShadow: "lg",
            bg: "orange.150",
          }}
        >
          {t("business.all_btn", "Начать продавать")}
        </Button>
      </Box>
    </Box>
  );
};

export default Advances;
