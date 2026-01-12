import type { SimulationState } from '../types/simulation';

interface StateVisualizationProps {
    state: SimulationState;
    timestep: number;
}

/**
 * State Visualization Component
 * 
 * Displays the 10-dimensional disaster state at a single timestep.
 * All values are normalized 0.0-1.0 from backend.
 */
export function StateVisualization({ state, timestep }: StateVisualizationProps) {
    return (
        <div style={{
            background: '#f9f9f9',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ddd',
        }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px' }}>
                State at Timestep {timestep}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <StateBar
                    label="Hazard Level"
                    value={state.hazard}
                    color="#ff4444"
                    description="Earthquake intensity"
                />

                <StateBar
                    label="Unsheltered Population"
                    value={state.unsheltered}
                    color="#ff9800"
                    description="People not in safe shelters"
                />

                <StateBar
                    label="Shelter Capacity"
                    value={state.shelter_capacity}
                    color="#4caf50"
                    description="Available shelter space"
                />

                <StateBar
                    label="Casualties"
                    value={state.casualties}
                    color="#e91e63"
                    description="Casualties from delay"
                    inverted
                />

                <StateBar
                    label="Congestion"
                    value={state.congestion}
                    color="#ff5722"
                    description="Route congestion"
                    inverted
                />

                <StateBar
                    label="Evacuation Progress"
                    value={state.evacuation_progress}
                    color="#2196f3"
                    description="Completion percentage"
                />

                <StateBar
                    label="Resources"
                    value={state.resources}
                    color="#4caf50"
                    description="Available resources"
                />

                <StateBar
                    label="Communication"
                    value={state.communication}
                    color="#03a9f4"
                    description="Network functioning"
                />

                <StateBar
                    label="Panic Level"
                    value={state.panic}
                    color="#ff9800"
                    description="Population panic"
                    inverted
                />

                <StateBar
                    label="Time Progress"
                    value={state.time_normalized}
                    color="#9c27b0"
                    description="Simulation progress"
                />
            </div>
        </div>
    );
}

interface StateBarProps {
    label: string;
    value: number;
    color: string;
    description: string;
    inverted?: boolean;
}

function StateBar({ label, value, color, description, inverted }: StateBarProps) {
    const percentage = Math.round(value * 100);
    const displayColor = inverted && value > 0.5 ? '#ff4444' : color;

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '4px',
                fontSize: '14px',
            }}>
                <span style={{ fontWeight: 'bold' }}>{label}</span>
                <span style={{ fontFamily: 'monospace' }}>{percentage}%</span>
            </div>

            <div style={{
                height: '20px',
                background: '#e0e0e0',
                borderRadius: '4px',
                overflow: 'hidden',
                position: 'relative',
            }}>
                <div style={{
                    height: '100%',
                    width: `${percentage}%`,
                    background: displayColor,
                    transition: 'width 0.3s ease',
                }} />
            </div>

            <div style={{
                fontSize: '12px',
                color: '#666',
                marginTop: '2px',
            }}>
                {description}
            </div>
        </div>
    );
}
