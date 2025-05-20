import React, { createContext, useContext, useState } from 'react';
import en from '../i18n/en.json';
import zh from '../i18n/zh.json';

type Translations = typeof en;
type Language = 'en' | 'zh';

interface I18nContextType {
  t: Translations;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextType>({
  t: en,
  language: 'en',
  setLanguage: () => {}
});

const translations = {
  en,
  zh
};

export const I18nProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const t = translations[language];

  return (
    <I18nContext.Provider value={{ t, language, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);