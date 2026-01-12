/**
 * Contract Verification Test
 * 
 * This simple test verifies that the frontend TypeScript types
 * correctly match the backend response structure.
 * 
 * Run this in the browser console to verify contract alignment.
 */

import { simulateDisaster } from "../services/api";

/**
 * Verify that backend response matches TypeScript types
 */
export const verifyContract = async (): Promise<boolean> => {
    console.log("🔍 Verifying frontend-backend contract...");

    try {
        // Run a simple simulation
        const response = await simulateDisaster({
            scenario: { max_timesteps: 10 },
            policy_type: "ppo",
            seed: 42,
        });

        console.log("✓ API call successful");

        // Verify trajectory structure
        if (!Array.isArray(response.trajectory)) {
            console.error("❌ trajectory is not an array");
            return false;
        }
        console.log(`✓ trajectory is array with ${response.trajectory.length} steps`);

        // Verify first step structure
        const firstStep = response.trajectory[0];
        if (!firstStep) {
            console.error("❌ trajectory is empty");
            return false;
        }

        const requiredStepFields = ["timestep", "state", "action", "reward"];
        for (const field of requiredStepFields) {
            if (!(field in firstStep)) {
                console.error(`❌ Missing field in step: ${field}`);
                return false;
            }
        }
        console.log("✓ Step structure correct");

        // Verify state structure (10 fields)
        const state = firstStep.state;
        const requiredStateFields = [
            "hazard",
            "unsheltered",
            "shelter_capacity",
            "casualties",
            "congestion",
            "evacuation_progress",
            "time_normalized",
            "resources",
            "communication",
            "panic",
        ];

        for (const field of requiredStateFields) {
            if (!(field in state)) {
                console.error(`❌ Missing state field: ${field}`);
                return false;
            }
            if (typeof state[field as keyof typeof state] !== "number") {
                console.error(`❌ State field ${field} is not a number`);
                return false;
            }
        }
        console.log("✓ State structure correct (all 10 fields present)");

        // Verify action structure
        const action = firstStep.action;
        if (typeof action.type !== "number") {
            console.error("❌ action.type is not a number");
            return false;
        }
        if (typeof action.name !== "string") {
            console.error("❌ action.name is not a string");
            return false;
        }
        console.log("✓ Action structure correct");

        // Verify metrics structure
        const metrics = response.metrics;
        const requiredMetricsFields = [
            "total_reward",
            "victims_rescued",
            "time_steps",
            "success_rate",
            "policy_type",
        ];

        for (const field of requiredMetricsFields) {
            if (!(field in metrics)) {
                console.error(`❌ Missing metrics field: ${field}`);
                return false;
            }
        }
        console.log("✓ Metrics structure correct");

        // All checks passed
        console.log("\n✅ CONTRACT VERIFIED");
        console.log("Frontend TypeScript types match backend Pydantic models");
        console.log("\nSample data:");
        console.log("- Victims rescued:", metrics.victims_rescued);
        console.log("- Success rate:", (metrics.success_rate * 100).toFixed(1) + "%");
        console.log("- Total reward:", metrics.total_reward.toFixed(2));
        console.log("- Timesteps:", metrics.time_steps);

        return true;

    } catch (error) {
        console.error("❌ CONTRACT VERIFICATION FAILED");
        console.error(error);
        return false;
    }
};

// Auto-run verification in development
if (import.meta.env.DEV) {
    console.log("Development mode detected - contract verification available");
    console.log("Run: verifyContract() to test frontend-backend alignment");
}
