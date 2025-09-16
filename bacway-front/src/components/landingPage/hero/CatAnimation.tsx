import React, { useState, useEffect, useRef } from 'react'
import cat from "@/assets/artboardHero/cat.svg"
import Image from 'next/image'

const CatAnimation = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const catRef = useRef<HTMLDivElement>(null);
  const [catPosition, setCatPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    let animationFrameId: number;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Use requestAnimationFrame to throttle updates
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      animationFrameId = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      });
    };

    const updateCatPosition = () => {
      if (catRef.current) {
        const rect = catRef.current.getBoundingClientRect();
        setCatPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', updateCatPosition);
    updateCatPosition();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateCatPosition);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Calculate eye and mouth movement based on cursor position
  const calculateMovement = () => {
    if (!catPosition.width) return { eyeX: 0, eyeY: 0, mouthCurve: 0 };

    const deltaX = mousePosition.x - catPosition.x;
    const deltaY = mousePosition.y - catPosition.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Only animate when cursor is away from the cat

    // Limit eye movement range
    const maxEyeMovement = 9;
    const eyeX = Math.max(-maxEyeMovement, Math.min(maxEyeMovement, deltaX / 40));
    const eyeY = Math.max(-maxEyeMovement, Math.min(maxEyeMovement, deltaY / 40));
    
    // Calculate mouth curve based on cursor position
    const mouthCurve = Math.sin(deltaX / 100);

    return { eyeX, eyeY, mouthCurve };
  };

  const { eyeX, eyeY } = calculateMovement();

  return (
    <div 
      ref={catRef}
      className="absolute -top-70 -right-20 md:-top-80 md:right-20 w-[150%] md:w-[calc(1000px*1.6)] h-auto"
    >
      {/* Base cat image */}
      <Image
        src={cat}
        alt="bacway Cat"
        width={700}
        height={500}
        className="w-full h-auto"
      />
      
      {/* Interactive overlay with eyes and mouth */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        viewBox="0 0 700 500"
        style={{ overflow: 'visible', willChange: 'transform' }}
      >
        {/* Left Eye */}
        <ellipse
          cx={530 + eyeX}
          cy={170 + eyeY}
          rx="8"
          ry="15"
          fill="black"
          style={{
            transition: 'cx 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), cy 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            willChange: 'transform'
          }}
        />
        
        {/* Right Eye */}
        <ellipse
          cx={580 + eyeX}
          cy={170 + eyeY}
          rx="8"
          ry="15"
          fill="black"
          style={{
            transition: 'cx 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), cy 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            willChange: 'transform'
          }}
        />
        
        {/* Cat Mouth - W shape */}
        <path
          d={`M${545 + (eyeX / 2)} ${200 + (eyeY / 2)} Q${550 + (eyeX / 2)} ${205 +  (eyeY / 2)} ${555 + (eyeX / 2)} ${200 +  (eyeY / 2)} Q${562 + (eyeX / 2)} ${205 +  (eyeY / 2)} ${566 + (eyeX / 2)} ${200 +  (eyeY / 2)}`}
          stroke="black"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: 'd 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
            willChange: 'auto'
          }}
        />      </svg>
    </div>
  )
}

export default CatAnimation