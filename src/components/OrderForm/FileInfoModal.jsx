import { Badge, Box, Center, HStack, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'

// Helper functions
const isUrlString = (item) => {
  return typeof item === 'string' && (item.startsWith('http://') || item.startsWith('https://'));
};

const getFileNameFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const fileName = pathname.split('/').pop();
    return fileName || 'unknown-file';
  } catch (error) {
    return 'unknown-file';
  }
};

const getFileExtension = (urlOrName) => {
  const fileName = isUrlString(urlOrName) ? getFileNameFromUrl(urlOrName) : urlOrName;
  const lastDot = fileName.lastIndexOf('.');
  return lastDot > 0 ? fileName.substring(lastDot + 1).toLowerCase() : '';
};

const isImageFile = (item) => {
  if (isUrlString(item)) {
    const ext = getFileExtension(item);
    return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext);
  }
  return item.type && item.type.startsWith('image/');
};

const FileInfoModal = ({isInfoOpen, onInfoClose, selectedFileInfo, formatFileSize, selectedFileInfoUrl}) => {
  const { t } = useTranslation();
  
  if (!selectedFileInfo) return null;
  
  const file = selectedFileInfo.file;
  const isUrlFile = isUrlString(file);
  const fileName = isUrlFile ? getFileNameFromUrl(file) : file.name;
  const fileSize = isUrlFile ? 'N/A' : formatFileSize(file.size);
  const fileExtension = isUrlFile ? getFileExtension(file) : (file.type.split('/')[1]?.toUpperCase() || 'FILE');
  const isImage = isUrlFile ? isImageFile(file) : file.type.startsWith('image/');
  
  return (
    <Modal isOpen={isInfoOpen} onClose={onInfoClose} size="sm" isCentered>
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(4px)" />
      <ModalContent mx={{base: 2, sm: 4}} bg="white">
        <ModalHeader pb={2}>
          <Text fontSize="lg" fontWeight="bold" color="gray.800">
            {t("Orderform.form.attachments.file_info", "Информация о файле")}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={4}>
          <VStack align="start" spacing={4}>
            <Box>
              <Text fontSize="sm" color="gray.500" mb={1}>
                {t("Orderform.form.attachments.file_name", "Имя файла:")}
              </Text>
              <Text fontWeight="medium" color="gray.800" wordBreak="break-word">
                {fileName}
              </Text>
            </Box>
            
            <HStack spacing={4} w="100%">
              <Box>
                <Text fontSize="sm" color="gray.500" mb={1}>
                  {t("Orderform.form.attachments.size", "Размер:")}
                </Text>
                <Badge colorScheme="blue" fontSize="xs">
                  {fileSize}
                </Badge>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.500" mb={1}>
                  {t("Orderform.form.attachments.format", "Формат:")}
                </Text>
                <Badge colorScheme="green" fontSize="xs">
                  {fileExtension}
                </Badge>
              </Box>
            </HStack>
            
            {/* Show source type for URL files */}
            {isUrlFile && (
              <Box>
                <Text fontSize="sm" color="gray.500" mb={1}>
                  {t("Orderform.form.attachments.source", "Источник:")}
                </Text>
                <Badge colorScheme="purple" fontSize="xs">
                  URL
                </Badge>
              </Box>
            )}
            
            {/* Show full URL for URL files */}
            {isUrlFile && (
              <Box>
                <Text fontSize="sm" color="gray.500" mb={1}>
                  {t("Orderform.form.attachments.url", "Ссылка:")}
                </Text>
                <Text fontSize="xs" color="gray.600" wordBreak="break-all">
                  {file}
                </Text>
              </Box>
            )}
            
            {/* Image preview */}
            {isImage && selectedFileInfoUrl && (
              <Box w="100%">
                <Text fontSize="sm" color="gray.500" mb={2}>
                  {t("Orderform.form.attachments.preview", "Предпросмотр:")}
                </Text>
                <Center>
                  <Image
                    src={selectedFileInfoUrl}
                    alt={fileName}
                    maxW="100%"
                    maxH="200px"
                    objectFit="contain"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.200"
                  />
                </Center>
              </Box>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default FileInfoModal