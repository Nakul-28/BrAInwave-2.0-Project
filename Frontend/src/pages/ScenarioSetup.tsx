import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { simulateDisaster } from '../services/api';
import type { SimulationRequest } from '../types/simulation';

const ScenarioSetup: React.FC = () => {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  // Form state
  const [maxTimesteps, setMaxTimesteps] = useState<number>(50);
  const [policyType, setPolicyType] = useState<"ppo" | "heuristic">("ppo");
  const [seed, setSeed] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Initialize Map Background
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        name: 'OSM Raster',
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: ''
          }
        },
        layers: [
          {
            id: 'osm-layer',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 22,
            paint: {
              'raster-saturation': -0.5,
              'raster-brightness-min': 0.4,
              'raster-opacity': 0.6
            }
          }
        ]
      },
      center: [77.2090, 28.6139],
      zoom: 11,
      pitch: 0,
      interactive: false,
      attributionControl: false
    });

    return () => {
      if (map.current) map.current.remove();
      map.current = null;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const request: SimulationRequest = {
        scenario: { max_timesteps: maxTimesteps },
        policy_type: policyType,
        ...(seed.trim() !== "" && { seed: parseInt(seed) }),
      };
      const response = await simulateDisaster(request);
      navigate('/simulate', { state: { simulationData: response, request } });
    } catch (err) {
      console.error(err);
      setError("Failed to start simulation. Please check your backend connection.");
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Map Background */}
      <div ref={mapContainer} style={{ position: 'absolute', inset: 0 }} />

      {/* Gradient Overlay for Aura Effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 30% 50%, rgba(102, 126, 234, 0.4) 0%, rgba(118, 75, 162, 0.3) 50%, transparent 100%)',
        pointerEvents: 'none'
      }} />

      {/* Centered Glassmorphic Card */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 80px rgba(102, 126, 234, 0.3)',
          padding: '40px',
          maxWidth: '420px',
          width: '100%'
        }}>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: 'white',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            Scenario Setup
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '30px',
            fontSize: '0.9rem'
          }}>
            Configure your disaster simulation parameters
          </p>

          <form onSubmit={handleSubmit}>
            {/* Max Timesteps */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '8px'
              }}>
                Simulation Duration (Timesteps)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={maxTimesteps}
                  onChange={(e) => setMaxTimesteps(parseInt(e.target.value))}
                  style={{
                    flex: 1,
                    accentColor: '#667eea'
                  }}
                />
                <span style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#667eea',
                  minWidth: '50px',
                  textAlign: 'right',
                  textShadow: '0 0 10px rgba(102, 126, 234, 0.5)'
                }}>
                  {maxTimesteps}
                </span>
              </div>
            </div>

            {/* Policy Type */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '8px'
              }}>
                Policy Type
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setPolicyType('ppo')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: policyType === 'ppo' ? '2px solid rgba(102, 126, 234, 0.8)' : '2px solid rgba(255, 255, 255, 0.2)',
                    background: policyType === 'ppo' ? 'rgba(102, 126, 234, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: 'white',
                    transition: 'all 0.3s',
                    backdropFilter: 'blur(10px)',
                    boxShadow: policyType === 'ppo' ? '0 0 20px rgba(102, 126, 234, 0.4)' : 'none'
                  }}
                >
                  AI (PPO)
                </button>
                <button
                  type="button"
                  onClick={() => setPolicyType('heuristic')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: policyType === 'heuristic' ? '2px solid rgba(102, 126, 234, 0.8)' : '2px solid rgba(255, 255, 255, 0.2)',
                    background: policyType === 'heuristic' ? 'rgba(102, 126, 234, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: 'white',
                    transition: 'all 0.3s',
                    backdropFilter: 'blur(10px)',
                    boxShadow: policyType === 'heuristic' ? '0 0 20px rgba(102, 126, 234, 0.4)' : 'none'
                  }}
                >
                  Heuristic
                </button>
              </div>
            </div>

            {/* Seed */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '8px'
              }}>
                Random Seed (Optional)
              </label>
              <input
                type="text"
                placeholder="Leave empty for random"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  outline: 'none',
                  color: 'white',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(102, 126, 234, 0.8)';
                  e.target.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.2)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                borderRadius: '10px',
                marginBottom: '16px',
                fontSize: '0.875rem',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                background: isLoading ? 'rgba(160, 174, 192, 0.3)' : 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(102, 126, 234, 0.6)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)';
              }}
            >
              {isLoading ? 'Starting Simulation...' : 'Start Simulation'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScenarioSetup;
