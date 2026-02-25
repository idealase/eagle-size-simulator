/**
 * engine.ts -- Pure simulation engine.
 *
 * Given a SimParams object, compute all derived outputs including capacity
 * proxies, health scores, viability index, flight envelope, and failure modes.
 *
 * This module has ZERO runtime dependencies on React, DOM, or any UI library.
 * It is fully deterministic: same inputs -> same outputs.
 */

import type { SimOutputs, SimParams } from './types';
import {
  BASELINE_FLIGHT_SPEED,
  BASELINE_FLIGHT_ALTITUDE,
  BASELINE_WINGSPAN,
  BALD_EAGLE_BASELINE_LENGTH,
  WING_LOADING_THRESHOLD,
  HEALTH_FLOOR,
  HEALTH_CEILING,
  VIABILITY_WEIGHTS,
} from './simDefaults';
import { detectFailures, FAILURE_MODES } from './failureModes';

/**
 * Clamp a value between min and max.
 */
function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x));
}

/**
 * Convert a capacity proxy to a health score (0-100).
 * Linear mapping: proxy <= HEALTH_FLOOR -> 0, proxy >= HEALTH_CEILING -> 100.
 */
function proxyToHealth(proxy: number): number {
  return 100 * clamp((proxy - HEALTH_FLOOR) / (HEALTH_CEILING - HEALTH_FLOOR), 0, 1);
}

/**
 * Weighted geometric mean of health scores.
 * Uses floor of 0.001 to avoid log(0).
 */
function weightedGeometricMean(
  values: number[],
  weights: number[],
): number {
  let logSum = 0;
  for (let i = 0; i < values.length; i++) {
    logSum += weights[i] * Math.log(Math.max(0.001, values[i]));
  }
  return Math.exp(logSum);
}

/**
 * Run one tick of the simulation.
 *
 * @param p - All simulation parameters.
 * @returns Fully computed outputs including health scores and failure info.
 */
export function simulate(p: SimParams): SimOutputs {
  const { max } = Math;

  // -- Scale factor -----------------------------------------------------------
  const s = p.bodyLength / p.baselineLength;

  // -- Derived quantities -----------------------------------------------------
  const mass = p.baseMass * s * s * s;
  const wingspan = BASELINE_WINGSPAN * (p.baselineLength / BALD_EAGLE_BASELINE_LENGTH) * s;

  // -- Capacity proxies -------------------------------------------------------

  // 1. Wing Loading: wing area ~ L^2, mass ~ L^3, so loading ~ s.
  //    Air density and gravity modulate.
  const wingLoadingCapacity = (p.airDensity / 1.225) / (s * p.gravity);

  // 2. Bone Structural: pneumatized bones scale poorly under compression.
  //    Cross-section ~ L^2 but load ~ L^3, with hollow bone penalty.
  const boneCapacity = 1 / (Math.pow(s, 1.5) * p.gravity);

  // 3. Metabolic Power: power demand outpaces metabolic output.
  //    Required power ~ M^(7/6), available ~ M^0.75.
  const powerCapacity = 1 / Math.pow(s, 1.25);

  // 4. Thermoregulation: surface/volume ratio collapse.
  const thermoCapacity = 1 / s;

  // -- Health scores (0-100) --------------------------------------------------
  const wingLoadingHealth = proxyToHealth(wingLoadingCapacity);
  const boneHealth = proxyToHealth(boneCapacity);
  const powerHealth = proxyToHealth(powerCapacity);
  const thermoHealth = proxyToHealth(thermoCapacity);

  // -- Viability index (weighted geometric mean of health scores) -------------
  const viabilityRaw = weightedGeometricMean(
    [wingLoadingHealth, boneHealth, powerHealth, thermoHealth],
    [VIABILITY_WEIGHTS.wingLoading, VIABILITY_WEIGHTS.bone, VIABILITY_WEIGHTS.power, VIABILITY_WEIGHTS.thermo],
  );
  const viabilityIndex = clamp(viabilityRaw, 0, 100);

  // -- Flight envelope --------------------------------------------------------
  const canFly = wingLoadingCapacity >= WING_LOADING_THRESHOLD;
  const maxFlightSpeed = max(0, BASELINE_FLIGHT_SPEED * wingLoadingCapacity);
  const maxFlightAltitude = max(0, BASELINE_FLIGHT_ALTITUDE * wingLoadingCapacity * (p.airDensity / 1.225));

  // -- Failure detection ------------------------------------------------------
  const activeFailures = detectFailures({
    wingLoading: wingLoadingCapacity,
    bone: boneCapacity,
    power: powerCapacity,
    thermo: thermoCapacity,
  });

  // Determine dominant failure: pick the first by definition order
  const failureOrder = Object.keys(FAILURE_MODES);
  let failureMode: string | null = null;
  for (const id of failureOrder) {
    if (activeFailures.includes(id)) {
      failureMode = id;
      break;
    }
  }

  return {
    scaleFactor: s,
    mass,
    wingspan,
    wingLoadingCapacity,
    boneCapacity,
    powerCapacity,
    thermoCapacity,
    wingLoadingHealth,
    boneHealth,
    powerHealth,
    thermoHealth,
    viabilityIndex,
    maxFlightSpeed,
    maxFlightAltitude,
    canFly,
    activeFailures,
    failureMode,
  };
}
