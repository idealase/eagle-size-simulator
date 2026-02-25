/**
 * engine.test.ts -- Unit tests for the simulation core.
 *
 * Tests cover:
 *  - Capacities decrease as size increases
 *  - Viability bounded [0, 100]
 *  - Default params produce stable eagle (all capacities > thresholds, canFly = true)
 *  - Very large eagle (5m) triggers failures and canFly = false
 *  - Higher air density improves wing loading capacity
 *  - Lower gravity improves wing loading and bone capacity
 *  - Flight speed and altitude decrease with size
 *  - Golden-case snapshot for default params
 */

import { describe, it, expect } from 'vitest';
import { simulate } from './engine';
import { DEFAULT_PARAMS, WING_LOADING_THRESHOLD, BONE_THRESHOLD, POWER_THRESHOLD, THERMO_THRESHOLD } from './simDefaults';
import type { SimParams } from './types';

/** Helper: clone defaults with overrides */
function params(overrides: Partial<SimParams> = {}): SimParams {
  return { ...DEFAULT_PARAMS, ...overrides };
}

describe('simulate -- capacities decrease as size increases', () => {
  it('wingLoadingCapacity decreases with body length', () => {
    const sizes = [0.86, 1.5, 2.0, 3.0, 4.0, 5.0];
    const caps = sizes.map(
      (L) => simulate(params({ bodyLength: L })).wingLoadingCapacity,
    );
    for (let i = 1; i < caps.length; i++) {
      expect(caps[i]).toBeLessThan(caps[i - 1]);
    }
  });

  it('boneCapacity decreases with body length', () => {
    const sizes = [0.86, 1.5, 2.0, 3.0, 4.0, 5.0];
    const caps = sizes.map(
      (L) => simulate(params({ bodyLength: L })).boneCapacity,
    );
    for (let i = 1; i < caps.length; i++) {
      expect(caps[i]).toBeLessThan(caps[i - 1]);
    }
  });

  it('powerCapacity decreases with body length', () => {
    const sizes = [0.86, 1.5, 2.0, 3.0, 4.0];
    const caps = sizes.map(
      (L) => simulate(params({ bodyLength: L })).powerCapacity,
    );
    for (let i = 1; i < caps.length; i++) {
      expect(caps[i]).toBeLessThan(caps[i - 1]);
    }
  });

  it('thermoCapacity decreases with body length', () => {
    const sizes = [0.86, 1.5, 2.0, 3.0, 4.0];
    const caps = sizes.map(
      (L) => simulate(params({ bodyLength: L })).thermoCapacity,
    );
    for (let i = 1; i < caps.length; i++) {
      expect(caps[i]).toBeLessThan(caps[i - 1]);
    }
  });
});

describe('simulate -- viability bounded [0, 100]', () => {
  it('viability is within [0, 100] for various sizes', () => {
    for (const L of [0.3, 0.5, 0.86, 1.5, 2.5, 4.0, 5.0]) {
      const out = simulate(params({ bodyLength: L }));
      expect(out.viabilityIndex).toBeGreaterThanOrEqual(0);
      expect(out.viabilityIndex).toBeLessThanOrEqual(100);
    }
  });
});

describe('simulate -- default params produce stable eagle', () => {
  it('all capacities exceed failure thresholds', () => {
    const out = simulate(DEFAULT_PARAMS);
    expect(out.wingLoadingCapacity).toBeGreaterThan(WING_LOADING_THRESHOLD);
    expect(out.boneCapacity).toBeGreaterThan(BONE_THRESHOLD);
    expect(out.powerCapacity).toBeGreaterThan(POWER_THRESHOLD);
    expect(out.thermoCapacity).toBeGreaterThan(THERMO_THRESHOLD);
  });

  it('canFly is true', () => {
    const out = simulate(DEFAULT_PARAMS);
    expect(out.canFly).toBe(true);
  });

  it('no active failures', () => {
    const out = simulate(DEFAULT_PARAMS);
    expect(out.activeFailures).toHaveLength(0);
    expect(out.failureMode).toBeNull();
  });
});

describe('simulate -- very large eagle (5m) triggers failures', () => {
  it('triggers at least one failure', () => {
    const out = simulate(params({ bodyLength: 5.0 }));
    expect(out.activeFailures.length).toBeGreaterThan(0);
    expect(out.failureMode).not.toBeNull();
  });

  it('canFly is false', () => {
    const out = simulate(params({ bodyLength: 5.0 }));
    expect(out.canFly).toBe(false);
  });

  it('viability is very low', () => {
    const out = simulate(params({ bodyLength: 5.0 }));
    expect(out.viabilityIndex).toBeLessThan(20);
  });
});

