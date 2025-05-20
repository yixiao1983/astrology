import { eachDayOfInterval, isSameDay } from 'date-fns';
import { GeoLocation } from '../types/location';
import { Planet, PlanetPosition, Aspect, AspectType, EphemerisData } from '../types/astrology';

interface AspectConfig {
  color: string;
  symbol: string;
}

// 行星轨道周期(天) - 简化模型
const ORBITAL_PERIODS: Record<Planet, number> = {
  sun: 0,        // 地心模型，太阳位置实际是地球位置
  moon: 27.3,    
  mercury: 88,
  venus: 224.7,
  mars: 687,
  jupiter: 4331,
  saturn: 10747,
  uranus: 30589,
  neptune: 59800,
  pluto: 90560
};

// 行星初始经度(简化模型)
const INITIAL_POSITIONS: Record<Planet, number> = {
  sun: 0,
  moon: 45,
  mercury: 120,
  venus: 30,
  mars: 300,
  jupiter: 150,
  saturn: 240,
  uranus: 60,
  neptune: 180,
  pluto: 90
};

// 相位容许度
const ORBS = {
  conjunction: 8,
  sextile: 4,
  square: 6,
  trine: 6,
  opposition: 8
};

// 计算指定日期范围内星历数据
export function calculateEphemeris(
  startDate: Date,
  endDate: Date,
  selectedPlanets: Planet[] = ['sun', 'moon']
): EphemerisData[] {
  const dates = eachDayOfInterval({ start: startDate, end: endDate });
  
  return dates.map(date => ({
    date,
    positions: calculatePlanetPositions(date, selectedPlanets),
    aspects: calculateAspects(date, selectedPlanets)
  }));
}

// 计算行星位置
export function calculatePlanetPositions(
  date: Date, 
  planets: Planet[],
  location?: GeoLocation
): PlanetPosition[] {
  // 考虑时区偏移
  const timezoneOffset = location?.timezone ? 
    getTimezoneOffset(location.timezone, date) : 0;
  
  // 调整本地时间为UTC
  const utcDate = new Date(date.getTime() + timezoneOffset * 60 * 1000);
  
  // 简化模型：假设圆形轨道，匀速运动
  const baseDate = new Date(2000, 0, 1); // 参考日期
  const daysElapsed = (utcDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24);
  
  return planets.map(planet => {
    const period = ORBITAL_PERIODS[planet];
    const degreesPerDay = 360 / period;
    const longitude = (INITIAL_POSITIONS[planet] + daysElapsed * degreesPerDay) % 360;
    
    return {
      planet,
      longitude,
      latitude: 0, // 简化模型忽略纬度
      distance: 1  // 简化距离
    };
  });
}

// 计算行星相位
function calculateAspects(date: Date, planets: Planet[]): Aspect[] {
  const positions = calculatePlanetPositions(date, planets);
  const aspects: Aspect[] = [];
  
  // 检查所有行星组合
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const p1 = positions[i];
      const p2 = positions[j];
      const angle = Math.abs(p1.longitude - p2.longitude);
      const separation = Math.min(angle, 360 - angle);
      
      // 检查主要相位
      if (separation <= ORBS.conjunction) {
        aspects.push(createAspect(p1.planet, p2.planet, 0, 'conjunction', separation));
      } else if (Math.abs(separation - 60) <= ORBS.sextile) {
        aspects.push(createAspect(p1.planet, p2.planet, 60, 'sextile', separation - 60));
      } else if (Math.abs(separation - 90) <= ORBS.square) {
        aspects.push(createAspect(p1.planet, p2.planet, 90, 'square', separation - 90));
      } else if (Math.abs(separation - 120) <= ORBS.trine) {
        aspects.push(createAspect(p1.planet, p2.planet, 120, 'trine', separation - 120));
      } else if (Math.abs(separation - 180) <= ORBS.opposition) {
        aspects.push(createAspect(p1.planet, p2.planet, 180, 'opposition', separation - 180));
      }
    }
  }
  
  return aspects;
}

function createAspect(
  planet1: Planet,
  planet2: Planet,
  angle: number,
  type: Aspect['type'],
  orb: number
): Aspect {
  return {
    planet1,
    planet2,
    angle,
    type,
    orb: Math.abs(orb),
    exact: orb === 0
  };
}

// 相位配置映射
const ASPECT_CONFIGS: Record<AspectType, AspectConfig> = {
  conjunction: { color: 'yellow', symbol: '☌' },
  sextile: { color: 'blue', symbol: '⚹' },
  square: { color: 'red', symbol: '□' },
  trine: { color: 'green', symbol: '△' },
  opposition: { color: 'purple', symbol: '☍' }
};

// 获取时区偏移（分钟）
function getTimezoneOffset(timezone: string, date: Date): number {
  // 简化实现 - 实际应用中应该使用更完整的时区库
  const utcOffset = date.getTimezoneOffset();
  const timezoneOffsets: Record<string, number> = {
    'UTC': 0,
    'America/New_York': 300, // EST: UTC-5
    'America/Los_Angeles': 480, // PST: UTC-8
    'Europe/London': 0, // GMT: UTC+0
    'Europe/Paris': -60, // CET: UTC+1
    'Asia/Tokyo': -540, // JST: UTC+9
    'Asia/Shanghai': -480, // CST: UTC+8
    'Australia/Sydney': -600 // AEST: UTC+10
  };
  
  return timezoneOffsets[timezone] ?? utcOffset;
}

// 获取相位显示配置
export function getAspectConfig(type: AspectType): AspectConfig {
  return ASPECT_CONFIGS[type];
}

// 计算本命盘与天象的相位
export function calculateNatalAspects(
  natalPositions: PlanetPosition[],
  transitPositions: PlanetPosition[],
  selectedAspects: number[]
): Aspect[] {
  const aspects: Aspect[] = [];
  
  // 检查所有本命盘行星与天象行星的组合
  for (const natal of natalPositions) {
    for (const transit of transitPositions) {
      const angle = Math.abs(natal.longitude - transit.longitude);
      const separation = Math.min(angle, 360 - angle);
      
      // 检查主要相位
      if (selectedAspects.includes(0) && separation <= ORBS.conjunction) {
        aspects.push(createAspect(natal.planet, transit.planet, 0, 'conjunction', separation));
      } else if (selectedAspects.includes(60) && Math.abs(separation - 60) <= ORBS.sextile) {
        aspects.push(createAspect(natal.planet, transit.planet, 60, 'sextile', separation - 60));
      } else if (selectedAspects.includes(90) && Math.abs(separation - 90) <= ORBS.square) {
        aspects.push(createAspect(natal.planet, transit.planet, 90, 'square', separation - 90));
      } else if (selectedAspects.includes(120) && Math.abs(separation - 120) <= ORBS.trine) {
        aspects.push(createAspect(natal.planet, transit.planet, 120, 'trine', separation - 120));
      } else if (selectedAspects.includes(180) && Math.abs(separation - 180) <= ORBS.opposition) {
        aspects.push(createAspect(natal.planet, transit.planet, 180, 'opposition', separation - 180));
      }
    }
  }
  
  return aspects;
}