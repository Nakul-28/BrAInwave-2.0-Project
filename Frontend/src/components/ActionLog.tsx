import type { SimulationAction } from '../types/simulation';

interface ActionLogProps {
    action: SimulationAction;
    timestep: number;
}

/**
 * Action Log Component
 * 
 * Displays the action taken by the policy at current timestep.
 * Shows both action type and human-readable name.
 */
export function ActionLog({ action, timestep }: ActionLogProps) {
    const actionDescriptions: Record<string, string> = {
        do_nothing: "Monitor situation passively, let population self-evacuate",
        prioritize_vulnerable: "Focus resources on elderly, disabled, and children first",
        distribute_evenly: "Spread resources uniformly across all zones",
        focus_high_density: "Concentrate efforts on high-population areas",
        expedite_routes: "Clear and optimize evacuation routes to reduce congestion",
    };

    const description = actionDescriptions[action.name] || "No description available";

    return (
        <div style={{
            background: '#f9f9f9',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ddd',
        }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px' }}>
                Action at Timestep {timestep}
            </h3>

            <div style={{
                background: '#007bff',
                color: 'white',
                padding: '15px',
                borderRadius: '6px',
                marginBottom: '10px',
            }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                    {action.name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>
                    Action Type: {action.type}
                </div>
            </div>

            <div style={{
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.5',
            }}>
                <strong>Strategy:</strong> {description}
            </div>
        </div>
    );
}
