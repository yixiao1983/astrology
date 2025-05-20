import axios from 'axios';
import { format } from 'date-fns';
import { GeoLocation } from '../types/location';
import { Planet, PlanetPosition } from '../types/astrology';

const API_URL = 'https://api.astroapi.com/v1';

interface ChartRequest {
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export async function getPlanetPositions(
  date: Date,
  location: GeoLocation
): Promise<PlanetPosition[]> {
  try {
    interface ChartResponse {
      positions: Array<{
        planet: string;
        longitude: number;
        latitude?: number;
        distance?: number;
      }>;
    }

    const response = await axios.post<ChartResponse>(`${API_URL}/chart`, {
      date: format(date, 'yyyy-MM-dd'),
      time: format(date, 'HH:mm:ss'),
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: location.timezone
    } as ChartRequest);

    const data = response.data as ChartResponse;
    // 验证行星名称是否为有效的Planet类型
    const planetNames: Planet[] = ['sun', 'moon', 'mercury', 'venus', 'mars', 
                                 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
    
    return data.positions
      .filter(pos => planetNames.includes(pos.planet.toLowerCase() as Planet))
      .map((pos) => ({
        planet: pos.planet.toLowerCase() as Planet,
        longitude: pos.longitude,
        latitude: pos.latitude || 0,
        distance: pos.distance || 1
      }));
  } catch (error) {
    console.error('Error fetching planet positions:', error);
    throw new Error('Failed to get planet positions');
  }
}