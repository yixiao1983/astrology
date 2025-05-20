import React from 'react';
import { useI18n } from '../contexts/I18nContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useI18n();
  
  return (
    <div className="flex justify-center space-x-4 mt-4">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-md ${language === 'en' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-200'}`}
      >
        English
      </button>
      <button
        onClick={() => setLanguage('zh')}
        className={`px-3 py-1 rounded-md ${language === 'zh' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-200'}`}
      >
        中文
      </button>
    </div>
  );
};

export default LanguageSwitcher;