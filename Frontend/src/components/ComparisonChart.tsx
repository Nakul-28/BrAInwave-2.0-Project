import type { PerformanceMetrics } from '../types/simulation';

interface ComparisonChartProps {
    ppoMetrics: PerformanceMetrics;
    heuristicMetrics: PerformanceMetrics;
}

/**
 * Comparison Chart Component
 * 
 * Side-by-side bar charts comparing PPO vs Heuristic metrics.
 * Minimal, clear visualization prioritizing honesty over flashiness.
 */
export function ComparisonChart({ ppoMetrics, heuristicMetrics }: ComparisonChartProps) {
    const chartWidth = 600;
    const chartHeight = 300;
    const barWidth = 80;
    const spacing = 100;
    const padding = 60;

    // Normalize values for victims rescued (0-1000 scale)
    const maxVictims = 1000;
    const ppoVictimsHeight = (ppoMetrics.victims_rescued / maxVictims) * (chartHeight - 2 * padding);
    const heuristicVictimsHeight = (heuristicMetrics.victims_rescued / maxVictims) * (chartHeight - 2 * padding);

    // Normalize success rate (0-100% scale)
    const ppoSuccessHeight = ppoMetrics.success_rate * (chartHeight - 2 * padding);
    const heuristicSuccessHeight = heuristicMetrics.success_rate * (chartHeight - 2 * padding);

    return (
        <div style={{
            background: '#f9f9f9',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ddd',
        }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Visual Comparison</h3>

            <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {/* Victims Rescued Chart */}
                <div>
                    <h4 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '14px' }}>
                        Victims Rescued
                    </h4>
                    <svg width={chartWidth / 2} height={chartHeight}>
                        {/* Grid lines */}
                        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                            <g key={ratio}>
                                <line
                                    x1={padding}
                                    y1={chartHeight - padding - ratio * (chartHeight - 2 * padding)}
                                    x2={chartWidth / 2 - padding}
                                    y2={chartHeight - padding - ratio * (chartHeight - 2 * padding)}
                                    stroke="#e0e0e0"
                                    strokeWidth="1"
                                />
                                <text
                                    x={padding - 10}
                                    y={chartHeight - padding - ratio * (chartHeight - 2 * padding) + 4}
                                    textAnchor="end"
                                    fontSize="10"
                                    fill="#666"
                                >
                                    {Math.round(ratio * maxVictims)}
                                </text>
                            </g>
                        ))}

                        {/* PPO Bar */}
                        <rect
                            x={padding + spacing - barWidth / 2}
                            y={chartHeight - padding - ppoVictimsHeight}
                            width={barWidth}
                            height={ppoVictimsHeight}
                            fill="#28a745"
                        />
                        <text
                            x={padding + spacing}
                            y={chartHeight - padding - ppoVictimsHeight - 5}
                            textAnchor="middle"
                            fontSize="14"
                            fontWeight="bold"
                            fill="#28a745"
                        >
                            {ppoMetrics.victims_rescued}
                        </text>
                        <text
                            x={padding + spacing}
                            y={chartHeight - padding + 20}
                            textAnchor="middle"
                            fontSize="12"
                            fill="#333"
                        >
                            PPO
                        </text>

                        {/* Heuristic Bar */}
                        <rect
                            x={padding + spacing + 120 - barWidth / 2}
                            y={chartHeight - padding - heuristicVictimsHeight}
                            width={barWidth}
                            height={heuristicVictimsHeight}
                            fill="#6c757d"
                        />
                        <text
                            x={padding + spacing + 120}
                            y={chartHeight - padding - heuristicVictimsHeight - 5}
                            textAnchor="middle"
                            fontSize="14"
                            fontWeight="bold"
                            fill="#6c757d"
                        >
                            {heuristicMetrics.victims_rescued}
                        </text>
                        <text
                            x={padding + spacing + 120}
                            y={chartHeight - padding + 20}
                            textAnchor="middle"
                            fontSize="12"
                            fill="#333"
                        >
                            Heuristic
                        </text>

                        {/* Axes */}
                        <line
                            x1={padding}
                            y1={chartHeight - padding}
                            x2={chartWidth / 2 - padding}
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
                    </svg>
                </div>

                {/* Success Rate Chart */}
                <div>
                    <h4 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '14px' }}>
                        Success Rate
                    </h4>
                    <svg width={chartWidth / 2} height={chartHeight}>
                        {/* Grid lines */}
                        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                            <g key={ratio}>
                                <line
                                    x1={padding}
                                    y1={chartHeight - padding - ratio * (chartHeight - 2 * padding)}
                                    x2={chartWidth / 2 - padding}
                                    y2={chartHeight - padding - ratio * (chartHeight - 2 * padding)}
                                    stroke="#e0e0e0"
                                    strokeWidth="1"
                                />
                                <text
                                    x={padding - 10}
                                    y={chartHeight - padding - ratio * (chartHeight - 2 * padding) + 4}
                                    textAnchor="end"
                                    fontSize="10"
                                    fill="#666"
                                >
                                    {Math.round(ratio * 100)}%
                                </text>
                            </g>
                        ))}

                        {/* PPO Bar */}
                        <rect
                            x={padding + spacing - barWidth / 2}
                            y={chartHeight - padding - ppoSuccessHeight}
                            width={barWidth}
                            height={ppoSuccessHeight}
                            fill="#2196f3"
                        />
                        <text
                            x={padding + spacing}
                            y={chartHeight - padding - ppoSuccessHeight - 5}
                            textAnchor="middle"
                            fontSize="14"
                            fontWeight="bold"
                            fill="#2196f3"
                        >
                            {(ppoMetrics.success_rate * 100).toFixed(1)}%
                        </text>
                        <text
                            x={padding + spacing}
                            y={chartHeight - padding + 20}
                            textAnchor="middle"
                            fontSize="12"
                            fill="#333"
                        >
                            PPO
                        </text>

                        {/* Heuristic Bar */}
                        <rect
                            x={padding + spacing + 120 - barWidth / 2}
                            y={chartHeight - padding - heuristicSuccessHeight}
                            width={barWidth}
                            height={heuristicSuccessHeight}
                            fill="#6c757d"
                        />
                        <text
                            x={padding + spacing + 120}
                            y={chartHeight - padding - heuristicSuccessHeight - 5}
                            textAnchor="middle"
                            fontSize="14"
                            fontWeight="bold"
                            fill="#6c757d"
                        >
                            {(heuristicMetrics.success_rate * 100).toFixed(1)}%
                        </text>
                        <text
                            x={padding + spacing + 120}
                            y={chartHeight - padding + 20}
                            textAnchor="middle"
                            fontSize="12"
                            fill="#333"
                        >
                            Heuristic
                        </text>

                        {/* Axes */}
                        <line
                            x1={padding}
                            y1={chartHeight - padding}
                            x2={chartWidth / 2 - padding}
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
                    </svg>
                </div>
            </div>
        </div>
    );
}
