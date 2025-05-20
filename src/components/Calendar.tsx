import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { calculateEphemeris, calculateNatalAspects, getAspectConfig, calculatePlanetPositions } from '../utils/astroCalculations';
import { Planet, Aspect, AspectType } from '../types/astrology';
import { GeoLocation } from '../types/location';
import PlanetSymbol from './PlanetSymbol';
import AspectLegend from './AspectLegend';
import BirthChart from './BirthChart';
import DayDetailsModal from './DayDetailsModal';

const PLANETS: Planet[] = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];

interface AspectTypeInfo {
  angle: number;
  type: AspectType;
  name: string;
  symbol: string;
}

const ASPECT_TYPES: AspectTypeInfo[] = [
  { angle: 0, type: 'conjunction', name: 'Conjunction', symbol: '☌' },
  { angle: 60, type: 'sextile', name: 'Sextile', symbol: '⚹' },
  { angle: 90, type: 'square', name: 'Square', symbol: '□' },
  { angle: 120, type: 'trine', name: 'Trine', symbol: '△' },
  { angle: 180, type: 'opposition', name: 'Opposition', symbol: '☍' }
];

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedPlanets, setSelectedPlanets] = useState<Planet[]>(['sun', 'moon']);
  const [selectedAspects, setSelectedAspects] = useState<number[]>([0, 90, 180]);
  const [ephemerisData, setEphemerisData] = useState<any[]>([]);
  const [birthDate, setBirthDate] = useState<Date>(new Date('1990-01-01T12:00:00'));
  const [natalPlanets, setNatalPlanets] = useState<Planet[]>(['sun', 'moon']);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  useEffect(() => {
    const ephemeris = calculateEphemeris(monthStart, monthEnd, selectedPlanets);
    const natalPositions = calculatePlanetPositions(birthDate, natalPlanets);
    
    const data = ephemeris.map(day => ({
      ...day,
      natalAspects: calculateNatalAspects(
        natalPositions,
        day.positions,
        selectedAspects
      )
    }));
    
    setEphemerisData(data);
  }, [currentMonth, selectedPlanets, birthDate, natalPlanets, selectedAspects]);

  const handleBirthDataChange = (date: Date, planets: Planet[], location?: GeoLocation) => {
    setBirthDate(date);
    setNatalPlanets(planets);
    // 这里可以添加位置数据处理逻辑
    console.log('Location data:', location);
  };

  const togglePlanet = (planet: Planet) => {
    setSelectedPlanets(prev => 
      prev.includes(planet) 
        ? prev.filter(p => p !== planet)
        : [...prev, planet]
    );
  };

  const toggleAspect = (angle: number) => {
    setSelectedAspects(prev => 
      prev.includes(angle)
        ? prev.filter(a => a !== angle)
        : [...prev, angle]
    );
  };

  const filterAspects = (aspects: Aspect[]) => {
    return aspects.filter(aspect => selectedAspects.includes(aspect.angle));
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 侧边控制面板 */}
        <div className="lg:col-span-1 space-y-4">
          <BirthChart onBirthDataChange={handleBirthDataChange} />

          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
              <button 
                className="flex-1 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              >
                Previous
              </button>
              <button 
                className="flex-1 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              >
                Next
              </button>
            </div>
          </div>

          {/* 行星选择器 */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Select Planets:</h3>
            <div className="flex flex-wrap gap-2">
              {PLANETS.map(planet => (
                <button
                  key={planet}
                  onClick={() => togglePlanet(planet)}
                  className={`px-3 py-1 rounded-full text-sm flex items-center ${
                    selectedPlanets.includes(planet)
                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <PlanetSymbol planet={planet} size="sm" />
                  <span className="ml-1">{planet.charAt(0).toUpperCase() + planet.slice(1)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 相位选择器 */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Select Aspects:</h3>
            <div className="flex flex-wrap gap-2">
              {ASPECT_TYPES.map(aspect => {
                const config = getAspectConfig(aspect.type);
                return (
                  <button
                    key={aspect.angle}
                    onClick={() => toggleAspect(aspect.angle)}
                    className={`px-3 py-1 rounded-full text-sm flex items-center ${
                      selectedAspects.includes(aspect.angle)
                        ? 'bg-opacity-20 border'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                    style={selectedAspects.includes(aspect.angle) ? {
                      backgroundColor: `${config.color}20`,
                      borderColor: config.color
                    } : {}}
                  >
                    <span className="mr-1">{aspect.symbol}</span>
                    <span>{aspect.angle}°</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 图例 */}
          <AspectLegend />
        </div>

        {/* 主日历区域 */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}

              {monthDays.map(day => {
                const dayData = ephemerisData.find(d => isSameMonth(d.date, currentMonth) && 
                  d.date.getDate() === day.getDate());
                const aspects = dayData?.aspects || [];
                const natalAspects = dayData?.natalAspects || [];
                
                return (
                  <div 
                    key={day.toString()}
                    className={`p-2 h-28 border rounded-md cursor-pointer ${
                      isSameMonth(day, currentMonth) ? 'bg-white' : 'bg-gray-50'
                    }`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="text-right text-sm mb-1">
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-1 max-h-20 overflow-y-auto">
                      {/* 显示天象相位 */}
                      {filterAspects(aspects).map((aspect: Aspect, i: number) => {
                        const config = getAspectConfig(aspect.type);
                        const aspectType = ASPECT_TYPES.find(t => t.angle === aspect.angle);
                        
                        return (
                          <div 
                            key={`transit-${i}`}
                            className={`text-xs p-1 rounded flex items-center justify-between group hover:shadow-sm transition-all`}
                            style={{ 
                              backgroundColor: `${config.color}20`,
                              borderLeft: `2px solid ${config.color}`
                            }}
                            title={`${aspect.planet1.toUpperCase()} ${aspectType?.symbol || ''} ${aspect.planet2.toUpperCase()}
Angle: ${aspect.angle}°
Orb: ${aspect.orb.toFixed(1)}°
Type: ${aspect.type}
Exact: ${aspect.exact ? 'Yes' : 'No'}`}
                          >
                            <div className="flex items-center min-w-0">
                              <PlanetSymbol planet={aspect.planet1} size="sm" />
                              <span className="mx-1 text-base">{aspectType?.symbol}</span>
                              <PlanetSymbol planet={aspect.planet2} size="sm" />
                            </div>
                            <div className="flex items-center ml-1 text-gray-500">
                              <span className="text-[10px] tabular-nums">
                                {aspect.orb > 0 ? '+' : ''}{aspect.orb.toFixed(1)}°
                              </span>
                              {aspect.exact && (
                                <span className="ml-1 text-yellow-500">✦</span>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* 显示本命盘相位 */}
                      {filterAspects(natalAspects).map((aspect: Aspect, i: number) => {
                        const config = getAspectConfig(aspect.type);
                        const aspectType = ASPECT_TYPES.find(t => t.angle === aspect.angle);
                        
                        return (
                          <div 
                            key={`natal-${i}`}
                            className={`text-xs p-1 rounded flex items-center justify-between group hover:shadow-sm transition-all`}
                            style={{ 
                              backgroundColor: `${config.color}10`,
                              borderLeft: `2px dashed ${config.color}`
                            }}
                            title={`${aspect.planet1.toUpperCase()} ${aspectType?.symbol || ''} ${aspect.planet2.toUpperCase()}
Angle: ${aspect.angle}°
Orb: ${aspect.orb.toFixed(1)}°
Type: ${aspect.type}
Exact: ${aspect.exact ? 'Yes' : 'No'}`}
                          >
                            <div className="flex items-center min-w-0">
                              <PlanetSymbol planet={aspect.planet1} size="sm" />
                              <span className="mx-1 text-base">{aspectType?.symbol}</span>
                              <PlanetSymbol planet={aspect.planet2} size="sm" />
                            </div>
                            <div className="flex items-center ml-1 text-gray-500">
                              <span className="text-[10px] tabular-nums">
                                {aspect.orb > 0 ? '+' : ''}{aspect.orb.toFixed(1)}°
                              </span>
                              {aspect.exact && (
                                <span className="ml-1 text-yellow-500">✦</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {selectedDate && (
        <DayDetailsModal 
          date={selectedDate}
          ephemerisData={ephemerisData}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
};

export default Calendar;