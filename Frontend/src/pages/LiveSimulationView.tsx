import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { SimulationResponse, SimulationRequest, SimulationStep } from '../types/simulation';

interface LocationState {
    simulationData: SimulationResponse;
    request: SimulationRequest;
}

// Reuse Landing Page Zone Definitions for Visual Continuity
const IMPACT_ZONES = [
    { id: 'zone_1', name: 'Rohini', coords: [77.085, 28.73], baseRadius: 3500 },
    { id: 'zone_2', name: 'Pitampura', coords: [77.14, 28.70], baseRadius: 2500 },
    { id: 'zone_3', name: 'Connaught Place', coords: [77.215, 28.625], baseRadius: 2000 },
    { id: 'zone_4', name: 'Dwarka', coords: [77.045, 28.58], baseRadius: 2200 },
    { id: 'zone_5', name: 'Saket', coords: [77.22, 28.515], baseRadius: 1800 },
    { id: 'zone_6', name: 'Karol Bagh', coords: [77.195, 28.65], baseRadius: 2200 },
    { id: 'zone_7', name: 'Vasant Vihar', coords: [77.155, 28.55], baseRadius: 1600 },
    { id: 'zone_8', name: 'Noida Border', coords: [77.325, 28.58], baseRadius: 1900 },
];

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
    const [cameraState, setCameraState] = useState<'overview' | 'focus' | 'stabilize'>('overview');

    // Handle Missing Data
    if (!state || !state.simulationData || !state.request) {
        return <div style={{ height: '100vh', background: '#000' }} />;
    }

    const { simulationData } = state;
    const { trajectory, metrics } = simulationData;
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

    // 3. Visual State Update & Camera Director
    useEffect(() => {
        if (!map.current || !map.current.getSource('zones')) return;

        const source = map.current.getSource('zones') as maplibregl.GeoJSONSource;
        const { hazard, casualties, evacuation_progress } = currentStep.state;

        // Cinematic State Calculation
        const globalRisk = (hazard + casualties + (1 - evacuation_progress)) / 3;

        // Prodedural Zone Updates
        const features = IMPACT_ZONES.map((zone, i) => {
            // Add subtle variance so zones don't flash in unison
            const zoneMod = (i * 0.15);
            const zoneRisk = Math.min(1, Math.max(0, globalRisk + (Math.sin(currentStepIndex + i) * 0.1)));

            let status = 'safe';
            if (zoneRisk > 0.6) status = 'critical';
            else if (zoneRisk > 0.3) status = 'risk';

            return {
                type: 'Feature' as const,
                id: zone.id,
                properties: {
                    radius: zone.baseRadius,
                    status: status
                },
                geometry: { type: 'Point' as const, coordinates: zone.coords as [number, number] }
            };
        });

        source.setData({ type: 'FeatureCollection', features: features });

        // 🎥 Advanced Camera Director (Continuous Flow)
        // Moves the camera slowly and continuously based on tension.

        const mapInstance = map.current;
        if (!simulationComplete && mapInstance) {
            const currentZoom = mapInstance.getZoom();
            const currentPitch = mapInstance.getPitch();
            const currentBearing = mapInstance.getBearing();

            let targetZoom = 10.8;
            let targetPitch = 10;

            // High Tension = Zoom In, High Pitch (Drama)
            if (globalRisk > 0.6) {
                targetZoom = 12.5;
                targetPitch = 50;
            }

            // Calculate a subtle drift
            // We use easeTo with long duration to make it continuous
            mapInstance.easeTo({
                zoom: targetZoom,
                pitch: targetPitch,
                bearing: currentBearing + 2, // Constant slow rotation
                duration: 4000,
                easing: t => t * (2 - t) // Smooth ease-out
            });
        }
    }, [currentStepIndex, currentStep, simulationComplete]);

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
                    STRATEGY: <span style={{ color: '#3b82f6' }}>{metrics.policy_type.toUpperCase()}</span>
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
