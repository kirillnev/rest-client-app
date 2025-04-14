import { RestRequest } from '@/types';

export const saveToHistory = (request: RestRequest) => {
  const key = 'rest-client-history';
  const history = JSON.parse(localStorage.getItem(key) || '[]');
  localStorage.setItem(key, JSON.stringify([request, ...history]));
};
