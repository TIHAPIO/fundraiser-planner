export const mockFundraisers = [
  {
    id: 1,
    name: "Max Mustermann",
    role: "Fundraiser",
    email: "max@example.com",
    phone: "+49 123 4567890",
    // Added details
    uniformSize: {
      shirt: "L",
      pants: "32/32",
      shoes: "44",
    },
    ipadNumber: "iPad-2023-001",
    notes: "Erfahrener Fundraiser, spricht Deutsch und Englisch",
  },
  {
    id: 2,
    name: "Anna Schmidt",
    role: "Teamleader",
    email: "anna@example.com",
    phone: "+49 123 4567891",
    uniformSize: {
      shirt: "M",
      pants: "28/30",
      shoes: "38",
    },
    ipadNumber: "iPad-2023-002",
    notes: "Teamleiter seit 2 Jahren",
  },
];

export const mockAccommodations = [
  {
    id: 1,
    name: "City Apartment Berlin",
    address: "Berliner Str. 123, 10115 Berlin",
    checkIn: "14:00",
    checkOut: "11:00",
    contact: {
      name: "Hans Meyer",
      phone: "+49 123 456789",
      email: "hans.meyer@apartments.de",
    },
    link: "https://example.com/city-apartment-berlin",
    capacity: 4,
    notes: "Zentral gelegen, 2 Schlafzimmer, voll ausgestattete Küche",
  },
  {
    id: 2,
    name: "Hamburg House",
    address: "Hamburger Str. 45, 20144 Hamburg",
    checkIn: "15:00",
    checkOut: "10:00",
    contact: {
      name: "Maria Weber",
      phone: "+49 123 456788",
      email: "maria.weber@hamburg-house.de",
    },
    link: "https://example.com/hamburg-house",
    capacity: 6,
    notes: "Großes Haus mit Garten, 3 Schlafzimmer",
  },
];

export const mockVehicles = [
  {
    id: 1,
    type: "Van",
    model: "VW T6",
    licensePlate: "B-RK-1234",
    capacity: 9,
    rentalCompany: "AutoRent Berlin",
    contact: {
      phone: "+49 123 456787",
      email: "info@autorent-berlin.de",
    },
    notes: "Inkl. Navigationssystem",
  },
  {
    id: 2,
    type: "PKW",
    model: "VW Golf",
    licensePlate: "HH-RK-5678",
    capacity: 5,
    rentalCompany: "Hamburg Cars",
    contact: {
      phone: "+49 123 456786",
      email: "info@hamburg-cars.de",
    },
    notes: "Automatikgetriebe",
  },
];

const generateWeeks = (startDate, endDate, teamLeader, fundraisers) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const weeks = [];
  let currentDate = start;
  let weekNumber = 1;

  while (currentDate <= end) {
    const weekEnd = new Date(currentDate);
    weekEnd.setDate(weekEnd.getDate() + 6);

    weeks.push({
      weekNumber,
      startDate: currentDate.toISOString().split('T')[0],
      endDate: weekEnd.toISOString().split('T')[0],
      teamLeader,
      fundraisers
    });

    currentDate = new Date(weekEnd);
    currentDate.setDate(currentDate.getDate() + 1);
    weekNumber++;
  }

  return weeks;
};

export const mockCampaigns = [
  {
    id: 1,
    name: "Sommerkampagne 2023",
    startDate: "2023-06-01",
    endDate: "2023-07-15",
    teamLeader: 2,
    selectedFundraisers: [1, 3],
    capacity: 10,
    registeredFundraisers: 5,
    accommodation: 1,
    vehicle: 1,
    notes: "Fokus auf Neuspendergewinnung",
    status: "active",
    weeks: generateWeeks("2023-06-01", "2023-07-15", 2, [1, 3])
  },
  {
    id: 2,
    name: "Herbstkampagne 2023",
    startDate: "2023-09-01",
    endDate: "2023-10-15",
    teamLeader: 4,
    selectedFundraisers: [3, 5],
    capacity: 8,
    registeredFundraisers: 6,
    accommodation: 2,
    vehicle: 2,
    notes: "Schwerpunkt: Dauerspenden",
    status: "planned",
    weeks: generateWeeks("2023-09-01", "2023-10-15", 4, [3, 5])
  },
];

export const timeUnits = [
  { value: 'week', label: 'Woche' },
  { value: 'month', label: 'Monat' },
  { value: 'year', label: 'Jahr' },
];
