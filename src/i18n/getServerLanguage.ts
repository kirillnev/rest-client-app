// src/i18n/getServerLanguage.ts
import { cookies } from 'next/headers';

export async function getServerLanguage(
  defaultLang: string = 'en'
): Promise<string> {
  const cookieStore = await cookies();
  const lng = cookieStore.get('i18nextLng')?.value;

  const supportedLngs = ['en', 'ru', 'de'];
  return lng && supportedLngs.includes(lng) ? lng : defaultLang;
}
