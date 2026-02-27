import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Shield, MessageCircle, HelpCircle } from 'lucide-react';

export function NavigationDock() {
  const navItems = [
    { id: 'home', label: 'Homepage', icon: Home },
    { id: 'verify', label: 'Verify', icon: Shield },
    { id: 'faq', label: 'FAQs', icon: HelpCircle },
    { id: 'contact', label: 'Contact Us', icon: MessageCircle },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
    >
      <div className="flex gap-2 bg-amber-900/70 backdrop-blur-lg px-4 py-3 rounded-full shadow-2xl border-2 border-yellow-400/50">
        {navItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            onClick={() => scrollToSection(item.id)}
            whileHover={{ 
              scale: 1.15, 
              y: -8,
              transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl hover:bg-yellow-400 hover:text-amber-900 text-yellow-100 transition-colors duration-300 group cursor-pointer"
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs whitespace-nowrap font-bold">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}