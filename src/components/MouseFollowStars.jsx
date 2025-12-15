import React, { useEffect, useRef, useState } from 'react';

const MouseFollowStars = () => {
    const [stars, setStars] = useState([]);
    const requestRef = useRef();
    const mouseRef = useRef({ x: 0, y: 0 });
    const lastSpawnRef = useRef(0);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const animate = (time) => {
        // Spawn new star every 50ms if mouse moved
        if (time - lastSpawnRef.current > 40) {
            const newStar = {
                id: Date.now() + Math.random(),
                x: mouseRef.current.x,
                y: mouseRef.current.y,
                size: Math.random() * 15 + 5, // Random size between 5 and 20
                rotation: Math.random() * 360,
                opacity: 1,
                life: 1.0,
                velocity: {
                    x: (Math.random() - 0.5) * 2,
                    y: (Math.random() - 0.5) * 2
                }
            };

            // Only spawn if we have a valid mouse position (not 0,0 initially if mouse hasn't moved)
            if (mouseRef.current.x !== 0 || mouseRef.current.y !== 0) {
                setStars(prev => [...prev, newStar]);
            }
            lastSpawnRef.current = time;
        }

        // Update stars
        setStars(prevStars => {
            return prevStars
                .map(star => ({
                    ...star,
                    x: star.x + star.velocity.x,
                    y: star.y + star.velocity.y,
                    rotation: star.rotation + 2,
                    life: star.life - 0.02, // Fade out speed
                    opacity: star.life
                }))
                .filter(star => star.life > 0);
        });

        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {stars.map(star => (
                <div
                    key={star.id}
                    className="absolute"
                    style={{
                        left: star.x,
                        top: star.y,
                        width: star.size,
                        height: star.size,
                        opacity: star.opacity,
                        transform: `translate(-50%, -50%) rotate(${star.rotation}deg)`,
                        transition: 'opacity 0.1s linear'
                    }}
                >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id={`goldGradient-${star.id}`} x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#FFED8B" />
                                <stop offset="50%" stopColor="#FFD700" />
                                <stop offset="100%" stopColor="#B8860B" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
                            fill={`url(#goldGradient-${star.id})`}
                            filter="drop-shadow(0 0 2px rgba(255, 215, 0, 0.5))"
                        />
                    </svg>
                </div>
            ))}
        </div>
    );
};

export default MouseFollowStars;
