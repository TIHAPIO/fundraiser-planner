// Mock Fundraisers
export const mockFundraisers = [
  {
    id: 1,
    name: "Max Mustermann",
    email: "max@example.com",
    phone: "+49 123 4567890",
    role: "Fundraiser",
    status: "active",
    experience: "2 years",
    availability: "Full-time",
    preferredRegions: ["Nord", "Ost"],
    notes: "Erfahrener Fundraiser mit guten Erfolgen"
  },
  // Add more fundraisers as needed
];

// Mock Accommodations
export const mockAccommodations = [
  {
    id: 1,
    name: "Hotel Sunshine",
    address: "Sonnenallee 123, 12345 Berlin",
    capacity: 10,
    checkIn: "14:00",
    checkOut: "11:00",
    contact: {
      name: "Anna Schmidt",
      email: "info@hotel-sunshine.de",
      phone: "+49 30 1234567"
    },
    amenities: ["WiFi", "Breakfast", "Parking"],
    notes: "Zentral gelegen, gute Verkehrsanbindung"
  },
  // Add more accommodations as needed
];

// Mock Vehicles
export const mockVehicles = [
  {
    id: 1,
    model: "VW Transporter",
    licensePlate: "B-RC 1234",
    capacity: 9,
    rentalCompany: "AutoRent Berlin",
    contact: {
      name: "Thomas Meyer",
      email: "info@autorent-berlin.de",
      phone: "+49 30 9876543"
    },
    features: ["GPS", "Air Conditioning", "Automatic"],
    notes: "Regelmäßig gewartet, guter Zustand"
  },
  // Add more vehicles as needed
];

// Mock Campaigns
export const mockCampaigns = [
  // 2023 Campaigns
  {
    id: 1,
    name: "Frühjahrskampagne Berlin-Mitte",
    startDate: "2023-03-05",
    endDate: "2023-04-30",
    capacity: 10,
    registeredFundraisers: 8,
    accommodation: 1,
    vehicle: 1,
    notes: "Fokus auf Innenstadtbereiche",
    fundraisers: [
      { id: 1, status: 'confirmed', lastStatusChange: '2023-02-15T10:00:00Z' },
      { id: 2, status: 'confirmed', lastStatusChange: '2023-02-15T11:00:00Z' },
    ]
  },
  {
    id: 2,
    name: "Frühsommer München",
    startDate: "2023-05-07",
    endDate: "2023-06-18",
    capacity: 12,
    registeredFundraisers: 11,
    accommodation: 1,
    vehicle: 1,
    notes: "Schwerpunkt Münchner Innenstadt",
    fundraisers: [
      { id: 3, status: 'confirmed', lastStatusChange: '2023-04-20T10:00:00Z' },
    ]
  },
  {
    id: 3,
    name: "Hamburg Hafenkampagne",
    startDate: "2023-06-04",
    endDate: "2023-07-16",
    capacity: 8,
    registeredFundraisers: 4,
    accommodation: null,
    vehicle: 1,
    notes: "Fokus auf Hafengebiet und Touristen",
    fundraisers: []
  },
  {
    id: 4,
    name: "Sommerkampagne Stuttgart",
    startDate: "2023-07-23",
    endDate: "2023-09-10",
    capacity: 15,
    registeredFundraisers: 12,
    accommodation: 1,
    vehicle: 1,
    notes: "Großkampagne in der Stuttgarter Region",
    fundraisers: []
  },
  {
    id: 5,
    name: "Herbstaktion Frankfurt",
    startDate: "2023-09-24",
    endDate: "2023-11-12",
    capacity: 10,
    registeredFundraisers: 9,
    accommodation: 1,
    vehicle: 1,
    notes: "Banken- und Geschäftsviertel",
    fundraisers: []
  },
  // 2024 Campaigns
  {
    id: 6,
    name: "Winterkampagne Berlin",
    startDate: "2024-01-07",
    endDate: "2024-02-25",
    capacity: 8,
    registeredFundraisers: 7,
    accommodation: 1,
    vehicle: 1,
    notes: "Fokus auf Indoor-Locations",
    fundraisers: [
      { id: 1, status: 'confirmed', lastStatusChange: '2023-12-15T10:00:00Z' },
    ]
  },
  {
    id: 7,
    name: "Frühjahr Köln-Bonn",
    startDate: "2024-02-18",
    endDate: "2024-03-31",
    capacity: 12,
    registeredFundraisers: 6,
    accommodation: null,
    vehicle: 1,
    notes: "Doppelregion mit Pendelverkehr",
    fundraisers: []
  },
  {
    id: 8,
    name: "Dresden Frühling",
    startDate: "2024-03-24",
    endDate: "2024-05-12",
    capacity: 10,
    registeredFundraisers: 8,
    accommodation: 1,
    vehicle: 1,
    notes: "Fokus auf Altstadt und Neustadt",
    fundraisers: []
  },
  {
    id: 9,
    name: "Leipzig Kultursommer",
    startDate: "2024-05-19",
    endDate: "2024-07-07",
    capacity: 15,
    registeredFundraisers: 5,
    accommodation: 1,
    vehicle: 1,
    notes: "Schwerpunkt auf Kulturveranstaltungen",
    fundraisers: []
  },
  {
    id: 10,
    name: "Hannover Messe-Special",
    startDate: "2024-06-02",
    endDate: "2024-07-14",
    capacity: 8,
    registeredFundraisers: 3,
    accommodation: null,
    vehicle: null,
    notes: "Koordiniert mit Messekalender",
    fundraisers: []
  },
  {
    id: 11,
    name: "Nordsee-Kampagne",
    startDate: "2024-07-21",
    endDate: "2024-09-08",
    capacity: 12,
    registeredFundraisers: 10,
    accommodation: 1,
    vehicle: 1,
    notes: "Touristische Hochsaison",
    fundraisers: []
  },
  {
    id: 12,
    name: "Herbst München-Süd",
    startDate: "2024-09-15",
    endDate: "2024-11-03",
    capacity: 10,
    registeredFundraisers: 4,
    accommodation: 1,
    vehicle: 1,
    notes: "Fokus auf südliche Stadtteile",
    fundraisers: []
  }
];

