import { Badge, Box, Button, Card, CardBody, Divider, HStack, Select, Text, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiCalendar, FiEye, FiMessageCircle, FiPhone } from "react-icons/fi";




export const LeedsCard = ({ filteredLeads, statusConfig, cardBg, sourceColors, borderColor, handleStatusChange, openModal }) => {
    const { t } = useTranslation();
    return (
        <>
            {filteredLeads.map((lead, index) => {
                const statusInfo = statusConfig[lead.status];
                const StatusIcon = statusInfo.icon;
                const sourceColor = sourceColors[lead.source] || 'gray';

                return (
                    <Card
                        key={lead.id} 
                        bg={cardBg}
                        shadow="lg"
                        borderRadius="xl"
                        borderWidth="1px"
                        borderColor={borderColor}
                        overflow="hidden"
                        transition="all 0.3s"
                        _hover={{
                            borderColor: '#fed500'
                        }}
                        mb={4}
                        >
                        <CardBody p={6}>
                            <VStack align="stretch" spacing={4}>
                            {/* Header */}
                            <HStack justify="space-between" align="flex-start">
                                <VStack align="start" spacing={1}>
                                    <Text fontWeight="bold" fontSize="lg" color="gray.800">
                                    {lead.name}
                                    </Text>
                                    <HStack spacing={2}>
                                    <FiPhone size={14} color="#fed500" />
                                    <Text 
                                        fontFamily="mono" 
                                        fontSize="sm" 
                                        color="blue.500"
                                        fontWeight="600"
                                    >
                                        {lead.phoneNumber}
                                    </Text>
                                    </HStack>
                                </VStack>
                                
                                <VStack spacing={1} align="end">
                                <Text fontSize="xs" color="gray.500" fontWeight="500">
                                    #{String(index + 1).padStart(3, '0')}
                                </Text>
                                <Badge
                                    colorScheme={sourceColor}
                                    fontSize="xs"
                                    px={2}
                                    py={1}
                                    borderRadius="full"
                                >
                                    {lead.source}
                                </Badge>
                                </VStack>
                            </HStack>
                            
                            {/* Comment */}
                            <Box 
                                bg="gray.50" 
                                p={3} 
                                borderRadius="lg"
                                borderLeft="4px solid"
                                borderLeftColor="#fed500"
                            >
                                <HStack mb={2}>
                                <FiMessageCircle size={14} color="#fed500" />
                                <Text fontSize="sm" fontWeight="600" color="gray.700">
                                    {t("Business_mode.Leeds.note", "Комментарий")}
                                </Text>
                                </HStack>
                                <Text fontSize="sm" color="gray.600" lineHeight="tall">
                                {lead.comment}
                                </Text>
                            </Box>
                            
                            {/* Status and Date */}
                            <HStack justify="space-between" align="center">
                                <Badge
                                colorScheme={statusInfo.color}
                                fontSize={{base: "xs", custom1080: "sm"}}
                                px={3}
                                py={1}
                                borderRadius="md"
                                bg={statusInfo.bg}
                                color={statusInfo.textColor}
                                display="flex"
                                alignItems="center"
                                gap={2}
                                >
                                <StatusIcon size={14} />
                                {statusInfo.label}
                                </Badge>
                                
                                <HStack spacing={1} color="gray.500">
                                <FiCalendar size={14} />
                                <Text fontSize="sm" fontWeight="500">
                                    {lead.date}
                                </Text>
                                </HStack>
                            </HStack>
                            
                            {/* Actions */}
                            <Divider />
                            <HStack justify="space-between" pt={2}>
                                <Select
                                size="sm"
                                value={lead.status}
                                onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                focusBorderColor="#fed500"
                                maxW="300px"
                                minW="150px"
                                fontSize="sm"
                                borderRadius="lg"
                                >
                                {Object.entries(statusConfig).map(([key, config]) => (
                                    <option key={key} value={key}>
                                    {config.label}
                                    </option>
                                ))}
                                </Select>
                                <Button
                                leftIcon={<FiEye />}
                                size="sm"
                                minW={'100px'}
                                bg="linear-gradient(135deg, #ffff00, #ffa600)"
                                color="black"
                                borderWidth={'1px'}
                                _hover={{ bg: "linear-gradient(135deg, #ffa600, #ffff00)" }}
                                _active={{ bg: "transparent", borderColor: "#fed500" }}
                                onClick={() => openModal(lead)}
                                borderRadius="lg"
                                fontWeight="600"
                                transition={'.1s all'}
                                >
                                {t("Business_mode.Leeds.view", "Просмотр")}
                                </Button>
                            </HStack>
                            </VStack>
                        </CardBody>
                    </Card>
                )
            })}
        </>
    );
};