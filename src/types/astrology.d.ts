declare module 'astrology-types' {
  export type Planet = 
    'sun' | 'moon' | 'mercury' | 'venus' | 'mars' | 
    'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto';

  export interface PlanetPosition {
    planet: Planet;
    longitude: number; // 黄道经度(0-360度)
    latitude: number;  // 黄道纬度
    distance: number; // 距离(天文单位)
  }

  export interface Aspect {
    planet1: Planet;
    planet2: Planet;
    angle: number; // 相位角度(0-360)
    type: 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';
    orb: number;    // 容许度
    exact: boolean; // 是否精确相位
  }

  export interface EphemerisData {
    date: Date;
    positions: PlanetPosition[];
    aspects: Aspect[];
  }
}