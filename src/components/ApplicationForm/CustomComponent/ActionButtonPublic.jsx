import { Box, Button, Flex, HStack, ScaleFade, Spinner, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { FiArrowLeft, FiCheckCircle, FiShield, FiStar, FiTrendingUp, FiUsers } from 'react-icons/fi'
import { BadgeInfo } from './FormControlWrapper'
import { useTranslation } from 'react-i18next'

const ActionButtonPublic = ({actionButtonDirection, actionButtonSpacing, handleBack, buttonSize, isSubmitting, handleSubmit, isFormValid}) => {
  const { t } = useTranslation();
  return (
    <ScaleFade in={true} delay={0.7}>
        <Box
        p={{ base: 4, md: 6 }}
        bg="gray.50"
        borderRadius={{ base: "xl", md: "2xl" }}
        border="1px solid"
        borderColor="gray.200"
        >
        <Flex
            direction={actionButtonDirection}
            justify="space-between"
            align="center"
            gap={actionButtonSpacing}
        >
            <Button
            variant="ghost"
            leftIcon={<FiArrowLeft />}
            onClick={handleBack}
            color="gray.600"
            size={buttonSize}
            borderRadius={{ base: "lg", md: "xl" }}
            fontSize={{ base: "sm", md: "md" }}
            width={{ base: "full", md: "auto" }}
            order={{ base: 2, md: 1 }}
            _hover={{ bg: "gray.100", transform: "translateX(-2px)" }}
            transition="all 0.2s"
            >
            {t("ApplicationForm.form.actions.cancel", "Отменить")}
            </Button>

            <VStack
            align={{ base: "stretch", md: "end" }}
            spacing={2}
            width={{ base: "full", md: "auto" }}
            order={{ base: 1, md: 2 }}
            >
            <HStack
                spacing={2}
                justify={{ base: "center", md: "flex-end" }}
                display={{ base: "none", sm: "flex" }}
            >
                <FiShield color="#38A169" />
                <Text fontSize="xs" color="gray.500">
                100% {t("ApplicationForm.form.badges.safe", "Безопасно")}
                </Text>
            </HStack>
            <Button
                colorScheme="blue"
                bgGradient="linear(to-r, blue.400, purple.500)"
                color="white"
                size={buttonSize}
                px={{ base: 6, md: 12 }}
                width={{ base: "full", md: "auto" }}
                rightIcon={
                isSubmitting ? <Spinner size="sm" /> : <FiCheckCircle />
                }
                onClick={handleSubmit}
                borderRadius={{ base: "lg", md: "xl" }}
                fontSize={{ base: "sm", md: "md" }}
                _hover={{
                bgGradient: "linear(to-r, blue.700, purple.600)",
                transform: "translateY(-2px)",
                boxShadow: "xl",
                }}
                _active={{ transform: "translateY(0)" }}
                transition="all 0.3s"
                isLoading={isSubmitting}
                loadingText={t("ApplicationForm.form.actions.sending", "Отправляется...")}
                // isDisabled={isSubmitting || !isFormValid}
                opacity={!isFormValid ? 0.6 : 1}
            >
                {isSubmitting
                ? t("ApplicationForm.form.actions.sending", "Отправляется...")
                : t("ApplicationForm.form.actions.submit", "Опубликовать")}
            </Button>
            </VStack>
        </Flex>

        {/* Desktop Features */}
        <Box
            mt={4}
            pt={4}
            borderTop="1px solid"
            borderColor="gray.200"
            display={{ base: "none", md: "block" }}
        >
            <HStack justify="center" spacing={{ base: 3, md: 6 }}>
            <BadgeInfo 
                icon={FiTrendingUp}
                text={t("ApplicationForm.form.badges.fast_reply", "Быстрый ответ")}
            />
            <BadgeInfo 
                icon={FiUsers}
                text={t("ApplicationForm.form.badges.verified_experts", "Множество профильных специалистов")}
            />
            <BadgeInfo 
                icon={FiStar}
                text={t("ApplicationForm.form.badges.high_quality", "Высокое качество")}
            />
            </HStack>
        </Box>

        {/* Mobile Features */}
        <VStack
            mt={4}
            pt={4}
            borderTop="1px solid"
            borderColor="gray.200"
            spacing={2}
            display={{ base: "flex", md: "none" }}
        >
            <BadgeInfo 
            icon={FiShield}
            text={`100% ${t("ApplicationForm.form.badges.safe", "Безопасно")}`}
            iconColor="#38A169"
            iconSize={14}
            />
            <HStack spacing={4}>
            <BadgeInfo 
                icon={FiTrendingUp}
                text={t("ApplicationForm.form.badges.fast_reply", "Быстрый ответ")}
                iconSize={12}
            />
            <BadgeInfo 
                icon={FiUsers}
                text={t("ApplicationForm.form.badges.experts", "Специалисты")}
                iconSize={12}
            />
            <BadgeInfo 
                icon={FiStar}
                text={t("ApplicationForm.form.badges.quality", "Качество")}
                iconSize={12}
            />
            </HStack>
        </VStack>
        </Box>
    </ScaleFade>
  )
}

export default ActionButtonPublic