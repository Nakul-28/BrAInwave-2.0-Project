import type { SimulationStep } from '../types/simulation';

interface RewardChartProps {
    trajectory: SimulationStep[];
    currentStepIndex: number;
}

/**
 * Reward Chart Component
 * 
 * Line chart showing reward evolution over time.
 * Highlights current timestep position.
 */
export function RewardChart({ trajectory, currentStepIndex }: RewardChartProps) {
    if (trajectory.length === 0) return null;

    // Calculate cumulative reward
    const cumulativeRewards = trajectory.map((step, index) => {
        const cumulative = trajectory
            .slice(0, index + 1)
            .reduce((sum, s) => sum + s.reward, 0);
        return cumulative;
    });

    const maxReward = Math.max(...cumulativeRewards);
    const minReward = Math.min(...cumulativeRewards);
    const range = maxReward - minReward || 1;

    const chartHeight = 200;
    const chartWidth = 600;
    const padding = 40;

    // Create SVG path for line
    const points = cumulativeRewards.map((reward, index) => {
        const x = padding + (index / (trajectory.length - 1)) * (chartWidth - 2 * padding);
        const y = chartHeight - padding - ((reward - minReward) / range) * (chartHeight - 2 * padding);
        return { x, y, reward, index };
    });

    const pathD = points
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ');

    return (
        <div style={{
            background: '#f9f9f9',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ddd',
        }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px' }}>
                Cumulative Reward Timeline
            </h3>

            <svg
                width={chartWidth}
                height={chartHeight}
                style={{
                    display: 'block',
                    margin: '0 auto',
                    background: 'white',
                    borderRadius: '4px',
                }}
            >
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                    <line
                        key={ratio}
                        x1={padding}
                        y1={padding + ratio * (chartHeight - 2 * padding)}
                        x2={chartWidth - padding}
                        y2={padding + ratio * (chartHeight - 2 * padding)}
                        stroke="#e0e0e0"
                        strokeWidth="1"
                    />
                ))}

                {/* Reward line */}
                <path
                    d={pathD}
                    fill="none"
                    stroke="#007bff"
                    strokeWidth="2"
                />

                {/* Current position indicator */}
                {points[currentStepIndex] && (
                    <>
                        <line
                            x1={points[currentStepIndex].x}
                            y1={padding}
                            x2={points[currentStepIndex].x}
                            y2={chartHeight - padding}
                            stroke="#ff4444"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                        />
                        <circle
                            cx={points[currentStepIndex].x}
                            cy={points[currentStepIndex].y}
                            r="5"
                            fill="#ff4444"
                        />
                    </>
                )}

                {/* Axes */}
                <line
                    x1={padding}
                    y1={chartHeight - padding}
                    x2={chartWidth - padding}
                    y2={chartHeight - padding}
                    stroke="#333"
                    strokeWidth="2"
                />
                <line
                    x1={padding}
                    y1={padding}
                    x2={padding}
                    y2={chartHeight - padding}
                    stroke="#333"
                    strokeWidth="2"
                />

                {/* Labels */}
                <text
                    x={chartWidth / 2}
                    y={chartHeight - 5}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#666"
                >
                    Timestep
                </text>
                <text
                    x={5}
                    y={chartHeight / 2}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#666"
                    transform={`rotate(-90, 5, ${chartHeight / 2})`}
                >
                    Cumulative Reward
                </text>
            </svg>

            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                marginTop: '15px',
                fontSize: '14px',
            }}>
                <div>
                    <span style={{ color: '#666' }}>Current Step:</span>{' '}
                    <strong>{currentStepIndex}</strong>
                </div>
                <div>
                    <span style={{ color: '#666' }}>Step Reward:</span>{' '}
                    <strong>{trajectory[currentStepIndex].reward.toFixed(2)}</strong>
                </div>
                <div>
                    <span style={{ color: '#666' }}>Cumulative:</span>{' '}
                    <strong>{cumulativeRewards[currentStepIndex].toFixed(2)}</strong>
                </div>
            </div>
        </div>
    );
}
