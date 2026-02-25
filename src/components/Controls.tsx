import { SPECIES_PRESETS } from '../sim';
import type { SimParams } from '../sim';

interface Props {
  params: SimParams;
  onChange: (p: SimParams) => void;
}

export function Controls({ params, onChange }: Props) {
  const set = (patch: Partial<SimParams>) => onChange({ ...params, ...patch });

  return (
    <div className="card">
      <h2>Controls</h2>

      <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Species Preset
        <select
          value={params.baselineLength}
          onChange={e => {
            const bl = Number(e.target.value);
            const preset = SPECIES_PRESETS.find(p => p.baselineLength === bl);
            if (preset) set({ baselineLength: bl, bodyLength: bl, baseMass: preset.baseMass });
          }}
          style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.4rem', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}
        >
          {SPECIES_PRESETS.map(p => (
            <option key={p.name} value={p.baselineLength}>{p.name} ({p.baseMass}kg)</option>
          ))}
        </select>
      </label>

      <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Body Length: {params.bodyLength.toFixed(2)}m
        <input type="range" min={0.3} max={5} step={0.01} value={params.bodyLength}
          onChange={e => set({ bodyLength: Number(e.target.value) })}
          style={{ display: 'block', width: '100%', marginTop: 4 }} />
      </label>

      <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Air Density: {params.airDensity.toFixed(3)} kg/m³
        <input type="range" min={0.5} max={1.5} step={0.005} value={params.airDensity}
          onChange={e => set({ airDensity: Number(e.target.value) })}
          style={{ display: 'block', width: '100%', marginTop: 4 }} />
      </label>

      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Gravity: {params.gravity.toFixed(2)}g
        <input type="range" min={0.1} max={2.0} step={0.01} value={params.gravity}
          onChange={e => set({ gravity: Number(e.target.value) })}
          style={{ display: 'block', width: '100%', marginTop: 4 }} />
      </label>
    </div>
  );
}
