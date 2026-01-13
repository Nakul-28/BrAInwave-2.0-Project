/**
 * DisasterSim API Transport Layer
 * 
 * HARD BOUNDARY: This is the ONLY file that communicates with the backend.
 * 
 * RESPONSIBILITY:
 * - Fetch simulation data from backend
 * - Expose typed interfaces
 * - Return backend JSON untouched
 * 
 * PROHIBITED:
 * - Interpretation of data
 * - Transformation of values
 * - Fallback logic
 * - UI decisions
 * - Computed fields
 * - Retries
 * - Silent failures
 * 
 * If backend changes, this file changes. NOT the pages.
 */

import type {
    SimulationRequest,
    SimulationResponse,
} from "../types/simulation";

/**
 * Backend API base URL from environment
 */
const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error("VITE_API_URL is not defined");
}

/**
 * Execute disaster simulation via backend API.
 * 
 * PURE TRANSPORT FUNCTION:
 * - Accepts request parameters
 * - Returns backend JSON untouched
 * - Throws on any error (no silent failures)
 * - No retries
 * - No fallbacks
 * - No transformations
 * 
 * @param request - Simulation request parameters
 * @returns Backend response exactly as received
 * @throws Error if network fails or backend returns non-200
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

    // Return backend JSON untouched - no transformation
    return response.json();
}
