import React, { useEffect, useRef } from 'react';

const CurvedFlowingLines = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Mouse coordinates relative to hero container
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 200,
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

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.targetX = e.touches[0].clientX - rect.left;
        mouse.targetY = e.touches[0].clientY - rect.top;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      initLines();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    let lines = [];

    // Initialize elegant vertical lines spaced closely across the width
    const initLines = () => {
      const lineCount = Math.max(22, Math.floor(width / 45));
      lines = [];

      for (let i = 0; i < lineCount; i++) {
        // Base X position distributed across screen width
        const baseX = ((i + 0.5) / lineCount) * width;
        
        // Vertical resolution: array of points along the line from top to bottom
        const pointCount = 45;
        const points = [];
        const segmentHeight = height / (pointCount - 1);

        // Organic static wave parameters per line
        const waveFrequency = 0.009 + Math.random() * 0.006;
        const waveAmplitude = 35 + Math.random() * 30; // Horizontal curve width
        const phase = Math.random() * Math.PI * 2;
        const baseOpacity = 0.07 + Math.random() * 0.08; // Subtle soft white opacity
        const lineWidth = 0.5 + Math.random() * 0.5; // Finer, thinner lines (0.5px - 1.0px)

        for (let j = 0; j < pointCount; j++) {
          const baseY = j * segmentHeight;
          // Static curved position
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
          waveFrequency,
          waveAmplitude,
          phase,
          baseOpacity,
          lineWidth
        });
      }
    };

    initLines();

    // Render loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse position damping
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      lines.forEach((line) => {
        const points = line.points;

        // 1. Calculate new point positions - strictly static unless mouse is hovering nearby
        for (let i = 0; i < points.length; i++) {
          const pt = points[i];

          // Distance from this point to mouse cursor
          const dx = mouse.x - pt.targetX;
          const dy = mouse.y - pt.baseY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let mousePushX = 0;
          let mousePushY = 0;

          if (dist < mouse.radius && mouse.x > 0) {
            const force = (1 - dist / mouse.radius);
            
            // Advance hover phase for gentle ripple motion under the cursor
            pt.hoverPhase += 0.04;
            const ripple = Math.sin(pt.hoverPhase) * 12 * force;

            // Elastic push away from cursor with gentle curvature
            const angle = Math.atan2(dy, dx);
            const pushMagnitude = force * force * 50; // Push distance in pixels
            mousePushX = -Math.cos(angle) * pushMagnitude + ripple;
            mousePushY = -Math.sin(angle) * pushMagnitude * 0.25;
          } else {
            // Decay hover phase back to 0 when mouse moves away
            pt.hoverPhase *= 0.9;
          }

          // Elastic spring interpolation back to static target position when not hovered
          pt.x += (pt.targetX + mousePushX - pt.x) * 0.12;
          pt.y += (pt.baseY + mousePushY - pt.y) * 0.12;
        }

        // 2. Render smooth cubic Bezier curve through the line points (base state)
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 0; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }

        const lastPt = points[points.length - 1];
        ctx.lineTo(lastPt.x, lastPt.y);

        // Draw base non-glowing line
        ctx.strokeStyle = `rgba(255, 255, 255, ${line.baseOpacity})`;
        ctx.lineWidth = line.lineWidth;
        ctx.shadowBlur = 0;
        ctx.stroke();

        // 3. Render small, soft, feathered glowing overlay ONLY right around mouse cursor
        if (mouse.x > 0) {
          const glowRadius = 100; // Small, delicate highlight radius

          for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i + 1];
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            const dist = Math.hypot(mouse.x - midX, mouse.y - midY);

            if (dist < glowRadius) {
              const norm = dist / glowRadius;
              // Smooth cubic falloff so highlight seamlessly fades to zero at the edges
              const factor = Math.pow(1 - norm, 2.5);
              const glowAlpha = factor * 0.4;
              const glowWidth = line.lineWidth + factor * 0.7;

              if (glowAlpha > 0.01) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
                ctx.strokeStyle = `rgba(225, 205, 255, ${glowAlpha * 1.2})`;
                ctx.lineWidth = glowWidth;
                ctx.shadowBlur = 8 * factor;
                ctx.shadowColor = 'rgba(177, 143, 207, 0.95)';
                ctx.stroke();
                ctx.shadowBlur = 0;
              }
            }
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-55"
      aria-hidden="true"
    />
  );
};

export default CurvedFlowingLines;
