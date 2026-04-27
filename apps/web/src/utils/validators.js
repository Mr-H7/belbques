
/**
 * Validation functions for survey inputs and forms
 */

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validateMinLength = (value, min) => {
  return value && value.trim().length >= min;
};

export const validateMaxLength = (value, max) => {
  return value && value.trim().length <= max;
};

export const validatePhone = (phone) => {
  // Basic Egyptian phone validation (starts with 01 and 11 digits total)
  const re = /^01[0125][0-9]{8}$/;
  return re.test(String(phone));
};
