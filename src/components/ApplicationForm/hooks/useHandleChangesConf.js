import { useCallback, useMemo } from "react";
import { useApplicationForm } from "../logic/useApplicationForm";


export const useHandleChangesConf = ({handleInputChange, selectedType, setSelectedType, setFormData}) => {

    const handleTypeChange = useCallback(
    (type) => {
        setSelectedType(type);
        setFormData({});
    },
    [setSelectedType, setFormData]
    );

    const handleTitleChange = useCallback(
    (e) => {
        handleInputChange("title", e.target.value);
    },
    [handleInputChange]
    );

    const handlePartNumberChange = useCallback(
    (e) => {
        handleInputChange("partNumber", e.target.value);
    },
    [handleInputChange]
    );

    const handleExperienceChange = useCallback(
    (e) => {
        handleInputChange("experience", e.target.value);
    },
    [handleInputChange]
    );

    const handleMinOrderTimeChange = useCallback(
    (e) => {
        handleInputChange("minOrderTime", e.target.value);
    },
    [handleInputChange]
    );

    const handleMileageChange = useCallback(
    (e) => {
        handleInputChange("mileage", e.target.value);
    },
    [handleInputChange]
    );

    const handleContactChange = useCallback(
    (e) => {
        handleInputChange("contact", e.target.value);
    },
    [handleInputChange]
    );

    const handlePriceChange = useCallback(
    (e) => {
        handleInputChange("price", e.target.value);
    },
    [handleInputChange]
    );

    const handleHourlyRateChange = useCallback(
    (e) => {
        handleInputChange("hourlyRate", e.target.value);
    },
    [handleInputChange]
    );

    const handleNegotiableChange = useCallback(
    (e) => {
        console.log(e.target.checked);
        handleInputChange("isNegotiable", e.target.checked);
    },
    [handleInputChange]
    );

    const handleDescriptionChange = useCallback(
    (value) => {
        handleInputChange("description", value);
    },
    [handleInputChange]
    );

    const handleCountryChange = useCallback(
    (value) => {
        handleInputChange("country", value);
    },
    [handleInputChange]
    );

    const handleCityChange = useCallback(
    (value) => {
        handleInputChange("city", value);
    },
    [handleInputChange]
    );

    // Memoized conditional renders
    const showPartsTitle = useMemo(
    () => ["parts"].includes(selectedType),
    [selectedType]
    );

    const showPartsPartNumber = useMemo(
    () => ["parts"].includes(selectedType),
    [selectedType]
    );

    const showExperience = useMemo(
    () => ["repair", "driver"].includes(selectedType),
    [selectedType]
    );

    const showRentFields = useMemo(
    () => ["rent"].includes(selectedType),
    [selectedType]
    );

    const showPurchasePartsFields = useMemo(
    () => ["purchase", "parts"].includes(selectedType),
    [selectedType]
    );

    const showMileage = useMemo(
    () => selectedType !== "parts" && showPurchasePartsFields,
    [selectedType, showPurchasePartsFields]
    );

    const showHourlyRate = useMemo(
    () => selectedType === "rent",
    [selectedType]
    );

    return {
        handleTypeChange,
        handleTitleChange,
        handlePartNumberChange,
        handleExperienceChange,
        handleMinOrderTimeChange,
        handleMileageChange,
        handleContactChange,
        handlePriceChange,
        handleHourlyRateChange,
        handleNegotiableChange,
        handleDescriptionChange,
        handleCountryChange,
        handleCityChange,
        showPartsTitle,
        showPartsPartNumber,
        showExperience,
        showRentFields,
        showMileage,
        showHourlyRate
    }
}