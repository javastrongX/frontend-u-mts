import { Box, Heading, HStack, useBreakpointValue } from "@chakra-ui/react"
import MobileHotOfferSection from "../HomePage/MobileHotOfferSection"
import { RightSidebar } from "../RightSidebar";
import { useTranslation } from "react-i18next";

const ActiveTabsPage = ({ activeTab, totalProducts, setTotalProducts, refreshKey }) => {
  const isMobile = useBreakpointValue({ base: true, custom900: false });
  const { t } = useTranslation();
  const data_title = {
    heading: {
    0: t("activetabspage.total_announcement_in_uzb", "Все объявления в Узбекистане"),
    1: t("activetabspage.sale_of_special_equipment_in_uzb", "Продажа спецтехники в Узбекистане"),
    2: t("activetabspage.rent_of_special_equipment_in_uzb", "Аренда спецтехники в Узбекистане"),
    3: t("activetabspage.spare_parts_for_special_equipment_in_uzb", "Запчасти в Узбекистане"),
    4: t("activetabspage.repair_of_special_equipment_in_uzb", "Ремонт в Узбекистане"),
    5: t("activetabspage.drivers_for_special_equipment_in_uzb", "Водители в Узбекистане")
  }
}

  return (
    <HStack maxW={'100%'} mt={{base: 2, custom900: 8}} align={'start'} spacing={4}>
        <Box flex={1}>
            <Heading fontSize={'24px'} >{data_title.heading[activeTab]}</Heading>
            <MobileHotOfferSection 
              title={t("activetabspage.announcement", "объявление")}
              accept={!isMobile}
              shuffleProducts={true}
              categoryid={activeTab}
              totalProducts={totalProducts}
              setTotalProducts={setTotalProducts}
              refreshKey={refreshKey}
            />
        </Box>
        {!isMobile && (
          <Box mt={7}>
            <RightSidebar vehicle={false}/>
          </Box>
        )}
    </HStack>
  )
}

export default ActiveTabsPage