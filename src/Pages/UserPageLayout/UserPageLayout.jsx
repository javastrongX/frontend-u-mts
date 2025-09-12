import { useTranslation } from "react-i18next";
import TopNav from "../../components/Navigations/TopNav"
import { Box, Container, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import BottomNav from "../../components/Navigations/BottomNav";
import ScrollToTopButton from "../../components/ScrollTop/ScrollToTopButton";
import Footer from "../../components/Footer/Footer";
import UserProfilePage from "../../components/UserPage/UserProfilePage";
import Header from "./Header";
import { FaUser } from "react-icons/fa";
import SideTranslator from "../SideTranslator";

const UserPageLayout = () => {
  const { t } = useTranslation();
  const isMobile = useBreakpointValue({ base: true, custom900: false });
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
      <>
        <Container bg={{base: bgColor, custom900: "black.0"}} maxW="75rem" display={'flex'} flexDir={'column'} overflow={'hidden'} px={3}>
            <Box display={isMobile ? 'none' : 'block'}>
                <TopNav title={t('avatar.brand')} subTitle={t('avatar.brand_subtitle')} />
            </Box>
            <SideTranslator />
            <Header title={t('UserPageLayout.userProfile', "Профиль пользователя")} subtitle="" MainIcon={FaUser} />
            <UserProfilePage />
            <ScrollToTopButton />
            <BottomNav />
            <Box display={isMobile ? 'none' : 'block'}>
              <Footer />
            </Box>  
        </Container>

      </>
    )
  }
export default UserPageLayout;
    

