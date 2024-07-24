import axios from 'axios';

const api = axios.create({
  baseURL: 'https://rickandmortyapi.com/api',
});

export const fetchCharacters = async (page: number = 1) => {
  let url = `/character/?page=${page}`;

  const response = await api.get(url);
  return response.data;
};
