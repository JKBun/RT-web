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

    // Mouse Tracking with smooth spring easing
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 200
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
      // Dense, rich flowing silk lines (28-36 lines across hero)
      const lineCount = Math.min(36, Math.max(22, Math.floor(width / 38)));
      lines = [];

      for (let i = 0; i < lineCount; i++) {
        const baseX = ((i + 0.5) / lineCount) * width;
        const pointCount = 35;
        const points = [];
        const segmentHeight = height / (pointCount - 1);

        const waveFrequency = 0.007 + Math.random() * 0.006;
        const waveAmplitude = 35 + Math.random() * 30;
        const phase = Math.random() * Math.PI * 2;
        const baseOpacity = 0.12 + Math.random() * 0.12;
        const lineWidth = 0.8 + Math.random() * 0.6;
        const speed = 0.008 + Math.random() * 0.008;

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
            currentWaveOffset: staticWaveOffset,
            waveFrequency,
            phase: phase + j * 0.08,
            speed
          });
        }

        lines.push({
          baseX,
          points,
          baseOpacity,
          lineWidth,
          colorHue: i % 3 === 0 ? '192, 132, 252' : i % 2 === 0 ? '255, 255, 255' : '177, 143, 207'
        });
      }
    };

    initLines();

    let time = 0;

    const animate = () => {
      if (!isVisible) return;
      animationFrameId = requestAnimationFrame(animate);

      time += 0.02;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse easing
      mouse.x += (mouse.targetX - mouse.x) * 0.18;
      mouse.y += (mouse.targetY - mouse.y) * 0.18;

      const hasMouseNearby = mouse.x > -500;

      for (let l = 0; l < lines.length; l++) {
        const line = lines[l];
        const points = line.points;

        for (let i = 0; i < points.length; i++) {
          const pt = points[i];

          // Gentle ambient organic breathing wave
          const dynamicOffset = Math.sin(time * 0.8 + pt.phase) * 6;
          let currentTargetX = pt.baseX + pt.currentWaveOffset + dynamicOffset;

          if (hasMouseNearby) {
            const dx = mouse.x - currentTargetX;
            const dy = mouse.y - pt.baseY;
            const distSq = dx * dx + dy * dy;

            if (distSq < mouse.radius * mouse.radius) {
              const dist = Math.sqrt(distSq);
              const repelNorm = (mouse.radius - dist) / mouse.radius;
              // Fluid wave repulsion with reactive curvature
              const repelX = (dx < 0 ? 1 : -1) * repelNorm * 42;
              const waveRipple = Math.sin(time * 3 + pt.phase) * (repelNorm * 10);
              currentTargetX += repelX + waveRipple;
            }
          }

          // Smooth spring interpolation
          pt.x += (currentTargetX - pt.x) * 0.14;
        }

        // Render silky smooth quadratic bezier curve
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }

        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

        // Highlight lines near the cursor with vibrant glow
        let currentOpacity = line.baseOpacity;
        if (hasMouseNearby) {
          const distToLine = Math.abs(mouse.x - line.baseX);
          if (distToLine < mouse.radius * 0.9) {
            const boost = (1 - distToLine / (mouse.radius * 0.9)) * 0.25;
            currentOpacity = Math.min(0.65, currentOpacity + boost);
          }
        }

        ctx.strokeStyle = `rgba(${line.colorHue}, ${currentOpacity})`;
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
      className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-75"
      aria-hidden="true"
    />
  );
};

export default React.memo(CurvedFlowingLines);
