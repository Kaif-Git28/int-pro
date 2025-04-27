import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import useApiData from '../hooks/useApiData';
import { MachineData, ApiSpindleData } from '../types';

interface MachineResetInfo {
  resetTime: string; // ISO timestamp of when the reset occurred
  expiresAfterDays: number; // Reset expires after this many days
}

interface DashboardState {
  historicalData: MachineData[];
  oeeValue: number;
  uptime: number;
  machineFailureStatus: Record<string, number>; // Store failure days for each machine
  resetMachines: Record<string, MachineResetInfo>; // Track machines that have been reset with their reset time
  lastUpdateTime: string; // Track when the data was last updated for time-based calculations
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
  resetMachineFailure: (machineId: string) => void; // Add reset function
}

const initialState: DashboardState = {
  historicalData: [],
  oeeValue: 0,
  uptime: 0,
  machineFailureStatus: {},
  resetMachines: {},
  lastUpdateTime: new Date().toISOString(),
};

// Reset expiration period in days
const RESET_EXPIRATION_DAYS = 30;

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

  // Add reset function for machine failure prediction
  const resetMachineFailure = useCallback((machineId: string) => {
    const updatedFailureStatus = { ...state.machineFailureStatus };
    const updatedResetMachines = { ...state.resetMachines };
    
    // Remove the machine from failure status tracking
    if (updatedFailureStatus[machineId]) {
      delete updatedFailureStatus[machineId];
      
      // Add the machine to reset tracking with current timestamp
      updatedResetMachines[machineId] = {
        resetTime: new Date().toISOString(),
        expiresAfterDays: RESET_EXPIRATION_DAYS
      };
      
      // Update the state with the reset machine
      dispatch({
        type: 'RESET_MACHINE_FAILURE',
        payload: {
          machineId,
          machineFailureStatus: updatedFailureStatus,
          resetMachines: updatedResetMachines
        }
      });
    }
  }, [state.machineFailureStatus, state.resetMachines]);

  // Helper function to check if a reset is still valid
  const isResetValid = useCallback((resetInfo: MachineResetInfo) => {
    if (!resetInfo) return false;
    
    const resetDate = new Date(resetInfo.resetTime);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - resetDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= resetInfo.expiresAfterDays;
  }, []);

  // Process machine data and update days to failure
  const updateFailureDays = useCallback((machineFailureStatus: Record<string, number>, lastUpdate: string) => {
    const updatedFailureStatus = { ...machineFailureStatus };
    const lastUpdateDate = new Date(lastUpdate);
    const currentDate = new Date();
    
    // Calculate days passed since last update
    const diffTime = Math.abs(currentDate.getTime() - lastUpdateDate.getTime());
    const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // If at least one day has passed, update all failure predictions
    if (daysPassed > 0) {
      Object.keys(updatedFailureStatus).forEach(machineId => {
        // Reduce the days to failure by the number of days passed
        updatedFailureStatus[machineId] = Math.max(0, updatedFailureStatus[machineId] - daysPassed);
      });
    }
    
    return updatedFailureStatus;
  }, []);

  // Convert API data to our format, preserving existing failure predictions
  const convertApiDataToMachineData = useCallback((
    apiData: ApiSpindleData, 
    currentFailureStatus: Record<string, number>, 
    resetMachines: Record<string, MachineResetInfo>
  ): MachineData[] => {
    const now = new Date();
    return Object.entries(apiData).map(([machineId, data]) => {
      // Get the current values
      const speed = data.spindle_speed_0 ? parseFloat(data.spindle_speed_0) : 0;
      const temp = data.spindle_temp_0 ? parseFloat(data.spindle_temp_0) : 0;
      const load = data.spindle_load_0 ? parseFloat(data.spindle_load_0) : 0;
      
      // Check if this machine has a valid reset
      const hasValidReset = resetMachines[machineId] && isResetValid(resetMachines[machineId]);
      
      // Get current failure prediction for this machine (if any)
      const currentFailureDays = currentFailureStatus[machineId] || 0;
      
      // By default, maintain existing prediction (or 0 if none)
      let newTimeToFailure = currentFailureDays;
      
      // Determine if this is the first time load has crossed the threshold
      const isFirstCrossing = load > 168 && currentFailureDays === 0 && !hasValidReset;
      
      // Determine if this is a post-reset crossing
      const isPostResetCrossing = load > 168 && hasValidReset;
      
      // Only generate new predictions in these two cases:
      if (isFirstCrossing || isPostResetCrossing) {
        // Generate a truly random value between 100-200 days
        const minDays = 100;
        const maxDays = 200;
        newTimeToFailure = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
        
        if (isFirstCrossing) {
          console.log(`NEW load threshold crossing for ${machineId}: Generated initial prediction of ${newTimeToFailure} days`);
        } else {
          console.log(`POST-RESET load threshold crossing for ${machineId}: Generated new prediction of ${newTimeToFailure} days`);
        }
      }
      
      return {
        machineId,
        time: now.toISOString(),
        speed: speed,
        temperature: temp,
        load: load,
        timeToFailure: newTimeToFailure,
      };
    });
  }, [isResetValid]);

  // Update state when API data changes
  React.useEffect(() => {
    if (apiData) {
      const now = new Date().toISOString();
      
      // Check if any resets have expired
      const updatedResetMachines = { ...state.resetMachines };
      let resetsChanged = false;
      
      Object.keys(updatedResetMachines).forEach(machineId => {
        if (!isResetValid(updatedResetMachines[machineId])) {
          delete updatedResetMachines[machineId];
          resetsChanged = true;
        }
      });
      
      // Update failure days based on time passed
      const updatedFailureStatus = updateFailureDays(state.machineFailureStatus, state.lastUpdateTime);
      
      // Process new data - this is where all the time to failure calculations happen
      const newData = convertApiDataToMachineData(apiData, updatedFailureStatus, updatedResetMachines);
      
      // Create a map to store the final failure predictions 
      const finalFailureStatus = { ...updatedFailureStatus };
      
      // Update the failure status based on the machine data calculations
      newData.forEach(machine => {
        const machineId = machine.machineId;
        // For a new prediction (load crossed threshold but no existing prediction)
        if (machine.timeToFailure > 0 && !finalFailureStatus[machineId]) {
          // Save this initial prediction
          finalFailureStatus[machineId] = machine.timeToFailure;
          console.log(`Set initial prediction for ${machineId}: ${machine.timeToFailure} days`);
        }
        // For a post-reset prediction (has reset info and is in failure state)
        else if (machine.timeToFailure > 0 && 
                resetsChanged && 
                updatedResetMachines[machineId] && 
                isResetValid(updatedResetMachines[machineId])) {
          finalFailureStatus[machineId] = machine.timeToFailure;
          console.log(`Set post-reset prediction for ${machineId}: ${machine.timeToFailure} days`);
        }
        // Never update existing predictions here - those are handled by the time-based updates
      });
      
      dispatch({
        type: 'UPDATE_DATA',
        payload: {
          historicalData: newData,
          oeeValue: calculateOEE(newData),
          uptime: calculateUptime(newData),
          machineFailureStatus: finalFailureStatus,
          resetMachines: resetsChanged ? updatedResetMachines : state.resetMachines,
          lastUpdateTime: now
        }
      });
    }
  }, [apiData, convertApiDataToMachineData, isResetValid, state.lastUpdateTime, state.machineFailureStatus, state.resetMachines, updateFailureDays]);

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
    currentApiUrl: apiUrl,
    resetMachineFailure
  }), [state, selectedMachine, isRefreshing, machineList, error, isLoading, handleRefresh, apiUrl, resetMachineFailure]);

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

function dashboardReducer(state: DashboardState, action: { type: string; payload: any }): DashboardState {
  switch (action.type) {
    case 'UPDATE_DATA':
      return { ...state, ...action.payload };
    case 'RESET_MACHINE_FAILURE':
      // Update the historical data to remove timeToFailure for the specified machine
      const updatedHistoricalData = state.historicalData.map(machine => {
        if (machine.machineId === action.payload.machineId) {
          return { ...machine, timeToFailure: 0 };
        }
        return machine;
      });
      
      return { 
        ...state, 
        machineFailureStatus: action.payload.machineFailureStatus,
        historicalData: updatedHistoricalData,
        resetMachines: action.payload.resetMachines
      };
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