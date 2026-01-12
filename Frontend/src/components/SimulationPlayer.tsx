import { useState, useEffect } from 'react';
import type { SimulationStep } from '../types/simulation';

interface SimulationPlayerProps {
    trajectory: SimulationStep[];
    children: (currentStep: SimulationStep, stepIndex: number, controls: PlaybackControls) => React.ReactNode;
}

interface PlaybackControls {
    isPlaying: boolean;
    currentStepIndex: number;
    totalSteps: number;
    play: () => void;
    pause: () => void;
    reset: () => void;
    stepForward: () => void;
    stepBackward: () => void;
    goToStep: (index: number) => void;
}

/**
 * Simulation Player Component
 * 
 * Orchestrates playback logic for simulation replay.
 * Provides current step and playback controls to children via render prop.
 */
export function SimulationPlayer({ trajectory, children }: SimulationPlayerProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const totalSteps = trajectory.length;

    // Auto-advance during playback
    useEffect(() => {
        if (!isPlaying) return;

        if (currentStepIndex >= totalSteps - 1) {
            setIsPlaying(false);
            return;
        }

        const timer = setTimeout(() => {
            setCurrentStepIndex(prev => Math.min(prev + 1, totalSteps - 1));
        }, 500); // 500ms per step

        return () => clearTimeout(timer);
    }, [isPlaying, currentStepIndex, totalSteps]);

    const controls: PlaybackControls = {
        isPlaying,
        currentStepIndex,
        totalSteps,

        play: () => {
            if (currentStepIndex >= totalSteps - 1) {
                setCurrentStepIndex(0);
            }
            setIsPlaying(true);
        },

        pause: () => setIsPlaying(false),

        reset: () => {
            setCurrentStepIndex(0);
            setIsPlaying(false);
        },

        stepForward: () => {
            setIsPlaying(false);
            setCurrentStepIndex(prev => Math.min(prev + 1, totalSteps - 1));
        },

        stepBackward: () => {
            setIsPlaying(false);
            setCurrentStepIndex(prev => Math.max(prev - 1, 0));
        },

        goToStep: (index: number) => {
            setIsPlaying(false);
            setCurrentStepIndex(Math.max(0, Math.min(index, totalSteps - 1)));
        },
    };

    if (trajectory.length === 0) {
        return <div>No simulation data available</div>;
    }

    return <>{children(trajectory[currentStepIndex], currentStepIndex, controls)}</>;
}
