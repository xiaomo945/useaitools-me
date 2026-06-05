'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  radius: number;
  color: string;
}

export default function CardParticleEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    const colors = [
      'rgba(16, 185, 129, 0.8)', // emerald-500
      'rgba(20, 184, 166, 0.8)', // teal-500
      'rgba(167, 139, 250, 0.8)', // violet-400
    ];

    const createParticle = (x: number, y: number) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.5 + 0.5;
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: Math.random() * 0.8 + 0.4,
        radius: Math.random() * 2.5 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.025;
        particle.vy += 0.04;

        if (particle.life <= 0) return false;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * particle.life, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace('0.8', String(particle.life * 0.7));
        ctx.fill();

        return true;
      });

      animationRef.current = requestAnimationFrame(drawParticles);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovering) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      particlesRef.current.push(createParticle(x, y));
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      for (let i = 0; i < 12; i++) {
        particlesRef.current.push(createParticle(centerX, centerY));
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    resizeCanvas();
    drawParticles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovering, isMobile]);

  if (isMobile) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10 rounded-2xl"
      aria-hidden="true"
    />
  );
}
