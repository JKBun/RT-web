import React, { useEffect, useRef } from 'react';

const CurvedFlowingLines = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let isVisible = true;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 180,
      targetX: -1000,
      targetY: -1000
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    const handleVisibility = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      initLines();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    let lines = [];

    const initLines = () => {
      const lineCount = Math.min(18, Math.max(10, Math.floor(width / 75)));
      lines = [];

      for (let i = 0; i < lineCount; i++) {
        const baseX = ((i + 0.5) / lineCount) * width;
        const pointCount = 18;
        const points = [];
        const segmentHeight = height / (pointCount - 1);

        const waveFrequency = 0.009 + Math.random() * 0.006;
        const waveAmplitude = 30 + Math.random() * 25;
        const phase = Math.random() * Math.PI * 2;
        const baseOpacity = 0.08 + Math.random() * 0.07;
        const lineWidth = 0.6 + Math.random() * 0.4;

        for (let j = 0; j < pointCount; j++) {
          const baseY = j * segmentHeight;
          const staticWaveOffset = Math.sin(baseY * waveFrequency + phase) * waveAmplitude;
          const targetX = baseX + staticWaveOffset;

          points.push({
            baseX,
            baseY,
            targetX,
            x: targetX,
            y: baseY,
            hoverPhase: 0
          });
        }

        lines.push({
          baseX,
          points,
          baseOpacity,
          lineWidth
        });
      }
    };

    initLines();

    let lastTime = performance.now();
    const targetFps = 35;
    const interval = 1000 / targetFps;

    const animate = (currentTime) => {
      if (!isVisible) return;

      animationFrameId = requestAnimationFrame(animate);

      const delta = currentTime - lastTime;
      if (delta < interval) return;
      lastTime = currentTime - (delta % interval);

      ctx.clearRect(0, 0, width, height);

      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      const hasMouseNearby = mouse.x > -500;

      for (let l = 0; l < lines.length; l++) {
        const line = lines[l];
        const points = line.points;

        if (hasMouseNearby) {
          for (let i = 0; i < points.length; i++) {
            const pt = points[i];
            const dx = mouse.x - pt.targetX;
            const dy = mouse.y - pt.baseY;
            const distSq = dx * dx + dy * dy;

            if (distSq < mouse.radius * mouse.radius) {
              const dist = Math.sqrt(distSq);
              const repelNorm = (mouse.radius - dist) / mouse.radius;
              const repelX = (dx < 0 ? 1 : -1) * repelNorm * 25;
              pt.hoverPhase += 0.08;
              const hoverVibe = Math.sin(pt.hoverPhase) * (repelNorm * 5);
              const desiredX = pt.targetX + repelX + hoverVibe;
              pt.x += (desiredX - pt.x) * 0.15;
            } else {
              pt.x += (pt.targetX - pt.x) * 0.08;
            }
          }
        }

        // Draw smooth curve
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }

        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${line.baseOpacity})`;
        ctx.lineWidth = line.lineWidth;
        ctx.stroke();
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-70"
      aria-hidden="true"
    />
  );
};

export default React.memo(CurvedFlowingLines);
