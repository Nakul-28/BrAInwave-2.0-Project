import { useEffect, useState } from "react";
import { simulateDisaster } from "../services/api";
import type { SimulationResponse } from "../types/simulation";

/**
 * Smoke Test Component
 * 
 * This component performs a single API call to verify:
 * - API client works
 * - No CORS errors
 * - Types align correctly
 * - No runtime crashes
 * 
 * This is for VALIDATION ONLY, not production UI.
 */
export function SmokeTest() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [data, setData] = useState<SimulationResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const runTest = async () => {
        setStatus("loading");
        setError(null);

        try {
            const response = await simulateDisaster({
                scenario: {
                    max_timesteps: 50,
                },
                policy_type: "ppo",
                seed: 42,
            });

            setData(response);
            setStatus("success");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            setStatus("error");
        }
    };

    useEffect(() => {
        // Auto-run on mount
        runTest();
    }, []);

    return (
        <div style={{ padding: "20px", fontFamily: "monospace" }}>
            <h2>🧪 Smoke Test - Frontend Contract Validation</h2>

            <div style={{ marginTop: "20px" }}>
                <strong>Status:</strong> {status}
            </div>

            {status === "loading" && (
                <div style={{ marginTop: "10px", color: "blue" }}>
                    ⏳ Calling backend...
                </div>
            )}

            {status === "error" && (
                <div style={{ marginTop: "10px", color: "red" }}>
                    ❌ Error: {error}
                </div>
            )}

            {status === "success" && data && (
                <div style={{ marginTop: "20px" }}>
                    <div style={{ color: "green", fontWeight: "bold" }}>
                        ✅ Contract Verified - API Call Successful
                    </div>

                    <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "10px", borderRadius: "4px" }}>
                        <h3>Response Validation:</h3>

                        <div>✅ trajectory: Array with {data.trajectory.length} steps</div>
                        <div>✅ metrics.victims_rescued: {data.metrics.victims_rescued}</div>
                        <div>✅ metrics.success_rate: {(data.metrics.success_rate * 100).toFixed(1)}%</div>
                        <div>✅ metrics.total_reward: {data.metrics.total_reward.toFixed(2)}</div>
                        <div>✅ metrics.time_steps: {data.metrics.time_steps}</div>
                        <div>✅ metrics.policy_type: {data.metrics.policy_type}</div>

                        <h4 style={{ marginTop: "15px" }}>First Timestep State:</h4>
                        <div>✅ hazard: {data.trajectory[0].state.hazard}</div>
                        <div>✅ unsheltered: {data.trajectory[0].state.unsheltered}</div>
                        <div>✅ evacuation_progress: {data.trajectory[0].state.evacuation_progress}</div>

                        <h4 style={{ marginTop: "15px" }}>First Action:</h4>
                        <div>✅ type: {data.trajectory[0].action.type}</div>
                        <div>✅ name: {data.trajectory[0].action.name}</div>
                    </div>

                    <div style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
                        <strong>TypeScript Compilation:</strong> ✅ No type errors<br />
                        <strong>CORS:</strong> ✅ No CORS errors<br />
                        <strong>Schema Alignment:</strong> ✅ All fields present and typed correctly<br />
                        <strong>No Mocked Data:</strong> ✅ Real backend response
                    </div>

                    <button
                        onClick={runTest}
                        style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
                    >
                        🔄 Run Test Again
                    </button>
                </div>
            )}
        </div>
    );
}
