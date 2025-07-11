import { useTranslation } from "react-i18next";
import TopNav from "../../components/Navigations/TopNav"
import { Box, Container, useBreakpointValue } from "@chakra-ui/react";
import BottomNav from "../../components/Navigations/BottomNav";
import ScrollToTopButton from "../../components/ScrollTop/ScrollToTopButton";
import ContactSection from "../../components/ContactSection/ContactSection";
import Footer from "../../components/Footer/Footer";
import HeroSection from "../../components/Business_component/HeroSection";
import Statistics_business from "../../components/Business_component/Statistics_business";
import Advances from "../../components/Business_component/Advances";
import HowToStartSelling from "../../components/Business_component/HowToStartSelling";
import SideTranslator from "../../components/SideTranslator";

const BusinessLayout = () => {
  const { t } = useTranslation();
  const isMobile = useBreakpointValue({ base: true, custom900: false });

  return (
      <>
        <Container maxW="75rem" display={'flex'} flexDir={'column'} minH={'100%'} overflow={'hidden'}>
          <Box display={isMobile ? 'none' : 'block'}>
            <TopNav title={t('avatar.brand')} subTitle={t('avatar.brand_subtitle')} />
          </Box>
          <HeroSection />
          <SideTranslator />
          <ScrollToTopButton />
          <BottomNav />
        </Container>
        <Box>
          <Statistics_business />
        </Box>
        <Advances />
        <HowToStartSelling />
        <Box mb={12}>
          <ContactSection />
        </Box>

        <Box display={isMobile ? 'none' : 'block'}>
          <Footer />
        </Box>
  
      </>
    )
  }
    

export default BusinessLayout