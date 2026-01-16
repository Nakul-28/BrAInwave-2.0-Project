import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { SimulationResponse, SimulationRequest } from '../types/simulation';

interface LocationState {
    simulationData: SimulationResponse;
    request: SimulationRequest;
}

/**
 * Live City Simulation View — System-Driven Observation
 * 
 * RESPONSIBILITY:
 * - Consume backend simulation output verbatim
 * - Render cinematic visualization
 * - Control playback pacing (frontend-only)
 * - Control camera movement (reactive to backend state)
 * 
 * PROHIBITED:
 * - Computing risk values
 * - Computing metrics
 * - Interpreting meaning
 * - Modifying backend data
 */

/**
 * Live City Simulation View — Cinematic, System-Directed
 * 
 * "The map is the UI. Everything else is secondary."
 * 
 * Features:
 * - Full-screen MapLibre (Dark/Cinematic)
 * - System-driven camera (No manual pan/zoom)
 * - Auto-playing simulation (No user playback controls)
 * - Procedurally visualized zones & resources based on backend scalars
 * - Subtle "Subtitles" style HUD
 * - Moving Ambulance Agents (Dot Narrative)
 */
const LiveSimulationView: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);

    const state = location.state as LocationState | null;

    // Simulation State
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [simulationComplete, setSimulationComplete] = useState(false);

    // Fail fast on missing data (enforce backend contract)
    if (!state || !state.simulationData) {
        throw new Error("LiveSimulationView: Missing simulation data");
    }

    const { simulationData } = state;
    const { trajectory, zones, meta } = simulationData;

    // Validate required backend data
    if (!trajectory || trajectory.length === 0) {
        throw new Error("LiveSimulationView: Empty trajectory");
    }

    if (!zones || zones.length === 0) {
        throw new Error("LiveSimulationView: Missing zones");
    }

    const currentStep = trajectory[currentStepIndex];
    const totalSteps = trajectory.length;

    // 1. Initialize Map
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
                        paint: { 'raster-saturation': -0.8, 'raster-brightness-min': 0.3 } // Darken map
                    }
                ]
            },
            center: [77.2090, 28.6139], // Delhi
            zoom: 10.5,
            pitch: 0,
            bearing: 0,
            attributionControl: false,
            interactive: false // 🔒 NO USER INTERACTION
        });

        map.current.on('load', () => {
            // Add Zones
            map.current!.addSource('zones', {
                type: 'geojson',
                data: { type: 'FeatureCollection', features: [] }
            });

            // Zone Layer: Smooth Circles (No Heatmap Blobs)
            map.current!.addLayer({
                id: 'zones-layer',
                type: 'circle',
                source: 'zones',
                paint: {
                    'circle-radius': [
                        'interpolate', ['linear'], ['zoom'],
                        9, ['*', ['get', 'radius'], 0.02],
                        12, ['*', ['get', 'radius'], 0.08],
                        15, ['*', ['get', 'radius'], 0.3],
                    ],
                    'circle-color': [
                        'match', ['get', 'status'],
                        'critical', '#ef4444', // Red
                        'risk', '#f59e0b',     // Amber
                        'safe', '#10b981',     // Green
                        '#10b981'
                    ],
                    'circle-opacity': 0.5,
                    'circle-blur': 0.6,
                    'circle-stroke-width': 0
                }
            });

            // Ambulance Agent Layer (Moving Dot)
            map.current!.addSource('ambulance-point', {
                type: 'geojson',
                data: { type: 'FeatureCollection', features: [] }
            });

            map.current!.addLayer({
                id: 'ambulance-dot',
                type: 'circle',
                source: 'ambulance-point',
                paint: {
                    'circle-radius': 6,
                    'circle-color': '#ffffff',
                    'circle-stroke-color': '#3b82f6',
                    'circle-stroke-width': 2,
                    'circle-opacity': 1
                }
            });

            // Start Simulation Sequence
            setTimeout(() => setIsPlaying(true), 2000);
        });

        return () => {
            if (map.current) map.current.remove();
            map.current = null;
        };
    }, []);

    // 2. Playback Engine (System Driven)
    useEffect(() => {
        if (!isPlaying) return;

        if (currentStepIndex >= totalSteps - 1) {
            setIsPlaying(false);
            setSimulationComplete(true);

            // Final Camera Pullback
            if (map.current) {
                map.current.easeTo({
                    center: [77.2090, 28.6139],
                    zoom: 10.5,
                    pitch: 0,
                    bearing: 0,
                    duration: 3000
                });
            }
            return;
        }

        const timer = setTimeout(() => {
            setCurrentStepIndex(prev => prev + 1);
        }, 1200); // Slower, more cinematic pace

        return () => clearTimeout(timer);
    }, [isPlaying, currentStepIndex, totalSteps]);

    // 3. Visual State Update & Camera Director (BACKEND-DRIVEN)
    useEffect(() => {
        if (!map.current || !map.current.getSource('zones')) return;

        const source = map.current.getSource('zones') as maplibregl.GeoJSONSource;

        // Use backend zones[] directly - NO FRONTEND COMPUTATION
        const features = zones.map(zone => {
            // ✅ Read backend risk verbatim from risk_trajectory
            // Fallback to static risk for backward compatibility
            const currentRisk = zone.risk_trajectory?.[currentStepIndex] ?? zone.risk;

            // Map backend risk to visual color status (UNCHANGED)
            let status = 'safe';
            if (currentRisk > 0.6) status = 'critical';
            else if (currentRisk > 0.3) status = 'risk';

            return {
                type: 'Feature' as const,
                id: zone.id,
                properties: {
                    radius: 2000, // Fixed visual radius
                    status: status
                },
                geometry: {
                    type: 'Point' as const,
                    coordinates: [zone.lng, zone.lat] as [number, number]
                }
            };
        });

        source.setData({ type: 'FeatureCollection', features: features });

        // Simple camera movement (original logic)
        const mapInstance = map.current;
        if (!simulationComplete && mapInstance) {
            const currentBearing = mapInstance.getBearing();

            // Smooth camera movement
            mapInstance.easeTo({
                zoom: 10.8,
                pitch: 10,
                bearing: currentBearing + 2,
                duration: 4000,
                easing: t => t * (2 - t)
            });
        }
    }, [currentStepIndex, zones, simulationComplete, currentStep, trajectory]);

    // 🚑 Ambulance Animation Removed
    // System no longer visualizes individual units, focusing on 'God View' zones.

    // 🚑 Removed Ambulance Agent as per User Request ("Irritating dot")

    // 4. Resource Agents (Visual FX)
    // We simulate "Dispatch" flashes when the action is "expedite_routes" or "distribute_evenly"
    const isDispatching = ['expedite_routes', 'distribute_evenly'].includes(currentStep.action.name);

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#000', overflow: 'hidden' }}>

            {/* City Canvas */}
            <div ref={mapContainer} style={{ width: '100%', height: '100%', filter: 'brightness(0.5) contrast(1.1) saturate(0.9)' }} />

            {/* Intro Overlay */}
            {currentStepIndex === 0 && (
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.6)',
                    animation: 'fadeOut 1s ease-in 2s forwards', pointerEvents: 'none'
                }}>
                    <h1 style={{ color: '#ef4444', fontSize: '2rem', letterSpacing: '4px', textTransform: 'uppercase' }}>
                        Magnitude 7.0 Earthquake
                    </h1>
                    <p style={{ color: '#fff', opacity: 0.8, letterSpacing: '2px' }}>
                        SYSTEM ACTIVATED
                    </p>
                </div>
            )}

            {/* Dispatch FX Layer */}
            {isPlaying && isDispatching && (
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                    animation: 'pulse 2s infinite'
                }} />
            )}

            {/* 🧾 Cinematic HUD (Subtitles Style) */}

            {/* Top Left: Time & Strategy */}
            <div style={{
                position: 'absolute', top: 32, left: 32,
                color: 'rgba(255,255,255,0.9)', fontFamily: 'monospace',
                textShadow: '0 2px 4px rgba(0,0,0,0.8)'
            }}>
                <div style={{ fontSize: '0.8rem', letterSpacing: '2px', opacity: 0.7 }}>T + {currentStepIndex * 5} MIN</div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', marginTop: '4px' }}>
                    STRATEGY: <span style={{ color: '#3b82f6' }}>{meta.policy.toUpperCase()}</span>
                </div>
            </div>

            {/* Top Right: Critical Metrics (Only appear if high) */}
            <div style={{
                position: 'absolute', top: 32, right: 32, textAlign: 'right',
                color: 'white', fontFamily: 'monospace'
            }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>
                    {Math.round(currentStep.state.casualties * 1000)}
                </div>
                <div style={{ fontSize: '0.7rem', opacity: 0.7, letterSpacing: '1px' }}>EST. CASUALTIES</div>
            </div>

            {/* Bottom Center: System Status */}
            <div style={{
                position: 'absolute', bottom: 48, left: '50%', transform: 'translateX(-50%)',
                color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', letterSpacing: '2px',
                textTransform: 'uppercase', textAlign: 'center'
            }}>
                {simulationComplete ? (
                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>• SYSTEM STABILIZED •</span>
                ) : (
                    <span>Processing: {currentStep.action.name.replace(/_/g, ' ')}</span>
                )}
            </div>


            {/* 🏁 End State: CTA */}
            {simulationComplete && (
                <div style={{
                    position: 'absolute', bottom: 120, left: '50%', transform: 'translateX(-50%)',
                    animation: 'fadeIn 1s ease-out'
                }}>
                    <button
                        onClick={() => navigate('/results', { state })}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: 'white',
                            padding: '16px 32px',
                            fontSize: '1rem',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    >
                        View Mission Results →
                    </button>
                </div>
            )}

            <style>{`
        @keyframes fadeOut { to { opacity: 0; } }
        @keyframes fadeIn { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }
        @keyframes pulse { 0% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 0; } }
      `}</style>
        </div>
    );
};

export default LiveSimulationView;
