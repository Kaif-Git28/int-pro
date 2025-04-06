import { Machine, SystemHealth, ProductivityData, EnergyConsumptionData, MachineData, ApiSpindleData } from '../types';

// Generate mock machine data
export const generateData = (machineId: string): MachineData => {
  return {
    machineId,
    time: new Date().toISOString(),
    speed: Math.floor(Math.random() * 1500),
    temperature: 20 + Math.floor(Math.random() * 30),
    load: Math.floor(Math.random() * 100),
  };
};

// Generate historical data
export const generateHistoricalData = (count: number, machineId: string): MachineData[] => {
  const result: MachineData[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const time = new Date(now.getTime() - (i * 5 * 60 * 1000)); // 5 minute intervals
    result.unshift({
      machineId,
      time: time.toISOString(),
      speed: Math.floor(Math.random() * 1500),
      temperature: 20 + Math.floor(Math.random() * 30),
      load: Math.floor(Math.random() * 100),
    });
  }

  return result;
};

// Static mock data
export const systemHealthData: SystemHealth[] = [
  { name: 'Network', value: 98 },
  { name: 'Database', value: 87 },
  { name: 'Sensors', value: 94 },
  { name: 'Storage', value: 76 },
];

// Mock machine list
export const machineList: Machine[] = [
  { id: 'SPD-001', name: 'CNC Spindle 1', status: 'Running', lastMaintenance: '2023-02-15', health: 92 },
  { id: 'SPD-002', name: 'CNC Spindle 2', status: 'Idle', lastMaintenance: '2023-03-01', health: 87 },
  { id: 'SPD-003', name: 'Lathe Spindle 1', status: 'Warning', lastMaintenance: '2023-01-20', health: 67 },
  { id: 'SPD-004', name: 'Grinding Spindle', status: 'Running', lastMaintenance: '2023-02-28', health: 98 },
  { id: 'SPD-005', name: 'Boring Spindle', status: 'Maintenance', lastMaintenance: '2023-03-10', health: 45 },
];

export const productivityData: ProductivityData[] = [
  { name: 'Mon', actual: 78, target: 80 },
  { name: 'Tue', actual: 82, target: 80 },
  { name: 'Wed', actual: 79, target: 80 },
  { name: 'Thu', actual: 87, target: 80 },
  { name: 'Fri', actual: 84, target: 80 },
  { name: 'Sat', actual: 76, target: 75 },
  { name: 'Sun', actual: 70, target: 70 },
];

export const energyConsumptionData: EnergyConsumptionData[] = [
  { name: '00:00', consumption: 42 },
  { name: '04:00', consumption: 38 },
  { name: '08:00', consumption: 67 },
  { name: '12:00', consumption: 85 },
  { name: '16:00', consumption: 72 },
  { name: '20:00', consumption: 55 },
];

// Mock API response that matches the real API format
export const generateMockApiResponse = (): ApiSpindleData => {
  return {
    "HBL217": {
      "spindle_load_0": String(Math.floor(Math.random() * 30)),
      "spindle_speed_0": String(Math.floor(Math.random() * 500)),
      "spindle_temp_0": String(20 + Math.floor(Math.random() * 15))
    },
    "HD111": {
      "spindle_load_0": String(Math.floor(Math.random() * 30)),
      "spindle_speed_0": String(Math.floor(Math.random() * 500)),
      "spindle_temp_0": String(20 + Math.floor(Math.random() * 15))
    },
    "HD112": {
      "spindle_speed_0": String(Math.floor(Math.random() * 500)),
      "spindle_load_0": String(Math.floor(Math.random() * 30)),
      "spindle_temp_0": String(20 + Math.floor(Math.random() * 15))
    },
    "HD102": {
      "spindle_load_0": String(Math.floor(Math.random() * 30)),
      "spindle_speed_0": String(Math.floor(Math.random() * 500)),
      "spindle_temp_0": String(20 + Math.floor(Math.random() * 15))
    },
    "HD210": {
      "spindle_load_0": String(Math.floor(Math.random() * 30)),
      "spindle_speed_0": String(Math.floor(Math.random() * 500)),
      "spindle_temp_0": String(20 + Math.floor(Math.random() * 15))
    },
    "BK306": {
      "spindle_speed_0": String(800 + Math.floor(Math.random() * 500)),
      "spindle_load_0": String(Math.floor(Math.random() * 30)),
      "spindle_temp_0": String(20 + Math.floor(Math.random() * 15))
    },
    "BK307": {
      "spindle_speed_0": String(Math.floor(Math.random() * 500)),
      "spindle_load_0": String(Math.floor(Math.random() * 30)),
      "spindle_temp_0": String(20 + Math.floor(Math.random() * 15))
    }
  };
}; 