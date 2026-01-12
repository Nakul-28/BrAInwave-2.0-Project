import React from 'react';

/**
 * ActionPanel Component
 * 
 * Displays last action taken by each strategy.
 * For human operator mode, provides decision controls.
 * 
 * Shows:
 * - Action description (e.g., "ambulance_1 evacuates 5 from zone_2")
 * - Action index
 * - Reward received for action
 * 
 * Interactive for human operator strategy.
 */
const ActionPanel: React.FC = () => {
  return (
    <div className="action-panel">
      <p>Action history and controls (to be implemented)</p>
    </div>
  );
};

export default ActionPanel;
