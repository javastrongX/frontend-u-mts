import { Box, Heading, SimpleGrid, Flex, Link } from "@chakra-ui/react";
import NewsCard from "./NewsCard";
import { useTranslation } from "react-i18next";

const newsData = [
  {
    image: "https://dev.gservice-co.kz/storage/images/23-05-2025/01JVYNRB50J206NVZFP72796A4.webp",
    title: "ДЭТ-400 БУЛЬДОЗЕРЛЕРІ",
    subtitle: "Алғаш рет Қазақстанға жеткізілді",
    description: "ДЭТ-400 бульдозерлері алғаш рет Қазақстанға жеткізілді",
    slug: "/news/12"
  },
  {
    image: "https://dev.gservice-co.kz/storage/images/23-05-2025/01JVYMRP11S4PA3ZS0XXY3K8S3.webp",
    title: "HITACHI ЕН1100-5",
    subtitle: "Қазақстанда жұмыс істей бастады",
    description:
      "Hitachi EH1100-5 Жаңартылған самосвалдары Қазақстанда жұмыс істей бастады",
      slug: "/news/11"
  },
  {
    image: "https://dev.gservice-co.kz/storage/images/22-05-2025/01JVW40DZNEKBXKVJFCB6ZRB85.webp",
    title: "DAF XF 450",
    subtitle: "ЕҢ ҮНЕМДІ ЖҮК КӨЛІГІ АТАНДЫ",
    description: "DAF XF 450 Ең үнемді жүк көлігі атанды!",
    slug: "/news/11"
  },
  {
    image: "https://dev.gservice-co.kz/storage/images/22-05-2025/01JVW45VTVM9M0YP44F5AN567K.webp",
    title: "HYUNDAI КОМПАНИЯСЫ",
    subtitle: "Hyundai мини-техника желісін кеңейтуде!",
    description: "Hyundai мини-техника желісін кеңейтуде!",
    slug: "/news/12"
  },
];

const NewsSection = () => {
  const { t } = useTranslation();

  return (
    <Box py={10}>
      <Flex justify="space-between" align="center" mb={6} px={2}>
        <Heading as="h2" fontSize={'22px'}>{t("categories.news")}</Heading>
        <Link href="/news" _hover={{textDecor: 'none'}} color="blue.400" fontSize="sm">
          {t("categories.watch_all_news")} →
        </Link>
      </Flex>
      <SimpleGrid columns={[1, 2, 3, 4]} spacing={5} px={2}>
        {newsData.map((news, index) => (
          <NewsCard key={index} {...news} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default NewsSection;
