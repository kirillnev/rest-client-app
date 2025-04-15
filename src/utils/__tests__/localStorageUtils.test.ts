import { saveToHistory } from '../localStorageUtils';
import { HistoryItem } from '@/types';

describe('saveToHistory', () => {
  const key = 'rest-client-history';

  const sampleRequest: HistoryItem = {
    method: 'GET',
    url: 'https://example.com',
    headers: [],
    body: '',
    bodyType: 'text',
    createdAt: 1744732114113,
  };

  beforeEach(() => {
    localStorage.clear();
  });

  test('saves new request to history', () => {
    saveToHistory(sampleRequest);

    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    expect(saved).toEqual([sampleRequest]);
  });

  test('prepends request to existing history', () => {
    const oldRequest: HistoryItem = {
      method: 'POST',
      url: 'https://old.com',
      headers: [],
      body: '',
      bodyType: 'json',
      createdAt: 1744732114113,
    };

    localStorage.setItem(key, JSON.stringify([oldRequest]));
    saveToHistory(sampleRequest);

    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    expect(saved).toEqual([sampleRequest, oldRequest]);
  });
});
