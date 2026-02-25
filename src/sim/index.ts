/**
 * sim/index.ts -- Public surface of the simulation module.
 */
export { simulate } from './engine';
export { DEFAULT_PARAMS, SPECIES_PRESETS } from './simDefaults';
export { FAILURE_MODES, getFailureMode } from './failureModes';
export type { SimParams, SimOutputs, SpeciesPreset } from './types';
export type { FailureModeDefinition, FailureSeverity, Subsystem } from './failureModes';
