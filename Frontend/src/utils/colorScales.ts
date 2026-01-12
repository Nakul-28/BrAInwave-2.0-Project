/**
 * Color Scale Utilities
 * 
 * Maps hazard levels, metrics, and simulation states to visual colors.
 * Used for zone rendering, metrics display, and strategy comparison.
 */

/**
 * Hazard Level Color Scale
 * Maps hazard intensity (0.0 - 1.0) to color
 * 
 * 0.0 - 0.2: Safe (green)
 * 0.2 - 0.5: Moderate (yellow)
 * 0.5 - 0.8: High (orange)
 * 0.8 - 1.0: Critical (red)
 */
export const getHazardColor = (hazardLevel: number): string => {
  if (hazardLevel <= 0.2) return '#22c55e'; // green-500
  if (hazardLevel <= 0.5) return '#eab308'; // yellow-500
  if (hazardLevel <= 0.8) return '#f97316'; // orange-500
  return '#ef4444'; // red-500
};

/**
 * Population Status Color Scale
 * Maps sheltered percentage to color
 */
export const getShelteredColor = (shelteredPercentage: number): string => {
  if (shelteredPercentage >= 0.8) return '#22c55e'; // green-500
  if (shelteredPercentage >= 0.5) return '#eab308'; // yellow-500
  if (shelteredPercentage >= 0.2) return '#f97316'; // orange-500
  return '#ef4444'; // red-500
};

/**
 * Strategy Color Coding
 * Consistent colors for different decision strategies across all visualizations
 */
export const STRATEGY_COLORS = {
  AI: '#3b82f6', // blue-500
  HUMAN: '#8b5cf6', // purple-500
  GREEDY: '#f59e0b', // amber-500
  NEAREST_SHELTER: '#10b981', // emerald-500
} as const;

/**
 * Metric Severity Colors
 * For casualties, unsheltered population, and other negative metrics
 */
export const SEVERITY_COLORS = {
  LOW: '#22c55e', // green-500
  MEDIUM: '#eab308', // yellow-500
  HIGH: '#f97316', // orange-500
  CRITICAL: '#ef4444', // red-500
} as const;
