import React, { useState, useMemo, useCallback } from "react";
import { Box, Card, CardBody, Heading, VStack, Text, IconButton, Flex, HStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiDownload, FiFile, FiFileText, FiImage, FiAward, FiShield, FiTrendingUp } from "react-icons/fi";
import { Pagination } from "./Pagination"; // Sizning pagination componentingiz

// Mock data - keyinchalik API bilan almashtiriladi
const MOCK_DOCUMENTS = [
  {
    id: 1,
    filename: "nimadir.pdf",
    downloadUrl: "/api/documents/download/1"
  },
  {
    id: 2,
    filename: "contract.pdf", 
    downloadUrl: "/api/documents/download/2"
  },
  {
    id: 3,
    filename: "report.docx",
    downloadUrl: "/api/documents/download/3"
  },
  {
    id: 4,
    filename: "certificate.pdf",
    downloadUrl: "/api/documents/download/4"
  },
  {
    id: 5,
    filename: "license.pdf",
    downloadUrl: "/api/documents/download/5"
  },
  {
    id: 6,
    filename: "catalog.pdf",
    downloadUrl: "/api/documents/download/6"
  }
];

const DOCUMENTS_PER_PAGE = 5;

export const DocumentsContent = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [documents] = useState(MOCK_DOCUMENTS); // API dan kelgan ma'lumotlar bu yerda bo'ladi
  const [loading, setLoading] = useState(false);

  // File type iconlarini olish uchun optimized function - extension asosida
  const getFileIcon = useCallback((filename) => {
    const iconProps = { size: 24 };
    const extension = filename.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <FiFile {...iconProps} color="#E53E3E" />;
      case 'docx':
      case 'doc':
        return <FiFileText {...iconProps} color="#3182CE" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FiImage {...iconProps} color="#38A169" />;
      default:
        return <FiFile {...iconProps} color="#718096" />;
    }
  }, []);

  // Pagination uchun hisoblashlar - memoized
  const { paginatedDocuments, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * DOCUMENTS_PER_PAGE;
    const endIndex = startIndex + DOCUMENTS_PER_PAGE;
    
    return {
      paginatedDocuments: documents.slice(startIndex, endIndex),
      totalPages: Math.ceil(documents.length / DOCUMENTS_PER_PAGE)
    };
  }, [documents, currentPage]);

  // File download handler - optimized
  const handleDownload = useCallback(async (document) => {
    try {
      setLoading(true);
      
      // API orqali file download qilish
      // const response = await fetch(document.downloadUrl, {
      //   method: 'GET',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/octet-stream'
      //   }
      // });
      
      // if (!response.ok) {
      //   throw new Error('Download failed');
      // }
      
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      
      // Hozircha mock implementation
      const url = document.downloadUrl;
      
      const link = document.createElement('a');
      link.href = url;
      link.download = document.filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // window.URL.revokeObjectURL(url); // Real API da ishlatish kerak
      
    } catch (error) {
      console.error('Download error:', error);
      // Error handling - toast yoki notification ko'rsatish
    } finally {
      setLoading(false);
    }
  }, []);

  // Page change handler - optimized
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    // API dan yangi ma'lumot olish kerak bo'lsa
    // fetchDocuments(page);
  }, []);

  // API integration hook (hozircha izoh)
  // useEffect(() => {
  //   const fetchDocuments = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await fetch(`/api/documents?page=${currentPage}&limit=${DOCUMENTS_PER_PAGE}`, {
  //         headers: {
  //           'Authorization': `Bearer ${token}`,
  //           'Content-Type': 'application/json'
  //         }
  //       });
  //       
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch documents');
  //       }
  //       
  //       const data = await response.json();
  //       setDocuments(data.documents);
  //       setTotalPages(Math.ceil(data.total / DOCUMENTS_PER_PAGE));
  //     } catch (error) {
  //       console.error('Fetch error:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   
  //   fetchDocuments();
  // }, [currentPage]);

  // Agar hech qanday documents bo'lmasa, static content ko'rsatish
  if (!documents || documents.length === 0) {
    return (
      <Box>
        <Heading size="lg" mb={6} color="gray.800">
          {t("footer.document", "Документы")} MAvjud emas
        </Heading>
        <VStack spacing={4}>
          <Card borderRadius="2xl" border="1px" borderColor="gray.100" _hover={{ borderColor: 'blue.200' }} cursor="pointer" w="100%">
            <CardBody p={6} textAlign="center">
              <HStack spacing={4} align="center">
                <Box w={12} h={12} bg="blue.50" borderRadius="xl" display="flex" alignItems="center" justifyContent="center">
                  <FiShield size="24" color="#4299e1" />
                </Box>
                <Box textAlign="left" flex="1">
                  <Text fontWeight="semibold" mb={1}>{t("partsmarketplace.documentscontent.quality_cert", "Сертификат качества")}</Text>
                  <Text fontSize="sm" color="gray.600">ISO 9001:2015</Text>
                </Box>
              </HStack>
            </CardBody>
          </Card>

          <Card borderRadius="2xl" border="1px" borderColor="gray.100" _hover={{ borderColor: 'blue.200' }} cursor="pointer" w="100%">
            <CardBody p={6} textAlign="center">
              <HStack spacing={4} align="center">
                <Box w={12} h={12} bg="green.50" borderRadius="xl" display="flex" alignItems="center" justifyContent="center">
                  <FiAward size="24" color="#48BB78" />
                </Box>
                <Box textAlign="left" flex="1">
                  <Text fontWeight="semibold" mb={1}>{t("partsmarketplace.documentscontent.licence_cert", "Лицензия")}</Text>
                  <Text fontSize="sm" color="gray.600">{t("partsmarketplace.documentscontent.licence_desc", "Торговая деятельность")}</Text>
                </Box>
              </HStack>
            </CardBody>
          </Card>

          <Card borderRadius="2xl" border="1px" borderColor="gray.100" _hover={{ borderColor: 'blue.200' }} cursor="pointer" w="100%">
            <CardBody p={6} textAlign="center">
              <HStack spacing={4} align="center">
                <Box w={12} h={12} bg="yellow.50" borderRadius="xl" display="flex" alignItems="center" justifyContent="center">
                  <FiTrendingUp size="24" color="#F6AD55" />
                </Box>
                <Box textAlign="left" flex="1">
                  <Text fontWeight="semibold" mb={1}>{t("partsmarketplace.documentscontent.katalog", "Каталог")}</Text>
                  <Text fontSize="sm" color="gray.600">{t("partsmarketplace.documentscontent.manufactor", "Продукция")} 2025</Text>
                </Box>
              </HStack>
            </CardBody>
          </Card>
        </VStack>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="lg" mb={6} color="gray.800">
        {t("footer.document", "Документы")}
      </Heading>
      
      {loading ? (
        <Flex justify="center" align="center" minH="200px">
          <Text color="gray.500">Loading...</Text>
        </Flex>
      ) : (
        <>
          {/* Documents row formatida ko'rsatish */}
          <VStack spacing={4} mb={6}>
            {paginatedDocuments.map((document) => (
              <Card
                key={document.id}
                borderRadius="2xl"
                border="1px"
                borderColor="gray.100"
                _hover={{ 
                  borderColor: 'blue.200',
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg'
                }}
                cursor="pointer"
                transition="all 0.2s"
                onClick={() => handleDownload(document)}
                w="100%"
              >
                <CardBody p={6}>
                  <HStack spacing={4} align="center">
                    <Box
                      w={12}
                      h={12}
                      bg="gray.50"
                      borderRadius="xl"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                    >
                      {getFileIcon(document.filename)}
                    </Box>
                    
                    <Box flex="1" textAlign="left">
                      <Text 
                        fontWeight="semibold" 
                        noOfLines={1}
                        title={document.filename}
                      >
                        {document.filename}
                      </Text>
                    </Box>

                    <IconButton
                      icon={<FiDownload />}
                      aria-label="Download file"
                      size="sm"
                      variant="ghost"
                      colorScheme="blue"
                      borderRadius="lg"
                      _hover={{ bg: 'blue.50' }}
                      color={'blue.400'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(document);
                      }}
                      flexShrink={0}
                    />
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </VStack>

          {/* Pagination - faqat 5 tadan ko'p document bo'lsa ko'rinadi */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </Box>
  );
};