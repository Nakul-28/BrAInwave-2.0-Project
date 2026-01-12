import React from 'react';

/**
 * MetricsBar Component
 * 
 * Live metrics display during simulation execution.
 * 
 * Shows:
 * - Total casualties
 * - Unsheltered population
 * - Resources in use
 * - Current timestep
 * - Cumulative reward (per strategy)
 * 
 * Updates in real-time as simulation progresses.
 */
const MetricsBar: React.FC = () => {
  return (
    <div className="metrics-bar">
      <p>Live metrics (to be implemented)</p>
    </div>
  );
};

export default MetricsBar;
