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
  {
    id: 1,
    name: "Sommerkampagne 2024",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    capacity: 8,
    registeredFundraisers: 6,
    accommodation: 1,
    vehicle: 1,
    notes: "Fokus auf Innenstadtbereiche",
    fundraisers: [
      { id: 1, status: 'registered', lastStatusChange: '2024-01-15T10:00:00Z' },
      { id: 2, status: 'confirmed', lastStatusChange: '2024-01-15T11:00:00Z' },
      { id: 3, status: 'arrived', lastStatusChange: '2024-01-15T12:00:00Z' },
    ]
  },
  {
    id: 2,
    name: "Herbstkampagne 2024",
    startDate: "2024-09-15",
    endDate: "2024-11-30",
    capacity: 12,
    registeredFundraisers: 8,
    accommodation: null,
    vehicle: null,
    notes: "Schwerpunkt auf Neukunden",
    fundraisers: [
      { id: 4, status: 'registered', lastStatusChange: '2024-01-15T13:00:00Z' },
      { id: 5, status: 'confirmed', lastStatusChange: '2024-01-15T14:00:00Z' },
    ]
  },
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
