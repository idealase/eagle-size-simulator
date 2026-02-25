/**
 * simDefaults.ts -- All named constants and default parameter values for the
 * Eagle Size Simulator.
 *
 * Design rationale:
 * - A real bald eagle has a body length ~0.86 m, mass ~4.5 kg, wingspan ~2.0 m.
 * - We start with "plausible eagle" defaults so the sim begins in a stable
 *   flyable state and the user can scale up until something breaks.
 * - Every constant is named, typed, and documented here.  No magic numbers.
 */

import type { SimParams, SpeciesPreset } from './types';

// -- Physical constants -------------------------------------------------------

/** Standard gravitational acceleration (m/s^2) */
export const GRAVITY = 9.81;

/** Sea-level air density (kg/m^3) */
export const SEA_LEVEL_AIR_DENSITY = 1.225;

// -- Species presets ----------------------------------------------------------

export const SPECIES_PRESETS: SpeciesPreset[] = [
  { name: 'Bald Eagle', baselineLength: 0.86, baseMass: 4.5 },
  { name: 'Golden Eagle', baselineLength: 0.84, baseMass: 5.0 },
  { name: 'Harpy Eagle', baselineLength: 1.0, baseMass: 9.0 },
];

// -- Capacity thresholds ------------------------------------------------------

/** Wing loading capacity below this = catastrophic (can't fly) */
export const WING_LOADING_THRESHOLD = 0.35;

/** Bone capacity below this = catastrophic */
export const BONE_THRESHOLD = 0.30;

/** Power capacity below this = hard failure */
export const POWER_THRESHOLD = 0.35;

/** Thermoregulation capacity below this = hard failure */
export const THERMO_THRESHOLD = 0.35;

// -- Flight envelope baselines ------------------------------------------------

/** Baseline max flight speed for a bald eagle (m/s) */
export const BASELINE_FLIGHT_SPEED = 40;

/** Baseline max flight altitude (m) */
export const BASELINE_FLIGHT_ALTITUDE = 4500;

/** Baseline wingspan for a bald eagle (m) */
export const BASELINE_WINGSPAN = 2.0;

/** Baseline body length for a bald eagle (m), used for wingspan scaling */
export const BALD_EAGLE_BASELINE_LENGTH = 0.86;

// -- Health conversion constants ----------------------------------------------

/** Floor of health mapping (proxy values below this map to 0) */
export const HEALTH_FLOOR = 0.1;

/** Ceiling of health mapping (proxy values at or above this map to 100) */
export const HEALTH_CEILING = 1.0;

// -- Viability weights (must sum to 1.0) --------------------------------------

export const VIABILITY_WEIGHTS = {
  wingLoading: 0.30,
  bone: 0.25,
  power: 0.25,
  thermo: 0.20,
} as const;

// -- Default simulation parameters --------------------------------------------

export const DEFAULT_PARAMS: SimParams = {
  bodyLength: 0.86,
  baselineLength: 0.86,
  baseMass: 4.5,
  airDensity: SEA_LEVEL_AIR_DENSITY,
  gravity: 1.0,
};
