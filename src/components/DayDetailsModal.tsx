import React from 'react';
import { Aspect } from '../types/astrology';
import { getAspectConfig } from '../utils/astroCalculations';
import PlanetSymbol from './PlanetSymbol';

interface DayDetailsModalProps {
  date: Date;
  ephemerisData: any;
  onClose: () => void;
}

const DayDetailsModal: React.FC<DayDetailsModalProps> = ({ date, ephemerisData, onClose }) => {
  const dayData = ephemerisData.find((d: any) => 
    d.date.getDate() === date.getDate() && 
    d.date.getMonth() === date.getMonth() &&
    d.date.getFullYear() === date.getFullYear()
  );

  if (!dayData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {date.toLocaleDateString()} 天象详情
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* 天象相位 */}
          <div>
            <h3 className="text-lg font-medium mb-2">天象相位</h3>
            {dayData.aspects.length > 0 ? (
              <div className="space-y-2">
                {dayData.aspects.map((aspect: Aspect, i: number) => {
                  const config = getAspectConfig(aspect.type);
                  return (
                    <div 
                      key={`transit-${i}`}
                      className="p-3 rounded border-l-4"
                      style={{ borderColor: config.color }}
                    >
                      <div className="flex items-center">
                        <PlanetSymbol planet={aspect.planet1} size="md" />
                        <span className="mx-2 text-lg">{config.symbol}</span>
                        <PlanetSymbol planet={aspect.planet2} size="md" />
                        <span className="ml-auto text-sm text-gray-600">
                          {aspect.angle}° (容许度: {aspect.orb.toFixed(1)}°)
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {aspect.exact && <span className="text-yellow-500 mr-2">✦ 精确相位</span>}
                        {aspect.type}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">今日无重要天象相位</p>
            )}
          </div>

          {/* 本命盘相位 */}
          <div>
            <h3 className="text-lg font-medium mb-2">本命盘相位</h3>
            {dayData.natalAspects.length > 0 ? (
              <div className="space-y-2">
                {dayData.natalAspects.map((aspect: Aspect, i: number) => {
                  const config = getAspectConfig(aspect.type);
                  return (
                    <div 
                      key={`natal-${i}`}
                      className="p-3 rounded border-l-4 border-dashed"
                      style={{ borderColor: config.color }}
                    >
                      <div className="flex items-center">
                        <PlanetSymbol planet={aspect.planet1} size="md" />
                        <span className="mx-2 text-lg">{config.symbol}</span>
                        <PlanetSymbol planet={aspect.planet2} size="md" />
                        <span className="ml-auto text-sm text-gray-600">
                          {aspect.angle}° (容许度: {aspect.orb.toFixed(1)}°)
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {aspect.exact && <span className="text-yellow-500 mr-2">✦ 精确相位</span>}
                        {aspect.type}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">今日无重要本命盘相位</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayDetailsModal;