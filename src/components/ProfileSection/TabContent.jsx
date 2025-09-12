import { 
  Box, 
  Card, 
  CardBody, 
  VStack, 
  Skeleton, 
  SkeletonCircle, 
  Text,
  Button
} from "@chakra-ui/react";

import { useEffect, useMemo, useState } from "react";
import { 
  FiCreditCard, 
  FiHelpCircle, 
  FiHeart, 
  FiShoppingCart,
  FiInfo,
  FiEdit
} from "react-icons/fi";

import { ProfileForm } from "./ProfileForm";
import MessagesMobile from "../MessagesSection/MessagesMobile";

import HeaderForTabs from "./HeaderForTabs";
import BalanceTopup from "./BalanceTopup";
import MyOrder from "./MyOrder";
import FavoritesPage from "./FavoritesPage";
import SupportForm from "./SupportForm";
import Oservices from "./Oservices";

import { useAuth } from "../../Pages/Auth/logic/AuthContext";
import { useTranslation } from "react-i18next";
import Dashboard from "../Company/Dashboard";
import CompanyProfileForm from "../Company/Settings_profile/CompanyProfileForm";
import LeadsManagement from "../Company/leeds/LeedsManagement";
import ContactForm from "../Company/CompanyContact/ContactForm";
import DocumentManager from "../Company/Document_Section/DocumentManager";
import NewsManagement from "../Company/News_Section/NewsManagement";
import InvoiceManagement from "../Company/Invoice_Section/InvoiceManagement";
import MyApplication from "../Company/MyOrders_Section/MyApplication";

export const TabContent = ({ activeTab }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { getUserProfile } = useAuth();
  const userData = useMemo(() => getUserProfile() || {}, [getUserProfile]);

  // Loading simulation
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [activeTab]);


  if (isLoading && activeTab === "profile") {
    return (
      <Card boxShadow="2xl" borderRadius="2xl">
        <CardBody p={{base: 5, custom570: 8}}>
          <VStack spacing={4}>
            <SkeletonCircle size="20" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
          </VStack>
        </CardBody>
      </Card>
    );
  }

  const renderContent = () => {
    const companyTabs = ["company", "company-settings", "leads", "my-application", "my-products", "contacts", "documents", "company-news", "company-accounts"];
    // if (companyTabs.includes(activeTab) && userData?.isCompany !== true) {
    if (companyTabs.includes(activeTab) && localStorage.getItem("isCompany") !== "true") {
      return (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDir={'column'} gap={6}>
          <Text mt={"120px"} pointerEvents={'none'} fontSize={'20px'} textAlign="center" color="red.500">
            {t("TabContent.accessDeniedPartner", "У вас нет доступа к этой странице! Чтобы получить доступ, сначала станьте компанией.")}
          </Text>
          <Button
            as={'a'}
            w={'250px'}
            href="/business"
            size={{ base: 'sm', custom1200: 'md' }}
            bg="orange.100"
            borderRadius="xl"
            border="1px solid"
            borderColor="#fed500"
            _hover={{ bg: "orange.50" }}
            transition="all 0.2s ease"
            fontWeight="600"
          >
            {t("ProfileHeader.becomePartner", "Стать компанией")}
          </Button>
        </Box>
      );
    }

    switch (activeTab) {
      case 'profile':
        return <ProfileForm />;
        
      case 'messages':
        return <MessagesMobile />

      case 'balance':
        return (
          <Box>
            <HeaderForTabs title={t('TabContent.wallet.title', "Мой кошелек")} subtitle={t("TabContent.wallet.subtitle", 'Следите и управляйте своими средствами')} MainIcon={FiCreditCard}/>
            <BalanceTopup />
          </Box>
        );
        
      case 'orders':
        return (
          <Box>
            <HeaderForTabs title={t('TabContent.orders.title', "Мои заказы")} subtitle={t('TabContent.orders.subtitle', 'Управляйте своими заказами')} MainIcon={FiShoppingCart}/>
            <MyOrder/>
         </Box>
        );
        
      case 'ads':
        return (
          <Box>
            <HeaderForTabs title={t('TabContent.listing.title', "Объявление")} subtitle={t('TabContent.listing.subtitle', 'Редактируйте, обновляйте или удаляйте свои объявления')} MainIcon={FiEdit}/>
            <MyOrder/>
          </Box>
        );
      case 'favorites':
        return (
          <Box>
            <HeaderForTabs title={t('TabContent.favorites.title', "Избранные")} subtitle={t('TabContent.favorites.subtitle', 'Здесь собраны объявления, которые вы отметили как избранные')} MainIcon={FiHeart}/>
            <FavoritesPage />
          </Box>
        );
        
      case 'support':
        return (
          <Box>
            <HeaderForTabs title={t("TabContent.support.title", 'Служба поддержки')} subtitle={t('TabContent.support.subtitle', 'Мы готовы помочь вам с любыми вопросами или проблемами')} MainIcon={FiHelpCircle}/>
            <SupportForm />
          </Box>
        );
        
      case 'about':
        return (
          <Box>
            <HeaderForTabs title={t("TabContent.about.title", 'О U-MTS')} subtitle={t('TabContent.about.subtitle', 'Узнайте больше о нашей платформе и наших целях')} MainIcon={FiInfo}/>
            <Oservices />
          </Box>
        );
        
      // Company Section
      case 'company':
        return <Dashboard />
      case 'company-settings':
        return <CompanyProfileForm />
      case 'leads':
        return <LeadsManagement />
      case 'my-application':
        return <MyApplication />
      case 'my-products':
        return <MyApplication />

      case 'company-accounts':
        return <InvoiceManagement />

      case 'company-news':
        return <NewsManagement />
      case 'contacts':
        return <ContactForm />
      case 'documents':
        return <DocumentManager />
      default:
        return <ProfileForm />;
    }
  };

  return <Box>{renderContent()}</Box>;
};