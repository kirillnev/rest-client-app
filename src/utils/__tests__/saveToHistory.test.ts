import { saveToHistory } from '../saveToHistory';
import { RestRequest } from '@/types';

describe('saveToHistory', () => {
  const key = 'rest-client-history';

  const sampleRequest: RestRequest = {
    method: 'GET',
    url: 'https://example.com',
    headers: [],
    body: '',
    bodyType: 'text',
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
    const oldRequest: RestRequest = {
      method: 'POST',
      url: 'https://old.com',
      headers: [],
      body: '',
      bodyType: 'json',
    };

    localStorage.setItem(key, JSON.stringify([oldRequest]));
    saveToHistory(sampleRequest);

    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    expect(saved).toEqual([sampleRequest, oldRequest]);
  });
});
