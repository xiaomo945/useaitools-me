'use client';

import React, { useEffect, useRef } from 'react';

export default function EnhancedHeroEffect() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createOrb = () => {
      const orb = document.createElement('div');
      const size = Math.random() * 200 + 100;
      const colors = [
        'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
        'radial-gradient(circle, rgba(20, 184, 166, 0.12) 0%, transparent 70%)',
        'radial-gradient(circle, rgba(167, 139, 250, 0.1) 0%, transparent 70%)',
        'radial-gradient(circle, rgba(96, 165, 250, 0.1) 0%, transparent 70%)',
      ];

      orb.style.position = 'absolute';
      orb.style.width = `${size}px`;
      orb.style.height = `${size}px`;
      orb.style.borderRadius = '50%';
      orb.style.background = colors[Math.floor(Math.random() * colors.length)];
      orb.style.left = `${Math.random() * 100}%`;
      orb.style.top = `${Math.random() * 100}%`;
      orb.style.transform = 'translate(-50%, -50%)';
      orb.style.pointerEvents = 'none';
      orb.style.filter = 'blur(40px)';
      orb.style.zIndex = '0';
      
      container.appendChild(orb);

      // Animate
      const duration = Math.random() * 20000 + 10000;
      let startTime: number | null = null;
      const startX = parseFloat(orb.style.left);
      const startY = parseFloat(orb.style.top);
      const moveX = (Math.random() - 0.5) * 20;
      const moveY = (Math.random() - 0.5) * 20;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = ((timestamp - startTime) % duration) / duration;
        const ease = 0.5 - 0.5 * Math.cos(progress * Math.PI * 2);
        
        orb.style.left = `${startX + moveX * ease}%`;
        orb.style.top = `${startY + moveY * ease}%`;
        orb.style.opacity = String(0.3 + 0.2 * Math.sin(progress * Math.PI * 2));

        requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    };

    // Create multiple orbs
    for (let i = 0; i < 5; i++) {
      setTimeout(createOrb, i * 500);
    }
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    />
  );
}
