import React, { useEffect, useRef } from 'react';

const InteractiveParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracking
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 150
    };

    // Scroll tracking
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

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      // Accumulate scroll impulse (scrolling down -> positive delta -> float up)
      scrollImpulse += deltaY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Particle Palette (Nebula Purple, Galaxy Violet, Starlight Lavender, Cosmic White)
    const particleColors = [
      '75, 0, 130',    // Nebula Purple
      '122, 59, 158',  // Galaxy Violet
      '177, 143, 207', // Starlight Lavender
      '245, 243, 255'  // Cosmic White
    ];

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 2 + 0.8; // 0.8px - 2.8px
        this.baseVx = (Math.random() - 0.5) * 0.5;
        // Default slight upward floating motion
        this.baseVy = -Math.abs((Math.random() * 0.4 + 0.1)); 
        this.vx = this.baseVx;
        this.vy = this.baseVy;
        this.colorRgb = particleColors[Math.floor(Math.random() * particleColors.length)];
        this.baseAlpha = Math.random() * 0.45 + 0.25;
        this.alpha = this.baseAlpha;
        // Parallax depth multiplier: larger particles move faster on scroll
        this.parallaxFactor = 0.12 + (this.radius / 3) * 0.22;
      }

      update(currentScrollImpulse) {
        // Distance to mouse pointer
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // React to mouse pointer
        if (dist < mouse.radius) {
          const forceDirectionX = dx / dist;
          const forceDirectionY = dy / dist;
          const maxDistance = mouse.radius;
          const force = (maxDistance - dist) / maxDistance;
          
          // Repel gently away from cursor
          const pushSpeed = 3.5;
          this.vx -= forceDirectionX * force * pushSpeed * 0.1;
          this.vy -= forceDirectionY * force * pushSpeed * 0.1;
          
          // Increase opacity near mouse pointer
          this.alpha = Math.min(0.9, this.baseAlpha + force * 0.5);
        } else {
          // Gently damp velocity back to base velocity
          this.vx += (this.baseVx - this.vx) * 0.05;
          this.vy += (this.baseVy - this.vy) * 0.05;
          this.alpha += (this.baseAlpha - this.alpha) * 0.05;
        }

        // Apply normal velocity
        this.x += this.vx;
        this.y += this.vy;

        // Apply scroll-driven parallax up/down displacement
        if (Math.abs(currentScrollImpulse) > 0.01) {
          // Scrolling down (impulse > 0) shifts particle UPWARD (y decreases)
          this.y -= currentScrollImpulse * this.parallaxFactor;
        }

        // Wrap around screen edges with margin
        if (this.x < -15) this.x = width + 15;
        if (this.x > width + 15) this.x = -15;
        if (this.y < -15) this.y = height + 15;
        if (this.y > height + 15) this.y = -15;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.colorRgb}, ${this.alpha})`;
        if (this.alpha > 0.5) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = `rgba(${this.colorRgb}, 0.6)`;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    let particles = [];

    const initParticles = () => {
      const particleCount = Math.floor((width * height) / 20000);
      const count = Math.max(25, Math.min(70, particleCount));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    initParticles();

    // Render loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth inertia decay on scroll impulse
      const activeScrollImpulse = scrollImpulse;
      scrollImpulse *= 0.82;

      // Render & update particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update(activeScrollImpulse);
        p1.draw();

        // Connect p1 to mouse cursor if within range
        const dxMouse = mouse.x - p1.x;
        const dyMouse = mouse.y - p1.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < mouse.radius) {
          const lineAlpha = (1 - distMouse / mouse.radius) * 0.35;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(122, 59, 158, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        // Draw ambient constellation lines between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 85) {
            const connectAlpha = (1 - dist / 85) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(122, 59, 158, ${connectAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 opacity-70"
      aria-hidden="true"
    />
  );
};

export default InteractiveParticles;
