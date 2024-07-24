import axios from 'axios';

const DEFAULT_BASE_URL = 'https://rickandmortyapi.com/api';
export const DEFAULT_BASE_LOCATION_URL = `${DEFAULT_BASE_URL}/location`;

const api = axios.create({
  baseURL: DEFAULT_BASE_URL,
});

export const fetchCharacters = async (
  page: number = 1,
  status: string | undefined,
) => {
  let url = `/character/?page=${page}`;

  if (status) {
    url += `&status=${status}`;
  }

  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching characters from api:', error);
  }
};

export const fetchLocations = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching locations from api:', error);
  }
};
