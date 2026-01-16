/**
 * Brainwave Simulation Types
 * 
 * TypeScript interfaces that EXACTLY mirror the backend Pydantic models.
 * These types define the contract between frontend and backend.
 * 
 * DO NOT modify these types without updating the backend first.
 * Backend is the source of truth.
 */

/**
 * Simulation metadata
 */
export interface SimulationMeta {
    /** City name (e.g., "Delhi") */
    city: string;

    /** Disaster type (e.g., "earthquake") */
    disaster: string;

    /** Disaster magnitude (e.g., 7.0) */
    magnitude: number;

    /** Policy type used ("ppo" or "heuristic") */
    policy: string;

    /** Random seed for determinism (or null) */
    seed: number | null;
}

/**
 * State at a single timestep (normalized values)
 */
export interface SimulationState {
    /** Earthquake intensity across zones (0.0-1.0) */
    hazard: number;

    /** Fraction of people not yet in safe shelters (0.0-1.0) */
    unsheltered: number;

    /** Absolute casualties count */
    casualties: number;

    /** Overall evacuation completion percentage (0.0-1.0) */
    evacuation_progress: number;

    /** Average route congestion/bottleneck severity (0.0-1.0) */
    congestion: number;
}

/**
 * Action taken by the policy at a single timestep
 */
export interface SimulationAction {
    /** Action ID (0-4) */
    id: number;

    /** Human-readable action name */
    name: "do_nothing" | "prioritize_vulnerable" | "distribute_evenly" | "focus_high_density" | "expedite_routes";
}

/**
 * Single timestep in the simulation trajectory
 */
export interface SimulationStep {
    /** Timestep number (0-indexed) */
    timestep: number;

    /** State at this timestep */
    state: SimulationState;

    /** Action taken at this timestep */
    action: SimulationAction;
}

/**
 * Geographic zone with risk level
 */
export interface Zone {
    /** Zone identifier (e.g., "rohini") */
    id: string;

    /** Latitude */
    lat: number;

    /** Longitude */
    lng: number;

    /** Risk level (0.0-1.0) - DEPRECATED: use risk_trajectory */
    risk: number;

    /** Time-varying risk per timestep (0.0-1.0) */
    risk_trajectory?: number[];
}

/**
 * Final performance metrics for AI simulation
 */
export interface FinalMetrics {
    /** Absolute casualties count */
    casualties: number;

    /** Success rate (0.0-1.0) */
    success_rate: number;

    /** Number of timesteps to completion */
    timesteps: number;

    /** Cumulative RL reward */
    total_reward: number;
}

/**
 * Baseline (heuristic) performance metrics
 */
export interface BaselineMetrics {
    /** Absolute casualties count */
    casualties: number;

    /** Success rate (0.0-1.0) */
    success_rate: number;
}

/**
 * Complete simulation response from backend /api/simulate endpoint
 */
export interface SimulationResponse {
    /** Simulation metadata */
    meta: SimulationMeta;

    /** Step-by-step trajectory of the simulation */
    trajectory: SimulationStep[];

    /** Geographic zones with risk levels */
    zones: Zone[];

    /** Final metrics for AI policy */
    final_metrics: FinalMetrics;

    /** Baseline metrics for comparison */
    baseline_metrics: BaselineMetrics;
}

/**
 * Scenario configuration parameters
 */
export interface ScenarioConfig {
    /** Maximum number of timesteps to run (10-100) */
    max_timesteps: number;
}

/**
 * Request payload for /api/simulate endpoint
 */
export interface SimulationRequest {
    /** Scenario configuration */
    scenario: ScenarioConfig;

    /** Policy type to use for simulation */
    policy_type: "ppo" | "heuristic";

    /** Optional seed for deterministic simulations */
    seed?: number;
}

// ═══════════════════════════════════════════════════════════════════
// LEGACY TYPES (For backward compatibility with existing frontend code)
// ═══════════════════════════════════════════════════════════════════

/**
 * @deprecated Use SimulationResponse.final_metrics instead
 */
export interface PerformanceMetrics {
    total_reward: number;
    avg_casualties: number;
    avg_hazard: number;
    avg_evacuation_progress: number;
    total_timesteps: number;
    policy_type: string;
}
