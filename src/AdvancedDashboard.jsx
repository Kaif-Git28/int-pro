import React, { useState, useEffect, memo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts';
import {
  Bell,
  Settings,
  Home,
  BarChart2,
  AlertTriangle,
  Menu,
  Download,
  Calendar,
  Clock,
  Zap,
  Upload,
  ChevronDown,
  RefreshCw,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Cloud,
  HardDrive,
  Wifi,
  Sun,
  Moon,
  Thermometer,
  Gauge,
  Weight,
} from 'lucide-react';
import * as XLSX from 'xlsx';

// Utility Functions
const generateData = (machineId = 'SPD-001') => {
  const now = new Date();
  return {
    machineId,
    time: now.toLocaleTimeString(),
    speed: Math.floor(Math.random() * (12000 - 11000) + 11000),
    temperature: Math.floor(Math.random() * (85 - 65) + 65),
    load: Math.floor(Math.random() * (90 - 50) + 50),
  };
};

const generateHistoricalData = (count, machineId = 'SPD-001') => {
  return Array.from({ length: count }, (_, i) => {
    const time = new Date(Date.now() - i * 3000);
    return {
      machineId,
      time: time.toLocaleTimeString(),
      speed: Math.floor(Math.random() * (12000 - 10000) + 10000),
      temperature: Math.floor(Math.random() * (85 - 60) + 60),
      load: Math.floor(Math.random() * (95 - 40) + 40),
    };
  }).reverse();
};

// Static Data
const systemHealthData = [
  { name: 'Network', value: 98 },
  { name: 'Database', value: 87 },
  { name: 'Sensors', value: 94 },
  { name: 'Storage', value: 76 },
];

const machineList = [
  { id: 'SPD-001', name: 'Spindle CNC-A1', status: 'Running', lastMaintenance: '2025-02-15', health: 98 },
  { id: 'SPD-002', name: 'Spindle CNC-B2', status: 'Idle', lastMaintenance: '2025-01-28', health: 85 },
  { id: 'SPD-003', name: 'Spindle CNC-C3', status: 'Warning', lastMaintenance: '2025-03-10', health: 74 },
  { id: 'SPD-004', name: 'Spindle CNC-D4', status: 'Maintenance', lastMaintenance: '2025-03-18', health: 65 },
  { id: 'SPD-005', name: 'Spindle CNC-E5', status: 'Running', lastMaintenance: '2025-02-27', health: 92 },
];

const productivityData = [
  { name: 'Mon', actual: 78, target: 80 },
  { name: 'Tue', actual: 82, target: 80 },
  { name: 'Wed', actual: 79, target: 80 },
  { name: 'Thu', actual: 87, target: 80 },
  { name: 'Fri', actual: 84, target: 80 },
  { name: 'Sat', actual: 76, target: 75 },
  { name: 'Sun', actual: 70, target: 70 },
];

const energyConsumptionData = [
  { name: '00:00', consumption: 42 },
  { name: '04:00', consumption: 38 },
  { name: '08:00', consumption: 67 },
  { name: '12:00', consumption: 85 },
  { name: '16:00', consumption: 72 },
  { name: '20:00', consumption: 55 },
];

// Sidebar Component
const Sidebar = memo(({ activeTab, setActiveTab, alerts }) => (
  <div className="p-4">
    <nav className="space-y-1">
      {['dashboard', 'machines', 'analytics', 'alerts', 'reports', 'settings'].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex items-center space-x-3 w-full p-3 rounded text-sm transition-colors duration-200 ${
            activeTab === tab
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {tab === 'dashboard' && <Home size={16} />}
          {tab === 'machines' && <HardDrive size={16} />}
          {tab === 'analytics' && <BarChart2 size={16} />}
          {tab === 'alerts' && <AlertTriangle size={16} />}
          {tab === 'reports' && <Download size={16} />}
          {tab === 'settings' && <Settings size={16} />}
          <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
          {tab === 'alerts' && alerts.length > 0 && (
            <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{alerts.length}</span>
          )}
        </button>
      ))}
    </nav>
    <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">System Status</h3>
      <div className="space-y-3">
        {systemHealthData.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              {item.name === 'Network' && <Wifi size={14} className="text-blue-400" />}
              {item.name === 'Database' && <HardDrive size={14} className="text-blue-400" />}
              {item.name === 'Sensors' && <Zap size={14} className="text-blue-400" />}
              {item.name === 'Storage' && <Cloud size={14} className="text-blue-400" />}
              <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
            </div>
            <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  item.value >= 90 ? 'bg-emerald-500' : item.value >= 75 ? 'bg-blue-500' : item.value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
));

// KPI Card Component
const KPICard = memo(({ title, value, icon, trend }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
    <div className="flex justify-between">
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</div>
        <div className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</div>
      </div>
      <div className="flex items-center justify-center w-10 h-10 rounded-md bg-blue-500 bg-opacity-20">{icon}</div>
    </div>
    <div className="mt-3 flex items-center text-xs">
      {trend > 0 ? (
        <ArrowUpRight size={14} className="text-emerald-500 mr-1" />
      ) : (
        <ArrowDownRight size={14} className="text-red-500 mr-1" />
      )}
      <span className={trend > 0 ? 'text-emerald-500' : 'text-red-500'}>{Math.abs(trend)}%</span>
      <span className="text-gray-500 dark:text-gray-400 ml-1">vs last week</span>
    </div>
  </div>
));

// Spindle Parameters Component
const SpindleParameters = memo(({ data, machineId }) => {
  const latestData = data.filter((d) => d.machineId === machineId).slice(-1)[0] || {};
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
        Spindle Parameters - {machineId}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-500 bg-opacity-10 rounded-full flex items-center justify-center">
            <Gauge size={24} className="text-blue-500" />
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Spindle Speed</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">{latestData.speed || 0} RPM</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-red-500 bg-opacity-10 rounded-full flex items-center justify-center">
            <Thermometer size={24} className="text-red-500" />
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Spindle Temperature</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">{latestData.temperature || 0} °C</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-emerald-500 bg-opacity-10 rounded-full flex items-center justify-center">
            <Weight size={24} className="text-emerald-500" />
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Spindle Load</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">{latestData.load || 0} %</div>
          </div>
        </div>
      </div>
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">Last Updated: {latestData.time || 'N/A'}</div>
    </div>
  );
});

