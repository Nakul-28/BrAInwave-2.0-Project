import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { simulateDisaster } from '../services/api';
import type { SimulationRequest, SimulationResponse } from '../types/simulation';

/**
 * Scenario Setup — "God-Mode Briefing Chamber"
 * 
 * "The system already understands the city. You are granting permission."
 * 
 * Design Pillars:
 * 1. Monolith: Solid, surgical left panel.
 * 2. Substrate: Living, breathing map on the right.
 * 3. Authority: Inputs framed as permissions, not settings.
 */
const ScenarioSetup: React.FC = () => {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  // Form state
  const [maxTimesteps, setMaxTimesteps] = useState<number>(50);
  const [policyType, setPolicyType] = useState<"ppo" | "heuristic">("ppo");
  const [seed, setSeed] = useState<string>("");

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isHoveringCTA, setIsHoveringCTA] = useState(false);

  // Map Setup (Living Substrate)
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current!,
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
              'raster-saturation': -1,
              'raster-brightness-min': 0.15,
              'raster-contrast': 0.2 // Flat, substrate look
            }
          }
        ]
      },
      center: [77.2090, 28.6139],
      zoom: 11.5,
      pitch: 0,
      interactive: false
    });

    // Slow Ambient Drift
    let frameId: number;
    const drift = () => {
      if (!map.current) return;
      const center = map.current.getCenter();
      // Sub-pixel drift
      map.current.easeTo({
        center: [center.lng + 0.00001, center.lat],
        duration: 1000,
        easing: t => t
      });
      // frameId = requestAnimationFrame(drift); // Too jerky for MapLibre, rely on CSS transform for smoothness if possible
    };
    // Actually, CSS transform on container is smoother for subtle drift
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#020617', overflow: 'hidden', fontFamily: 'system-ui, sans-serif' }}>

      {/* 1. Briefing Monolith (Left) */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: '500px', flexShrink: 0,
        background: '#0f172a',
        borderRight: '1px solid #1e293b',
        display: 'flex', flexDirection: 'column',
        boxShadow: '20px 0 50px rgba(0,0,0,0.5)'
      }}>
        <div style={{ padding: '60px 40px', flex: 1 }}>
          {/* Header */}
          <div style={{ marginBottom: '60px' }}>
            <div style={{ color: '#475569', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 600 }}>
              Restricted Access // Level 5
            </div>
            <h1 style={{ color: '#f8fafc', fontSize: '2rem', fontWeight: 300, margin: 0, letterSpacing: '-0.5px' }}>
              Awaiting Authorization
            </h1>
            <div style={{ width: '40px', height: '2px', background: '#3b82f6', marginTop: '24px' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

            {/* Auth 1: Duration */}
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
                Operational Authority Duration
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <input
                  type="range" min="10" max="100" step="5"
                  value={maxTimesteps} onChange={e => setMaxTimesteps(parseInt(e.target.value))}
                  className="monolith-range"
                  style={{ flex: 1, cursor: 'pointer' }}
                />
                <div style={{ color: '#f1f5f9', fontFamily: 'monospace', fontSize: '1.2rem', minWidth: '60px', textAlign: 'right' }}>
                  {maxTimesteps}m
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '8px' }}>
                Beyond this window, autonomous escalation may be required.
              </div>
            </div>

            {/* Auth 2: Strategy */}
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
                Delegation of Cognition
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* PPO */}
                <div
                  onClick={() => setPolicyType('ppo')}
                  style={{
                    padding: '20px',
                    background: policyType === 'ppo' ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                    border: policyType === 'ppo' ? '1px solid #3b82f6' : '1px solid #334155',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ color: policyType === 'ppo' ? '#60a5fa' : '#cbd5e1', fontWeight: 600 }}>AI AGENT (PPO)</span>
                    {policyType === 'ppo' && <span style={{ fontSize: '0.7rem', color: '#60a5fa', border: '1px solid #60a5fa', padding: '2px 6px' }}>PRIMARY</span>}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Adaptive coordination across total city state.</div>
                </div>

                {/* Heuristic */}
                <div
                  onClick={() => setPolicyType('heuristic')}
                  style={{
                    padding: '20px',
                    border: policyType === 'heuristic' ? '1px solid #94a3b8' : '1px solid #1e293b',
                    cursor: 'pointer', transition: 'all 0.2s', opacity: 0.6
                  }}
                >
                  <div style={{ color: '#cbd5e1', fontWeight: 600, marginBottom: '4px' }}>BASELINE HEURISTIC</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Rule-based protocol for reference.</div>
                </div>
              </div>
            </div>

            {/* Auth 3: Seed */}
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
                Reproducibility Lock
              </label>
              <input
                type="text" placeholder="NO LOCK ENGAGED"
                value={seed} onChange={e => setSeed(e.target.value)}
                style={{
                  width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #334155',
                  color: '#f1f5f9', padding: '8px 0', outline: 'none', fontFamily: 'monospace'
                }}
              />
              <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '8px' }}>
                Enforces identical conditions for accountability.
              </div>
            </div>

            {/* CTA Seal */}
            <button
              type="submit"
              onMouseEnter={() => setIsHoveringCTA(true)}
              onMouseLeave={() => setIsHoveringCTA(false)}
              disabled={isLoading}
              style={{
                marginTop: '20px', padding: '24px', background: '#0f172a',
                border: '1px solid #334155', color: isHoveringCTA ? '#f1f5f9' : '#94a3b8',
                letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.9rem',
                cursor: isLoading ? 'wait' : 'pointer', transition: 'all 0.3s',
                position: 'relative', overflow: 'hidden'
              }}
            >
              {isLoading ? 'ESTABLISHING CONNECTION...' : 'INITIATE RESPONSE SIMULATION'}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, height: '2px', background: '#3b82f6',
                width: isHoveringCTA ? '100%' : '0%', transition: 'width 0.3s ease-out'
              }} />
            </button>

          </form>
        </div>
      </div>

      {/* 2. Living Substrate (Right) */}
      <div style={{ flex: 1, position: 'relative', background: '#000' }}>
        <div ref={mapContainer} style={{ width: '100%', height: '100%', opacity: isHoveringCTA ? 0.4 : 0.6, transition: 'opacity 0.5s', filter: 'grayscale(1) invert(0.1)' }} />

        {/* Vignette */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 50%, transparent 20%, #020617 100%)', pointerEvents: 'none' }} />

        {/* Status Indicator */}
        <div style={{ position: 'absolute', top: 40, right: 40, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }} />
          <div style={{ color: '#10b981', fontSize: '0.75rem', letterSpacing: '2px', fontFamily: 'monospace' }}>SYSTEM ONLINE</div>
        </div>
      </div>

      <style>{`
                .monolith-range { -webkit-appearance: none; height: 2px; background: #334155; }
                .monolith-range::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; background: #0f172a; border: 2px solid #94a3b8; border-radius: 50%; cursor: pointer; }
                .monolith-range::-webkit-slider-thumb:hover { border-color: #f1f5f9; background: #334155; }
            `}</style>
    </div>
  );
};

export default ScenarioSetup;
