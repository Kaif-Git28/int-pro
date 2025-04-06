import React from 'react';
import AdvancedDashboard from './components/AdvancedDashboard';
import { DashboardProvider } from './context/DashboardContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <DashboardProvider>
        <AdvancedDashboard />
      </DashboardProvider>
    </ThemeProvider>
  );
}

export default App; 