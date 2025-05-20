export interface GeoLocation {
  city: string;
  country: string;
  timezone: string;
  latitude: number;
  longitude: number;
}

export const commonTimezones = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney'
];