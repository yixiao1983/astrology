import React from 'react';
import { I18nProvider } from './contexts/I18nContext';
import Calendar from './components/Calendar';
import LanguageSwitcher from './components/LanguageSwitcher';
import './index.css';

const App: React.FC = () => {
  return (
    <I18nProvider>
      <div className="min-h-screen bg-gray-100 p-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center text-indigo-800">
            Astrology Ephemeris
          </h1>
          <LanguageSwitcher />
        </header>
        <main>
          <Calendar />
        </main>
      </div>
    </I18nProvider>
  );
};

export default App;