// OEE Chart Component
const OEEChart = memo(({ oeeValue }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <h2 className="font-semibold text-gray-900 dark:text-white">OEE Analysis</h2>
    </div>
    <div className="p-4 flex flex-col items-center">
      <div className="h-52 w-52">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={[{ name: 'OEE', value: oeeValue }, { name: 'Loss', value: 100 - oeeValue }]}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              <Cell fill="#3b82f6" />
              <Cell fill="#e5e7eb dark:#1f2937" />
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#f3f4f6 dark:#1f2937', borderColor: '#d1d5db dark:#374151' }} formatter={(value) => [`${value}%`, 'OEE']} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-center">
        <div className="text-3xl font-bold text-blue-500">{oeeValue.toFixed(1)}%</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">Overall Equipment Effectiveness</div>
      </div>
    </div>
  </div>
));

// Productivity Chart Component
const ProductivityChart = memo(() => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <h2 className="font-semibold text-gray-900 dark:text-white">Weekly Production Rate</h2>
    </div>
    <div className="p-4 h-64">
      <ResponsiveContainer>
        <BarChart data={productivityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db dark:#444" />
          <XAxis dataKey="name" stroke="#6b7280 dark:#888" />
          <YAxis stroke="#6b7280 dark:#888" />
          <Tooltip contentStyle={{ backgroundColor: '#f3f4f6 dark:#1f2937', borderColor: '#d1d5db dark:#374151' }} />
          <Legend />
          <Bar dataKey="actual" name="Production" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="target" name="Target" fill="#9ca3af dark:#4b5563" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
));

// Energy Chart Component
const EnergyChart = memo(() => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
      <h2 className="font-semibold text-gray-900 dark:text-white">Energy Consumption</h2>
      <div className="flex space-x-2">
        <button className="bg-gray-200 dark:bg-gray-700 text-xs px-2 py-1 rounded text-gray-900 dark:text-white">Today</button>
        <button className="text-gray-500 dark:text-gray-400 text-xs px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">Week</button>
      </div>
    </div>
    <div className="p-4 h-64">
      <ResponsiveContainer>
        <AreaChart data={energyConsumptionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="#6b7280 dark:#888" />
          <YAxis stroke="#6b7280 dark:#888" />
          <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db dark:#444" />
          <Tooltip contentStyle={{ backgroundColor: '#f3f4f6 dark:#1f2937', borderColor: '#d1d5db dark:#374151' }} formatter={(value) => [`${value} kWh`, 'Consumption']} />
          <Area type="monotone" dataKey="consumption" stroke="#10b981" fill="url(#colorConsumption)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
));

