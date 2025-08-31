import React from "react";

export default function AnimatedCheckmark({ size = 120, color = "#22c55e" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-checkmark-bounce"
      style={{ display: 'block', margin: '0 auto' }}
    >
      <circle
        cx="32"
        cy="32"
        r="30"
        stroke={color}
        strokeWidth="5"
        fill="none"
        style={{ filter: 'drop-shadow(0 4px 18px rgba(34,197,94,0.25))' }}
      />
      <path
        d="M20 34L29 43L44 25"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 40,
          strokeDashoffset: 40,
          animation: 'checkmark-draw 0.7s 0.2s cubic-bezier(0.65,0,0.45,1) forwards'
        }}
      />
      <style>{`
        .animate-checkmark-bounce {
          animation: checkmark-bounce 0.7s cubic-bezier(0.68,-0.55,0.27,1.55);
        }
        @keyframes checkmark-bounce {
          0% { transform: scale(0.7); opacity: 0; }
          60% { transform: scale(1.15); opacity: 1; }
          80% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        .animate-checkmark-bounce path {
          stroke-dasharray: 40;
          stroke-dashoffset: 40;
          animation: checkmark-draw 0.7s 0.2s cubic-bezier(0.65,0,0.45,1) forwards;
        }
        @keyframes checkmark-draw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );
}
