import React from 'react';
import '../styles/TechStack.css';

interface Technology {
    name: string;
    icon: string;
    category: string;
}

const technologies: Technology[] = [
    { name: 'React', icon: '⚛️', category: 'Frontend' },
    { name: 'TypeScript', icon: '📘', category: 'Language' },
    { name: 'MapLibre GL', icon: '🗺️', category: 'Mapping' },
    { name: 'Vite', icon: '⚡', category: 'Build Tool' },
    { name: 'React Router', icon: '🔀', category: 'Navigation' },
    { name: 'OpenStreetMap', icon: '🌍', category: 'Data Source' },
];

const TechStack: React.FC = () => {
    return (
        <section id="technology" className="tech-stack-section">
            <div className="tech-stack-container">
                <div className="tech-stack-header">
                    <h2 className="tech-stack-title">Built With Modern Technology</h2>
                    <p className="tech-stack-subtitle">
                        Cutting-edge tools for performance, scalability, and real-time visualization
                    </p>
                </div>

                <div className="tech-grid">
                    {technologies.map((tech, index) => (
                        <div
                            key={index}
                            className="tech-card"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <span className="tech-icon">{tech.icon}</span>
                            <div className="tech-info">
                                <h3 className="tech-name">{tech.name}</h3>
                                <span className="tech-category">{tech.category}</span>
                            </div>
                            <div className="tech-glow" />
                        </div>
                    ))}
                </div>

                {/* Stats Section */}
                <div className="tech-stats">
                    <div className="stat-item">
                        <div className="stat-value">30M+</div>
                        <div className="stat-label">Lives Simulated</div>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat-item">
                        <div className="stat-value">1000+</div>
                        <div className="stat-label">Scenarios Tested</div>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat-item">
                        <div className="stat-value">100%</div>
                        <div className="stat-label">Open Source</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TechStack;
