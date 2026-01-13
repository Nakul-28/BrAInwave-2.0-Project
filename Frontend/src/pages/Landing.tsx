import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Navbar from '../components/Navbar';
import FeatureCards from '../components/FeatureCards';
import TechStack from '../components/TechStack';
import Footer from '../components/Footer';
import '../styles/Landing.css';

/**
 * Landing Page — Radial Impact Circles Narrative
 * 
 * This is a LANDING PAGE, not a simulation or dashboard.
 * All visuals are SCRIPTED and NARRATIVE-DRIVEN.
 * 
 * Why Circles Instead of Squares?
 * - Circles represent "impact radiuses", not administrative boundaries
 * - They feel organic and probabilistic, not precise
 * - Soft radial gradients communicate uncertainty naturally
 * - No sharp edges = no false precision implied
 * - Better for storytelling: "how far can disaster spread?"
 * 
 * Why Scripted Visuals?
 * - Landing pages should be fast and predictable
 * - This is visual explanation, not live analytics
 * - Actual simulations happen in /simulate page
 * - Narrative should be repeatable and controllable
 * 
 * How Scroll Controls the Narrative:
 * - Scroll position determines discrete visual states
 * - Each scroll section = one narrative beat
 * - Changes happen at thresholds, not continuously
 * - 7 states total: CALM → INITIAL_SHOCK → SPREAD → ESCALATION → DECISION_HINT → OUTCOME_TEASE → CTA
 */

/**
 * Impact Circle Data Structure
 * 
 * Each circle represents a disaster impact zone with:
 * - coordinates: center point [lng, lat]
 * - baseRadius: size in meters
 * - severity: color category (red/yellow/green)
 * - opacity: visibility level
 * - name: Delhi landmark (for reference only)
 */
interface ImpactCircle {
  id: string;
  coordinates: [number, number];
  baseRadius: number;
  severity: 'red' | 'yellow' | 'green';
  opacity: number;
  name: string;
}

/**
 * Hardcoded Demo Circles
 * 
 * These positions are fixed and scripted for the narrative.
 * They do NOT represent real-time data or exact geographic analysis.
 */
const DEMO_CIRCLES: ImpactCircle[] = [
  {
    id: 'circle_1',
    coordinates: [77.085, 28.73], // Rohini (epicenter)
    baseRadius: 3500,
    severity: 'red',
    opacity: 0.7,
    name: 'Rohini',
  },
  {
    id: 'circle_2',
    coordinates: [77.14, 28.70], // Pitampura
    baseRadius: 2500,
    severity: 'red',
    opacity: 0.65,
    name: 'Pitampura',
  },
  {
    id: 'circle_3',
    coordinates: [77.215, 28.625], // Connaught Place
    baseRadius: 2000,
    severity: 'yellow',
    opacity: 0.6,
    name: 'Connaught Place',
  },
  {
    id: 'circle_4',
    coordinates: [77.045, 28.58], // Dwarka
    baseRadius: 2200,
    severity: 'yellow',
    opacity: 0.6,
    name: 'Dwarka',
  },
  {
    id: 'circle_5',
    coordinates: [77.22, 28.515], // Saket
    baseRadius: 1800,
    severity: 'yellow',
    opacity: 0.55,
    name: 'Saket',
  },
  {
    id: 'circle_6',
    coordinates: [77.195, 28.65], // Karol Bagh
    baseRadius: 2200,
    severity: 'red',
    opacity: 0.65,
    name: 'Karol Bagh',
  },
  {
    id: 'circle_7',
    coordinates: [77.155, 28.55], // Vasant Vihar
    baseRadius: 1600,
    severity: 'green',
    opacity: 0.5,
    name: 'Vasant Vihar',
  },
  {
    id: 'circle_8',
    coordinates: [77.325, 28.58], // Noida Border
    baseRadius: 1900,
    severity: 'yellow',
    opacity: 0.55,
    name: 'Noida Border',
  },
];

/**
 * Visual States for Scroll-Driven Narrative
 */
enum VisualState {
  CALM = 'CALM',
  INITIAL_SHOCK = 'INITIAL_SHOCK',
  SPREAD = 'SPREAD',
  ESCALATION = 'ESCALATION',
  DECISION_HINT = 'DECISION_HINT',
  OUTCOME_TEASE = 'OUTCOME_TEASE',
  CTA = 'CTA',
}

/**
 * Color mapping for severity levels
 */
