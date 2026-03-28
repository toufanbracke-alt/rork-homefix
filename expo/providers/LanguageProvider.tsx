import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LanguageCode, DEFAULT_LANGUAGE } from "@/constants/languages";
import { translations } from "@/constants/translations";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => Promise<void>;
  t: (key: string, params?: Record<string, string>) => string;
  isLoading: boolean;
}

export const [LanguageProvider, useLanguage] = createContextHook<LanguageContextType>(() => {
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const stored = await AsyncStorage.getItem("language");
      if (stored && isValidLanguageCode(stored)) {
        setLanguageState(stored as LanguageCode);
      }
    } catch (error) {
      console.error("Error loading language:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setLanguage = useCallback(async (newLanguage: LanguageCode) => {
    if (!newLanguage || !isValidLanguageCode(newLanguage)) {
      console.error("Invalid language code:", newLanguage);
      return;
    }
    
    try {
      await AsyncStorage.setItem("language", newLanguage);
      setLanguageState(newLanguage);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  }, []);

  const t = useCallback((key: string, params?: Record<string, string>): string => {
    if (!key || typeof key !== 'string') {
      return key || '';
    }
    
    const translation = translations[language]?.[key] || translations[DEFAULT_LANGUAGE]?.[key] || key;
    
    if (params && typeof params === 'object') {
      return Object.entries(params).reduce(
        (text, [paramKey, paramValue]) => {
          if (typeof paramKey === 'string' && typeof paramValue === 'string') {
            return text.replace(`{{${paramKey}}}`, paramValue);
          }
          return text;
        },
        translation
      );
    }
    
    return translation;
  }, [language]);

  return useMemo(() => ({
    language,
    setLanguage,
    t,
    isLoading,
  }), [language, setLanguage, t, isLoading]);
});

function isValidLanguageCode(code: string): boolean {
  if (!code || typeof code !== 'string' || code.trim().length === 0) {
    return false;
  }
  return Object.keys(translations).includes(code.trim());
}