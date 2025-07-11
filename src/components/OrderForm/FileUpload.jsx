import { 
  Badge, 
  Box, 
  Card, 
  CardBody, 
  Heading, 
  HStack, 
  IconButton, 
  Image, 
  ScaleFade, 
  SlideFade, 
  Spinner, 
  Text, 
  Tooltip, 
  VStack, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalCloseButton, 
  ModalBody, 
  useDisclosure, 
  Alert, 
  AlertIcon,
  Center,
  CloseButton,
  useBreakpointValue
} from "@chakra-ui/react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FiDownload, FiFile, FiImage, FiUpload, FiX, FiEye, FiInfo } from "react-icons/fi";
import FileInfoModal from "./FileInfoModal";

// File validation function
const validateImageFile = (file, t) => {
  const allowedImageFormats = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg'];
  
  if (!allowedImageFormats.includes(file.type)) {
    return {
      valid: false,
      error: `${file.name}: ${t("Orderform.form.attachments.formats", "Поддерживаются форматы SVG, PNG, JPG, JPEG")}`
    };
  }
  return { valid: true };
};

// File size formatter
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// File to Base64 converter
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Check if item is URL string
const isUrlString = (item) => {
  return typeof item === 'string' && (item.startsWith('http://') || item.startsWith('https://'));
};

// Get file name from URL
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

// Get file extension from URL or filename
const getFileExtension = (urlOrName) => {
  const fileName = isUrlString(urlOrName) ? getFileNameFromUrl(urlOrName) : urlOrName;
  const lastDot = fileName.lastIndexOf('.');
  return lastDot > 0 ? fileName.substring(lastDot + 1).toLowerCase() : '';
};

// Check if URL/file is an image
const isImageFile = (item) => {
  if (isUrlString(item)) {
    const ext = getFileExtension(item);
    return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext);
  }
  return item.type && item.type.startsWith('image/');
};

