/**
 * Brainwave API Service
 * 
 * Type-safe API client for communicating with the backend.
 * Uses environment variables for API URL configuration.
 */

import type {
    SimulationRequest,
    SimulationResponse,
} from "../types/simulation";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error("VITE_API_URL is not defined");
}

/**
 * Run disaster response simulation
 * 
 * @param request - Simulation request parameters
 * @returns Complete simulation response with trajectory and metrics
 * @throws Error if request fails
 */
export async function simulateDisaster(
    request: SimulationRequest
): Promise<SimulationResponse> {
    const response = await fetch(`${API_URL}/api/simulate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Simulation failed: ${text}`);
    }

    return response.json();
}
