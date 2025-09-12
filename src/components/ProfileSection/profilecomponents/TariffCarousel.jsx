import React, { useState, useRef } from "react";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  Heading,
  Text,
  Button,
  Badge,
  VStack,
  HStack,
  useColorModeValue,
  Flex,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  FaBolt,
  FaCrown,
  FaCheckCircle,
  FaRocket,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import { keyframes } from "@emotion/react";
import { useTranslation } from "react-i18next";

// Animations
const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px rgba(79, 172, 254, 0.3); }
  50% { box-shadow: 0 0 20px rgba(79, 172, 254, 0.6), 0 0 30px rgba(79, 172, 254, 0.4); }
  100% { box-shadow: 0 0 5px rgba(79, 172, 254, 0.3); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const TariffCarousel = ({ tariffs, selectedTariff, setSelectedTariff, handleRankUpdater }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);
  const { t } = useTranslation();
  // Color mode values
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headingColor = useColorModeValue("gray.700", "white");
  const textColor = useColorModeValue("gray.500", "gray.400");

  // Responsive values
  const isMobile = useBreakpointValue({ base: true, lg: false });

  const nextSlide = () => {
    const newSlide = (currentSlide + 1) % tariffs.length;
    setCurrentSlide(newSlide);
    scrollToSlide(newSlide);
  };

  const prevSlide = () => {
    const newSlide = currentSlide === 0 ? tariffs.length - 1 : currentSlide - 1;
    setCurrentSlide(newSlide);
    scrollToSlide(newSlide);
  };

  const scrollToSlide = (slideIndex) => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: slideIndex * slideWidth,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = (e) => {
    if (!isMobile) return;

    const container = e.target;
    const slideWidth = container.offsetWidth;
    const newSlide = Math.round(container.scrollLeft / slideWidth);

    if (newSlide !== currentSlide) {
      setCurrentSlide(newSlide);
    }
  };

  if (isMobile) {
    return (
      <Box position="relative" w="full">
        {/* Mobile Carousel */}
        <Box
          ref={carouselRef}
          display="flex"
          overflowX="auto"
          scrollSnapType="x mandatory"
          gap={4}
          pb={4}
          px={4}
          css={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
          onScroll={handleScroll}
        >
          {tariffs.map((tariff) => (
            <Box
              mt={5}
              key={tariff.id}
              minW="90%"
              maxW="100%"
              scrollSnapAlign="center"
              scrollSnapStop="always"
            >
              <Card
                bg={cardBg}
                borderColor={
                  selectedTariff === tariff.id
                    ? tariff.borderColor
                    : borderColor
                }
                borderWidth={selectedTariff === tariff.id ? "3px" : "1px"}
                position="relative"
                cursor="pointer"
                onClick={() => {
                  setSelectedTariff(tariff.id);
                  handleRankUpdater();
                }}
                borderRadius="2xl"
                transition="all 0.4s ease"
                transform={
                  selectedTariff === tariff.id ? "scale(1.02)" : "scale(1)"
                }
                boxShadow={
                  selectedTariff === tariff.id
                    ? `0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px ${tariff.borderColor}`
                    : "0 10px 40px rgba(0,0,0,0.05)"
                }
                h="full"
                animation={
                  selectedTariff === tariff.id
                    ? `${glowAnimation} 3s ease-in-out infinite`
                    : "none"
                }
              >
                {/* Gradient overlay for selected card */}
                {selectedTariff === tariff.id && (
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    height="6px"
                    bgGradient={tariff.bgGradient}
                    backgroundSize="200% 200%"
                    borderTopLeftRadius="2xl"
                    borderTopRightRadius="2xl"
                    animation={`${gradientShift} 3s ease infinite`}
                  />
                )}

                {tariff.isPopular && (
                  <Badge
                    bgGradient="linear(135deg, yellow.400, orange.300)"
                    color="white"
                    position="absolute"
                    top="-12px"
                    left="50%"
                    transform="translateX(-50%)"
                    px={4}
                    py={2}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="bold"
                    boxShadow="0 4px 15px rgba(255, 193, 7, 0.4)"
                    animation={`${pulseAnimation} 2s infinite`}
                  >
                    <HStack spacing={1}>
                      <FaCrown size="10" />
                      <Text>{t("TariffCarousel.popular", "Популярный")}</Text>
                    </HStack>
                  </Badge>
                )}

                <CardHeader
                  textAlign="center"
                  pb={3}
                  pt={tariff.isPopular ? 8 : 6}
                >
                  <VStack spacing={3}>
                    <Box
                      p={3}
                      borderRadius="xl"
                      bgGradient={tariff.bgGradient}
                      animation={
                        selectedTariff === tariff.id
                          ? `${pulseAnimation} 2s infinite`
                          : "none"
                      }
                    >
                      <FaBolt color="white" size="24" />
                    </Box>
                    <Heading
                      size="lg"
                      bgGradient={tariff.bgGradient}
                      bgClip="text"
                      fontWeight="bold"
                    >
                      {tariff.name}
                    </Heading>
                    <Badge
                      colorScheme={tariff.accentColor}
                      borderRadius="full"
                      px={3}
                      py={1}
                    >
                      {tariff.duration}
                    </Badge>
                  </VStack>
                </CardHeader>

                <CardBody pt={0} px={6}>
                  <VStack h={"100%"} justify={'space-between'} spacing={6} align="stretch">
                    <VStack spacing={4} align="stretch">
                      {tariff.features.map((feature, index) => (
                        <HStack key={index} spacing={4}>
                          <Box
                            p={2}
                            borderRadius="lg"
                            bg={`${tariff.accentColor}.50`}
                            border="1px solid"
                            borderColor={`${tariff.accentColor}.200`}
                          >
                            <feature.icon color={feature.color} size="16" />
                          </Box>
                          <Text
                            fontSize="sm"
                            color={headingColor}
                            fontWeight="medium"
                          >
                            {feature.text}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>

                    <Box
                      p={4}
                      borderRadius="xl"
                      bgGradient={`linear(135deg, ${tariff.accentColor}.50, ${tariff.accentColor}.100)`}
                      border="1px solid"
                      borderColor={`${tariff.accentColor}.200`}
                    >
                      <VStack spacing={3}>
                        <VStack spacing={1}>
                          <HStack align="baseline" justify="center">
                            <Text
                              fontSize="3xl"
                              fontWeight="bold"
                              bgGradient={tariff.bgGradient}
                              bgClip="text"
                            >
                              {tariff.price.toLocaleString()}
                            </Text>
                            <Text
                              bgGradient={tariff.bgGradient}
                              bgClip="text"
                              fontWeight="bold"
                            >
                              {t("currency.uzs", "сум")}
                            </Text>
                          </HStack>
                          <Text
                            fontSize="sm"
                            textDecoration="line-through"
                            color={textColor}
                          >
                            {tariff.originalPrice.toLocaleString()} {t("currency.uzs", "сум")}
                          </Text>
                        </VStack>

                        <Button
                          variant={
                            selectedTariff === tariff.id ? "solid" : "outline"
                          }
                          bgGradient={
                            selectedTariff === tariff.id
                              ? tariff.bgGradient
                              : "none"
                          }
                          color={
                            selectedTariff === tariff.id
                              ? "white"
                              : headingColor
                          }
                          borderColor={
                            selectedTariff === tariff.id
                              ? "transparent"
                              : `${tariff.accentColor}.300`
                          }
                          w="full"
                          size="lg"
                          borderRadius="xl"
                          fontWeight="bold"
                          h="50px"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTariff(tariff.id);
                            handleRankUpdater();
                          }}
                          transition="all 0.3s ease"
                          _hover={{
                            transform: "translateY(-2px)",
                            boxShadow:
                              selectedTariff === tariff.id
                                ? "0 10px 30px rgba(0,0,0,0.2)"
                                : `0 8px 25px rgba(0,0,0,0.15)`,
                            bgGradient:
                              selectedTariff === tariff.id
                                ? tariff.bgGradient
                                : `linear(135deg, ${tariff.accentColor}.50, ${tariff.accentColor}.100)`,
                          }}
                          _active={{
                            transform: "translateY(0)",
                          }}
                          leftIcon={
                            selectedTariff === tariff.id ? (
                              <FaCheckCircle />
                            ) : (
                              <FaRocket />
                            )
                          }
                        >
                          {selectedTariff === tariff.id ? t("TariffCarousel.selected", "Выбрано") : t("TariffCarousel.select", "Выбрать")}
                        </Button>
                      </VStack>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Navigation Arrows */}
        <Flex
          justify="space-between"
          align="center"
          position="absolute"
          top="55%"
          left={0}
          right={0}
          // px={2}
          transform="translateY(-50%)"
          pointerEvents="none"
        >
          <IconButton
            icon={<FaChevronLeft />}
            onClick={prevSlide}
            borderRadius="full"
            bg="white"
            boxShadow="0 4px 15px rgba(0,0,0,0.1)"
            color="gray.600"
            size="lg"
            pointerEvents="auto"
            _hover={{ bg: "gray.50", transform: "scale(1.1)" }}
            _active={{ transform: "scale(0.95)" }}
          />
          <IconButton
            icon={<FaChevronRight />}
            onClick={nextSlide}
            borderRadius="full"
            bg="white"
            boxShadow="0 4px 15px rgba(0,0,0,0.1)"
            color="gray.600"
            size="lg"
            pointerEvents="auto"
            _hover={{ bg: "gray.50", transform: "scale(1.1)" }}
            _active={{ transform: "scale(0.95)" }}
          />
        </Flex>

        {/* Dots Indicator */}
        <Flex justify="center" mt={6} gap={2}>
          {tariffs.map((_, index) => (
            <Box
              key={index}
              w={3}
              h={3}
              borderRadius="full"
              bg={index === currentSlide ? "blue.500" : "gray.300"}
              cursor="pointer"
              onClick={() => {
                setCurrentSlide(index);
                scrollToSlide(index);
              }}
              transition="all 0.3s ease"
              _hover={{ transform: "scale(1.2)" }}
            />
          ))}
        </Flex>
      </Box>
    );
  }

  // Desktop Grid (original code)
  return (
    <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap={8}>
      {tariffs.map((tariff) => (
        <GridItem key={tariff.id}>
          <Card
            bg={cardBg}
            borderColor={
              selectedTariff === tariff.id ? tariff.borderColor : borderColor
            }
            borderWidth={selectedTariff === tariff.id ? "3px" : "1px"}
            position="relative"
            cursor="pointer"
            onClick={() => {
              setSelectedTariff(tariff.id); 
              handleRankUpdater();
            }}
            borderRadius="2xl"
            transition="all 0.4s ease"
            transform={
              selectedTariff === tariff.id ? "scale(1.02)" : "scale(1)"
            }
            boxShadow={
              selectedTariff === tariff.id
                ? `0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px ${tariff.borderColor}`
                : "0 10px 40px rgba(0,0,0,0.05)"
            }
            _hover={{
              transform:
                selectedTariff === tariff.id ? "scale(1.02)" : "scale(1.05)",
              boxShadow:
                selectedTariff === tariff.id
                  ? `0 25px 80px rgba(0,0,0,0.2), 0 0 0 1px ${tariff.borderColor}`
                  : "0 15px 50px rgba(0,0,0,0.1)",
            }}
            h="full"
            animation={
              selectedTariff === tariff.id
                ? `${glowAnimation} 3s ease-in-out infinite`
                : "none"
            }
          >
            {/* Gradient overlay for selected card */}
            {selectedTariff === tariff.id && (
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                height="6px"
                bgGradient={tariff.bgGradient}
                backgroundSize="200% 200%"
                borderTopLeftRadius="2xl"
                borderTopRightRadius="2xl"
                animation={`${gradientShift} 3s ease infinite`}
              />
            )}

            {tariff.isPopular && (
              <Badge
                bgGradient="linear(135deg, yellow.400, orange.300)"
                color="white"
                position="absolute"
                top="-12px"
                left="50%"
                transform="translateX(-50%)"
                px={4}
                py={2}
                borderRadius="full"
                fontSize="xs"
                fontWeight="bold"
                boxShadow="0 4px 15px rgba(255, 193, 7, 0.4)"
                animation={`${pulseAnimation} 2s infinite`}
              >
                <HStack spacing={1}>
                  <FaCrown size="10" />
                  <Text>{t("TariffCarousel.popular", "Популярный")}</Text>
                </HStack>
              </Badge>
            )}

            <CardHeader textAlign="center" pb={3} pt={tariff.isPopular ? 8 : 6}>
              <VStack spacing={3}>
                <Box
                  p={3}
                  borderRadius="xl"
                  bgGradient={tariff.bgGradient}
                  animation={
                    selectedTariff === tariff.id
                      ? `${pulseAnimation} 2s infinite`
                      : "none"
                  }
                >
                  <FaBolt color="white" size="24" />
                </Box>
                <Heading
                  size="lg"
                  bgGradient={tariff.bgGradient}
                  bgClip="text"
                  fontWeight="bold"
                >
                  {tariff.name}
                </Heading>
                <Badge
                  colorScheme={tariff.accentColor}
                  borderRadius="full"
                  px={3}
                  py={1}
                >
                  {tariff.duration}
                </Badge>
              </VStack>
            </CardHeader>

            <CardBody pt={0} px={6}>
              <VStack h={'100%'} justify={'space-between'} spacing={6} align="stretch">
                <VStack spacing={4} align="stretch">
                  {tariff.features.map((feature, index) => (
                    <HStack key={index} spacing={4}>
                      <Box
                        p={2}
                        borderRadius="lg"
                        bg={`${tariff.accentColor}.50`}
                        border="1px solid"
                        borderColor={`${tariff.accentColor}.200`}
                      >
                        <feature.icon color={feature.color} size="16" />
                      </Box>
                      <Text
                        fontSize="sm"
                        color={headingColor}
                        fontWeight="medium"
                      >
                        {feature.text}
                      </Text>
                    </HStack>
                  ))}
                </VStack>

                <Box
                  p={4}
                  borderRadius="xl"
                  bgGradient={`linear(135deg, ${tariff.accentColor}.50, ${tariff.accentColor}.100)`}
                  border="1px solid"
                  borderColor={`${tariff.accentColor}.200`}
                >
                  <VStack spacing={3}>
                    <VStack spacing={1}>
                      <HStack align="baseline" justify="center">
                        <Text
                          fontSize="3xl"
                          fontWeight="bold"
                          bgGradient={tariff.bgGradient}
                          bgClip="text"
                        >
                          {tariff.price.toLocaleString()}
                        </Text>
                        <Text
                          bgGradient={tariff.bgGradient}
                          bgClip="text"
                          fontWeight="bold"
                        >
                          {t("currency.uzs", "сум")}
                        </Text>
                      </HStack>
                      <Text
                        fontSize="sm"
                        textDecoration="line-through"
                        color={textColor}
                      >
                        {tariff.originalPrice.toLocaleString()} {t("currency.uzs", "сум")}
                      </Text>
                    </VStack>

                    <Button
                      variant={
                        selectedTariff === tariff.id ? "solid" : "outline"
                      }
                      bgGradient={
                        selectedTariff === tariff.id
                          ? tariff.bgGradient
                          : "none"
                      }
                      color={
                        selectedTariff === tariff.id ? "white" : headingColor
                      }
                      borderColor={
                        selectedTariff === tariff.id
                          ? "transparent"
                          : `${tariff.accentColor}.300`
                      }
                      w="full"
                      size="lg"
                      borderRadius="xl"
                      fontWeight="bold"
                      h="50px"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTariff(tariff.id);
                        handleRankUpdater();
                      }}
                      transition="all 0.3s ease"
                      _hover={{
                        transform: "translateY(-2px)",
                        boxShadow:
                          selectedTariff === tariff.id
                            ? "0 10px 30px rgba(0,0,0,0.2)"
                            : `0 8px 25px rgba(0,0,0,0.15)`,
                        bgGradient:
                          selectedTariff === tariff.id
                            ? tariff.bgGradient
                            : `linear(135deg, ${tariff.accentColor}.50, ${tariff.accentColor}.100)`,
                      }}
                      _active={{
                        transform: "translateY(0)",
                      }}
                      leftIcon={
                        selectedTariff === tariff.id ? (
                          <FaCheckCircle />
                        ) : (
                          <FaRocket />
                        )
                      }
                    >
                      {selectedTariff === tariff.id ? "Выбрано" : "Выбрать"}
                    </Button>
                  </VStack>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </GridItem>
      ))}
    </Grid>
  );
};

export default TariffCarousel;
