# TypeScript Interface Definitions
# 
# Core data structures for the disaster response simulation platform.
# These interfaces define the contract between frontend and backend.

## Simulation Output

### TrajectoryTimestep
```typescript
interface TrajectoryTimestep {
  t: number;                      // Timestep index
  zone_stats: ZoneStats[];        // State of all zones
  resources: Resource[];          // State of all resources
  action: Action;                 // Action taken this timestep
  reward: number;                 // Reward received
  cumulative_reward: number;      // Total reward so far
}
```

### ZoneStats
```typescript
interface ZoneStats {
  zoneId: string;                 // Unique zone identifier
  population: number;             // Total population in zone
  sheltered: number;              // Number of sheltered people
  unsheltered: number;            // Number of unsheltered people
  hazard_level: number;           // Hazard intensity (0.0 - 1.0)
  casualties: number;             // Casualties in this zone
}
```

### Resource
```typescript
interface Resource {
  id: string;                     // Unique resource identifier
  type: 'ambulance' | 'rescue_team' | 'other';
  zoneId: string;                 // Current zone location
  lat: number;                    // Latitude position
  lon: number;                    // Longitude position
  load: number;                   // Current passenger count
  capacity: number;               // Maximum capacity
  status: 'idle' | 'moving' | 'loading' | 'unloading';
}
```

### Action
```typescript
interface Action {
  action_index: number;           // Discrete action identifier
  description: string;            // Human-readable description
  agent: 'AI' | 'HUMAN' | 'GREEDY' | 'NEAREST_SHELTER';
}
```

### SimulationMetrics
```typescript
interface SimulationMetrics {
  total_reward: number;           // Total cumulative reward
  final_deaths: number;           // Total casualties
  avg_unsheltered: number;        // Average unsheltered over time
  total_evacuations: number;      // Total successful evacuations
  resource_utilization: number;   // Resource efficiency (0.0 - 1.0)
}
```

### Complete Simulation Output
```typescript
interface SimulationOutput {
  metrics: SimulationMetrics;
  trajectory: TrajectoryTimestep[];
}
```

## Scenario Configuration

### ScenarioConfig
```typescript
interface ScenarioConfig {
  scenario: {
    disaster_type: string;
    magnitude: number;
    epicenter: {
      lat: number;
      lon: number;
    };
    city: string;
    start_time: string;           // ISO 8601 format
  };
  resources: {
    ambulances: number;
    rescue_teams: number;
    shelters: number;
  };
  strategies: ('AI' | 'HUMAN' | 'GREEDY' | 'NEAREST_SHELTER')[];
  simulation_config: {
    max_timesteps: number;
    timestep_duration_seconds: number;
  };
}
```

---

These interfaces should be implemented in TypeScript files as development progresses.
