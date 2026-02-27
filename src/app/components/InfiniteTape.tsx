import React from 'react';
import { motion } from 'motion/react';

export function InfiniteTape() {
  const tapeText = "⚠ DO NOT TRUST EVERYTHING YOU SEE • DOUBLE CHECK WITH US • VERIFY BEFORE YOU SHARE • ";
  const repeatedText = tapeText.repeat(20);

  return (
    <div className="fixed top-0 left-0 w-full h-12 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 border-y-4 border-black z-50 overflow-hidden shadow-lg">
      {/* Black diagonal stripes pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, black 20px, black 25px)'
        }}
      />
      
      {/* Scrolling text */}
      <motion.div
        className="flex items-center h-full whitespace-nowrap"
        animate={{
          x: [0, -2000],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        <span className="text-black font-black text-lg tracking-wider">
          {repeatedText}
        </span>
      </motion.div>
    </div>
  );
}
