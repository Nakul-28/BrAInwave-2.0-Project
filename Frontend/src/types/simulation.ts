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
 * 10-dimensional state vector representing the disaster scenario at a single timestep
 */
export interface SimulationState {
    /** Earthquake intensity across zones (0.0-1.0) */
    hazard: number;

    /** Fraction of people not yet in safe shelters (0.0-1.0) */
    unsheltered: number;

    /** Normalized available shelter space (0.0-1.0) */
    shelter_capacity: number;

    /** Normalized casualties from delayed evacuation (0.0-1.0) */
    casualties: number;

    /** Average route congestion/bottleneck severity (0.0-1.0) */
    congestion: number;

    /** Overall evacuation completion percentage (0.0-1.0) */
    evacuation_progress: number;

    /** Current timestep / max_timesteps (0.0-1.0) */
    time_normalized: number;

    /** Emergency resources (vehicles, personnel) available (0.0-1.0) */
    resources: number;

    /** Network/communication infrastructure functioning (0.0-1.0) */
    communication: number;

    /** Population panic/disorder metric (0.0-1.0) */
    panic: number;
}

/**
 * Action taken by the policy at a single timestep
 */
export interface SimulationAction {
    /** Action type index (0-4) */
    type: number;

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

    /** Reward received for taking this action */
    reward: number;
}

/**
 * Performance metrics summarizing the entire simulation
 */
export interface PerformanceMetrics {
    /** Cumulative reward across all timesteps */
    total_reward: number;

    /** Number of victims successfully rescued */
    victims_rescued: number;

    /** Number of timesteps the simulation ran */
    time_steps: number;

    /** Success rate (0.0-1.0) */
    success_rate: number;

    /** Policy type used for this simulation */
    policy_type: string;
}

/**
 * Complete simulation response from backend /api/simulate endpoint
 */
export interface SimulationResponse {
    /** Step-by-step trajectory of the simulation */
    trajectory: SimulationStep[];

    /** Performance metrics summary */
    metrics: PerformanceMetrics;
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
