import { 
  Box, 
  HStack, 
  IconButton, 
  Image, 
  Modal, 
  ModalBody, 
  ModalCloseButton, 
  ModalContent, 
  ModalOverlay, 
  Text, 
  useDisclosure,
  useBreakpointValue,
  VStack,
  SimpleGrid
} from "@chakra-ui/react";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaExpand } from "react-icons/fa";

// Image Gallery Component - Fully Responsive
export const ImageGallery = ({ images, title }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Responsive values
  const galleryHeight = useBreakpointValue({ 
    base: "250px", 
    sm: "300px", 
    md: "400px", 
    lg: "500px" 
  });
  
  const thumbnailSize = useBreakpointValue({ 
    base: { width: "60px", height: "45px" },
    sm: { width: "70px", height: "52px" },
    md: { width: "80px", height: "60px" }
  });
  
  const navButtonSize = useBreakpointValue({ 
    base: 'md', 
    md: 'lg' 
  });
  
  const expandButtonSize = useBreakpointValue({ 
    base: 'sm', 
    md: 'md' 
  });
  
  const showThumbnails = useBreakpointValue({ 
    base: false, 
    sm: true 
  });

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  // Unique key generator function
  const generateUniqueKey = (image, index) => {
    return `image-${image.id || image.url || index}-${index}`;
  };

  if (!images || images.length === 0) {
    return (
      <Box 
        h={galleryHeight} 
        bg="gray.100" 
        borderRadius="xl" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        mb={6}
      >
        <VStack spacing={2}>
          <Text 
            color="gray.500" 
            fontSize={{ base: 'sm', md: 'md' }}
            textAlign="center"
          >
            Rasm mavjud emas
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <>
      <Box position="relative" mb={6}>
        {/* Main Image Container */}
        <Box 
          position="relative" 
          h={galleryHeight}
          bg="gray.100" 
          borderRadius="xl" 
          overflow="hidden"
          boxShadow="lg"
          transition="all 0.3s"
          _hover={{ 
            transform: { base: "none", md: "scale(1.02)" }
          }}
        >
          <Image
            src={images[currentImageIndex]?.url}
            alt={title}
            w="100%"
            h="100%"
            objectFit="cover"
            loading="lazy"
          />
          
          {/* Expand Button */}
          <IconButton
            icon={<FaExpand />}
            position="absolute"
            top={{ base: 2, md: 4 }}
            right={{ base: 2, md: 4 }}
            bg="blackAlpha.700"
            color="white"
            _hover={{ bg: "blackAlpha.900" }}
            onClick={onOpen}
            aria-label="Rasmni kattalashtirish"
            size={expandButtonSize}
            borderRadius="lg"
          />

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <IconButton
                icon={<FaChevronLeft />}
                position="absolute"
                left={0}
                top="50%"
                transform="translateY(-50%)"
                bg="rgba(0,0,0,0.2)"
                color="white"
                _hover={{ bg: "rgba(0,0,0,0.2)" }}
                onClick={handlePrevImage}
                aria-label="Oldingi rasm"
                size={navButtonSize}
                borderRadius="lg"
                display="flex"
                zIndex={2}
              />
              <IconButton
                icon={<FaChevronRight />}
                position="absolute"
                right={0}
                top="50%"
                transform="translateY(-50%)"
                bg="rgba(0,0,0,0.2)"
                color="white"
                _hover={{ bg: "rgba(0,0,0,0.2)" }}
                onClick={handleNextImage}
                aria-label="Keyingi rasm"
                size={navButtonSize}
                borderRadius="lg"
                display="flex"
                zIndex={2}
              />
            </>
          )}

          {/* Image Counter */}
          <Box
            position="absolute"
            bottom={{ base: 2, md: 4 }}
            left="50%"
            transform="translateX(-50%)"
            bg="blackAlpha.700"
            color="white"
            px={{ base: 2, md: 3 }}
            py={1}
            borderRadius="full"
            fontSize={{ base: 'xs', md: 'sm' }}
          >
            {currentImageIndex + 1} / {images.length}
          </Box>
        </Box>

        {/* Mobile Dots Indicator */}
        {!showThumbnails && images.length > 1 && (
          <HStack 
            justify="center" 
            mt={3}
            spacing={2}
          >
            {images.map((image, index) => (
              <Box
                key={`dot-${generateUniqueKey(image, index)}`}
                w="8px"
                h="8px"
                borderRadius="full"
                bg={index === currentImageIndex ? "blue.400" : "gray.300"}
                cursor="pointer"
                onClick={() => setCurrentImageIndex(index)}
                transition="all 0.2s"
                _hover={{ transform: "scale(1.2)" }}
              />
            ))}
          </HStack>
        )}

        {/* Desktop Thumbnail Images */}
        {showThumbnails && images.length > 1 && (
          <Box mt={4}>
            <HStack 
              spacing={2} 
              overflowX="auto" 
              pb={2}
              css={{
                '&::-webkit-scrollbar': {
                  height: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                  borderRadius: '10px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#888',
                  borderRadius: '10px',
                },
              }}
            >
              {images.map((image, index) => (
                <Box
                  mt={2}
                  ml={2}
                  key={`thumbnail-${generateUniqueKey(image, index)}`}
                  minW={thumbnailSize.width}
                  w={thumbnailSize.width}
                  h={thumbnailSize.height}
                  borderRadius="lg"
                  overflow="hidden"
                  border="2px solid"
                  borderColor={
                    index === currentImageIndex ? "blue.400" : "transparent"
                  }
                  cursor="pointer"
                  onClick={() => setCurrentImageIndex(index)}
                  transition="all 0.2s"
                  _hover={{ 
                    transform: "scale(1.1)",
                    borderColor: "blue.300"
                  }}
                  flexShrink={0}
                >
                  <Image
                    src={image.url}
                    alt={`${title} ${index + 1}`}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    loading="lazy"
                  />
                </Box>
              ))}
            </HStack>
          </Box>
        )}

        {/* Mobile Grid View for Multiple Images */}
        {!showThumbnails && images.length > 4 && (
          <Box mt={4}>
            <SimpleGrid columns={4} spacing={2}>
              {images.slice(0, 8).map((image, index) => (
                <Box
                  key={`grid-${generateUniqueKey(image, index)}`}
                  aspectRatio={1}
                  borderRadius="md"
                  overflow="hidden"
                  border="1px solid"
                  borderColor={
                    index === currentImageIndex ? "blue.400" : "gray.200"
                  }
                  cursor="pointer"
                  onClick={() => setCurrentImageIndex(index)}
                  transition="all 0.2s"
                  _hover={{ 
                    borderColor: "blue.300",
                    transform: "scale(1.05)"
                  }}
                >
                  <Image
                    src={image.url}
                    alt={`${title} ${index + 1}`}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    loading="lazy"
                  />
                </Box>
              ))}
            </SimpleGrid>
            {images.length > 8 && (
              <Text 
                textAlign="center" 
                mt={2} 
                fontSize="sm" 
                color="gray.600"
              >
                +{images.length - 8} ta rasm
              </Text>
            )}
          </Box>
        )}
      </Box>

      {/* Full Screen Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay bg="blackAlpha.900" />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalCloseButton 
            color="white" 
            size="lg" 
            top={{ base: 4, md: 6 }}
            right={{ base: 4, md: 6 }}
            bg="blackAlpha.700"
            _hover={{ bg: "blackAlpha.900" }}
            borderRadius="lg"
          />
          <ModalBody 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            p={{ base: 4, md: 0 }}
          >
            <Box 
              position="relative" 
              maxW="90vw" 
              maxH="90vh"
              w="full"
              h="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Image
                src={images[currentImageIndex]?.url}
                alt={title}
                maxW="100%"
                maxH="100%"
                objectFit="contain"
              />
              
              {images.length > 1 && (
                <>
                  <IconButton
                    icon={<FaChevronLeft />}
                    position="absolute"
                    left={{ base: 2, md: 4 }}
                    top="50%"
                    transform="translateY(-50%)"
                    bg="blackAlpha.700"
                    color="white"
                    _hover={{ bg: "blackAlpha.900" }}
                    onClick={handlePrevImage}
                    aria-label="Oldingi rasm"
                    size={{ base: 'md', md: 'lg' }}
                    borderRadius="lg"
                  />
                  <IconButton
                    icon={<FaChevronRight />}
                    position="absolute"
                    right={{ base: 2, md: 4 }}
                    top="50%"
                    transform="translateY(-50%)"
                    bg="blackAlpha.700"
                    color="white"
                    _hover={{ bg: "blackAlpha.900" }}
                    onClick={handleNextImage}
                    aria-label="Keyingi rasm"
                    size={{ base: 'md', md: 'lg' }}
                    borderRadius="lg"
                  />
                </>
              )}

              {/* Modal Image Counter */}
              <Box
                position="absolute"
                bottom={{ base: 4, md: 6 }}
                left="50%"
                transform="translateX(-50%)"
                bg="blackAlpha.700"
                color="white"
                px={{ base: 3, md: 4 }}
                py={2}
                borderRadius="full"
                fontSize={{ base: 'sm', md: 'md' }}
              >
                {currentImageIndex + 1} / {images.length}
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};