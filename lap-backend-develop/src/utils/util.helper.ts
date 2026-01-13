import moment from 'moment-timezone';

export function AgeCalc(startDate: Date, endDate: Date = new Date()) {
  const startMoment = moment(startDate);
  const endMoment = moment(endDate);

  const ageInYears = endMoment.diff(startMoment, 'years');

  return ageInYears;
}

export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[2]}) ${match[3]}-${match[4]}`;
  }
  return phoneNumber;
}

export function generatePassword(length) {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialCharacters = '!@#$%^&*()_+[]{}|;:,.<>?';

  const allCharacters = uppercase + lowercase + numbers + specialCharacters;
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allCharacters.length);
    password += allCharacters[randomIndex];
  }

  return password;
}
export function generateRandomString(length) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
export function getCurrentTime(): string {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear().toString();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  return `${day}${month}${year}_${hours}${minutes}${seconds}`;
}

export function IsEmptyOrSpaces(str) {
  return str === null || str.match(/^ *$/) !== null;
}

export function toFormattedDateString(date: Date | null): string | null {
  if (!date) {
    return null;
  }
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
}

export function isNonEmptyObject(obj: any): boolean {
  if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj).length > 0;
  }
  return false;
}

export function extractKeyFromUrl(url: string): string {
  const urlObj = new URL(url);
  return urlObj.pathname.split('/').pop() ?? '';
}

export function mapPaymentMethod(method: string) {
  method = method.toLowerCase().trim();
  switch (method) {
    case 'card':
      return 'Credit Card';
    case 'us_bank_account':
      return 'Bank draft';
    case 'other':
      return 'Invoice';
    default:
      return 'Credit Card';
  }
}

export function capitalizeFirstChar(str?: string | null) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
