import { useTranslation } from "react-i18next";
import TopNav from "../../components/Navigations/TopNav"
import { Box, Container, useBreakpointValue } from "@chakra-ui/react";
import BottomNav from "../../components/Navigations/BottomNav";
import FilterBlock from "../../components/FilterBlock/FilterBlock";
import ImageCarousel from "../../components/HomePage/ImageCarousel";
import HotOfferSection from "../../components/HomePage/HotOfferSection";
import MobileHotOfferSection from "../../components/HomePage/MobileHotOfferSection";
import ScrollToTopButton from "../../components/ScrollTop/ScrollToTopButton";
import ZakazScrollBlock from "../../components/HomePage/ZakazScrollBlock";
import MainCategories from "../../components/Categories/MainCategories";
import NewsSection from "../../components/NewsCards/NewsSection";
import ContactSection from "../../components/ContactSection/ContactSection";
import Footer from "../../components/Footer/Footer";
import ServiceCategoriesGrid from "../../components/Navigations/ServiceCategoriesGrid";

const HomeLayout = () => {
  const { t } = useTranslation();
  const isMobile = useBreakpointValue({ base: true, custom900: false });
  
  return (
    <>
      <Container maxW="75rem" display={'flex'} flexDir={'column'} minH={'100%'} overflow={'hidden'}>
        <TopNav title={t('avatar.brand')} subTitle={t('avatar.brand_subtitle')} />
        <FilterBlock />
        {isMobile && (
          <Box mt={isMobile ? "110px" : "0" }>
            <ImageCarousel />
            <ServiceCategoriesGrid/>
          </Box>
        )}
        <HotOfferSection />
        <ZakazScrollBlock />
        
        <Box display={isMobile ? 'none' : 'block'}>
          <ImageCarousel />
          <MainCategories />
          <NewsSection />
        </Box>
        <Box display={{ base: "block", custom900: "none" }}>
          <MobileHotOfferSection title = { t("mobile_hot_offers.title") } />
        </Box>
        
        <ScrollToTopButton />
        <BottomNav />
      </Container>
      <Box display={isMobile ? 'none' : 'block'}>
        <ContactSection />
        <Footer />
      </Box>

    </>
  )
}

export default HomeLayout