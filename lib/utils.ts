/**
 * Utility functions for form validation and data formatting
 */

/**
 * Utility function to merge class names
 * @param classes - Class names to merge
 * @returns Merged class string
 */
export function cn(...classes: Array<string | undefined | null | false | boolean>): string {
  return classes.filter(Boolean).join(" ");
}

export interface ContactFormData {
  name: string;
  email: string;
  interest: string;
  message: string;
}

// Constants for form validation and data formatting
const FORM_SOURCE = "landing-page";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Error messages
const ERROR_MESSAGES = {
  NAME_REQUIRED: "Name is required",
  EMAIL_REQUIRED: "Email is required",
  EMAIL_INVALID: "Please enter a valid email address",
  INTEREST_REQUIRED: "Please select what you're interested in",
  MESSAGE_REQUIRED: "Message is required",
} as const;

/**
 * Validates email format using a simple regex pattern
 * @param email - Email address to validate
 * @returns true if email format is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

/**
 * Validates contact form data
 * @param data - Form data to validate
 * @returns Object with isValid flag and error messages
 */
export function validateContactForm(data: ContactFormData): {
  isValid: boolean;
  errors: Partial<Record<keyof ContactFormData, string>>;
} {
  const errors: Partial<Record<keyof ContactFormData, string>> = {};

  if (!data.name || data.name.trim().length === 0) {
    errors.name = ERROR_MESSAGES.NAME_REQUIRED;
  }

  if (!data.email || data.email.trim().length === 0) {
    errors.email = ERROR_MESSAGES.EMAIL_REQUIRED;
  } else if (!isValidEmail(data.email)) {
    errors.email = ERROR_MESSAGES.EMAIL_INVALID;
  }

  if (!data.interest || data.interest.trim().length === 0) {
    errors.interest = ERROR_MESSAGES.INTEREST_REQUIRED;
  }

  if (!data.message || data.message.trim().length === 0) {
    errors.message = ERROR_MESSAGES.MESSAGE_REQUIRED;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Formats contact form data for API submission
 * Adds metadata like source and timestamp for automation tracking
 * @param data - Contact form data
 * @returns Formatted payload ready for n8n webhook consumption
 */
export function formatContactPayload(data: ContactFormData) {
  return {
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    interest: data.interest.trim(),
    message: data.message.trim(),
    source: FORM_SOURCE,
    timestamp: new Date().toISOString(),
  };
}

