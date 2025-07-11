import { Box, Text, VStack, HStack, Link, Image, Icon, Heading, Spacer } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FaYoutube, FaTelegram } from "react-icons/fa"
import { RiInstagramFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const title = t('avatar.brand');
  const subTitle = t('avatar.brand_subtitle');
  return (
    <Box maxW={'75rem'} m={'auto'} h={'100%'} display={'flex'}  bg="black.0" w={'100%'} py={14} minH={'300px'}>
      <HStack gap={20} ml={{base: 10, custom1200: 2}} mr={{base: 10, custom1200: 2}} justify="space-between" align={'flex-start'} flexWrap="nowrap">
        <VStack align="flex-start" spacing={3} maxW="200px">
          <Heading fontWeight="medium" fontSize="28px">
              <HStack as={'a'} href='/' cursor={'pointer'}>
                <Image src="/Images/logo.png" alt="sa" boxSize="50px" borderRadius={'md'}/>
                <VStack alignItems="flex-start" spacing={0}>
                  <Text fontSize="17px" fontWeight={'700'} lineHeight={'17px'}>
                    {title}
                  </Text>
                  <Text fontSize="10px" fontWeight={'400'} lineHeight={'10px'}>
                    {subTitle}
                  </Text>
                </VStack>  
              </HStack>
          </Heading>
          <Text fontSize={'12px'}>{t('footer.available_mobileApp')}</Text>

          <HStack justifyContent="space-between">
            <Box display={'flex'} alignItems={'center'} w={'100px'}>
              <Image onClick={() => navigate("/")} _hover={{cursor: 'pointer'}} src="/google-play.png" alt="Google Play" />
              <Image onClick={() => navigate("/")} _hover={{cursor: 'pointer'}} src="/app-store.png" alt="App Store" />
            </Box>
          </HStack>
        </VStack>
        <Spacer />
        <VStack align="flex-start" spacing={2}>
          <Text fontWeight="bold">{t('footer.pages')}</Text>
          <Link fontSize={'14px'} href="/">{t('footer.home')}</Link>
          <Link fontSize={'14px'} href="/ads?category_id=0">{t('footer.ad')}</Link>
          <Link fontSize={'14px'} href="/companies">{t('footer.companies')}</Link>
          <Link fontSize={'14px'} href="#">{t('footer.support')}</Link>
        </VStack>

        <VStack align="flex-start" spacing={2}>
          <Text fontWeight="bold">{t('footer.services')}</Text>
          <Link fontSize={'14px'} href="/ads?category_id=0">{t('footer.ads')}</Link>
          <Link fontSize={'14px'} href="/ads?category_id=2">{t('footer.rent')}</Link>
          <Link fontSize={'14px'} href="/applications">{t('footer.orders')}</Link>
        </VStack>

        <VStack align="flex-start" spacing={2}>
          <Text fontWeight="bold">{t('footer.document')}</Text>
          <Link fontSize={'14px'} href="#">{t('footer.terms_of_use')}</Link>
          <Link fontSize={'14px'} href="/ads?category_id=2">{t('footer.rent')}</Link>
          <Link fontSize={'14px'} href="/applications">{t('footer.orders')}</Link>
        </VStack>

        <VStack align="flex-start" spacing={2}>
          <Text fontWeight="bold">{t('footer.contacs')}</Text>
          <Text>+998 (94) 714-4403</Text>
          <Text>{t("contact_form.adress")}</Text>
          <HStack fontSize={'25px'} mt={2} spacing={3}>
            <Icon _hover={{cursor: 'pointer'}} as={FaYoutube} onClick={() => navigate("/")} />
            <Icon _hover={{cursor: 'pointer'}} as={FaTelegram} onClick={() => navigate("/")} />
            <Icon _hover={{cursor: 'pointer'}} as={RiInstagramFill} onClick={() => navigate("/")} />
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
};

export default Footer;
