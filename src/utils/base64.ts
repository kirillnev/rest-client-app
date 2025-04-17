import { Base64 } from 'js-base64';

export const encodeBase64 = (str: string): string => Base64.encodeURI(str);
export const decodeBase64 = (str: string): string => Base64.decode(str);
