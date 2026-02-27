import React from 'react';

export function MagnifyingGlass() {
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Handle */}
      <path
        d="M 140 140 L 180 180"
        stroke="#8B4513"
        strokeWidth="12"
        strokeLinecap="round"
      />
      
      {/* Handle grip */}
      <line x1="145" y1="145" x2="175" y2="175" stroke="#A0674A" strokeWidth="6" />
      
      {/* Outer rim */}
      <circle 
        cx="100" 
        cy="100" 
        r="65" 
        fill="none" 
        stroke="#8B4513" 
        strokeWidth="8"
      />
      
      {/* Inner rim detail */}
      <circle 
        cx="100" 
        cy="100" 
        r="58" 
        fill="none" 
        stroke="#A0674A" 
        strokeWidth="2"
      />
      
      {/* Glass lens - less yellow, more clear */}
      <circle 
        cx="100" 
        cy="100" 
        r="60" 
        fill="url(#glassGradient)"
        opacity="0.4"
      />
      
      {/* Glass shine/reflection */}
      <ellipse 
        cx="75" 
        cy="75" 
        rx="25" 
        ry="35" 
        fill="white" 
        opacity="0.7"
      />
      
      {/* Smaller shine */}
      <circle 
        cx="120" 
        cy="110" 
        r="12" 
        fill="white" 
        opacity="0.5"
      />
      
      {/* Gradient definition for glass */}
      <defs>
        <radialGradient id="glassGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E8F4F8" />
          <stop offset="50%" stopColor="#B8E6F0" />
          <stop offset="100%" stopColor="#87CEEB" />
        </radialGradient>
      </defs>
    </svg>
  );
}
