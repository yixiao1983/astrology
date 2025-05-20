import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Planet, PlanetPosition } from '../types/astrology';
import { GeoLocation, commonTimezones } from '../types/location';
import PlanetSymbol from './PlanetSymbol';
import { calculatePlanetPositions } from '../utils/astroCalculations';
import { getPlanetPositions } from '../services/astroService';
import { useI18n } from '../contexts/I18nContext';

interface BirthChartProps {
  onBirthDataChange: (
    birthDate: Date, 
    selectedPlanets: Planet[],
    location?: GeoLocation
  ) => void;
}

const BirthChart: React.FC<BirthChartProps> = ({ onBirthDataChange }) => {
  const [birthDate, setBirthDate] = useState<Date>(() => {
    // 确保日期有效，否则使用当前日期
    const defaultDate = new Date('1990-01-01T12:00:00');
    return isNaN(defaultDate.getTime()) ? new Date() : defaultDate;
  });
  const [selectedPlanets, setSelectedPlanets] = useState<Planet[]>(['sun', 'moon']);
  const [location, setLocation] = useState<GeoLocation>({
    city: '',
    country: '',
    timezone: 'UTC',
    latitude: 0,
    longitude: 0
  });
  
  const PLANETS: Planet[] = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    // 检查日期是否有效
    if (!isNaN(newDate.getTime())) {
      setBirthDate(newDate);
      onBirthDataChange(newDate, selectedPlanets, location);
    } else {
      // 如果无效，使用当前日期作为回退
      const fallbackDate = new Date();
      setBirthDate(fallbackDate);
      onBirthDataChange(fallbackDate, selectedPlanets, location);
    }
  };

  useEffect(() => {
    // 当位置变化时更新数据
    onBirthDataChange(birthDate, selectedPlanets, location);
  }, [location]);
  
  const togglePlanet = (planet: Planet) => {
    const newSelection = selectedPlanets.includes(planet)
      ? selectedPlanets.filter(p => p !== planet)
      : [...selectedPlanets, planet];
    
    setSelectedPlanets(newSelection);
    onBirthDataChange(birthDate, newSelection);
  };
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [birthChartPositions, setBirthChartPositions] = useState<PlanetPosition[]>([]);

  useEffect(() => {
    if (!isNaN(birthDate.getTime()) && location.city) {
      setLoading(true);
      setError(null);
      
      getPlanetPositions(birthDate, location)
        .then(positions => {
          setBirthChartPositions(positions);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError('无法获取行星位置，使用简化计算');
          setBirthChartPositions(calculatePlanetPositions(birthDate, PLANETS));
          setLoading(false);
        });
    }
  }, [birthDate, location]);
  
  const { t } = useI18n();

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-medium text-gray-800 mb-3">{t.birthChart.title}</h3>
      
      {/* 出生地点和时间 */}
      <div className="space-y-4 mb-4">
        {/* 出生日期选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.birthChart.dateTime}
          </label>
          <input
            type="datetime-local"
            value={!isNaN(birthDate.getTime()) ? format(birthDate, "yyyy-MM-dd'T'HH:mm") : format(new Date(), "yyyy-MM-dd'T'HH:mm")}
            onChange={handleDateChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* 出生城市 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.birthChart.city}
          </label>
          <input
            type="text"
            value={location.city}
            onChange={(e) => setLocation({...location, city: e.target.value})}
            placeholder={t.birthChart.city}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* 时区选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.birthChart.timezone}
          </label>
          <select
            value={location.timezone}
            onChange={(e) => setLocation({...location, timezone: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {commonTimezones.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* 本命盘行星选择 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t.birthChart.planets}
        </label>
        <div className="flex flex-wrap gap-2">
          {PLANETS.map(planet => (
            <button
              key={planet}
              onClick={() => togglePlanet(planet)}
              className={`px-3 py-1 rounded-full text-sm flex items-center ${
                selectedPlanets.includes(planet)
                  ? 'bg-purple-100 text-purple-800 border border-purple-300'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <PlanetSymbol planet={planet} size="sm" />
              <span className="ml-1">{planet.charAt(0).toUpperCase() + planet.slice(1)}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* 本命盘行星位置显示 */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">本命盘行星位置:</h4>
        <div className="bg-gray-50 p-3 rounded-md max-h-48 overflow-y-auto">
          {loading && (
            <div className="text-center py-4 text-gray-500">
              {t.birthChart.loading}
            </div>
          )}
          {error && (
            <div className="text-red-500 text-sm mb-2">{error}</div>
          )}
          {!loading && birthChartPositions.map(position => (
            <div key={position.planet} className="flex justify-between items-center mb-1 text-sm">
              <div className="flex items-center">
                <PlanetSymbol planet={position.planet} size="sm" />
                <span className="ml-1">{position.planet.charAt(0).toUpperCase() + position.planet.slice(1)}</span>
              </div>
              <span className="font-mono">
                {Math.floor(position.longitude)}°{Math.floor((position.longitude % 1) * 60)}′
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BirthChart;