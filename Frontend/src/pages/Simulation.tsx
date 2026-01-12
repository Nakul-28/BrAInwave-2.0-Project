import { useLocation, useNavigate } from 'react-router-dom';
import type { SimulationResponse, SimulationRequest } from '../types/simulation';
import { SimulationPlayer } from '../components/SimulationPlayer';
import { StateVisualization } from '../components/StateVisualization';
import { ActionLog } from '../components/ActionLog';
import { RewardChart } from '../components/RewardChart';

interface LocationState {
  simulationData: SimulationResponse;
  request: SimulationRequest;
}

/**
 * Simulation Dashboard (CORE PAGE)
 * 
 * Live visualization of disaster response simulation.
 * Replays ML-driven decisions step-by-step.
 * 
 * Data source: SimulationResponse passed from Scenario Setup page
 * No additional API calls - uses router state as single source of truth
 */
const Simulation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as LocationState | null;

  // Handle missing data
  if (!state || !state.simulationData) {
    return (
      <div style={{
        maxWidth: '800px',
        margin: '100px auto',
        padding: '40px',
        textAlign: 'center',
        background: '#f9f9f9',
        borderRadius: '8px',
        border: '1px solid #ddd',
      }}>
        <h2>No Simulation Data</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Please run a simulation from the Scenario Setup page first.
        </p>
        <button
          onClick={() => navigate('/setup')}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Go to Scenario Setup
        </button>
      </div>
    );
  }

  const { simulationData, request } = state;
  const { trajectory, metrics } = simulationData;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      padding: '20px',
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto 20px',
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 10px 0' }}>Simulation Dashboard</h1>
            <p style={{ margin: 0, color: '#666' }}>
              Replaying {metrics.policy_type.toUpperCase()} policy execution
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
              Duration: {request.scenario.max_timesteps} timesteps
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              Total Steps: {trajectory.length}
            </div>
            {request.seed && (
              <div style={{ fontSize: '14px', color: '#666' }}>
                Seed: {request.seed}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <SimulationPlayer trajectory={trajectory}>
        {(currentStep, stepIndex, controls) => (
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
          }}>

            {/* Playback Controls */}
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}>
              <div style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '15px',
              }}>
                <button
                  onClick={controls.reset}
                  disabled={stepIndex === 0}
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    background: stepIndex === 0 ? '#ccc' : '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: stepIndex === 0 ? 'not-allowed' : 'pointer',
                  }}
                  title="Reset to beginning"
                >
                  ⏮ Reset
                </button>

                <button
                  onClick={controls.stepBackward}
                  disabled={stepIndex === 0}
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    background: stepIndex === 0 ? '#ccc' : '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: stepIndex === 0 ? 'not-allowed' : 'pointer',
                  }}
                  title="Step backward"
                >
                  ◀ Back
                </button>

                {!controls.isPlaying ? (
                  <button
                    onClick={controls.play}
                    style={{
                      padding: '10px 30px',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                    title="Play simulation"
                  >
                    ▶ Play
                  </button>
                ) : (
                  <button
                    onClick={controls.pause}
                    style={{
                      padding: '10px 30px',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      background: '#ffc107',
                      color: '#333',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                    title="Pause simulation"
                  >
                    ⏸ Pause
                  </button>
                )}

                <button
                  onClick={controls.stepForward}
                  disabled={stepIndex >= controls.totalSteps - 1}
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    background: stepIndex >= controls.totalSteps - 1 ? '#ccc' : '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: stepIndex >= controls.totalSteps - 1 ? 'not-allowed' : 'pointer',
                  }}
                  title="Step forward"
                >
                  Forward ▶
                </button>
              </div>

              {/* Progress Bar */}
              <div style={{ marginTop: '15px' }}>
                <div style={{
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '5px',
                  textAlign: 'center',
                }}>
                  Timestep {stepIndex} of {controls.totalSteps - 1}
                </div>

                <input
                  type="range"
                  min="0"
                  max={controls.totalSteps - 1}
                  value={stepIndex}
                  onChange={(e) => controls.goToStep(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    cursor: 'pointer',
                  }}
                />
              </div>
            </div>

            {/* Content Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '20px',
            }}>
              {/* State Visualization */}
              <StateVisualization
                state={currentStep.state}
                timestep={stepIndex}
              />

              {/* Action Log */}
              <ActionLog
                action={currentStep.action}
                timestep={stepIndex}
              />
            </div>

            {/* Reward Chart - Full Width */}
            <RewardChart
              trajectory={trajectory}
              currentStepIndex={stepIndex}
            />

            {/* Navigation Helper */}
            <div style={{
              marginTop: '20px',
              textAlign: 'center',
            }}>
              <button
                onClick={() => navigate('/setup')}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginRight: '10px',
                }}
              >
                ← Run New Simulation
              </button>

              <button
                onClick={() => navigate('/results', { state })}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                View Results →
              </button>
            </div>
          </div>
        )}
      </SimulationPlayer>
    </div>
  );
};

export default Simulation;
