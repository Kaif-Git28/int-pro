# Predictive Analytics Dashboard

A modern React dashboard for industrial spindle monitoring and predictive analytics, built with React, TypeScript, and Tailwind CSS.

## Features

- Real-time monitoring of industrial spindle machines
- Performance analytics with interactive charts
- Dark/light theme support
- Responsive design for desktop and mobile
- Machine status monitoring
- Alert system for critical issues
- Report generation functionality

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS
- Recharts for data visualization
- Context API for state management
- Lucide React for icons

## Project Structure

The project follows a modern, modular architecture:

```
src/
├── components/     # UI components
│   ├── charts/     # Chart components
├── context/        # Context providers for state management
├── data/           # Mock data and data generators
├── hooks/          # Custom React hooks
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm start
# or
yarn start
```

## Usage

The dashboard is designed to monitor and analyze industrial spindle machines. Key features include:

- Viewing real-time spindle parameters (speed, temperature, load)
- Monitoring OEE (Overall Equipment Effectiveness)
- Tracking machine status and health
- Viewing and managing alerts
- Generating reports

## Customization

The dashboard can be customized by:

- Modifying the theme in `src/context/ThemeContext.tsx`
- Adding new components in the components directory
- Extending data types in `src/types/index.ts`
- Connecting to real APIs by modifying the data fetching hooks

## Future Enhancements

- User authentication
- Role-based access control
- Integration with real-time data APIs
- Advanced analytics capabilities
- Mobile app version 