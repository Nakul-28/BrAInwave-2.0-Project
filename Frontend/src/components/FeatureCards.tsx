import React from 'react';
import '../styles/FeatureCards.css';

interface Feature {
    icon: string;
    title: string;
    description: string;
    gradient: string;
}

const features: Feature[] = [
    {
        icon: '🤖',
        title: 'AI-Powered',
        description: 'Multi-agent coordination with reinforcement learning for optimal resource allocation',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
        icon: '🗺️',
        title: 'Real Geography',
        description: 'Actual city data with OpenStreetMap integration for authentic simulations',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
        icon: '📊',
        title: 'Quantifiable Impact',
        description: 'Lives saved metrics, response times, and outcome comparisons across strategies',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
        icon: '⚡',
        title: 'Real-Time Decisions',
        description: 'Dynamic scenario progression with adaptive AI adjusting to changing conditions',
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
];

const FeatureCards: React.FC = () => {
    return (
        <section id="features" className="features-section">
            <div className="features-container">
                <div className="features-header">
                    <h2 className="features-title">Powerful Features</h2>
                    <p className="features-subtitle">
                        Enterprise-grade simulation technology designed for high-stakes decision-making
                    </p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="feature-card"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="feature-icon-wrapper">
                                <div
                                    className="feature-icon-bg"
                                    style={{ background: feature.gradient }}
                                />
                                <span className="feature-icon">{feature.icon}</span>
                            </div>

                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>

                            <div className="feature-shine" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureCards;
