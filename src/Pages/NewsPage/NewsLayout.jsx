import { useTranslation } from "react-i18next";
import TopNav from "../../components/Navigations/TopNav"
import { Box, Container, useBreakpointValue } from "@chakra-ui/react";
import BottomNav from "../../components/Navigations/BottomNav";
import ScrollToTopButton from "../../components/ScrollTop/ScrollToTopButton";
import Footer from "../../components/Footer/Footer";
import NewsCards from "../../components/News/NewsCards";


const NewsLayout = () => {
  const { t } = useTranslation();
  const isMobile = useBreakpointValue({ base: true, custom900: false });

  return (
      <>
        <Container maxW="75rem" display={'flex'} flexDir={'column'} overflow={'hidden'}>
            <Box display={isMobile ? 'none' : 'block'}>
                <TopNav title={t('avatar.brand')} subTitle={t('avatar.brand_subtitle')} />
            </Box>
            <NewsCards/>
            <ScrollToTopButton />
            <BottomNav />
            <Box display={isMobile ? 'none' : 'block'}>
              <Footer />
            </Box>  
        </Container>

      </>
    )
  }
export default NewsLayout;
    


