import { useRef, useEffect } from 'react';

interface Props {
  value: number;
}

export function ViabilityGauge({ value }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h - 20;
    const r = 70;

    ctx.clearRect(0, 0, w, h);

    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, 0, false);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.stroke();

    const angle = Math.PI + (Math.PI * Math.min(100, Math.max(0, value))) / 100;
    const color = value > 70 ? '#22c55e' : value > 40 ? '#eab308' : '#ef4444';
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, angle, false);
    ctx.strokeStyle = color;
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.font = 'bold 24px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(value)}`, cx, cy - 20);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px Inter, system-ui, sans-serif';
    ctx.fillText('VIABILITY', cx, cy - 2);
  }, [value]);

  return (
    <div className="card" style={{ display: 'flex', justifyContent: 'center' }}>
      <canvas ref={canvasRef} width={200} height={110} />
    </div>
  );
}
