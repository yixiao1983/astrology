import React from 'react';
import { Planet } from '../types/astrology';

interface PlanetSymbolProps {
  planet: Planet;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const PLANET_SYMBOLS: Record<Planet, string> = {
  sun: '☉',
  moon: '☽',
  mercury: '☿',
  venus: '♀',
  mars: '♂',
  jupiter: '♃',
  saturn: '♄',
  uranus: '⛢',
  neptune: '♆',
  pluto: '♇'
};

const PLANET_COLORS: Record<Planet, string> = {
  sun: '#FFB300',
  moon: '#90A4AE',
  mercury: '#7E57C2',
  venus: '#26A69A',
  mars: '#EF5350',
  jupiter: '#5C6BC0',
  saturn: '#8D6E63',
  uranus: '#42A5F5',
  neptune: '#26C6DA',
  pluto: '#78909C'
};

const PlanetSymbol: React.FC<PlanetSymbolProps> = ({ 
  planet, 
  size = 'md',
  showLabel = false 
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <span 
      className={`inline-flex items-center ${sizeClasses[size]}`}
      style={{ color: PLANET_COLORS[planet] }}
      title={planet.charAt(0).toUpperCase() + planet.slice(1)}
    >
      <span className="font-symbols">{PLANET_SYMBOLS[planet]}</span>
      {showLabel && (
        <span className="ml-1 text-gray-600 text-sm">
          {planet.charAt(0).toUpperCase() + planet.slice(1)}
        </span>
      )}
    </span>
  );
};

export default PlanetSymbol;