import { fetchAPI, fetchAPIWithFiles } from "./fetch";

// Create new pin
export const createPinNew = async (
  name: string,
  description: string,
  date: Date,
  tag: string,
  longitude: number,
  latitude: number,
  imageUri?: string | null,
  setUserToken?: (token: string | null) => void
) => {
  const data = {
    name,
    description,
    date: date.toISOString().split("T")[0],
    tag,
    longitude,
    latitude,
    images: imageUri ? [imageUri] : []
  };

  return fetchAPIWithFiles('/pins/pinnew', 'POST', data, setUserToken);
};

// Fetch all pins
export const getAllPinsNew = async (setUserToken: (token: string | null) => void) => {
  return fetchAPI('/pins/pinnew', 'GET', null, setUserToken);
};

// Delete pin
export const deletePinNew = async (
  pinId: number,
  setUserToken?: (token: string | null) => void
) => {
  if (!pinId || isNaN(pinId)) {
    throw new Error(`Invalid pin ID: ${pinId}`);
  }
  return fetchAPI(`/pins/pinnew?pin_id=${pinId}`, 'DELETE', null, setUserToken);
};

// Update pin
export const updatePinNew = async (
  pinId: number,
  name: string,
  text_description: string,
  dateBegin: Date,
  label: string,
  longitude: number,
  latitude: number,
  setUserToken?: (token: string | null) => void
) => {
  if (!pinId || isNaN(pinId)) {
    console.error(`Invalid pin ID: ${pinId}`);
    throw new Error(`Invalid pin ID: ${pinId}`);
  }

  return fetchAPI(
    `/pins/pinnew?pin_id=${pinId}`,
    'PUT',
    {
      name,
      text_description,
      dateBegin,
      label,
      longitude,
      latitude,
    },
    setUserToken
  );
};
