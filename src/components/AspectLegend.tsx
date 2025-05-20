import React from 'react';
import { getAspectConfig } from '../utils/astroCalculations';
import { AspectType } from '../types/astrology';

interface AspectTypeInfo {
  angle: number;
  type: AspectType;
  name: string;
  symbol: string;
  description: string;
}

const ASPECT_TYPES: AspectTypeInfo[] = [
  { 
    angle: 0, 
    type: 'conjunction',
    name: 'Conjunction', 
    symbol: '☌',
    description: 'Planets in the same position, energies blend and intensify'
  },
  { 
    angle: 60, 
    type: 'sextile',
    name: 'Sextile', 
    symbol: '⚹',
    description: 'Harmonious aspect representing opportunity and ease'
  },
  { 
    angle: 90, 
    type: 'square',
    name: 'Square', 
    symbol: '□',
    description: 'Challenging aspect representing tension and growth'
  },
  { 
    angle: 120, 
    type: 'trine',
    name: 'Trine', 
    symbol: '△',
    description: 'Flowing aspect representing harmony and natural talents'
  },
  { 
    angle: 180, 
    type: 'opposition',
    name: 'Opposition', 
    symbol: '☍',
    description: 'Planets facing each other, representing balance and awareness'
  }
];

const AspectLegend: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Aspect Legend:</h3>
      <div className="space-y-2">
        {ASPECT_TYPES.map(aspect => {
          const config = getAspectConfig(aspect.type);
          
          return (
            <div key={aspect.angle} className="flex items-start">
              <div 
                className="flex items-center justify-center w-6 h-6 rounded-full mr-2 flex-shrink-0"
                style={{ backgroundColor: `${config.color}30` }}
              >
                <span className="text-lg" style={{ color: config.color }}>
                  {aspect.symbol}
                </span>
              </div>
              <div>
                <div className="flex items-center">
                  <span className="font-medium text-sm">{aspect.name}</span>
                  <span className="text-xs text-gray-500 ml-2">{aspect.angle}°</span>
                </div>
                <p className="text-xs text-gray-600">{aspect.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AspectLegend;