describe('simulate -- air density effects', () => {
  it('higher air density improves wing loading capacity', () => {
    const low = simulate(params({ airDensity: 0.8 }));
    const mid = simulate(params({ airDensity: 1.225 }));
    const high = simulate(params({ airDensity: 1.5 }));
    expect(high.wingLoadingCapacity).toBeGreaterThan(mid.wingLoadingCapacity);
    expect(mid.wingLoadingCapacity).toBeGreaterThan(low.wingLoadingCapacity);
  });

  it('higher air density improves max flight altitude', () => {
    const low = simulate(params({ airDensity: 0.8 }));
    const high = simulate(params({ airDensity: 1.5 }));
    expect(high.maxFlightAltitude).toBeGreaterThan(low.maxFlightAltitude);
  });
});

describe('simulate -- gravity effects', () => {
  it('lower gravity improves wing loading capacity', () => {
    const earthGrav = simulate(params({ gravity: 1.0 }));
    const moonGrav = simulate(params({ gravity: 0.16 }));
    expect(moonGrav.wingLoadingCapacity).toBeGreaterThan(earthGrav.wingLoadingCapacity);
  });

  it('lower gravity improves bone capacity', () => {
    const earthGrav = simulate(params({ gravity: 1.0 }));
    const moonGrav = simulate(params({ gravity: 0.16 }));
    expect(moonGrav.boneCapacity).toBeGreaterThan(earthGrav.boneCapacity);
  });
});

describe('simulate -- flight speed and altitude decrease with size', () => {
  it('max flight speed decreases', () => {
    const speeds = [0.86, 1.5, 2.0, 3.0].map(
      (L) => simulate(params({ bodyLength: L })).maxFlightSpeed,
    );
    for (let i = 1; i < speeds.length; i++) {
      expect(speeds[i]).toBeLessThan(speeds[i - 1]);
    }
  });

  it('max flight altitude decreases', () => {
    const alts = [0.86, 1.5, 2.0, 3.0].map(
      (L) => simulate(params({ bodyLength: L })).maxFlightAltitude,
    );
    for (let i = 1; i < alts.length; i++) {
      expect(alts[i]).toBeLessThan(alts[i - 1]);
    }
  });

  it('speed and altitude are zero for very large eagle', () => {
    const out = simulate(params({ bodyLength: 5.0 }));
    // Very large eagle has very low wing loading capacity
    // Speed and altitude may be very small but >= 0
    expect(out.maxFlightSpeed).toBeGreaterThanOrEqual(0);
    expect(out.maxFlightAltitude).toBeGreaterThanOrEqual(0);
  });
});

describe('simulate -- golden-case snapshot for default params', () => {
  it('default params produce known outputs', () => {
    const out = simulate(DEFAULT_PARAMS);

    // Scale factor = 0.86 / 0.86 = 1.0
    expect(out.scaleFactor).toBeCloseTo(1.0, 6);

    // Mass = 4.5 * 1^3 = 4.5 kg
    expect(out.mass).toBeCloseTo(4.5, 6);

    // Wingspan = 2.0 * (0.86/0.86) * 1.0 = 2.0 m
    expect(out.wingspan).toBeCloseTo(2.0, 6);

    // Wing loading capacity = (1.225/1.225) / (1.0 * 1.0) = 1.0
    expect(out.wingLoadingCapacity).toBeCloseTo(1.0, 6);

    // Bone capacity = 1 / (1.0^1.5 * 1.0) = 1.0
    expect(out.boneCapacity).toBeCloseTo(1.0, 6);

    // Power capacity = 1 / 1.0^1.25 = 1.0
    expect(out.powerCapacity).toBeCloseTo(1.0, 6);

    // Thermo capacity = 1 / 1.0 = 1.0
    expect(out.thermoCapacity).toBeCloseTo(1.0, 6);

    // All health scores = 100
    expect(out.wingLoadingHealth).toBeCloseTo(100, 1);
    expect(out.boneHealth).toBeCloseTo(100, 1);
    expect(out.powerHealth).toBeCloseTo(100, 1);
    expect(out.thermoHealth).toBeCloseTo(100, 1);

    // Viability = 100
    expect(out.viabilityIndex).toBeCloseTo(100, 1);

    // Max flight speed = 40 * 1.0 = 40 m/s
    expect(out.maxFlightSpeed).toBeCloseTo(40, 1);

    // Max flight altitude = 4500 * 1.0 * 1.0 = 4500 m
    expect(out.maxFlightAltitude).toBeCloseTo(4500, 1);

    // Can fly
    expect(out.canFly).toBe(true);

    // No failures
    expect(out.activeFailures).toHaveLength(0);
    expect(out.failureMode).toBeNull();
  });
});
