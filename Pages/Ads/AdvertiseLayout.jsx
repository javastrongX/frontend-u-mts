import { useTranslation } from "react-i18next";
import TopNav from "../../components/Navigations/TopNav"
import { Box, Container, useBreakpointValue } from "@chakra-ui/react";
import BottomNav from "../../components/Navigations/BottomNav";
import ScrollToTopButton from "../../components/ScrollTop/ScrollToTopButton";
import Footer from "../../components/Footer/Footer";
import AdsFilterBlock from "../../components/Ads_component/AdsFilterBlock";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AdvertiseLayout = () => {
  const { t } = useTranslation();
  const isMobile = useBreakpointValue({ base: true, custom900: false });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/ads' && !location.search) {
      navigate('/ads?category_id=0', { replace: true });
    }
  }, [location, navigate]);


  return (
      <>
        <Container maxW="75rem" display={'flex'} flexDir={'column'} minH={'100vh'} overflow={'hidden'}>
            <Box display={isMobile ? 'none' : 'block'}>
                <TopNav title={t('avatar.brand')} subTitle={t('avatar.brand_subtitle')} />
            </Box>
            <AdsFilterBlock />
            <ScrollToTopButton />
            <BottomNav />
            <Box display={isMobile ? 'none' : 'block'}>
            <Footer />
            </Box>  
        </Container>

  
      </>
    )
  }
export default AdvertiseLayout
    


