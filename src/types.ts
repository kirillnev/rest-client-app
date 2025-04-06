export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type RequestHeader = {
  key: string;
  value: string;
};

export type RestRequest = {
  method: HttpMethod;
  url: string;
  headers: RequestHeader[];
  body: string;
  bodyType: 'json' | 'text';
};
