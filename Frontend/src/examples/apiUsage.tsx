/**
 * Example usage of the Brainwave API client
 * 
 * This file demonstrates how to use the type-safe API layer
 * in React components. NOT part of the actual application.
 * 
 * NOTE: This file is for documentation purposes only.
 * The API has been simplified - checkHealth and ApiError were removed.
 */

import { simulateDisaster } from "../services/api";
import type { SimulationRequest } from "../types/simulation";

/**
 * Example: Run a PPO simulation
 */
export const examplePPOSimulation = async () => {
    const request: SimulationRequest = {
        scenario: {
            max_timesteps: 50,
        },
        policy_type: "ppo",
        seed: 42, // Optional: for deterministic results
    };

    try {
        const response = await simulateDisaster(request);

        console.log("Simulation complete!");
        console.log(`Victims rescued: ${response.metrics.victims_rescued}`);
        console.log(`Success rate: ${(response.metrics.success_rate * 100).toFixed(1)}%`);
        console.log(`Total reward: ${response.metrics.total_reward.toFixed(2)}`);
        console.log(`Trajectory steps: ${response.trajectory.length}`);

        return response;
    } catch (error) {
        if (error instanceof Error) {
            console.error("API Error:", error.message);
        } else {
            console.error("Unexpected error:", error);
        }
        throw error;
    }
};

/**
 * Example: Run heuristic simulation
 */
export const exampleHeuristicSimulation = async () => {
    const request: SimulationRequest = {
        scenario: {
            max_timesteps: 50,
        },
        policy_type: "heuristic",
    };

    try {
        const response = await simulateDisaster(request);
        return response;
    } catch (error) {
        console.error("Simulation failed:", error);
        throw error;
    }
};

/**
 * Example: React component usage
 */
export const ExampleComponent = () => {
    const runSimulation = async () => {
        try {
            // Run simulation
            const response = await examplePPOSimulation();

            // Use response data
            console.log("First timestep state:", response.trajectory[0].state);
            console.log("Final metrics:", response.metrics);

        } catch (error) {
            console.error("Simulation failed:", error);
        }
    };

    return (
        <button onClick={runSimulation}>
            Run Simulation
        </button>
    );
};