// Machine Status Component
const MachineStatus = memo(({ onSelectMachine }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <h2 className="font-semibold text-gray-900 dark:text-white">Connected Machines Status</h2>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            <th className="p-4">Machine ID</th>
            <th className="p-4">Name</th>
            <th className="p-4">Status</th>
            <th className="p-4">Last Maintenance</th>
            <th className="p-4">Health</th>
          </tr>
        </thead>
        <tbody>
          {machineList.map((machine) => (
            <tr
              key={machine.id}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors duration-200"
              onClick={() => onSelectMachine(machine.id)}
            >
              <td className="p-4 font-medium text-gray-900 dark:text-white">{machine.id}</td>
              <td className="p-4 text-gray-900 dark:text-white">{machine.name}</td>
              <td className="p-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    machine.status === 'Running'
                      ? 'bg-emerald-500 bg-opacity-20 text-emerald-500'
                      : machine.status === 'Idle'
                      ? 'bg-blue-500 bg-opacity-20 text-blue-500'
                      : machine.status === 'Warning'
                      ? 'bg-yellow-500 bg-opacity-20 text-yellow-500'
                      : 'bg-red-500 bg-opacity-20 text-red-500'
                  }`}
                >
                  {machine.status}
                </span>
              </td>
              <td className="p-4 text-gray-900 dark:text-white">{machine.lastMaintenance}</td>
              <td className="p-4">
                <div className="flex items-center">
                  <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mr-2">
                    <div
                      className={`h-full ${
                        machine.health >= 90 ? 'bg-emerald-500' : machine.health >= 75 ? 'bg-blue-500' : machine.health >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${machine.health}%` }}
                    />
                  </div>
                  <span className="text-gray-900 dark:text-white">{machine.health}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
));

// Alerts Component
const Alerts = memo(({ alerts }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
      <h2 className="font-semibold flex items-center text-gray-900 dark:text-white">
        <AlertTriangle size={16} className="text-red-500 mr-2" />
        Active Alerts
      </h2>
      <div className="text-xs bg-red-500 px-2 py-0.5 rounded-full text-white">{alerts.length}</div>
    </div>
    <div className="p-2 max-h-[350px] overflow-y-auto">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-3 rounded-md ${alert.severity === 'critical' ? 'bg-red-100 dark:bg-red-900 bg-opacity-30' : 'bg-yellow-100 dark:bg-yellow-900 bg-opacity-30'}`}
        >
          <div className="flex justify-between">
            <div className="font-medium text-sm text-gray-900 dark:text-white">{alert.type}</div>
            <div
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                alert.severity === 'critical' ? 'bg-red-500 bg-opacity-30 text-red-400' : 'bg-yellow-500 bg-opacity-30 text-yellow-400'
              }`}
            >
              {alert.severity}
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <div>{alert.machine}</div>
            <div>{alert.time}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
));

// Reports Component
const Reports = memo(({ alerts, machines }) => {
  const [selectedMachine, setSelectedMachine] = useState(machines[0].id);
  const [showDropdown, setShowDropdown] = useState(false);

  const downloadExcel = () => {
    const machineAlerts = alerts.filter((alert) => alert.machine === selectedMachine);
    const data = machineAlerts.map((alert) => ({
      'Machine ID': alert.machine,
      'Alert Type': alert.type,
      'Severity': alert.severity,
      'Time': alert.time,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${selectedMachine}_Alerts`);

    // Auto-size columns
    const colWidths = [
      { wch: 15 }, // Machine ID
      { wch: 25 }, // Alert Type
      { wch: 10 }, // Severity
      { wch: 20 }, // Time
    ];
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `${selectedMachine}_Alerts_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const machineAlerts = alerts.filter((alert) => alert.machine === selectedMachine);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reports</h2>
      
      {/* Placeholder for Other Reports */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Other Reports</h3>
        <p className="mt-2 text-gray-700 dark:text-gray-300">Additional report types coming soon!</p>
      </div>

      {/* Alert Reports Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Alert Reports</h3>
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm rounded-md px-3 py-1.5 flex items-center space-x-1 text-gray-900 dark:text-white"
            >
              <span>
                Machine: {machines.find((m) => m.id === selectedMachine)?.name} ({selectedMachine})
              </span>
              <ChevronDown size={14} />
            </button>
            {showDropdown && (
              <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                {machines.map((machine) => (
                  <button
                    key={machine.id}
                    onClick={() => {
                      setSelectedMachine(machine.id);
                      setShowDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    {machine.name} ({machine.id})
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={downloadExcel}
            className="flex items-center space-x-1 bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={machineAlerts.length === 0}
          >
            <Download size={16} />
            <span>Download Excel</span>
          </button>
        </div>
        {machineAlerts.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="p-2">Alert Type</th>
                <th className="p-2">Severity</th>
                <th className="p-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {machineAlerts.map((alert) => (
                <tr key={alert.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-2 text-gray-900 dark:text-white">{alert.type}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        alert.severity === 'critical'
                          ? 'bg-red-500 bg-opacity-20 text-red-500'
                          : 'bg-yellow-500 bg-opacity-20 text-yellow-500'
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </td>
                  <td className="p-2 text-gray-900 dark:text-white">{alert.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">No alerts available for this machine.</p>
        )}
      </div>
    </div>
  );
});

// Main Dashboard Component
const AdvancedDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    historicalData: generateHistoricalData(20, 'SPD-001'),
    alerts: [],
    oeeValue: 92,
    uptime: 98.7,
  });
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState('SPD-001');
  const [showDropdown, setShowDropdown] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generateData(selectedMachine);
      setDashboardData((prev) => {
        const newAlert = Math.random() > 0.85
          ? {
              id: Date.now(),
              type: ['High Temperature Warning', 'Speed Fluctuation Detected', 'Excessive Load Detected'][Math.floor(Math.random() * 3)],
              time: new Date().toLocaleTimeString(),
              machine: selectedMachine,
              severity: Math.random() > 0.5 ? 'warning' : 'critical',
            }
          : null;
        return {
          ...prev,
          historicalData: [...prev.historicalData, newData].slice(-30),
          alerts: newAlert ? [newAlert, ...prev.alerts].slice(0, 10) : prev.alerts,
          oeeValue: Math.min(Math.max(prev.oeeValue + (Math.random() * 0.4 - 0.2), 85), 98),
          uptime: Math.min(Math.max(prev.uptime + (Math.random() * 0.2 - 0.1), 98), 99.5),
        };
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedMachine]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setDashboardData((prev) => ({
        ...prev,
        historicalData: generateHistoricalData(20, selectedMachine),
        alerts: [],
      }));
      setRefreshing(false);
    }, 1000);
  };

  const handleMachineSelect = (machineId) => {
    setSelectedMachine(machineId);
    setDashboardData((prev) => ({
      ...prev,
      historicalData: generateHistoricalData(20, machineId),
      alerts: prev.alerts.filter((alert) => alert.machine === machineId),
    }));
    setShowDropdown(false);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Top Navigation */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-3">
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <Menu size={24} />
            </button>
            <div className="font-bold text-xl text-blue-400">
            Predictive <span className="text-gray-900 dark:text-white">Analytics</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-1 bg-gray-200 dark:bg-gray-700 rounded-md px-3 py-1">
              <Clock size={14} className="text-blue-400 mr-1" />
              <span className="text-xs text-gray-900 dark:text-white">{new Date().toLocaleTimeString()}</span>
              <span className="text-gray-500 dark:text-gray-500">|</span>
              <Calendar size={14} className="text-blue-400 mr-1" />
              <span className="text-xs text-gray-900 dark:text-white">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="relative">
              <button className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <Bell size={20} />
                {dashboardData.alerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                    {dashboardData.alerts.length}
                  </span>
                )}
              </button>
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
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} alerts={dashboardData.alerts} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-3 md:p-6">
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
                  <span>Machine: {selectedMachine}</span>
                  <ChevronDown size={14} />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                    {machineList.map((machine) => (
                      <button
                        key={machine.id}
                        onClick={() => handleMachineSelect(machine.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        {machine.id} - {machine.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleRefresh}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {activeTab === 'dashboard' && (
            <>
              <div className="mb-6">
                <SpindleParameters data={dashboardData.historicalData} machineId={selectedMachine} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <KPICard
                  title="OEE"
                  value={`${dashboardData.oeeValue.toFixed(1)}%`}
                  icon={<BarChart2 size={20} className="text-blue-400" />}
                  trend={1.2}
                />
                <KPICard
                  title="Utilization"
                  value="87.4%"
                  icon={<Zap size={20} className="text-emerald-400" />}
                  trend={0.8}
                />
                <KPICard
                  title="Uptime"
                  value={`${dashboardData.uptime.toFixed(1)}%`}
                  icon={<Clock size={20} className="text-blue-400" />}
                  trend={0.3}
                />
                <KPICard
                  title="Energy Efficiency"
                  value="94.2%"
                  icon={<Upload size={20} className="text-emerald-400" />}
                  trend={-0.5}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <OEEChart oeeValue={dashboardData.oeeValue} />
                <ProductivityChart />
                <EnergyChart />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                  <MachineStatus onSelectMachine={handleMachineSelect} />
                </div>
                <Alerts alerts={dashboardData.alerts} />
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

          {activeTab === 'alerts' && <Alerts alerts={dashboardData.alerts} />}

          {activeTab === 'reports' && <Reports alerts={dashboardData.alerts} machines={machineList} />}

          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h3>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Theme</span>
                  <button
                    onClick={toggleTheme}
                    className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-md text-gray-900 dark:text-white"
                  >
                    {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                    <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
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