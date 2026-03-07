
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Language } from './types';
import { translations, getTranslation } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('vi'); // Default to Vietnamese

  const t = (path: string, params?: Record<string, string | number>): string => {
    const keys = path.split('.');
    let current: any = getTranslation(language);
    
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        console.warn(`Translation missing for key: ${path} in ${language}`);
        return path;
      }
    }
    
    let result = typeof current === 'string' ? current : path;
    
    if (params && typeof result === 'string') {
        Object.keys(params).forEach(key => {
            result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(params[key]));
        });
    }
    
    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
