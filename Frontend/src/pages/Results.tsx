import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { SimulationResponse } from '../types/simulation';
import { deriveRelics, type Relic } from '../utils/relicDerivations';

interface LocationState {
  simulationData?: SimulationResponse;
}

/**
 * Results Page — Post-Incident Authority Chamber
 * 
 * RESPONSIBILITY:
 * - Consume backend metrics blindly (final_metrics, baseline_metrics)
 * - Derive symbolic relics deterministically
 * - Present outcomes without explanation
 * 
 * PROHIBITED:
 * - Displaying raw JSON
 * - Tables or charts
 * - Side-by-side comparisons
 * - Explaining formulas
 * - Mentioning PPO/RL/heuristics
 * 
 * Backend = Truth. Frontend = Expression.
 */
const Results: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  // Data State - Now we only need one response since backend provides both
  const [simulationData, setSimulationData] = useState<SimulationResponse | null>(null);

  // Interaction State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [stage, setStage] = useState<'substrate' | 'relics' | 'statement' | 'cta'>('substrate');

  // Load simulation data
  useEffect(() => {
    if (state?.simulationData) {
      setSimulationData(state.simulationData);
    }
  }, []);

  // Sequencer
  useEffect(() => {
    if (!simulationData) return;

    // Timeline
    setTimeout(() => setStage('relics'), 2000); // Reveal relics
    setTimeout(() => setStage('statement'), 8000); // Reveal final truth
    setTimeout(() => setStage('cta'), 12000); // Allow exit
  }, [simulationData]);

  // Map Substrate
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
              'raster-contrast': 0.2,
              'raster-brightness-min': 0.1,
              'raster-opacity': 0.4
            }
          }
        ]
      },
      center: [77.2090, 28.6139],
      zoom: 12,
      pitch: 60, // Severe tilt for "Substrate" feel
      bearing: -15,
      interactive: false
    });

    // "Ghost Traces" - Static lines representing healed routes
    map.current.on('load', () => {
      // We pretend we have routes. In a real app we'd use the trajectory.
      // Here we add a faint network layer.
      map.current!.addSource('traces', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });
      // ... (Empty for now to strictly follow "no live movement" rule, relying on the 'Substrate' aesthetic)
    });

  }, []);

  // Micro-Parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20; // -10 to 10 deg
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  if (!simulationData) return <div style={{ background: '#09090b', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3f3f46', letterSpacing: '4px' }}>INITIALIZING SYSTEM CONSCIOUSNESS...</div>;

  // Derive relics from backend metrics (deterministic)
  const relics = deriveRelics(
    simulationData.final_metrics,
    simulationData.baseline_metrics
  );

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative', width: '100vw', height: '100vh',
        background: '#050505', overflow: 'hidden',
        color: '#e2e8f0', fontFamily: 'system-ui, -apple-system, sans-serif',
        perspective: '1000px' // For 3D relics
      }}
    >

      {/* 1. Substrate (The City) */}
      <div
        ref={mapContainer}
        style={{
          width: '100%', height: '100%', opacity: 0.6,
          filter: 'grayscale(100%) invert(0%) sepia(20%) hue-rotate(180deg)', // Cold tech feel
          transition: 'transform 0.2s ease-out',
          // Micro-parallax on the map itself
          transform: `scale(1.05) translate(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px)`
        }}
      />

      {/* Ambient Noise / Grain */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.05, background: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+")', pointerEvents: 'none' }} />

      {/* 2. Relics Chamber */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: (stage === 'relics' || stage === 'statement' || stage === 'cta') ? 1 : 0,
        transition: 'opacity 2s ease-in-out'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '60px', width: '80%', maxWidth: '1200px' }}>

          {/* FORESIGHT */}
          {relics.foresight.visible && (
            <Relic
              label={relics.foresight.label}
              value={relics.foresight.value}
              desc={relics.foresight.description}
              mousePos={mousePos} delay={0}
            />
          )}

          {/* STABILIZATION */}
          {relics.stabilization.visible && (
            <Relic
              label={relics.stabilization.label}
              value={relics.stabilization.value}
              desc={relics.stabilization.description}
              mousePos={mousePos} delay={200}
            />
          )}

          {/* RESILIENCE */}
          {relics.resilience.visible && (
            <Relic
              label={relics.resilience.label}
              value={relics.resilience.value}
              desc={relics.resilience.description}
              mousePos={mousePos} delay={400} highlight
            />
          )}

          {/* EFFICIENCY */}
          {relics.efficiency.visible && (
            <Relic
              label={relics.efficiency.label}
              value={relics.efficiency.value}
              desc={relics.efficiency.description}
              mousePos={mousePos} delay={600}
            />
          )}

          {/* AUTHORITY */}
          {relics.authority.visible && (
            <Relic
              label={relics.authority.label}
              value={relics.authority.value}
              desc={relics.authority.description}
              mousePos={mousePos} delay={800}
            />
          )}

          {/* CONTROL */}
          {relics.control.visible && (
            <Relic
              label={relics.control.label}
              value={relics.control.value}
              desc={relics.control.description}
              mousePos={mousePos} delay={1000}
            />
          )}

        </div>
      </div>

      {/* 3. The Proclamation */}
      <div style={{
        position: 'absolute', bottom: '15%', left: 0, right: 0, textAlign: 'center',
        opacity: (stage === 'statement' || stage === 'cta') ? 1 : 0, transition: 'all 2s ease',
        transform: (stage === 'statement' || stage === 'cta') ? 'translateY(0)' : 'translateY(20px)',
        pointerEvents: 'none'
      }}>
        <h2 style={{
          fontSize: '1.8rem', fontWeight: 200, letterSpacing: '2px', color: '#f8fafc',
          textShadow: '0 0 30px rgba(59, 130, 246, 0.3)'
        }}>
          Under identical conditions, <span style={{ fontWeight: 400, color: '#60a5fa' }}>AI coordination</span> prevented systemic failure.
        </h2>
      </div>

      {/* 4. Quiet CTA */}
      <div style={{
        position: 'absolute', bottom: '8%', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '32px',
        opacity: stage === 'cta' ? 1 : 0, transition: 'opacity 1.5s ease',
        pointerEvents: 'auto'
      }}>
        <button
          onClick={() => navigate('/report', {
            state: {
              ppoResult: simulationData,
              heuristicResult: {
                ...simulationData,
                final_metrics: simulationData.baseline_metrics
              },
              scenarioConfig: state?.request || {}
            }
          })}
          className="god-btn"
          style={{ background: 'transparent', color: 'rgba(255,255,255,0.7)', border: 'none', fontSize: '0.9rem', letterSpacing: '2px', cursor: 'pointer', textTransform: 'uppercase' }}
        >
          [ Generate Artifact ]
        </button>
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }} />
        <button
          onClick={() => navigate('/setup')}
          className="god-btn"
          style={{ background: 'transparent', color: 'rgba(255,255,255,0.7)', border: 'none', fontSize: '0.9rem', letterSpacing: '2px', cursor: 'pointer', textTransform: 'uppercase' }}
        >
          [ Reset System ]
        </button>
      </div>

      <style>{`
                .god-btn:hover { color: white !important; text-shadow: 0 0 10px rgba(255,255,255,0.5); }
            `}</style>
    </div>
  );
};

