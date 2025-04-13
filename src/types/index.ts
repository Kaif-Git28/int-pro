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

export interface Machine {
  id: string;
  name: string;
  status: 'Running' | 'Idle' | 'Warning' | 'Maintenance';
  lastMaintenance: string;
  health: number;
}

export interface Alert {
  id: number;
  type: string;
  time: string;
  machine: string;
  severity: 'warning' | 'critical';
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
  alerts: Alert[];
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

export interface AlertsProps {
  alerts: Alert[];
}

export interface MachineStatusProps {
  onSelectMachine?: (machineId: string) => void;
}

export interface ReportsProps {
  alerts: Alert[];
  machines: string[];
}

export interface MachineAlertsProps {
  alerts: Alert[];
  machineId: string;
}

// Dashboard state type
export interface DashboardState {
  historicalData: MachineData[];
  alerts: Alert[];
  oeeValue: number;
  uptime: number;
} 