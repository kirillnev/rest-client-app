import { GET } from '../route';
import { parseRequest, sendRequest } from '@/utils/requestUtils';
import { NextRequest, NextResponse } from 'next/server';

jest.mock('@/utils/requestUtils', () => ({
  parseRequest: jest.fn(),
  sendRequest: jest.fn(),
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

const createMockNextRequest = () =>
  ({
    nextUrl: {
      pathname: '/api/proxy/GET/some-url',
      searchParams: new URLSearchParams(),
    },
  }) as unknown as NextRequest;

beforeEach(() => {
  jest.clearAllMocks();
});

test('returns 400 if request is invalid', async () => {
  (parseRequest as jest.Mock).mockReturnValue(null);
  const req = createMockNextRequest();

  await GET(req);

  expect(NextResponse.json).toHaveBeenCalledWith(
    { error: 'Invalid request' },
    { status: 400 }
  );
});

test('returns result if request is valid', async () => {
  const mockParsed = {
    method: 'GET',
    url: 'https://api.com',
    headers: [],
    body: '',
    bodyType: 'text',
  };
  const mockResponse = { status: 200, body: 'ok' };

  (parseRequest as jest.Mock).mockReturnValue(mockParsed);
  (sendRequest as jest.Mock).mockResolvedValue(mockResponse);
  const req = createMockNextRequest();

  await GET(req);

  expect(sendRequest).toHaveBeenCalledWith(mockParsed);
  expect(NextResponse.json).toHaveBeenCalledWith(mockResponse);
});

test('returns 500 if sendRequest throws', async () => {
  const mockParsed = {
    method: 'GET',
    url: 'https://api.com',
    headers: [],
    body: '',
    bodyType: 'text',
  };

  (parseRequest as jest.Mock).mockReturnValue(mockParsed);
  (sendRequest as jest.Mock).mockRejectedValue(new Error('fail'));

  const req = {
    nextUrl: { pathname: '', searchParams: new URLSearchParams() },
  } as unknown as NextRequest;

  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

  await GET(req);

  expect(NextResponse.json).toHaveBeenCalledWith(
    { error: 'fail' },
    { status: 500 }
  );

  consoleErrorSpy.mockRestore();
});
