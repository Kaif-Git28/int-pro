import React, { useState, useEffect } from 'react';
import { Menu, Clock, Calendar, RefreshCw, ChevronDown, ChevronRight, Users, AlertTriangle } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { useTheme } from '../context/ThemeContext';

// Import components
import Sidebar from './Sidebar';
import SpindleParameters from './SpindleParameters';
import MachineStatus from './MachineStatus';
import Reports from './Reports';

// Import icons
import { Moon, Sun } from 'lucide-react';

const AdvancedDashboard: React.FC = () => {
  const {
    dashboardData,
    selectedMachine,
    setSelectedMachine,
    refreshData,
    isRefreshing,
    machineList,
    apiStatus,
    setApiUrl,
    currentApiUrl
  } = useDashboard();
  
  const { theme, toggleTheme } = useTheme();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [apiUrlInput, setApiUrlInput] = useState(currentApiUrl);

  // Update the clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);

  // Update API URL input when context URL changes
  useEffect(() => {
    setApiUrlInput(currentApiUrl);
  }, [currentApiUrl]);

  // Handle API URL update
  const handleApiUrlUpdate = () => {
    if (apiUrlInput && apiUrlInput !== currentApiUrl) {
      setApiUrl(apiUrlInput);
      refreshData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Top Navigation */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Menu size={24} />
            </button>
            <div className="font-bold text-xl text-blue-400">
              Predictive <span className="text-gray-900 dark:text-white">Analytics</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-1 bg-gray-200 dark:bg-gray-700 rounded-md px-3 py-1">
              <Clock size={14} className="text-blue-400 mr-1" />
              <span className="text-xs text-gray-900 dark:text-white">{currentTime.toLocaleTimeString()}</span>
              <span className="text-gray-500 dark:text-gray-500">|</span>
              <Calendar size={14} className="text-blue-400 mr-1" />
              <span className="text-xs text-gray-900 dark:text-white">{currentTime.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Users size={16} className="text-white" />
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium text-gray-900 dark:text-white">Admin</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">System Manager</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside
          className={`${
            showMobileMenu ? 'block' : 'hidden'
          } md:block w-full md:w-60 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 absolute md:relative z-10 md:z-0`}
        >
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-3 md:p-6">
          {/* API Error Banner */}
          {apiStatus.error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex justify-between items-center">
              <div className="flex items-center">
                <AlertTriangle className="mr-2" size={20} />
                <div>
                  <p className="font-bold">API Connection Error</p>
                  <p>{apiStatus.error}</p>
                  <p className="text-sm mt-1">Check API server is running on port 5000</p>
                </div>
              </div>
              <button 
                onClick={refreshData}
                className="px-3 py-1 bg-red-200 text-red-800 rounded hover:bg-red-300 focus:outline-none"
              >
                Retry Connection
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-1 text-sm">
                <span className="text-blue-400">Home</span>
                <ChevronRight size={14} className="text-gray-500 dark:text-gray-500" />
                <span className="text-gray-600 dark:text-gray-300">Spindle Monitoring</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold mt-1 text-gray-900 dark:text-white">Spindle Performance Dashboard</h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm rounded-md px-3 py-1.5 flex items-center space-x-1 text-gray-900 dark:text-white"
                >
                  <span>Machine: {selectedMachine || 'None Selected'}</span>
                  <ChevronDown size={14} />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                    {machineList.length > 0 ? (
                      machineList.map((machineId) => (
                        <button
                          key={machineId}
                          onClick={() => {
                            setSelectedMachine(machineId);
                            setShowDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          {machineId}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">No machines available</div>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={refreshData}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Debug Info */}
          <div className="mb-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded text-xs">
            <div><strong>API Status:</strong> {apiStatus.loading ? 'Loading...' : 'Ready'}</div>
            <div><strong>Selected Machine:</strong> {selectedMachine || 'None'}</div>
            <div><strong>Machine Count:</strong> {machineList.length}</div>
            <div><strong>Historical Data Points:</strong> {dashboardData.historicalData.length}</div>
            <div><strong>Failure Prediction Range:</strong> 100-200 days (triggered at load &gt; 168%)</div>
          </div>

          {activeTab === 'dashboard' && (
            <>
              {selectedMachine ? (
                <>
                  <div className="mb-6">
                    <SpindleParameters data={dashboardData.historicalData} machineId={selectedMachine} />
                  </div>
                </>
              ) : (
                <div className="p-4 mb-6 bg-yellow-100 text-yellow-800 rounded-lg border border-yellow-200">
                  <h3 className="font-bold text-lg mb-2">No Machine Selected</h3>
                  <p>Please select a machine from the dropdown to view spindle parameters.</p>
                </div>
              )}
              
              {/* Machine Status */}
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
                <MachineStatus />
              </div>
            </>
          )}

          {activeTab === 'machines' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Machines</h2>
              <p className="mt-2 text-gray-700 dark:text-gray-300">Machine-specific view coming soon!</p>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Analytics</h2>
              <p className="mt-2 text-gray-700 dark:text-gray-300">Detailed analytics coming soon!</p>
            </div>
          )}

          {activeTab === 'reports' && <Reports machines={machineList} />}

          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
              
              {/* API Settings */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">API Configuration</h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">API URL</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="text"
                        value={apiUrlInput}
                        onChange={(e) => setApiUrlInput(e.target.value)}
                        className="flex-1 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="http://localhost:5000/api/api/param_details"
                      />
                      <button
                        onClick={handleApiUrlUpdate}
                        className="inline-flex items-center px-4 py-2 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-500"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Theme Toggle */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h3>
                <div className="mt-4">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white"
                  >
                    {theme === 'dark' ? (
                      <>
                        <Sun size={16} />
                        <span>Switch to Light Theme</span>
                      </>
                    ) : (
                      <>
                        <Moon size={16} />
                        <span>Switch to Dark Theme</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdvancedDashboard;