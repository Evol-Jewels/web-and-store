/**
 * Mock PIN code to city/state mapping
 * In production, this would come from a backend API
 */

export interface PinCodeData {
  city: string;
  state: string;
}

const pinCodeMap: Record<string, PinCodeData> = {
  "500034": { city: "Hyderabad", state: "Telangana" },
  "500001": { city: "Hyderabad", state: "Telangana" },
  "500080": { city: "Hyderabad", state: "Telangana" },
  "400001": { city: "Mumbai", state: "Maharashtra" },
  "400026": { city: "Mumbai", state: "Maharashtra" },
  "400039": { city: "Mumbai", state: "Maharashtra" },
  "110001": { city: "New Delhi", state: "Delhi" },
  "110016": { city: "New Delhi", state: "Delhi" },
  "110017": { city: "New Delhi", state: "Delhi" },
  "560001": { city: "Bangalore", state: "Karnataka" },
  "560034": { city: "Bangalore", state: "Karnataka" },
  "560076": { city: "Bangalore", state: "Karnataka" },
  "700001": { city: "Kolkata", state: "West Bengal" },
  "700007": { city: "Kolkata", state: "West Bengal" },
  "700020": { city: "Kolkata", state: "West Bengal" },
};

export function getPinCodeData(pinCode: string): PinCodeData | null {
  return pinCodeMap[pinCode] || null;
}

// Indian states list
export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
];
