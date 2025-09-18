export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^[0-9]{9}$/;

export const validateRegistrationForm = (country, emailOrPhone, t) => {
  const errors = {};
  const isUzbekistan = country === "uz";
  
  if (!country) {
    errors.country = t('auth_register.country_err', "Пожалуйста, выберите страну");
  }
  
  if (!emailOrPhone.trim()) {
    errors.emailOrPhone = isUzbekistan 
      ? t('auth_register.phone_err', "Номер телефона обязателен") 
      : t('auth_register.email_err', "Email обязателен");
  } else {
    if (isUzbekistan) {
      if (!PHONE_REGEX.test(emailOrPhone)) {
        errors.emailOrPhone = t('auth_register.phone_format_error', "Неверный формат номера телефона");
      }
    } else {
      if (!EMAIL_REGEX.test(emailOrPhone)) {
        errors.emailOrPhone = t('auth_register.email_format_error', "Неверный формат email");
      }
    }
  }

  return errors;
};