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

    // Mouse tracking
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 120
    };

    let lastScrollY = window.scrollY;
    let scrollImpulse = 0;

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollImpulse += currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
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
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Lightweight Particle Palette
    const particleColors = [
      '75, 0, 130',    // Nebula Purple
      '122, 59, 158',  // Galaxy Violet
      '177, 143, 207'  // Starlight Lavender
    ];

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 1.5 + 0.8;
        this.baseVx = (Math.random() - 0.5) * 0.4;
        this.baseVy = -Math.abs(Math.random() * 0.3 + 0.1); 
        this.vx = this.baseVx;
        this.vy = this.baseVy;
        this.colorRgb = particleColors[Math.floor(Math.random() * particleColors.length)];
        this.baseAlpha = Math.random() * 0.35 + 0.2;
        this.alpha = this.baseAlpha;
        this.parallaxFactor = 0.1 + (this.radius / 2) * 0.15;
      }

      update(currentScrollImpulse) {
        if (mouse.x > 0) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouse.radius * mouse.radius) {
            const dist = Math.sqrt(distSq);
            const force = (mouse.radius - dist) / mouse.radius;
            this.vx -= (dx / dist) * force * 0.25;
            this.vy -= (dy / dist) * force * 0.25;
            this.alpha = Math.min(0.8, this.baseAlpha + force * 0.4);
          } else {
            this.vx += (this.baseVx - this.vx) * 0.05;
            this.vy += (this.baseVy - this.vy) * 0.05;
            this.alpha += (this.baseAlpha - this.alpha) * 0.05;
          }
        } else {
          this.vx += (this.baseVx - this.vx) * 0.05;
          this.vy += (this.baseVy - this.vy) * 0.05;
          this.alpha += (this.baseAlpha - this.alpha) * 0.05;
        }

        this.x += this.vx;
        this.y += this.vy;

        if (Math.abs(currentScrollImpulse) > 0.05) {
          this.y -= currentScrollImpulse * this.parallaxFactor;
        }

        if (this.x < -10) this.x = width + 10;
        if (this.x > width + 10) this.x = -10;
        if (this.y < -10) this.y = height + 10;
        if (this.y > height + 10) this.y = -10;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.colorRgb}, ${this.alpha})`;
        ctx.fill();
      }
    }

    let particles = [];

    const initParticles = () => {
      // Lightweight particle count: max 28 particles across the entire viewport
      const count = Math.min(28, Math.max(16, Math.floor(width / 50)));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    initParticles();

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

      const activeScrollImpulse = scrollImpulse;
      scrollImpulse *= 0.8;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.update(activeScrollImpulse);
        p.draw();
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 opacity-60"
      aria-hidden="true"
    />
  );
};

export default React.memo(InteractiveParticles);
