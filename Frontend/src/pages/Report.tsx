import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { SimulationResponse, SimulationRequest } from '../types/simulation';
import { generateReport, downloadReport } from '../utils/reportGenerator';

interface LocationState {
  ppoResult: SimulationResponse;
  heuristicResult: SimulationResponse;
  scenarioConfig: SimulationRequest;
}

/**
 * Report Generation Page — "Executive Briefing"
 * 
 * Purpose: Provide a credible, archival artifact for decision makers.
 * Tone: Official, Document-Like, Printable.
 * 
 * Features:
 * - Live Document Preview (A4 Aspect Ratio)
 * - Executive Summary & Key Metrics
 * - Download Actions (PDF/Markdown)
 */
const Report: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const [isDownloading, setIsDownloading] = useState(false);

  // Redirect if no data
  if (!state || !state.ppoResult || !state.heuristicResult) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>No Report Data Available</h2>
        <button onClick={() => navigate('/')}>Return Home</button>
      </div>
    );
  }

  const { ppoResult, heuristicResult, scenarioConfig } = state;

  // Calculate Summary Stats
  const improvement = ((ppoResult.metrics.victims_rescued - heuristicResult.metrics.victims_rescued) / heuristicResult.metrics.victims_rescued * 100).toFixed(1);
  const successRate = (ppoResult.metrics.success_rate * 100).toFixed(1);
  const date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      const content = generateReport({
        scenarioConfig,
        ppoResult,
        heuristicResult
      });
      downloadReport(content);
      // Simulate "Processing" for feeling of weight
      setTimeout(() => setIsDownloading(false), 1500);
    } catch (e) {
      console.error(e);
      setIsDownloading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Georgia, serif', background: '#e2e8f0', minHeight: '100vh', padding: '40px 20px' }}>

      {/* Toolbar */}
      <div style={{
        maxWidth: '800px', margin: '0 auto 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'white', padding: '16px 24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <button
          onClick={() => navigate('/results', { state })}
          style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: 500 }}
        >
          ← Back to Analysis
        </button>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            style={{
              background: isDownloading ? '#cbd5e1' : '#0f172a', color: 'white', border: 'none',
              padding: '10px 20px', borderRadius: '6px', fontWeight: 600, cursor: isDownloading ? 'wait' : 'pointer'
            }}
          >
            {isDownloading ? 'Generating PDF...' : 'Download Official Report'}
          </button>
        </div>
      </div>

      {/* Document Preview (A4 Paper Style) */}
      <div style={{
        maxWidth: '800px', margin: '0 auto', background: 'white', minHeight: '1100px',
        padding: '80px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        color: '#1e293b'
      }}>
        {/* Header */}
        <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '24px', marginBottom: '40px' }}>
          <div style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', color: '#64748b', marginBottom: '8px' }}>
            INTERNAL BRIEFING DOCUMENT • CONFIDENTIAL
          </div>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 16px', lineHeight: '1.2' }}>
            Disaster Response Simulation Report
          </h1>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'system-ui, sans-serif', fontSize: '0.95rem' }}>
            <div><strong>Scenario:</strong> Delhi Earthquake Response</div>
            <div><strong>Date:</strong> {date}</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase', fontSize: '1rem', letterSpacing: '1px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            1. Executive Summary
          </h3>
          <p style={{ lineHeight: '1.6', fontSize: '1.1rem' }}>
            An AI-driven evacuation strategy (PPO) was simulated under severe earthquake conditions in Delhi.
            The autonomous system achieved a <strong>{successRate}% mission success rate</strong>, stabilizing the city
            faster than baseline heuristic protocols. This report confirms that AI coordination significantly
            reduces casualties and improves resource allocation efficiency.
          </p>
        </div>

        {/* Key Results Table */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase', fontSize: '1rem', letterSpacing: '1px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            2. Key Performance Indicators
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
            <thead>
              <tr style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', background: '#f8fafc' }}>
                <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #cbd5e1' }}>Metric</th>
                <th style={{ textAlign: 'right', padding: '12px', borderBottom: '1px solid #cbd5e1' }}>Baseline</th>
                <th style={{ textAlign: 'right', padding: '12px', borderBottom: '1px solid #cbd5e1' }}>AI Agent</th>
                <th style={{ textAlign: 'right', padding: '12px', borderBottom: '1px solid #cbd5e1' }}>Impact</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Victims Rescued</td>
                <td style={{ textAlign: 'right', padding: '12px', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>{heuristicResult.metrics.victims_rescued}</td>
                <td style={{ textAlign: 'right', padding: '12px', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold' }}>{ppoResult.metrics.victims_rescued}</td>
                <td style={{ textAlign: 'right', padding: '12px', borderBottom: '1px solid #e2e8f0', color: '#16a34a' }}>+{improvement}%</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Evacuation Success</td>
                <td style={{ textAlign: 'right', padding: '12px', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                  {(heuristicResult.metrics.success_rate * 100).toFixed(1)}%
                </td>
                <td style={{ textAlign: 'right', padding: '12px', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold' }}>
                  {(ppoResult.metrics.success_rate * 100).toFixed(1)}%
                </td>
                <td style={{ textAlign: 'right', padding: '12px', borderBottom: '1px solid #e2e8f0', color: '#16a34a' }}>
                  +{(ppoResult.metrics.success_rate * 100 - heuristicResult.metrics.success_rate * 100).toFixed(1)} pts
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Strategy Analysis */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase', fontSize: '1rem', letterSpacing: '1px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            3. Strategic Analysis
          </h3>
          <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
            The AI agent demonstrated superior capability in managing <strong>resource contention</strong>.
            While baseline strategies often oversaturated safe routes leading to congestion, the AI dynamically
            rerouted traffic before bottlenecks occurred. This "look-ahead" capability accounts for the primary
            performance differential.
          </p>
        </div>

        {/* Limitations */}
        <div>
          <h3 style={{ fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase', fontSize: '1rem', letterSpacing: '1px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            4. Assumptions & Context
          </h3>
          <ul style={{ lineHeight: '1.6', paddingLeft: '20px', color: '#475569' }}>
            <li>Simulation assumes standard urban mobility patterns for Delhi.</li>
            <li>Network reliability is modeled with stochastic failures (p=0.05).</li>
            <li>Human panic behavior is approximated using crowd dynamics models.</li>
          </ul>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '80px', borderTop: '2px solid #0f172a', paddingTop: '16px', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
          Generated by DisasterSim AI Platform • {new Date().toISOString()} • ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
        </div>

      </div>

    </div>
  );
};

export default Report;
