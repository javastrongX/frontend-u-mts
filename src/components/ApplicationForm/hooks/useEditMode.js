import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';

const useEditMode = (initializeEditMode) => {
  const location = useLocation();
  const { pathname } = location;
  const { id } = useParams();
  const isEditPage = pathname.startsWith("/edit");
  const { t } = useTranslation();
  const [editData, setEditData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Umumiy ma'lumotlar - barcha kategoriyalar uchun
  const commonData = {
    description: "salom test",
    price: "12000",
    contact: "Jorabek",
    phone: "+998772233445, +959484848",
    contact_location: "Toshkent Shahri, Узбекистан",
    currency: "eur",
    files: [
      "https://lilacdata.ru/wp-content/uploads/2019/01/Flower-City3.jpg",
      "https://www.svgrepo.com/show/535115/alien.svg"
    ]
  };

  // Mock data - bu yerda real API dan data kelishi kerak
  const mockEditDataPurchase = { // "Prodaja spestexniki" - purchase
    category: "purchase",
    techType: "excavator",
    marka: "caterpillar_excavator",
    model: "cat_320",
    countriesbymodel: "uzbekistan",
    fuelType: "petrol",
    releaseDate: "2020",
    mileage: "10009",
    condition: "new",
    cashPayment: "cash",
    currency: "usd",
    ...commonData
  };

  const mockEditDataRent = { // Arenda sepestexniki - rent
    category: "rent",
    techType: "excavator",
    marka: "caterpillar_excavator",
    model: "cat_320",
    countriesbymodel: "uzbekistan",
    fuelType: "petrol",
    releaseDate: "2020",
    minOrderTime: "10009",
    haveDriver: "yes",
    hourlyRate: "12",
    ...commonData
  };

  const mockEditDataParts = { // zapchasti sepestexniki - parts
    category: "parts",
    title: "Elon nomi",
    techType: [ "excavator", "bulldozer", "crane" ],
    marka:  [ "caterpillar_excavator", "komatsu_excavator", "liebherr_crane" ],
    partsCategory: "hydraulics",
    partNumber: "Ad12",
    countriesbycategory: "uzbekistan",
    condition: "new",
    cashPayment: "cash",
    ...commonData
  };

  const mockEditDataRepair = { // remont sepestexniki - repair
    category: "repair",
    markaForRepair:  [ "man", "talant" ],
    profession: [ "mechanic", "motor_repairman" ],
    partmanifacturer: [ "bosch", "denso" ],
    workLocation: "both",
    experience: "20",
    ...commonData
  };

  const mockEditDataDriver = { // Voditel sepestexniki - driver
    category: "driver",
    techType:  [ "excavator", "bulldozer" ],
    experience: "20",
    ...commonData
  };

  // Disable fields configuration
  const getDisableFields = {
    "purchase": [
      "techType",
      "marka",
      "model",
      "countriesbymodel",
    ],
    "rent": [
      "techType",
      "marka",
      "model"
    ],
    "parts": [
      "techType",
      "marka",
      "partsCategory",
      "countriesbycategory"
    ],
    "repair": [
      "markaForRepair",
      "profession",
      "partmanifacturer"
    ],
    "driver": [
      "techType"
    ]
  };

  // API dan ma'lumot olish
  const fetchEditData = async () => {
    if (!isEditPage || !id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Real API call
      // const response = await fetch(`/api/products/${id}`);
      // if (!response.ok) {
      //   throw new Error('Failed to fetch data');
      // }
      // const data = await response.json();
      
      // Mock data for now
      const data = mockEditDataDriver;
      setEditData(data);
      
      // Ma'lumotni formData ga yukla
      if (initializeEditMode) {
        initializeEditMode(data, data.category);
      }
    } catch (err) {
      console.error(t("ApplicationForm.errors.error_fetching", 'Ошибка при получении данных для редактирования:'), err);
      setError(err.message || t("ApplicationForm.errors.failed_loadData", 'Не удалось загрузить данные'));
    } finally {
      setIsLoading(false);
    }
  };

  // Page unload warning
  useEffect(() => {
    if (!isEditPage) return;
    
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isEditPage]);

  // Fetch data when component mounts
  useEffect(() => {
    fetchEditData();
  }, [isEditPage, id]);

  // Disabled fields getter
  const getDisabledFields = (category) => {
    return isEditPage && editData ? getDisableFields[category] || [] : [];
  };

  return {
    isEditPage,
    editData,
    isLoading,
    error,
    getDisabledFields,
    refetchData: fetchEditData
  };
};

export default useEditMode;