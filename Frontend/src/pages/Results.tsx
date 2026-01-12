import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { simulateDisaster } from '../services/api';
import type { SimulationResponse, SimulationRequest } from '../types/simulation';

interface LocationState {
  simulationData?: SimulationResponse;
  request?: SimulationRequest;
}

/**
 * Results Page — God-Mode Control Room
 * 
 * "The disaster already ended. The system already stabilized the city.
 *  This screen is what remains afterward."
 * 
 * Design Pillars:
 * - City-as-Substrate: Faint depth field with parallax
 * - Six Relics: Spatial anchors on different depth planes
 * - Data as Motion: Halos, pulses, not numbers
 * - Ambient Breathing: Ultra-slow drift, light sweeps
 * - Final Statement: System voice, not UI explanation
 */
const Results: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  // Data State
  const [ppoResult, setPpoResult] = useState<SimulationResponse | null>(null);
  const [heuristicResult, setHeuristicResult] = useState<SimulationResponse | null>(null);

  // Interaction State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [stage, setStage] = useState<'substrate' | 'relics' | 'statement' | 'cta'>('substrate');
  const [breathPhase, setBreathPhase] = useState(0);

  // Fetch comparison data
  useEffect(() => {
    const fetch = async () => {
      let baseRequest = state?.request || { scenario: { max_timesteps: 50 }, policy_type: 'ppo', seed: 42 };

      if (state?.simulationData) {
        if (state.simulationData.metrics.policy_type === 'ppo') setPpoResult(state.simulationData);
        else setHeuristicResult(state.simulationData);
      }

      try {
        if (!ppoResult && state?.simulationData?.metrics.policy_type !== 'ppo') {
          const res = await simulateDisaster({ ...baseRequest, policy_type: 'ppo' });
          setPpoResult(res);
        }
        if (!heuristicResult && state?.simulationData?.metrics.policy_type !== 'heuristic') {
          const res = await simulateDisaster({ ...baseRequest, policy_type: 'heuristic' });
          setHeuristicResult(res);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetch();
  }, []);

  // Sequencer
  useEffect(() => {
    if (!ppoResult || !heuristicResult) return;

    setTimeout(() => setStage('relics'), 2000);
    setTimeout(() => setStage('statement'), 7000);
    setTimeout(() => setStage('cta'), 11000);
  }, [ppoResult, heuristicResult]);

  // Ambient Breathing
  useEffect(() => {
    const breathInterval = setInterval(() => {
      setBreathPhase(prev => (prev + 0.02) % (Math.PI * 2));
    }, 100);
    return () => clearInterval(breathInterval);
  }, []);

  // Micro-Parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 15;
    const y = (e.clientY / window.innerHeight - 0.5) * 15;
    setMousePos({ x, y });
  };

  if (!ppoResult || !heuristicResult) {
    return (
      <div style={{
        background: '#050505', height: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#3f3f46', letterSpacing: '4px', fontSize: '0.75rem'
      }}>
        INITIALIZING SYSTEM CONSCIOUSNESS...
      </div>
    );
  }

  const ppo = ppoResult.metrics;
  const base = heuristicResult.metrics;

  // Relics Data (Six Spatial Anchors)
  const relics = [
    {
      title: 'FORESIGHT',
      value: `${Math.round((1 - ppo.avg_casualties / base.avg_casualties) * 100)}%`,
      desc: 'Lives preserved through predictive allocation',
      depth: 0,
      glow: 0.3
    },
    {
      title: 'STABILIZATION',
      value: `${ppo.total_timesteps}`,
      desc: 'Cycles to achieve system equilibrium',
      depth: 20,
      glow: 0.25
    },
    {
      title: 'RESILIENCE',
      value: `${Math.round((1 - ppo.avg_hazard / base.avg_hazard) * 100)}%`,
      desc: 'Hazard mitigation efficiency',
      depth: 40,
      glow: 0.2
    },
    {
      title: 'EFFICIENCY',
      value: `${Math.round(ppo.avg_evacuation_progress * 100)}%`,
      desc: 'Evacuation completion under constraint',
      depth: 10,
      glow: 0.35
    },
    {
      title: 'AUTHORITY',
      value: `${Math.round(ppo.total_reward)}`,
      desc: 'Cumulative system confidence',
      depth: 30,
      glow: 0.28
    },
    {
      title: 'CONTROL',
      value: `${Math.round((base.avg_casualties - ppo.avg_casualties) * 1000)}`,
      desc: 'Differential lives under AI coordination',
      depth: 15,
      glow: 0.4
    }
  ];

  const breathIntensity = Math.sin(breathPhase) * 0.1 + 0.9;

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative', width: '100vw', height: '100vh',
        background: 'linear-gradient(180deg, #050505 0%, #0a0a0f 100%)',
        overflow: 'hidden',
        color: '#e2e8f0', fontFamily: 'system-ui, -apple-system, sans-serif',
        perspective: '1200px'
      }}
    >
      {/* City-as-Substrate (Faint Depth Field) */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 70% 60%, rgba(239, 68, 68, 0.02) 0%, transparent 50%)
        `,
        transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px) scale(${breathIntensity})`,
        transition: 'transform 0.8s ease-out',
        opacity: 0.6,
        pointerEvents: 'none'
      }}>
        {/* Abstract Heightfield Grid */}
        <svg width="100%" height="100%" style={{ opacity: 0.08 }}>
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Ambient Light Sweep */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 40%)',
        transform: `rotate(${breathPhase * 10}deg)`,
        transition: 'transform 2s linear',
        pointerEvents: 'none',
        opacity: 0.3
      }} />

      {/* Six Relics as Spatial Anchors */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '48px',
        padding: '80px',
        opacity: stage === 'substrate' ? 0 : 1,
        transition: 'opacity 2s ease-out'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '64px',
          maxWidth: '1000px'
        }}>
          {relics.map((relic, i) => (
            <div
              key={i}
              style={{
                transform: `
                  translateZ(${relic.depth}px) 
                  translate(${mousePos.x * (relic.depth / 100)}px, ${mousePos.y * (relic.depth / 100)}px)
                `,
                transition: 'transform 0.6s ease-out',
                opacity: 0,
                animation: `fadeInUp 1s ease-out ${i * 0.2}s forwards`
              }}
            >
              <div
                style={{
                  position: 'relative',
                  padding: '32px 0',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderTopColor = 'rgba(59, 130, 246, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderTopColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Radial Glow on Hover */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '200px',
                  height: '200px',
                  background: `radial-gradient(circle, rgba(59, 130, 246, ${relic.glow * breathIntensity}) 0%, transparent 70%)`,
                  pointerEvents: 'none',
                  opacity: 0,
                  transition: 'opacity 0.6s ease-out'
                }} className="relic-glow" />

                <div style={{
                  fontSize: '0.7rem',
                  color: '#64748b',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                  fontWeight: 600
                }}>
                  {relic.title}
                </div>

                {/* Data as Motion: Halo Thickness */}
                <div style={{
                  fontSize: '2rem',
                  color: 'rgba(255,255,255,0.9)',
                  marginBottom: '8px',
                  fontWeight: 200,
                  letterSpacing: '-1px',
                  textShadow: `0 0 ${20 * relic.glow * breathIntensity}px rgba(59, 130, 246, 0.4)`
                }}>
                  {relic.value}
                </div>

                <div style={{
                  fontSize: '0.85rem',
                  color: '#94a3b8',
                  lineHeight: 1.5,
                  maxWidth: '300px'
                }}>
                  {relic.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final Statement as System Voice */}
      {stage === 'statement' || stage === 'cta' ? (
        <div style={{
          position: 'absolute',
          bottom: '120px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          maxWidth: '800px',
          opacity: 0,
          animation: 'stabilize 2s ease-out 0.5s forwards'
        }}>
          {/* Horizon Line */}
          <div style={{
            position: 'absolute',
            top: '-40px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '400px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)'
          }} />

          <div style={{
            fontSize: '1.1rem',
            color: '#cbd5e1',
            letterSpacing: '1px',
            lineHeight: 1.8,
            fontWeight: 300,
            textShadow: '0 2px 20px rgba(0,0,0,0.5)'
          }}>
            Under identical conditions, AI coordination prevented systemic failure.
          </div>
        </div>
      ) : null}

      {/* Quiet CTA */}
      {stage === 'cta' && (
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '24px',
          opacity: 0,
          animation: 'fadeIn 1.5s ease-out 1s forwards'
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.5)',
              padding: '12px 24px',
              fontSize: '0.75rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.4s ease-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
            }}
          >
            Reset System
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes stabilize {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .relic-glow {
          opacity: 0;
        }
        div:hover > .relic-glow {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default Results;
