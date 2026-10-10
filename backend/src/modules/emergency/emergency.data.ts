export type EmergencyService = {
  id: string;
  name: string;
  number: string;
  description: string;
};

const directories: Record<string, { region: string; label: string; services: EmergencyService[] }> = {
  LK: {
    region: 'LK',
    label: 'Sri Lanka',
    services: [
      { id: 'police', name: 'Police', number: '119', description: 'Police emergency' },
      { id: 'ambulance', name: 'Suwa Seriya', number: '1990', description: 'Ambulance' },
      { id: 'fire', name: 'Fire and rescue', number: '110', description: 'Fire and rescue' },
      { id: 'women', name: 'Women and children', number: '1938', description: 'Women and children helpline' },
    ],
  },
  IN: {
    region: 'IN',
    label: 'India',
    services: [
      { id: 'emergency', name: 'Emergency', number: '112', description: 'All-in-one emergency' },
      { id: 'police', name: 'Police', number: '100', description: 'Police' },
      { id: 'ambulance', name: 'Ambulance', number: '108', description: 'Ambulance' },
      { id: 'fire', name: 'Fire', number: '101', description: 'Fire' },
      { id: 'women', name: 'Women helpline', number: '1091', description: 'Women helpline' },
    ],
  },
  GENERIC: {
    region: 'GENERIC',
    label: 'General',
    services: [
      {
        id: 'emergency',
        name: 'Local emergency',
        number: '112',
        description: '112 is used in many countries. Confirm the number where you are.',
      },
    ],
  },
};

export function getEmergencyDirectory(region: string) {
  return directories[region] ?? directories.GENERIC;
}
