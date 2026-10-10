export type EmergencyService = {
  id: string;
  name: string;
  number: string;
  description: string;
};

export const fallbackEmergencyDirectory = {
  region: 'LK',
  label: 'Sri Lanka',
  services: [
    { id: 'police', name: 'Police', number: '119', description: 'Police emergency' },
    { id: 'ambulance', name: 'Suwa Seriya', number: '1990', description: 'Ambulance' },
    { id: 'fire', name: 'Fire and rescue', number: '110', description: 'Fire and rescue' },
    { id: 'women', name: 'Women and children', number: '1938', description: 'Women and children helpline' },
  ] satisfies EmergencyService[],
};
