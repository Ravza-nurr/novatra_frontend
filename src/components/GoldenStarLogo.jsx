import React from 'react';

const GoldenStarLogo = () => {
  return (
    <div className="relative flex items-center justify-center">
      <style>{`
        @keyframes shootingStarGolden {
          0% {
            transform: translateX(-100%) translateY(100%) scale(0.5) rotate(-45deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%) translateY(-100%) scale(1.2) rotate(45deg);
            opacity: 0;
          }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }

        .golden-star-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .golden-star-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.6));
          animation: pulseGolden 3s infinite ease-in-out;
        }
        
        @keyframes pulseGolden {
            0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.6)); }
            50% { transform: scale(1.1); filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.9)); }
        }

        /* Shooting star effect overlay */
        .shooting-star-effect {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .trail-particle {
            position: absolute;
            background: #FFD700;
            border-radius: 50%;
            box-shadow: 0 0 4px #FFD700;
        }

      `}</style>

      <div className="golden-star-container">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="golden-star-img">
          <defs>
            <linearGradient id="goldGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFED8B" />
              <stop offset="20%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#B8860B" />
              <stop offset="80%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#FFED8B" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
            fill="url(#goldGradient)"
            filter="url(#glow)"
          />
          {/* Sparkles */}
          <circle cx="12" cy="12" r="8" stroke="url(#goldGradient)" strokeWidth="0.5" opacity="0.5">
            <animate attributeName="r" values="8;10;8" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    </div>
  );
};

export default GoldenStarLogo;
