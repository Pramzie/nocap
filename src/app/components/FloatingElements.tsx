import React from 'react';
import { motion } from 'motion/react';
import { Search, ShieldCheck, AlertTriangle, Eye } from 'lucide-react';

export function FloatingElements() {
  const elements = [
    { Icon: Search, delay: 0, x: '10%', y: '20%', duration: 20 },
    { Icon: ShieldCheck, delay: 2, x: '80%', y: '15%', duration: 25 },
    { Icon: AlertTriangle, delay: 4, x: '15%', y: '70%', duration: 22 },
    { Icon: Eye, delay: 1, x: '85%', y: '60%', duration: 18 },
    { Icon: Search, delay: 3, x: '50%', y: '40%', duration: 24 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute"
          initial={{ 
            left: element.x, 
            top: element.y,
            opacity: 0 
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.3, 0.1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            delay: element.delay,
            ease: "easeInOut"
          }}
        >
          <element.Icon className="w-16 h-16 text-yellow-400" strokeWidth={1.5} />
        </motion.div>
      ))}
    </div>
  );
}
