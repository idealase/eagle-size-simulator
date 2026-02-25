/**
 * types.ts -- Shared types for the Eagle Size Simulator.
 *
 * These types are intentionally free of React / DOM concerns so the sim
 * module stays portable and testable.
 */

// -- Input parameters ---------------------------------------------------------

export interface SimParams {
  /** Current body length in meters */
  bodyLength: number;
  /** Baseline body length for the selected species (m) */
  baselineLength: number;
  /** Baseline mass for the selected species (kg) */
  baseMass: number;
  /** Air density (kg/m^3), default 1.225 at sea level */
  airDensity: number;
  /** Gravity multiplier (1.0 = Earth) */
  gravity: number;
}

// -- Output results -----------------------------------------------------------

export interface SimOutputs {
  /** bodyLength / baselineLength */
  scaleFactor: number;
  /** Estimated mass in kg (cube law) */
  mass: number;
  /** Estimated wingspan in meters */
  wingspan: number;

  // Capacity proxies (1.0 = baseline, lower = worse)
  /** Lift vs weight capacity */
  wingLoadingCapacity: number;
  /** Pneumatized bone strength */
  boneCapacity: number;
  /** Metabolic flight power */
  powerCapacity: number;
  /** Thermoregulation */
  thermoCapacity: number;

  // Health scores (0-100)
  wingLoadingHealth: number;
  boneHealth: number;
  powerHealth: number;
  thermoHealth: number;

  /** Overall viability index (0-100) */
  viabilityIndex: number;

  // Eagle-specific flight envelope
  /** Estimated max flight speed (m/s), goes to 0 */
  maxFlightSpeed: number;
  /** Estimated flight ceiling (m), goes to 0 */
  maxFlightAltitude: number;
  /** Whether wing loading is above the flight threshold */
  canFly: boolean;

  /** IDs of currently active failure modes */
  activeFailures: string[];
  /** The dominant (first triggered) failure mode, or null */
  failureMode: string | null;
}

// -- Species preset -----------------------------------------------------------

export interface SpeciesPreset {
  name: string;
  baselineLength: number;
  baseMass: number;
}
