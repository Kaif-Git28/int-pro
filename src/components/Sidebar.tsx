import React, { memo } from 'react';
import { Home, HardDrive, BarChart2, AlertTriangle, Download, Settings, Wifi, Zap, Cloud } from 'lucide-react';
import { SidebarProps } from '../types';
import { systemHealthData } from '../data/mockData';

const Sidebar: React.FC<SidebarProps> = memo(({ activeTab, setActiveTab, alerts }) => (
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

export default Sidebar; 