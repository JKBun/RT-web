import React, { useEffect, useRef } from 'react';

const InteractiveParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let isVisible = true;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse & Touch Tracking
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 170,
      vx: 0,
      vy: 0,
      lastX: -1000,
      lastY: -1000
    };

    // Click / Touch Shockwave ripples
    const shockwaves = [];

    const handleMouseMove = (e) => {
      mouse.vx = e.clientX - mouse.x;
      mouse.vy = e.clientY - mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleClick = (e) => {
      shockwaves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 10,
        maxRadius: 220,
        alpha: 0.85,
        speed: 7
      });
    };

    let lastScrollY = window.scrollY;
    let scrollImpulse = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollImpulse += currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
    };

    const handleVisibility = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('mousedown', handleClick, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Rotaract Interactive Palette: Deep Nebula Purple, Royal Violet, Starlight Lavender, Neon Fuchsia
    const particleColors = [
      '75, 0, 130',    // Nebula Deep Purple
      '122, 59, 158',  // Rotaract Violet
      '177, 143, 207', // Radiant Starlight Lavender
      '192, 132, 252', // Neon Violet Glow
      '233, 213, 255'  // Bright Pearl
    ];

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 2.2 + 1.0;
        this.baseVx = (Math.random() - 0.5) * 0.7;
        this.baseVy = (Math.random() - 0.5) * 0.7 - 0.15;
        this.vx = this.baseVx;
        this.vy = this.baseVy;
        this.colorRgb = particleColors[Math.floor(Math.random() * particleColors.length)];
        this.baseAlpha = Math.random() * 0.45 + 0.3;
        this.alpha = this.baseAlpha;
        this.parallaxFactor = 0.15 + (this.radius / 3) * 0.25;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update(currentScrollImpulse) {
        this.pulsePhase += 0.03;
        const currentRadius = this.radius + Math.sin(this.pulsePhase) * 0.4;

        // Dynamic Interactive Mouse Repulsion & Spring
        if (mouse.x > -500) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouse.radius * mouse.radius) {
            const dist = Math.sqrt(distSq);
            const force = (mouse.radius - dist) / mouse.radius;
            // Magnetic repel with gentle elastic bounce
            this.vx -= (dx / dist) * force * 1.2;
            this.vy -= (dy / dist) * force * 1.2;
            this.alpha = Math.min(1.0, this.baseAlpha + force * 0.6);
          } else {
            this.vx += (this.baseVx - this.vx) * 0.04;
            this.vy += (this.baseVy - this.vy) * 0.04;
            this.alpha += (this.baseAlpha - this.alpha) * 0.04;
          }
        } else {
          this.vx += (this.baseVx - this.vx) * 0.04;
          this.vy += (this.baseVy - this.vy) * 0.04;
          this.alpha += (this.baseAlpha - this.alpha) * 0.04;
        }

        // Apply Click Shockwave Energy
        for (let i = 0; i < shockwaves.length; i++) {
          const sw = shockwaves[i];
          const sdx = this.x - sw.x;
          const sdy = this.y - sw.y;
          const sdist = Math.sqrt(sdx * sdx + sdy * sdy);
          if (Math.abs(sdist - sw.radius) < 35) {
            const push = (1 - Math.abs(sdist - sw.radius) / 35) * 3.5;
            this.vx += (sdx / (sdist || 1)) * push;
            this.vy += (sdy / (sdist || 1)) * push;
            this.alpha = Math.min(1.0, this.alpha + 0.5);
          }
        }

        // Apply Damping
        this.vx *= 0.96;
        this.vy *= 0.96;

        this.x += this.vx;
        this.y += this.vy;

        // Subtle Scroll Parallax
        if (Math.abs(currentScrollImpulse) > 0.05) {
          this.y -= currentScrollImpulse * this.parallaxFactor;
        }

        // Edge Wrap
        if (this.x < -20) this.x = width + 20;
        if (this.x > width + 20) this.x = -20;
        if (this.y < -20) this.y = height + 20;
        if (this.y > height + 20) this.y = -20;

        return currentRadius;
      }

      draw(currentRadius) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.colorRgb}, ${this.alpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = `rgba(${this.colorRgb}, 0.7)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    let particles = [];

    const initParticles = () => {
      // Dense, rich particle galaxy (65-85 particles across screen)
      const count = Math.min(85, Math.max(45, Math.floor(width / 22)));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    initParticles();

    const animate = () => {
      if (!isVisible) return;
      animationFrameId = requestAnimationFrame(animate);

      ctx.clearRect(0, 0, width, height);

      const activeScrollImpulse = scrollImpulse;
      scrollImpulse *= 0.85;

      // Update & Render Click Shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += sw.speed;
        sw.alpha -= 0.02;

        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(177, 143, 207, ${sw.alpha * 0.4})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      const currentRadii = new Float32Array(particles.length);

      // 1. Update and Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        currentRadii[i] = p.update(activeScrollImpulse);
        p.draw(currentRadii[i]);
      }

      // 2. Draw Constellation Lines Between Nearby Particles
      const maxDist = 95;
      const maxDistSq = maxDist * maxDist;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / maxDist) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(177, 143, 207, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // 3. Draw Laser / Starlight Connections to Mouse Cursor
        if (mouse.x > -500) {
          const mdx = mouse.x - p1.x;
          const mdy = mouse.y - p1.y;
          const mdistSq = mdx * mdx + mdy * mdy;
          const mouseConnectDist = mouse.radius * 0.85;

          if (mdistSq < mouseConnectDist * mouseConnectDist) {
            const mdist = Math.sqrt(mdistSq);
            const beamAlpha = (1 - mdist / mouseConnectDist) * 0.45;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(192, 132, 252, ${beamAlpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      // 4. Subtle Ambient Cursor Aura
      if (mouse.x > -500) {
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouse.radius * 0.7);
        gradient.addColorStop(0, 'rgba(122, 59, 158, 0.12)');
        gradient.addColorStop(1, 'rgba(75, 0, 130, 0)');
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 opacity-75"
      aria-hidden="true"
    />
  );
};

export default React.memo(InteractiveParticles);
