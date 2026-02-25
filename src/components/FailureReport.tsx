import type { SimOutputs } from '../sim';
import { FAILURE_MODES } from '../sim';

interface Props {
  outputs: SimOutputs;
}

export function FailureReport({ outputs }: Props) {
  if (outputs.activeFailures.length === 0) {
    return (
      <div className="card">
        <h2>System Status</h2>
        <p style={{ color: 'var(--success)', fontSize: '0.9rem' }}>All systems nominal</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Failure Report</h2>
      {outputs.activeFailures.map(id => {
        const fm = FAILURE_MODES[id];
        if (!fm) return null;
        return (
          <div key={id} style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 4 }}>
              <span style={{
                fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: 4,
                background: fm.severity === 'catastrophic' ? 'rgba(239,68,68,0.2)' : 'rgba(234,179,8,0.2)',
                color: fm.severity === 'catastrophic' ? '#ef4444' : '#eab308',
                textTransform: 'uppercase', fontWeight: 600,
              }}>{fm.severity}</span>
              <strong style={{ fontSize: '0.85rem' }}>{fm.title}</strong>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{fm.shortDescription}</p>
            {fm.recoveryHint && (
              <p style={{ fontSize: '0.75rem', color: 'var(--accent-light)', fontStyle: 'italic', marginTop: 4 }}>{fm.recoveryHint}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
