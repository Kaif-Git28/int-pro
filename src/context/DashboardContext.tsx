import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import useApiData from '../hooks/useApiData';
import { MachineData, Alert, ApiSpindleData } from '../types';

interface DashboardState {
  historicalData: MachineData[];
  alerts: Alert[];
  oeeValue: number;
  uptime: number;
}

interface DashboardContextType {
  dashboardData: DashboardState;
  selectedMachine: string | null;
  setSelectedMachine: (machineId: string) => void;
  refreshData: () => void;
  isRefreshing: boolean;
  machineList: string[];
  apiStatus: {
    error: string | null;
    loading: boolean;
  };
  setApiUrl: (url: string) => void;
  currentApiUrl: string;
}

const initialState: DashboardState = {
  historicalData: [],
  alerts: [],
  oeeValue: 0,
  uptime: 0,
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedMachine, setSelectedMachine] = React.useState<string | null>(null);
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [apiUrl, setApiUrl] = React.useState('http://localhost:5000/api/api/param_details');

  const { data: apiData, error, isLoading, refreshData } = useApiData(apiUrl, 1000);

  // Memoize machine list to prevent unnecessary recalculations
  const machineList = useMemo(() => {
    if (!apiData) return [];
    return Object.keys(apiData).filter(machineId => {
      const machineData = apiData[machineId];
      return machineData.spindle_temp_0 !== null || 
             machineData.spindle_speed_0 !== null || 
             machineData.spindle_load_0 !== null;
    });
  }, [apiData]);

  // Convert API data to our format
  const convertApiDataToMachineData = useCallback((apiData: ApiSpindleData): MachineData[] => {
    const now = new Date();
    return Object.entries(apiData).map(([machineId, data]) => ({
      machineId,
      time: now.toISOString(),
      speed: data.spindle_speed_0 ? parseFloat(data.spindle_speed_0) : 0,
      temperature: data.spindle_temp_0 ? parseFloat(data.spindle_temp_0) : 0,
      load: data.spindle_load_0 ? parseFloat(data.spindle_load_0) : 0,
    }));
  }, []);

  // Generate alerts based on thresholds
  const generateAlerts = useCallback((data: MachineData[]): Alert[] => {
    const alerts: Alert[] = [];
    const now = new Date();
    
    data.forEach(machine => {
      if (machine.temperature > 30) {
        alerts.push({
          id: Date.now() + alerts.length,
          type: 'High Temperature',
          time: now.toLocaleTimeString(),
          machine: machine.machineId,
          severity: 'warning'
        });
      }
      
      if (machine.speed > 1000) {
        alerts.push({
          id: Date.now() + alerts.length,
          type: 'High Speed',
          time: now.toLocaleTimeString(),
          machine: machine.machineId,
          severity: 'warning'
        });
      }
      
      if (machine.load > 80) {
        alerts.push({
          id: Date.now() + alerts.length,
          type: 'High Load',
          time: now.toLocaleTimeString(),
          machine: machine.machineId,
          severity: 'critical'
        });
      }
    });
    
    return alerts;
  }, []);

  // Update state when API data changes
  React.useEffect(() => {
    if (apiData) {
      const newData = convertApiDataToMachineData(apiData);
      const newAlerts = generateAlerts(newData);
      
      dispatch({
        type: 'UPDATE_DATA',
        payload: {
          historicalData: newData,
          alerts: newAlerts,
          oeeValue: calculateOEE(newData),
          uptime: calculateUptime(newData)
        }
      });
    }
  }, [apiData, convertApiDataToMachineData, generateAlerts]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  }, [refreshData]);

  const value = useMemo(() => ({
    dashboardData: state,
    selectedMachine,
    setSelectedMachine,
    refreshData: handleRefresh,
    isRefreshing,
    machineList,
    apiStatus: {
      error: error,
      loading: isLoading
    },
    setApiUrl,
    currentApiUrl: apiUrl
  }), [state, selectedMachine, isRefreshing, machineList, error, isLoading, handleRefresh, apiUrl]);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

// Helper functions
function calculateOEE(data: MachineData[]): number {
  if (data.length === 0) return 0;
  const totalMachines = data.length;
  const runningMachines = data.filter(m => m.speed > 0).length;
  return (runningMachines / totalMachines) * 100;
}

function calculateUptime(data: MachineData[]): number {
  if (data.length === 0) return 0;
  const totalMachines = data.length;
  const operationalMachines = data.filter(m => m.temperature < 50 && m.load < 90).length;
  return (operationalMachines / totalMachines) * 100;
}

function dashboardReducer(state: DashboardState, action: { type: string; payload: Partial<DashboardState> }): DashboardState {
  switch (action.type) {
    case 'UPDATE_DATA':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}; 