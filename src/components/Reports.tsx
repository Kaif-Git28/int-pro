import React, { memo, useState } from 'react';
import { Download, FileText, Calendar } from 'lucide-react';
import * as XLSX from 'xlsx';
import { ReportsProps, Alert } from '../types';

interface MachineReport {
  'Machine ID': string;
  'Status': string;
  'Health (%)': number;
  'Last Maintenance': string;
  'Date Generated': string;
}

interface AlertReport {
  'Alert ID': number;
  'Type': string;
  'Machine': string;
  'Severity': string;
  'Time': string;
  'Date Generated': string;
}

type ReportData = MachineReport | AlertReport;

const Reports: React.FC<ReportsProps> = memo(({ alerts, machines }) => {
  const [selectedReport, setSelectedReport] = useState<string>('machine-status');
  const [dateRange, setDateRange] = useState<string>('today');

  // Helper function to generate machine status
  const getMachineStatus = (machineId: string) => {
    const statuses = ['Running', 'Idle', 'Warning', 'Maintenance'];
    const randomIndex = Math.floor(machineId.charCodeAt(machineId.length - 1) % 4);
    return statuses[randomIndex];
  };

  // Helper function to generate health percentage
  const getMachineHealth = (machineId: string) => {
    const hash = machineId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 50 + (hash % 50); // Value between 50% and 99%
  };

  // Helper function to generate last maintenance date
  const getLastMaintenance = (machineId: string) => {
    const hash = machineId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const daysAgo = hash % 60; // Between 0 and 59 days ago
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toLocaleDateString();
  };

  const generateReport = () => {
    let data: ReportData[] = [];
    const currentDate = new Date().toLocaleDateString();

    if (selectedReport === 'machine-status') {
      data = machines.map((machineId: string) => ({
        'Machine ID': machineId,
        'Status': getMachineStatus(machineId),
        'Health (%)': getMachineHealth(machineId),
        'Last Maintenance': getLastMaintenance(machineId),
        'Date Generated': currentDate,
      }));
    } else if (selectedReport === 'alerts') {
      data = alerts.map((alert: Alert) => ({
        'Alert ID': alert.id,
        'Type': alert.type,
        'Machine': alert.machine,
        'Severity': alert.severity,
        'Time': alert.time,
        'Date Generated': currentDate,
      }));
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, selectedReport);
    
    const reportTitle = selectedReport === 'machine-status' ? 'Machine_Status' : 'Alert_History';
    const fileName = `${reportTitle}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Reports</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Generate Report</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Report Type</label>
              <select 
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="machine-status">Machine Status Report</option>
                <option value="alerts">Alert History Report</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Period</label>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 90 Days</option>
              </select>
            </div>
            
            <button 
              onClick={generateReport}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Download size={16} />
              <span>Download Report</span>
            </button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Scheduled Reports</h3>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-md divide-y divide-gray-200 dark:divide-gray-700">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md">
                  <FileText size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Daily Status Report</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Every day at 08:00</div>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                <Calendar size={12} />
                <span>Next: Tomorrow</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-md">
                  <FileText size={16} className="text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Weekly Alert Summary</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Every Monday at 09:00</div>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                <Calendar size={12} />
                <span>Next: Monday</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-md">
                  <FileText size={16} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Monthly Performance Report</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">1st of every month</div>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                <Calendar size={12} />
                <span>Next: April 1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Reports; 