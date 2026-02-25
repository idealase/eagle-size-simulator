interface Props {
  scaleFactor: number;
}

const FACTS = [
  { maxScale: 1.5, text: 'Bald eagles have a wingspan of about 2 meters and can dive at speeds exceeding 160 km/h. They are already impressive predators at their natural size.' },
  { maxScale: 3, text: 'Your eagle now has a wingspan comparable to a hang glider. The Andean Condor (~3.3m wingspan) is near the theoretical flight limit for birds.' },
  { maxScale: 5, text: 'Your eagle matches Argentavis magnificens, the largest flying bird ever. At 72 kg, it could only soar — flapping was metabolically impossible.' },
  { maxScale: 8, text: 'Your eagle exceeds Quetzalcoatlus, the largest pterosaur (10-11m wingspan). But pterosaurs had fundamentally different anatomy optimized for extreme size.' },
  { maxScale: Infinity, text: 'At this scale, no known biology can sustain flight. Your eagle is a monument to the impossibility of scaling up flying creatures.' },
];

export function FunFactsPanel({ scaleFactor }: Props) {
  const fact = FACTS.find(f => scaleFactor <= f.maxScale) ?? FACTS[FACTS.length - 1];

  return (
    <div className="card">
      <h2>Did You Know?</h2>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        {fact.text}
      </p>
    </div>
  );
}
