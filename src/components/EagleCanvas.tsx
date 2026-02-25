import { useRef, useEffect } from 'react';
import type { SimOutputs } from '../sim';

interface Props {
  outputs: SimOutputs;
}

export function EagleCanvas({ outputs }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const health = outputs.viabilityIndex;
    const hue = Math.max(0, Math.min(120, (health / 100) * 120));
    const bodyColor = `hsl(${hue}, 40%, 30%)`;
    const wingColor = `hsl(${hue}, 35%, 25%)`;
    const wingDroop = outputs.canFly ? 0 : Math.max(0, (100 - health) / 100) * 40;

    const cx = w / 2;
    const cy = h / 2;

    // Wings
    ctx.fillStyle = wingColor;
    // Left wing
    ctx.beginPath();
    ctx.moveTo(cx - 15, cy);
    ctx.quadraticCurveTo(cx - 80, cy - 50 + wingDroop, cx - 130, cy - 30 + wingDroop);
    ctx.quadraticCurveTo(cx - 80, cy + 10 + wingDroop * 0.5, cx - 15, cy + 10);
    ctx.closePath();
    ctx.fill();
    // Right wing
    ctx.beginPath();
    ctx.moveTo(cx + 15, cy);
    ctx.quadraticCurveTo(cx + 80, cy - 50 + wingDroop, cx + 130, cy - 30 + wingDroop);
    ctx.quadraticCurveTo(cx + 80, cy + 10 + wingDroop * 0.5, cx + 15, cy + 10);
    ctx.closePath();
    ctx.fill();

    // Wing feather lines
    ctx.strokeStyle = `hsl(${hue}, 30%, 20%)`;
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      const t = i / 6;
      const lx = cx - 15 - t * 115;
      const ly = cy - 10 + wingDroop * t;
      ctx.beginPath();
      ctx.moveTo(lx, ly - 15);
      ctx.lineTo(lx, ly + 10);
      ctx.stroke();

      const rx = cx + 15 + t * 115;
      ctx.beginPath();
      ctx.moveTo(rx, ly - 15);
      ctx.lineTo(rx, ly + 10);
      ctx.stroke();
    }

    // Body
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 18, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(cx, cy - 30, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#f5f5f4';
    ctx.fill();

    // Beak
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.moveTo(cx - 2, cy - 30);
    ctx.lineTo(cx + 12, cy - 28);
    ctx.lineTo(cx + 2, cy - 24);
    ctx.closePath();
    ctx.fill();

    // Eye
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(cx + 3, cy - 32, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Tail feathers
    ctx.fillStyle = wingColor;
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy + 20);
    ctx.lineTo(cx, cy + 45);
    ctx.lineTo(cx + 8, cy + 20);
    ctx.closePath();
    ctx.fill();

    // Airflow lines (if flying)
    if (outputs.canFly) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const y = cy - 40 + i * 20;
        ctx.beginPath();
        ctx.moveTo(20, y);
        ctx.bezierCurveTo(cx - 60, y - 5, cx + 60, y + 5, w - 20, y);
        ctx.stroke();
      }
    }

    // Status text
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    const status = outputs.canFly ? 'FLYING' : 'GROUNDED';
    const statusColor = outputs.canFly ? '#22c55e' : '#ef4444';
    ctx.fillStyle = statusColor;
    ctx.fillText(status, cx, h - 25);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`${outputs.scaleFactor.toFixed(1)}× scale  |  ${outputs.mass.toFixed(1)} kg  |  ${outputs.wingspan.toFixed(1)}m span`, cx, h - 10);
  }, [outputs]);

  return (
    <div className="card" style={{ display: 'flex', justifyContent: 'center' }}>
      <canvas ref={canvasRef} width={350} height={260} />
    </div>
  );
}
