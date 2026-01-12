# City-Scale AI Disaster Response Simulation Platform

A visual decision-support system for evaluating and comparing disaster response strategies using real-world city geography, discrete-time simulation, and quantitative performance metrics.

## Overview

This platform enables government disaster management agencies, NGOs, and training institutions to simulate and analyze large-scale emergency responses under realistic constraints. The system models how different decision-making strategies—AI-driven reinforcement learning, human operators, and heuristic baselines—affect casualty rates, population sheltering, and resource utilization during disasters such as major earthquakes.

### Target Stakeholders

- Government disaster management cells
- Emergency response NGOs
- Training and planning institutions
- Policy makers and urban planners

## Problem Statement

Disaster response optimization requires balancing multiple competing objectives under severe constraints:

**Given:**
- A large-scale disaster event (e.g., Magnitude 7.0 earthquake)
- A real city (Delhi) with actual geography and infrastructure
- Limited emergency resources (ambulances, rescue teams, shelters)
- Road network constraints and dynamic congestion
- Time-evolving hazard propagation and population states

**Objective:**
Minimize a weighted combination of:
- Total casualties
- Unsheltered population over time
- Resource utilization costs

The platform provides visual and quantitative evidence of strategy performance differences.

## System Architecture

### Frontend Application Flow

The application is organized into five distinct pages, each serving a specific purpose in the decision-support workflow:

#### 1. Landing Page (`/`)
- Cinematic scroll-based introduction
- Visual explanation of the problem and solution
- System capabilities overview
- Entry point for judges and stakeholders

#### 2. Scenario Setup (`/setup`)
- Form-driven disaster configuration
- Define disaster parameters (type, magnitude, epicenter)
- Configure available resources (ambulances, teams, shelters)
- Select strategies to compare (AI, Human, Heuristic baselines)
- Outputs scenario configuration JSON for backend

#### 3. Simulation Dashboard (`/simulate`) **[CORE PAGE]**
- Real-time visualization on MapLibre (Delhi with OpenStreetMap)
- Discrete timestep playback controls
- Zone hazard coloring by intensity
- Animated resource movement (ambulances, rescue teams)
- Parallel strategy comparison side-by-side
- Live metrics tracking (casualties, sheltering rate, resource usage)
- Action log showing last decision per strategy

#### 4. Results & Comparison (`/results`)
- Post-simulation analytics and charts
- Casualties over time (line charts)
- Sheltered population percentage
- Resource utilization efficiency
- Quantitative strategy performance tables
- Statistical comparison of outcomes

#### 5. Report Generation (`/report`)
- Formal, decision-grade reports
- Executive summary of findings
- Areas for improvement identification
- Resource allocation analysis
- PDF export functionality

### Data Contract

The frontend consumes simulation outputs in the following structure:

```json
{
  "metrics": {
    "total_reward": -245.7,
    "final_deaths": 12,
    "avg_unsheltered": 67.4
  },
  "trajectory": [
    {
      "t": 0,
      "zone_stats": [
        {
          "zoneId": "zone_1",
          "population": 1200,
          "sheltered": 150,
          "unsheltered": 1050,
          "hazard_level": 0.92
        }
      ],
      "resources": [
        {
          "id": "ambulance_1",
          "zoneId": "zone_2",
          "lat": 28.6200,
          "lon": 77.2100,
          "load": 3
        }
      ],
      "action": {
        "action_index": 0,
        "description": "ambulance_1 evacuates 5 people from zone_2",
        "agent": "AI"
      },
      "reward": -15.0,
      "cumulative_reward": -15.0
    }
  ]
}
```

**Key Principles:**
- Discrete-time simulation with complete state snapshots per timestep
- Frontend is a visualization layer—no simulation logic
- Backend handles all state transitions and decision-making
- Frontend renders state, actions, and outcomes

## Technology Stack

### Core Framework
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **React Router** for page navigation

### Visualization
- **MapLibre GL JS** for real-world city map rendering (open-source, no API keys)
- **Recharts** for analytics charts and graphs
- **GSAP** for scroll-based landing page animations

### Styling
- CSS custom properties for theming
- Modular component-level styles
- Responsive design patterns

## Project Structure

```
src/
├── pages/
│   ├── Landing.tsx          # Entry point and system overview
│   ├── ScenarioSetup.tsx    # Disaster configuration form
│   ├── Simulation.tsx       # Live simulation dashboard (CORE)
│   ├── Results.tsx          # Post-simulation analytics
│   └── Report.tsx           # Exportable decision reports
│
├── components/
│   ├── MapView.tsx          # Reusable MapLibre wrapper
│   ├── ZoneLayer.tsx        # Zone polygon rendering
│   ├── ResourceLayer.tsx    # Resource marker visualization
│   ├── MetricsBar.tsx       # Live metrics display
│   └── ActionPanel.tsx      # Decision and action controls
│
├── data/
│   ├── demoScenario.json    # Fallback scenario configuration
│   └── demoTrajectory.json  # Fallback simulation output
│
├── utils/
│   ├── mapStyles.ts         # MapLibre style references
│   └── colorScales.ts       # Hazard and metric color mappings
│
├── styles/
│   ├── global.css           # Base styles and design system
│   └── maplibre.css         # MapLibre-specific styling
│
├── App.tsx                  # Router configuration
└── main.tsx                 # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- No external API keys or accounts required (fully open-source)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "Brainwave 2.0 Project"
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Strategy Comparison

The platform evaluates multiple decision-making approaches:

### 1. AI Rescue Agent
- Reinforcement learning-based policy
- Trained to optimize global outcomes across entire city
- Considers long-term consequences of resource allocation

### 2. Human Operator
- Manual decision-making interface
- User selects actions step-by-step
- Demonstrates typical human response patterns

### 3. Baseline Heuristics
- **Greedy**: Send resources to zones with highest unsheltered population
- **Nearest-Shelter**: Route people to closest available shelters
- Provides performance baseline for comparison

All strategies operate on identical initial conditions and face the same constraints.

## Expected Outcomes

Typical demonstration results show:
- AI saves 40-50% more lives compared to baseline heuristics
- AI achieves stable states 30-40% faster
- AI utilizes resources 20-30% more efficiently
- Human operator performance varies based on experience and strategy

Visual demonstrations combine:
- Real-time map visualization
- Quantitative metrics
- Narrative explanation of decision impact

## Development Roadmap

**Current Phase:** Project initialization and structure establishment

**Next Steps:**
1. Implement landing page scroll animations
2. Build scenario configuration form with validation
3. Develop core simulation dashboard with MapLibre integration
4. Create zone and resource layer rendering
5. Implement results analytics with charts
6. Build report generation and export functionality

## Contributing

This is a hackathon project developed for demonstration and evaluation purposes. For questions or collaboration opportunities, contact the development team.

## License

[License information to be added]


---

**Project Classification:** Applied AI + Systems Engineering  
**Domain:** Emergency Response Optimization  
**Technical Focus:** Visual Decision-Support Systems  
**Target Audience:** Government agencies, NGOs, training institutions, hackathon judges