// Time Units for TimeUnitSelector
export const timeUnits = [
  { value: 'day', label: 'Tag' },
  { value: 'week', label: 'Woche' },
  { value: 'month', label: 'Monat' },
];

// Mock Change Requests
export const mockChangeRequests = [
  {
    id: 1,
    campaignId: 1,
    type: 'STATUS_CHANGE',
    status: 'pending', // pending, approved, rejected
    createdAt: '2024-01-15T10:00:00Z',
    requestedBy: 'Team Captain',
    data: {
      fundraiserId: 1,
      fromStatus: 'registered',
      toStatus: 'confirmed',
    },
  },
  {
    id: 2,
    campaignId: 1,
    type: 'RESOURCE_CHANGE',
    status: 'pending',
    createdAt: '2024-01-15T11:00:00Z',
    requestedBy: 'Team Captain',
    data: {
      resourceType: 'accommodation',
      fromId: 1,
      toId: 2,
    },
  },
  {
    id: 3,
    campaignId: 1,
    type: 'CAPACITY_CHANGE',
    status: 'pending',
    createdAt: '2024-01-15T12:00:00Z',
    requestedBy: 'Team Captain',
    data: {
      fromCapacity: 8,
      toCapacity: 10,
    },
  },
  {
    id: 4,
    campaignId: 1,
    type: 'DATE_CHANGE',
    status: 'pending',
    createdAt: '2024-01-15T13:00:00Z',
    requestedBy: 'Team Captain',
    data: {
      fromStartDate: '2024-01-02',
      fromEndDate: '2024-03-15',
      toStartDate: '2024-01-15',
      toEndDate: '2024-03-30',
    },
  },
];

// Helper function to create a new change request
export const createChangeRequest = (campaignId, type, data) => {
  const newRequest = {
    id: mockChangeRequests.length + 1,
    campaignId,
    type,
    status: 'pending',
    createdAt: new Date().toISOString(),
    requestedBy: 'Team Captain',
    data,
  };
  mockChangeRequests.push(newRequest);
  return newRequest;
};

// Helper function to update a change request status
export const updateChangeRequestStatus = (requestId, newStatus) => {
  const request = mockChangeRequests.find(r => r.id === requestId);
  if (request) {
    request.status = newStatus;
  }
  return request;
};

// Helper function to get pending change requests
export const getPendingChangeRequests = () => {
  return mockChangeRequests.filter(r => r.status === 'pending');
};

// Helper function to get change requests for a campaign
export const getCampaignChangeRequests = (campaignId) => {
  return mockChangeRequests.filter(r => r.campaignId === campaignId);
};
