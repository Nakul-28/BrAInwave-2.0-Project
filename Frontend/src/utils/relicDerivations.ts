/**
 * Relic Derivations - Symbolic Outcome Expressions
 * 
 * RESPONSIBILITY:
 * - Derive symbolic relics from backend metrics
 * - Apply deterministic formulas only
 * - Preserve backend truth without interpretation
 * 
 * PROHIBITED:
 * - Smoothing values
 * - Arbitrary normalization
 * - Aesthetic clamping
 * - Semantic re-interpretation
 * - Renaming backend metrics
 * 
 * Backend speaks facts. Frontend expresses consequence.
 */

import type { FinalMetrics, BaselineMetrics } from '../types/simulation';

/**
 * Relic - Symbolic outcome derived from backend metrics
 */
export interface Relic {
    label: string;
    value: string;
    description: string;
    visible: boolean;
}

/**
 * All relics derived from backend metrics
 */
export interface DerivedRelics {
    foresight: Relic;
    stabilization: Relic;
    resilience: Relic;
    efficiency: Relic;
    authority: Relic;
    control: Relic;
}

/**
 * Derive all relics from backend metrics
 * 
 * @param finalMetrics - AI policy outcomes
 * @param baselineMetrics - Baseline policy outcomes
 * @returns Symbolic relics (frontend expression only)
 */
export function deriveRelics(
    finalMetrics: FinalMetrics | null,
    baselineMetrics: BaselineMetrics | null
): DerivedRelics {
    // FORESIGHT: Lives preserved relative to baseline
    const foresight: Relic = (() => {
        if (!finalMetrics || !baselineMetrics || baselineMetrics.casualties === 0) {
            return {
                label: 'FORESIGHT',
                value: '',
                description: 'Prediction accuracy optimized.',
                visible: false
            };
        }

        const percentage = (1 - finalMetrics.casualties / baselineMetrics.casualties) * 100;

        return {
            label: 'FORESIGHT',
            value: `${Math.round(percentage)}%`,
            description: 'Prediction accuracy optimized.',
            visible: true
        };
    })();

    // STABILIZATION: Speed to equilibrium
    const stabilization: Relic = (() => {
        if (!finalMetrics) {
            return {
                label: 'STABILIZATION',
                value: '',
                description: 'Critical zones contained.',
                visible: false
            };
        }

        return {
            label: 'STABILIZATION',
            value: `${finalMetrics.timesteps} CYCLES`,
            description: 'Critical zones contained.',
            visible: true
        };
    })();

    // RESILIENCE: Hazard impact absorption
    const resilience: Relic = (() => {
        if (!finalMetrics) {
            return {
                label: 'RESILIENCE',
                value: '',
                description: 'Lives preserved under load.',
                visible: false
            };
        }

        const percentage = finalMetrics.success_rate * 100;

        return {
            label: 'RESILIENCE',
            value: `${Math.round(percentage)}%`,
            description: 'Lives preserved under load.',
            visible: true
        };
    })();

    // EFFICIENCY: Completion under constraint
    const efficiency: Relic = (() => {
        if (!finalMetrics) {
            return {
                label: 'EFFICIENCY',
                value: '',
                description: 'Resource contention resolved.',
                visible: false
            };
        }

        const percentage = finalMetrics.success_rate * 100;

        return {
            label: 'EFFICIENCY',
            value: `${Math.round(percentage)}%`,
            description: 'Resource contention resolved.',
            visible: true
        };
    })();

    // AUTHORITY: Total system confidence
    const authority: Relic = (() => {
        if (!finalMetrics) {
            return {
                label: 'AUTHORITY',
                value: '',
                description: 'Decisions were absolute.',
                visible: false
            };
        }

        return {
            label: 'AUTHORITY',
            value: `${Math.round(finalMetrics.total_reward)}`,
            description: 'Decisions were absolute.',
            visible: true
        };
    })();

    // CONTROL: Absolute human impact differential
    const control: Relic = (() => {
        if (!finalMetrics || !baselineMetrics) {
            return {
                label: 'CONTROL',
                value: '',
                description: 'Systemic failure prevented.',
                visible: false
            };
        }

        const differential = baselineMetrics.casualties - finalMetrics.casualties;

        return {
            label: 'CONTROL',
            value: `+${differential}`,
            description: 'Systemic failure prevented.',
            visible: true
        };
    })();

    return {
        foresight,
        stabilization,
        resilience,
        efficiency,
        authority,
        control
    };
}
