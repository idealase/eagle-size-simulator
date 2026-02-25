import { useRef, useEffect } from 'react';
import { simulate } from '../sim';
import type { SimParams } from '../sim';
import { WING_LOADING_THRESHOLD, BONE_THRESHOLD, POWER_THRESHOLD, THERMO_THRESHOLD } from '../sim/simDefaults';

interface Props {
  params: SimParams;
}

const COLORS = { wingLoading: '#ef4444', bone: '#f97316', power: '#eab308', thermo: '#0ea5e9' };

export function StressChart({ params }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const pad = { top: 10, right: 10, bottom: 25, left: 35 };
    const pw = w - pad.left - pad.right;
    const ph = h - pad.top - pad.bottom;

    ctx.clearRect(0, 0, w, h);

    const sizeMin = 0.3;
    const sizeMax = 5;
    const n = 100;
    const points: { size: number; wl: number; bone: number; power: number; thermo: number }[] = [];

    for (let i = 0; i < n; i++) {
      const size = sizeMin + (sizeMax - sizeMin) * (i / (n - 1));
      const out = simulate({ ...params, bodyLength: size });
      points.push({ size, wl: out.wingLoadingCapacity, bone: out.boneCapacity, power: out.powerCapacity, thermo: out.thermoCapacity });
    }

    const xScale = (size: number) => pad.left + ((size - sizeMin) / (sizeMax - sizeMin)) * pw;
    const yScale = (v: number) => pad.top + ph - Math.min(1, Math.max(0, v)) * ph;

    for (const t of [
      { val: WING_LOADING_THRESHOLD, color: COLORS.wingLoading },
      { val: BONE_THRESHOLD, color: COLORS.bone },
      { val: POWER_THRESHOLD, color: COLORS.power },
      { val: THERMO_THRESHOLD, color: COLORS.thermo },
    ]) {
      ctx.beginPath();
      ctx.moveTo(pad.left, yScale(t.val));
      ctx.lineTo(w - pad.right, yScale(t.val));
      ctx.strokeStyle = t.color;
      ctx.globalAlpha = 0.2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }

    const drawLine = (key: 'wl' | 'bone' | 'power' | 'thermo', color: string) => {
      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        const x = xScale(points[i].size);
        const y = yScale(points[i][key]);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    drawLine('wl', COLORS.wingLoading);
    drawLine('bone', COLORS.bone);
    drawLine('power', COLORS.power);
    drawLine('thermo', COLORS.thermo);

    const cx = xScale(params.bodyLength);
    ctx.beginPath();
    ctx.moveTo(cx, pad.top);
    ctx.lineTo(cx, pad.top + ph);
    ctx.strokeStyle = '#fff';
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Inter, system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('1.0', pad.left - 4, pad.top + 4);
    ctx.fillText('0', pad.left - 4, pad.top + ph + 4);
    ctx.textAlign = 'center';
    ctx.fillText('0.3m', xScale(sizeMin), h - 4);
    ctx.fillText('5m', xScale(sizeMax), h - 4);
  }, [params]);

  return (
    <div className="card">
      <h2>Capacity Proxies</h2>
      <canvas ref={canvasRef} width={300} height={180} style={{ width: '100%' }} />
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.7rem', marginTop: 4 }}>
        <span style={{ color: COLORS.wingLoading }}>Wing Loading</span>
        <span style={{ color: COLORS.bone }}>Bone</span>
        <span style={{ color: COLORS.power }}>Power</span>
        <span style={{ color: COLORS.thermo }}>Thermo</span>
      </div>
    </div>
  );
}
