import { EmissionSource } from '../types';

export const emissionSources: EmissionSource[] = [
  {
    id: 'electricity',
    name: 'Electricity',
    icon: 'Zap',
    factor: 0.4, // kg CO2 per kWh
    unit: 'kWh'
  },
  {
    id: 'car',
    name: 'Car Travel',
    icon: 'Car',
    factor: 0.2, // kg CO2 per km
    unit: 'km'
  },
  {
    id: 'flight',
    name: 'Air Travel',
    icon: 'Plane',
    factor: 0.2, // kg CO2 per km
    unit: 'km'
  },
  {
    id: 'meat',
    name: 'Meat Consumption',
    icon: 'Beef',
    factor: 6.0, // kg CO2 per kg
    unit: 'kg'
  },
  {
    id: 'waste',
    name: 'Waste',
    icon: 'Trash2',
    factor: 0.5, // kg CO2 per kg
    unit: 'kg'
  }
];