const Relic = ({ label, value, desc, mousePos, delay, highlight }: any) => {
  // 3D Parallax Calculation
  // We invert mouse pos to make elements look like they are floating "inside"
  const rotateX = mousePos.y * -1;
  const rotateY = mousePos.x;

  return (
    <div
      style={{
        opacity: 0, animation: `fadeIn 1s ease forwards ${delay}ms`,
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.1s ease-out',
        position: 'relative',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
      }}
    >
      {/* Halo / Energy */}
      <div style={{
        width: '220px', height: '220px', borderRadius: '50%',
        border: highlight ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(255,255,255,0.1)',
        boxShadow: highlight ? '0 0 40px rgba(59, 130, 246, 0.1)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '40px', position: 'relative'
      }}>
        {/* Inner Pulse */}
        <div style={{
          position: 'absolute', inset: '4px', borderRadius: '50%',
          border: '1px dashed rgba(255,255,255,0.1)',
          animation: 'spin 20s linear infinite'
        }} />

        <div style={{
          fontSize: '2rem',
          fontWeight: 300,
          color: highlight ? '#93c5fd' : 'rgba(255, 255, 255, 0.92)',
          letterSpacing: '-0.015em',
          textShadow: highlight
            ? '0 0 8px rgba(96, 165, 250, 0.55), 0 0 22px rgba(96, 165, 250, 0.45), 0 0 48px rgba(96, 165, 250, 0.25)'
            : '0 0 4px rgba(255, 255, 255, 0.25), 0 0 10px rgba(255, 255, 255, 0.15)',
          transform: 'translateY(2px)',
          animation: highlight ? 'auraBreath 8s ease-in-out infinite' : 'none'
        }}>
          {value}
        </div>
      </div>

      <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(148, 163, 184, 0.85)', marginBottom: '16px', textShadow: '0 0 6px rgba(255, 255, 255, 0.08)' }}>{label}</div>
      <div style={{ fontSize: '0.82rem', fontWeight: 400, lineHeight: 1.6, color: 'rgba(203, 213, 225, 0.75)', maxWidth: '280px', textShadow: 'none' }}>{desc}</div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes auraBreath {
          0%   { text-shadow: 0 0 8px rgba(96, 165, 250, 0.55), 0 0 18px rgba(96, 165, 250, 0.35); }
          50%  { text-shadow: 0 0 12px rgba(96, 165, 250, 0.65), 0 0 28px rgba(96, 165, 250, 0.55), 0 0 52px rgba(96, 165, 250, 0.35); }
          100% { text-shadow: 0 0 8px rgba(96, 165, 250, 0.55), 0 0 18px rgba(96, 165, 250, 0.35); }
        }
      `}</style>
    </div>
  );
};

export default Results;