// Updated File URL manager hook to handle both File objects and URL strings
const useFileUrls = (files, isEditPage = false) => {
  const [fileUrls, setFileUrls] = useState({});
  const urlsRef = useRef({});
  
  // Memoize file keys to prevent unnecessary re-renders
  const fileKeys = useMemo(() => {
    return files.map((file, index) => {
      if (isUrlString(file)) {
        return `url-${index}-${file}`;
      }
      return `${file.name}-${file.size}-${file.lastModified}`;
    });
  }, [files]);
  
  useEffect(() => {
    const updateUrls = async () => {
      const newUrls = { ...fileUrls };
      let hasChanges = false;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileKey = fileKeys[i];
        
        if (!newUrls[fileKey] && !urlsRef.current[fileKey]) {
          if (isUrlString(file)) {
            // For URL strings, use the URL directly
            urlsRef.current[fileKey] = file;
            newUrls[fileKey] = file;
            hasChanges = true;
          } else {
            // For File objects, use the existing logic
            try {
              const blobUrl = URL.createObjectURL(file);
              
              // For images, test if blob URL works
              if (file.type.startsWith('image/')) {
                const testImg = new Image();
                testImg.onload = () => {
                  if (!urlsRef.current[fileKey]) {
                    urlsRef.current[fileKey] = blobUrl;
                    setFileUrls(prev => ({ ...prev, [fileKey]: blobUrl }));
                  }
                };
                testImg.onerror = async () => {
                  try {
                    const base64Url = await fileToBase64(file);
                    if (!urlsRef.current[fileKey]) {
                      urlsRef.current[fileKey] = base64Url;
                      setFileUrls(prev => ({ ...prev, [fileKey]: base64Url }));
                    }
                    URL.revokeObjectURL(blobUrl);
                  } catch (error) {
                    console.error('Failed to convert file to base64:', error);
                  }
                };
                testImg.src = blobUrl;
              } else {
                urlsRef.current[fileKey] = blobUrl;
                newUrls[fileKey] = blobUrl;
                hasChanges = true;
              }
            } catch (error) {
              try {
                const base64Url = await fileToBase64(file);
                urlsRef.current[fileKey] = base64Url;
                newUrls[fileKey] = base64Url;
                hasChanges = true;
              } catch (base64Error) {
                console.error('Failed to convert file to base64:', base64Error);
              }
            }
          }
        } else if (urlsRef.current[fileKey]) {
          newUrls[fileKey] = urlsRef.current[fileKey];
          hasChanges = true;
        }
      }
      
      // Clean up unused URLs
      const currentFileKeys = new Set(fileKeys);
      Object.keys(urlsRef.current).forEach(key => {
        if (!currentFileKeys.has(key)) {
          const url = urlsRef.current[key];
          if (url && url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
          delete urlsRef.current[key];
          delete newUrls[key];
          hasChanges = true;
        }
      });
      
      if (hasChanges) {
        setFileUrls(newUrls);
      }
    };
    
    updateUrls();
    
    return () => {
      Object.values(urlsRef.current).forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [fileKeys]);
  
  const getFileUrl = useCallback((index) => {
    const fileKey = fileKeys[index];
    return fileUrls[fileKey] || '';
  }, [fileKeys, fileUrls]);
  
  return { getFileUrl };
};

// File card component with improved drag functionality and URL support
const FileCard = ({ 
  file, 
  index, 
  onImageClick, 
  onFileRemove, 
  onInfoClick, 
  fileUrl, 
  onDragStart, 
  onDragEnd, 
  isDragging,
  isEditPage = false,
  t
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isUrlFile = isUrlString(file);
  const isImage = isUrlFile ? isImageFile(file) : file.type.startsWith('image/');
  
  const handleRemove = (e) => {
    e.stopPropagation();
    onFileRemove(index);
  };
  
  const handleInfoClick = (e) => {
    e.stopPropagation();
    onInfoClick({ file, index });
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };
  
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleDragStart = (e) => {
    if (!isEditPage) {
      onDragStart(index);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', index.toString());
    }
  };

  const handleDragEnd = () => {
    if (!isEditPage) {
      onDragEnd();
    }
  };

  const fileName = isUrlFile ? getFileNameFromUrl(file) : file.name;

  return (
    <ScaleFade in={true} delay={index * 0.05}>
      <Card
        borderRadius="xl"
        border="1px solid"
        borderColor={isDragging ? "blue.400" : "gray.200"}
        _hover={{ 
          borderColor: 'blue.300',
          boxShadow: 'lg',
          transform: 'translateY(-2px)'
        }}
        transition="all 0.3s"
        position="relative"
        bg="white"
        w={{ base: "100px", md: "140px" }}
        h={{ base: "100px", md: "140px" }}
        flexShrink={0}
        draggable={!isEditPage}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        cursor={isEditPage ? "default" : "grab"}
        _active={{ cursor: isEditPage ? "default" : "grabbing" }}
        opacity={isDragging ? 0.5 : 1}
        userSelect="none"
      >
        {/* Delete Button */}
        <Tooltip 
          label={t("Orderform.form.attachments.delete_file", "Удалить файл")}
          hasArrow
          bg="red.500"
          color="white"
          fontSize="sm"
          borderRadius="md"
          placement="top"
        >
          <IconButton
            icon={<FiX />}
            size="xs"
            position="absolute"
            top={-2}
            right={-2}
            zIndex={10}
            colorScheme="red"
            variant="solid"
            borderRadius="full"
            onClick={handleRemove}
            aria-label={t("Orderform.form.attachments.delete_file", "Удалить файл")}
            minW="20px"
            w="20px"
            h="20px"
          />
        </Tooltip>

        {/* Info Button */}
        <Tooltip 
          label={t("Orderform.form.attachments.file_info", "Информация о файле")} 
          hasArrow
          bg="blue.500"
          color="white"
          fontSize="sm"
          borderRadius="md"
          placement="top"
        >
          <IconButton
            icon={<FiInfo />}
            size="sm"
            position="absolute"
            top={2}
            left={2}
            zIndex={10}
            colorScheme="blue"
            variant="solid"
            borderRadius="full"
            _hover={{
              bg: "blue.400"
            }}
            onClick={handleInfoClick}
            aria-label={t("Orderform.form.attachments.file_info", "Информация о файле")}
            minW="20px"
            w={{base: "20px", md: "25px"}}
            h={{base: "20px", md: "25px"}}
          />
        </Tooltip>

        {/* Main Badge - Responsive */}
        {index === 0 && (
          <Badge
            position="absolute"
            bottom={1}
            left="50%"
            transform="translateX(-50%)"
            zIndex={5}
            colorScheme="yellow"
            fontSize={{ base: "xs", md: "sm" }}
            borderRadius="lg"
            px={{ base: 2, md: 7 }}
            py={0}
            bg="#fce96a"
            color="#000"
            textTransform="none"
            pointerEvents="none"
            whiteSpace="nowrap"
            minW="fit-content"
          >
            {t("Orderform.form.attachments.cover", "Обложка")}
          </Badge>
        )}

        <CardBody p={0} h="100%">
          <Box
            h="100%"
            w="100%"
            position="relative"
            cursor={isImage ? 'pointer' : 'default'}
            onClick={() => onImageClick({ file, index })}
            overflow="hidden"
            borderRadius="md"
          >
            {isImage ? (
              <Box position="relative" h="100%" w="100%">
                {!imageLoaded && !imageError && (
                  <Center h="100%" bg="gray.100">
                    <Spinner size="sm" color="blue.500" />
                  </Center>
                )}
                {fileUrl && (
                  <Image
                    src={fileUrl}
                    alt={fileName}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    display={imageLoaded ? 'block' : 'none'}
                    fallback={
                      <Center h="100%" bg="gray.100">
                        <FiImage color="#3182CE" size={40} />
                      </Center>
                    }
                  />
                )}
                {imageError && (
                  <Center h="100%" bg="gray.100">
                    <FiImage color="#3182CE" size={40} />
                  </Center>
                )}
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  bg="blackAlpha.600"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  opacity="0"
                  _hover={{ opacity: 1 }}
                  transition="opacity 0.2s"
                  zIndex={2}
                >
                  <VStack spacing={1}>
                    <FiEye color="white" size={20} />
                    <Text color="white" fontSize="xs" fontWeight="bold">
                      {t("Orderform.form.attachments.looking", "Просмотр")}
                    </Text>
                  </VStack>
                </Box>
              </Box>
            ) : (
              <Center h="100%" bg="gray.50">
                <FiFile color="#3182CE" size={40} />
              </Center>
            )}
          </Box>
        </CardBody>
      </Card>
    </ScaleFade>
  );
};

// File upload component
const FileUploadDemo = ({ files, onFileChange, onFileRemove, isEditPage = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFileInfo, setSelectedFileInfo] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const { isOpen: isImageOpen, onOpen: onImageOpen, onClose: onImageClose } = useDisclosure();
  const { isOpen: isInfoOpen, onOpen: onInfoOpen, onClose: onInfoClose } = useDisclosure();
  const { isOpen: isVisible, onClose: cancel } = useDisclosure({ defaultIsOpen: true });
  const { t } = useTranslation();
  
  const { getFileUrl } = useFileUrls(files, isEditPage);

  // Process files (validation and upload)
  const processFiles = async (fileList) => {
    setUploading(true);
    setValidationErrors([]);
    const uploadedFiles = Array.from(fileList);
    const validFiles = [];
    const errors = [];
    uploadedFiles.forEach(file => {
      const validation = validateImageFile(file, t);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        errors.push(validation.error);
      }
    });
    if (errors.length > 0) {
      setValidationErrors(errors);
    }

    setTimeout(() => {
      if (validFiles.length > 0) {
        onFileChange(validFiles);
      }
      setUploading(false);
    }, 500);
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    if (!isEditPage) {
      await processFiles(event.target.files);
    }
  };

  // Handle drag events for file upload
  const handleDragOver = (e) => {
    e.preventDefault();
    // Only set dragging state if it's a file drag, not a card reorder, and not in edit mode
    if (e.dataTransfer.types.includes('Files') && !isEditPage) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!isEditPage) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    setDragOverIndex(null);
    
    // Check if it's a file drop or reorder drop, and not in edit mode
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && !isEditPage) {
      await processFiles(e.dataTransfer.files);
    }
  };

  // Handle drag and drop for reordering
  const handleDragStart = (index) => {
    if (!isEditPage) {
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    if (!isEditPage) {
      setDraggedIndex(null);
      setDragOverIndex(null);
    }
  };

  const handleDragOverCard = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedIndex !== null && draggedIndex !== index && !isEditPage) {
      setDragOverIndex(index);
    }
  };

  const handleDropCard = (e, dropIndex) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Ensure this is a card reorder, not a file drop, and not in edit mode
    if (draggedIndex !== null && draggedIndex !== dropIndex && !e.dataTransfer.types.includes('Files') && !isEditPage) {
      const newFiles = [...files];
      const draggedFile = newFiles[draggedIndex];
      newFiles.splice(draggedIndex, 1);
      newFiles.splice(dropIndex, 0, draggedFile);
      onFileChange(newFiles);
    }
    
    if (!isEditPage) {
      setDraggedIndex(null);
      setDragOverIndex(null);
    }
  };

  // Handle image click
  const handleImageClick = (fileObj) => {
    const isImage = isUrlString(fileObj.file) ? isImageFile(fileObj.file) : fileObj.file.type.startsWith('image/');
    if (isImage) {
      setSelectedImage(fileObj);
      onImageOpen();
    }
  };

  // Handle file info click
  const handleFileInfoClick = (fileObj) => {
    setSelectedFileInfo(fileObj);
    onInfoOpen();
  };

  const isMobile = useBreakpointValue({base: true, custom570: false});

  // Get selected image URL
  const selectedImageUrl = selectedImage ? getFileUrl(selectedImage.index) : null;
  const selectedFileInfoUrl = selectedFileInfo ? getFileUrl(selectedFileInfo.index) : null;
  
  return (
    <Box mb={8}>
      <VStack align="start" spacing={4} mb={6}>
        <Heading size="md" color="gray.800">
          {t("Orderform.form.attachments.title", "Документы и изображения")}
        </Heading>
        <Text color="gray.600" fontSize="sm">
          {t("Orderform.form.attachments.desc", "Закрепленные документы (не обязательно)")}
        </Text>
      </VStack>

      {/* Validation Errors */}
      {validationErrors.length > 0 && isVisible && (
        <Alert status="error" mb={4} borderRadius="md" display="flex" justifyContent="space-between">
          <HStack>
            <AlertIcon />
            <VStack align="start" spacing={1}>
              <Text fontWeight="medium">{t("Orderform.form.attachments.no_acsept", "Следующие файлы не были приняты:")}</Text>
              {validationErrors.map((error, index) => (
                <Text key={index} fontSize="sm">{error}</Text>
              ))}
            </VStack>
          </HStack>
          <CloseButton
            alignSelf="flex-start"
            position="relative"
            right={-1}
            top={-1}
            onClick={cancel}
          />
        </Alert>
      )}
      
      {/* Upload Area - Only show when not in edit mode */}
      {!isEditPage && (
        <Box
          border="3px dashed"
          borderColor={isDragging ? "blue.400" : "blue.200"}
          borderRadius="2xl"
          p={8}
          textAlign="center"
          bg={isDragging ? "blue.50" : "blue.25"}
          position="relative"
          cursor="pointer"
          _hover={{ 
            bg: 'blue.50',
            borderColor: 'blue.400',
            transform: 'scale(1.01)'
          }}
          transition="all 0.3s"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer'
            }}
            accept=".jpg,.jpeg,.png,.svg"
          />
          
          <VStack spacing={4}>
            <Box
              p={4}
              bgGradient="linear(to-r, blue.400, purple.500)"
              borderRadius="full"
              h="65px"
              w="65px"
              display="flex"
              justifyContent="center"
              alignItems="center"
              animation={uploading ? "pulse 2s infinite" : "none"}
            >
              {uploading ? (
                <Spinner color="white" size="lg" />
              ) : (
                isDragging ? (
                  <FiDownload color="white" size={32} />
                ) : (
                  <FiUpload color="white" size={32} />
                )
              )}
            </Box>
            <VStack spacing={2}>
              <Text color="blue.400" fontWeight="bold" fontSize="lg">
                {uploading ? t("Orderform.form.attachments.loading", "Загрузка...") : t("Orderform.form.attachments.upload", "Загрузить файлы")}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {t("Orderform.form.attachments.or_drag", "или перетащите файлы сюда")}
              </Text>
              <Text fontSize="xs" color="gray.400">
                {t("Orderform.form.attachments.formats", "Поддерживаются форматы SVG, PNG, JPG, JPEG")}
              </Text>
            </VStack>
          </VStack>
        </Box>
      )}

      {/* File List */}
      {files.length > 0 && (
        <SlideFade in={true}>
          <VStack mt={isEditPage ? 0 : 6} spacing={4} align="stretch">
            <Text fontWeight="medium" color="gray.700">
              {t("Orderform.form.attachments.downloaded_files", "Загруженные файлы")} ({files.length})
            </Text>
            
            <Box 
              display="flex" 
              gap={{base: 2, md: 4}}
              {...(files.length > 4 && isMobile ? {
                overflowX: "auto",
                sx: {
                  '&::-webkit-scrollbar': {
                    height: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '10px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#fed500',
                    borderRadius: '10px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: '#a1a1a1',
                  },
                }
              } : {
                flexWrap: "wrap",
                justifyContent: "flex-start"
              })}
              w="100%"
              py={2}
            >
              {files.map((file, index) => (
                <Box
                  key={isUrlString(file) ? `url-${index}-${file}` : `${file.name}-${file.size}-${file.lastModified}-${index}`}
                  onDragOver={(e) => handleDragOverCard(e, index)}
                  onDrop={(e) => handleDropCard(e, index)}
                  position="relative"
                  transform={dragOverIndex === index ? "translateX(8px)" : "translateX(0)"}
                  transition="transform 0.2s"
                >
                  <FileCard
                    file={file}
                    index={index}
                    onImageClick={handleImageClick}
                    onFileRemove={onFileRemove}
                    onInfoClick={handleFileInfoClick}
                    fileUrl={getFileUrl(index)}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    isDragging={draggedIndex === index}
                    isEditPage={isEditPage}
                    t={t}
                  />
                </Box>
              ))}
            </Box>
          </VStack>
        </SlideFade>
      )}

      {/* Image Preview Modal */}
      <Modal isOpen={isImageOpen} onClose={onImageClose} size="2xl" isCentered>
        <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(4px)" />
        <ModalContent mx={{base: 2, sm: 4}} bg="white" maxW="800px" maxH="90vh">
          <ModalHeader pb={2}>
            <Text fontSize="lg" fontWeight="bold" color="gray.800" noOfLines={1}>
              {selectedImage && (isUrlString(selectedImage.file) ? getFileNameFromUrl(selectedImage.file) : selectedImage.file.name)}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={4} display="flex" justifyContent="center" alignItems="center">
            {selectedImage && selectedImageUrl && (
              <Image
                src={selectedImageUrl}
                alt={isUrlString(selectedImage.file) ? getFileNameFromUrl(selectedImage.file) : selectedImage.file.name}
                maxW="100%"
                maxH="400px"
                objectFit="contain"
                borderRadius="md"
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* File Info Modal */}
      <FileInfoModal
        isInfoOpen={isInfoOpen} 
        onInfoClose={onInfoClose}
        selectedFileInfo={selectedFileInfo}
        formatFileSize={formatFileSize}
        selectedFileInfoUrl={selectedFileInfoUrl}
      />
    </Box>
  );
};

export const FileUpload = ({files, setFiles, isEditPage = false}) => {
  const handleFileChange = (newFiles) => {
    if (Array.isArray(newFiles) && newFiles.length > 0) {
      // Check if this is a reordered array (same length and contains all existing files)
      const isReorderOperation = newFiles.length === files.length && 
        newFiles.every(file => {
          if (isUrlString(file)) {
            return files.some(existingFile => existingFile === file);
          }
          return files.some(existingFile => 
            !isUrlString(existingFile) &&
            existingFile.name === file.name && 
            existingFile.size === file.size && 
            existingFile.lastModified === file.lastModified
          );
        });
      
      if (isReorderOperation) {
        // If it's a reorder operation, replace the entire array
        setFiles(newFiles);
      } else {
        // If it's new files being added, append them to existing files
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
      }
    }
  };

  const handleFileRemove = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <FileUploadDemo
      files={files}
      onFileChange={handleFileChange}
      onFileRemove={handleFileRemove}
    />
  );
};
