// Machine data types
export interface MachineData {
  machineId: string;
  time: string;
  speed: number;
  temperature: number;
  load: number;
  timeToFailure: number; // Time in hours until predicted failure
}

// API response type
export interface ApiSpindleData {
  [machineId: string]: {
    spindle_load_0: string | null;
    spindle_speed_0: string | null;
    spindle_temp_0: string | null;
  };
}

// Machine reset information
export interface MachineResetInfo {
  resetTime: string; // ISO timestamp of when the reset occurred
  expiresAfterDays: number; // Reset expires after this many days
}

export interface Machine {
  id: string;
  name: string;
  status: 'Running' | 'Idle' | 'Warning' | 'Maintenance';
  lastMaintenance: string;
  health: number;
}

export interface SystemHealth {
  name: string;
  value: number;
}

export interface ProductivityData {
  name: string;
  actual: number;
  target: number;
}

export interface EnergyConsumptionData {
  name: string;
  consumption: number;
}

// Component prop types
export interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export interface KPICardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: number;
}

export interface SpindleParametersProps {
  data: MachineData[];
  machineId: string;
}

export interface OEEChartProps {
  oeeValue: number;
}

export interface MachineStatusProps {
  onSelectMachine?: (machineId: string) => void;
}

export interface ReportsProps {
  machines: string[];
}

export interface MachineAlertsProps {
  machineId: string;
}

// Dashboard state type
export interface DashboardState {
  historicalData: MachineData[];
  oeeValue: number;
  uptime: number;
  machineFailureStatus: Record<string, number>; // Store failure days for each machine
  resetMachines: Record<string, MachineResetInfo>; // Track machines that have been reset with their reset time
  lastUpdateTime: string; // Track when the data was last updated for time-based calculations
} 