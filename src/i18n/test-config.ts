import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  debug: false,
  resources: {
    en: {
      translation: {
        errorTest: {
          title: 'Error Test Page',
          buttons: {
            reactCrash: 'React crash',
            jsError: 'JS error',
            unhandledRejection: 'Unhandled rejection',
            network: 'Network error',
            http: 'HTTP error',
          },
          reactComponentError: 'Component crashed',
          throwJsError: 'JS Error thrown',
          unhandledRejection: 'Unhandled rejection',
          networkError: 'Network error occurred',
          httpError: 'HTTP error',
          otherError: 'Other error',
        },
        errorBoundary: {
          title: 'Something went wrong.',
          description: 'An error occurred in this component.',
          toast: 'Application error',
        },
      },
    },
  },
});

export default i18n;
