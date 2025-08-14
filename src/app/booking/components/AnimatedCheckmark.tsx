import React from "react";

export default function AnimatedCheckmark({ size = 64, color = "#4f46e5" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-checkmark"
      style={{ display: 'block', margin: '0 auto' }}
    >
      <circle
        cx="32"
        cy="32"
        r="30"
        stroke={color}
        strokeWidth="4"
        fill="white"
        style={{ filter: 'drop-shadow(0 2px 8px rgba(79,70,229,0.15))' }}
      />
      <path
        d="M20 34L29 43L44 25"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 40,
          strokeDashoffset: 40,
          animation: 'checkmark-draw 0.7s 0.2s cubic-bezier(0.65,0,0.45,1) forwards'
        }}
      />
      <style>{`
        .animate-checkmark path {
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
