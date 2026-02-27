import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { MagnifyingGlass } from './components/MagnifyingGlass';
import { InfiniteTape } from './components/InfiniteTape';
import { NavigationDock } from './components/NavigationDock';
import { VerificationBox } from './components/VerificationBox';
import { Chatbot } from './components/Chatbot';
import { StatsSection } from './components/StatsSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { FloatingElements } from './components/FloatingElements';
import { AuthMenu } from './components/AuthMenu';

export default function App() {
  const { scrollYProgress } = useScroll();
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Magnifying glass scale animation - grows much faster and bigger
  const magnifyScale = useTransform(scrollYProgress, [0, 0.12], [1, 40]);
  const magnifyOpacity = useTransform(scrollYProgress, [0, 0.08, 0.12], [1, 0.6, 0]);
  
  // Magnifying glass initial position
  const magnifyX = useTransform(scrollYProgress, [0, 0.12], [0, 100]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 relative">
      {/* Infinite Tape */}
      <InfiniteTape />
      
      {/* Auth Menu */}
      <AuthMenu />
      
      {/* Floating animated elements */}
      <FloatingElements />
      
      {/* Magnifying Glass Overlay - Fixed position, covers entire viewport */}
      <motion.div
        className="fixed top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30"
        style={{ 
          opacity: magnifyOpacity,
          x: magnifyX,
        }}
      >
        <motion.div
          style={{ 
            scale: magnifyScale,
            transformOrigin: 'center center',
          }}
        >
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-50 opacity-60 blur-sm absolute inset-0 -m-6" />
          <MagnifyingGlass />
        </motion.div>
      </motion.div>
      
      {/* Hero Section */}
      <section 
        id="home" 
        ref={heroRef}
        className="min-h-screen flex items-center justify-center relative overflow-hidden px-8 md:px-16 lg:px-24"
      >
        {/* Hero Text - Centered with better spacing */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-6xl relative z-10 text-center"
        >
          <h1 className="text-8xl md:text-9xl lg:text-[12rem] mb-8 font-black text-amber-900 tracking-tight leading-none">
            noCap
          </h1>
          <p className="text-3xl md:text-4xl lg:text-5xl text-amber-800 mb-6 font-bold">
            Digital Trust & Rapid Prototyping
          </p>
          <p className="text-xl md:text-2xl lg:text-3xl text-amber-700 leading-relaxed max-w-4xl mx-auto">
            Verify the authenticity of text and images in seconds. 
            Don't trust everything you see — double check with us.
          </p>
          
          {/* Quick Action Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const element = document.getElementById('verify');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="mt-12 bg-gradient-to-r from-yellow-400 to-amber-400 text-amber-900 px-12 py-6 rounded-full font-black text-2xl shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300 border-4 border-amber-900"
          >
            Start Verifying →
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-amber-700 text-center"
          >
            <div className="text-lg mb-2 font-bold">Scroll to verify</div>
            <div className="text-3xl">↓</div>
          </motion.div>
        </motion.div>
      </section>

      {/* Verification Section */}
      <section id="verify" className="min-h-screen flex items-center justify-center py-20 px-4 relative z-20">
        <VerificationBox />
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-4">
        <StatsSection />
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-gradient-to-br from-amber-100 to-yellow-50">
        <FAQSection />
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <ContactSection />
      </section>

      {/* Navigation Dock */}
      <NavigationDock />
      
      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}