const SEVERITY_COLORS = {
  red: '#ef4444',    // Severe impact
  yellow: '#f59e0b', // Moderate impact
  green: '#10b981',  // Stabilizing/improved
};

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  const [currentState, setCurrentState] = useState<VisualState>(VisualState.CALM);

  // Initialize MapLibre once
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const initTimeout = setTimeout(() => {
      try {
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
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              }
            },
            layers: [
              {
                id: 'osm-layer',
                type: 'raster',
                source: 'osm-tiles',
                minzoom: 0,
                maxzoom: 22
              }
            ]
          },
          center: [77.2090, 28.6139], // Delhi center
          zoom: 10.5,
          pitch: 0,
          bearing: 0,
          attributionControl: false,
        });


        map.current.on('load', () => {

          // Create GeoJSON source for impact circles
          const circleFeatures = DEMO_CIRCLES.map(circle => ({
            type: 'Feature' as const,
            id: circle.id,
            properties: {
              severity: circle.severity,
              opacity: circle.opacity,
              radius: circle.baseRadius,
              name: circle.name,
            },
            geometry: {
              type: 'Point' as const,
              coordinates: circle.coordinates,
            },
          }));

          map.current!.addSource('impact-circles', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: circleFeatures,
            },
          });

          // Add circle layer with radial gradient effect
          // Using multiple layers for gradient effect: blur creates soft edges
          map.current!.addLayer({
            id: 'impact-circles-layer',
            type: 'circle',
            source: 'impact-circles',
            paint: {
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                9, ['*', ['get', 'radius'], 0.02],  // Scale radius based on zoom
                12, ['*', ['get', 'radius'], 0.08],
                15, ['*', ['get', 'radius'], 0.3],
              ],
              'circle-color': [
                'match',
                ['get', 'severity'],
                'red', SEVERITY_COLORS.red,
                'yellow', SEVERITY_COLORS.yellow,
                'green', SEVERITY_COLORS.green,
                SEVERITY_COLORS.yellow // fallback
              ],
              'circle-opacity': 0, // Start invisible
              'circle-blur': 0.8, // Soft gradient edges (0-1, higher = softer)
              'circle-stroke-width': 0,
            },
          });

        });

        map.current.on('error', (e) => {
          console.error('MapLibre error:', e);
        });
      } catch (error) {
        console.error('Error creating map:', error);
      }
    }, 100);

    return () => {
      clearTimeout(initTimeout);
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update map visuals based on current state
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    const mapInstance = map.current;


    switch (currentState) {
      case VisualState.CALM:
        // State 1: Calm City - no circles visible
        mapInstance.setPaintProperty('impact-circles-layer', 'circle-opacity', 0);
        mapInstance.easeTo({
          center: [77.2090, 28.6139],
          zoom: 10.5,
          duration: 1000
        });
        break;

      case VisualState.INITIAL_SHOCK:
        // State 2: Initial Shock - ONE red circle at epicenter (Rohini)
        // Zoom to epicenter
        mapInstance.easeTo({
          center: [77.085, 28.73],
          zoom: 11.5,
          duration: 1500
        });

        // Show only the first circle (Rohini epicenter)
        mapInstance.setPaintProperty('impact-circles-layer', 'circle-opacity', [
          'match',
          ['get', 'name'],
          'Rohini', 0.7,
          0 // All others invisible
        ]);
        break;

      case VisualState.SPREAD:
        // State 3: Spread - multiple circles appear (mixed severity)
        // Zoom out slightly to show spread
        mapInstance.easeTo({
          center: [77.2090, 28.6139],
          zoom: 10.8,
          duration: 1200
        });

        // Show all circles with their base opacity
        mapInstance.setPaintProperty('impact-circles-layer', 'circle-opacity', [
          'get', 'opacity'
        ]);
        break;

      case VisualState.ESCALATION:
        // State 4: Escalation - intensify existing circles
        // Increase opacity
        mapInstance.setPaintProperty('impact-circles-layer', 'circle-opacity', [
          '*',
          ['get', 'opacity'],
          1.15 // Multiply opacity by 1.15
        ]);

        // Increase radius slightly
        mapInstance.setPaintProperty('impact-circles-layer', 'circle-radius', [
          'interpolate',
          ['linear'],
          ['zoom'],
          9, ['*', ['get', 'radius'], 0.023],  // 15% larger
          12, ['*', ['get', 'radius'], 0.092],
          15, ['*', ['get', 'radius'], 0.345],
        ]);
        break;

      case VisualState.DECISION_HINT:
        // State 5: Decision Hint - some circles soften (red → yellow)
        // Reset radius back to normal
        mapInstance.setPaintProperty('impact-circles-layer', 'circle-radius', [
          'interpolate',
          ['linear'],
          ['zoom'],
          9, ['*', ['get', 'radius'], 0.02],
          12, ['*', ['get', 'radius'], 0.08],
          15, ['*', ['get', 'radius'], 0.3],
        ]);

        // Change some red circles to yellow, reduce opacity
        mapInstance.setPaintProperty('impact-circles-layer', 'circle-color', [
          'match',
          ['get', 'name'],
          'Pitampura', SEVERITY_COLORS.yellow, // Was red, now yellow
          'Karol Bagh', SEVERITY_COLORS.yellow, // Was red, now yellow
          'Rohini', SEVERITY_COLORS.red, // Still red (stubborn)
          'Connaught Place', SEVERITY_COLORS.yellow,
          'Dwarka', SEVERITY_COLORS.yellow,
          'Saket', SEVERITY_COLORS.green, // Improving
          'Vasant Vihar', SEVERITY_COLORS.green,
          'Noida Border', SEVERITY_COLORS.green, // Improving
          SEVERITY_COLORS.yellow
        ]);

        mapInstance.setPaintProperty('impact-circles-layer', 'circle-opacity', [
          'match',
          ['get', 'name'],
          'Rohini', 0.7, // Still intense
          0.5 // Others reduce
        ]);

        // Zoom out to see the contrast
        mapInstance.easeTo({
          zoom: 10.5,
          duration: 1000
        });
        break;

      case VisualState.OUTCOME_TEASE:
        // State 6: Outcome Tease - majority fade to green/yellow, few red remain
        mapInstance.setPaintProperty('impact-circles-layer', 'circle-color', [
          'match',
          ['get', 'name'],
          'Rohini', SEVERITY_COLORS.red, // Stubborn red zone
          'Pitampura', SEVERITY_COLORS.green,
          'Karol Bagh', SEVERITY_COLORS.yellow,
          'Connaught Place', SEVERITY_COLORS.green,
          'Dwarka', SEVERITY_COLORS.green,
          'Saket', SEVERITY_COLORS.green,
          'Vasant Vihar', SEVERITY_COLORS.green,
          'Noida Border', SEVERITY_COLORS.green,
          SEVERITY_COLORS.green
        ]);

        mapInstance.setPaintProperty('impact-circles-layer', 'circle-opacity', [
          'match',
          ['get', 'name'],
          'Rohini', 0.6, // Slightly reduced
          'Karol Bagh', 0.5,
          0.45 // Most circles fade
        ]);
        break;

      case VisualState.CTA:
        // State 7: Call to Action - stabilize at outcome state
        // Keep the outcome state visuals
        break;
    }
  }, [currentState]);

  // Handle scroll to update visual state
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const section = Math.floor(scrollPosition / windowHeight);

      const states = [
        VisualState.CALM,
        VisualState.INITIAL_SHOCK,
        VisualState.SPREAD,
        VisualState.ESCALATION,
        VisualState.DECISION_HINT,
        VisualState.OUTCOME_TEASE,
        VisualState.CTA,
      ];

      const newState = states[Math.min(section, states.length - 1)];
      if (newState !== currentState) {
        setCurrentState(newState);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentState]);

  const getSectionContent = (state: VisualState) => {
    switch (state) {
      case VisualState.CALM:
        return {
          title: 'A normal day in a city of millions',
          subtitle: 'Delhi, India',
        };
      case VisualState.INITIAL_SHOCK:
        return {
          title: 'Magnitude 7.0 earthquake strikes Delhi',
          subtitle: 'Thousands at risk',
        };
      case VisualState.SPREAD:
        return {
          title: 'Impact spreads unevenly across the city',
          subtitle: 'Multiple zones affected',
        };
      case VisualState.ESCALATION:
        return {
          title: 'Risk grows every minute without intervention',
          subtitle: 'Time is critical',
        };
      case VisualState.DECISION_HINT:
        return {
          title: 'How resources are deployed changes outcomes',
          subtitle: 'Different strategies yield different results',
        };
      case VisualState.OUTCOME_TEASE:
        return {
          title: 'Better decisions save lives',
          subtitle: 'See the difference quantitatively',
        };
      case VisualState.CTA:
        return {
          title: 'Compare AI vs Human vs Heuristic strategies',
          subtitle: 'On real city geography, with real constraints',
        };
    }
  };

  return (
    <>
      <Navbar />

      <div className="landing-container">
        {/* Fixed map background */}
        <div ref={mapContainer} className="landing-map" />

        {/* Scroll sections */}
        <div className="landing-sections">
          {[
            VisualState.CALM,
            VisualState.INITIAL_SHOCK,
            VisualState.SPREAD,
            VisualState.ESCALATION,
            VisualState.DECISION_HINT,
            VisualState.OUTCOME_TEASE,
            VisualState.CTA,
          ].map((state) => {
            const sectionContent = getSectionContent(state);
            return (
              <section
                key={state}
                className={`landing-section ${currentState === state ? 'active' : ''}`}
              >
                <div className="section-content">
                  <h1 className="section-title">{sectionContent.title}</h1>
                  <p className="section-subtitle">{sectionContent.subtitle}</p>

                  {state === VisualState.CTA && (
                    <button
                      className="cta-button"
                      onClick={() => navigate('/setup')}
                    >
                      Create a Scenario
                    </button>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* Feature Cards Section */}
      <FeatureCards />

      {/* Technology Stack Section */}
      <TechStack />

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Landing;
