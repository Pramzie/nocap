import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Users, Shield, Clock } from 'lucide-react';

export function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: '50K+',
      label: 'Content Verifications',
      color: 'from-yellow-400 to-amber-400'
    },
    {
      icon: Shield,
      value: '94%',
      label: 'Accuracy Rate',
      color: 'from-amber-400 to-orange-400'
    },
    {
      icon: Clock,
      value: '<2s',
      label: 'Average Verification Time',
      color: 'from-yellow-300 to-yellow-400'
    },
    {
      icon: TrendingUp,
      value: '2M+',
      label: 'Fake Content Detected',
      color: 'from-orange-400 to-amber-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-5xl md:text-6xl font-black text-amber-900 mb-4">
          The Numbers Don't Lie
        </h2>
        <p className="text-xl text-amber-700">
          Trusted by thousands to verify digital content
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            className={`bg-gradient-to-br ${stat.color} p-8 rounded-2xl shadow-xl border-4 border-amber-900 relative overflow-hidden`}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 opacity-10">
              <stat.icon className="w-32 h-32" />
            </div>

            <div className="relative z-10">
              <stat.icon className="w-12 h-12 text-amber-900 mb-4" />
              <div className="text-5xl font-black text-amber-900 mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-bold text-amber-800">
                {stat.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12 bg-gradient-to-r from-yellow-100 to-amber-100 p-8 rounded-2xl border-4 border-amber-900 shadow-xl"
      >
        <h3 className="text-3xl font-black text-amber-900 mb-4 text-center">
          Why Trust Matters
        </h3>
        <p className="text-lg text-amber-800 text-center max-w-3xl mx-auto">
          In an era where AI can generate convincing fake content in seconds, 
          having a reliable verification tool isn't just helpful — it's essential. 
          Our advanced algorithms analyze text patterns, image metadata, and content 
          authenticity markers to give you peace of mind.
        </p>
      </motion.div>
    </div>
  );
}
