import { useRef, useEffect } from 'react';
import type { SimOutputs } from '../sim';

interface Props {
  outputs: SimOutputs;
}

export function FlightEnvelope({ outputs }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const pad = { top: 20, right: 15, bottom: 30, left: 45 };
    const pw = w - pad.left - pad.right;
    const ph = h - pad.top - pad.bottom;

    ctx.clearRect(0, 0, w, h);

    const maxSpeed = 50;
    const maxAlt = 6000;

    const xScale = (speed: number) => pad.left + (speed / maxSpeed) * pw;
    const yScale = (alt: number) => pad.top + ph - (alt / maxAlt) * ph;

    // Flight envelope region
    const envSpeed = Math.min(outputs.maxFlightSpeed, maxSpeed);
    const envAlt = Math.min(outputs.maxFlightAltitude, maxAlt);

    if (envSpeed > 0 && envAlt > 0) {
      ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
      ctx.beginPath();
      ctx.moveTo(xScale(0), yScale(0));
      ctx.lineTo(xScale(envSpeed), yScale(0));
      ctx.lineTo(xScale(envSpeed * 0.7), yScale(envAlt));
      ctx.lineTo(xScale(0), yScale(envAlt * 0.8));
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = 'rgba(14, 165, 233, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, pad.top + ph);
    ctx.lineTo(pad.left + pw, pad.top + ph);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Speed (m/s)', pad.left + pw / 2, h - 5);
    ctx.fillText('0', xScale(0), h - 15);
    ctx.fillText(String(maxSpeed), xScale(maxSpeed), h - 15);

    ctx.save();
    ctx.translate(12, pad.top + ph / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Altitude (m)', 0, 0);
    ctx.restore();

    ctx.textAlign = 'right';
    ctx.fillText('0', pad.left - 4, yScale(0) + 4);
    ctx.fillText(String(maxAlt), pad.left - 4, yScale(maxAlt) + 4);

    // Grounded overlay
    if (!outputs.canFly) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.fillRect(pad.left, pad.top, pw, ph);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 18px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GROUNDED', pad.left + pw / 2, pad.top + ph / 2);
    }
  }, [outputs]);

  return (
    <div className="card">
      <h2>Flight Envelope</h2>
      <canvas ref={canvasRef} width={300} height={200} style={{ width: '100%' }} />
      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
        Max speed: {outputs.maxFlightSpeed.toFixed(1)} m/s | Ceiling: {Math.round(outputs.maxFlightAltitude)}m
      </div>
    </div>
  );
}
